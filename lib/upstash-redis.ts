import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function cleanEnvironmentValue(value: string | undefined) {
  return value?.trim() || "";
}

export function resolveUpstashRedisCredentials() {
  const directUrl = cleanEnvironmentValue(process.env.UPSTASH_REDIS_REST_URL);
  const directToken = cleanEnvironmentValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  const vercelUrl = cleanEnvironmentValue(process.env.KV_REST_API_URL);
  const vercelToken = cleanEnvironmentValue(process.env.KV_REST_API_TOKEN);

  if (vercelUrl || vercelToken) {
    if (vercelUrl && vercelToken) {
      return { url: vercelUrl, token: vercelToken };
    }
    throw new Error("Vercel KV Redis configuration is incomplete");
  }

  if (directUrl || directToken) {
    if (directUrl && directToken) {
      return { url: directUrl, token: directToken };
    }
    throw new Error("Direct Upstash Redis configuration is incomplete");
  }

  throw new Error("Upstash Redis configuration is incomplete");
}

export function getUpstashRedis() {
  if (!redisClient) {
    redisClient = new Redis(resolveUpstashRedisCredentials());
  }

  return redisClient;
}
