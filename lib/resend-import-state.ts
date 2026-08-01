import { createHash, randomUUID } from "node:crypto";
import type { Redis } from "@upstash/redis";
import { resolveDeploymentContext } from "@/lib/deployment-context";
import { getUpstashRedis } from "@/lib/upstash-redis";

const keyPrefix = "novalure:resend:import:v1";
const stateTtlMs = 48 * 60 * 60 * 1000;
const createLeaseMs = 60 * 1000;

const readScript = `
-- resend_import_read_v1
local current = redis.call("GET", KEYS[1])
if not current then
  return {0}
end
return {1, current}
`;

const claimScript = `
-- resend_import_claim_v1
local current = redis.call("GET", KEYS[1])
local fingerprint = ARGV[1]
local claim_id = ARGV[2]
local now_text = ARGV[3]
local now = tonumber(now_text)
local lease_ms = tonumber(ARGV[4])
local ttl_ms = ARGV[5]
local next_state = "creating:" .. fingerprint .. ":" .. claim_id .. ":" .. now_text

local function is_uuid(value)
  if string.len(value) ~= 36 then return false end
  if string.sub(value, 9, 9) ~= "-"
    or string.sub(value, 14, 14) ~= "-"
    or string.sub(value, 19, 19) ~= "-"
    or string.sub(value, 24, 24) ~= "-" then
    return false
  end
  local version = string.sub(value, 15, 15)
  local variant = string.sub(value, 20, 20)
  if string.find("12345678", version, 1, true) == nil
    or string.find("89ab", variant, 1, true) == nil then
    return false
  end
  local compact = string.gsub(value, "-", "")
  return string.len(compact) == 32 and string.match(compact, "^[0-9a-f]+$") ~= nil
end

local function is_timestamp(value)
  if string.match(value, "^%d+$") == nil then return false end
  if string.len(value) > 1 and string.sub(value, 1, 1) == "0" then return false end
  if string.len(value) > 16 then return false end
  if string.len(value) == 16 and value > "9007199254740991" then return false end
  return true
end

if not current then
  redis.call("SET", KEYS[1], next_state, "PX", ttl_ms, "NX")
  return {1, claim_id}
end

local prefix = "creating:" .. fingerprint .. ":"
if string.sub(current, 1, string.len(prefix)) == prefix then
  local remainder = string.sub(current, string.len(prefix) + 1)
  if string.len(remainder) >= 38 and string.sub(remainder, 37, 37) == ":" then
    local current_claim_id = string.sub(remainder, 1, 36)
    local claimed_at_text = string.sub(remainder, 38)
    if is_uuid(current_claim_id) and is_timestamp(claimed_at_text) then
      local claimed_at = tonumber(claimed_at_text)
      if claimed_at <= now - lease_ms then
        redis.call("SET", KEYS[1], next_state, "PX", ttl_ms)
        return {1, claim_id}
      end
      if current_claim_id == claim_id then
        return {1, claim_id}
      end
    end
  end
end

return {2, current}
`;

const storeImportScript = `
-- resend_import_store_v1
local current = redis.call("GET", KEYS[1])
if not current then
  return {0}
end

local fingerprint = ARGV[1]
local claim_id = ARGV[2]
local import_id = ARGV[3]
local ttl_ms = ARGV[4]
local target = "import:" .. fingerprint .. ":" .. import_id

local function is_timestamp(value)
  if string.match(value, "^%d+$") == nil then return false end
  if string.len(value) > 1 and string.sub(value, 1, 1) == "0" then return false end
  if string.len(value) > 16 then return false end
  if string.len(value) == 16 and value > "9007199254740991" then return false end
  return true
end

if current == target then
  return {1}
end

local prefix = "creating:" .. fingerprint .. ":" .. claim_id .. ":"
if string.sub(current, 1, string.len(prefix)) == prefix then
  local claimed_at_text = string.sub(current, string.len(prefix) + 1)
  if is_timestamp(claimed_at_text) then
    redis.call("SET", KEYS[1], target, "PX", ttl_ms)
    return {1}
  end
end

return {2, current}
`;

const markTerminalScript = `
-- resend_import_terminal_v1
local current = redis.call("GET", KEYS[1])
if not current then
  return {0}
end

local fingerprint = ARGV[1]
local import_id = ARGV[2]
local outcome = ARGV[3]
local ttl_ms = ARGV[4]
local expected = "import:" .. fingerprint .. ":" .. import_id
local target = "terminal:" .. fingerprint .. ":" .. import_id .. ":" .. outcome

if current == target then
  return {1}
end
if current == expected then
  redis.call("SET", KEYS[1], target, "PX", ttl_ms)
  return {1}
end

return {2, current}
`;

const releaseScript = `
-- resend_import_release_v1
local current = redis.call("GET", KEYS[1])
if not current then
  return {0}
end

local prefix = "creating:" .. ARGV[1] .. ":" .. ARGV[2] .. ":"
local function is_timestamp(value)
  if string.match(value, "^%d+$") == nil then return false end
  if string.len(value) > 1 and string.sub(value, 1, 1) == "0" then return false end
  if string.len(value) > 16 then return false end
  if string.len(value) == 16 and value > "9007199254740991" then return false end
  return true
end

if string.sub(current, 1, string.len(prefix)) == prefix then
  local claimed_at_text = string.sub(current, string.len(prefix) + 1)
  if is_timestamp(claimed_at_text) then
    redis.call("DEL", KEYS[1])
    return {1}
  end
end

return {2, current}
`;

const uuidSource = "[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
const uuidPattern = new RegExp(`^${uuidSource}$`, "i");
const tokenFingerprintPattern = /^[0-9a-f]{64}$/i;
const creatingPattern = new RegExp(`^creating:([0-9a-f]{64}):(${uuidSource}):([0-9]+)$`);
const importPattern = new RegExp(`^import:([0-9a-f]{64}):(${uuidSource})$`);
const terminalPattern = new RegExp(
  `^terminal:([0-9a-f]{64}):(${uuidSource}):(created|skipped|failed)$`
);

export type ResendImportOutcome = "created" | "skipped" | "failed";

export type ResendImportState =
  | { status: "none" }
  | { status: "creating"; claimId: string; claimedAtMs: number }
  | { status: "import"; importId: string }
  | { status: "terminal"; importId: string; outcome: ResendImportOutcome };

export type ResendImportClaimResult =
  | { status: "claimed"; claimId: string }
  | Exclude<ResendImportState, { status: "none" }>;

export type ResendImportStateRedisClient = Pick<Redis, "eval">;

export class ResendImportStateUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ResendImportStateUnavailableError";
  }
}

export class ResendImportPayloadConflictError extends Error {
  constructor() {
    super("Resend import token was reused with a different payload");
    this.name = "ResendImportPayloadConflictError";
  }
}

function validateTokenFingerprint(tokenFingerprint: string) {
  if (!tokenFingerprintPattern.test(tokenFingerprint)) {
    throw new ResendImportStateUnavailableError("Resend import token fingerprint is invalid");
  }
  return tokenFingerprint.toLowerCase();
}

function validateUuid(value: string, label: string) {
  if (!uuidPattern.test(value)) {
    throw new ResendImportStateUnavailableError(`Resend import ${label} is invalid`);
  }
  return value.toLowerCase();
}

function stableSerialize(value: unknown, ancestors: WeakSet<object>): string {
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Non-finite numbers are not JSON values");
    }
    return JSON.stringify(value);
  }
  if (typeof value !== "object") {
    throw new Error("Payload contains a non-JSON value");
  }
  if (ancestors.has(value)) {
    throw new Error("Payload is circular");
  }

  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      const entries: string[] = [];
      for (let index = 0; index < value.length; index += 1) {
        if (!(index in value)) throw new Error("Payload contains a sparse array");
        entries.push(stableSerialize(value[index], ancestors));
      }
      return `[${entries.join(",")}]`;
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new Error("Payload contains a non-plain object");
    }
    if (Object.getOwnPropertySymbols(value).length > 0) {
      throw new Error("Payload contains symbol keys");
    }

    const record = value as Record<string, unknown>;
    const entries = Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key], ancestors)}`);
    return `{${entries.join(",")}}`;
  } finally {
    ancestors.delete(value);
  }
}

export function getResendImportPayloadFingerprint(payload: unknown) {
  try {
    const serialized = stableSerialize(payload, new WeakSet());
    return createHash("sha256").update(serialized, "utf8").digest("hex");
  } catch (error) {
    throw new ResendImportStateUnavailableError("Resend import payload is not canonical JSON", { cause: error });
  }
}

export function getResendImportStateKey(tokenFingerprint: string) {
  const normalizedFingerprint = validateTokenFingerprint(tokenFingerprint);
  try {
    const namespace = resolveDeploymentContext().namespaceHash;
    const digest = createHash("sha256").update(normalizedFingerprint, "utf8").digest("hex");
    return `${keyPrefix}:${namespace}:${digest}`;
  } catch (error) {
    if (error instanceof ResendImportStateUnavailableError) throw error;
    throw new ResendImportStateUnavailableError("Resend import deployment namespace is unavailable", { cause: error });
  }
}

function resolveRedis(redis?: ResendImportStateRedisClient) {
  try {
    return redis ?? getUpstashRedis();
  } catch (error) {
    throw new ResendImportStateUnavailableError("Resend import state storage is unavailable", { cause: error });
  }
}

async function runStateScript(
  redis: ResendImportStateRedisClient,
  script: string,
  tokenFingerprint: string,
  args: string[]
) {
  try {
    return await redis.eval(script, [getResendImportStateKey(tokenFingerprint)], args);
  } catch (error) {
    if (
      error instanceof ResendImportStateUnavailableError
      || error instanceof ResendImportPayloadConflictError
    ) {
      throw error;
    }
    throw new ResendImportStateUnavailableError("Resend import state operation failed", { cause: error });
  }
}

function payloadConflict(storedFingerprint: string, expectedFingerprint: string) {
  if (storedFingerprint !== expectedFingerprint) {
    throw new ResendImportPayloadConflictError();
  }
}

function parseStoredState(value: unknown, expectedFingerprint: string): Exclude<ResendImportState, { status: "none" }> {
  if (typeof value !== "string") {
    throw new ResendImportStateUnavailableError("Resend import state response is invalid");
  }

  const creating = creatingPattern.exec(value);
  if (creating) {
    payloadConflict(creating[1], expectedFingerprint);
    if (creating[3] !== "0" && creating[3].startsWith("0")) {
      throw new ResendImportStateUnavailableError("Resend import creating timestamp is invalid");
    }
    const claimedAtMs = Number(creating[3]);
    if (!Number.isSafeInteger(claimedAtMs) || claimedAtMs < 0) {
      throw new ResendImportStateUnavailableError("Resend import creating timestamp is invalid");
    }
    return {
      status: "creating",
      claimId: creating[2],
      claimedAtMs
    };
  }

  const imported = importPattern.exec(value);
  if (imported) {
    payloadConflict(imported[1], expectedFingerprint);
    return { status: "import", importId: imported[2] };
  }

  const terminal = terminalPattern.exec(value);
  if (terminal) {
    payloadConflict(terminal[1], expectedFingerprint);
    return {
      status: "terminal",
      importId: terminal[2],
      outcome: terminal[3] as ResendImportOutcome
    };
  }

  throw new ResendImportStateUnavailableError("Resend import stored state is malformed");
}

function parseReadResult(value: unknown, expectedFingerprint: string): ResendImportState {
  if (!Array.isArray(value) || (value.length !== 1 && value.length !== 2)) {
    throw new ResendImportStateUnavailableError("Resend import read response is invalid");
  }
  const code = value[0];
  if (code === 0 && value.length === 1) return { status: "none" };
  if (code === 1 && value.length === 2) return parseStoredState(value[1], expectedFingerprint);
  throw new ResendImportStateUnavailableError("Resend import read response is invalid");
}

function parseClaimResult(
  value: unknown,
  expectedFingerprint: string,
  expectedClaimId: string
): ResendImportClaimResult {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new ResendImportStateUnavailableError("Resend import claim response is invalid");
  }
  const code = value[0];
  if (code === 1 && value[1] === expectedClaimId) {
    return { status: "claimed", claimId: expectedClaimId };
  }
  if (code === 2) return parseStoredState(value[1], expectedFingerprint);
  throw new ResendImportStateUnavailableError("Resend import claim response is invalid");
}

function parseMutationResult(
  value: unknown,
  expectedFingerprint: string,
  operation: string
) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 2) {
    throw new ResendImportStateUnavailableError(`Resend import ${operation} response is invalid`);
  }
  const code = value[0];
  if (code === 1 && value.length === 1) return;
  if (code === 2 && value.length === 2) {
    parseStoredState(value[1], expectedFingerprint);
  }
  throw new ResendImportStateUnavailableError(`Resend import ${operation} state was lost`);
}

export async function readResendImportState(
  tokenFingerprint: string,
  payload: unknown,
  options: { redis?: ResendImportStateRedisClient } = {}
): Promise<ResendImportState> {
  const payloadFingerprint = getResendImportPayloadFingerprint(payload);
  const result = await runStateScript(
    resolveRedis(options.redis),
    readScript,
    tokenFingerprint,
    []
  );
  return parseReadResult(result, payloadFingerprint);
}

export async function claimResendImportCreation(
  tokenFingerprint: string,
  payload: unknown,
  options: {
    claimId?: string;
    nowMs?: number;
    redis?: ResendImportStateRedisClient;
  } = {}
): Promise<ResendImportClaimResult> {
  const claimId = validateUuid(options.claimId ?? randomUUID(), "claim ID");
  const nowMs = options.nowMs ?? Date.now();
  if (!Number.isSafeInteger(nowMs) || nowMs < 0) {
    throw new ResendImportStateUnavailableError("Resend import state clock is invalid");
  }
  const payloadFingerprint = getResendImportPayloadFingerprint(payload);
  const result = await runStateScript(
    resolveRedis(options.redis),
    claimScript,
    tokenFingerprint,
    [payloadFingerprint, claimId, String(nowMs), String(createLeaseMs), String(stateTtlMs)]
  );
  return parseClaimResult(result, payloadFingerprint, claimId);
}

export async function storeResendImportId(
  tokenFingerprint: string,
  payload: unknown,
  claimId: string,
  importId: string,
  options: { redis?: ResendImportStateRedisClient } = {}
) {
  const normalizedClaimId = validateUuid(claimId, "claim ID");
  const normalizedImportId = validateUuid(importId, "ID");
  const payloadFingerprint = getResendImportPayloadFingerprint(payload);
  const result = await runStateScript(
    resolveRedis(options.redis),
    storeImportScript,
    tokenFingerprint,
    [payloadFingerprint, normalizedClaimId, normalizedImportId, String(stateTtlMs)]
  );
  parseMutationResult(result, payloadFingerprint, "ID storage");
  return { status: "import", importId: normalizedImportId } as const;
}

export async function markResendImportTerminal(
  tokenFingerprint: string,
  payload: unknown,
  importId: string,
  outcome: ResendImportOutcome,
  options: { redis?: ResendImportStateRedisClient } = {}
) {
  const normalizedImportId = validateUuid(importId, "ID");
  if (!(["created", "skipped", "failed"] as unknown[]).includes(outcome)) {
    throw new ResendImportStateUnavailableError("Resend import terminal outcome is invalid");
  }
  const payloadFingerprint = getResendImportPayloadFingerprint(payload);
  const result = await runStateScript(
    resolveRedis(options.redis),
    markTerminalScript,
    tokenFingerprint,
    [payloadFingerprint, normalizedImportId, outcome, String(stateTtlMs)]
  );
  parseMutationResult(result, payloadFingerprint, "terminal transition");
  return { status: "terminal", importId: normalizedImportId, outcome } as const;
}

export async function releaseResendImportCreation(
  tokenFingerprint: string,
  payload: unknown,
  claimId: string,
  options: { redis?: ResendImportStateRedisClient } = {}
) {
  const normalizedClaimId = validateUuid(claimId, "claim ID");
  const payloadFingerprint = getResendImportPayloadFingerprint(payload);
  const result = await runStateScript(
    resolveRedis(options.redis),
    releaseScript,
    tokenFingerprint,
    [payloadFingerprint, normalizedClaimId]
  );
  parseMutationResult(result, payloadFingerprint, "claim release");
  return "released" as const;
}

export const resendImportStateConfiguration = {
  createLeaseMs,
  stateTtlMs
} as const;
