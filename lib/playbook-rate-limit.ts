import { createHash, randomUUID } from "node:crypto";
import { checkRateLimit } from "@vercel/firewall";
import { Redis } from "@upstash/redis";
import { resolveDeploymentContext } from "@/lib/deployment-context";
import { getUpstashRedis } from "@/lib/upstash-redis";

const ipWindowSeconds = 600;
const recipientLimit = 3;
const recipientWindowMs = 24 * 60 * 60 * 1000;
const recipientKeyPrefix = "novalure:playbook:recipient:v2";

// One atomic command enforces an exact rolling window. The sorted-set member is
// random so concurrent requests in the same millisecond are counted separately.
const recipientRateLimitScript = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window_ms = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
local cutoff = now - window_ms

redis.call("ZREMRANGEBYSCORE", key, "-inf", cutoff)
local existing_score = redis.call("ZSCORE", key, member)
local count = redis.call("ZCARD", key)

if existing_score then
  redis.call("PEXPIRE", key, window_ms)
  return {1, count, 0}
end

if count >= limit then
  local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
  local retry_at = now + window_ms
  if oldest[2] then
    retry_at = tonumber(oldest[2]) + window_ms
  end
  redis.call("PEXPIRE", key, window_ms)
  return {0, count, retry_at}
end

redis.call("ZADD", key, now, member)
redis.call("PEXPIRE", key, window_ms)
return {1, count + 1, 0}
`;

type RedisEvalClient = Pick<Redis, "eval">;
type FirewallChecker = typeof checkRateLimit;

export type PlaybookRateLimitResult = {
  rateLimited: boolean;
  retryAfterSeconds: number;
};

export class PlaybookRateLimitUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PlaybookRateLimitUnavailableError";
  }
}

export function normalizeRecipientEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getRecipientRateLimitKey(email: string) {
  const namespace = resolveDeploymentContext().namespaceHash;
  const digest = createHash("sha256")
    .update(normalizeRecipientEmail(email), "utf8")
    .digest("hex");

  return `${recipientKeyPrefix}:${namespace}:${digest}`;
}

function parseRecipientResult(value: unknown, nowMs: number): PlaybookRateLimitResult {
  if (!Array.isArray(value) || value.length < 3) {
    throw new PlaybookRateLimitUnavailableError("Upstash Redis returned an invalid rate-limit result");
  }

  const allowed = Number(value[0]);
  const retryAtMs = Number(value[2]);
  if ((allowed !== 0 && allowed !== 1) || !Number.isFinite(retryAtMs)) {
    throw new PlaybookRateLimitUnavailableError("Upstash Redis returned an invalid rate-limit result");
  }

  return {
    rateLimited: allowed === 0,
    retryAfterSeconds: allowed === 0
      ? Math.max(1, Math.ceil((retryAtMs - nowMs) / 1000))
      : 0
  };
}

export async function checkPlaybookIpRateLimit(
  request: Request,
  checker: FirewallChecker = checkRateLimit
): Promise<PlaybookRateLimitResult> {
  const ipRateLimitId = resolveDeploymentContext().ipRateLimitId;
  const result = await checker(ipRateLimitId, { request });

  if (result.error === "not-found" || (result.error && !result.rateLimited)) {
    throw new PlaybookRateLimitUnavailableError(`Vercel rate limit ${ipRateLimitId} is unavailable`);
  }

  return {
    rateLimited: result.rateLimited,
    retryAfterSeconds: result.rateLimited ? ipWindowSeconds : 0
  };
}

export async function checkPlaybookRecipientRateLimit(
  email: string,
  options: {
    nowMs?: number;
    requestId?: string;
    redis?: RedisEvalClient;
  } = {}
): Promise<PlaybookRateLimitResult> {
  const nowMs = options.nowMs ?? Date.now();
  if (!Number.isFinite(nowMs) || nowMs < 0) {
    throw new PlaybookRateLimitUnavailableError("Invalid rate-limit clock value");
  }

  let redis: RedisEvalClient;
  try {
    redis = options.redis ?? getUpstashRedis();
  } catch (error) {
    throw new PlaybookRateLimitUnavailableError("Upstash Redis configuration is incomplete", { cause: error });
  }
  const requestId = options.requestId?.trim();
  if (requestId && requestId.length > 128) {
    throw new PlaybookRateLimitUnavailableError("Invalid rate-limit request ID");
  }
  const member = requestId
    ? `submission:${createHash("sha256").update(requestId, "utf8").digest("hex")}`
    : `request:${randomUUID()}`;

  let result: unknown;
  try {
    result = await redis.eval(
      recipientRateLimitScript,
      [getRecipientRateLimitKey(email)],
      [String(nowMs), String(recipientWindowMs), String(recipientLimit), member]
    );
  } catch (error) {
    throw new PlaybookRateLimitUnavailableError("Upstash Redis rate-limit check failed", { cause: error });
  }

  return parseRecipientResult(result, nowMs);
}

export const playbookRateLimitConfiguration = {
  productionIpRateLimitId: "novalure-playbook-submit",
  previewIpRateLimitId: "novalure-playbook-submit-preview",
  ipWindowSeconds,
  recipientLimit,
  recipientWindowMs
} as const;
