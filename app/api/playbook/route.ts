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
import {
  getSelectedPlaybookKeys,
  isPlaybookKey,
  playbooks,
  privacyPolicyVersion,
  type PlaybookKey,
  type PlaybookLocale,
  type PlaybookType,
  type PrimaryPlaybookType
} from "@/lib/playbooks-meta";
import {
  checkPlaybookIpRateLimit,
  checkPlaybookRecipientRateLimit,
  normalizeRecipientEmail,
  type PlaybookRateLimitResult
} from "@/lib/playbook-rate-limit";

const ownerNotificationEmail = "hello@novalure.eu";

type DeliveryCopy = {
  subject: string;
  headline: string;
  intro: string;
  cta: string;
};

type LocaleCopy = Record<PlaybookType, DeliveryCopy> & {
  multipleSubject: string;
  multipleHeadline: string;
  multipleIntro: string;
  audit: string;
  doiSubject: string;
  doiHeadline: string;
  doiIntro: string;
  doiCta: string;
};

const playbookCopy: Record<PlaybookLocale, LocaleCopy> = {
  en: {
    developer: {
      subject: "Your Project Demand Playbook",
      headline: "Your Project Demand Playbook is ready",
      intro: "This diagnostic guide shows where buying context gets lost between project presence, campaign, qualification and sales.",
      cta: "Open Project Demand"
    },
    agent: {
      subject: "Your Owned Demand Playbook",
      headline: "Your Owned Demand Playbook is ready",
      intro: "This diagnostic guide shows how seller and buyer enquiries become prepared conversations rather than one more list to work through.",
      cta: "Open Owned Demand"
    },
    international: {
      subject: "Your International Buyers Specialist Playbook",
      headline: "Your International Buyers Specialist Playbook is ready",
      intro: "This specialist guide shows what international buyers need beyond translation: trust, process clarity, finance context, language ownership and disciplined follow-up.",
      cta: "Open International Buyers"
    },
    multipleSubject: "Your selected NovaLure playbooks",
    multipleHeadline: "Your selected NovaLure playbooks are ready",
    multipleIntro: "We have included the primary playbook for your role and the International Buyers specialist playbook you selected.",
    audit: "If you have a concrete project, market area or lead-quality problem, the next step is a Project Check:",
    doiSubject: "Confirm NovaLure email updates",
    doiHeadline: "Please confirm your email updates",
    doiIntro: "You asked to receive relevant content, updates and offers from NovaLure. Confirm this once so we can record the marketing consent correctly.",
    doiCta: "Confirm email updates"
  },
  de: {
    developer: {
      subject: "Ihr Playbook zur Projekt-Nachfrage",
      headline: "Ihr Playbook zur Projekt-Nachfrage ist bereit",
      intro: "Der Diagnose-Leitfaden zeigt, wo Kaufkontext zwischen Projektauftritt, Kampagne, Qualifizierung und Vertrieb verloren geht.",
      cta: "Projekt-Nachfrage öffnen"
    },
    agent: {
      subject: "Ihr Playbook zur eigenen Nachfrage",
      headline: "Ihr Playbook zur eigenen Nachfrage ist bereit",
      intro: "Der Diagnose-Leitfaden zeigt, wie Eigentümer- und Käuferanfragen zu vorbereiteten Gesprächen werden statt zu einer weiteren Liste zum Abtelefonieren.",
      cta: "Eigene Nachfrage öffnen"
    },
    international: {
      subject: "Ihr Spezial-Playbook zu internationalen Käufern",
      headline: "Ihr Spezial-Playbook zu internationalen Käufern ist bereit",
      intro: "Der Spezial-Leitfaden zeigt, was internationale Käufer zusätzlich zur Übersetzung brauchen: Vertrauen, Prozessklarheit, Finanzierungskontext, Sprachzuständigkeit und diszipliniertes Follow-up.",
      cta: "Internationale Käufer öffnen"
    },
    multipleSubject: "Ihre ausgewählten NovaLure Playbooks",
    multipleHeadline: "Ihre ausgewählten NovaLure Playbooks sind bereit",
    multipleIntro: "Enthalten sind das primäre Playbook für Ihren Bereich und das von Ihnen gewählte Spezial-Playbook zu internationalen Käufern.",
    audit: "Wenn Sie ein konkretes Projekt, Marktgebiet oder Leadproblem haben, ist ein Projekt-Check der nächste Schritt:",
    doiSubject: "NovaLure E-Mail-Updates bestätigen",
    doiHeadline: "Bitte bestätigen Sie Ihre E-Mail-Updates",
    doiIntro: "Sie haben angefragt, relevante Inhalte, Updates und Angebote von NovaLure zu erhalten. Bestätigen Sie das einmalig, damit wir die Marketing-Zustimmung korrekt dokumentieren können.",
    doiCta: "E-Mail-Updates bestätigen"
  },
  es: {
    developer: {
      subject: "Su Playbook sobre demanda de promociones",
      headline: "Su Playbook sobre demanda de promociones está listo",
      intro: "Esta guía de diagnóstico muestra dónde se pierde el contexto de compra entre la presentación, la campaña, la cualificación y el equipo comercial.",
      cta: "Abrir Demanda de promociones"
    },
    agent: {
      subject: "Su Playbook sobre demanda propia",
      headline: "Su Playbook sobre demanda propia está listo",
      intro: "Esta guía de diagnóstico muestra cómo convertir solicitudes de propietarios y compradores en conversaciones preparadas, no en otra lista que repasar.",
      cta: "Abrir Demanda propia"
    },
    international: {
      subject: "Su Playbook especializado sobre compradores internacionales",
      headline: "Su Playbook sobre compradores internacionales está listo",
      intro: "Esta guía especializada muestra qué necesitan los compradores internacionales además de una traducción: confianza, claridad del proceso, contexto financiero, responsabilidad lingüística y seguimiento disciplinado.",
      cta: "Abrir Compradores internacionales"
    },
    multipleSubject: "Sus Playbooks seleccionados de NovaLure",
    multipleHeadline: "Sus Playbooks seleccionados están listos",
    multipleIntro: "Hemos incluido el Playbook principal correspondiente a su actividad y el Playbook especializado sobre compradores internacionales que ha seleccionado.",
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
  return !value || /^[+\d\s()./-]{6,}$/.test(value);
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
    { status: 429, headers: { "retry-after": String(result.retryAfterSeconds) } }
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
  const background = variant === "primary" ? "#c7a55b" : "#0e1b33";
  const color = variant === "primary" ? "#0e1b33" : "#ffffff";
  const border = background;

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:18px 0;">
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

function getPlaybookParts(key: PlaybookKey): { locale: PlaybookLocale; type: PlaybookType } {
  const [locale, type] = key.split("-") as [PlaybookLocale, PlaybookType];
  return { locale, type };
}

function parsePrimaryRole(value: unknown): PrimaryPlaybookType | null {
  if (value === "developer" || value === "agent") return value;
  if (typeof value === "string" && isPlaybookKey(value)) {
    const { type } = getPlaybookParts(value);
    return type === "developer" || type === "agent" ? type : null;
  }
  return null;
}

function parseRequestedPlaybooks(
  value: unknown,
  locale: PlaybookLocale,
  role: PrimaryPlaybookType,
  includeInternational: boolean
): PlaybookKey[] | null {
  const expected = getSelectedPlaybookKeys(locale, role, includeInternational);
  if (value === undefined) return expected;
  if (!Array.isArray(value) || value.length < 1 || value.length > 2) return null;

  const unique = Array.from(new Set(value));
  if (unique.length !== value.length || !unique.every(isPlaybookKey)) return null;
  const keys = unique as PlaybookKey[];
  if (keys.some((key) => !key.startsWith(`${locale}-`))) return null;
  if (keys.length !== expected.length || expected.some((key) => !keys.includes(key))) return null;
  return expected;
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

  if (type === "agent") {
    return locale === "de"
      ? cleanUrl(process.env.AGENT_PLAYBOOK_URL_DE) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback
      : locale === "es"
        ? cleanUrl(process.env.AGENT_PLAYBOOK_URL_ES) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback
        : cleanUrl(process.env.AGENT_PLAYBOOK_URL_EN) || cleanUrl(process.env.AGENT_PLAYBOOK_URL) || fallback;
  }

  return locale === "de"
    ? cleanUrl(process.env.INTERNATIONAL_PLAYBOOK_URL_DE) || cleanUrl(process.env.INTERNATIONAL_PLAYBOOK_URL) || fallback
    : locale === "es"
      ? cleanUrl(process.env.INTERNATIONAL_PLAYBOOK_URL_ES) || cleanUrl(process.env.INTERNATIONAL_PLAYBOOK_URL) || fallback
      : cleanUrl(process.env.INTERNATIONAL_PLAYBOOK_URL_EN) || cleanUrl(process.env.INTERNATIONAL_PLAYBOOK_URL) || fallback;
}

function getFormId(role: PrimaryPlaybookType) {
  return role === "developer"
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
  playbookKeys: PlaybookKey[];
  primaryRole: PrimaryPlaybookType;
  internationalBuyers: boolean;
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
  playbookKeys,
  role,
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
  playbookKeys: PlaybookKey[];
  role: PrimaryPlaybookType;
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
  const formId = getFormId(role);

  if (!portalId || !formId) {
    return { skipped: true, portalConfigured: Boolean(portalId), formConfigured: Boolean(formId) };
  }

  const requestedPlaybooks = playbookKeys.join(",");
  const trackedUtmContent = [utm.utm_content, `playbooks:${requestedPlaybooks}`].filter(Boolean).join("|");
  const legalConsentOptions: Record<string, unknown> = {
    consent: {
      consentToProcess: consentRequired,
      text: `Visitor requested NovaLure playbooks ${requestedPlaybooks} and consented to data processing for email delivery. Privacy policy version: ${privacyPolicyVersion}.`
    }
  };

  const hubSpotPayload = {
    fields: [
      { name: "email", value: email },
      { name: "firstname", value: name },
      { name: "company", value: company },
      { name: "phone", value: phone },
      { name: "requested_playbook", value: role },
      { name: "segment", value: segment },
      { name: "utm_source", value: utm.utm_source || "" },
      { name: "utm_medium", value: utm.utm_medium || "" },
      { name: "utm_campaign", value: utm.utm_campaign || "" },
      { name: "utm_content", value: trackedUtmContent },
      { name: "utm_term", value: utm.utm_term || "" }
    ],
    context: { pageName: "NovaLure Playbook Request", pageUri },
    legalConsentOptions
  };

  const claim = await claimHubSpotSubmission(submissionId, hubSpotPayload);
  if (claim === "replay") return { skipped: false, replayed: true };
  if (claim === "processing") return { skipped: true, reason: "identical_submission_processing" };

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
    throw new Error(`HubSpot submission failed: ${await response.text()}`);
  }

  await completeHubSpotSubmission(submissionId, claim.claimId);
  return { skipped: false };
}

async function sendPlaybookEmail({
  keys,
  name,
  email,
  submissionId
}: {
  keys: PlaybookKey[];
  name: string;
  email: string;
  submissionId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Resend configuration missing");

  const { locale } = getPlaybookParts(keys[0]);
  const siteUrl = resolveDeploymentContext().publicOrigin;
  const items = keys.map((key) => {
    const { type } = getPlaybookParts(key);
    return { key, copy: playbookCopy[locale][type], url: getPlaybookUrl(key), title: playbooks[key].title };
  });
  const primaryCopy = items[0].copy;
  const multiple = items.length > 1;
  const subject = multiple ? playbookCopy[locale].multipleSubject : primaryCopy.subject;
  const headline = multiple ? playbookCopy[locale].multipleHeadline : primaryCopy.headline;
  const intro = multiple ? playbookCopy[locale].multipleIntro : primaryCopy.intro;
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
  const buttons = items.map((item) => renderEmailButton(item.url, item.copy.cta)).join("");
  const textLinks = items.map((item) => `${item.title}: ${item.url}`).join("\n");

  const resend = new Resend(apiKey);
  await sendResendEmail(
    resend,
    {
      from,
      to: email,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111318;max-width:620px;margin:0 auto;padding:32px">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(intro)}</div>
          <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">${escapeHtml(headline)}</h1>
          <p>${escapeHtml(greeting)}</p>
          <p>${escapeHtml(intro)}</p>
          ${buttons}
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
      text: `${greeting}\n\n${intro}\n\n${textLinks}\n\n${playbookCopy[locale].audit}\n${auditUrl}\n\n${footer.signoff}\n${footer.privacy}: ${privacyUrl}\n${footer.legal}: ${legalUrl}\n${footer.unsubscribe}: ${unsubscribeUrl}`
    },
    { idempotencyKey: getScopedIdempotencyKey("playbook", submissionId) }
  );
}

async function sendOwnerNotificationEmail({
  keys,
  role,
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
  keys: PlaybookKey[];
  role: PrimaryPlaybookType;
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
  if (!apiKey || !from) throw new Error("Resend configuration missing");

  const selections = keys.map((key) => `${key} - ${playbooks[key].title}`).join(" | ");
  const links = keys.map((key) => `${playbooks[key].title}: ${getPlaybookUrl(key)}`).join(" | ");
  const rows = [
    ["Name", name],
    ["E-Mail", email],
    ["Unternehmen", company],
    ["Telefon", phone || "-"],
    ["Primärsegment", role],
    ["Internationale Käufer", keys.some((key) => key.endsWith("-international")) ? "ja" : "nein"],
    ["Playbooks", selections],
    ["Submission-ID", submissionId],
    ["Downloadlinks", links],
    ["Seite", pageUri],
    ["Marketing Opt-in", consentMarketing ? "ja, Double-Opt-in angefordert, noch nicht bestätigt" : "nein"],
    ["Consent-Zeitpunkt", consentTimestamp],
    ["IP", ipAddress || "-"],
    ["User-Agent", userAgent || "-"]
  ];

  const resend = new Resend(apiKey);
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
  if (!apiKey || !from) throw new Error("Resend configuration missing");

  const { locale } = getPlaybookParts(key);
  const siteUrl = resolveDeploymentContext().publicOrigin;
  const issuedAt = consentTimestamp;
  const expiresAt = new Date(Date.parse(issuedAt) + 24 * 60 * 60 * 1000).toISOString();
  const token = createDoubleOptInToken({
    email,
    locale,
    playbook: key,
    issuedAt,
    expiresAt,
    privacyPolicyVersion,
    tokenId: submissionId
  });
  const registration = await registerDoubleOptInToken(submissionId, expiresAt);
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

  if (ipRateLimit.rateLimited) return rateLimitResponse(ipRateLimit);

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
  if (website) return NextResponse.json({ ok: true });

  try {
    const locale: PlaybookLocale = body.locale === "de" || body.locale === "es" ? body.locale : "en";
    const role = parsePrimaryRole(body.role ?? body.playbook);
    if (!role) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const internationalBuyers = body.internationalBuyers === true;
    const playbookKeys = parseRequestedPlaybooks(body.playbooks, locale, role, internationalBuyers);
    if (!playbookKeys) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const primaryPlaybookKey = playbookKeys[0];
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const segment = typeof body.segment === "string" ? body.segment.trim() : role === "developer" ? "developers" : "agents";
    const utm = typeof body.utm === "object" && body.utm
      ? Object.fromEntries(Object.entries(body.utm).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
      : {};
    const consentRequired = body.consentRequired === true;
    const consentMarketing = body.consentMarketing === true;
    const consentTimestampInput = typeof body.consentTimestamp === "string" ? body.consentTimestamp : "";
    const consentTimestampMs = Date.parse(consentTimestampInput);
    const consentTimestamp = Number.isFinite(consentTimestampMs) ? new Date(consentTimestampMs).toISOString() : "";
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
    if (recipientRateLimit.rateLimited) return rateLimitResponse(recipientRateLimit);

    let hubspotResult;
    try {
      hubspotResult = await submitToHubSpot({
        playbookKeys,
        role,
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

    logConsent({
      email,
      playbookKeys,
      primaryRole: role,
      internationalBuyers,
      consentRequired,
      consentMarketing,
      consentTimestamp,
      ipAddress,
      userAgent
    });

    if (hubspotResult.skipped) {
      console.warn("novalure_hubspot_submission_skipped", JSON.stringify(hubspotResult));
    }

    await sendPlaybookEmail({ keys: playbookKeys, name, email, submissionId });

    if (consentMarketing) {
      const doubleOptIn = await sendDoubleOptInEmail({
        key: primaryPlaybookKey,
        email,
        submissionId,
        consentTimestamp
      });
      console.info("novalure_double_opt_in_email_ready", JSON.stringify({
        email,
        locale,
        playbooks: playbookKeys,
        privacyPolicyVersion,
        status: doubleOptIn.status,
        recordedAt: new Date().toISOString(),
        provider: "resend"
      }));
    }

    await sendOwnerNotificationEmail({
      keys: playbookKeys,
      role,
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

    return NextResponse.json({ ok: true, locale, playbooks: playbookKeys });
  } catch (error) {
    console.error("novalure_playbook_request_failed", error);
    return unavailableResponse();
  }
}
