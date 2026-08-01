import { NextRequest, NextResponse } from "next/server";
import {
  getDoubleOptInTokenFingerprint,
  verifyDoubleOptInToken,
  type DoubleOptInPayload
} from "@/lib/double-opt-in-token";
import {
  claimDoubleOptInToken,
  completeDoubleOptInToken,
  releaseDoubleOptInToken
} from "@/lib/double-opt-in-state";
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
  form,
  locale = "de"
}: {
  title: string;
  body?: string;
  form?: { token: string; label: string };
  locale?: "de" | "en";
}) {
  return `<!doctype html>
    <html lang="${locale}">
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

function getPayload(token: string): {
  payload: DoubleOptInPayload | null;
  configurationError: boolean;
} {
  try {
    return { payload: verifyDoubleOptInToken(token), configurationError: false };
  } catch (error) {
    console.error("novalure_double_opt_in_configuration_failed", error);
    return { payload: null, configurationError: true };
  }
}

function configurationUnavailable(locale: "de" | "en" = "de") {
  const isGerman = locale === "de";
  return htmlResponse(page({
    locale,
    title: isGerman ? "Bestätigung vorübergehend nicht möglich" : "Confirmation temporarily unavailable",
    body: isGerman
      ? "Bitte versuchen Sie es in einigen Minuten erneut."
      : "Please try again in a few minutes."
  }), 503);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const { payload, configurationError } = getPayload(token);

  if (configurationError) {
    return configurationUnavailable();
  }

  if (!payload) {
    return htmlResponse(page({
      title: "Bestätigungslink ungültig",
      body: "Der Link ist ungültig oder abgelaufen."
    }), 400);
  }

  const isGerman = payload.locale === "de";
  return htmlResponse(page({
    locale: payload.locale,
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
  let token = "";
  try {
    const formData = await request.formData();
    token = typeof formData.get("token") === "string" ? String(formData.get("token")) : "";
  } catch {
    return htmlResponse(page({
      title: "Bestätigungslink ungültig",
      body: "Der Link ist ungültig oder abgelaufen."
    }), 400);
  }

  const { payload, configurationError } = getPayload(token);

  if (configurationError) {
    return configurationUnavailable();
  }

  if (!payload) {
    return htmlResponse(page({
      title: "Bestätigungslink ungültig",
      body: "Der Link ist ungültig oder abgelaufen."
    }), 400);
  }

  const isGerman = payload.locale === "de";
  let claim: Awaited<ReturnType<typeof claimDoubleOptInToken>>;
  try {
    claim = await claimDoubleOptInToken(payload.tokenId);
  } catch (error) {
    console.error("novalure_double_opt_in_state_claim_failed", error);
    return configurationUnavailable(payload.locale);
  }

  if (claim.status === "missing") {
    return htmlResponse(page({
      locale: payload.locale,
      title: isGerman ? "Bestätigungslink ungültig" : "Invalid confirmation link",
      body: isGerman
        ? "Der Link ist ungültig oder abgelaufen."
        : "This link is invalid or has expired."
    }), 400);
  }

  if (claim.status === "processing") {
    return htmlResponse(page({
      locale: payload.locale,
      title: isGerman ? "Bestätigung wird verarbeitet" : "Confirmation in progress",
      body: isGerman
        ? "Die Bestätigung wird bereits verarbeitet. Bitte versuchen Sie es in einigen Minuten erneut."
        : "This confirmation is already being processed. Please try again in a few minutes."
    }), 409);
  }

  if (claim.status === "used") {
    return htmlResponse(page({
      locale: payload.locale,
      title: isGerman ? "Bereits bestätigt" : "Already confirmed",
      body: isGerman
        ? "Dieser Bestätigungslink wurde bereits verwendet."
        : "This confirmation link has already been used."
    }));
  }

  if (claim.status === "blocked") {
    return htmlResponse(page({
      locale: payload.locale,
      title: isGerman ? "E-Mail-Einstellungen unverändert" : "Email preferences unchanged",
      body: isGerman
        ? "Ihre bestehende Abmeldung wurde nicht aufgehoben."
        : "Your existing unsubscribe preference was not changed."
    }));
  }

  const confirmedAt = new Date().toISOString();
  let result: Awaited<ReturnType<typeof persistMarketingConfirmation>>;
  try {
    result = await persistMarketingConfirmation({
      email: payload.email,
      playbook: payload.playbook,
      confirmedAt,
      privacyPolicyVersion: payload.privacyPolicyVersion,
      tokenFingerprint: getDoubleOptInTokenFingerprint(token)
    });
  } catch (error) {
    console.error("novalure_marketing_consent_persistence_failed", error);
    try {
      await releaseDoubleOptInToken(payload.tokenId, claim.claimId);
    } catch (releaseError) {
      console.error("novalure_double_opt_in_state_release_failed", releaseError);
    }
    return configurationUnavailable(payload.locale);
  }

  try {
    await completeDoubleOptInToken(
      payload.tokenId,
      claim.claimId,
      result.status === "suppressed" ? "blocked" : "used"
    );
  } catch (error) {
    console.error("novalure_double_opt_in_state_completion_failed", error);
    return configurationUnavailable(payload.locale);
  }

  if (result.status === "suppressed") {
    console.info("novalure_marketing_consent_preserved_opt_out", JSON.stringify({
      email: payload.email,
      locale: payload.locale,
      playbook: payload.playbook,
      confirmedAt,
      privacyPolicyVersion: payload.privacyPolicyVersion,
      systemOfRecord: "resend"
    }));

    return htmlResponse(page({
      locale: payload.locale,
      title: isGerman ? "E-Mail-Einstellungen unverändert" : "Email preferences unchanged",
      body: isGerman
        ? "Ihre bestehende Abmeldung wurde nicht aufgehoben."
        : "Your existing unsubscribe preference was not changed."
    }));
  }

  if (result.status === "already_confirmed") {
    return htmlResponse(page({
      locale: payload.locale,
      title: isGerman ? "Bereits bestätigt" : "Already confirmed",
      body: isGerman
        ? "Dieser Bestätigungslink wurde bereits verwendet."
        : "This confirmation link has already been used."
    }));
  }

  console.info("novalure_marketing_consent_confirmed", JSON.stringify({
    email: payload.email,
    locale: payload.locale,
    playbook: payload.playbook,
    confirmedAt,
    privacyPolicyVersion: payload.privacyPolicyVersion,
    systemOfRecord: "resend"
  }));

  const message = isGerman
    ? "Danke. Ihre E-Mail-Updates sind bestätigt."
    : "Thank you. Your email updates are confirmed.";

  return htmlResponse(page({ title: message, locale: payload.locale }));
}
