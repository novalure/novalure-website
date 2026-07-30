import { NextRequest, NextResponse } from "next/server";
import { verifyDoubleOptInToken } from "@/lib/double-opt-in-token";
import { privacyPolicyVersion } from "@/lib/playbooks-meta";
import { persistMarketingConfirmation } from "@/lib/resend-marketing";

const responseHeaders = {
  "cache-control": "no-store, max-age=0",
  "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  "content-type": "text/html; charset=utf-8",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff"
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character] || character));
}

function page({
  title,
  body,
  form
}: {
  title: string;
  body?: string;
  form?: { token: string; label: string };
}) {
  return `<!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>NovaLure</title>
      </head>
      <body style="font-family:Arial,sans-serif;padding:32px;color:#111318;background:#f8f8f6">
        <main style="max-width:620px;margin:48px auto;background:#fff;padding:32px;border-radius:12px">
          <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">${escapeHtml(title)}</h1>
          ${body ? `<p style="line-height:1.6">${escapeHtml(body)}</p>` : ""}
          ${form ? `
            <form method="post" action="/api/playbook/confirm" style="margin-top:24px">
              <input type="hidden" name="token" value="${escapeHtml(form.token)}">
              <button type="submit" style="appearance:none;border:0;border-radius:8px;background:#ffd43b;color:#211800;font:700 16px Arial,sans-serif;padding:14px 22px;cursor:pointer">
                ${escapeHtml(form.label)}
              </button>
            </form>
          ` : ""}
        </main>
      </body>
    </html>`;
}

function htmlResponse(html: string, status = 200) {
  return new NextResponse(html, { status, headers: responseHeaders });
}

function getPayload(token: string) {
  try {
    return verifyDoubleOptInToken(token);
  } catch (error) {
    console.error("novalure_double_opt_in_configuration_failed", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const payload = getPayload(token);

  if (!payload) {
    return htmlResponse(page({
      title: "Bestätigungslink ungültig",
      body: "Der Link ist ungültig oder abgelaufen."
    }), 400);
  }

  const isGerman = payload.locale === "de";
  return htmlResponse(page({
    title: isGerman ? "E-Mail-Updates bestätigen" : "Confirm email updates",
    body: isGerman
      ? "Bitte bestätigen Sie Ihre Zustimmung. Erst danach werden E-Mail-Updates aktiviert."
      : "Please confirm your consent. Email updates are activated only after this step.",
    form: {
      token,
      label: isGerman ? "Zustimmung bestätigen" : "Confirm subscription"
    }
  }));
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = typeof formData.get("token") === "string" ? String(formData.get("token")) : "";
  const payload = getPayload(token);

  if (!payload) {
    return htmlResponse(page({
      title: "Bestätigungslink ungültig",
      body: "Der Link ist ungültig oder abgelaufen."
    }), 400);
  }

  const confirmedAt = new Date().toISOString();
  try {
    await persistMarketingConfirmation({
      email: payload.email,
      playbook: payload.playbook,
      confirmedAt,
      privacyPolicyVersion
    });
  } catch (error) {
    console.error("novalure_marketing_consent_persistence_failed", error);
    const isGerman = payload.locale === "de";
    return htmlResponse(page({
      title: isGerman ? "Bestätigung vorübergehend nicht möglich" : "Confirmation temporarily unavailable",
      body: isGerman
        ? "Bitte versuchen Sie es in einigen Minuten erneut."
        : "Please try again in a few minutes."
    }), 503);
  }

  console.info("novalure_marketing_consent_confirmed", JSON.stringify({
    email: payload.email,
    locale: payload.locale,
    playbook: payload.playbook,
    confirmedAt,
    privacyPolicyVersion,
    systemOfRecord: "resend"
  }));

  const message = payload.locale === "de"
    ? "Danke. Ihre E-Mail-Updates sind bestätigt."
    : "Thank you. Your email updates are confirmed.";

  return htmlResponse(page({ title: message }));
}
