# Mission R critical CI evidence draft

Status: `FUNCTIONAL_CHECKS_PASS / DEPENDENCY_AUDIT_FAIL / DRAFT_PR_REQUIRED`

## Immutable starting point

- Repository: `novalure/novalure-website`
- Default branch: `main`
- Observed default SHA: `e3b7d1ed7e014c06e5858883b4c655f150cee41e`
- Workflow files at that SHA: `.github/workflows/quality.yml` and
  `.github/workflows/playbook-form-ui.yml`
- Applicable run at that exact SHA: none observed through the authenticated
  read-only GitHub Actions inventory on 2026-10-04

The most recent Quality run observed before this change was feature-branch run
`36340845843` at SHA `e2e81b26a209dd927d25d1727ab0657e07453822`.
It failed the managed-service verification step and is not evidence about the
default SHA.

## No-cost normalization

The Quality workflow now runs on pushes to `main`, on pull requests and by
manual dispatch. Pull-request runs check out the immutable pull-request head;
push/manual runs check out `github.sha`. A separate step fails if the checked
out revision does not equal that expected SHA.

The workflow executes install, Playbook verification, tests, lint, typecheck,
production build, managed-service verification and both all-dependency and
production-dependency audits. Both audits are executed before the step returns
failure, so one failing audit cannot hide the other result.

## Local evidence

Executed on the isolated `codex/mission-r-critical-ci` branch:

- `npm ci --no-audit --no-fund`: PASS
- `npm run verify:playbooks`: PASS, 9 Playbook assets
- `npm test`: PASS, 17 files / 198 tests
- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS, Next.js 15.5.24
- `npm run verify:managed-service`: PASS, 33 pages / 9 PDFs
- `npm audit --audit-level=moderate`: FAIL, 14 high findings
- `npm audit --omit=dev --audit-level=moderate`: FAIL, 11 high findings

The compatible lockfile refresh removed the other observed findings. The
remaining `braces` family findings require breaking major upgrades according to
npm, so they remain an explicit blocker. No threshold was lowered and no pass
is claimed.

## Boundaries

No deployment, Production/Canary action, customer data, customer outbound,
permission expansion, paid commitment or branch-protection bypass is part of
this change.
