import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createDoubleOptInToken,
  getDoubleOptInTokenFingerprint,
  verifyDoubleOptInToken,
  type DoubleOptInPayload
} from "@/lib/double-opt-in-token";

const currentSecret = "current-secret-with-at-least-32-bytes";
const previousSecret = "previous-secret-with-at-least-32-bytes";
const tokenId = "11111111-1111-4111-8111-111111111111";

function payload(overrides: Partial<DoubleOptInPayload> = {}): DoubleOptInPayload {
  const now = Date.now();
  return {
    version: 2,
    purpose: "marketing-doi",
    audience: "production:https://www.novalure.eu",
    email: "reader@example.com",
    locale: "en",
    playbook: "en-agent",
    issuedAt: new Date(now - 1_000).toISOString(),
    expiresAt: new Date(now + 60 * 60 * 1000).toISOString(),
    privacyPolicyVersion: "2026-08-01",
    tokenId,
    ...overrides
  };
}

function signPayload(value: DoubleOptInPayload, secret = currentSecret) {
  const encoded = Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

beforeEach(() => {
  vi.stubEnv("DOUBLE_OPT_IN_SECRET", currentSecret);
  vi.stubEnv("DOUBLE_OPT_IN_PREVIOUS_SECRET", "");
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("double opt-in tokens", () => {
  it("signs a normalized, policy-bound payload", () => {
    const token = createDoubleOptInToken({
      email: " Reader@Example.com ",
      locale: "en",
      playbook: "en-agent",
      issuedAt: payload().issuedAt,
      expiresAt: payload().expiresAt,
      privacyPolicyVersion: "2026-08-01",
      tokenId
    });

    expect(verifyDoubleOptInToken(token)).toMatchObject({
      audience: "production:https://www.novalure.eu",
      email: "reader@example.com",
      privacyPolicyVersion: "2026-08-01",
      tokenId
    });
  });

  it("accepts a locale-matched Spanish playbook token", () => {
    const token = createDoubleOptInToken({
      email: "lector@example.com",
      locale: "es",
      playbook: "es-developer",
      issuedAt: payload().issuedAt,
      expiresAt: payload().expiresAt,
      privacyPolicyVersion: "2026-08-01",
      tokenId
    });

    expect(verifyDoubleOptInToken(token)).toMatchObject({
      locale: "es",
      playbook: "es-developer"
    });
  });

  it("requires a current secret of at least 32 bytes", () => {
    vi.stubEnv("DOUBLE_OPT_IN_SECRET", "too-short");
    expect(() => signPayload(payload())).not.toThrow();
    expect(() => createDoubleOptInToken(payload())).toThrow(/32 bytes/);
    expect(() => verifyDoubleOptInToken(signPayload(payload()))).toThrow(/32 bytes/);
  });

  it("accepts the previous key only while a valid current key exists", () => {
    const oldToken = signPayload(payload(), previousSecret);
    vi.stubEnv("DOUBLE_OPT_IN_SECRET", currentSecret);
    vi.stubEnv("DOUBLE_OPT_IN_PREVIOUS_SECRET", previousSecret);
    expect(verifyDoubleOptInToken(oldToken)?.tokenId).toBe(tokenId);

    vi.stubEnv("DOUBLE_OPT_IN_SECRET", "");
    expect(() => verifyDoubleOptInToken(oldToken)).toThrow(/32 bytes/);
  });

  it("rejects an invalid or duplicate previous key", () => {
    const token = signPayload(payload());
    vi.stubEnv("DOUBLE_OPT_IN_PREVIOUS_SECRET", "short");
    expect(() => verifyDoubleOptInToken(token)).toThrow(/PREVIOUS/);

    vi.stubEnv("DOUBLE_OPT_IN_PREVIOUS_SECRET", currentSecret);
    expect(() => verifyDoubleOptInToken(token)).toThrow(/PREVIOUS/);
  });

  it("rejects non-canonical base64url aliases of the signature", () => {
    const token = signPayload(payload());
    const [encoded, signature] = token.split(".");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const lastIndex = alphabet.indexOf(signature.at(-1) || "");
    const alias = `${signature.slice(0, -1)}${alphabet[lastIndex + 1]}`;

    expect(Buffer.from(alias, "base64url")).toEqual(Buffer.from(signature, "base64url"));
    expect(verifyDoubleOptInToken(`${encoded}.${alias}`)).toBeNull();
  });

  it("rejects payload tampering and extra token segments", () => {
    const token = signPayload(payload());
    const [encoded, signature] = token.split(".");
    const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DoubleOptInPayload;
    decoded.privacyPolicyVersion = "changed";
    const tampered = Buffer.from(JSON.stringify(decoded), "utf8").toString("base64url");

    expect(verifyDoubleOptInToken(`${tampered}.${signature}`)).toBeNull();
    expect(verifyDoubleOptInToken(`${token}.extra`)).toBeNull();
  });

  it("rejects a valid preview token on production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "novalure-preview.vercel.app");
    const token = createDoubleOptInToken({
      email: "reader@example.com",
      locale: "en",
      playbook: "en-agent",
      issuedAt: payload().issuedAt,
      expiresAt: payload().expiresAt,
      privacyPolicyVersion: "2026-08-01",
      tokenId
    });

    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    expect(verifyDoubleOptInToken(token)).toBeNull();
  });

  it("surfaces a missing Preview origin as configuration failure", () => {
    const token = signPayload(payload({ audience: "preview:https://preview.example.com" }));
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "");
    expect(() => verifyDoubleOptInToken(token)).toThrow(/origin is missing/);
  });

  it.each([
    ["expired", () => payload({ expiresAt: new Date(Date.now() - 1).toISOString() })],
    ["future-issued", () => payload({ issuedAt: new Date(Date.now() + 6 * 60 * 1000).toISOString() })],
    ["overlong", () => {
      const issuedAt = new Date(Date.now() - 1_000).toISOString();
      return payload({
        issuedAt,
        expiresAt: new Date(Date.parse(issuedAt) + 24 * 60 * 60 * 1000 + 1).toISOString()
      });
    }],
    ["locale-mismatch", () => payload({ locale: "de", playbook: "en-agent" })],
    ["non-canonical-date", () => payload({ issuedAt: "August 1, 2026" })],
    ["invalid-token-id", () => payload({ tokenId: "not-a-uuid" })]
  ])("rejects a %s signed payload", (_name, makePayload) => {
    expect(verifyDoubleOptInToken(signPayload(makePayload()))).toBeNull();
  });

  it("fingerprints the exact canonical token", () => {
    const first = signPayload(payload());
    const second = signPayload(payload({ tokenId: "22222222-2222-4222-8222-222222222222" }));
    expect(getDoubleOptInTokenFingerprint(first)).toMatch(/^[0-9a-f]{64}$/);
    expect(getDoubleOptInTokenFingerprint(first)).not.toBe(getDoubleOptInTokenFingerprint(second));
  });
});
