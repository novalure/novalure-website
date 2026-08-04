import { describe, expect, it } from "vitest";
import { pages } from "@/content/pages";
import { relaunchCopy } from "@/content/relaunch-copy";
import { getPath, locales, routeMap } from "@/lib/i18n";
import { playbooks } from "@/lib/playbooks-meta";
import { pageSchemas } from "@/lib/structured-data";
import { selectLocale } from "@/middleware";

const spanishCountries = [
  "ES", "MX", "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV",
  "GQ", "GT", "HN", "NI", "PA", "PY", "PE", "PR", "UY", "VE"
];

describe("Spanish localization", () => {
  it("adds es-ES as a complete third locale", () => {
    expect(locales).toEqual(["en", "de", "es"]);
    expect(Object.keys(relaunchCopy.es).sort()).toEqual(Object.keys(relaunchCopy.en).sort());
    expect(Object.keys(pages.es).sort()).toEqual(Object.keys(pages.en).sort());
    expect(relaunchCopy.es.pairs).toHaveLength(3);
    expect(relaunchCopy.es.steps).toHaveLength(6);
    expect(relaunchCopy.es.faq).toHaveLength(6);
  });

  it("keeps every Spanish canonical route inside /es", () => {
    for (const key of Object.keys(routeMap) as (keyof typeof routeMap)[]) {
      expect(getPath("es", key)).toMatch(/^\/es(?:\/|$)/);
    }
    expect(getPath("es", "developers")).toBe("/es/promotores");
    expect(getPath("es", "agents")).toBe("/es/agencias-inmobiliarias");
    expect(getPath("es", "contact")).toBe("/es/analisis-del-proyecto");
  });

  it.each(spanishCountries)("selects Spanish for country %s", (country) => {
    expect(selectLocale({ country, acceptLanguage: "en-GB" })).toBe("es");
  });

  it("respects a manual locale before geo and uses browser language as fallback", () => {
    expect(selectLocale({ cookieLocale: "de", country: "ES", acceptLanguage: "es-ES" })).toBe("de");
    expect(selectLocale({ country: "US", acceptLanguage: "es-ES,es;q=0.9,en;q=0.8" })).toBe("es");
    expect(selectLocale({ country: "US", acceptLanguage: "fr-FR" })).toBe("en");
  });

  it("localizes the CRM demo without German or English interface labels", () => {
    const pipeline = [
      relaunchCopy.es.mockTitle,
      relaunchCopy.es.demoBadge,
      relaunchCopy.es.scoreLabel,
      relaunchCopy.es.stViewing,
      relaunchCopy.es.stFollowup,
      relaunchCopy.es.stHandover,
      relaunchCopy.es.srcLanding,
      relaunchCopy.es.colA,
      relaunchCopy.es.colC
    ].join(" ");

    expect(pipeline).toContain("Demostración");
    expect(pipeline).toContain("Seguimiento");
    expect(pipeline).toContain("Traspaso");
    expect(pipeline).not.toMatch(/\b(?:Viewing|Source|Score|Follow-up|Handover|Besichtigung|Quelle|Nachfassen|Übergabe)\b/);
  });

  it("links only Spanish PDFs and covers from Spanish forms", () => {
    expect(playbooks["es-developer"]).toMatchObject({
      file: "/playbooks/novalure-playbook-promotores-es.pdf",
      cover: "/playbooks/covers/promotores-es-cover.png",
      pages: 12
    });
    expect(playbooks["es-agent"]).toMatchObject({
      file: "/playbooks/novalure-playbook-agencias-inmobiliarias-es.pdf",
      cover: "/playbooks/covers/agencias-es-cover.png",
      pages: 12
    });
  });

  it("emits Spanish schema language and no homepage breadcrumb", () => {
    const schemas = pageSchemas(pages.es.home);
    expect(schemas.some((schema) => (schema as { inLanguage?: string }).inLanguage === "es-ES")).toBe(true);
    expect(schemas.map((schema) => (schema as { "@type"?: string })["@type"])).not.toContain("BreadcrumbList");
  });
});
