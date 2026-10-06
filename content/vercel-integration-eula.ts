import type { PageContent, PageSection } from "@/content/pages";
import type { Locale } from "@/lib/i18n";

export const vercelIntegrationEulaLastUpdated = "6 October 2026";

export const vercelIntegrationEulaSections: PageSection[] = [
  {
    title: "1. Purpose and application",
    body: "This Provider End User Licence Agreement (EULA) applies specifically to the private Vercel Integration named Evelyn Vercel Service Identity (the Integration). The Integration is intended solely for NovaLure's internal Evelyn service-identity and control-plane access to limited Vercel metadata. It is not a public marketplace product or a general-purpose customer application. This EULA applies if and while the Integration is installed or enabled for an authorised Vercel account."
  },
  {
    title: "2. Provider",
    body: "The provider and licensor is NovaLure CLG, a company limited by guarantee incorporated under the laws of Ireland.",
    items: [
      "Registered in Ireland with the Companies Registration Office (CRO).",
      "Company registration number: 796735.",
      "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland.",
      "Support and legal contact: hello@novalure.eu."
    ],
    links: [{ label: "View the NovaLure Imprint", href: "/en/legal/imprint" }]
  },
  {
    title: "3. Private integration and authorised projects",
    body: "The Integration is private. It may be installed only on Vercel projects that the account owner or an authorised administrator explicitly selects. The current approved installation scope is limited to the following projects:",
    items: ["evelyn", "novalure-crm", "novalure-website"]
  },
  {
    title: "4. No automatic scope expansion",
    body: "The Integration does not receive wildcard, all-project, future-project or unrestricted team-wide project access. A newly created or additional project is outside the approved scope unless it is separately and explicitly authorised and selected through Vercel. Technical capability or account membership alone does not grant broader authority."
  },
  {
    title: "5. Approved read-only metadata access",
    body: "For the authorised projects, the Integration is read-only and may access only the metadata necessary for internal control-plane inventory, verification, provenance, security review, audit and operational monitoring.",
    items: [
      "Deployment metadata.",
      "Project metadata.",
      "Team metadata required to identify the authorised Vercel account and project ownership.",
      "Domain metadata.",
      "Integration installation and configuration metadata."
    ]
  },
  {
    title: "6. Permissions not granted",
    body: "The Integration is not authorised to obtain or exercise the following access:",
    items: [
      "Billing access.",
      "Environment-variable access or secret-value access.",
      "Deployment creation, modification, promotion, rollback, cancellation or deletion.",
      "Project creation, modification, transfer or deletion.",
      "Access to projects other than evelyn, novalure-crm and novalure-website.",
      "Wildcard, future-project or unrestricted team-wide project access."
    ]
  },
  {
    title: "7. Licence and acceptable use",
    body: "Subject to this EULA, NovaLure grants the authorised Vercel account a limited, non-exclusive, non-transferable, non-sublicensable and revocable licence to install and use the Integration for the purpose described above. The Integration must not be used to bypass Vercel controls, obtain unauthorised data, probe undocumented interfaces, interfere with services, introduce malicious code, exceed applicable limits or perform any unlawful activity."
  },
  {
    title: "8. Credentials and security",
    body: "Integration credentials and access tokens are confidential. They must not be disclosed, committed to source control, embedded in public material or shared outside the authorised operational path. The persistent credential is intended to be stored securely in Azure Key Vault and made available only to authorised workloads through least-privilege controls. NovaLure applies reasonable technical and organisational measures appropriate to the Integration's limited scope, including access restriction, auditability, rotation or revocation after suspected compromise and minimisation of retained metadata. No security certification is claimed by this EULA."
  },
  {
    title: "9. Data handling and privacy",
    body: "The Integration processes only the approved Vercel metadata needed for its internal control-plane purpose. NovaLure does not sell that metadata or other customer data. Personal data, if present in account or project metadata, is handled in accordance with the NovaLure Privacy Policy and applicable data-protection law. Where NovaLure processes personal data on behalf of another party, any required controller, processor, instruction, retention, deletion or transfer terms must be addressed in the applicable agreement or data-processing arrangement.",
    links: [{ label: "View the NovaLure Privacy Policy", href: "/en/legal/privacy" }]
  },
  {
    title: "10. Customer content and ownership",
    body: "This EULA does not transfer ownership of customer content, Vercel project content, domains, deployments or metadata to NovaLure. Each party retains the rights it holds in its own content, systems, marks and intellectual property. NovaLure receives only the limited rights necessary to operate, secure and support the Integration within the authorised scope."
  },
  {
    title: "11. Confidentiality",
    body: "Each party must protect non-public information received through the Integration using reasonable care and may use it only for the authorised purpose, subject to lawful disclosure obligations. Credentials, access tokens, internal identifiers and non-public project metadata must be treated as confidential."
  },
  {
    title: "12. Duration, revocation and termination",
    body: "Access continues only while the Integration remains installed and authorised. The Vercel account owner or an authorised administrator may revoke or disable the Integration through Vercel. NovaLure may suspend or terminate the Integration where reasonably necessary because of revocation, material breach, unlawful use, security risk, service harm or a legal requirement. On termination, the licence ends and the credential must be revoked or disabled. Any retained metadata remains subject to applicable legal, security, audit and deletion obligations."
  },
  {
    title: "13. Availability and support",
    body: "The Integration may depend on Vercel, Azure and other technical infrastructure outside NovaLure's direct control. NovaLure will use reasonable care in operating the Integration but does not promise uninterrupted or error-free availability. Support and notices relating to this Integration may be sent to hello@novalure.eu."
  },
  {
    title: "14. Third-party services",
    body: "Vercel and Azure are independent third-party services governed by their own agreements, privacy notices, technical limits and availability. This EULA is between NovaLure and the authorised user of the Integration; it does not make Vercel or Azure a party to this EULA and does not alter their terms."
  },
  {
    title: "15. Warranties and liability",
    body: "Except where a separate written agreement or mandatory law provides otherwise, the Integration is provided on an as-available basis. NovaLure does not guarantee that metadata will always be complete, current or error-free. To the extent permitted by applicable law, NovaLure is not liable for indirect or consequential loss, or loss of profit, revenue, business opportunity, goodwill or data, where that loss is not a direct and reasonably foreseeable result of NovaLure's breach. This EULA creates no monetary liability cap. Nothing in this EULA excludes or limits liability or statutory rights that applicable law does not permit to be excluded or limited."
  },
  {
    title: "16. Governing law",
    body: "This EULA is governed by the laws of the Republic of Ireland, without prejudice to mandatory rules that apply regardless of that choice. Jurisdiction and venue are determined by applicable law or a separate binding agreement; this EULA does not displace a mandatory forum or other non-waivable right."
  },
  {
    title: "17. Order of precedence and changes",
    body: "A separately signed agreement, order, data-processing agreement or other binding terms control to the extent of a conflict for the relevant service. NovaLure may update this EULA to reflect changes in the Integration, law, security practices or operations. The current version and last-updated date will be published at this URL. A material change does not silently expand the Integration's installed projects or granted Vercel permissions."
  },
  {
    title: "18. Contact and effective date",
    body: `Questions, security notices, support requests and revocation enquiries may be sent to NovaLure CLG at hello@novalure.eu or by post to 20 Harcourt Street, Dublin 2, D02 H364, Ireland. Effective date and last updated: ${vercelIntegrationEulaLastUpdated}.`,
    links: [
      { label: "Email hello@novalure.eu", href: "mailto:hello@novalure.eu" },
      { label: "View the general NovaLure EULA", href: "/en/eula" }
    ]
  }
];

export function createVercelIntegrationEulaPage(locale: Locale): PageContent {
  return {
    key: "vercelIntegrationEula",
    locale,
    template: "legal",
    eyebrow: "Legal · Private Vercel Integration",
    title: "Evelyn Vercel Service Identity Provider EULA",
    seoTitle: "Evelyn Vercel Service Identity Provider EULA | NovaLure",
    description: "Private, read-only Vercel Integration for approved NovaLure projects",
    metaDescription: "Provider EULA for the private Evelyn Vercel Service Identity Integration, including its approved projects, read-only metadata scope, security and revocation terms.",
    primaryCta: { label: "Privacy Policy", target: "privacy" },
    secondaryCta: { label: "General EULA", target: "eula", variant: "subtle" },
    heroBullets: [
      "Private Integration",
      "Read-only metadata",
      "Three explicitly approved projects",
      "No billing, environment-variable or write access",
      `Last updated: ${vercelIntegrationEulaLastUpdated}`
    ],
    sections: vercelIntegrationEulaSections
  };
}
