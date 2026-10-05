# Dependency security

Last reviewed: 2026-10-05

## Current status

- Raw `npm audit --omit=dev --json`: 10 high-severity package records.
- Raw `npm audit --json`: 13 high-severity package records.
- Applicable Critical/High findings after the checked policy: zero.
- `GHSA-qhr7-859c-m2p7` and `GHSA-6j4f-fj2g-mc7p` are fixed by the narrow
  `minimatch@10.2.6 > brace-expansion@5.0.12` override.
- Every remaining raw record resolves to one root advisory,
  `GHSA-vfj7-8cjw-p6xm`, in `braces@3.0.3`. GitHub's advisory currently lists
  no patched version.

`GHSA-vfj7-8cjw-p6xm` requires an attacker-controlled deeply nested glob
expression. The package is reached only through Sanity CLI/codegen, Tailwind
and lint/build tooling, all of which receive repository-controlled patterns.
No application code imports the affected packages. The checked Next.js build
contains none of the affected modules in its runtime NFT traces and none of the
affected implementation markers in server or browser JavaScript. It is
therefore classified `NOT_APPLICABLE`, not downgraded or suppressed.

The classification is fail closed in `scripts/audit-dependencies.mjs`: a
registry/audit error, invalid audit schema, Moderate-or-higher unreviewed
advisory, severity change, directness change, production-tree change, node-path
change, normalized dependency-graph change, installed `braces` version change,
new registry release/clean fix, runtime trace, bundle marker, missing build or
stale policy fails CI. A production-only finding that appears between the two
audit calls also fails closed. The full
raw audit documents and their summary counts remain in the uploaded JSON.

## Upgrade baseline

The application was upgraded one framework major at a time:

- Next.js 14 to the current Next.js 15 maintenance release
- React 18 to React 19
- Sanity 3 to Sanity 4
- ESLint 8 to ESLint 9 with the ESLint CLI and flat configuration

The original lockfile reported 166 total vulnerabilities and 145 in the
production dependency tree, including two critical findings.

## Temporary overrides

The `overrides` in `package.json` pin patched transitive dependencies that their
parents have not yet adopted. Remove an override only after the parent package
resolves to an equal or newer safe version and the checks below still pass.

- Sanity CLI: patched `adm-zip`, `ejs`, `uuid`, `rimraf`, `glob`,
  `readdir-glob`, and archive utilities
- Vercel tooling: patched `js-yaml`
- Application build: patched `postcss` and `sharp`
- ESLint TypeScript parser: patched `brace-expansion` only under
  `minimatch@10.2.6`; safe `brace-expansion@1.1.21` branches are unchanged

## Verification

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run audit:security -- --output=dependency-audit-result.json
npx --no-install sanity --version
```

The archive-related overrides also require an archive-generation smoke test
before they are changed or removed.
