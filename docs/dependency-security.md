# Dependency security

Last reviewed: 2026-07-30

## Current status

- `npm audit --omit=dev`: 0 vulnerabilities
- `npm audit`: 16 high-severity findings, all confined to the ESLint development toolchain through legacy `minimatch`/`brace-expansion` ranges
- Production build, TypeScript, ESLint, Sanity CLI, archive generation, and route smoke tests pass

The remaining development-only findings have no compatible upstream fix at the
time of this review. ESLint 10 removes its own vulnerable range, but the current
Next.js ESLint plugins do not yet support ESLint 10 and fail at runtime. Recheck
these findings whenever `eslint-config-next` and its plugins add ESLint 10
support.

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
