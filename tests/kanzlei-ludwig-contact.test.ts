import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ send: vi.fn(), eval: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));
vi.mock("@vercel/functions", () => ({ ipAddress: () => "192.0.2.1" }));
vi.mock("@/lib/upstash-redis", () => ({ getUpstashRedis: () => ({ eval: mocks.eval }) }));
import { POST } from "@/app/api/kanzlei-ludwig-kontakt/route";

const valid = { concern: "Kauf oder Verkauf", name: "Test Person", email: "test@example.com", message: "Eine Testnachricht für die Vorschau.", website: "" };
function request(body: unknown, origin = "https://example.com") {
  return new NextRequest("https://example.com/api/kanzlei-ludwig-kontakt", {
    method: "POST", headers: { "content-type": "application/json", origin }, body: JSON.stringify(body)
  });
}
describe("Kanzlei Ludwig preview contact", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.RESEND_API_KEY = "test-key";
    mocks.eval.mockResolvedValue(1);
    mocks.send.mockResolvedValue({ error: null });
  });
  it("sends only to the fixed preview recipient", async () => {
    const response = await POST(request(valid));
    expect(response.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledOnce();
    expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({ to: "hello@novalure.eu", replyTo: "test@example.com" }));
  });
  it("rejects invalid and cross-origin submissions without sending", async () => {
    expect((await POST(request({ ...valid, message: "short" }))).status).toBe(400);
    expect((await POST(request(valid, "https://other.example"))).status).toBe(403);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("ignores the honeypot and blocks excessive submissions", async () => {
    expect((await POST(request({ ...valid, website: "spam" }))).status).toBe(200);
    mocks.eval.mockResolvedValue(0);
    expect((await POST(request(valid))).status).toBe(429);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("reports provider failures without claiming success", async () => {
    mocks.send.mockResolvedValue({ error: { message: "provider error" } });
    expect((await POST(request(valid))).status).toBe(502);
  });
});
