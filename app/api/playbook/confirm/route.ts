import { NextRequest, NextResponse } from "next/server";
import { verifyDoubleOptInToken } from "@/lib/double-opt-in-token";
import { privacyPolicyVersion } from "@/lib/playbooks-meta";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const payload = verifyDoubleOptInToken(token);

  if (!payload) {
    return new NextResponse("Confirmation link is invalid or expired.", { status: 400 });
  }

  console.info("novalure_marketing_consent_confirmed", JSON.stringify({
    email: payload.email,
    locale: payload.locale,
    playbook: payload.playbook,
    confirmedAt: new Date().toISOString(),
    privacyPolicyVersion
  }));

  const message = payload.locale === "de"
    ? "Danke. Ihre E-Mail-Updates sind bestätigt."
    : "Thank you. Your email updates are confirmed.";

  return new NextResponse(`<!doctype html><html><head><meta charset="utf-8"><title>NovaLure</title></head><body style="font-family:Arial,sans-serif;padding:32px;color:#111318"><h1>${message}</h1></body></html>`, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
