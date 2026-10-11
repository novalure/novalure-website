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
