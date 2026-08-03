import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const stylesheet = postcss.parse(readFileSync(resolve(process.cwd(), "app/relaunch.css"), "utf8"));

function mobileDeclaration(selector: string, property: string) {
  const values: string[] = [];

  stylesheet.walkAtRules("media", (media) => {
    if (media.params !== "(max-width: 599.98px)") return;

    media.walkRules((rule) => {
      if (!rule.selectors.includes(selector)) return;
      rule.walkDecls(property, (declaration) => {
        values.push(declaration.value);
      });
    });
  });

  return values;
}

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
