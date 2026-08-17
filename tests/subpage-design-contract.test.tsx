import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarketingPage } from "@/components/MarketingPage";
import { pages } from "@/content/pages";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

describe("relaunch subpage design contract", () => {
  it.each([
    ["audience", pages.de.developers, "relaunch-subpage-audience"],
    ["playbooks", pages.en.playbooks, "relaunch-subpage-playbooks"],
    ["contact", pages.de.contact, "relaunch-subpage-contact"],
    ["handover", pages.en.handover, "relaunch-subpage-handover"],
    ["thank-you", pages.de.playbookThanks, "relaunch-subpage-thank-you"],
    ["legal", pages.en.privacy, "relaunch-subpage-legal"]
  ] as const)("renders the %s template inside the shared relaunch shell", (_name, content, expectedClass) => {
    const html = renderToStaticMarkup(<MarketingPage content={content} />);

    expect(html).toContain(expectedClass);
    expect(html).toContain("v3-subpage-hero");
    expect(html).toContain(content.title);
    expect(html).not.toContain("funnel-hero-visual");
  });

  it.each([pages.de.imprint, pages.de.privacy, pages.de.cookies, pages.en.imprint, pages.en.privacy, pages.en.cookies])(
    "keeps every legal section available in the new table of contents for $locale/$key",
    (content) => {
      const html = renderToStaticMarkup(<MarketingPage content={content} />);

      expect(html.match(/id="legal-section-/g)).toHaveLength(content.sections?.length ?? 0);
      expect(html.match(/href="#legal-section-/g)).toHaveLength(content.sections?.length ?? 0);
    }
  );
});
