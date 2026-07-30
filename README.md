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

Playbook forms submit to the local API route `/api/playbook`. That route sends the CRM lead to HubSpot's Forms API when the portal and form GUID are configured. HubSpot errors are logged but do not block the transactional Playbook email. The previous `NEXT_PUBLIC_HUBSPOT_*` portal and form names remain supported as migration fallbacks.

## Resend Playbook Delivery

Resend is used to send the selected Playbook by email after the form is submitted.
The four PDF assets are included under `public/playbooks` and are served from `/playbooks/...pdf`.

Required variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `DOUBLE_OPT_IN_SECRET`
- `RESEND_CONTACT_SEGMENT_ID`
- `RESEND_MARKETING_TOPIC_ID`
- `DEVELOPER_PLAYBOOK_URL`
- `AGENT_PLAYBOOK_URL`
- Optional localized overrides: `DEVELOPER_PLAYBOOK_URL_EN`, `DEVELOPER_PLAYBOOK_URL_DE`, `AGENT_PLAYBOOK_URL_EN`, `AGENT_PLAYBOOK_URL_DE`

When marketing consent is requested, the app sends a 24-hour confirmation link. Opening the link only renders a confirmation page; the explicit form submission records the contact, confirmation timestamp, privacy-policy version and requested Playbook in Resend and opts the contact into the configured topic. This prevents link-scanning software from creating consent through a GET request.

Recommended flow:

1. Verify `novalure.eu` in Resend.
2. Add the DNS records Resend gives you.
3. Create an API key with access to email and contact operations.
4. Create a contact segment and an opt-out-by-default marketing topic.
5. Create the contact properties `doi_confirmed_at`, `doi_source`, `privacy_policy_version` and `requested_playbook`.
6. Use the built-in PDF URLs or upload each Playbook PDF to a private or unlisted asset URL.
7. Set the Playbook URL variables in Vercel only if you want to override the built-in URLs.
8. Submit a test form, confirm the email link manually and verify the lead in HubSpot plus the topic opt-in in Resend.

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
