import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  claimResendImportCreation,
  getResendImportPayloadFingerprint,
  getResendImportStateKey,
  markResendImportTerminal,
  readResendImportState,
  releaseResendImportCreation,
  resendImportStateConfiguration,
  ResendImportPayloadConflictError,
  ResendImportStateUnavailableError,
  storeResendImportId
} from "@/lib/resend-import-state";

const tokenFingerprint = "a".repeat(64);
const firstClaimId = "11111111-1111-4111-8111-111111111111";
const secondClaimId = "22222222-2222-4222-8222-222222222222";
const wrongClaimId = "33333333-3333-4333-8333-333333333333";
const firstImportId = "44444444-4444-4444-8444-444444444444";
const secondImportId = "55555555-5555-4555-8555-555555555555";

function payload(overrides: Record<string, unknown> = {}) {
  return {
    email: "reader@example.com",
    properties: {
      doi_source: "novalure_playbook",
      requested_playbook: "en-agent"
    },
    segmentId: "segment-playbook",
    topic: { id: "topic-marketing", subscription: "opt_in" },
    ...overrides
  };
}

function createRedis() {
  const state = new Map<string, string>();
  const ttl = new Map<string, number>();
  const isCanonicalTimestamp = (value: string) => (
    /^(0|[1-9][0-9]*)$/.test(value)
    && value.length <= 16
    && (value.length < 16 || value <= "9007199254740991")
  );
  const evalMock = vi.fn(async (script: string, keys: string[], args: string[]) => {
    const key = keys[0];
    const current = state.get(key);

    if (script.includes("-- resend_import_read_v1")) {
      return current === undefined ? [0] : [1, current];
    }

    if (script.includes("-- resend_import_claim_v1")) {
      const [fingerprint, claimId, nowText, leaseText, ttlText] = args;
      if (!current) {
        state.set(key, `creating:${fingerprint}:${claimId}:${nowText}`);
        ttl.set(key, Number(ttlText));
        return [1, claimId];
      }

      const parts = current.split(":");
      if (parts.length === 4 && parts[0] === "creating" && parts[1] === fingerprint) {
        if (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(parts[2])
          && isCanonicalTimestamp(parts[3])
          && Number(parts[3]) <= Number(nowText) - Number(leaseText)
        ) {
          state.set(key, `creating:${fingerprint}:${claimId}:${nowText}`);
          ttl.set(key, Number(ttlText));
          return [1, claimId];
        }
        if (parts[2] === claimId && isCanonicalTimestamp(parts[3])) return [1, claimId];
      }
      return [2, current];
    }

    if (script.includes("-- resend_import_store_v1")) {
      if (!current) return [0];
      const [fingerprint, claimId, importId, ttlText] = args;
      const target = `import:${fingerprint}:${importId}`;
      if (current === target) return [1];
      const prefix = `creating:${fingerprint}:${claimId}:`;
      const claimedAt = current.startsWith(prefix) ? current.slice(prefix.length) : "";
      if (isCanonicalTimestamp(claimedAt)) {
        state.set(key, target);
        ttl.set(key, Number(ttlText));
        return [1];
      }
      return [2, current];
    }

    if (script.includes("-- resend_import_terminal_v1")) {
      if (!current) return [0];
      const [fingerprint, importId, outcome, ttlText] = args;
      const expected = `import:${fingerprint}:${importId}`;
      const target = `terminal:${fingerprint}:${importId}:${outcome}`;
      if (current === target) return [1];
      if (current === expected) {
        state.set(key, target);
        ttl.set(key, Number(ttlText));
        return [1];
      }
      return [2, current];
    }

    if (script.includes("-- resend_import_release_v1")) {
      if (!current) return [0];
      const [fingerprint, claimId] = args;
      const prefix = `creating:${fingerprint}:${claimId}:`;
      const claimedAt = current.startsWith(prefix) ? current.slice(prefix.length) : "";
      if (isCanonicalTimestamp(claimedAt)) {
        state.delete(key);
        ttl.delete(key);
        return [1];
      }
      return [2, current];
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

describe("Resend import state", () => {
  it("persists the complete creating, import, and terminal lifecycle", async () => {
    const { redis, state, ttl } = createRedis();
    const importPayload = payload();

    await expect(readResendImportState(tokenFingerprint, importPayload, { redis: redis as never }))
      .resolves.toEqual({ status: "none" });

    await expect(claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    })).resolves.toEqual({ status: "claimed", claimId: firstClaimId });
    await expect(readResendImportState(tokenFingerprint, importPayload, { redis: redis as never }))
      .resolves.toEqual({ status: "creating", claimId: firstClaimId, claimedAtMs: 1_000 });

    await expect(storeResendImportId(
      tokenFingerprint,
      importPayload,
      firstClaimId,
      firstImportId,
      { redis: redis as never }
    )).resolves.toEqual({ status: "import", importId: firstImportId });
    await expect(readResendImportState(tokenFingerprint, importPayload, { redis: redis as never }))
      .resolves.toEqual({ status: "import", importId: firstImportId });

    await expect(markResendImportTerminal(
      tokenFingerprint,
      importPayload,
      firstImportId,
      "created",
      { redis: redis as never }
    )).resolves.toEqual({ status: "terminal", importId: firstImportId, outcome: "created" });
    await expect(readResendImportState(tokenFingerprint, importPayload, { redis: redis as never }))
      .resolves.toEqual({ status: "terminal", importId: firstImportId, outcome: "created" });

    const key = getResendImportStateKey(tokenFingerprint);
    expect(state.get(key)).toContain(getResendImportPayloadFingerprint(importPayload));
    expect(ttl.get(key)).toBe(resendImportStateConfiguration.stateTtlMs);
    expect(resendImportStateConfiguration.stateTtlMs).toBe(48 * 60 * 60 * 1000);
  });

  it("uses a stable canonical payload fingerprint and rejects semantic conflicts in every state", async () => {
    const { redis } = createRedis();
    const firstPayload = {
      topic: { subscription: "opt_in", id: "topic-marketing" },
      email: "reader@example.com",
      properties: { z: 2, a: 1 }
    };
    const reorderedPayload = {
      properties: { a: 1, z: 2 },
      email: "reader@example.com",
      topic: { id: "topic-marketing", subscription: "opt_in" }
    };
    const conflictingPayload = { ...reorderedPayload, email: "other@example.com" };

    expect(getResendImportPayloadFingerprint(firstPayload))
      .toBe(getResendImportPayloadFingerprint(reorderedPayload));
    await claimResendImportCreation(tokenFingerprint, firstPayload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    await expect(claimResendImportCreation(tokenFingerprint, reorderedPayload, {
      claimId: secondClaimId,
      nowMs: 1_001,
      redis: redis as never
    })).resolves.toEqual({ status: "creating", claimId: firstClaimId, claimedAtMs: 1_000 });
    await expect(readResendImportState(tokenFingerprint, conflictingPayload, { redis: redis as never }))
      .rejects.toBeInstanceOf(ResendImportPayloadConflictError);

    await storeResendImportId(tokenFingerprint, firstPayload, firstClaimId, firstImportId, {
      redis: redis as never
    });
    await expect(markResendImportTerminal(
      tokenFingerprint,
      conflictingPayload,
      firstImportId,
      "created",
      { redis: redis as never }
    )).rejects.toBeInstanceOf(ResendImportPayloadConflictError);

    await markResendImportTerminal(tokenFingerprint, firstPayload, firstImportId, "created", {
      redis: redis as never
    });
    await expect(claimResendImportCreation(tokenFingerprint, conflictingPayload, {
      claimId: secondClaimId,
      nowMs: 2_000,
      redis: redis as never
    })).rejects.toBeInstanceOf(ResendImportPayloadConflictError);
  });

  it("reclaims a stale create lease and fences the old owner", async () => {
    const { redis } = createRedis();
    const importPayload = payload();
    await claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });

    await expect(claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: secondClaimId,
      nowMs: 1_000 + resendImportStateConfiguration.createLeaseMs - 1,
      redis: redis as never
    })).resolves.toEqual({ status: "creating", claimId: firstClaimId, claimedAtMs: 1_000 });
    await expect(claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: secondClaimId,
      nowMs: 1_000 + resendImportStateConfiguration.createLeaseMs,
      redis: redis as never
    })).resolves.toEqual({ status: "claimed", claimId: secondClaimId });

    await expect(storeResendImportId(
      tokenFingerprint,
      importPayload,
      firstClaimId,
      firstImportId,
      { redis: redis as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(releaseResendImportCreation(tokenFingerprint, importPayload, firstClaimId, {
      redis: redis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(storeResendImportId(
      tokenFingerprint,
      importPayload,
      secondClaimId,
      firstImportId,
      { redis: redis as never }
    )).resolves.toMatchObject({ status: "import" });
    expect(resendImportStateConfiguration.createLeaseMs).toBe(60 * 1000);
  });

  it("atomically renews a stale lease when the same owner reclaims it", async () => {
    const { redis } = createRedis();
    const importPayload = payload();
    await claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });

    await expect(claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: firstClaimId,
      nowMs: 1_000 + resendImportStateConfiguration.createLeaseMs,
      redis: redis as never
    })).resolves.toEqual({ status: "claimed", claimId: firstClaimId });
    await expect(readResendImportState(tokenFingerprint, importPayload, { redis: redis as never }))
      .resolves.toEqual({
        status: "creating",
        claimId: firstClaimId,
        claimedAtMs: 1_000 + resendImportStateConfiguration.createLeaseMs
      });
    await expect(claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: secondClaimId,
      nowMs: 1_000 + resendImportStateConfiguration.createLeaseMs + 1,
      redis: redis as never
    })).resolves.toEqual({
      status: "creating",
      claimId: firstClaimId,
      claimedAtMs: 1_000 + resendImportStateConfiguration.createLeaseMs
    });
  });

  it("allows only the creating owner to release the state", async () => {
    const { redis } = createRedis();
    const importPayload = payload();
    await claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });

    await expect(releaseResendImportCreation(tokenFingerprint, importPayload, wrongClaimId, {
      redis: redis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(releaseResendImportCreation(tokenFingerprint, importPayload, firstClaimId, {
      redis: redis as never
    })).resolves.toBe("released");
    await expect(readResendImportState(tokenFingerprint, importPayload, { redis: redis as never }))
      .resolves.toEqual({ status: "none" });
  });

  it("marks a terminal outcome only for the matching import and never changes it", async () => {
    const { redis } = createRedis();
    const importPayload = payload();
    await claimResendImportCreation(tokenFingerprint, importPayload, {
      claimId: firstClaimId,
      nowMs: 1_000,
      redis: redis as never
    });
    await storeResendImportId(tokenFingerprint, importPayload, firstClaimId, firstImportId, {
      redis: redis as never
    });

    await expect(markResendImportTerminal(
      tokenFingerprint,
      importPayload,
      secondImportId,
      "skipped",
      { redis: redis as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(markResendImportTerminal(
      tokenFingerprint,
      importPayload,
      firstImportId,
      "skipped",
      { redis: redis as never }
    )).resolves.toMatchObject({ status: "terminal", outcome: "skipped" });
    await expect(markResendImportTerminal(
      tokenFingerprint,
      importPayload,
      firstImportId,
      "skipped",
      { redis: redis as never }
    )).resolves.toMatchObject({ status: "terminal", outcome: "skipped" });
    await expect(markResendImportTerminal(
      tokenFingerprint,
      importPayload,
      firstImportId,
      "failed",
      { redis: redis as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
  });

  it("isolates deployment keys and never stores the raw token fingerprint in them", () => {
    const productionKey = getResendImportStateKey(tokenFingerprint);
    expect(productionKey).toMatch(/^novalure:resend:import:v1:[0-9a-f]{64}:[0-9a-f]{64}$/);
    expect(productionKey).not.toContain(tokenFingerprint);

    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "preview-a.vercel.app");
    const firstPreviewKey = getResendImportStateKey(tokenFingerprint);
    vi.stubEnv("VERCEL_URL", "preview-b.vercel.app");
    const secondPreviewKey = getResendImportStateKey(tokenFingerprint);

    expect(new Set([productionKey, firstPreviewKey, secondPreviewKey])).toHaveLength(3);
  });

  it("fails closed for malformed state, Redis failures, and invalid transition inputs", async () => {
    const malformedRedis = createRedis();
    const key = getResendImportStateKey(tokenFingerprint);
    malformedRedis.state.set(key, "creating:malformed");
    await expect(readResendImportState(tokenFingerprint, payload(), {
      redis: malformedRedis.redis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);

    const brokenRedis = { eval: vi.fn().mockRejectedValue(new Error("offline")) };
    await expect(readResendImportState(tokenFingerprint, payload(), {
      redis: brokenRedis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    const malformedResultRedis = { eval: vi.fn().mockResolvedValue("unexpected") };
    await expect(readResendImportState(tokenFingerprint, payload(), {
      redis: malformedResultRedis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);

    await expect(claimResendImportCreation("not-a-fingerprint", payload(), {
      claimId: firstClaimId,
      redis: malformedResultRedis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(claimResendImportCreation(tokenFingerprint, payload(), {
      claimId: "not-a-uuid",
      redis: malformedResultRedis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(claimResendImportCreation(tokenFingerprint, payload(), {
      claimId: firstClaimId,
      nowMs: Number.NaN,
      redis: malformedResultRedis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(storeResendImportId(
      tokenFingerprint,
      payload(),
      firstClaimId,
      "not-a-uuid",
      { redis: malformedResultRedis as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    await expect(markResendImportTerminal(
      tokenFingerprint,
      payload(),
      firstImportId,
      "other" as never,
      { redis: malformedResultRedis as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
  });

  it("strictly rejects malformed Redis result shapes without coercion", async () => {
    const malformedResults: unknown[] = [
      "unexpected",
      ["0"],
      [false],
      [0, "extra"],
      [1],
      [1, null],
      [1, "state", "extra"],
      [2]
    ];

    for (const result of malformedResults) {
      const redis = { eval: vi.fn().mockResolvedValue(result) };
      await expect(readResendImportState(tokenFingerprint, payload(), { redis: redis as never }))
        .rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    }

    const stringClaimCode = { eval: vi.fn().mockResolvedValue(["1", firstClaimId]) };
    await expect(claimResendImportCreation(tokenFingerprint, payload(), {
      claimId: firstClaimId,
      redis: stringClaimCode as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);

    const booleanMutationCode = { eval: vi.fn().mockResolvedValue([true]) };
    await expect(storeResendImportId(
      tokenFingerprint,
      payload(),
      firstClaimId,
      firstImportId,
      { redis: booleanMutationCode as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
  });

  it("rejects malformed persisted states without mutating them", async () => {
    const { redis, state } = createRedis();
    const key = getResendImportStateKey(tokenFingerprint);
    const fingerprint = getResendImportPayloadFingerprint(payload());
    const malformedStates = [
      "unknown",
      `creating:${fingerprint}:${firstClaimId}:01`,
      `creating:${fingerprint}:${firstClaimId}:9007199254740992`,
      `creating:${fingerprint}:11111111-1111-0111-8111-111111111111:1000`,
      `creating:${fingerprint}:11111111-1111-4111-7111-111111111111:1000`,
      `creating:${fingerprint.toUpperCase()}:${firstClaimId}:1000`,
      `import:${fingerprint}:not-a-uuid`,
      `terminal:${fingerprint}:${firstImportId}:unknown`,
      `terminal:${fingerprint}:${firstImportId}:created:trailing`
    ];

    for (const malformedState of malformedStates) {
      state.set(key, malformedState);
      await expect(readResendImportState(tokenFingerprint, payload(), { redis: redis as never }))
        .rejects.toBeInstanceOf(ResendImportStateUnavailableError);
      expect(state.get(key)).toBe(malformedState);
    }

    const corruptCreating = `creating:${fingerprint}:${firstClaimId}:01`;
    state.set(key, corruptCreating);
    await expect(storeResendImportId(
      tokenFingerprint,
      payload(),
      firstClaimId,
      firstImportId,
      { redis: redis as never }
    )).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    expect(state.get(key)).toBe(corruptCreating);
    await expect(releaseResendImportCreation(tokenFingerprint, payload(), firstClaimId, {
      redis: redis as never
    })).rejects.toBeInstanceOf(ResendImportStateUnavailableError);
    expect(state.get(key)).toBe(corruptCreating);
  });

  it("rejects payloads that cannot be represented as canonical JSON", () => {
    expect(() => getResendImportPayloadFingerprint(undefined))
      .toThrow(ResendImportStateUnavailableError);
    expect(() => getResendImportPayloadFingerprint({ value: Number.NaN }))
      .toThrow(ResendImportStateUnavailableError);
    expect(() => getResendImportPayloadFingerprint({ value: new Date() }))
      .toThrow(ResendImportStateUnavailableError);
    expect(() => getResendImportPayloadFingerprint([, "sparse"]))
      .toThrow(ResendImportStateUnavailableError);
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(() => getResendImportPayloadFingerprint(circular))
      .toThrow(ResendImportStateUnavailableError);
    expect(getResendImportPayloadFingerprint(["a", "b"]))
      .not.toBe(getResendImportPayloadFingerprint(["b", "a"]));
  });
});
