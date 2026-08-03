import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const stylesheet = postcss.parse(readFileSync(resolve(process.cwd(), "app/relaunch.css"), "utf8"));

function mobileDeclaration(selector: string, property: string) {
  return mediaDeclaration("(max-width: 599.98px)", selector, property);
}

function mediaDeclaration(query: string, selector: string, property: string) {
  const values: string[] = [];

  stylesheet.walkAtRules("media", (media) => {
    if (media.params !== query) return;

    media.walkRules((rule) => {
      if (!rule.selectors.includes(selector)) return;
      rule.walkDecls(property, (declaration) => {
        values.push(declaration.value);
      });
    });
  });

  return values;
}

function baseDeclaration(selector: string, property: string) {
  const values: string[] = [];

  stylesheet.walkRules((rule) => {
    if (rule.parent?.type === "atrule") return;
    if (!rule.selectors.includes(selector)) return;
    rule.walkDecls(property, (declaration) => {
      values.push(declaration.value);
    });
  });

  return values;
}

function containerDeclaration(query: string, selector: string, property: string) {
  const values: string[] = [];

  stylesheet.walkAtRules("container", (container) => {
    if (container.params !== query) return;

    container.walkRules((rule) => {
      if (!rule.selectors.includes(selector)) return;
      rule.walkDecls(property, (declaration) => {
        values.push(declaration.value);
      });
    });
  });

  return values;
}

describe("homepage playbook layout", () => {
  it("keeps the white form card inset on desktop", () => {
    expect(baseDeclaration(".v3-playbook .hubspot-card", "padding"))
      .toContain("clamp(22px, 2.2vw, 30px)");
    expect(baseDeclaration(".v3-playbook-shell", "max-width")).toContain("1260px");
  });

  it("collapses the outer grid before the nested form becomes cramped", () => {
    expect(mediaDeclaration("(max-width: 1349.98px)", ".v3-playbook-shell", "grid-template-columns"))
      .toContain("1fr");
    expect(mediaDeclaration("(max-width: 1349.98px)", ".v3-playbook-shell", "max-width"))
      .toContain("960px");
  });

  it("reacts to the card width instead of relying only on viewport breakpoints", () => {
    expect(baseDeclaration(".v3-playbook .hubspot-card", "container-type")).toContain("inline-size");
    expect(containerDeclaration("home-playbook-card (max-width: 699.98px)", ".v3-playbook .playbook-form-layout", "grid-template-columns"))
      .toContain("minmax(0, 1fr)");
    expect(containerDeclaration("home-playbook-card (max-width: 699.98px)", ".v3-playbook .playbook-preview-panel", "display"))
      .toContain("none");
  });
});

describe("mobile playbook form layout", () => {
  it("keeps narrow form content shrinkable and single-column", () => {
    expect(mobileDeclaration(".playbook-form-layout", "grid-template-columns"))
      .toContain("minmax(0, 1fr)");
    expect(mobileDeclaration(".playbook-contact-form", "grid-template-columns"))
      .toContain("minmax(0, 1fr)");
    expect(mobileDeclaration(".playbook-selector", "grid-template-columns"))
      .toContain("minmax(0, 1fr)");
    expect(mobileDeclaration(".consent-row > span", "min-width")).toContain("0");
  });

  it("allows long mobile labels and the submit action to wrap inside their borders", () => {
    expect(mobileDeclaration(".playbook-selector label span", "overflow-wrap"))
      .toContain("anywhere");
    expect(mobileDeclaration(".consent-row > span", "overflow-wrap"))
      .toContain("anywhere");
    expect(mobileDeclaration(".form-state b", "overflow-wrap")).toContain("anywhere");
    expect(mobileDeclaration(".playbook-submit-button", "white-space")).toContain("normal");
    expect(mobileDeclaration(".playbook-submit-button", "width")).toContain("100%");
  });
});
