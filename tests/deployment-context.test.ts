import { afterEach, describe, expect, it, vi } from "vitest";
import { getScopedIdempotencyKey, resolveDeploymentContext } from "@/lib/deployment-context";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("deployment context", () => {
  it("uses the canonical production origin", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu/");
    expect(resolveDeploymentContext()).toMatchObject({
      environment: "production",
      origin: "https://www.novalure.eu",
      audience: "production:https://www.novalure.eu",
      ipRateLimitId: "novalure-playbook-submit"
    });
  });

  it("ignores a production URL and binds Preview to its immutable deployment URL", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    vi.stubEnv("VERCEL_URL", "novalure-preview.vercel.app");
    expect(resolveDeploymentContext()).toMatchObject({
      environment: "preview",
      origin: "https://novalure-preview.vercel.app",
      audience: "preview:https://novalure-preview.vercel.app",
      ipRateLimitId: "novalure-playbook-submit-preview"
    });
  });

  it("fails closed for missing or unsafe deployed origins", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "");
    expect(() => resolveDeploymentContext()).toThrow(/missing/);

    vi.stubEnv("VERCEL_URL", "http://preview.example.com");
    expect(() => resolveDeploymentContext()).toThrow(/invalid/);
  });

  it("never reuses the public Production URL for development links", () => {
    vi.stubEnv("VERCEL_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    expect(resolveDeploymentContext()).toMatchObject({
      environment: "development",
      origin: "http://localhost:3000",
      audience: "development:http://localhost:3000"
    });

    vi.stubEnv("PLAYBOOK_DEVELOPMENT_ORIGIN", "http://localhost:3001");
    expect(resolveDeploymentContext().origin).toBe("http://localhost:3001");

    vi.stubEnv("PLAYBOOK_DEVELOPMENT_ORIGIN", "https://www.novalure.eu");
    expect(() => resolveDeploymentContext()).toThrow(/must use localhost/);
  });

  it("scopes idempotency keys by deployment", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "preview-a.vercel.app");
    const first = getScopedIdempotencyKey("doi", "submission-id");
    const retry = getScopedIdempotencyKey("doi", "submission-id");
    vi.stubEnv("VERCEL_URL", "preview-b.vercel.app");
    const second = getScopedIdempotencyKey("doi", "submission-id");

    expect(first).toBe(retry);
    expect(first).not.toBe(second);
  });
});
