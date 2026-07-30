import { createHmac, timingSafeEqual } from "node:crypto";

export type DoubleOptInPayload = {
  email: string;
  locale: "de" | "en";
  playbook: string;
  expiresAt: string;
};

function getSigningSecret() {
  const configuredSecret = process.env.DOUBLE_OPT_IN_SECRET?.trim();
  if (configuredSecret) return configuredSecret;

  if (process.env.NODE_ENV !== "production") {
    return "novalure-local-development-secret";
  }

  throw new Error("DOUBLE_OPT_IN_SECRET is missing");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function signaturesMatch(actual: string, expected: string) {
  try {
    const actualBuffer = Buffer.from(actual, "base64url");
    const expectedBuffer = Buffer.from(expected, "base64url");

    return actualBuffer.length === expectedBuffer.length
      && timingSafeEqual(actualBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function createDoubleOptInToken(payload: DoubleOptInPayload) {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${sign(encoded, getSigningSecret())}`;
}

export function verifyDoubleOptInToken(token: string): DoubleOptInPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const verificationSecrets = [
    process.env.DOUBLE_OPT_IN_SECRET?.trim(),
    // Accept links created by the previous implementation until their 24-hour
    // expiry has elapsed. New links are never signed with the Resend key.
    process.env.RESEND_API_KEY?.trim(),
    process.env.NODE_ENV !== "production" ? "novalure-local-development-secret" : undefined
  ].filter((secret): secret is string => Boolean(secret));

  if (!verificationSecrets.length) {
    throw new Error("Double opt-in verification secret is missing");
  }

  const validSignature = verificationSecrets.some((secret) =>
    signaturesMatch(signature, sign(encoded, secret))
  );
  if (!validSignature) {
    return null;
  }

  let payload: DoubleOptInPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DoubleOptInPayload;
  } catch {
    return null;
  }

  if (
    typeof payload.email !== "string"
    || !payload.email
    || (payload.locale !== "de" && payload.locale !== "en")
    || typeof payload.playbook !== "string"
    || !payload.playbook
    || typeof payload.expiresAt !== "string"
    || Number.isNaN(Date.parse(payload.expiresAt))
    || Date.parse(payload.expiresAt) < Date.now()
  ) {
    return null;
  }

  return payload;
}
