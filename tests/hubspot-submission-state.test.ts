import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  claimHubSpotSubmission,
  completeHubSpotSubmission,
  getHubSpotPayloadFingerprint,
  hubSpotSubmissionStateConfiguration,
  HubSpotSubmissionConflictError,
  HubSpotSubmissionStateUnavailableError,
  releaseHubSpotSubmission
} from "@/lib/hubspot-submission-state";

const firstClaimId = "11111111-1111-4111-8111-111111111111";
const secondClaimId = "22222222-2222-4222-8222-222222222222";
const wrongClaimId = "33333333-3333-4333-8333-333333333333";

function createRedis() {
  const state = new Map<string, string>();
  const ttl = new Map<string, number>();
  const evalMock = vi.fn(async (script: string, keys: string[], args: string[]) => {
    const key = keys[0];
    const current = state.get(key);

    if (script.includes("-- hubspot_claim_v2")) {
      const [fingerprint, claimId, nowText, leaseText, ttlText] = args;
      if (!current) {
        state.set(key, `processing:${fingerprint}:${claimId}:${nowText}`);
        ttl.set(key, Number(ttlText));
        return "claimed";
      }

      if (current.startsWith("completed:")) {
        return current.slice("completed:".length) === fingerprint ? "replay" : "conflict";
      }
      if (!current.startsWith("processing:")) return "invalid";

      const [, currentFingerprint, , claimedAtText] = current.split(":");
      if (currentFingerprint !== fingerprint) return "conflict";
      if (Number(claimedAtText) <= Number(nowText) - Number(leaseText)) {
        state.set(key, `processing:${fingerprint}:${claimId}:${nowText}`);
        ttl.set(key, Number(ttlText));
        return "claimed";
      }
      return "processing";
    }

    if (script.includes("-- hubspot_complete_v2")) {
      if (!current?.startsWith("processing:")) return 0;
      const [, fingerprint, currentClaimId] = current.split(":");
      if (currentClaimId !== args[0]) return 0;
      state.set(key, `completed:${fingerprint}`);
      ttl.set(key, Number(args[1]));
      return 1;
    }

    if (script.includes("-- hubspot_release_v2")) {
      if (!current?.startsWith("processing:")) return 0;
      const [, , currentClaimId] = current.split(":");
      if (currentClaimId !== args[0]) return 0;
      state.delete(key);
      ttl.delete(key);
      return 1;
    }

    throw new Error("Unknown script");
  });
  return { state, ttl, redis: { eval: evalMock }, evalMock };
}

beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.novalure.eu");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("HubSpot submission state", () => {
  it("claims once, reports an identical concurrent request as processing, and replays only after completion", async () => {
    const { redis, evalMock } = createRedis();
    const payload = { email: "reader@example.com", submittedAt: "1" };
    const first = await claimHubSpotSubmission("submission-1", payload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    expect(first).toEqual({ status: "claimed", claimId: firstClaimId });

    await expect(claimHubSpotSubmission("submission-1", payload, {
      claimId: secondClaimId,
      nowMs: 1_001,
      redis: redis as never
    })).resolves.toBe("processing");

    await expect(completeHubSpotSubmission("submission-1", firstClaimId, { redis: redis as never }))
      .resolves.toBe("completed");
    await expect(claimHubSpotSubmission("submission-1", payload, {
      claimId: secondClaimId,
      nowMs: 1_002,
      redis: redis as never
    })).resolves.toBe("replay");

    expect(evalMock.mock.calls[0][2][0]).toBe(getHubSpotPayloadFingerprint(payload));
  });

  it("rejects a different payload while processing and after completion", async () => {
    const { redis } = createRedis();
    await claimHubSpotSubmission("submission-1", { email: "first@example.com" }, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    await expect(claimHubSpotSubmission("submission-1", { email: "other@example.com" }, {
      claimId: secondClaimId,
      nowMs: 1_001,
      redis: redis as never
    })).rejects.toBeInstanceOf(HubSpotSubmissionConflictError);

    await completeHubSpotSubmission("submission-1", firstClaimId, { redis: redis as never });
    await expect(claimHubSpotSubmission("submission-1", { email: "other@example.com" }, {
      claimId: secondClaimId,
      nowMs: 1_002,
      redis: redis as never
    })).rejects.toBeInstanceOf(HubSpotSubmissionConflictError);
  });

  it("reclaims a stale processing lease and prevents the old owner from completing or releasing it", async () => {
    const { redis } = createRedis();
    const payload = { email: "reader@example.com" };
    await claimHubSpotSubmission("submission-1", payload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });

    const reclaimed = await claimHubSpotSubmission("submission-1", payload, {
      claimId: secondClaimId,
      nowMs: 1_000 + hubSpotSubmissionStateConfiguration.processingLeaseMs,
      redis: redis as never
    });
    expect(reclaimed).toEqual({ status: "claimed", claimId: secondClaimId });

    await expect(completeHubSpotSubmission("submission-1", firstClaimId, { redis: redis as never }))
      .rejects.toBeInstanceOf(HubSpotSubmissionStateUnavailableError);
    await expect(releaseHubSpotSubmission("submission-1", firstClaimId, { redis: redis as never }))
      .rejects.toBeInstanceOf(HubSpotSubmissionStateUnavailableError);
    await expect(completeHubSpotSubmission("submission-1", secondClaimId, { redis: redis as never }))
      .resolves.toBe("completed");
  });

  it("allows only the owner to release and reopens the submission by deleting the marker", async () => {
    const { redis, state } = createRedis();
    await claimHubSpotSubmission("submission-1", { email: "first@example.com" }, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });

    await expect(releaseHubSpotSubmission("submission-1", wrongClaimId, { redis: redis as never }))
      .rejects.toBeInstanceOf(HubSpotSubmissionStateUnavailableError);
    await expect(releaseHubSpotSubmission("submission-1", firstClaimId, { redis: redis as never }))
      .resolves.toBe("released");
    expect(state.size).toBe(0);

    await expect(claimHubSpotSubmission("submission-1", { email: "replacement@example.com" }, {
      claimId: secondClaimId,
      nowMs: 1_001,
      redis: redis as never
    })).resolves.toEqual({ status: "claimed", claimId: secondClaimId });
  });

  it("sets a fresh 30-day TTL on the completed marker", async () => {
    const { redis, ttl, evalMock } = createRedis();
    await claimHubSpotSubmission("submission-1", { value: 1 }, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    await completeHubSpotSubmission("submission-1", firstClaimId, { redis: redis as never });

    const key = String(evalMock.mock.calls[0][1][0]);
    expect(hubSpotSubmissionStateConfiguration.completedTtlMs).toBe(30 * 24 * 60 * 60 * 1000);
    expect(ttl.get(key)).toBe(hubSpotSubmissionStateConfiguration.completedTtlMs);
    expect(evalMock.mock.calls[1][2][1]).toBe(String(hubSpotSubmissionStateConfiguration.completedTtlMs));
  });

  it("isolates markers by deployment and stores no raw submission ID", async () => {
    const { redis, evalMock } = createRedis();
    await claimHubSpotSubmission("private-submission", { value: 1 }, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    const productionKey = String(evalMock.mock.calls[0][1][0]);
    expect(productionKey).toMatch(/^novalure:hubspot:submission:v2:[0-9a-f]{64}:[0-9a-f]{64}$/);
    expect(productionKey).not.toContain("private-submission");

    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "preview.vercel.app");
    await claimHubSpotSubmission("private-submission", { value: 1 }, {
      claimId: secondClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    expect(String(evalMock.mock.calls[1][1][0])).not.toBe(productionKey);
  });

  it("fails closed for Redis outages, malformed state, and invalid inputs", async () => {
    const broken = { eval: vi.fn().mockRejectedValue(new Error("offline")) };
    const malformed = { eval: vi.fn().mockResolvedValue("unexpected") };
    await expect(claimHubSpotSubmission("submission", {}, {
      claimId: firstClaimId,
      redis: broken as never
    })).rejects.toBeInstanceOf(HubSpotSubmissionStateUnavailableError);
    await expect(claimHubSpotSubmission("submission", {}, {
      claimId: firstClaimId,
      redis: malformed as never
    })).rejects.toBeInstanceOf(HubSpotSubmissionStateUnavailableError);
    await expect(claimHubSpotSubmission("submission", {}, {
      claimId: "not-a-claim",
      redis: malformed as never
    })).rejects.toBeInstanceOf(HubSpotSubmissionStateUnavailableError);
    expect(() => getHubSpotPayloadFingerprint(undefined)).toThrow(HubSpotSubmissionStateUnavailableError);
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(() => getHubSpotPayloadFingerprint(circular)).toThrow(HubSpotSubmissionStateUnavailableError);
  });
});
