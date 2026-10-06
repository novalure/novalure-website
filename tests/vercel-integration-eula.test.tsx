import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/[locale]/[[...slug]]/page";
import { MarketingPage } from "@/components/MarketingPage";
import { pages } from "@/content/pages";
import {
  vercelIntegrationEulaLastUpdated,
  vercelIntegrationEulaSections
} from "@/content/vercel-integration-eula";
import { getAlternates, getPath } from "@/lib/i18n";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

describe("Evelyn Vercel Service Identity Provider EULA", () => {
  it("uses the dedicated canonical route and is indexable", async () => {
    expect(getPath("en", "vercelIntegrationEula")).toBe("/en/vercel-integration-eula");
    expect(getAlternates("en", "vercelIntegrationEula")).toEqual({
      canonical: "/en/vercel-integration-eula",
      languages: {
        "en-GB": "/en/vercel-integration-eula",
        "x-default": "/en/vercel-integration-eula"
      }
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: ["vercel-integration-eula"] })
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("locks the exact approved projects and read-only metadata scope", () => {
    const text = JSON.stringify(pages.en.vercelIntegrationEula);
    for (const project of ["evelyn", "novalure-crm", "novalure-website"]) {
      expect(text).toContain(project);
    }
    for (const metadata of [
      "Deployment metadata",
      "Project metadata",
      "Team metadata",
      "Domain metadata",
      "Integration installation and configuration metadata"
    ]) {
      expect(text).toContain(metadata);
    }
    expect(text).toContain("read-only");
    expect(text).toContain("No automatic scope expansion");
  });

  it("explicitly excludes billing, environment variables, writes and wildcard scope", () => {
    const text = JSON.stringify(pages.en.vercelIntegrationEula);
    for (const excluded of [
      "Billing access",
      "Environment-variable access",
      "Deployment creation",
      "Project creation",
      "Wildcard, future-project or unrestricted team-wide project access"
    ]) {
      expect(text).toContain(excluded);
    }
  });

  it("covers credential handling, ownership, privacy, revocation and support", () => {
    const text = JSON.stringify(pages.en.vercelIntegrationEula);
    for (const required of [
      "Azure Key Vault",
      "does not sell",
      "does not transfer ownership",
      "may revoke or disable",
      "hello@novalure.eu",
      "Republic of Ireland",
      vercelIntegrationEulaLastUpdated
    ]) {
      expect(text).toContain(required);
    }
  });

  it("renders a readable legal document with working policy links", () => {
    const html = renderToStaticMarkup(<MarketingPage content={pages.en.vercelIntegrationEula} />);
    expect(vercelIntegrationEulaSections).toHaveLength(18);
    expect(html).toContain("Evelyn Vercel Service Identity Provider EULA");
    expect(html.match(/id="legal-section-/g)).toHaveLength(18);
    expect(html).toContain('href="/en/legal/privacy"');
    expect(html).toContain('href="/en/legal/imprint"');
    expect(html).toContain('href="mailto:hello@novalure.eu"');
  });

  it("uses verified provider facts already present in the English imprint", () => {
    const imprint = JSON.stringify(pages.en.imprint);
    const eula = JSON.stringify(pages.en.vercelIntegrationEula);
    for (const fact of ["NovaLure CLG", "796735", "20 Harcourt Street", "hello@novalure.eu"]) {
      expect(eula).toContain(fact);
      expect(imprint).toContain(fact);
    }
  });
});
