import { NextRequest } from "next/server";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));

import { POST } from "@/app/api/contact/route";

function request(overrides: Record<string, unknown> = {}) {
  return new NextRequest("https://www.novalure.eu/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "asme_draft_project_check", language: "de", name: "Ada Lovelace",
      email: "ada@example.com", company: "Example Homes", role: "developer",
      inquiry: "Neubauprojekt in Wien mit Fragen zur Vertriebsübergabe.",
      phone: "", projectUrl: "", website: "", ...overrides
    })
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("CONTACT_SENDER_EMAIL", "NovaLure <hello@novalure.eu>");
  mocks.send.mockResolvedValue({ data: { id: "email-1" }, error: null });
});

afterEach(() => vi.unstubAllEnvs());

describe("ASME draft contact request", () => {
  it("sends the short project context to NovaLure and acknowledges the sender", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(2);
    const internal = mocks.send.mock.calls[0][0] as { to: string; text: string; subject: string };
    expect(internal.to).toBe("hello@novalure.eu");
    expect(internal.subject).toContain("ASME Project Check");
    expect(internal.text).toContain("Neubauprojekt in Wien");
    const acknowledgement = mocks.send.mock.calls[1][0] as { to: string; text: string };
    expect(acknowledgement.to).toBe("ada@example.com");
    expect(acknowledgement.text).toContain("melden uns bei Ihnen");
    expect(acknowledgement.text).not.toContain("/de/kontakt/danke");
  });

  it("rejects missing project context without sending an email", async () => {
    const response = await POST(request({ inquiry: "" }));
    expect(response.status).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("discards honeypot submissions without sending an email", async () => {
    const response = await POST(request({ website: "spam.example" }));
    expect(response.status).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
  });
});

describe("guided project enquiry", () => {
  const submissionId = "2b4d6ed5-f647-429c-a92d-f6afe4b3fe16";
  const guided = {
    services: ["project_presentation", "campaigns", "other"],
    otherService: "Verkaufsunterlagen",
    inquiry: "Ein Wohnprojekt in Wien",
    startTiming: "within_3_months",
    submissionId
  };

  it("delivers all selections and optional context in the selected language", async () => {
    const response = await POST(request({ ...guided, language: "de" }));
    expect(response.status).toBe(200);
    const [internal, internalOptions] = mocks.send.mock.calls[0];
    expect(internal.text).toContain("Projektauftritt und Visualisierung, Nachfrage und Kampagnen, Sonstiges");
    expect(internal.text).toContain("Verkaufsunterlagen");
    expect(internal.text).toContain("Ein Wohnprojekt in Wien");
    expect(internal.text).toContain("In den nächsten drei Monaten");
    expect(internal.text).not.toContain("Timestamp:");
    expect(internalOptions).toEqual({ idempotencyKey: `contact/${submissionId}` });
    expect(mocks.send.mock.calls[1][1]).toEqual({ idempotencyKey: `contact-reply/${submissionId}` });
  });

  it.each([
    ["en", "Demand and campaigns", "As soon as possible"],
    ["es", "Demanda y campañas", "Lo antes posible"]
  ])("renders selections for %s", async (language, service, timing) => {
    const response = await POST(request({ ...guided, language, services: ["campaigns"], otherService: "", startTiming: "asap" }));
    expect(response.status).toBe(200);
    expect(mocks.send.mock.calls[0][0].text).toContain(service);
    expect(mocks.send.mock.calls[0][0].text).toContain(timing);
  });

  it("accepts just a name, email and a selection", async () => {
    const response = await POST(request({ ...guided, services: ["unsure"], otherService: "", inquiry: "", company: "", role: "", startTiming: "" }));
    expect(response.status).toBe(200);
    expect(mocks.send.mock.calls[0][0].text).toContain("Noch nicht sicher");
  });

  it("escapes user input in email HTML", async () => {
    const response = await POST(request({ ...guided, name: "<script>alert(1)</script>", otherService: "<img src=x>", inquiry: "<b>project</b>" }));
    expect(response.status).toBe(200);
    expect(mocks.send.mock.calls[0][0].html).toContain("&lt;img src=x&gt;");
    expect(mocks.send.mock.calls[0][0].html).not.toContain("<img src=x>");
    expect(mocks.send.mock.calls[1][0].html).not.toContain("<script>");
  });

  it.each([
    { services: [] },
    { services: ["campaigns", "campaigns"] },
    { services: ["unsure", "campaigns"] },
    { services: ["invalid"] },
    { services: "campaigns" },
    { email: "missing@example" },
    { name: " " },
    { startTiming: "tomorrow" },
    { role: "incorrect" },
    { projectUrl: "https://" },
    { otherService: "x".repeat(501) },
    { inquiry: "x".repeat(1501) },
    { submissionId: "invalid" },
    { services: ["campaigns"], otherService: "unexpected" }
  ])("rejects invalid guided input %#", async (overrides) => {
    const response = await POST(request({ ...guided, ...overrides }));
    expect(response.status).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("does not report failure when the acknowledgement throws after internal delivery", async () => {
    mocks.send.mockResolvedValueOnce({ data: { id: "internal" }, error: null }).mockRejectedValueOnce(new Error("network"));
    const response = await POST(request(guided));
    expect(response.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(2);
  });

  it("does not report failure when the acknowledgement is rejected by Resend", async () => {
    mocks.send.mockResolvedValueOnce({ data: { id: "internal" }, error: null }).mockResolvedValueOnce({ data: null, error: { message: "failed" } });
    const response = await POST(request(guided));
    expect(response.status).toBe(200);
  });

  it("reports an internal delivery failure and does not send an acknowledgement", async () => {
    mocks.send.mockResolvedValueOnce({ data: null, error: { message: "failed" } });
    const response = await POST(request(guided));
    expect(response.status).toBe(500);
    expect(mocks.send).toHaveBeenCalledTimes(1);
  });

  it("uses identical internal payloads and keys for an unchanged retry", async () => {
    await POST(request(guided));
    await POST(request(guided));
    expect(mocks.send.mock.calls[0]).toEqual(mocks.send.mock.calls[2]);
    expect(mocks.send.mock.calls[1]).toEqual(mocks.send.mock.calls[3]);
  });
});
