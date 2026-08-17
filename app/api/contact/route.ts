import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type Locale = "en" | "de" | "es";

const autoReplyCopy = {
  en: {
    auditSubject: "Your NovaLure Project Check request",
    directSubject: "Your NovaLure enquiry",
    auditButton: "View preparation checklist",
    directButton: "Visit NovaLure",
    auditBody: (name: string) => `Hi ${name},

thank you for the Project Check request.

We will review your details first. The Project Check is a diagnosis and qualification step, not a free consulting report and not a lead guarantee.

Please prepare your current project or market area, lead sources, lead-management process, current landing pages or campaigns, biggest sales bottleneck, budget readiness and decision status.`,
    directBody: (name: string) => `Hi ${name},

thank you for your enquiry.

We have received your message and will review it directly.`
  },
  de: {
    auditSubject: "Ihre NovaLure Projekt-Check-Anfrage",
    directSubject: "Ihre NovaLure Anfrage",
    auditButton: "Vorbereitungsliste ansehen",
    directButton: "NovaLure öffnen",
    auditBody: (name: string) => `Hallo ${name},

vielen Dank für Ihre Projekt-Check-Anfrage.

Wir prüfen Ihre Angaben zuerst. Der Projekt-Check ist eine Diagnose und Qualifizierung, kein kostenloses Gutachten und keine Lead-Garantie.

Bitte bereiten Sie Ihr aktuelles Projekt oder Marktgebiet, Leadquellen, Leadmanagement-Prozess, aktuelle Landingpages oder Kampagnen, größten Vertriebsengpass, Budgetfähigkeit und Entscheiderstatus vor.`,
    directBody: (name: string) => `Hallo ${name},

vielen Dank für Ihre Anfrage.

Wir haben Ihre Nachricht erhalten und prüfen sie direkt.`
  },
  es: {
    auditSubject: "Su solicitud de análisis del proyecto de NovaLure",
    directSubject: "Su consulta a NovaLure",
    auditButton: "Ver la lista de preparación",
    directButton: "Visitar NovaLure",
    auditBody: (name: string) => `Hola, ${name}:

Gracias por solicitar el análisis del proyecto.

Primero revisaremos la información facilitada. El análisis es un paso de diagnóstico y cualificación, no un informe de consultoría gratuito ni una garantía de oportunidades.

Prepare su promoción o mercado actual, las fuentes de oportunidades, el proceso de gestión, las páginas o campañas activas, el principal cuello de botella comercial, la capacidad presupuestaria y el estado de decisión.`,
    directBody: (name: string) => `Hola, ${name}:

Gracias por su consulta.

Hemos recibido su mensaje y lo revisaremos directamente.`
  }
} as const;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => clean(item)).filter(Boolean) : [];
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

function textToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function renderEmailButton(href: string, label: string) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0;">
      <tr>
        <td bgcolor="#ffd43b" style="border:1px solid #ffd43b;border-radius:8px;">
          <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 22px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;font-weight:700;color:#211800;text-decoration:none;border-radius:8px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function getSiteUrl() {
  const configuredUrl = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return (configuredUrl || "https://www.novalure.eu").replace(/\/+$/, "");
}

function cleanUrl(value: string | undefined) {
  return value?.trim() || "";
}

function formatRows(rows: Record<string, string | string[]>) {
  return Object.entries(rows)
    .map(([label, value]) => `${label}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("\n");
}

function formatRowsHtml(rows: Record<string, string | string[]>) {
  return Object.entries(rows)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</p>`)
    .join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const language: Locale = body.language === "de" || body.language === "es" ? body.language : "en";
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const isDirectInquiry = Boolean(firstName || lastName || body.inquiry);
    const name = clean(body.name) || `${firstName} ${lastName}`.trim();
    const email = clean(body.email);
    const company = clean(body.company);
    const role = clean(body.role);
    const website = clean(body.website);
    const targetGroup = clean(body.targetGroup || body.interest);
    const projectMarket = clean(body.projectMarket);
    const leadProblem = clean(body.leadProblem || body.inquiry);
    const crm = clean(body.crm);
    const leadVolume = clean(body.leadVolume);
    const salesBottleneck = clean(body.salesBottleneck);
    const assets = cleanList(body.assets);
    const startTiming = clean(body.startTiming);
    const budgetReadiness = clean(body.budgetReadiness);
    const decisionStatus = clean(body.decisionStatus);
    const whyNow = clean(body.whyNow);
    const phone = clean(body.phone);
    const pageUri = clean(body.pageUri);
    const utm = typeof body.utm === "object" && body.utm ? body.utm as Record<string, unknown> : {};

    const directInvalid = isDirectInquiry && (
      !firstName ||
      !lastName ||
      !phone ||
      !company ||
      !targetGroup ||
      !leadProblem ||
      !isValidEmail(email)
    );
    const auditInvalid = !isDirectInquiry && (
      !name ||
      !company ||
      !role ||
      !website ||
      !targetGroup ||
      !projectMarket ||
      !leadProblem ||
      !crm ||
      !leadVolume ||
      !salesBottleneck ||
      !startTiming ||
      !budgetReadiness ||
      !decisionStatus ||
      !whyNow ||
      !isValidEmail(email)
    );

    if (directInvalid || auditInvalid) {
      return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.CONTACT_SENDER_EMAIL || process.env.RESEND_FROM_EMAIL || "hello@novalure.eu";

    if (!apiKey) {
      console.error("Contact form email configuration is missing.");
      return NextResponse.json({ error: "Email configuration missing" }, { status: 500 });
    }

    const rows: Record<string, string | string[]> = isDirectInquiry
      ? {
          Name: name,
          Email: email,
          Phone: phone,
          Company: company,
          Interest: targetGroup,
          Message: leadProblem,
          Language: language.toUpperCase(),
          Source: clean(body.source) || "direct_inquiry_form",
          Timestamp: new Date().toISOString()
        }
      : {
          Name: name,
          Email: email,
          Company: company,
          Role: role,
          Website: website,
          "Target group": targetGroup,
          "Project / market area": projectMarket,
          "Lead problem": leadProblem,
          CRM: crm,
          "Monthly lead volume": leadVolume,
          "Sales bottleneck": salesBottleneck,
          Assets: assets,
          "Start timing": startTiming,
          "Budget readiness": budgetReadiness,
          "Decision status": decisionStatus,
          "Why now": whyNow,
          Language: language.toUpperCase(),
          "Page URI": pageUri,
          "UTM source": clean(utm.utm_source),
          "UTM medium": clean(utm.utm_medium),
          "UTM campaign": clean(utm.utm_campaign),
          "UTM content": clean(utm.utm_content),
          "UTM term": clean(utm.utm_term),
          Timestamp: new Date().toISOString()
        };

    const resend = new Resend(apiKey);
    const softFit =
      budgetReadiness.toLowerCase().includes("nein") ||
      budgetReadiness.toLowerCase().includes("no,") ||
      decisionStatus.toLowerCase().includes("recherchiere") ||
      decisionStatus.toLowerCase().includes("only researching");

    const internalEmail = await resend.emails.send({
      from: sender,
      to: "hello@novalure.eu",
      subject: isDirectInquiry
        ? `New NovaLure direct enquiry (${language.toUpperCase()})`
        : `${softFit ? "[Soft fit] " : ""}New NovaLure Project Check request (${language.toUpperCase()})`,
      replyTo: email,
      text: `${isDirectInquiry ? "New NovaLure direct enquiry" : "New NovaLure Project Check request"}\n\n${formatRows(rows)}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>${isDirectInquiry ? "New NovaLure direct enquiry" : "New NovaLure Project Check request"}</h2>
          ${!isDirectInquiry && softFit ? "<p><strong>Soft-fit signal:</strong> Budget or decision status suggests setup may be too early.</p>" : ""}
          ${formatRowsHtml(rows)}
        </div>
      `
    });

    if (internalEmail.error) throw new Error(internalEmail.error.message);

    const reply = autoReplyCopy[language];
    const replySubject = isDirectInquiry ? reply.directSubject : reply.auditSubject;
    const replyBody = isDirectInquiry ? reply.directBody(name) : reply.auditBody(name);
    const replyButton = isDirectInquiry ? reply.directButton : reply.auditButton;
    const thankYouPath = language === "de"
      ? "/de/kontakt/danke"
      : language === "es"
        ? "/es/analisis-del-proyecto/gracias"
        : "/en/contact/thank-you";
    const thankYouUrl = isDirectInquiry ? getSiteUrl() : `${getSiteUrl()}${thankYouPath}`;

    const customerEmail = await resend.emails.send({
      from: sender,
      to: email,
      subject: replySubject,
      text: `${replyBody}\n\n${thankYouUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827; max-width: 620px; margin: 0 auto; padding: 28px;">
          <p>${textToHtml(replyBody)}</p>
          ${renderEmailButton(thankYouUrl, replyButton)}
        </div>
      `
    });

    if (customerEmail.error) {
      console.error("Contact form auto-reply failed:", customerEmail.error);
    }

    return NextResponse.json({ ok: true, softFit: isDirectInquiry ? false : softFit });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json({ error: "Contact form submission failed" }, { status: 500 });
  }
}
