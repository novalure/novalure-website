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
    audit: "If you want us to review your current lead system, you can book a Pipeline Audit here:"
  },
  de: {
    developer: {
      subject: "Ihr Bauträger-Pipeline-Leitfaden",
      headline: "Ihr Bauträger-Pipeline-Leitfaden ist bereit",
      intro: "Hier ist der Leitfaden für den Aufbau einer steuerbaren Käufer-Pipeline für Immobilienprojekte.",
      cta: "Leitfaden öffnen"
    },
    agent: {
      subject: "Ihr Makler-Lead-Leitfaden",
      headline: "Ihr Makler-Lead-Leitfaden ist bereit",
      intro: "Hier ist der Leitfaden für eigene Verkäufer- und Käufer-Leads jenseits von Portalabhängigkeit.",
      cta: "Leitfaden öffnen"
    },
    audit: "Wenn Sie möchten, dass wir Ihr aktuelles Lead-System prüfen, können Sie hier ein Pipeline-Audit buchen:"
  }
};

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getSiteUrl() {
  const configuredUrl = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return (configuredUrl || "https://www.novalure.eu").replace(/\/+$/, "");
}

function cleanUrl(value: string | undefined) {
  return value?.trim() || "";
}

function escapeHtml(value: string) {
  const replacements: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return value.replace(/[&<>"']/g, (character) => replacements[character] ?? character);
}

function renderEmailButton(href: string, label: string, variant: "primary" | "secondary" = "primary") {
  const background = variant === "primary" ? "#ffd43b" : "#111318";
  const color = variant === "primary" ? "#211800" : "#ffffff";
  const border = variant === "primary" ? "#ffd43b" : "#111318";

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
      <tr>
        <td bgcolor="${background}" style="border:1px solid ${border};border-radius:8px;">
          <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 22px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;font-weight:700;color:${color};text-decoration:none;border-radius:8px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function getPlaybookUrl(playbook: PlaybookKey, locale: Locale) {
  const siteUrl = getSiteUrl();
  const fallback =
    playbook === "developer"
      ? locale === "de"
        ? `${siteUrl}/playbooks/bautraeger-pipeline-playbook-de.pdf`
        : `${siteUrl}/playbooks/developer-pipeline-playbook-en.pdf`
      : locale === "de"
        ? `${siteUrl}/playbooks/makler-lead-playbook-de.pdf`
        : `${siteUrl}/playbooks/real-estate-agent-lead-playbook-en.pdf`;

  if (playbook === "developer") {
    return locale === "de"
      ? cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_DE) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback
      : cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_EN) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback;
  }

  return locale === "de"
    ? cleanUrl(process.env.AGENT_PLAYBOOK_URL_DE) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback
    : cleanUrl(process.env.AGENT_PLAYBOOK_URL_EN) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback;
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
  phone,
  pageUri
}: {
  playbook: PlaybookKey;
  name: string;
  email: string;
  company: string;
  phone: string;
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
        { name: "phone", value: phone },
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
  const playbookUrl = getPlaybookUrl(playbook, locale);
  const siteUrl = getSiteUrl();

  if (!apiKey || !from) {
    throw new Error("Resend configuration missing");
  }

  const resend = new Resend(apiKey);
  const copy = playbookCopy[locale][playbook];
  const auditUrl = `${siteUrl}${locale === "de" ? "/de/kontakt" : "/en/contact"}#book-audit`;
  const greeting = locale === "de" ? `Hallo ${name},` : `Hi ${name},`;
  const auditCta = locale === "de" ? "Pipeline-Audit buchen" : "Book a Pipeline Audit";

  await resend.emails.send({
    from,
    to: email,
    subject: copy.subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:620px;margin:0 auto;padding:32px">
        <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">${escapeHtml(copy.headline)}</h1>
        <p>${escapeHtml(greeting)}</p>
        <p>${escapeHtml(copy.intro)}</p>
        ${renderEmailButton(playbookUrl, copy.cta)}
        <p style="margin-top:28px;">${escapeHtml(playbookCopy[locale].audit)}</p>
        ${renderEmailButton(auditUrl, auditCta, "secondary")}
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
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!name || !company || !phone || !isEmail(body.email)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const pageUri = typeof body.pageUri === "string" ? body.pageUri : getSiteUrl();

    await submitToHubSpot({ playbook, name, email: body.email, company, phone, pageUri });
    await sendPlaybookEmail({ locale, playbook, name, email: body.email });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
