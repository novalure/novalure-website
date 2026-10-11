import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/SiteHeader";
import { getPath } from "@/lib/i18n";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/developers" }));

(globalThis as typeof globalThis & { React: typeof React }).React = React;

describe("architectural navigation", () => {
  it("keeps desktop and mobile project paths, menu controls, and language equivalents", () => {
    const html = renderToStaticMarkup(<SiteHeader locale="en" />);

    expect(html).toContain('aria-controls="mobile-menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain(`href="${getPath("en", "contact")}"`);
    expect(html).toContain(`href="${getPath("en", "handover")}"`);
    expect(html).toContain(`hrefLang="de" href="${getPath("de", "developers")}"`);
    expect(html).toContain(`hrefLang="es" href="${getPath("es", "developers")}"`);
    expect(html).toContain("CRM login");
  });
});
