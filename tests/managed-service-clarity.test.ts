import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { managedServiceCopy } from "@/content/managed-service-copy";

const root = process.cwd();

describe("managed-service website contract", () => {
  it("keeps the CRM login available as a secondary navigation action", () => {
    const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");

    expect(header).toContain("getCrmAppUrl(locale)");
    expect(header).toContain('data-track="nav_crm_login"');
    expect(header).toContain('data-track="mobile_crm_login"');
    expect(header).toContain('className="v3-header-login"');
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
