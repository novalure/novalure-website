# Novalure transformation audit — 9 October 2026

## Decision summary

NovaLure should be positioned as a managed digital real-estate marketing partner, not as a CRM vendor, general web-design shop, or AI chatbot provider. The customer proposition is: **NovaLure coordinates digital property marketing from strategy and project presentation through advertising, enquiry handling and continuous optimisation.**

The public CRM product pitch should be retired. `novalure-crm.app` should be an internal, authorised-user entry point; the CRM remains the operational layer behind the service rather than a product sold on the website.

## Evidence reviewed

- The attached checkout is `novalure/novalure-website` on branch `codex/novalure-2027-editorial-concept`. It contains the customer site, its content, forms, consent handling, tracking placeholders and public CRM link.
- The public GitHub organisation currently exposes four repositories: `novalure-website`, `novalure-crm`, `wohnungsfinder-feldweg-499c`, and `kilkenny-sme-redesign-lab`. No public `evelyn` repository was discoverable. Its source and any private integrations therefore cannot be treated as verified.
- A read-only audit checkout of `novalure-crm` was examined. It contains an authentication flow, password reset, MFA, role and tenant-isolation code, database repositories, CRM workspace UI, tests, and migration tooling. That establishes implementation evidence only; it does not verify production configuration, live integrations, or operational readiness.
- The live public sites were reviewed on 9 October 2026. novalure.eu exposed CRM login in both desktop and mobile navigation. novalure-crm.app exposed a public CRM sales/audit/preview landing page.

## Capability matrix

| Capability | Evidence | Status | Publication rule |
| --- | --- | --- | --- |
| Website contact and playbook collection | Website API routes, Resend/HubSpot configuration and automated tests | Implemented; live configuration not verified | Keep only after consent, deliverability and destination testing |
| CRM login, password reset and MFA | CRM authentication routes and UI | Implemented; production configuration not verified | Internal access only |
| Tenant isolation, roles and protected CRM data | CRM tenant/auth modules and dedicated test scripts | Implemented; production verification pending | Never describe as production-proven before live test evidence |
| Lead, contact, pipeline, task, calendar and reporting screens | CRM components and repositories | Implemented; operational use not verified | Internal capability, not public product copy |
| Microsoft/Google calendar connections | Integration modules present | Partially implemented; credentials and E2E operation unverified | Do not advertise as active integration |
| Resend email | Website and CRM integration code present | Partially implemented; sender/domain/production delivery unverified | Do not promise automated communication until tested |
| Google Ads / Meta Ads operations | Website copy and tracking placeholders only | Not technically evidenced from checked code | Describe only as a scoped service after account-access process and operating runbook are approved |
| Evelyn orchestration and departments | References in CRM source; no accessible Evelyn repository | Unverified | No public claims beyond “specialist teams” until verified |
| Public CRM marketing and external self-service | Live CRM marketing landing, public preview and audit CTA | Present; conflicts with target position | Remove public sales entry before launch |

## Website audit

### Correct direction already present

- The current site distinguishes developers from agents and presents an operated-service model.
- It labels CRM pipeline examples as demonstrations rather than customer data.
- The website has localised routes, metadata, sitemap, robots configuration, consent controls and legal pages.

### Correct before public launch

1. CRM login was in the customer header and mobile menu. It has been removed; the link now belongs only in the footer as **Mitarbeiter-Login / Staff Login / Acceso para el personal**.
2. The homepage still leads primarily with a lead-system narrative. Rework the content hierarchy around the managed service: strategy → project presentation → owned ad accounts → campaign management → enquiry handling → sales handover → reporting and improvement.
3. Add an explicit ad-account trust statement to the developer service page: customers retain their accounts and pay Google/Meta directly; NovaLure receives the agreed partner or agency access. Confirm the contractual wording before publishing.
4. Separate developer and agent scopes more clearly. Developers need project positioning, presentation, launch and buyer flow; agents need seller and buyer demand, qualification, appointments and recurring follow-up.
5. Do not publish performance outcomes, named references, testimonials, AI automation levels, team size, service availability or integration claims unless written permission and production evidence are on file.
6. The legal content is more complete than a placeholder, but counsel must validate controller details, cookies, actual processor list, Irish/Austrian applicability, tracking configuration and advertising-account agreements.

## CRM audit

The CRM codebase should not receive authentication, RLS, role, secret, migration or production-access changes for this repositioning. The required safe change is presentation-only:

- `/` sends unauthenticated visitors to `/login`.
- `/login` is labelled **Mitarbeiter-Login / Staff Login** and states that it is internal access for authorised users.
- The public audit, preview and product-scope calls to action are removed from the root entry flow.
- Existing login, reset-password, MFA, session, role and workspace logic remains intact.

Public booking/form paths may support customer project operations. Do not disable them globally without mapping each live dependency and obtaining an operational owner’s approval.

## Recommended information architecture

### Main navigation

1. Bauträger / Developers
2. Makler / Agents
3. Leistungen / Services
4. Arbeitsweise / How it works
5. Insights or Playbook (only if the delivery and consent flow is production-approved)
6. Qualifiziertes Erstgespräch / Request a consultation

The footer contains legal links, language links and the discreet employee login only.

### Homepage message hierarchy

1. **Hero:** “Digitale Immobilienvermarktung, die Marketing und Vertrieb verbindet.”
2. **Audience:** dedicated paths for developers and agents.
3. **Service system:** strategy, project presentation, Google and Meta advertising, enquiry management, sales support, reporting.
4. **How NovaLure works:** specialised functions coordinated around one property mandate.
5. **Trust:** customer-owned advertising accounts, direct platform billing, no volume or closing guarantees, transparent reporting.
6. **Continuous optimisation:** market signals and campaign performance inform ongoing adjustments.
7. **Qualified enquiry:** a gated CTA enabled only after operational release.

## Competitive landscape and useful patterns

The following public competitors were checked for positioning patterns; their result claims are their own and are not benchmarks for NovaLure.

| Competitor | Observable strength | Relevant lesson |
| --- | --- | --- |
| [Space & Time](https://spaceandtime.co.uk/property-marketing) | Full property-media and data-transformation framing | Connect marketing activity to commercial decision-making |
| [Tall Zebra](https://tallzebra.co.uk/) | Development marketing from launch preparation through direct enquiries | Make the developer journey easy to understand |
| [Colonnade](https://colonnadestudio.com/google-ads/property-development) | Search campaigns paired with dedicated landing pages and end-to-end tracking | Explain the ad-to-enquiry system, not just ads |
| [Dynamically](https://dynamically.co.uk/sectors/property-developers) | Developer lifecycle marketing | Separate launch, demand generation and ongoing support |
| [The Marketing Mavericks](https://marketingmavericks.co.uk/google-ads/real-estate-developers-london/) | High-intent paid-search specialism | Be specific about keyword, conversion and optimisation work |
| [Proptell](https://www.proptell.com/) | 360-degree communication for developers and brokers | Lead with real-estate specialisation, not generic digital services |
| [ADACITY](https://adacity.ro/en) | Brand, campaigns, website and automation as one sales path | NovaLure can differentiate with managed operations and account transparency |
| [Pixel Property](https://pixelproperty.co/) | Accessible campaign packaging for agents, landlords and developers | Use clear scope and a low-friction next step |
| [Google Ads for Agents](https://googleadsforagents.com/) | Narrow estate-agent valuation lead positioning | Give agent services their own seller-acquisition narrative |
| [Pro Reel Estate](https://proreelestate.com/) | Video, paid media and social content for premium agencies | Show strong visual craft without relying on unsupported performance claims |

## Go-live gates

Do not activate a customer-acquisition funnel for the full managed-service promise until all applicable gates are approved:

- Legal entity, contact, privacy, cookie and processor information checked by counsel.
- Google and Meta operating runbook approved: customer account ownership, direct payment, access roles, consent/tracking and reporting responsibilities.
- At least one representative developer and agent workflow tested end-to-end from enquiry to documented handover and reporting.
- CRM authentication, MFA, tenant isolation, reset flow and audit logging verified in a protected production-like environment.
- Every public claim, reference, logo, testimonial and metric has a written evidence/approval record.
- Form delivery, email deliverability, booking, consent withdrawal, analytics consent and incident ownership tested.
- SEO metadata, canonical/hreflang/sitemap, mobile navigation, keyboard access and production build verified.

## Implementation record

### Website checkout

- Removed CRM login from desktop and mobile customer navigation.
- Added footer-only staff-login labels in DE, EN and ES.
- Updated the navigation test to enforce the new rule.

### CRM checkout

- Unauthenticated root requests redirect to the existing login route.
- Login presentation now uses internal-staff wording and removes public audit/overview sales links.
- Authentication, password reset, MFA, session, roles, tenant separation and database code were not changed.

### Verification completed

- Website TypeScript check: passed.
- Website tests: 220 passed.
- CRM TypeScript check: passed.

The website production build passed with Node's system certificate trust enabled. The normal build initially failed while downloading remote fonts because the Node process could not verify the local certificate chain.
