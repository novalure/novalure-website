import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type Locale = "en" | "de";

const defaultBookingUrls: Record<Locale, string> = {
  en: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en",
  de: "https://meetings-eu1.hubspot.com/franz-romih"
};

const autoReplyCopy = {
  en: {
    subject: "Thank you for your inquiry – Novalure",
    button: "Book a 30-minute strategy call",
    htmlBody: (firstName: string) => `Hi ${firstName},

thank you for reaching out to Novalure.

We have received your inquiry and will get back to you as soon as possible.

You have taken the right step if you want to build a stronger and more scalable sales pipeline.

If you want to move faster, you can directly book a 30-minute strategy call here:

Best regards
The Novalure Team`,
    textBody: (firstName: string, bookingLink: string) => `Hi ${firstName},

thank you for reaching out to Novalure.

We have received your inquiry and will get back to you as soon as possible.

You have taken the right step if you want to build a stronger and more scalable sales pipeline.

If you want to move faster, you can directly book a 30-minute strategy call here:

${bookingLink}

Best regards
The Novalure Team`
  },
  de: {
    subject: "Vielen Dank für Ihre Anfrage – Novalure",
    button: "30-minütiges Gespräch buchen",
    htmlBody: (firstName: string) => `Hallo ${firstName},

vielen Dank für Ihre Anfrage.

Wir melden uns umgehend bei Ihnen.

Wenn Sie direkt weitermachen möchten, können Sie hier ein 30-minütiges Gespräch buchen:

Beste Grüße
Ihr Novalure Team`,
    textBody: (firstName: string, bookingLink: string) => `Hallo ${firstName},

vielen Dank für Ihre Anfrage.

Wir melden uns umgehend bei Ihnen.

Wenn Sie direkt weitermachen möchten, können Sie hier ein 30-minütiges Gespräch buchen:

${bookingLink}

Beste Grüße
Ihr Novalure Team`
  }
} as const;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";
}

function withSchedulerLocale(url: string, language: Locale) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}locale=${language === "de" ? "de-de" : "en-us"}`;
}

function getBookingLink(language: Locale) {
  const localized = language === "de" ? process.env.CONTACT_BOOKING_URL_DE : process.env.CONTACT_BOOKING_URL_EN;
  const configuredUrl =
    localized ||
    process.env.CONTACT_BOOKING_URL ||
    (language === "de" ? process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_DE : process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_EN) ||
    process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL ||
    defaultBookingUrls[language];

  return withSchedulerLocale(configuredUrl, language) || `${getSiteUrl()}${language === "de" ? "/de/kontakt" : "/en/contact"}#book-audit`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const company = clean(body.company);
    const interest = clean(body.interest);
    const language: Locale = body.language === "de" ? "de" : "en";

    if (!firstName || !lastName || !phone || !company || !interest || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.CONTACT_SENDER_EMAIL || "hello@novalure.eu";

    if (!apiKey) {
      console.error("Contact form email configuration is missing.");
      return NextResponse.json({ error: "Email configuration missing" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const timestamp = new Date().toISOString();
    const bookingUrl = getBookingLink(language);
    const interestLabel =
      interest === "developers"
        ? language === "de"
          ? "Bauträger"
          : "Developers"
        : language === "de"
          ? "Immobilienmakler"
          : "Real Estate Agents";

    const internalText = `New Novalure contact inquiry

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company}
Interest: ${interestLabel}
Language: ${language.toUpperCase()}
Timestamp: ${timestamp}`;

    const internalHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>New Novalure contact inquiry</h2>
        <p><strong>First Name:</strong> ${escapeHtml(firstName)}</p>
        <p><strong>Last Name:</strong> ${escapeHtml(lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Interest:</strong> ${escapeHtml(interestLabel)}</p>
        <p><strong>Language:</strong> ${language.toUpperCase()}</p>
        <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
      </div>
    `;

    const internalEmail = await resend.emails.send({
      from: sender,
      to: "hello@novalure.eu",
      subject: `New Novalure contact inquiry (${language.toUpperCase()})`,
      replyTo: email,
      text: internalText,
      html: internalHtml
    });

    if (internalEmail.error) {
      throw new Error(internalEmail.error.message);
    }

    const customerText = autoReplyCopy[language].textBody(firstName, bookingUrl);
    const customerHtmlText = autoReplyCopy[language].htmlBody(firstName);
    const customerEmail = await resend.emails.send({
      from: sender,
      to: email,
      subject: autoReplyCopy[language].subject,
      text: customerText,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827; max-width: 620px; margin: 0 auto; padding: 28px;">
          <p>${textToHtml(customerHtmlText)}</p>
          <p style="margin: 28px 0;">
            <a href="${escapeHtml(bookingUrl)}" style="display: inline-block; background: #ffd43b; color: #211800; font-weight: 700; text-decoration: none; padding: 14px 20px; border-radius: 999px;">
              ${escapeHtml(autoReplyCopy[language].button)}
            </a>
          </p>
        </div>
      `
    });

    if (customerEmail.error) {
      console.error("Contact form auto-reply failed:", customerEmail.error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json({ error: "Contact form submission failed" }, { status: 500 });
  }
}
