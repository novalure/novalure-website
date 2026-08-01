import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { resolveDeploymentContext } from "@/lib/deployment-context";

export type DoubleOptInPayload = {
  version: 2;
  purpose: "marketing-doi";
  audience: string;
  email: string;
  locale: "de" | "en";
  playbook: string;
  issuedAt: string;
  expiresAt: string;
  privacyPolicyVersion: string;
  tokenId: string;
};

type NewDoubleOptInPayload = Omit<DoubleOptInPayload, "version" | "purpose" | "audience" | "issuedAt" | "tokenId"> & {
  issuedAt?: string;
  tokenId?: string;
};

function isStrongSecret(value: string) {
  return Buffer.byteLength(value, "utf8") >= 32;
}

function getCurrentSigningSecret() {
  const configuredSecret = process.env.DOUBLE_OPT_IN_SECRET?.trim();
  if (configuredSecret && isStrongSecret(configuredSecret)) return configuredSecret;
  throw new Error("DOUBLE_OPT_IN_SECRET must contain at least 32 bytes");
}

function getVerificationSecrets() {
  // Requiring the current key first prevents a stale rotation key from becoming
  // the only active trust anchor after an accidental configuration change.
  const currentSecret = getCurrentSigningSecret();
  const previousSecret = process.env.DOUBLE_OPT_IN_PREVIOUS_SECRET?.trim();
  if (!previousSecret) return [currentSecret];
  if (!isStrongSecret(previousSecret) || previousSecret === currentSecret) {
    throw new Error("DOUBLE_OPT_IN_PREVIOUS_SECRET is invalid");
  }
  return [currentSecret, previousSecret];
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer);
}

function isPayload(value: unknown): value is DoubleOptInPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Partial<DoubleOptInPayload>;
  const now = Date.now();
  const issuedAt = typeof payload.issuedAt === "string" ? Date.parse(payload.issuedAt) : Number.NaN;
  const expiresAt = typeof payload.expiresAt === "string" ? Date.parse(payload.expiresAt) : Number.NaN;

  return payload.version === 2
    && payload.purpose === "marketing-doi"
    && typeof payload.audience === "string"
    && payload.audience.length > 0
    && payload.audience.length <= 512
    && typeof payload.email === "string"
    && payload.email.length > 3
    && payload.email.length <= 320
    && payload.email === payload.email.trim().toLowerCase()
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
    && (payload.locale === "de" || payload.locale === "en")
    && typeof payload.playbook === "string"
    && /^(de|en)-(developer|agent)$/.test(payload.playbook)
    && payload.playbook.startsWith(`${payload.locale}-`)
    && Number.isFinite(issuedAt)
    && Number.isFinite(expiresAt)
    && new Date(issuedAt).toISOString() === payload.issuedAt
    && new Date(expiresAt).toISOString() === payload.expiresAt
    && issuedAt <= now + 5 * 60 * 1000
    && expiresAt > now
    && expiresAt > issuedAt
    && expiresAt - issuedAt <= 24 * 60 * 60 * 1000
    && typeof payload.privacyPolicyVersion === "string"
    && payload.privacyPolicyVersion.length > 0
    && payload.privacyPolicyVersion.length <= 100
    && typeof payload.tokenId === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.tokenId);
}

export function createDoubleOptInToken(payload: NewDoubleOptInPayload) {
  const completePayload: DoubleOptInPayload = {
    version: 2,
    purpose: "marketing-doi",
    audience: resolveDeploymentContext().audience,
    ...payload,
    email: payload.email.trim().toLowerCase(),
    issuedAt: payload.issuedAt || new Date().toISOString(),
    tokenId: payload.tokenId || randomUUID()
  };
  if (!isPayload(completePayload)) {
    throw new Error("Double opt-in token payload is invalid");
  }

  const encoded = Buffer.from(JSON.stringify(completePayload), "utf8").toString("base64url");
  const token = `${encoded}.${sign(encoded, getCurrentSigningSecret())}`;
  if (token.length > 4096) {
    throw new Error("Double opt-in token is too long");
  }
  return token;
}

export function verifyDoubleOptInToken(token: string): DoubleOptInPayload | null {
  if (!token || token.length > 4096) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (
    !encoded
    || !signature
    || !/^[A-Za-z0-9_-]+$/.test(encoded)
    || !/^[A-Za-z0-9_-]{43}$/.test(signature)
  ) return null;

  const validSignature = getVerificationSecrets().some((secret) =>
    signaturesMatch(signature, sign(encoded, secret))
  );
  if (!validSignature) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!isPayload(payload)) return null;

  // Deployment configuration errors must remain distinguishable from an
  // invalid token so the route can fail closed with HTTP 503 rather than 400.
  return payload.audience === resolveDeploymentContext().audience ? payload : null;
}

export function getDoubleOptInTokenFingerprint(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
