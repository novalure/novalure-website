# Dependency security

Last reviewed: 2026-10-04

## Current status

- `npm audit --omit=dev --audit-level=moderate`: 11 high-severity findings
- `npm audit --audit-level=moderate`: 14 high-severity findings
- The remaining findings are in the `braces` dependency family reached through
  Sanity, Tailwind and lint/build tooling. npm reports no compatible patched
  `braces` release; its suggested remediation requires breaking major upgrades.
- The locked dependency tree has received all compatible `npm audit fix`
  updates. Production build, TypeScript, ESLint, 198 tests, Playbook asset
  verification, and managed-service route verification pass.

The remaining findings do not have a non-breaking upstream remediation at the
time of this review. They must not be waived or hidden by lowering the audit
threshold. Recheck them when compatible Sanity, Tailwind, Next.js and lint
tooling upgrades are available, and exercise the full build/test suite for any
major-version remediation.

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

## Verification

Run:

```bash
npm ci
npm audit --omit=dev
npm run lint
npm run typecheck
npm run build
npx --no-install sanity --version
```

The archive-related overrides also require an archive-generation smoke test
before they are changed or removed.
