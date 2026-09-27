# NovaLure V2 QA report

Audit date: 2026-09-27.

## Automated checks

- Clean install: PASS (`npm ci`, 0 vulnerabilities; system CA trust required on this Windows host)
- TypeScript: PASS (`tsc --noEmit`)
- ESLint: PASS (`eslint .`)
- Unit/component tests: PASS (17 files, 198 tests)
- Production build: PASS (60 static pages generated)
- Vercel cloud build: PASS
- Route smoke test: PASS (33/33 DE/EN/ES core routes returned HTTP 200)
- Preview response: PASS (HTTP 200 through Vercel deployment protection)

No live contact, Playbook or booking submission was sent during QA, so no real customer email or CRM side effect was created. Existing route tests cover validation, rate limiting, double opt-in and Resend state handling.

## Visual and interaction QA

- Checked homepage at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px viewport widths
- No horizontal page overflow detected
- Mobile hero heading remains within the viewport and primary CTA is above the fold at 390×844
- Fullscreen menu opens, locks document scrolling and closes with Escape
- Desktop and mobile browser console: no errors or warnings
- Screenshots: `docs/screenshots/v2/`

## Content and security checks

- Franz image imports, paths and alt text: none
- Franz portrait/media assets: removed from V2 branch
- SERHANT. runtime source/assets: none
- Suspicious API-key/token patterns in changed source and documentation: none
- Real lead/customer data in pipeline demonstration: none; demo labelling is visible
- Evelyn status: `INTERNAL OPERATING SYSTEM · TECHNOLOGY PREVIEW`
- CRM positioning: operated service, with demo and public system example kept distinct from CRM login

## Lighthouse measurement

Measured against the local optimized production build with Lighthouse on 2026-09-27:

- Performance: 87
- Accessibility: 97
- Best Practices: 100
- SEO: 92
- First Contentful Paint: 2.0s
- Largest Contentful Paint: 3.0s
- Total Blocking Time: 200ms
- Cumulative Layout Shift: 0

The requested Performance ≥90, SEO ≥95 and LCP <2.5s targets are not yet met in this local Lighthouse run. These are recorded as open optimization items rather than claimed as achieved. INP is not produced by a synthetic Lighthouse lab run and therefore is not claimed.

## Deployment state

- Preview: `https://novalure-website-95z0rinkv-novalure.vercel.app`
- Deployment ID: `dpl_Fspo8bAh3HRCEoudMSdNKvp45boz`
- Deployment state: READY
- Deployment target: preview
- Preview indexing: disabled by Vercel (`X-Robots-Tag: noindex`)
- Production SHA after preview deployment: `e3b7d1ed7e014c06e5858883b4c655f150cee41e`
- Production: UNCHANGED
- Merge: NOT MERGED
