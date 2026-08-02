import { describe, expect, it } from "vitest";
import { relaunchCopy } from "@/content/relaunch-copy";
import { pages } from "@/content/pages";
import { organizationSchema, pageSchemas } from "@/lib/structured-data";

describe("relaunch reference copy", () => {
  it("keeps the German and English content contracts in sync", () => {
    expect(Object.keys(relaunchCopy.de).sort()).toEqual(Object.keys(relaunchCopy.en).sort());
  });

  it.each(["de", "en"] as const)("contains every repeated section item for %s", (locale) => {
    const copy = relaunchCopy[locale];

    expect(copy.pairs).toHaveLength(3);
    expect(copy.steps).toHaveLength(6);
    expect(copy.faq).toHaveLength(6);
  });

  it("retains the approved hero messages", () => {
    expect(relaunchCopy.de.heroH1).toBe("Ihr Projekt verdient Käufer – nicht Kontaktlisten.");
    expect(relaunchCopy.en.heroH1).toBe("Your project deserves buyers – not contact lists.");
  });

  it("keeps the homepage schema localized without a duplicate breadcrumb", () => {
    const schemaTypes = pageSchemas(pages.en.home).map((schema) => (schema as { "@type"?: string })["@type"]);

    expect(schemaTypes).toContain("Organization");
    expect(schemaTypes).toContain("WebSite");
    expect(schemaTypes).toContain("FAQPage");
    expect(schemaTypes).not.toContain("BreadcrumbList");
    expect(organizationSchema("en").areaServed).toContain("GB");
  });
});
