# Novalure Website

Premium bilingual Next.js website for Novalure, positioned as a PropTech Sales System for real estate developers and agents.

The primary conversion is Playbook download. The secondary conversion is a Private Growth Audit through a HubSpot Meeting Scheduler placeholder.

## Included

- Next.js App Router with TypeScript
- Tailwind CSS foundation plus production CSS system
- Framer Motion abstract lead-pipeline hero visual
- English and German localized routes
- Sticky desktop and mobile navigation
- Playbook-first CTA flow
- Homepage System, Process and Team anchor sections
- Audience pages for Developers and Agents
- Playbook hub with Developer and Agent HubSpot form placeholders
- Contact page with HubSpot Meeting Scheduler placeholder
- Legal placeholder pages requiring legal review
- Loading, error, success and custom 404 states
- Cookie consent prepared for Consent Mode v2
- Tracking placeholders for GA4, GTM, Meta Pixel, LinkedIn Insight and HubSpot Tracking Code
- SEO metadata, hreflang, canonical URLs, sitemap, robots, Open Graph and Twitter/X card metadata
- Organization, WebSite, BreadcrumbList and FAQPage schema
- Sanity Studio route at `/studio`
- Vercel deployment configuration

## Routes

English:

- `/en`
- `/en/developers`
- `/en/agents`
- `/en/playbooks`
- `/en/contact`
- `/en/legal/imprint`
- `/en/legal/privacy`
- `/en/legal/cookies`

German:

- `/de`
- `/de/bautraeger`
- `/de/makler`
- `/de/playbooks`
- `/de/kontakt`
- `/de/rechtliches/impressum`
- `/de/rechtliches/datenschutz`
- `/de/rechtliches/cookies`

Root `/` redirects to German for AT, DE, CH and LI where geo data is available, otherwise English. Manual EN/DE switching remains visible.

Process and Team are not separate pages. They are homepage sections:

- `/en#process`
- `/de#prozess`
- `/en#team`
- `/de#team`

## Local Setup

```bash
npm install
npm run dev
```

If PowerShell blocks npm scripts, use:

```powershell
npm.cmd run dev
```

Open:

- `http://localhost:3000/en`
- `http://localhost:3000/de`

If another local app already uses port 3000:

```powershell
npm.cmd run dev -- -p 3111
```

Then open `http://localhost:3111/en`.

## Production Check

```bash
npm run typecheck
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SITE_URL`
- Sanity project ID, dataset and API version
- HubSpot portal, region, form IDs, meeting URL and tracking code ID
- GA4, GTM, Meta Pixel and LinkedIn Insight IDs

## Sanity Setup

Schemas live in `sanity/schemas`.

Editable models include:

- Pages
- Navigation
- Hero sections
- CTA blocks
- Playbooks
- HubSpot form configuration
- Process steps
- Team block
- FAQ items
- SEO metadata
- Footer
- Legal placeholder pages

Design-critical layouts remain in code. Editors can adjust core content and operational configuration through Sanity after the project is connected.

Studio is available at `/studio` when Sanity environment variables are configured.

## HubSpot Setup

The site is prepared for:

- HubSpot account: `HUBSPOT_PORTAL_ID`
- Shared Playbook form: `HUBSPOT_PLAYBOOK_FORM_GUID`
- Optional Developer override: `HUBSPOT_DEVELOPER_FORM_GUID`
- Optional Agent override: `HUBSPOT_AGENT_FORM_GUID`
- Meeting Scheduler fallback: `NEXT_PUBLIC_HUBSPOT_MEETING_URL`
- English Meeting Scheduler: `NEXT_PUBLIC_HUBSPOT_MEETING_URL_EN`
- German Meeting Scheduler: `NEXT_PUBLIC_HUBSPOT_MEETING_URL_DE`
- HubSpot Tracking Code: `NEXT_PUBLIC_HUBSPOT_TRACKING_CODE_ID`

Playbook forms submit to the local API route `/api/playbook`. That route sends the CRM lead to HubSpot's Forms API when the portal and form GUID are configured. A deployment-scoped Upstash state machine serializes each client submission ID: identical concurrent requests wait behind a five-minute lease, acknowledged submissions are deduplicated for 30 days, failed attempts are released for retry, and reuse of an ID with different CRM data returns HTTP 409. HubSpot errors are logged but do not block the transactional Playbook email. The previous `NEXT_PUBLIC_HUBSPOT_*` portal and form names remain supported as migration fallbacks.

HubSpot Forms does not expose a provider-side idempotency key. A transport-ambiguous failure can therefore produce a duplicate form event when the released submission is retried, although acknowledged requests are deduplicated locally and HubSpot identifies the contact by email. Owner notifications include the stable submission ID for reconciliation; the implementation deliberately favors retrying a lead over silently losing it.

## Resend Playbook Delivery

Resend is used to send the selected Playbook by email after the form is submitted.
The four PDF assets are included under `public/playbooks` and are served from `/playbooks/...pdf`.

Required variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `DOUBLE_OPT_IN_SECRET` (at least 32 bytes of high-entropy secret material)
- `RESEND_MARKETING_TOPIC_ID`
- `KV_REST_API_URL` and `KV_REST_API_TOKEN` (canonical pair injected by the connected Vercel Upstash database), or the direct Upstash pair `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Optional key rotation: `DOUBLE_OPT_IN_PREVIOUS_SECRET`
- Optional contact segment: `RESEND_CONTACT_SEGMENT_ID`
- Optional built-in-asset overrides: `DEVELOPER_PLAYBOOK_URL`, `AGENT_PLAYBOOK_URL`
- Optional localized overrides: `DEVELOPER_PLAYBOOK_URL_EN`, `DEVELOPER_PLAYBOOK_URL_DE`, `AGENT_PLAYBOOK_URL_EN`, `AGENT_PLAYBOOK_URL_DE`

When marketing consent is requested, the app sends a one-time, 24-hour confirmation link. Opening the link only renders a confirmation page; the explicit form submission atomically claims the signed token in Redis and records the confirmation timestamp, signed privacy-policy version and requested Playbook in Resend. Tokens are v2 audience-bound: Production and every immutable Preview deployment use different signed audiences, Redis namespaces and Resend idempotency scopes. A fresh contact is created through Resend's one-row import API with the documented `on_conflict=skip` mode and explicit topic opt-in. The import ID and terminal outcome remain in deployment-scoped Redis for 48 hours, so a retry resumes the same asynchronous job and never interprets a partially imported contact as a final preference. Polling uses a bounded 20-second budget, exponential delays and retryable read handling. A concurrent or pre-existing contact is never overwritten and is accepted only when already opted into that topic. Existing global unsubscribes, topic opt-outs and ambiguous/missing topic states are never cleared by the link. This prevents link-scanning software from creating consent through a GET request.

Playbook submissions are protected by separate Vercel Firewall rate-limit IDs: `novalure-playbook-submit-preview` for Preview and `novalure-playbook-submit` for Production. Both use 5 requests per 600 seconds per API-controlled client key. An exact rolling Upstash limit allows three distinct submissions per normalized recipient address within 24 hours. Every Redis key is deployment-namespaced, so Preview tests cannot consume Production quota or token state. The browser keeps one random submission ID stable across double-clicks and retries; the same ID drives the Redis member, signed token, HubSpot marker and deployment-scoped Resend idempotency keys. Recipient addresses and token IDs are stored in Redis only as SHA-256 digests. In deployed Preview and Production environments, missing Firewall, deployment-origin or Redis configuration fails closed. The Firewall SDK intentionally bypasses an absent rule during local development; use direct Upstash credentials for local API testing.

Recommended flow:

1. Verify `novalure.eu` in Resend.
2. Add the DNS records Resend gives you.
3. Create an API key with access to email and contact operations.
4. Create a contact segment and an opt-out-by-default marketing topic.
5. Create the contact properties `doi_confirmed_at`, `doi_source`, `privacy_policy_version`, `requested_playbook` and `doi_token_fingerprint`.
6. Use the built-in PDF URLs or upload each Playbook PDF to a private or unlisted asset URL.
7. Set the Playbook URL variables in Vercel only if you want to override the built-in URLs.
8. Publish the Preview-only code-instrumented Vercel Firewall rule with ID `novalure-playbook-submit-preview` before testing a Preview API route. Create the separate `novalure-playbook-submit` Production rule only after Preview QA passes.
9. Submit a test form, confirm the email link manually and verify the lead in HubSpot plus the topic opt-in in Resend.

For local DOI email testing, set `PLAYBOOK_DEVELOPMENT_ORIGIN` to the exact localhost origin of the running development server. It defaults to `http://localhost:3000` and intentionally never inherits `NEXT_PUBLIC_SITE_URL`.

To regenerate the HTML sources, run `npm run playbooks`. In this Codex workspace, PDFs were rendered from those HTML sources with `scripts/render-playbook-pdfs.py`.

## Cookie Consent and Tracking

Consent categories:

- Necessary
- Analytics
- Marketing
- External media / embeds

Tracking placeholders only activate after consent. Before launch, confirm final vendor behavior, Consent Mode v2 requirements and legal wording with counsel.

## Legal Pages

Legal pages intentionally contain placeholders:

- `[COMPANY LEGAL NAME]`
- `[REGISTERED ADDRESS]`
- `[COMPANY NUMBER]`
- `[VAT NUMBER]`
- `[RESPONSIBLE PERSON]`
- `[EMAIL]`
- `[HOSTING PROVIDER]`
- `[HUBSPOT DETAILS]`
- `[ANALYTICS TOOLS]`
- `[COOKIE CONSENT PROVIDER]`

Do not launch publicly until these have been replaced and reviewed.

## Logo Updates

The current logo is a code-rendered Novalure wordmark in `components/Logo.tsx`.

To replace it:

1. Add the final SVG or image to `public/`.
2. Update `components/Logo.tsx`.
3. Keep the accessible `aria-label`.
4. Verify desktop and mobile header spacing.

## Content Editing

Core fallback content lives in `content/pages.ts`. This lets the site build and deploy even before Sanity is connected.

Once Sanity is live, use the schemas and queries as the source for editable production content.

## Vercel Deployment

1. Connect the repository to Vercel.
2. Add all variables from `.env.example`.
3. Deploy with the default Next.js settings.
4. Verify `/en`, `/de`, `/sitemap.xml`, `/robots.txt`, `/studio` and all legal routes.

## No-Fake-Proof Rule

The site intentionally does not include fake testimonials, logos, awards, case studies, ratings, lead numbers, revenue numbers or delivery guarantees. Trust is built through methodology, sales-system clarity, CRM handover, qualification logic and senior-led execution.
