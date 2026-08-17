import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  claimDoubleOptInToken,
  completeDoubleOptInToken,
  doubleOptInStateConfiguration,
  DoubleOptInStateUnavailableError,
  registerDoubleOptInToken,
  releaseDoubleOptInToken
} from "@/lib/double-opt-in-state";

beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function createStateRedis() {
  const state = new Map<string, string>();
  const evalMock = vi.fn(async (script: string, keys: string[], args: string[]) => {
    const key = keys[0];
    const current = state.get(key);

    if (script.includes('return "created"')) {
      if (current === "pending" || current === "used" || current === "blocked") return current;
      if (current) return "processing";
      state.set(key, "pending");
      return "created";
    }

    if (script.includes("local claimed_at")) {
      if (!current) return "missing";
      if (current === "pending") {
        state.set(key, `processing:${args[0]}:${args[1]}`);
        return "claimed";
      }
      if (current === "used" || current === "blocked") return current;

      const claimedAt = Number(current.split(":").at(-1));
      if (Number.isFinite(claimedAt) && claimedAt <= Number(args[1]) - Number(args[2])) {
        state.set(key, `processing:${args[0]}:${args[1]}`);
        return "claimed";
      }
      return "processing";
    }

    const expectedPrefix = `processing:${args[0]}:`;
    if (!current?.startsWith(expectedPrefix)) return 0;
    if (script.includes('ARGV[2], "KEEPTTL"')) {
      state.set(key, args[1]);
    } else {
      state.set(key, "pending");
    }
    return 1;
  });

  return { state, redis: { eval: evalMock }, evalMock };
}

function futureExpiry() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

describe("double opt-in state", () => {
  it("registers, claims, consumes and rejects a replay", async () => {
    const { redis, evalMock } = createStateRedis();
    await registerDoubleOptInToken("token-A", futureExpiry(), { redis: redis as never });
    const claim = await claimDoubleOptInToken("token-A", {
      claimId: "claim-A",
      nowMs: 1_000,
      redis: redis as never
    });
    expect(claim.status).toBe("claimed");

    await completeDoubleOptInToken("token-A", claim.claimId, "used", { redis: redis as never });
    const completionScript = String(evalMock.mock.calls[2][0]);
    expect(completionScript).toContain("string.sub(current, 1, string.len(prefix))");
    expect(completionScript).not.toContain('string.match(current, "^processing:" .. ARGV[1]');
    await expect(claimDoubleOptInToken("token-A", { redis: redis as never })).resolves.toMatchObject({
      status: "used"
    });
  });

  it("stores a terminal blocked result for a preserved opt-out", async () => {
    const { redis } = createStateRedis();
    await registerDoubleOptInToken("token-blocked", futureExpiry(), { redis: redis as never });
    const claim = await claimDoubleOptInToken("token-blocked", {
      claimId: "claim-blocked",
      redis: redis as never
    });
    await completeDoubleOptInToken("token-blocked", claim.claimId, "blocked", { redis: redis as never });

    await expect(claimDoubleOptInToken("token-blocked", { redis: redis as never })).resolves.toMatchObject({
      status: "blocked"
    });
  });

  it("allows exactly one concurrent claim", async () => {
    const { redis } = createStateRedis();
    await registerDoubleOptInToken("token-race", futureExpiry(), { redis: redis as never });

    const results = await Promise.all([
      claimDoubleOptInToken("token-race", { claimId: "claim-1", nowMs: 10, redis: redis as never }),
      claimDoubleOptInToken("token-race", { claimId: "claim-2", nowMs: 10, redis: redis as never })
    ]);

    expect(results.map((result) => result.status).sort()).toEqual(["claimed", "processing"]);
  });

  it("releases a retryable failure back to pending", async () => {
    const { redis } = createStateRedis();
    await registerDoubleOptInToken("token-retry", futureExpiry(), { redis: redis as never });
    const first = await claimDoubleOptInToken("token-retry", {
      claimId: "claim-first",
      nowMs: 1_000,
      redis: redis as never
    });
    await releaseDoubleOptInToken("token-retry", first.claimId, { redis: redis as never });

    await expect(claimDoubleOptInToken("token-retry", {
      claimId: "claim-second",
      nowMs: 2_000,
      redis: redis as never
    })).resolves.toMatchObject({ status: "claimed", claimId: "claim-second" });
  });

  it("reclaims a processing lease after a worker crash", async () => {
    const { redis } = createStateRedis();
    await registerDoubleOptInToken("token-crash", futureExpiry(), { redis: redis as never });
    await claimDoubleOptInToken("token-crash", {
      claimId: "dead-worker",
      nowMs: 1_000,
      redis: redis as never
    });

    await expect(claimDoubleOptInToken("token-crash", {
      claimId: "new-worker",
      nowMs: 1_000 + doubleOptInStateConfiguration.processingTimeoutMs + 1,
      redis: redis as never
    })).resolves.toMatchObject({ status: "claimed", claimId: "new-worker" });
  });

  it("prevents an expired lease owner from releasing or completing the new claim", async () => {
    const { redis } = createStateRedis();
    await registerDoubleOptInToken("token-owner", futureExpiry(), { redis: redis as never });
    const oldClaim = await claimDoubleOptInToken("token-owner", {
      claimId: "old-worker",
      nowMs: 1_000,
      redis: redis as never
    });
    const newClaim = await claimDoubleOptInToken("token-owner", {
      claimId: "new-worker",
      nowMs: 1_000 + doubleOptInStateConfiguration.processingTimeoutMs + 1,
      redis: redis as never
    });

    await expect(completeDoubleOptInToken("token-owner", oldClaim.claimId, "used", {
      redis: redis as never
    })).rejects.toBeInstanceOf(DoubleOptInStateUnavailableError);
    await expect(releaseDoubleOptInToken("token-owner", oldClaim.claimId, {
      redis: redis as never
    })).rejects.toBeInstanceOf(DoubleOptInStateUnavailableError);

    await completeDoubleOptInToken("token-owner", newClaim.claimId, "used", { redis: redis as never });
    await expect(claimDoubleOptInToken("token-owner", { redis: redis as never }))
      .resolves.toMatchObject({ status: "used" });
  });

  it("reuses pending registration state but fails closed for a lost claim", async () => {
    const { redis } = createStateRedis();
    await expect(claimDoubleOptInToken("unknown", { redis: redis as never })).resolves.toMatchObject({
      status: "missing"
    });

    await registerDoubleOptInToken("duplicate", futureExpiry(), { redis: redis as never });
    await expect(registerDoubleOptInToken("duplicate", futureExpiry(), { redis: redis as never }))
      .resolves.toBe("pending");
    await expect(completeDoubleOptInToken("duplicate", "lost", "used", { redis: redis as never }))
      .rejects.toBeInstanceOf(DoubleOptInStateUnavailableError);
  });

  it("never places the raw token id in the Redis key", async () => {
    const { redis, evalMock } = createStateRedis();
    await registerDoubleOptInToken("private-token-id", futureExpiry(), { redis: redis as never });
    const keys = evalMock.mock.calls[0][1] as string[];
    expect(keys[0]).toMatch(/^novalure:doi:v2:[0-9a-f]{64}:[0-9a-f]{64}$/);
    expect(keys[0]).not.toContain("private-token-id");
  });

  it("isolates state keys between preview deployments and production", async () => {
    const { redis, evalMock } = createStateRedis();
    await registerDoubleOptInToken("shared-token", futureExpiry(), { redis: redis as never });
    const productionKey = String(evalMock.mock.calls[0][1][0]);

    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "preview-a.vercel.app");
    await registerDoubleOptInToken("shared-token", futureExpiry(), { redis: redis as never });
    const firstPreviewKey = String(evalMock.mock.calls[1][1][0]);

    vi.stubEnv("VERCEL_URL", "preview-b.vercel.app");
    await registerDoubleOptInToken("shared-token", futureExpiry(), { redis: redis as never });
    const secondPreviewKey = String(evalMock.mock.calls[2][1][0]);

    expect(new Set([productionKey, firstPreviewKey, secondPreviewKey])).toHaveLength(3);
  });

  it("wraps Redis outages and invalid clocks", async () => {
    const brokenRedis = { eval: vi.fn().mockRejectedValue(new Error("offline")) };
    await expect(registerDoubleOptInToken("token", futureExpiry(), { redis: brokenRedis as never }))
      .rejects.toBeInstanceOf(DoubleOptInStateUnavailableError);
    await expect(claimDoubleOptInToken("token", { nowMs: Number.NaN, redis: brokenRedis as never }))
      .rejects.toBeInstanceOf(DoubleOptInStateUnavailableError);
  });
});
