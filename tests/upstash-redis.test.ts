import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveUpstashRedisCredentials } from "@/lib/upstash-redis";

function configure(values: {
  kvUrl?: string;
  kvToken?: string;
  directUrl?: string;
  directToken?: string;
}) {
  vi.stubEnv("KV_REST_API_URL", values.kvUrl || "");
  vi.stubEnv("KV_REST_API_TOKEN", values.kvToken || "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", values.directUrl || "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", values.directToken || "");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Upstash Redis configuration", () => {
  it("prefers the complete Vercel-injected pair", () => {
    configure({
      kvUrl: "https://kv.example.com",
      kvToken: "kv-token",
      directUrl: "https://direct.example.com",
      directToken: "direct-token"
    });
    expect(resolveUpstashRedisCredentials()).toEqual({
      url: "https://kv.example.com",
      token: "kv-token"
    });
  });

  it("uses a complete direct pair only when Vercel variables are absent", () => {
    configure({
      directUrl: "https://direct.example.com",
      directToken: "direct-token"
    });
    expect(resolveUpstashRedisCredentials()).toEqual({
      url: "https://direct.example.com",
      token: "direct-token"
    });
  });

  it("rejects a partial canonical pair instead of masking it with stale direct credentials", () => {
    configure({
      kvUrl: "https://kv.example.com",
      directUrl: "https://direct.example.com",
      directToken: "direct-token"
    });
    expect(() => resolveUpstashRedisCredentials()).toThrow(/Vercel KV/);
  });

  it("rejects partial direct credentials and a completely missing configuration", () => {
    configure({ directToken: "direct-token" });
    expect(() => resolveUpstashRedisCredentials()).toThrow(/Direct Upstash/);

    configure({});
    expect(() => resolveUpstashRedisCredentials()).toThrow(/incomplete/);
  });
});
