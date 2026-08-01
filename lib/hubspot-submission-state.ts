import { createHash, randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import { resolveDeploymentContext } from "@/lib/deployment-context";
import { getUpstashRedis } from "@/lib/upstash-redis";

const keyPrefix = "novalure:hubspot:submission:v2";
const completedTtlMs = 30 * 24 * 60 * 60 * 1000;
const processingLeaseMs = 5 * 60 * 1000;

const claimScript = `
-- hubspot_claim_v2
local current = redis.call("GET", KEYS[1])
local fingerprint = ARGV[1]
local claim_id = ARGV[2]
local now = tonumber(ARGV[3])
local lease_ms = tonumber(ARGV[4])
local ttl_ms = ARGV[5]

if not current then
  redis.call("SET", KEYS[1], "processing:" .. fingerprint .. ":" .. claim_id .. ":" .. ARGV[3], "PX", ttl_ms, "NX")
  return "claimed"
end

if string.sub(current, 1, 10) == "completed:" then
  if string.len(current) ~= 74 then
    return "invalid"
  end
  if string.sub(current, 11) == fingerprint then
    return "replay"
  end
  return "conflict"
end

if string.sub(current, 1, 11) ~= "processing:" then
  return "invalid"
end
if string.len(current) < 114 or string.sub(current, 76, 76) ~= ":" or string.sub(current, 113, 113) ~= ":" then
  return "invalid"
end

local current_fingerprint = string.sub(current, 12, 75)
if current_fingerprint ~= fingerprint then
  return "conflict"
end

local claimed_at_text = string.sub(current, 114)
if string.match(claimed_at_text, "^%d+$") == nil then
  return "invalid"
end
local claimed_at = tonumber(claimed_at_text)
if claimed_at <= now - lease_ms then
  redis.call("SET", KEYS[1], "processing:" .. fingerprint .. ":" .. claim_id .. ":" .. ARGV[3], "PX", ttl_ms)
  return "claimed"
end

return "processing"
`;

const completeScript = `
-- hubspot_complete_v2
local current = redis.call("GET", KEYS[1])
if not current or string.sub(current, 1, 11) ~= "processing:" then
  return 0
end
if string.len(current) < 114 or string.sub(current, 76, 76) ~= ":" or string.sub(current, 113, 113) ~= ":" then
  return 0
end

local fingerprint = string.sub(current, 12, 75)
local current_claim_id = string.sub(current, 77, 112)
local claimed_at_text = string.sub(current, 114)
if current_claim_id ~= ARGV[1] or string.match(claimed_at_text, "^%d+$") == nil then
  return 0
end

redis.call("SET", KEYS[1], "completed:" .. fingerprint, "PX", ARGV[2])
return 1
`;

const releaseScript = `
-- hubspot_release_v2
local current = redis.call("GET", KEYS[1])
if not current or string.sub(current, 1, 11) ~= "processing:" then
  return 0
end
if string.len(current) < 114 or string.sub(current, 76, 76) ~= ":" or string.sub(current, 113, 113) ~= ":" then
  return 0
end

local current_claim_id = string.sub(current, 77, 112)
local claimed_at_text = string.sub(current, 114)
if current_claim_id ~= ARGV[1] or string.match(claimed_at_text, "^%d+$") == nil then
  return 0
end

redis.call("DEL", KEYS[1])
return 1
`;

export type HubSpotSubmissionRedisClient = Pick<Redis, "eval">;

export type HubSpotSubmissionClaimResult =
  | { status: "claimed"; claimId: string }
  | "processing"
  | "replay";

export class HubSpotSubmissionStateUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "HubSpotSubmissionStateUnavailableError";
  }
}

export class HubSpotSubmissionConflictError extends Error {
  constructor() {
    super("Submission ID was reused with a different HubSpot payload");
    this.name = "HubSpotSubmissionConflictError";
  }
}

function isClaimId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function getHubSpotSubmissionKey(submissionId: string) {
  const namespace = resolveDeploymentContext().namespaceHash;
  const digest = createHash("sha256").update(submissionId, "utf8").digest("hex");
  return `${keyPrefix}:${namespace}:${digest}`;
}

export function getHubSpotPayloadFingerprint(payload: unknown) {
  let serialized: string | undefined;
  try {
    serialized = JSON.stringify(payload);
  } catch (error) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission payload is not serializable", { cause: error });
  }
  if (typeof serialized !== "string") {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission payload is not serializable");
  }
  return createHash("sha256").update(serialized, "utf8").digest("hex");
}

function resolveRedis(redis?: HubSpotSubmissionRedisClient) {
  try {
    return redis ?? getUpstashRedis();
  } catch (error) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission state storage is unavailable", { cause: error });
  }
}

async function runStateScript(
  redis: HubSpotSubmissionRedisClient,
  script: string,
  submissionId: string,
  args: string[]
) {
  try {
    return await redis.eval(script, [getHubSpotSubmissionKey(submissionId)], args);
  } catch (error) {
    if (error instanceof HubSpotSubmissionStateUnavailableError) throw error;
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission state operation failed", { cause: error });
  }
}

export async function claimHubSpotSubmission(
  submissionId: string,
  payload: unknown,
  options: {
    claimId?: string;
    nowMs?: number;
    redis?: HubSpotSubmissionRedisClient;
  } = {}
): Promise<HubSpotSubmissionClaimResult> {
  const claimId = options.claimId ?? randomUUID();
  const nowMs = options.nowMs ?? Date.now();
  if (!submissionId || submissionId.length > 128) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission ID is invalid");
  }
  if (!isClaimId(claimId)) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission claim ID is invalid");
  }
  if (!Number.isSafeInteger(nowMs) || nowMs < 0) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission state clock is invalid");
  }

  const result = await runStateScript(
    resolveRedis(options.redis),
    claimScript,
    submissionId,
    [
      getHubSpotPayloadFingerprint(payload),
      claimId,
      String(nowMs),
      String(processingLeaseMs),
      String(completedTtlMs)
    ]
  );

  if (result === "conflict") throw new HubSpotSubmissionConflictError();
  if (result === "claimed") return { status: "claimed", claimId };
  if (result === "processing" || result === "replay") return result;
  throw new HubSpotSubmissionStateUnavailableError("HubSpot submission state response is invalid");
}

export async function completeHubSpotSubmission(
  submissionId: string,
  claimId: string,
  options: { redis?: HubSpotSubmissionRedisClient } = {}
) {
  if (!submissionId || submissionId.length > 128 || !isClaimId(claimId)) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission completion input is invalid");
  }
  const result = await runStateScript(
    resolveRedis(options.redis),
    completeScript,
    submissionId,
    [claimId, String(completedTtlMs)]
  );
  if (Number(result) !== 1) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission state claim was lost");
  }
  return "completed" as const;
}

export async function releaseHubSpotSubmission(
  submissionId: string,
  claimId: string,
  options: { redis?: HubSpotSubmissionRedisClient } = {}
) {
  if (!submissionId || submissionId.length > 128 || !isClaimId(claimId)) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission release input is invalid");
  }
  const result = await runStateScript(
    resolveRedis(options.redis),
    releaseScript,
    submissionId,
    [claimId]
  );
  if (Number(result) !== 1) {
    throw new HubSpotSubmissionStateUnavailableError("HubSpot submission state claim could not be released");
  }
  return "released" as const;
}

export const hubSpotSubmissionStateConfiguration = {
  completedTtlMs,
  processingLeaseMs
} as const;
