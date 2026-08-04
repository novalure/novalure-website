import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getScopedIdempotencyKey, resolveDeploymentContext } from "@/lib/deployment-context";
import { createDoubleOptInToken } from "@/lib/double-opt-in-token";
import { registerDoubleOptInToken } from "@/lib/double-opt-in-state";
import {
  claimHubSpotSubmission,
  completeHubSpotSubmission,
  HubSpotSubmissionConflictError,
  releaseHubSpotSubmission
} from "@/lib/hubspot-submission-state";
import { playbooks, privacyPolicyVersion, type PlaybookKey } from "@/lib/playbooks-meta";
import {
  checkPlaybookIpRateLimit,
  checkPlaybookRecipientRateLimit,
  normalizeRecipientEmail,
  type PlaybookRateLimitResult
} from "@/lib/playbook-rate-limit";

type Locale = "en" | "de" | "es";
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
      subject: "Your Developer Project Playbook",
      headline: "Your Developer Project Playbook is ready",
      intro: "Here is the diagnostic guide. Read the handover and intent-filter sections first. That is where many project paths lose their commercial effect.",
      cta: "Open the playbook"
    },
    agent: {
      subject: "Your Real Estate Agent Lead Playbook",
      headline: "Your Real Estate Agent Lead Playbook is ready",
      intro: "Here is the diagnostic guide. Read the handover and intent-filter sections first. That is where many local lead paths lose their commercial effect.",
      cta: "Open the playbook"
    },
    audit: "If you have a concrete project, market area or lead-quality problem, the next step is a Project Check:",
    doiSubject: "Confirm NovaLure email updates",
    doiHeadline: "Please confirm your email updates",
    doiIntro: "You asked to receive relevant content, updates and offers from NovaLure. Confirm this once so we can record the marketing consent correctly.",
    doiCta: "Confirm email updates"
  },
  de: {
    developer: {
      subject: "Ihr Bauträger-Projekt-Leitfaden",
      headline: "Ihr Bauträger-Projekt-Leitfaden ist bereit",
      intro: "Hier ist der Diagnose-Leitfaden. Lesen Sie zuerst die Seiten zu Übergabe und Intent-Filter. Genau dort verlieren viele Projektwege ihre wirtschaftliche Wirkung.",
      cta: "Leitfaden öffnen"
    },
    agent: {
      subject: "Ihr Makler-Lead-Leitfaden",
      headline: "Ihr Makler-Lead-Leitfaden ist bereit",
      intro: "Hier ist der Diagnose-Leitfaden. Lesen Sie zuerst die Seiten zu Übergabe und Intent-Filter. Genau dort verlieren viele lokale Lead-Wege ihre wirtschaftliche Wirkung.",
      cta: "Leitfaden öffnen"
    },
    audit: "Wenn Sie ein konkretes Projekt, Marktgebiet oder Leadproblem haben, ist ein Projekt-Check der nächste Schritt:",
    doiSubject: "NovaLure E-Mail-Updates bestätigen",
    doiHeadline: "Bitte bestätigen Sie Ihre E-Mail-Updates",
    doiIntro: "Sie haben angefragt, relevante Inhalte, Updates und Angebote von NovaLure zu erhalten. Bestätigen Sie das einmalig, damit wir die Marketing-Zustimmung korrekt dokumentieren können.",
    doiCta: "E-Mail-Updates bestätigen"
  },
  es: {
    developer: {
      subject: "Aquí tiene su Playbook de NovaLure",
      headline: "Su Playbook para promotores está listo",
      intro: "Gracias por solicitar el Playbook de NovaLure. En él encontrará una visión clara de los puntos en los que una solicitud inmobiliaria puede perder contexto, prioridad o un siguiente paso antes de llegar al equipo comercial.",
      cta: "Descargar el Playbook"
    },
    agent: {
      subject: "Aquí tiene su Playbook de NovaLure",
      headline: "Su Playbook para agencias inmobiliarias está listo",
      intro: "Gracias por solicitar el Playbook de NovaLure. En él encontrará una visión clara de los puntos en los que una solicitud inmobiliaria puede perder contexto, prioridad o un siguiente paso antes de llegar al equipo comercial.",
      cta: "Descargar el Playbook"
    },
    audit: "Si tiene una promoción, un mercado o un problema concreto de calidad, el siguiente paso es un análisis del proyecto:",
    doiSubject: "Confirme las novedades por correo de NovaLure",
    doiHeadline: "Confirme su suscripción a las novedades",
    doiIntro: "Ha solicitado recibir contenidos, novedades y ofertas relevantes de NovaLure. Confirme una vez su consentimiento para que podamos registrarlo correctamente.",
    doiCta: "Confirmar la suscripción"
  }
};

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string) {
  if (!value) return true;
  return /^[+\d\s()./-]{6,}$/.test(value);
}

function isSubmissionId(value: unknown): value is string {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function cleanUrl(value: string | undefined) {
  return value?.trim() || "";
}

function rateLimitResponse(result: PlaybookRateLimitResult) {
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: { "retry-after": String(result.retryAfterSeconds) }
    }
  );
}

function unavailableResponse() {
  return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
}

function assertRuntimeConfiguration(consentMarketing: boolean) {
  const missing = [
    ["RESEND_API_KEY", process.env.RESEND_API_KEY],
    ["RESEND_FROM_EMAIL", process.env.RESEND_FROM_EMAIL],
    ...(consentMarketing
      ? [
          ["DOUBLE_OPT_IN_SECRET", process.env.DOUBLE_OPT_IN_SECRET],
          ["RESEND_MARKETING_TOPIC_ID", process.env.RESEND_MARKETING_TOPIC_ID]
        ]
      : [])
  ].filter(([, value]) => !cleanUrl(value));

  if (missing.length) {
    throw new Error(`Missing runtime configuration: ${missing.map(([name]) => name).join(", ")}`);
  }
}

async function sendResendEmail(
  resend: Resend,
  payload: Parameters<Resend["emails"]["send"]>[0],
  options?: Parameters<Resend["emails"]["send"]>[1]
) {
  const result = await resend.emails.send(payload, options);
  if (result.error || typeof result.data?.id !== "string" || !result.data.id.trim()) {
    throw new Error(`Resend email delivery was rejected${result.error?.name ? `: ${result.error.name}` : ""}`);
  }

  return result.data;
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

function parsePlaybookKey(value: unknown, locale: Locale): PlaybookKey | null {
  if (typeof value === "string" && value in playbooks && value.startsWith(`${locale}-`)) {
    return value as PlaybookKey;
  }

  if (value === "developer" || value === "agent") {
    return `${locale}-${value}` as PlaybookKey;
  }

  return null;
}

function getPlaybookParts(key: PlaybookKey): { locale: Locale; type: PlaybookType } {
  return {
    locale: key.startsWith("de-") ? "de" : key.startsWith("es-") ? "es" : "en",
    type: key.endsWith("agent") ? "agent" : "developer"
  };
}

function getPlaybookUrl(key: PlaybookKey) {
  const siteUrl = resolveDeploymentContext().publicOrigin;
  const meta = playbooks[key];
  const { locale, type } = getPlaybookParts(key);
  const fallback = `${siteUrl}${meta.file}`;

  if (type === "developer") {
    return locale === "de"
      ? cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_DE) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback
      : locale === "es"
        ? cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_ES) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback
        : cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL_EN) || cleanUrl(process.env.DEVELOPER_PLAYBOOK_URL) || fallback;
  }

  return locale === "de"
    ? cleanUrl(process.env.AGENT_PLAYBOOK_URL_DE) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback
    : locale === "es"
      ? cleanUrl(process.env.AGENT_PLAYBOOK_URL_ES) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback
      : cleanUrl(process.env.AGENT_PLAYBOOK_URL_EN) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback;
}

function getFormId(playbook: PlaybookType) {
  return playbook === "developer"
    ? process.env.HUBSPOT_DEVELOPER_FORM_GUID
      || process.env.NEXT_PUBLIC_HUBSPOT_DEVELOPER_FORM_ID
      || process.env.HUBSPOT_PLAYBOOK_FORM_GUID
    : process.env.HUBSPOT_AGENT_FORM_GUID
      || process.env.NEXT_PUBLIC_HUBSPOT_AGENT_FORM_ID
      || process.env.HUBSPOT_PLAYBOOK_FORM_GUID;
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
    marketingStatus: input.consentMarketing ? "double_opt_in_requested" : "not_requested"
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
  submissionId
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
  submissionId: string;
}) {
  const portalId = process.env.HUBSPOT_PORTAL_ID || process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const formId = getFormId(playbook);

  if (!portalId || !formId) {
    return {
      skipped: true,
      portalConfigured: Boolean(portalId),
      formConfigured: Boolean(formId)
    };
  }

  const legalConsentOptions: Record<string, unknown> = {
    consent: {
      consentToProcess: consentRequired,
      text: `Visitor requested the NovaLure playbook ${playbookKey} and consented to data processing for email delivery. Privacy policy version: ${privacyPolicyVersion}.`
    }
  };

  const hubSpotPayload = {
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
  };

  const claim = await claimHubSpotSubmission(submissionId, hubSpotPayload);
  if (claim === "replay") {
    return { skipped: false, replayed: true };
  }
  if (claim === "processing") {
    return { skipped: true, reason: "identical_submission_processing" };
  }

  let response: Response;
  try {
    response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(hubSpotPayload)
    });
  } catch (error) {
    try {
      await releaseHubSpotSubmission(submissionId, claim.claimId);
    } catch (releaseError) {
      console.error("novalure_hubspot_submission_release_failed", JSON.stringify({ submissionId }), releaseError);
    }
    throw error;
  }

  if (!response.ok) {
    try {
      await releaseHubSpotSubmission(submissionId, claim.claimId);
    } catch (releaseError) {
      console.error("novalure_hubspot_submission_release_failed", JSON.stringify({ submissionId }), releaseError);
    }
    const message = await response.text();
    throw new Error(`HubSpot submission failed: ${message}`);
  }

  // Complete only after HubSpot acknowledges the submission. A failed state
  // write intentionally leaves the processing marker in place rather than
  // immediately risking a duplicate provider submission.
  await completeHubSpotSubmission(submissionId, claim.claimId);

  return { skipped: false };
}

async function sendPlaybookEmail({
  key,
  name,
  email,
  submissionId
}: {
  key: PlaybookKey;
  name: string;
  email: string;
  submissionId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const playbookUrl = getPlaybookUrl(key);
  const siteUrl = resolveDeploymentContext().publicOrigin;
  const { locale, type } = getPlaybookParts(key);

  if (!apiKey || !from) {
    throw new Error("Resend configuration missing");
  }

  const resend = new Resend(apiKey);
  const item = playbookCopy[locale][type];
  const auditUrl = `${siteUrl}${locale === "de" ? "/de/kontakt" : locale === "es" ? "/es/analisis-del-proyecto" : "/en/contact"}#book-audit`;
  const greeting = locale === "de" ? `Hallo ${name},` : locale === "es" ? `Hola, ${name}:` : `Hi ${name},`;
  const auditCta = locale === "de" ? "Projekt-Check anfragen" : locale === "es" ? "Solicitar un análisis del proyecto" : "Request Project Check";
  const footer = locale === "de"
    ? { privacy: "Datenschutz", legal: "Impressum", unsubscribe: "Abmelden", signoff: "Viele Grüße, das NovaLure-Team" }
    : locale === "es"
      ? { privacy: "Política de privacidad", legal: "Aviso legal", unsubscribe: "Darse de baja", signoff: "Un saludo, el equipo de NovaLure" }
      : { privacy: "Privacy Policy", legal: "Imprint", unsubscribe: "Unsubscribe", signoff: "Kind regards, the NovaLure team" };
  const privacyUrl = `${siteUrl}${locale === "de" ? "/de/rechtliches/datenschutz" : locale === "es" ? "/es/privacidad" : "/en/legal/privacy"}`;
  const legalUrl = `${siteUrl}${locale === "de" ? "/de/rechtliches/impressum" : locale === "es" ? "/es/aviso-legal" : "/en/legal/imprint"}`;
  const unsubscribeUrl = `mailto:hello@novalure.eu?subject=${encodeURIComponent(footer.unsubscribe)}`;

  await sendResendEmail(
    resend,
    {
      from,
      to: email,
      subject: item.subject,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:620px;margin:0 auto;padding:32px">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0">${locale === "es" ? "Descargue su Playbook y detecte dónde se pierde contexto antes de que intervenga el equipo comercial." : escapeHtml(item.intro)}</div>
          <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">${escapeHtml(item.headline)}</h1>
          <p>${escapeHtml(greeting)}</p>
          <p>${escapeHtml(item.intro)}</p>
          ${renderEmailButton(playbookUrl, item.cta)}
          <p style="margin-top:28px;">${escapeHtml(playbookCopy[locale].audit)}</p>
          ${renderEmailButton(auditUrl, auditCta, "secondary")}
          <p style="margin-top:30px">${escapeHtml(footer.signoff)}</p>
          <p style="color:#667085;font-size:13px;margin-top:32px">
            <a href="${escapeHtml(privacyUrl)}" style="color:#667085">${escapeHtml(footer.privacy)}</a> ·
            <a href="${escapeHtml(legalUrl)}" style="color:#667085">${escapeHtml(footer.legal)}</a> ·
            <a href="${escapeHtml(unsubscribeUrl)}" style="color:#667085">${escapeHtml(footer.unsubscribe)}</a>
          </p>
        </div>
      `,
      text: `${greeting}\n\n${item.intro}\n\n${item.cta}: ${playbookUrl}\n\n${playbookCopy[locale].audit}\n${auditUrl}\n\n${footer.signoff}\n${footer.privacy}: ${privacyUrl}\n${footer.legal}: ${legalUrl}\n${footer.unsubscribe}: ${unsubscribeUrl}`
    },
    { idempotencyKey: getScopedIdempotencyKey("playbook", submissionId) }
  );
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
  userAgent,
  submissionId
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
  submissionId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Resend configuration missing");
  }

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
    ["Submission-ID", submissionId],
    ["Downloadlink", playbookUrl],
    ["Seite", pageUri],
    ["Marketing Opt-in", consentMarketing ? "ja, Double-Opt-in angefordert, noch nicht bestätigt" : "nein"],
    ["Consent-Zeitpunkt", consentTimestamp],
    ["IP", ipAddress || "-"],
    ["User-Agent", userAgent || "-"]
  ];

  await sendResendEmail(
    resend,
    {
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
    },
    { idempotencyKey: getScopedIdempotencyKey("owner", submissionId) }
  );
}

async function sendDoubleOptInEmail({
  key,
  email,
  submissionId,
  consentTimestamp
}: {
  key: PlaybookKey;
  email: string;
  submissionId: string;
  consentTimestamp: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Resend configuration missing");
  }

  const { locale } = getPlaybookParts(key);
  const siteUrl = resolveDeploymentContext().publicOrigin;
  const issuedAt = consentTimestamp;
  const expiresAt = new Date(Date.parse(issuedAt) + 24 * 60 * 60 * 1000).toISOString();
  const tokenId = submissionId;
  const token = createDoubleOptInToken({
    email,
    locale,
    playbook: key,
    issuedAt,
    expiresAt,
    privacyPolicyVersion,
    tokenId
  });
  const registration = await registerDoubleOptInToken(tokenId, expiresAt);
  if (registration === "processing" || registration === "used" || registration === "blocked") {
    return { status: "already_registered" as const };
  }

  const confirmUrl = `${siteUrl}/api/playbook/confirm?token=${encodeURIComponent(token)}`;
  const copy = playbookCopy[locale];
  const expiryText = locale === "de" ? "Der Link ist 24 Stunden gültig." : locale === "es" ? "El enlace es válido durante 24 horas." : "This link is valid for 24 hours.";
  const resend = new Resend(apiKey);

  await sendResendEmail(
    resend,
    {
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
    },
    { idempotencyKey: getScopedIdempotencyKey("doi", submissionId) }
  );

  return { status: "accepted" as const };
}

export async function POST(request: NextRequest) {
  let ipRateLimit: PlaybookRateLimitResult;
  try {
    ipRateLimit = await checkPlaybookIpRateLimit(request);
  } catch (error) {
    console.error("novalure_playbook_ip_rate_limit_unavailable", error);
    return unavailableResponse();
  }

  if (ipRateLimit.rateLimited) {
    return rateLimitResponse(ipRateLimit);
  }

  let body: Record<string, unknown>;
  try {
    const parsedBody: unknown = await request.json();
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    body = parsedBody as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const website = typeof body.website === "string" ? body.website.trim() : "";
  if (website) {
    return NextResponse.json({ ok: true });
  }

  try {
    const submittedLocale: Locale = body.locale === "de" || body.locale === "es" ? body.locale : "en";
    const playbookKey = parsePlaybookKey(body.playbook, submittedLocale);
    if (!playbookKey) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    const { locale, type } = getPlaybookParts(playbookKey);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const segment = typeof body.segment === "string" ? body.segment.trim() : type === "developer" ? "developers" : "agents";
    const utm = typeof body.utm === "object" && body.utm
      ? Object.fromEntries(
          Object.entries(body.utm).filter((entry): entry is [string, string] => typeof entry[1] === "string")
        )
      : {};
    const consentRequired = body.consentRequired === true;
    const consentMarketing = body.consentMarketing === true;
    const consentTimestampInput = typeof body.consentTimestamp === "string"
      ? body.consentTimestamp
      : "";
    const consentTimestampMs = Date.parse(consentTimestampInput);
    const consentTimestamp = Number.isFinite(consentTimestampMs)
      ? new Date(consentTimestampMs).toISOString()
      : "";
    const nowMs = Date.now();
    const submissionId = isSubmissionId(body.submissionId) ? body.submissionId : "";

    if (
      !name
      || !company
      || !isEmail(body.email)
      || !isPhone(phone)
      || !consentRequired
      || !consentTimestamp
      || consentTimestamp !== consentTimestampInput
      || !submissionId
      || consentTimestampMs > nowMs + 5 * 60 * 1000
      || consentTimestampMs < nowMs - 24 * 60 * 60 * 1000
      || body.privacyPolicyVersion !== privacyPolicyVersion
    ) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const email = normalizeRecipientEmail(body.email);
    const pageUri = typeof body.pageUri === "string" ? body.pageUri : resolveDeploymentContext().publicOrigin;
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";

    try {
      assertRuntimeConfiguration(consentMarketing);
    } catch (error) {
      console.error("novalure_playbook_configuration_failed", error);
      return unavailableResponse();
    }

    let recipientRateLimit: PlaybookRateLimitResult;
    try {
      recipientRateLimit = await checkPlaybookRecipientRateLimit(email, { requestId: submissionId });
    } catch (error) {
      console.error("novalure_playbook_recipient_rate_limit_unavailable", error);
      return unavailableResponse();
    }

    if (recipientRateLimit.rateLimited) {
      return rateLimitResponse(recipientRateLimit);
    }

    let hubspotResult;
    try {
      hubspotResult = await submitToHubSpot({
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
        submissionId
      });
    } catch (error) {
      if (error instanceof HubSpotSubmissionConflictError) {
        return NextResponse.json({ error: "Submission ID conflict" }, { status: 409 });
      }
      console.error("novalure_hubspot_submission_failed", JSON.stringify({ submissionId }), error);
      hubspotResult = { skipped: false, failed: true };
    }

    // Log the accepted request only after the submission-ID conflict gate. A
    // rejected replay with changed data did not request DOI and must not leave
    // a false consent audit event.
    logConsent({
      email,
      playbookKey,
      consentRequired,
      consentMarketing,
      consentTimestamp,
      ipAddress,
      userAgent
    });

    if (hubspotResult.skipped) {
      console.warn("novalure_hubspot_submission_skipped", JSON.stringify(hubspotResult));
    }

    await sendPlaybookEmail({ key: playbookKey, name, email, submissionId });
    if (consentMarketing) {
      const doubleOptIn = await sendDoubleOptInEmail({
        key: playbookKey,
        email,
        submissionId,
        consentTimestamp
      });
      console.info("novalure_double_opt_in_email_ready", JSON.stringify({
        email,
        locale,
        playbook: playbookKey,
        privacyPolicyVersion,
        status: doubleOptIn.status,
        recordedAt: new Date().toISOString(),
        provider: "resend"
      }));
    }

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
      userAgent,
      submissionId
    }).catch((error) => {
      console.error("novalure_playbook_owner_notification_failed", error);
    });

    return NextResponse.json({ ok: true, locale });
  } catch (error) {
    console.error("novalure_playbook_request_failed", error);
    return unavailableResponse();
  }
}
