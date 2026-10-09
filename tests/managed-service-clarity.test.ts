import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { managedServiceCopy } from "@/content/managed-service-copy";
import { realEstateServiceOffering } from "@/content/real-estate-service-offering";
import { getCrmAppUrl, locales } from "@/lib/i18n";

const root = process.cwd();

describe("managed-service website contract", () => {
  it("keeps employee access out of customer navigation and in the footer only", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");

    expect(header).not.toContain("getCrmAppUrl(locale)");
    expect(header).not.toContain('data-track="nav_crm_login"');
    expect(header).not.toContain('data-track="mobile_crm_login"');
    expect(footer).toContain('data-track="footer_staff_login"');
    expect(footer).toContain('"Mitarbeiter-Login"');
    expect(footer).toContain('"Staff Login"');
    for (const locale of locales) expect(getCrmAppUrl(locale)).toBe("https://novalure-crm.app");
  });

  it("explains the operated-service model consistently in every locale", () => {
    expect(managedServiceCopy.de.noticeBody).toContain("ohne das System selbst administrieren zu müssen");
    expect(managedServiceCopy.en.noticeBody).toContain("without having to administer the system");
    expect(managedServiceCopy.es.noticeBody).toContain("sin tener que administrar el sistema");
    expect(managedServiceCopy.de.noticeIntegration).toContain("technisch und vertraglich vereinbart");
    expect(managedServiceCopy.en.noticeIntegration).toContain("technically and contractually");
    expect(managedServiceCopy.es.noticeIntegration).toContain("técnica y contractualmente");
  });

  it("does not promote an internal CRM or a public system preview", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(root, "components", "SiteFooter.tsx"), "utf8");

    expect(header).not.toContain('getPath(locale, "handover")');
    expect(header).not.toContain('data-track="nav_system_example"');
    expect(header).not.toContain('data-track="mobile_system_example"');
    expect(footer).not.toContain('data-track="footer_system_example"');
  });

  it("states the complete managed service scope and client-owned ad-account policy", () => {
    const developer = realEstateServiceOffering.de.developers;
    const agent = realEstateServiceOffering.en.agents;
    const developerTitles = developer.categories.map((category) => category.title).join(" ");
    const agentTitles = agent.categories.map((category) => category.title).join(" ");

    expect(developerTitles).toContain("Google Ads");
    expect(developerTitles).toContain("Meta Ads");
    expect(developerTitles).toContain("Lead- und Interessentenmanagement");
    expect(developerTitles).toContain("Reporting und kontinuierliche Optimierung");
    expect(developer.accountOwnership.points.join(" ")).toContain("direkt bezahlt");
    expect(agentTitles).toContain("Seller acquisition");
    expect(agentTitles).toContain("Buyer acquisition");
    expect(agentTitles).toContain("Sales administration");
    expect(agent.accountOwnership.points.join(" ")).toContain("paid directly");
  });
});
