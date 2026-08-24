import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  ipLimit: vi.fn(),
  recipientLimit: vi.fn(),
  createToken: vi.fn(),
  register: vi.fn(),
  hubspotClaim: vi.fn(),
  hubspotComplete: vi.fn(),
  hubspotRelease: vi.fn(),
  send: vi.fn()
}));

const mockClasses = vi.hoisted(() => ({
  HubSpotConflict: class HubSpotConflict extends Error {}
}));

vi.mock("@/lib/playbook-rate-limit", () => ({
  checkPlaybookIpRateLimit: mocks.ipLimit,
  checkPlaybookRecipientRateLimit: mocks.recipientLimit,
  normalizeRecipientEmail: (email: string) => email.trim().toLowerCase()
}));

vi.mock("@/lib/double-opt-in-token", () => ({
  createDoubleOptInToken: mocks.createToken
}));

vi.mock("@/lib/double-opt-in-state", () => ({
  registerDoubleOptInToken: mocks.register
}));

vi.mock("@/lib/hubspot-submission-state", () => ({
  claimHubSpotSubmission: mocks.hubspotClaim,
  completeHubSpotSubmission: mocks.hubspotComplete,
  releaseHubSpotSubmission: mocks.hubspotRelease,
  HubSpotSubmissionConflictError: mockClasses.HubSpotConflict
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  }
}));

import { POST } from "@/app/api/playbook/route";
import { privacyPolicyVersion } from "@/lib/playbooks-meta";

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    locale: "en",
    playbook: "en-agent",
    name: "Ada Lovelace",
    company: "Analytical Estates",
    email: "Ada@Example.com",
    phone: "+44 12345678",
    segment: "agents",
    consentRequired: true,
    consentMarketing: false,
    consentTimestamp: new Date().toISOString(),
    submissionId: "11111111-1111-4111-8111-111111111111",
    privacyPolicyVersion,
    pageUri: "https://www.novalure.eu/en",
    website: "",
    ...overrides
  };
}

function request(body: unknown = validBody()) {
  return new NextRequest("https://www.novalure.eu/api/playbook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
      "user-agent": "vitest"
    },
    body: JSON.stringify(body)
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("RESEND_FROM_EMAIL", "NovaLure <playbooks@novalure.eu>");
  vi.stubEnv("DOUBLE_OPT_IN_SECRET", "current-secret-with-at-least-32-bytes");
  vi.stubEnv("RESEND_MARKETING_TOPIC_ID", "topic-marketing");
  vi.stubEnv("HUBSPOT_PORTAL_ID", "");
  vi.stubEnv("HUBSPOT_PLAYBOOK_FORM_GUID", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
  vi.stubEnv("VERCEL_ENV", "development");
  mocks.ipLimit.mockResolvedValue({ rateLimited: false, retryAfterSeconds: 0 });
  mocks.recipientLimit.mockResolvedValue({ rateLimited: false, retryAfterSeconds: 0 });
  mocks.createToken.mockReturnValue("signed-token");
  mocks.register.mockResolvedValue("created");
  mocks.hubspotClaim.mockResolvedValue({
    status: "claimed",
    claimId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
  });
  mocks.hubspotComplete.mockResolvedValue("completed");
  mocks.hubspotRelease.mockResolvedValue("released");
  mocks.send.mockResolvedValue({ data: { id: "email-1" }, error: null });
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("playbook submission route", () => {
  it("checks the IP limit before attempting to parse the body", async () => {
    mocks.ipLimit.mockResolvedValue({ rateLimited: true, retryAfterSeconds: 600 });
    const malformed = new NextRequest("https://www.novalure.eu/api/playbook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json"
    });
    const response = await POST(malformed);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("600");
    expect(mocks.recipientLimit).not.toHaveBeenCalled();
  });

  it("fails closed when the WAF counter is unavailable", async () => {
    mocks.ipLimit.mockRejectedValue(new Error("not-found"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(mocks.recipientLimit).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("rejects malformed form data after the IP budget is consumed", async () => {
    const response = await POST(request({ name: "", company: "" }));
    expect(response.status).toBe(400);
    expect(mocks.ipLimit).toHaveBeenCalledOnce();
    expect(mocks.recipientLimit).not.toHaveBeenCalled();
  });

  it("rejects non-canonical or oversized parseable consent timestamps", async () => {
    const timestamp = `${new Date().toDateString()}${" ".repeat(5_000)}`;
    const response = await POST(request(validBody({ consentTimestamp: timestamp })));
    expect(response.status).toBe(400);
    expect(mocks.recipientLimit).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("silently accepts the server-side honeypot without side effects", async () => {
    const response = await POST(request(validBody({ website: "bot-filled" })));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(mocks.recipientLimit).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("enforces the durable recipient limit before CRM or email work", async () => {
    mocks.recipientLimit.mockResolvedValue({ rateLimited: true, retryAfterSeconds: 86_000 });
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("86000");
    expect(mocks.recipientLimit).toHaveBeenCalledWith("ada@example.com", {
      requestId: "11111111-1111-4111-8111-111111111111"
    });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("fails closed when Redis is unavailable", async () => {
    mocks.recipientLimit.mockRejectedValue(new Error("Redis offline"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("sends the playbook and owner notification for a valid request", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, locale: "en", playbooks: ["en-agent"] });
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it("sends the Spanish playbook and recipient email for an es-ES request", async () => {
    const response = await POST(request(validBody({
      locale: "es",
      playbook: "es-developer",
      segment: "developers",
      pageUri: "https://www.novalure.eu/es/promotores"
    })));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, locale: "es", playbooks: ["es-developer"] });
    const recipient = mocks.send.mock.calls[0][0] as { subject: string; html: string; text: string };
    expect(recipient.subject).toBe("Su Playbook sobre demanda de promociones");
    expect(recipient.html).toContain("Abrir Demanda de promociones");
    expect(recipient.html).toContain("/playbooks/novalure-project-demand-es.pdf");
    expect(recipient.html).toContain("/es/privacidad");
    expect(recipient.text).toContain("Hola, Ada Lovelace:");
  });

  it("registers marketing state before the DOI email and uses an idempotency key", async () => {
    const response = await POST(request(validBody({ consentMarketing: true })));
    expect(response.status).toBe(200);
    expect(mocks.createToken).toHaveBeenCalledOnce();
    const tokenInput = mocks.createToken.mock.calls[0][0] as { tokenId: string; expiresAt: string };
    expect(mocks.register).toHaveBeenCalledWith(tokenInput.tokenId, tokenInput.expiresAt);
    expect(mocks.send).toHaveBeenCalledTimes(3);
    expect(mocks.register.mock.invocationCallOrder[0])
      .toBeLessThan(mocks.send.mock.invocationCallOrder[1]);
    expect(tokenInput.tokenId).toBe("11111111-1111-4111-8111-111111111111");
    const namespace = String(mocks.send.mock.calls[0][1]?.idempotencyKey).split("/")[1];
    expect(namespace).toMatch(/^[0-9a-f]{64}$/);
    expect(mocks.send.mock.calls[0][1]).toEqual({
      idempotencyKey: `playbook/${namespace}/11111111-1111-4111-8111-111111111111`
    });
    expect(mocks.send.mock.calls[1][1]).toEqual({
      idempotencyKey: `doi/${namespace}/11111111-1111-4111-8111-111111111111`
    });
    expect(mocks.send.mock.calls[2][1]).toEqual({
      idempotencyKey: `owner/${namespace}/11111111-1111-4111-8111-111111111111`
    });
    const ownerPayload = mocks.send.mock.calls[2][0] as { html: string; text: string };
    expect(ownerPayload.text).toContain("Double-Opt-in angefordert, noch nicht bestätigt");
    expect(ownerPayload.text).toContain("Submission-ID: 11111111-1111-4111-8111-111111111111");
    expect(ownerPayload.html).not.toContain("Double-Opt-in von Resend angenommen");
  });

  it("uses the routable branch URL in DOI links while keeping Preview deployment identity separate", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "novalure-immutable.vercel.app");
    vi.stubEnv("VERCEL_BRANCH_URL", "novalure-git-feature.vercel.app");
    const response = await POST(request(validBody({ consentMarketing: true })));
    expect(response.status).toBe(200);
    const doiPayload = mocks.send.mock.calls[1][0] as { html: string };
    expect(doiPayload.html).toContain("https://novalure-git-feature.vercel.app/api/playbook/confirm");
    expect(doiPayload.html).not.toContain("https://novalure-immutable.vercel.app/api/playbook/confirm");
  });

  it("uses an explicit local origin instead of the public site for development DOI links", async () => {
    vi.stubEnv("VERCEL_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    vi.stubEnv("PLAYBOOK_DEVELOPMENT_ORIGIN", "http://localhost:3001");
    const response = await POST(request(validBody({ consentMarketing: true })));
    expect(response.status).toBe(200);
    const doiPayload = mocks.send.mock.calls[1][0] as { html: string };
    expect(doiPayload.html).toContain("http://localhost:3001/api/playbook/confirm");
    expect(doiPayload.html).not.toContain("https://www.novalure.eu/api/playbook/confirm");
  });

  it("reuses all email idempotency keys for the same client submission", async () => {
    mocks.register.mockResolvedValueOnce("created").mockResolvedValueOnce("pending");
    const body = validBody({ consentMarketing: true });
    expect((await POST(request(body))).status).toBe(200);
    expect((await POST(request(body))).status).toBe(200);

    const keys = mocks.send.mock.calls.map((call) => call[1]?.idempotencyKey);
    expect(keys.slice(0, 3)).toEqual(keys.slice(3, 6));
    expect(mocks.recipientLimit).toHaveBeenNthCalledWith(1, "ada@example.com", {
      requestId: body.submissionId
    });
    expect(mocks.recipientLimit).toHaveBeenNthCalledWith(2, "ada@example.com", {
      requestId: body.submissionId
    });
  });

  it("submits an identical retry to HubSpot at most once", async () => {
    vi.stubEnv("HUBSPOT_PORTAL_ID", "portal-1");
    vi.stubEnv("HUBSPOT_PLAYBOOK_FORM_GUID", "form-1");
    mocks.hubspotClaim
      .mockResolvedValueOnce({ status: "claimed", claimId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })
      .mockResolvedValueOnce("replay");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const body = validBody();

    expect((await POST(request(body))).status).toBe(200);
    expect((await POST(request(body))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(mocks.hubspotClaim).toHaveBeenCalledTimes(2);
    expect(mocks.hubspotComplete).toHaveBeenCalledOnce();
    expect(mocks.hubspotRelease).not.toHaveBeenCalled();
    const submittedPayload = mocks.hubspotClaim.mock.calls[0][1] as Record<string, unknown>;
    expect(submittedPayload).not.toHaveProperty("submittedAt");
  });

  it("rejects a reused submission ID with different HubSpot data", async () => {
    vi.stubEnv("HUBSPOT_PORTAL_ID", "portal-1");
    vi.stubEnv("HUBSPOT_PLAYBOOK_FORM_GUID", "form-1");
    mocks.hubspotClaim
      .mockResolvedValueOnce({ status: "claimed", claimId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })
      .mockRejectedValueOnce(new mockClasses.HubSpotConflict());
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const body = validBody();

    expect((await POST(request(body))).status).toBe(200);
    vi.mocked(console.info).mockClear();
    const conflict = await POST(request({ ...body, company: "Changed company" }));
    expect(conflict.status).toBe(409);
    expect(await conflict.json()).toEqual({ error: "Submission ID conflict" });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(console.info).not.toHaveBeenCalled();
  });

  it("releases a failed HubSpot attempt so a later retry can deliver the lead", async () => {
    vi.stubEnv("HUBSPOT_PORTAL_ID", "portal-1");
    vi.stubEnv("HUBSPOT_PLAYBOOK_FORM_GUID", "form-1");
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error("network timeout"))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const body = validBody();

    expect((await POST(request(body))).status).toBe(200);
    expect(mocks.hubspotRelease).toHaveBeenCalledWith(
      body.submissionId,
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
    );
    expect((await POST(request(body))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(mocks.hubspotComplete).toHaveBeenCalledWith(
      body.submissionId,
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
    );
  });

  it("does not duplicate a HubSpot request while an identical claim is processing", async () => {
    vi.stubEnv("HUBSPOT_PORTAL_ID", "portal-1");
    vi.stubEnv("HUBSPOT_PLAYBOOK_FORM_GUID", "form-1");
    mocks.hubspotClaim.mockResolvedValue("processing");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect((await POST(request())).status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mocks.hubspotComplete).not.toHaveBeenCalled();
    expect(mocks.hubspotRelease).not.toHaveBeenCalled();
  });

  it("does not send another DOI email after the token is processing or terminal", async () => {
    mocks.register.mockResolvedValue("used");
    const response = await POST(request(validBody({ consentMarketing: true })));
    expect(response.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(2);
    const keys = mocks.send.mock.calls.map((call) => String(call[1]?.idempotencyKey));
    expect(keys[0]).toMatch(/^playbook\/[0-9a-f]{64}\/11111111-1111-4111-8111-111111111111$/);
    expect(keys[1]).toMatch(/^owner\/[0-9a-f]{64}\/11111111-1111-4111-8111-111111111111$/);
  });

  it("never reports success when Resend or DOI state rejects work", async () => {
    mocks.send.mockResolvedValueOnce({ data: null, error: { name: "validation_error" } });
    const resendFailure = await POST(request());
    expect(resendFailure.status).toBe(503);

    mocks.send.mockResolvedValueOnce({ data: { id: 123 }, error: null });
    const malformedSuccess = await POST(request(validBody({
      submissionId: "22222222-2222-4222-8222-222222222222"
    })));
    expect(malformedSuccess.status).toBe(503);

    vi.clearAllMocks();
    mocks.ipLimit.mockResolvedValue({ rateLimited: false, retryAfterSeconds: 0 });
    mocks.recipientLimit.mockResolvedValue({ rateLimited: false, retryAfterSeconds: 0 });
    mocks.createToken.mockReturnValue("signed-token");
    mocks.send.mockResolvedValue({ data: { id: "email-1" }, error: null });
    mocks.register.mockRejectedValue(new Error("Redis offline"));
    const stateFailure = await POST(request(validBody({ consentMarketing: true })));
    expect(stateFailure.status).toBe(503);
    expect(mocks.send).toHaveBeenCalledOnce();
  });
});
