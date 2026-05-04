import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type Locale = "en" | "de";

const bookingLink = "[BOOKING LINK PLACEHOLDER]";

const autoReplyCopy = {
  en: {
    subject: "Thank you for your inquiry – Novalure",
    body: (firstName: string) => `Hi ${firstName},

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
    body: (firstName: string) => `Hallo ${firstName},

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const language: Locale = body.language === "de" ? "de" : "en";

    if (!firstName || !lastName || !phone || !isValidEmail(email)) {
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

    const internalText = `New Novalure contact inquiry

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Language: ${language.toUpperCase()}
Timestamp: ${timestamp}`;

    const internalHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>New Novalure contact inquiry</h2>
        <p><strong>First Name:</strong> ${escapeHtml(firstName)}</p>
        <p><strong>Last Name:</strong> ${escapeHtml(lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
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

    const customerText = autoReplyCopy[language].body(firstName);
    const customerEmail = await resend.emails.send({
      from: sender,
      to: email,
      subject: autoReplyCopy[language].subject,
      text: customerText,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
          <p>${textToHtml(customerText)}</p>
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
