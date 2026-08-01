import { createHash, randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import { resolveDeploymentContext } from "@/lib/deployment-context";
import { getUpstashRedis } from "@/lib/upstash-redis";

const stateKeyPrefix = "novalure:doi:v2";
const expiryGraceMs = 5 * 60 * 1000;
const processingTimeoutMs = 5 * 60 * 1000;

const registerScript = `
local current = redis.call("GET", KEYS[1])
if not current then
  redis.call("SET", KEYS[1], "pending", "PX", ARGV[1], "NX")
  return "created"
end
if current == "pending" or current == "used" or current == "blocked" then
  return current
end
return "processing"
`;

const claimScript = `
local current = redis.call("GET", KEYS[1])
if not current then
  return "missing"
end
if current == "pending" then
  redis.call("SET", KEYS[1], "processing:" .. ARGV[1] .. ":" .. ARGV[2], "KEEPTTL")
  return "claimed"
end
if current == "used" then
  return "used"
end
if current == "blocked" then
  return "blocked"
end
local claimed_at = string.match(current, "^processing:[^:]+:(%d+)$")
if claimed_at and tonumber(claimed_at) <= tonumber(ARGV[2]) - tonumber(ARGV[3]) then
  redis.call("SET", KEYS[1], "processing:" .. ARGV[1] .. ":" .. ARGV[2], "KEEPTTL")
  return "claimed"
end
return "processing"
`;

const completeScript = `
local current = redis.call("GET", KEYS[1])
local prefix = "processing:" .. ARGV[1] .. ":"
if not current or string.sub(current, 1, string.len(prefix)) ~= prefix then
  return 0
end
if string.match(string.sub(current, string.len(prefix) + 1), "^%d+$") == nil then
  return 0
end
redis.call("SET", KEYS[1], ARGV[2], "KEEPTTL")
return 1
`;

const releaseScript = `
local current = redis.call("GET", KEYS[1])
local prefix = "processing:" .. ARGV[1] .. ":"
if not current or string.sub(current, 1, string.len(prefix)) ~= prefix then
  return 0
end
if string.match(string.sub(current, string.len(prefix) + 1), "^%d+$") == nil then
  return 0
end
redis.call("SET", KEYS[1], "pending", "KEEPTTL")
return 1
`;

type RedisEvalClient = Pick<Redis, "eval">;

export class DoubleOptInStateUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "DoubleOptInStateUnavailableError";
  }
}

export function getDoubleOptInStateKey(tokenId: string) {
  const namespace = resolveDeploymentContext().namespaceHash;
  const digest = createHash("sha256").update(tokenId, "utf8").digest("hex");
  return `${stateKeyPrefix}:${namespace}:${digest}`;
}

async function runStateScript(
  redis: RedisEvalClient,
  script: string,
  tokenId: string,
  args: string[]
) {
  try {
    return await redis.eval(script, [getDoubleOptInStateKey(tokenId)], args);
  } catch (error) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state operation failed", { cause: error });
  }
}

function resolveRedis(redis?: RedisEvalClient) {
  try {
    return redis ?? getUpstashRedis();
  } catch (error) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state storage is unavailable", { cause: error });
  }
}

export async function registerDoubleOptInToken(
  tokenId: string,
  expiresAt: string,
  options: { nowMs?: number; redis?: RedisEvalClient } = {}
) {
  const nowMs = options.nowMs ?? Date.now();
  const expiryMs = Date.parse(expiresAt);
  const ttlMs = expiryMs - nowMs + expiryGraceMs;
  if (!tokenId || !Number.isFinite(expiryMs) || ttlMs <= 0) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state expiry is invalid");
  }

  const result = await runStateScript(
    resolveRedis(options.redis),
    registerScript,
    tokenId,
    [String(ttlMs)]
  );

  const status = String(result);
  if (!["created", "pending", "processing", "used", "blocked"].includes(status)) {
    throw new DoubleOptInStateUnavailableError("Double opt-in token registration response is invalid");
  }

  return status as "created" | "pending" | "processing" | "used" | "blocked";
}

export async function claimDoubleOptInToken(
  tokenId: string,
  options: { claimId?: string; nowMs?: number; redis?: RedisEvalClient } = {}
): Promise<{
  status: "claimed" | "missing" | "processing" | "used" | "blocked";
  claimId: string;
}> {
  const claimId = options.claimId ?? randomUUID();
  const nowMs = options.nowMs ?? Date.now();
  if (!Number.isFinite(nowMs) || nowMs < 0) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state clock is invalid");
  }
  const result = await runStateScript(
    resolveRedis(options.redis),
    claimScript,
    tokenId,
    [claimId, String(nowMs), String(processingTimeoutMs)]
  );
  const status = String(result);
  if (!["claimed", "missing", "processing", "used", "blocked"].includes(status)) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state response is invalid");
  }

  return {
    status: status as "claimed" | "missing" | "processing" | "used" | "blocked",
    claimId
  };
}

export const doubleOptInStateConfiguration = {
  expiryGraceMs,
  processingTimeoutMs
} as const;

export async function completeDoubleOptInToken(
  tokenId: string,
  claimId: string,
  outcome: "used" | "blocked",
  options: { redis?: RedisEvalClient } = {}
) {
  const result = await runStateScript(
    resolveRedis(options.redis),
    completeScript,
    tokenId,
    [claimId, outcome]
  );
  if (Number(result) !== 1) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state claim was lost");
  }
}

export async function releaseDoubleOptInToken(
  tokenId: string,
  claimId: string,
  options: { redis?: RedisEvalClient } = {}
) {
  const result = await runStateScript(
    resolveRedis(options.redis),
    releaseScript,
    tokenId,
    [claimId]
  );
  if (Number(result) !== 1) {
    throw new DoubleOptInStateUnavailableError("Double opt-in state claim could not be released");
  }
}
