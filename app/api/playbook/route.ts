import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type PlaybookKey = "developer" | "agent";
type Locale = "en" | "de";

const playbookCopy = {
  en: {
    developer: {
      subject: "Your Developer Pipeline Playbook",
      headline: "Your Developer Pipeline Playbook is ready",
      intro: "Here is the playbook for building a controllable buyer pipeline for real estate projects.",
      cta: "Open the Playbook"
    },
    agent: {
      subject: "Your Real Estate Agent Lead Playbook",
      headline: "Your Real Estate Agent Lead Playbook is ready",
      intro: "Here is the playbook for building owned seller and buyer lead flow beyond portal dependency.",
      cta: "Open the Playbook"
    },
    audit: "If you want us to review your current lead system, you can book a Private Growth Audit here:"
  },
  de: {
    developer: {
      subject: "Ihr Bauträger-Pipeline-Playbook",
      headline: "Ihr Bauträger-Pipeline-Playbook ist bereit",
      intro: "Hier ist das Playbook für den Aufbau einer steuerbaren Käufer-Pipeline für Immobilienprojekte.",
      cta: "Playbook öffnen"
    },
    agent: {
      subject: "Ihr Makler-Lead-Playbook",
      headline: "Ihr Makler-Lead-Playbook ist bereit",
      intro: "Hier ist das Playbook für eigene Verkäufer- und Käufer-Leads jenseits von Portalabhängigkeit.",
      cta: "Playbook öffnen"
    },
    audit: "Wenn Sie möchten, dass wir Ihr aktuelles Lead-System prüfen, können Sie hier ein privates Growth Audit buchen:"
  }
};

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";
}

function getPlaybookUrl(playbook: PlaybookKey) {
  return playbook === "developer" ? process.env.DEVELOPER_PLAYBOOK_URL : process.env.AGENT_PLAYBOOK_URL;
}

function getFormId(playbook: PlaybookKey) {
  return playbook === "developer"
    ? process.env.NEXT_PUBLIC_HUBSPOT_DEVELOPER_FORM_ID
    : process.env.NEXT_PUBLIC_HUBSPOT_AGENT_FORM_ID;
}

async function submitToHubSpot({
  playbook,
  name,
  email,
  company,
  pageUri
}: {
  playbook: PlaybookKey;
  name: string;
  email: string;
  company: string;
  pageUri: string;
}) {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const formId = getFormId(playbook);

  if (!portalId || !formId) {
    return { skipped: true };
  }

  const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      submittedAt: Date.now().toString(),
      fields: [
        { name: "email", value: email },
        { name: "firstname", value: name },
        { name: "company", value: company },
        { name: "requested_playbook", value: playbook }
      ],
      context: {
        pageName: "Novalure Playbook Request",
        pageUri
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "Visitor submitted the Novalure playbook form and requested email delivery."
        }
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`HubSpot submission failed: ${message}`);
  }

  return { skipped: false };
}

async function sendPlaybookEmail({
  locale,
  playbook,
  name,
  email
}: {
  locale: Locale;
  playbook: PlaybookKey;
  name: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const playbookUrl = getPlaybookUrl(playbook);
  const siteUrl = getSiteUrl();

  if (!apiKey || !from || !playbookUrl) {
    throw new Error("Resend configuration missing");
  }

  const resend = new Resend(apiKey);
  const copy = playbookCopy[locale][playbook];
  const auditUrl = `${siteUrl}${locale === "de" ? "/de/kontakt" : "/en/contact"}`;
  const greeting = locale === "de" ? `Hallo ${name},` : `Hi ${name},`;

  await resend.emails.send({
    from,
    to: email,
    subject: copy.subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:620px;margin:0 auto;padding:32px">
        <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">${copy.headline}</h1>
        <p>${greeting}</p>
        <p>${copy.intro}</p>
        <p>
          <a href="${playbookUrl}" style="display:inline-block;background:#ffd43b;color:#211800;font-weight:700;text-decoration:none;padding:14px 20px;border-radius:999px">
            ${copy.cta}
          </a>
        </p>
        <p>${playbookCopy[locale].audit}</p>
        <p><a href="${auditUrl}">${auditUrl}</a></p>
        <p style="color:#667085;font-size:13px;margin-top:32px">Novalure · PropTech Sales System</p>
      </div>
    `,
    text: `${greeting}\n\n${copy.intro}\n\n${copy.cta}: ${playbookUrl}\n\n${playbookCopy[locale].audit}\n${auditUrl}`
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: Locale = body.locale === "de" ? "de" : "en";
    const playbook: PlaybookKey = body.playbook === "agent" ? "agent" : "developer";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";

    if (!name || !isEmail(body.email)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const pageUri = typeof body.pageUri === "string" ? body.pageUri : getSiteUrl();

    await submitToHubSpot({ playbook, name, email: body.email, company, pageUri });
    await sendPlaybookEmail({ locale, playbook, name, email: body.email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
