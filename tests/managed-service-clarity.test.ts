import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { managedServiceCopy } from "@/content/managed-service-copy";

const root = process.cwd();

describe("managed-service website contract", () => {
  it("keeps employee access out of customer navigation and in the footer only", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");

    expect(header).not.toContain("getCrmAppUrl(locale)");
    expect(header).not.toContain('data-track="nav_crm_login"');
    expect(header).not.toContain('data-track="mobile_crm_login"');
    expect(footer).toContain("getCrmAppUrl(locale)");
    expect(footer).toContain('data-track="footer_staff_login"');
    expect(footer).toContain('"Mitarbeiter-Login"');
    expect(footer).toContain('"Staff Login"');
  });

  it("explains the operated-service model consistently in every locale", () => {
    expect(managedServiceCopy.de.noticeBody).toContain("ohne das System selbst administrieren zu müssen");
    expect(managedServiceCopy.en.noticeBody).toContain("without having to administer the system");
    expect(managedServiceCopy.es.noticeBody).toContain("sin tener que administrar el sistema");

    expect(managedServiceCopy.de.noticeIntegration).toContain("technisch und vertraglich vereinbart");
    expect(managedServiceCopy.en.noticeIntegration).toContain("technically and contractually");
    expect(managedServiceCopy.es.noticeIntegration).toContain("técnica y contractualmente");
  });

  it("keeps operational technology out of public navigation", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");

    expect(header).not.toContain('data-track="nav_system_example"');
    expect(header).not.toContain('data-track="mobile_system_example"');
    expect(header).toContain('getPath(locale, "developers")');
    expect(header).toContain('getPath(locale, "agents")');
    expect(footer).not.toContain('data-track="footer_system_example"');
  });

  it("states the operated AI communication and reporting benefits publicly", () => {
    const homepage = fs.readFileSync(path.join(root, "components", "relaunch", "RelaunchHomePageManaged.tsx"), "utf8");
    const audiencePages = fs.readFileSync(path.join(root, "components", "MarketingPage.tsx"), "utf8");

    expect(homepage).toContain("24/7 erreichbar");
    expect(homepage).toContain("Wöchentliche Klarheit");
    expect(audiencePages).toContain("KI-gestützte Kommunikation führt NovaLure als Teil des Services");
    expect(audiencePages).toContain("Wöchentliches Reporting & Optimierung");
  });
});
