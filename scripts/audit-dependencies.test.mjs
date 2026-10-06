import { describe, expect, it } from "vitest";
import { advisoryRoots, classifyAudit, productionOnlyFindings, validateAuditReport } from "./audit-dependencies.mjs";

const policy = {
  exceptions: [{
    advisoryId: "GHSA-vfj7-8cjw-p6xm",
    package: "braces",
    severity: "high",
    affectedRange: "<=3.0.3"
  }],
  expectedFindings: {
    braces: { severity: "high", direct: false, productionTree: true, nodes: ["node_modules/braces"] },
    micromatch: { severity: "high", direct: false, productionTree: true, nodes: ["node_modules/micromatch"] }
  }
};

const audit = {
  vulnerabilities: {
    braces: {
      severity: "high",
      isDirect: false,
      nodes: ["node_modules/braces"],
      via: [{
        source: 1,
        name: "braces",
        severity: "high",
        title: "stack exhaustion",
        url: "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm",
        range: "<=3.0.3"
      }]
    },
    micromatch: {
      severity: "high",
      isDirect: false,
      nodes: ["node_modules/micromatch"],
      via: ["braces"]
    }
  }
};

describe("dependency audit classification", () => {
  it("resolves a transitive finding to its root advisory", () => {
    expect(advisoryRoots(audit.vulnerabilities, "micromatch")).toEqual([
      expect.objectContaining({ advisoryId: "GHSA-VFJ7-8CJW-P6XM", package: "braces" })
    ]);
  });

  it("accepts only an explicitly reviewed advisory and affected package", () => {
    const result = classifyAudit(audit, policy, new Set(["braces", "micromatch"]));
    expect(result.unresolved).toHaveLength(0);
    expect(result.classifications).toHaveLength(2);
  });

  it("accepts multiple independently reviewed root advisories", () => {
    const expandedPolicy = structuredClone(policy);
    expandedPolicy.exceptions.push({
      advisoryId: "GHSA-hp3w-g68c-fv3c",
      package: "sprintf-js",
      severity: "moderate",
      affectedRange: "<=1.1.3"
    });
    expandedPolicy.expectedFindings["sprintf-js"] = {
      severity: "moderate",
      direct: false,
      productionTree: true,
      nodes: ["node_modules/sprintf-js"]
    };
    const expandedAudit = structuredClone(audit);
    expandedAudit.vulnerabilities["sprintf-js"] = {
      severity: "moderate",
      isDirect: false,
      nodes: ["node_modules/sprintf-js"],
      via: [{
        source: 2,
        name: "sprintf-js",
        severity: "moderate",
        title: "unbounded precision",
        url: "https://github.com/advisories/GHSA-hp3w-g68c-fv3c",
        range: "<=1.1.3"
      }]
    };
    expect(classifyAudit(
      expandedAudit,
      expandedPolicy,
      new Set(["braces", "micromatch", "sprintf-js"])
    ).unresolved).toHaveLength(0);
  });

  it("fails closed for an unreviewed advisory", () => {
    const changed = structuredClone(audit);
    changed.vulnerabilities.braces.via[0].url = "https://github.com/advisories/GHSA-xxxx-yyyy-zzzz";
    const result = classifyAudit(changed, policy, new Set());
    expect(result.unresolved.map(record => record.package)).toEqual(["braces", "micromatch"]);
  });

  it.each([
    ["severity", changed => { changed.vulnerabilities.braces.severity = "critical"; }],
    ["direct exposure", changed => { changed.vulnerabilities.braces.isDirect = true; }],
    ["dependency node", changed => { changed.vulnerabilities.braces.nodes.push("node_modules/new/braces"); }]
  ])("fails closed when reviewed %s changes", (_label, mutate) => {
    const changed = structuredClone(audit);
    mutate(changed);
    expect(classifyAudit(changed, policy, new Set(["braces", "micromatch"])).unresolved.length).toBeGreaterThan(0);
  });

  it("fails closed for a moderate advisory", () => {
    const changed = structuredClone(audit);
    changed.vulnerabilities.braces.severity = "moderate";
    changed.vulnerabilities.braces.via[0].severity = "moderate";
    expect(classifyAudit(changed, policy, new Set(["braces", "micromatch"])).unresolved).toHaveLength(2);
  });

  it("rejects incomplete audit output", () => {
    expect(() => validateAuditReport({ vulnerabilities: {} })).toThrow(/incomplete|unsupported/);
  });

  it("detects actionable findings that appear only in the production report", () => {
    const production = structuredClone(audit);
    production.vulnerabilities.runtimeOnly = {
      severity: "critical", isDirect: true, nodes: ["node_modules/runtime-only"], via: []
    };
    expect(productionOnlyFindings(audit, production)).toEqual([
      { package: "runtimeOnly", severity: "critical", nodes: ["node_modules/runtime-only"] }
    ]);
  });
});
