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
  const statusLabel = locale === "de" ? "E-Mail-Bestätigung" : "Email confirmation";
  const securityLabel = locale === "de" ? "Sicherer NovaLure Bestätigungsschritt" : "Secure NovaLure confirmation step";

  return `<!doctype html>
    <html lang="${locale}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>NovaLure</title>
      </head>
      <body style="box-sizing:border-box;margin:0;min-height:100vh;padding:0;color:#0e1b33;background:#fdfcfa;font-family:Arial,sans-serif">
        <header style="display:flex;min-height:72px;align-items:center;justify-content:space-between;padding:0 max(20px,4vw);border-bottom:1px solid rgba(14,27,51,.09);background:rgba(253,252,250,.96)">
          <strong style="font-size:19px;letter-spacing:.16em">NOVALURE</strong>
          <span style="color:#8f6f2e;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">${statusLabel}</span>
        </header>
        <main style="position:relative;display:grid;min-height:calc(100vh - 72px);place-items:center;overflow:hidden;padding:48px 20px;background:radial-gradient(circle at 8% 0%,rgba(199,165,91,.16),transparent 30%),radial-gradient(circle at 92% 22%,rgba(14,27,51,.07),transparent 34%),#fdfcfa">
          <section style="position:relative;width:min(680px,100%);box-sizing:border-box;padding:clamp(28px,5vw,52px);border:1px solid rgba(14,27,51,.1);border-radius:18px;background:#fff;box-shadow:0 24px 70px rgba(14,27,51,.12)">
            <span style="display:grid;width:52px;height:52px;place-items:center;margin-bottom:26px;border-radius:50%;color:#0e1b33;background:#c7a55b;font-size:22px;font-weight:700">✓</span>
            <p style="display:flex;gap:9px;align-items:center;margin:0 0 16px;color:#8f6f2e;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase"><span style="display:inline-block;width:22px;height:2px;background:#c7a55b"></span>${statusLabel}</p>
            <h1 style="max-width:600px;margin:0;color:#0e1b33;font-family:Georgia,serif;font-size:clamp(34px,7vw,52px);font-weight:400;line-height:1.08">${escapeHtml(title)}</h1>
            ${body ? `<p style="max-width:560px;margin:20px 0 0;color:#4a5570;font-size:16px;line-height:1.7">${escapeHtml(body)}</p>` : ""}
            ${form ? `
              <form method="post" action="/api/playbook/confirm" style="margin-top:28px">
                <input type="hidden" name="token" value="${escapeHtml(form.token)}">
                <button type="submit" style="appearance:none;min-height:48px;border:1px solid #c7a55b;border-radius:9px;background:#c7a55b;color:#0e1b33;font:700 15px Arial,sans-serif;padding:12px 22px;box-shadow:0 4px 14px rgba(199,165,91,.28);cursor:pointer">
                  ${escapeHtml(form.label)}
                </button>
              </form>
            ` : ""}
            <p style="margin:28px 0 0;padding-top:18px;color:#6a7288;border-top:1px solid rgba(14,27,51,.1);font-size:12px;line-height:1.5">${securityLabel}</p>
          </section>
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
