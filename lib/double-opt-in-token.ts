import { createHmac, timingSafeEqual } from "node:crypto";

export type DoubleOptInPayload = {
  email: string;
  locale: "de" | "en";
  playbook: string;
  expiresAt: string;
};

function getSecret() {
  return process.env.DOUBLE_OPT_IN_SECRET || process.env.RESEND_API_KEY || "novalure-local-development-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createDoubleOptInToken(payload: DoubleOptInPayload) {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyDoubleOptInToken(token: string): DoubleOptInPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DoubleOptInPayload;
  if (!payload.email || !payload.expiresAt || Date.parse(payload.expiresAt) < Date.now()) {
    return null;
  }

  return payload;
}
