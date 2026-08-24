import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { managedServiceCopy } from "@/content/managed-service-copy";

const root = process.cwd();
const extensions = new Set([".ts", ".tsx", ".mjs", ".html"]);
const forbiddenPublicLabels = [
  "CRM-Login",
  "CRM login",
  "Acceso al CRM",
  "https://novalure-crm.app"
];

function collectTextFiles(target: string): string[] {
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return extensions.has(path.extname(absolute)) ? [absolute] : [];

  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".next") return [];
    const relative = path.join(target, entry.name);
    return entry.isDirectory() ? collectTextFiles(relative) : collectTextFiles(relative);
  });
}

describe("managed-service website contract", () => {
  it("contains no public CRM-login label or CRM application link", () => {
    const files = [
      ...collectTextFiles("app"),
      ...collectTextFiles("components"),
      ...collectTextFiles("content"),
      ...collectTextFiles("lib"),
      ...collectTextFiles("middleware.ts"),
      ...collectTextFiles("scripts/generate-playbooks.mjs"),
      ...collectTextFiles("public/playbooks")
    ];

    const combined = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
    for (const label of forbiddenPublicLabels) {
      expect(combined).not.toContain(label);
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

  it("uses the public system example as the secondary navigation destination", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");

    expect(header).toContain('getPath(locale, "handover")');
    expect(header).toContain('data-track="nav_system_example"');
    expect(header).toContain('data-track="mobile_system_example"');
    expect(footer).toContain('data-track="footer_system_example"');
  });
});
