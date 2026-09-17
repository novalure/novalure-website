import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { managedServiceCopy } from "@/content/managed-service-copy";
import { getCrmAppUrl, locales } from "@/lib/i18n";

const root = process.cwd();
const extensions = new Set([".ts", ".tsx", ".mjs", ".html"]);
const crmLabels = ["CRM-Login", "CRM login", "Acceso al CRM", "https://novalure-crm.app"];
// Commit 8969a44 intentionally restored CRM access in navigation. Marketing
// content still describes an operated service, not a self-service CRM product.
const navigationFiles = new Set([
  path.join(root, "components", "SiteHeader.tsx"),
  path.join(root, "components", "SiteFooter.tsx"),
  path.join(root, "lib", "i18n.ts")
]);

function collectTextFiles(target: string): string[] {
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return extensions.has(path.extname(absolute)) ? [absolute] : [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".next") return [];
    return collectTextFiles(path.join(target, entry.name));
  });
}

describe("managed-service website contract", () => {
  it("keeps CRM access in the approved navigation files, not marketing content", () => {
    const files = [
      ...collectTextFiles("app"), ...collectTextFiles("components"),
      ...collectTextFiles("content"), ...collectTextFiles("lib"),
      ...collectTextFiles("middleware.ts"),
      ...collectTextFiles("scripts/generate-playbooks.mjs"),
      ...collectTextFiles("public/playbooks")
    ].filter((file) => !navigationFiles.has(file));
    for (const file of files) {
      const source = fs.readFileSync(file, "utf8");
      for (const label of crmLabels) {
        expect(source, `${path.relative(root, file)}: CRM access belongs in navigation`).not.toContain(label);
      }
    }
  });

  it("preserves the released CRM links for desktop, mobile and footer", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");
    expect(header).toContain('data-track="nav_crm_login"');
    expect(header).toContain('data-track="mobile_crm_login"');
    expect(footer).toContain('data-track="footer_crm_login"');
    for (const locale of locales) expect(getCrmAppUrl(locale)).toBe("https://novalure-crm.app");
    for (const label of crmLabels.slice(0, 3)) {
      expect(header).toContain(label);
      expect(footer).toContain(label);
    }
  });

  it("explains the operated-service model consistently in every locale", () => {
    expect(managedServiceCopy.de.noticeBody).toContain("ohne das System selbst administrieren zu müssen");
    expect(managedServiceCopy.en.noticeBody).toContain("without having to administer the system");
    expect(managedServiceCopy.es.noticeBody).toContain("sin tener que administrar el sistema");
    expect(managedServiceCopy.de.noticeIntegration).toContain("technisch und vertraglich vereinbart");
    expect(managedServiceCopy.en.noticeIntegration).toContain("technically and contractually");
    expect(managedServiceCopy.es.noticeIntegration).toContain("técnica y contractualmente");
  });

  it("keeps the public system example as a separate navigation destination", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");
    expect(header).toContain('getPath(locale, "handover")');
    expect(header).toContain('data-track="nav_system_example"');
    expect(header).toContain('data-track="mobile_system_example"');
    expect(footer).toContain('data-track="footer_system_example"');
  });
});
