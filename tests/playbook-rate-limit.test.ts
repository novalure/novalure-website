import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkPlaybookIpRateLimit,
  checkPlaybookRecipientRateLimit,
  getRecipientRateLimitKey,
  normalizeRecipientEmail,
  playbookRateLimitConfiguration,
  PlaybookRateLimitUnavailableError
} from "@/lib/playbook-rate-limit";

function createRateLimitRedis() {
  const entries = new Map<string, Array<{ score: number; member: string }>>();
  const evalMock = vi.fn(async (_script: string, keys: string[], args: string[]) => {
    const [nowValue, windowValue, limitValue, member] = args;
    const now = Number(nowValue);
    const windowMs = Number(windowValue);
    const limit = Number(limitValue);
    const current = (entries.get(keys[0]) || [])
      .filter((entry) => entry.score > now - windowMs)
      .sort((a, b) => a.score - b.score);

    if (current.some((entry) => entry.member === member)) {
      entries.set(keys[0], current);
      return [1, current.length, 0];
    }

    if (current.length >= limit) {
      entries.set(keys[0], current);
      return [0, current.length, current[0].score + windowMs];
    }

    current.push({ score: now, member });
    entries.set(keys[0], current);
    return [1, current.length, 0];
  });

  return { entries, redis: { eval: evalMock }, evalMock };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("playbook recipient rate limit", () => {
  it("normalizes and pseudonymizes recipient keys", () => {
    expect(normalizeRecipientEmail(" Reader@Example.com ")).toBe("reader@example.com");
    expect(getRecipientRateLimitKey(" Reader@Example.com "))
      .toBe(getRecipientRateLimitKey("reader@example.com"));
    expect(getRecipientRateLimitKey("reader@example.com"))
      .toMatch(/^novalure:playbook:recipient:v2:[0-9a-f]{64}:[0-9a-f]{64}$/);
    expect(getRecipientRateLimitKey("reader@example.com")).not.toContain("reader@example.com");
  });

  it("allows three requests in an exact rolling day and limits the fourth", async () => {
    const { redis } = createRateLimitRedis();
    const day = playbookRateLimitConfiguration.recipientWindowMs;

    for (let index = 0; index < 3; index += 1) {
      await expect(checkPlaybookRecipientRateLimit("reader@example.com", {
        nowMs: 1_000 + index,
        requestId: `request-${index}`,
        redis: redis as never
      })).resolves.toEqual({ rateLimited: false, retryAfterSeconds: 0 });
    }

    await expect(checkPlaybookRecipientRateLimit("reader@example.com", {
      nowMs: 2_000,
      requestId: "request-4",
      redis: redis as never
    })).resolves.toEqual({
      rateLimited: true,
      retryAfterSeconds: Math.ceil((1_000 + day - 2_000) / 1_000)
    });

    await expect(checkPlaybookRecipientRateLimit("reader@example.com", {
      nowMs: 1_000 + day,
      requestId: "request-after-window",
      redis: redis as never
    })).resolves.toEqual({ rateLimited: false, retryAfterSeconds: 0 });
  });

  it("counts same-millisecond requests independently and atomically", async () => {
    const { redis } = createRateLimitRedis();
    const results = await Promise.all(
      Array.from({ length: 4 }, (_, index) => checkPlaybookRecipientRateLimit("race@example.com", {
        nowMs: 50_000,
        requestId: `parallel-${index}`,
        redis: redis as never
      }))
    );

    expect(results.filter((result) => !result.rateLimited)).toHaveLength(3);
    expect(results.filter((result) => result.rateLimited)).toHaveLength(1);
  });

  it("does not consume recipient quota again for the same submission", async () => {
    const { redis, entries, evalMock } = createRateLimitRedis();
    for (let index = 0; index < 4; index += 1) {
      await expect(checkPlaybookRecipientRateLimit("retry@example.com", {
        nowMs: 50_000 + index,
        requestId: "same-submission",
        redis: redis as never
      })).resolves.toEqual({ rateLimited: false, retryAfterSeconds: 0 });
    }
    expect(Array.from(entries.values())[0]).toHaveLength(1);
    const member = String(evalMock.mock.calls[0][2][3]);
    expect(member).toMatch(/^submission:[0-9a-f]{64}$/);
    expect(member).not.toContain("same-submission");
  });

  it("maintains independent counters for different recipients", async () => {
    const { redis, entries } = createRateLimitRedis();
    await checkPlaybookRecipientRateLimit("first@example.com", { redis: redis as never });
    await checkPlaybookRecipientRateLimit("second@example.com", { redis: redis as never });
    expect(entries.size).toBe(2);
  });

  it("isolates recipient counters between preview deployments and production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    const productionKey = getRecipientRateLimitKey("reader@example.com");

    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "preview-a.vercel.app");
    const firstPreviewKey = getRecipientRateLimitKey("reader@example.com");
    vi.stubEnv("VERCEL_URL", "preview-b.vercel.app");
    const secondPreviewKey = getRecipientRateLimitKey("reader@example.com");

    expect(new Set([productionKey, firstPreviewKey, secondPreviewKey])).toHaveLength(3);
  });

  it("uses one atomic Redis script invocation", async () => {
    const { redis, evalMock } = createRateLimitRedis();
    await checkPlaybookRecipientRateLimit("reader@example.com", {
      nowMs: 123,
      requestId: "request",
      redis: redis as never
    });
    expect(evalMock).toHaveBeenCalledOnce();
    expect(String(evalMock.mock.calls[0][0])).toContain("ZREMRANGEBYSCORE");
    expect(String(evalMock.mock.calls[0][0])).toContain("ZADD");
  });

  it("fails closed on Redis errors, malformed results and invalid clocks", async () => {
    const brokenRedis = { eval: vi.fn().mockRejectedValue(new Error("offline")) };
    const malformedRedis = { eval: vi.fn().mockResolvedValue([2, 0, 0]) };

    await expect(checkPlaybookRecipientRateLimit("reader@example.com", { redis: brokenRedis as never }))
      .rejects.toBeInstanceOf(PlaybookRateLimitUnavailableError);
    await expect(checkPlaybookRecipientRateLimit("reader@example.com", { redis: malformedRedis as never }))
      .rejects.toBeInstanceOf(PlaybookRateLimitUnavailableError);
    await expect(checkPlaybookRecipientRateLimit("reader@example.com", {
      nowMs: Number.NaN,
      redis: malformedRedis as never
    })).rejects.toBeInstanceOf(PlaybookRateLimitUnavailableError);
  });

  it("fails closed when no Redis credential pair is complete", async () => {
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    await expect(checkPlaybookRecipientRateLimit("reader@example.com"))
      .rejects.toBeInstanceOf(PlaybookRateLimitUnavailableError);
  });
});

describe("playbook IP rate limit", () => {
  const request = new Request("https://example.com/api/playbook", { method: "POST" });

  it("passes the request to the configured WAF counter", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
    const checker = vi.fn().mockResolvedValue({ rateLimited: false });
    await expect(checkPlaybookIpRateLimit(request, checker as never)).resolves.toEqual({
      rateLimited: false,
      retryAfterSeconds: 0
    });
    expect(checker).toHaveBeenCalledWith("novalure-playbook-submit", { request });
  });

  it("uses a preview-only WAF counter for preview deployments", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "novalure-preview.vercel.app");
    const checker = vi.fn().mockResolvedValue({ rateLimited: false });
    await checkPlaybookIpRateLimit(request, checker as never);
    expect(checker).toHaveBeenCalledWith("novalure-playbook-submit-preview", { request });
  });

  it("returns a 600-second retry horizon for blocked requests", async () => {
    const checker = vi.fn().mockResolvedValue({ rateLimited: true });
    await expect(checkPlaybookIpRateLimit(request, checker as never)).resolves.toEqual({
      rateLimited: true,
      retryAfterSeconds: 600
    });
  });

  it.each(["not-found", "blocked"] as const)("fails closed for a %s WAF error", async (error) => {
    const checker = vi.fn().mockResolvedValue({ rateLimited: false, error });
    await expect(checkPlaybookIpRateLimit(request, checker as never))
      .rejects.toBeInstanceOf(PlaybookRateLimitUnavailableError);
  });
});
