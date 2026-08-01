import { createHash } from "node:crypto";

export type DeploymentEnvironment = "production" | "preview" | "development";

export type DeploymentContext = {
  environment: DeploymentEnvironment;
  // Immutable origin used as the trust boundary for signatures, Redis keys
  // and provider idempotency. Never replace this with a moving branch alias.
  origin: string;
  // Routable origin used in recipient-facing links. Preview deployments use
  // their Git branch alias when available because VERCEL_URL is incompatible
  // with Standard Deployment Protection.
  publicOrigin: string;
  audience: string;
  namespaceHash: string;
  ipRateLimitId: string;
};

function canonicalOrigin(value: string, allowLocalHttp = false) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Deployment origin is missing");

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(candidate);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";

  if (
    url.username
    || url.password
    || (url.pathname && url.pathname !== "/")
    || url.search
    || url.hash
    || (url.protocol !== "https:" && !(allowLocalHttp && isLocal && url.protocol === "http:"))
  ) {
    throw new Error("Deployment origin is invalid");
  }

  return url.origin;
}

export function resolveDeploymentContext(): DeploymentContext {
  const rawEnvironment = process.env.VERCEL_ENV?.trim();
  let environment: DeploymentEnvironment;
  let origin: string;
  let publicOrigin: string;

  if (rawEnvironment === "preview") {
    environment = "preview";
    origin = canonicalOrigin(process.env.VERCEL_URL || "");
    publicOrigin = canonicalOrigin(process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL || "");
  } else if (rawEnvironment === "production") {
    environment = "production";
    origin = canonicalOrigin(process.env.NEXT_PUBLIC_SITE_URL || "");
    publicOrigin = origin;
  } else if (!rawEnvironment || rawEnvironment === "development") {
    environment = "development";
    // Never reuse the public Production URL for local DOI links. A token made
    // locally is audience-bound to development and would therefore be rejected
    // if the link accidentally pointed at Production.
    origin = canonicalOrigin(process.env.PLAYBOOK_DEVELOPMENT_ORIGIN || "http://localhost:3000", true);
    const developmentHost = new URL(origin).hostname;
    if (!["localhost", "127.0.0.1", "[::1]"].includes(developmentHost)) {
      throw new Error("Development origin must use localhost");
    }
    publicOrigin = origin;
  } else {
    throw new Error("VERCEL_ENV is invalid");
  }

  const audience = `${environment}:${origin}`;
  const namespaceHash = createHash("sha256").update(audience, "utf8").digest("hex");
  const ipRateLimitId = environment === "preview"
    ? "novalure-playbook-submit-preview"
    : environment === "production"
      ? "novalure-playbook-submit"
      : "novalure-playbook-submit-development";

  return { environment, origin, publicOrigin, audience, namespaceHash, ipRateLimitId };
}

export function getScopedIdempotencyKey(kind: "playbook" | "doi" | "owner", submissionId: string) {
  return `${kind}/${resolveDeploymentContext().namespaceHash}/${submissionId}`;
}
