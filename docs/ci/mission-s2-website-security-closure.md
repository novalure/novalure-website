# Mission S2 website security closure

Status: `LOCAL_PASS / EXACT_SHA_GITHUB_CI_PENDING`

## Immutable starting point

- Repository: `novalure/novalure-website`
- Mission-R PR: `#19`
- Base/head: `main@e3b7d1ed7e014c06e5858883b4c655f150cee41e` /
  `codex/mission-r-critical-ci@f547c08e01ae156835bc576c24a9d5f9d41a55dc`
- Initial audit: 14 High overall, 11 High in npm's production tree, zero
  Critical; functional GitHub Actions stages passed and the audit failed.

## Remediation

The patchable `brace-expansion` advisories are closed with a narrow override
from `minimatch@10.2.6` to `brace-expansion@5.0.12`. Other already-safe
`brace-expansion@1.1.21` paths are not forced across a major version.

The remaining npm package records all resolve to
`GHSA-vfj7-8cjw-p6xm` in `braces@3.0.3`. The authoritative GitHub advisory has
no patched version. The exploit requires an attacker-controlled deeply nested
glob expression. In this repository the dependency paths are limited to
Sanity CLI/codegen, Tailwind and lint/build tooling with repository-controlled
patterns. Application source does not import the affected modules.

The security gate preserves both complete raw npm results and proves non-applicability on
every run after the production build. It fails if:

- either npm audit call fails or returns an incomplete/unknown schema;
- any Moderate/Critical/High resolves to an unreviewed advisory;
- advisory severity/range, directness, production exposure, node paths, the
  normalized dependency graph, affected package set or installed root version changes;
- an actionable finding appears only in the production audit or npm publishes
  a newer root-package release requiring renewed review;
- an affected module enters a Next.js server runtime trace; or
- a vulnerable implementation marker enters a server/browser bundle.

The checked policy is in `config/dependency-audit-policy.json`; CI uploads the
complete machine-readable result for the exact expected SHA. This is an
evidence-bound `NOT_APPLICABLE` classification, not a severity downgrade or
audit-threshold reduction.

## CI security

Both website workflows use read-only `contents` permission. Official checkout,
Node setup and artifact actions are pinned to immutable commit SHAs. The
Playwright container is pinned to its immutable manifest digest. The
Quality workflow checks out and verifies the exact event SHA. It does not use
`pull_request_target`, execute with secrets, or grant write permissions.

## Local verification

- Vitest: 18 files, 206 tests passed.
- ESLint, TypeScript, 45-page Next.js build, 9 playbooks and 33 managed-service
  pages passed.
- Browser/Axe: `/en`, `/de` and `/es` at 1440 px and 390 px returned 200, one
  H1, two forms, no console error, no viewport overflow and no Serious/Critical
  violation. The mobile board focus ring resolves to the dark navy 3 px style.
- Security gate: raw 13 High overall / 10 High production records; applicable
  Critical, High and Moderate findings are all zero.

## Boundaries

No customer data, real form submission, customer outbound, Production
deployment, Production configuration change, paid commitment, permission
expansion, merge or Canary activation is part of S2.
