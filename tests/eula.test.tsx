import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarketingPage } from "@/components/MarketingPage";
import { eulaLastUpdated, eulaSections } from "@/content/eula";
import { pages } from "@/content/pages";
import { getAlternates, getPath } from "@/lib/i18n";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

describe("public EULA", () => {
  it("uses the required canonical route without locale alternates for untranslated legal text", () => {
    expect(getPath("en", "eula")).toBe("/en/eula");
    expect(getAlternates("en", "eula")).toEqual({
      canonical: "/en/eula",
      languages: { "en-GB": "/en/eula", "x-default": "/en/eula" }
    });
  });

  it("covers all required legal topics in 28 numbered sections", () => {
    expect(eulaSections).toHaveLength(28);
    expect(eulaSections.map((section) => section.title)).toEqual(expect.arrayContaining([
      "4. Scope of the Licence",
      "9. APIs and Automated Access",
      "10. AI and Automated Features",
      "18. Suspension and Termination",
      "20. Limitation of Liability",
      "21. Indemnity for Business Use",
      "24. Governing Law and Jurisdiction",
      "26. Entire Agreement and Order of Precedence"
    ]));
  });

  it("keeps service identities, statutory rights and negotiated agreements explicit", () => {
    const text = JSON.stringify(pages.en.eula);
    expect(text).toContain("service accounts");
    expect(text).toContain("workload identities");
    expect(text).toContain("automated agents");
    expect(text).toContain("Nothing in this EULA limits any rights that cannot lawfully be excluded or restricted.");
    expect(text).toContain("No monetary liability cap is created by this public EULA");
    expect(text).toContain("that document controls to the extent of a conflict");
    expect(text).toContain(`Last updated: ${eulaLastUpdated}`);
  });

  it("renders the native legal layout with working internal policy links", () => {
    const html = renderToStaticMarkup(<MarketingPage content={pages.en.eula} />);
    expect(html).toContain("End User Licence Agreement (EULA)");
    expect(html.match(/id="legal-section-/g)).toHaveLength(28);
    expect(html).toContain('href="/en/legal/privacy"');
    expect(html).toContain('href="/en/legal/imprint"');
    expect(html).toContain('href="mailto:hello@novalure.eu"');
  });

  it("uses only company facts already present in the canonical English imprint", () => {
    const imprint = JSON.stringify(pages.en.imprint);
    for (const fact of ["NovaLure CLG", "796735", "20 Harcourt Street", "hello@novalure.eu"]) {
      expect(JSON.stringify(pages.en.eula)).toContain(fact);
      expect(imprint).toContain(fact);
    }
    expect(JSON.stringify(pages.en.eula)).not.toContain("LEGAL_FACT_NOT_VERIFIED");
  });
});
