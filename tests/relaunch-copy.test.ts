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

  it("keeps both pipeline demos strictly localized", () => {
    const germanPipeline = [
      relaunchCopy.de.mockTitle,
      relaunchCopy.de.demoBadge,
      relaunchCopy.de.demoNote,
      relaunchCopy.de.scoreLabel,
      relaunchCopy.de.unitPenthouseA3,
      relaunchCopy.de.unitGardenB1,
      relaunchCopy.de.unitDuplexC2,
      relaunchCopy.de.unitApartmentD4,
      relaunchCopy.de.unitGardenB2,
      relaunchCopy.de.unitApartmentE1,
      relaunchCopy.de.unitDuplexC1,
      relaunchCopy.de.stViewing,
      relaunchCopy.de.stFollowup,
      relaunchCopy.de.stHandover,
      relaunchCopy.de.stDocs,
      relaunchCopy.de.srcLanding,
      relaunchCopy.de.pipeTitle,
      relaunchCopy.de.colA,
      relaunchCopy.de.colC
    ].join(" ");
    const englishPipeline = [
      relaunchCopy.en.mockTitle,
      relaunchCopy.en.demoBadge,
      relaunchCopy.en.demoNote,
      relaunchCopy.en.scoreLabel,
      relaunchCopy.en.unitPenthouseA3,
      relaunchCopy.en.unitGardenB1,
      relaunchCopy.en.unitDuplexC2,
      relaunchCopy.en.unitApartmentD4,
      relaunchCopy.en.unitGardenB2,
      relaunchCopy.en.unitApartmentE1,
      relaunchCopy.en.unitDuplexC1,
      relaunchCopy.en.stViewing,
      relaunchCopy.en.stFollowup,
      relaunchCopy.en.stHandover,
      relaunchCopy.en.stDocs,
      relaunchCopy.en.srcLanding,
      relaunchCopy.en.pipeTitle,
      relaunchCopy.en.colA,
      relaunchCopy.en.colC
    ].join(" ");

    expect(germanPipeline).toContain("Gartenwohnung B1");
    expect(germanPipeline).toContain("Bewertung");
    expect(germanPipeline).toContain("Nachfassen");
    expect(germanPipeline).not.toMatch(/\b(?:Garden|Apartment|Duplex|Viewing|Source|Documents|Score)\b/);

    expect(englishPipeline).toContain("Garden Apartment B1");
    expect(englishPipeline).toContain("Score");
    expect(englishPipeline).toContain("Follow-up");
    expect(englishPipeline).not.toMatch(/\b(?:Garten|Wohnung|Maisonette|Besichtigung|Quelle|Unterlagen|Bewertung|Nachfassen)\b/);
    expect(englishPipeline).not.toBe(germanPipeline);
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
