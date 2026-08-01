import { afterEach, describe, expect, it, vi } from "vitest";
import { getScopedIdempotencyKey, resolveDeploymentContext } from "@/lib/deployment-context";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("deployment context", () => {
  it("uses the canonical production origin", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu/");
    vi.stubEnv("VERCEL_BRANCH_URL", "attacker-controlled.vercel.app");
    expect(resolveDeploymentContext()).toMatchObject({
      environment: "production",
      origin: "https://www.novalure.eu",
      publicOrigin: "https://www.novalure.eu",
      audience: "production:https://www.novalure.eu",
      ipRateLimitId: "novalure-playbook-submit"
    });
  });

  it("keeps Preview identity immutable while routing recipient links through the branch alias", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    vi.stubEnv("VERCEL_URL", "novalure-immutable.vercel.app");
    vi.stubEnv("VERCEL_BRANCH_URL", "novalure-git-feature.vercel.app");
    expect(resolveDeploymentContext()).toMatchObject({
      environment: "preview",
      origin: "https://novalure-immutable.vercel.app",
      publicOrigin: "https://novalure-git-feature.vercel.app",
      audience: "preview:https://novalure-immutable.vercel.app",
      ipRateLimitId: "novalure-playbook-submit-preview"
    });
  });

  it("falls back to the immutable Preview URL when no branch alias exists", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "novalure-immutable.vercel.app");
    vi.stubEnv("VERCEL_BRANCH_URL", "");
    expect(resolveDeploymentContext().publicOrigin).toBe("https://novalure-immutable.vercel.app");
  });

  it("fails closed for missing or unsafe deployed origins", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "");
    expect(() => resolveDeploymentContext()).toThrow(/missing/);

    vi.stubEnv("VERCEL_URL", "http://preview.example.com");
    expect(() => resolveDeploymentContext()).toThrow(/invalid/);
  });

  it.each([
    "http://branch.example.com",
    "https://user:password@branch.example.com",
    "https://branch.example.com/path",
    "https://branch.example.com?target=other",
    "https://branch.example.com#fragment"
  ])("rejects an unsafe Preview branch origin: %s", (branchOrigin) => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "preview.example.com");
    vi.stubEnv("VERCEL_BRANCH_URL", branchOrigin);
    expect(() => resolveDeploymentContext()).toThrow(/invalid/);
  });

  it("never reuses the public Production URL for development links", () => {
    vi.stubEnv("VERCEL_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    expect(resolveDeploymentContext()).toMatchObject({
      environment: "development",
      origin: "http://localhost:3000",
      publicOrigin: "http://localhost:3000",
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
