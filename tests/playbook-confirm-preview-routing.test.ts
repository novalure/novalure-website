import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/playbook/confirm/route";
import { createDoubleOptInToken } from "@/lib/double-opt-in-token";

const immutableDeploymentA = "novalure-preview-a.vercel.app";
const immutableDeploymentB = "novalure-preview-b.vercel.app";
const branchAlias = "novalure-git-feature.vercel.app";

function confirmationRequest(token: string) {
  return new NextRequest(`https://${branchAlias}/api/playbook/confirm?token=${encodeURIComponent(token)}`);
}

beforeEach(() => {
  vi.stubEnv("DOUBLE_OPT_IN_SECRET", "current-secret-with-at-least-32-bytes");
  vi.stubEnv("DOUBLE_OPT_IN_PREVIOUS_SECRET", "");
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("VERCEL_URL", immutableDeploymentA);
  vi.stubEnv("VERCEL_BRANCH_URL", branchAlias);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Preview confirmation routing", () => {
  it("serves a branch-alias GET while keeping the token bound to the immutable deployment", async () => {
    const issuedAt = new Date().toISOString();
    const token = createDoubleOptInToken({
      email: "reader@example.com",
      locale: "de",
      playbook: "de-developer",
      issuedAt,
      expiresAt: new Date(Date.parse(issuedAt) + 60 * 60 * 1000).toISOString(),
      privacyPolicyVersion: "2026-08-01",
      tokenId: "11111111-1111-4111-8111-111111111111"
    });
    const [encoded] = token.split(".");
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      audience: string;
    };

    expect(payload.audience).toBe(`preview:https://${immutableDeploymentA}`);
    const response = await GET(confirmationRequest(token));
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Zustimmung bestätigen");

    vi.stubEnv("VERCEL_URL", immutableDeploymentB);
    const afterRedeploy = await GET(confirmationRequest(token));
    expect(afterRedeploy.status).toBe(400);
    expect(await afterRedeploy.text()).toContain("Bestätigungslink ungültig");
  });
});
