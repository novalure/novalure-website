import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RelaunchHomePageManaged } from "@/components/relaunch/RelaunchHomePageManaged";
import { architecturalCopy } from "@/content/architectural-copy";
import { relaunchCopy } from "@/content/relaunch-copy";
import type { Locale } from "@/lib/i18n";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

describe("architectural intelligence homepage", () => {
  it.each(["de", "en", "es"] as const)("keeps the conversion and truth labels in %s", (locale: Locale) => {
    const html = renderToStaticMarkup(<RelaunchHomePageManaged locale={locale} />);
    const hero = html.split("</section>")[0];

    expect(html).toContain(`aria-label="${relaunchCopy[locale].heroH1}`);
    expect(html).toContain(architecturalCopy[locale].heroSecondary);
    expect(html).toContain(architecturalCopy[locale].heroRole);
    expect(hero).toContain(architecturalCopy[locale].pathTitle);
    expect(hero).not.toContain(relaunchCopy[locale].unitPenthouseA3);
    expect(html).toContain(architecturalCopy[locale].manifestoApproach);
    expect(html).toContain(`href="#kontakt"`);
    expect(html).toContain(`href="#system"`);
    expect(html).toContain(architecturalCopy[locale].sampleVisual);
    expect(html).toContain(relaunchCopy[locale].demoBadge);
    expect(html).toContain("GRASL Immobilien, Schwaz");
    expect(html).toContain("audit-form");
  });
});
