import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verify: vi.fn(),
  fingerprint: vi.fn(),
  claim: vi.fn(),
  complete: vi.fn(),
  release: vi.fn(),
  persist: vi.fn()
}));

vi.mock("@/lib/double-opt-in-token", () => ({
  verifyDoubleOptInToken: mocks.verify,
  getDoubleOptInTokenFingerprint: mocks.fingerprint
}));

vi.mock("@/lib/double-opt-in-state", () => ({
  claimDoubleOptInToken: mocks.claim,
  completeDoubleOptInToken: mocks.complete,
  releaseDoubleOptInToken: mocks.release
}));

vi.mock("@/lib/resend-marketing", () => ({
  persistMarketingConfirmation: mocks.persist
}));

import { GET, POST } from "@/app/api/playbook/confirm/route";

const payload = {
  version: 2 as const,
  purpose: "marketing-doi" as const,
  audience: "production:https://www.novalure.eu",
  email: "reader@example.com",
  locale: "en" as const,
  playbook: "en-agent",
  issuedAt: "2026-08-01T10:00:00.000Z",
  expiresAt: "2026-08-02T10:00:00.000Z",
  privacyPolicyVersion: "2026-08-01",
  tokenId: "11111111-1111-4111-8111-111111111111"
};

function postRequest(token = "signed-token") {
  return new NextRequest("https://www.novalure.eu/api/playbook/confirm", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token })
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.verify.mockReturnValue(payload);
  mocks.fingerprint.mockReturnValue("f".repeat(64));
  mocks.claim.mockResolvedValue({ status: "claimed", claimId: "claim-1" });
  mocks.complete.mockResolvedValue(undefined);
  mocks.release.mockResolvedValue(undefined);
  mocks.persist.mockResolvedValue({ status: "confirmed", created: false });
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("playbook confirmation route", () => {
  it("renders GET without claiming or mutating consent", async () => {
    const request = new NextRequest("https://www.novalure.eu/api/playbook/confirm?token=signed-token");
    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Confirm subscription");
    expect(mocks.claim).not.toHaveBeenCalled();
    expect(mocks.persist).not.toHaveBeenCalled();
  });

  it("claims once, persists, and completes a successful token as used", async () => {
    const response = await POST(postRequest());
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Thank you");
    expect(mocks.claim).toHaveBeenCalledWith(payload.tokenId);
    expect(mocks.persist).toHaveBeenCalledWith(expect.objectContaining({
      email: payload.email,
      privacyPolicyVersion: payload.privacyPolicyVersion,
      tokenFingerprint: "f".repeat(64)
    }));
    expect(mocks.complete).toHaveBeenCalledWith(payload.tokenId, "claim-1", "used");
    expect(mocks.release).not.toHaveBeenCalled();
  });

  it("stores a preserved opt-out as terminally blocked", async () => {
    mocks.persist.mockResolvedValue({ status: "suppressed", created: false });
    const response = await POST(postRequest());
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("preferences unchanged");
    expect(mocks.complete).toHaveBeenCalledWith(payload.tokenId, "claim-1", "blocked");
  });

  it("releases a claim after a retryable Resend failure", async () => {
    mocks.persist.mockRejectedValue(new Error("Resend unavailable"));
    const response = await POST(postRequest());
    expect(response.status).toBe(503);
    expect(mocks.release).toHaveBeenCalledWith(payload.tokenId, "claim-1");
    expect(mocks.complete).not.toHaveBeenCalled();
  });

  it("returns 503 when terminal state cannot be recorded", async () => {
    mocks.complete.mockRejectedValue(new Error("Redis unavailable"));
    const response = await POST(postRequest());
    expect(response.status).toBe(503);
  });

  it.each([
    ["used", 200, "Already confirmed"],
    ["blocked", 200, "preferences unchanged"],
    ["processing", 409, "in progress"],
    ["missing", 400, "Invalid confirmation link"]
  ])("handles terminal state %s without a Resend call", async (status, expectedStatus, text) => {
    mocks.claim.mockResolvedValue({ status, claimId: "claim-1" });
    const response = await POST(postRequest());
    expect(response.status).toBe(expectedStatus);
    expect(await response.text()).toContain(text);
    expect(mocks.persist).not.toHaveBeenCalled();
    expect(mocks.complete).not.toHaveBeenCalled();
  });

  it("fails closed for invalid tokens and signing configuration errors", async () => {
    mocks.verify.mockReturnValueOnce(null);
    const invalid = await POST(postRequest());
    expect(invalid.status).toBe(400);
    expect(mocks.claim).not.toHaveBeenCalled();

    mocks.verify.mockImplementationOnce(() => {
      throw new Error("secret missing");
    });
    const unavailable = await POST(postRequest());
    expect(unavailable.status).toBe(503);
    expect(mocks.claim).not.toHaveBeenCalled();
  });
});
