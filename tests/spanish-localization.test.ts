import "@/content/spanish-market-positioning";
import { describe, expect, it } from "vitest";
import { pages } from "@/content/pages";
import { relaunchCopy } from "@/content/relaunch-copy";
import { getAlternates, getPath, getProcessAnchor, locales, routeMap } from "@/lib/i18n";
import { playbooks } from "@/lib/playbooks-meta";
import { organizationSchema, pageSchemas } from "@/lib/structured-data";
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

  it("positions Spain as the focus and keeps the international provenance explicit", () => {
    expect(relaunchCopy.es.trust).toBe(
      "Con raíces en Irlanda · Activos en Irlanda, DACH e internacionalmente · Ahora en España"
    );
    expect(relaunchCopy.es.heroSub).toContain("aplica en España");
    expect(relaunchCopy.es.heroSub).toContain("Irlanda, DACH y mercados internacionales");
    expect(relaunchCopy.es.chipKicker).toContain("mercado DACH");
    expect(relaunchCopy.es.proofNote).toContain("mandatos en el mercado DACH");

    const campaign = relaunchCopy.es.steps[3];
    expect(campaign.d).toContain("mercado español");
    expect(campaign.d).toContain("Irlanda, DACH y Reino Unido");
    expect(campaign.g).toContain("promociones costeras");
    expect(campaign.g).toContain("destinos vacacionales");

    const marketFaq = (pages.es.developers.faq ?? []).find(
      (item) => item.question === "¿En qué mercados e idiomas trabaja NovaLure?"
    );
    expect(marketFaq?.answer).toContain("El foco actual es España");
    expect(marketFaq?.answer).toContain("Irlanda, DACH");
    expect(marketFaq?.answer).toContain("español, inglés y alemán");
  });

  it("keeps every Spanish canonical route and ordinary internal CTA inside /es", () => {
    for (const key of Object.keys(routeMap) as (keyof typeof routeMap)[]) {
      expect(getPath("es", key)).toMatch(/^\/es(?:\/|$)/);
    }
    expect(getPath("es", "developers")).toBe("/es/promotores");
    expect(getPath("es", "agents")).toBe("/es/agencias-inmobiliarias");
    expect(getPath("es", "contact")).toBe("/es/analisis-del-proyecto");

    for (const page of Object.values(pages.es)) {
      for (const cta of [page.primaryCta, page.secondaryCta]) {
        if ("target" in cta) {
          expect(getPath("es", cta.target)).toMatch(/^\/es(?:\/|$)/);
        } else if (cta.href.startsWith("/")) {
          expect(cta.href).toMatch(/^\/es(?:\/|$)/);
        }
      }
    }

    expect(JSON.stringify(pages.es)).not.toMatch(/\/(?:de|en)(?:\/|$)/);
  });

  it("keeps de/en alternate links while setting the Spanish canonical and hreflang", () => {
    const alternates = getAlternates("es", "developers");
    expect(alternates.canonical).toBe("/es/promotores");
    expect(alternates.languages).toEqual({
      "en-GB": "/en/developers",
      "de-DE": "/de/bautraeger",
      "es-ES": "/es/promotores",
      "x-default": "/en/developers"
    });
  });

  it("targets the localized Spanish process section", () => {
    expect(getProcessAnchor("es")).toBe("proceso");
    expect(getProcessAnchor("de")).toBe("prozess");
    expect(getProcessAnchor("en")).toBe("prozess");
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
      file: "/playbooks/novalure-project-demand-es.pdf",
      cover: "/playbooks/covers/novalure-project-demand-es.png",
      pages: 10
    });
    expect(playbooks["es-agent"]).toMatchObject({
      file: "/playbooks/novalure-owned-demand-es.pdf",
      cover: "/playbooks/covers/novalure-owned-demand-es.png",
      pages: 10
    });
  });

  it("emits Spanish schema language, Spain coverage and no homepage breadcrumb", () => {
    const schemas = pageSchemas(pages.es.home);
    expect(schemas.some((schema) => (schema as { inLanguage?: string }).inLanguage === "es-ES")).toBe(true);
    expect(schemas.map((schema) => (schema as { "@type"?: string })["@type"])).not.toContain("BreadcrumbList");

    const organization = organizationSchema("es") as {
      description: string;
      areaServed: string[];
      knowsLanguage: string[];
      slogan: string;
    };
    expect(organization.description).toContain("España");
    expect(organization.areaServed).toEqual(expect.arrayContaining(["ES", "IE", "AT", "DE", "CH", "GB"]));
    expect(organization.knowsLanguage).toEqual(["es", "en", "de"]);
    expect(organization.slogan).toContain("mercado inmobiliario español");
  });

  it("does not change the German or English market copy", () => {
    expect(relaunchCopy.de.trust).toBe("Rooted in Ireland · Aktiv in DACH, UK & international");
    expect(relaunchCopy.en.trust).toBe("Rooted in Ireland · Active in DACH, UK & internationally");
    expect(organizationSchema("de").areaServed).toEqual(["AT", "DE", "CH", "LI", "IE", "GB", "EU"]);
    expect(organizationSchema("en").areaServed).toEqual(["AT", "DE", "CH", "LI", "IE", "GB", "EU"]);
  });
});
