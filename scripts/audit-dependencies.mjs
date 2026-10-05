import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const policyPath = join(root, "config", "dependency-audit-policy.json");
const lockPath = join(root, "package-lock.json");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function parseJsonOutput(output, label) {
  const start = output.indexOf("{");
  if (start === -1) throw new Error(`${label} did not return JSON`);
  return JSON.parse(output.slice(start));
}

function runAudit(omitDev) {
  const args = ["audit"];
  if (omitDev) args.push("--omit=dev");
  args.push("--json");
  const result = spawnSync(npmCommand, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024
  });
  if (result.error) throw result.error;
  if (!result.stdout.trim()) {
    throw new Error(`npm audit returned no JSON: ${result.stderr.trim()}`);
  }
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(`npm ${args.join(" ")} failed with status ${result.status}: ${result.stderr.trim()}`);
  }
  return validateAuditReport(parseJsonOutput(result.stdout, `npm ${args.join(" ")}`), `npm ${args.join(" ")}`);
}

export function validateAuditReport(audit, label = "npm audit") {
  if (audit?.auditReportVersion !== 2 || !audit.vulnerabilities || typeof audit.vulnerabilities !== "object") {
    throw new Error(`${label} returned an unsupported or incomplete audit report`);
  }
  if (!audit.metadata?.vulnerabilities || typeof audit.metadata.vulnerabilities.total !== "number") {
    throw new Error(`${label} returned incomplete vulnerability metadata`);
  }
  return audit;
}

export function advisoryRoots(vulnerabilities, packageName, seen = new Set()) {
  if (seen.has(packageName)) return [];
  seen.add(packageName);
  const record = vulnerabilities[packageName];
  if (!record) return [];
  const roots = [];
  for (const via of record.via ?? []) {
    if (typeof via === "string") {
      roots.push(...advisoryRoots(vulnerabilities, via, seen));
      continue;
    }
    const advisoryId = via.url?.match(/GHSA-[\w-]+/i)?.[0]?.toUpperCase();
    roots.push({
      advisoryId: advisoryId ?? `NPM-${via.source}`,
      source: via.source,
      package: via.name,
      severity: via.severity,
      title: via.title,
      url: via.url,
      range: via.range
    });
  }
  return roots;
}

function actionableEntries(audit) {
  return Object.entries(audit.vulnerabilities ?? {}).filter(([, finding]) =>
    finding.severity === "critical" || finding.severity === "high" || finding.severity === "moderate"
  );
}

function sameValues(actual = [], expected = []) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function walkFiles(directory, predicate, files = []) {
  if (!existsSync(directory)) return files;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(path, predicate, files);
    else if (predicate(path)) files.push(path);
  }
  return files;
}

function normalizeTracePath(path) {
  return path.split(sep).join("/");
}

function verifyArtifact(policy) {
  const exception = policy.exceptions[0];
  const buildDirectory = join(root, exception.artifactProof.requiredBuildDirectory);
  if (!existsSync(buildDirectory) || !statSync(buildDirectory).isDirectory()) {
    throw new Error("Production build proof is missing; run npm run build before the audit");
  }

  const traceFiles = walkFiles(buildDirectory, path => path.endsWith(".nft.json"));
  if (traceFiles.length === 0) throw new Error("No Next.js NFT runtime traces were produced");

  const forbiddenPackages = exception.artifactProof.forbiddenTracePackages;
  const traceMatches = [];
  for (const traceFile of traceFiles) {
    const trace = JSON.parse(readFileSync(traceFile, "utf8"));
    for (const file of trace.files ?? []) {
      const normalized = normalizeTracePath(file);
      for (const packageName of forbiddenPackages) {
        if (normalized.includes(`/node_modules/${packageName}/`) || normalized.startsWith(`node_modules/${packageName}/`)) {
          traceMatches.push({ trace: relative(root, traceFile), file, package: packageName });
        }
      }
    }
  }
  if (traceMatches.length > 0) {
    throw new Error(`Vulnerable tooling entered a runtime trace: ${JSON.stringify(traceMatches)}`);
  }

  const bundleFiles = [
    ...walkFiles(join(buildDirectory, "server"), path => path.endsWith(".js")),
    ...walkFiles(join(buildDirectory, "static"), path => path.endsWith(".js"))
  ];
  const bundleMatches = [];
  for (const bundleFile of bundleFiles) {
    const source = readFileSync(bundleFile, "utf8");
    for (const marker of exception.artifactProof.forbiddenBundleMarkers) {
      if (source.includes(marker)) bundleMatches.push({ file: relative(root, bundleFile), marker });
    }
  }
  if (bundleMatches.length > 0) {
    throw new Error(`Vulnerable braces implementation marker entered a bundle: ${JSON.stringify(bundleMatches)}`);
  }

  return {
    buildDirectory: relative(root, buildDirectory),
    runtimeTraceFilesChecked: traceFiles.length,
    bundleFilesChecked: bundleFiles.length,
    forbiddenTraceMatches: 0,
    forbiddenBundleMarkerMatches: 0
  };
}

export function classifyAudit(audit, policy, productionPackages = new Set()) {
  const allowed = new Map(policy.exceptions.map(exception => [exception.advisoryId.toUpperCase(), exception]));
  const classifications = [];
  const unresolved = [];

  for (const [packageName, finding] of actionableEntries(audit)) {
    const roots = advisoryRoots(audit.vulnerabilities, packageName);
    const uniqueRoots = [...new Map(roots.map(rootFinding => [rootFinding.advisoryId, rootFinding])).values()];
    const applicableExceptions = uniqueRoots.map(rootFinding => allowed.get(rootFinding.advisoryId));
    const isReviewed = uniqueRoots.length > 0 && applicableExceptions.every(Boolean);
    const expected = policy.expectedFindings?.[packageName];
    const rootMatchesPolicy = isReviewed && uniqueRoots.every((rootFinding, index) => {
      const exception = applicableExceptions[index];
      return rootFinding.package === exception.package &&
        rootFinding.severity === exception.severity &&
        rootFinding.range === exception.affectedRange;
    });
    const findingMatchesPolicy = Boolean(expected) &&
      finding.severity === expected.severity &&
      finding.isDirect === expected.direct &&
      productionPackages.has(packageName) === expected.productionTree &&
      sameValues(finding.nodes, expected.nodes);
    const classification = {
      package: packageName,
      installedVersion: finding.nodes?.[0]
        ? null
        : null,
      severity: finding.severity,
      direct: finding.isDirect,
      productionTree: productionPackages.has(packageName),
      nodes: finding.nodes ?? [],
      advisoryRoots: uniqueRoots,
      classification: rootMatchesPolicy && findingMatchesPolicy ? "NOT_APPLICABLE" : "UNRESOLVED"
    };
    classifications.push(classification);
    if (classification.classification === "UNRESOLVED") unresolved.push(classification);
  }
  return { classifications, unresolved };
}

function verifyDependencyGraph(exception) {
  const sha256 = createHash("sha256").update(readFileSync(lockPath)).digest("hex");
  if (sha256 !== exception.dependencyGraphSha256) {
    throw new Error(`Reviewed dependency graph changed: expected ${exception.dependencyGraphSha256}, found ${sha256}`);
  }
  return { package: exception.package, source: relative(root, lockPath), sha256 };
}

function verifyPatchAvailability(exception, audit) {
  const result = spawnSync(npmCommand, ["view", exception.package, "version", "--json"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
  if (result.error) throw result.error;
  if (result.status !== 0 || !result.stdout.trim()) {
    throw new Error(`npm view ${exception.package} version failed: ${result.stderr.trim()}`);
  }
  const latestVersion = JSON.parse(result.stdout);
  if (latestVersion !== exception.installedVersion || audit.vulnerabilities?.[exception.package]?.fixAvailable === true) {
    throw new Error(`Reviewed exception is stale; ${exception.package} has a clean upgrade candidate (${latestVersion})`);
  }
  return { package: exception.package, latestRegistryVersion: latestVersion, patchedVersionAvailable: false };
}

export function productionOnlyFindings(allAudit, productionAudit) {
  const allNames = new Set(actionableEntries(allAudit).map(([name]) => name));
  return actionableEntries(productionAudit)
    .filter(([name]) => !allNames.has(name))
    .map(([name, finding]) => ({ package: name, severity: finding.severity, nodes: finding.nodes ?? [] }));
}

function packageVersion(lock, packageName) {
  return lock.packages?.[`node_modules/${packageName}`]?.version ?? "UNKNOWN";
}

function main() {
  const policy = JSON.parse(readFileSync(policyPath, "utf8"));
  if (policy.exceptions.length !== 1) throw new Error("Dependency policy must contain exactly one reviewed exception");
  const exception = policy.exceptions[0];
  if (exception.advisoryId.toUpperCase() !== "GHSA-VFJ7-8CJW-P6XM" || exception.firstPatchedVersion !== null) {
    throw new Error("Unexpected dependency exception; an independent policy review is required");
  }

  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  const installedRootVersion = packageVersion(lock, exception.package);
  if (installedRootVersion !== exception.installedVersion) {
    throw new Error(`Reviewed ${exception.package} version ${exception.installedVersion}, found ${installedRootVersion}`);
  }

  const allAudit = runAudit(false);
  const productionAudit = runAudit(true);
  const productionPackages = new Set(actionableEntries(productionAudit).map(([name]) => name));
  const { classifications, unresolved } = classifyAudit(allAudit, policy, productionPackages);
  const gateErrors = [];
  const productionOnly = productionOnlyFindings(allAudit, productionAudit);
  if (productionOnly.length > 0) gateErrors.push(`Production-only actionable findings: ${JSON.stringify(productionOnly)}`);
  const actualFindingNames = classifications.map(record => record.package).sort();
  const expectedFindingNames = Object.keys(policy.expectedFindings ?? {}).sort();
  if (!sameValues(actualFindingNames, expectedFindingNames)) {
    gateErrors.push(`Reviewed finding set changed: expected ${expectedFindingNames.join(", ")}, found ${actualFindingNames.join(", ")}`);
  }
  for (const record of classifications) record.installedVersion = packageVersion(lock, record.package);

  let artifactProof = null;
  let dependencyGraphProof = null;
  let patchAvailabilityProof = null;
  try { artifactProof = verifyArtifact(policy); }
  catch (error) { gateErrors.push(error.message); }
  try { dependencyGraphProof = verifyDependencyGraph(exception); }
  catch (error) { gateErrors.push(error.message); }
  try { patchAvailabilityProof = verifyPatchAvailability(exception, allAudit); }
  catch (error) { gateErrors.push(error.message); }
  const rawAll = allAudit.metadata?.vulnerabilities ?? {};
  const rawProduction = productionAudit.metadata?.vulnerabilities ?? {};
  const result = {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    policy: relative(root, policyPath),
    raw: { all: allAudit, production: productionAudit },
    rawCounts: { all: rawAll, production: rawProduction },
    applicable: {
      critical: unresolved.filter(record => record.severity === "critical").length,
      high: unresolved.filter(record => record.severity === "high").length,
      moderate: unresolved.filter(record => record.severity === "moderate").length
    },
    classifications,
    productionOnlyFindings: productionOnly,
    dependencyGraphProof,
    patchAvailabilityProof,
    artifactProof,
    gateErrors,
    status: unresolved.length === 0 && gateErrors.length === 0 ? "PASS" : "FAIL"
  };

  const outputArgument = process.argv.find(argument => argument.startsWith("--output="));
  if (outputArgument) {
    const outputPath = resolve(root, outputArgument.slice("--output=".length));
    writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (unresolved.length > 0 || gateErrors.length > 0) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) main();
