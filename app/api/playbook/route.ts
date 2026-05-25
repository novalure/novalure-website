import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createDoubleOptInToken } from "@/lib/double-opt-in-token";
import { playbooks, privacyPolicyVersion, type PlaybookKey } from "@/lib/playbooks-meta";

type Locale = "en" | "de";
type PlaybookType = "developer" | "agent";

const ownerNotificationEmail = "hello@novalure.eu";

const playbookCopy: Record<Locale, Record<PlaybookType, {
  subject: string;
  headline: string;
  intro: string;
  cta: string;
}> & { audit: string; doiSubject: string; doiHeadline: string; doiIntro: string; doiCta: string }> = {
  en: {
    developer: {
      subject: "Your Developer Pipeline Playbook",
      headline: "Your Developer Pipeline Playbook is ready",
      intro: "Here is the diagnostic guide. Read the CRM handover and intent-filter sections first. That is where many project funnels lose their commercial effect.",
      cta: "Open the playbook"
    },
    agent: {
      subject: "Your Real Estate Agent Lead Playbook",
      headline: "Your Real Estate Agent Lead Playbook is ready",
      intro: "Here is the diagnostic guide. Read the CRM handover and intent-filter sections first. That is where many local lead systems lose their commercial effect.",
      cta: "Open the playbook"
    },
    audit: "If you have a concrete project, market area or lead-quality problem, the next step is a Pipeline Audit:",
    doiSubject: "Confirm NovaLure email updates",
    doiHeadline: "Please confirm your email updates",
    doiIntro: "You asked to receive relevant content, updates and offers from NovaLure. Confirm this once so we can record the marketing consent correctly.",
    doiCta: "Confirm email updates"
  },
  de: {
    developer: {
      subject: "Ihr Bauträger-Pipeline-Leitfaden",
      headline: "Ihr Bauträger-Pipeline-Leitfaden ist bereit",
      intro: "Hier ist der Diagnose-Leitfaden. Lesen Sie zuerst die Seiten zu CRM-Handover und Intent-Filter. Genau dort verlieren viele Projekt-Funnels ihre wirtschaftliche Wirkung.",
      cta: "Leitfaden öffnen"
    },
    agent: {
      subject: "Ihr Makler-Lead-Leitfaden",
      headline: "Ihr Makler-Lead-Leitfaden ist bereit",
      intro: "Hier ist der Diagnose-Leitfaden. Lesen Sie zuerst die Seiten zu CRM-Handover und Intent-Filter. Genau dort verlieren viele lokale Lead-Systeme ihre wirtschaftliche Wirkung.",
      cta: "Leitfaden öffnen"
    },
    audit: "Wenn Sie ein konkretes Projekt, Marktgebiet oder Leadproblem haben, ist ein Pipeline-Audit der nächste Schritt:",
    doiSubject: "NovaLure E-Mail-Updates bestätigen",
    doiHeadline: "Bitte bestätigen Sie Ihre E-Mail-Updates",
    doiIntro: "Sie haben angefragt, relevante Inhalte, Updates und Angebote von NovaLure zu erhalten. Bestätigen Sie das einmalig, damit wir die Marketing-Zustimmung korrekt dokumentieren können.",
    doiCta: "E-Mail-Updates bestätigen"
  }
};

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string) {
  if (!value) return true;
  return /^[+\d\s()./-]{6,}$/.test(value);
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

function parsePlaybookKey(value: unknown, locale: Locale): PlaybookKey {
  if (typeof value === "string" && value in playbooks) {
    return value as PlaybookKey;
  }

  const type: PlaybookType = value === "agent" ? "agent" : "developer";
  return `${locale}-${type}` as PlaybookKey;
}

function getPlaybookParts(key: PlaybookKey): { locale: Locale; type: PlaybookType } {
  return {
    locale: key.startsWith("de-") ? "de" : "en",
    type: key.endsWith("agent") ? "agent" : "developer"
  };
}

function getPlaybookUrl(key: PlaybookKey) {
  const siteUrl = getSiteUrl();
  const meta = playbooks[key];
  const { locale, type } = getPlaybookParts(key);
  const fallback = `${siteUrl}${meta.file}`;

  if (type === "developer") {
    return locale === "de"
      ? cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_DE) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback
      : cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_EN) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback;
  }

  return locale === "de"
    ? cleanUrl(process.env.AGENT_PLAYBOOK_URL_DE) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback
    : cleanUrl(process.env.AGENT_PLAYBOOK_URL_EN) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback;
}

function getFormId(playbook: PlaybookType) {
  return playbook === "developer"
    ? process.env.NEXT_PUBLIC_HUBSPOT_DEVELOPER_FORM_ID
    : process.env.NEXT_PUBLIC_HUBSPOT_AGENT_FORM_ID;
}

function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "";
}

function logConsent(input: {
  email: string;
  playbookKey: PlaybookKey;
  consentRequired: true;
  consentMarketing: boolean;
  consentTimestamp: string;
  ipAddress: string;
  userAgent: string;
}) {
  console.info("novalure_playbook_consent_log", JSON.stringify({
    ...input,
    privacyPolicyVersion,
    marketingStatus: input.consentMarketing ? "double_opt_in_pending" : "not_requested"
  }));
}

async function submitToHubSpot({
  playbookKey,
  playbook,
  name,
  email,
  company,
  phone,
  pageUri,
  segment,
  utm,
  consentRequired,
  consentMarketing
}: {
  playbookKey: PlaybookKey;
  playbook: PlaybookType;
  name: string;
  email: string;
  company: string;
  phone: string;
  pageUri: string;
  segment: string;
  utm: Record<string, string>;
  consentRequired: true;
  consentMarketing: boolean;
}) {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const formId = getFormId(playbook);

  if (!portalId || !formId) {
    return { skipped: true };
  }

  const communicationSubscriptionId = process.env.HUBSPOT_MARKETING_SUBSCRIPTION_TYPE_ID;
  const legalConsentOptions: Record<string, unknown> = {
    consent: {
      consentToProcess: consentRequired,
      text: `Visitor requested the NovaLure playbook ${playbookKey} and consented to data processing for email delivery. Privacy policy version: ${privacyPolicyVersion}.`
    }
  };

  if (consentMarketing && communicationSubscriptionId) {
    legalConsentOptions.communications = [
      {
        value: true,
        subscriptionTypeId: Number(communicationSubscriptionId),
        text: `Visitor requested NovaLure email updates. Status: double opt-in pending. Privacy policy version: ${privacyPolicyVersion}.`
      }
    ];
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
        { name: "requested_playbook", value: playbook },
        { name: "segment", value: segment },
        { name: "utm_source", value: utm.utm_source || "" },
        { name: "utm_medium", value: utm.utm_medium || "" },
        { name: "utm_campaign", value: utm.utm_campaign || "" },
        { name: "utm_content", value: utm.utm_content || "" },
        { name: "utm_term", value: utm.utm_term || "" }
      ],
      context: {
        pageName: "NovaLure Playbook Request",
        pageUri
      },
      legalConsentOptions
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`HubSpot submission failed: ${message}`);
  }

  return { skipped: false };
}

async function sendPlaybookEmail({
  key,
  name,
  email
}: {
  key: PlaybookKey;
  name: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const playbookUrl = getPlaybookUrl(key);
  const siteUrl = getSiteUrl();
  const { locale, type } = getPlaybookParts(key);

  if (!apiKey || !from) {
    throw new Error("Resend configuration missing");
  }

  const resend = new Resend(apiKey);
  const item = playbookCopy[locale][type];
  const auditUrl = `${siteUrl}${locale === "de" ? "/de/kontakt" : "/en/contact"}#book-audit`;
  const greeting = locale === "de" ? `Hallo ${name},` : `Hi ${name},`;
  const auditCta = locale === "de" ? "Pipeline-Audit anfragen" : "Request a Pipeline Audit";

  await resend.emails.send({
    from,
    to: email,
    subject: item.subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:620px;margin:0 auto;padding:32px">
        <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">${escapeHtml(item.headline)}</h1>
        <p>${escapeHtml(greeting)}</p>
        <p>${escapeHtml(item.intro)}</p>
        ${renderEmailButton(playbookUrl, item.cta)}
        <p style="margin-top:28px;">${escapeHtml(playbookCopy[locale].audit)}</p>
        ${renderEmailButton(auditUrl, auditCta, "secondary")}
        <p style="color:#667085;font-size:13px;margin-top:32px">NovaLure · CRM-ready lead systems</p>
      </div>
    `,
    text: `${greeting}\n\n${item.intro}\n\n${item.cta}: ${playbookUrl}\n\n${playbookCopy[locale].audit}\n${auditUrl}`
  });
}

async function sendOwnerNotificationEmail({
  key,
  name,
  email,
  company,
  phone,
  pageUri,
  consentMarketing,
  consentTimestamp,
  ipAddress,
  userAgent
}: {
  key: PlaybookKey;
  name: string;
  email: string;
  company: string;
  phone: string;
  pageUri: string;
  consentMarketing: boolean;
  consentTimestamp: string;
  ipAddress: string;
  userAgent: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const { locale, type } = getPlaybookParts(key);
  const playbookTitle = playbookCopy[locale][type].headline;
  const playbookUrl = getPlaybookUrl(key);
  const resend = new Resend(apiKey);
  const rows = [
    ["Name", name],
    ["E-Mail", email],
    ["Unternehmen", company],
    ["Telefon", phone || "-"],
    ["Playbook", `${key} - ${playbookTitle}`],
    ["Downloadlink", playbookUrl],
    ["Seite", pageUri],
    ["Marketing Opt-in", consentMarketing ? "ja, Double-Opt-in gesendet" : "nein"],
    ["Consent-Zeitpunkt", consentTimestamp],
    ["IP", ipAddress || "-"],
    ["User-Agent", userAgent || "-"]
  ];

  await resend.emails.send({
    from,
    to: ownerNotificationEmail,
    subject: `Neue Playbook-Anfrage: ${name} (${company})`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:720px;margin:0 auto;padding:32px">
        <h1 style="font-size:24px;line-height:1.2;margin:0 0 18px">Neue Playbook-Anfrage</h1>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse">
          ${rows.map(([label, value]) => `
            <tr>
              <td style="width:180px;padding:10px 12px;border:1px solid #e5e7eb;color:#667085;font-weight:700">${escapeHtml(label)}</td>
              <td style="padding:10px 12px;border:1px solid #e5e7eb">${escapeHtml(value)}</td>
            </tr>
          `).join("")}
        </table>
      </div>
    `,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n")
  });
}

async function sendDoubleOptInEmail({
  key,
  email
}: {
  key: PlaybookKey;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const { locale } = getPlaybookParts(key);
  const siteUrl = getSiteUrl();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const token = createDoubleOptInToken({ email, locale, playbook: key, expiresAt });
  const confirmUrl = `${siteUrl}/api/playbook/confirm?token=${encodeURIComponent(token)}`;
  const copy = playbookCopy[locale];
  const expiryText = locale === "de" ? "Der Link ist 24 Stunden gültig." : "This link is valid for 24 hours.";
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: email,
    subject: copy.doiSubject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:620px;margin:0 auto;padding:32px">
        <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">${escapeHtml(copy.doiHeadline)}</h1>
        <p>${escapeHtml(copy.doiIntro)}</p>
        ${renderEmailButton(confirmUrl, copy.doiCta)}
        <p style="color:#667085;font-size:13px;margin-top:32px">${escapeHtml(expiryText)}</p>
      </div>
    `,
    text: `${copy.doiIntro}\n\n${copy.doiCta}: ${confirmUrl}\n\n${expiryText}`
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submittedLocale: Locale = body.locale === "de" ? "de" : "en";
    const playbookKey = parsePlaybookKey(body.playbook, submittedLocale);
    const { locale, type } = getPlaybookParts(playbookKey);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const segment = typeof body.segment === "string" ? body.segment.trim() : type === "developer" ? "developers" : "agents";
    const utm = typeof body.utm === "object" && body.utm ? body.utm as Record<string, string> : {};
    const consentRequired = body.consentRequired === true;
    const consentMarketing = body.consentMarketing === true;
    const consentTimestamp = typeof body.consentTimestamp === "string" && !Number.isNaN(Date.parse(body.consentTimestamp))
      ? body.consentTimestamp
      : "";

    if (!name || !company || !isEmail(body.email) || !isPhone(phone) || !consentRequired || !consentTimestamp) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const email = body.email.trim();
    const pageUri = typeof body.pageUri === "string" ? body.pageUri : getSiteUrl();
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";

    logConsent({
      email,
      playbookKey,
      consentRequired,
      consentMarketing,
      consentTimestamp,
      ipAddress,
      userAgent
    });

    await submitToHubSpot({
      playbookKey,
      playbook: type,
      name,
      email,
      company,
      phone,
      pageUri,
      segment,
      utm,
      consentRequired,
      consentMarketing
    });
    await sendPlaybookEmail({ key: playbookKey, name, email });
    await sendOwnerNotificationEmail({
      key: playbookKey,
      name,
      email,
      company,
      phone,
      pageUri,
      consentMarketing,
      consentTimestamp,
      ipAddress,
      userAgent
    }).catch((error) => {
      console.error("novalure_playbook_owner_notification_failed", error);
    });

    if (consentMarketing) {
      await sendDoubleOptInEmail({ key: playbookKey, email }).catch((error) => {
        console.error("novalure_double_opt_in_failed", error);
      });
    }

    return NextResponse.json({ ok: true, locale });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
