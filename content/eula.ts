import type { PageContent, PageSection } from "@/content/pages";
import type { Locale } from "@/lib/i18n";

export const eulaLastUpdated = "5 October 2026";

export const eulaSections: PageSection[] = [
  {
    title: "1. Introduction",
    body: "This End User Licence Agreement (EULA) governs access to and use of software, applications, digital services, integrations, application programming interfaces (APIs), automation interfaces and related documentation made available by NovaLure. It applies, as relevant, to NovaLure software and systems including Evelyn AI OS, private integrations and future software tools identified as being provided under this EULA."
  },
  {
    title: "2. Agreement to Terms",
    body: "By accessing, installing, connecting to or using a covered service, you agree to this EULA. If you use a service for an organisation, you confirm that you are authorised to accept these terms for that organisation. If you do not agree, do not use the service. A separately signed customer agreement, order or proposal may impose additional or different terms."
  },
  {
    title: "3. Provider and Licensor",
    body: "The provider and licensor is NovaLure CLG, a company limited by guarantee incorporated under the laws of Ireland.",
    items: [
      "Registered in Ireland with the Companies Registration Office (CRO).",
      "Company registration number: 796735.",
      "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland.",
      "Email: hello@novalure.eu."
    ],
    links: [{ label: "View the NovaLure Imprint", href: "/en/legal/imprint" }]
  },
  {
    title: "4. Scope of the Licence",
    body: "Subject to this EULA and any applicable order or customer agreement, NovaLure grants you a limited, non-exclusive, non-transferable, non-sublicensable licence to use the relevant service for its agreed purpose. The licence may be revoked or terminated in accordance with this EULA. Approved organisational users may exercise the licence for your internal benefit, but no ownership in the service, software or documentation is transferred."
  },
  {
    title: "5. Permitted Use",
    body: "You may use the service for authorised internal or business purposes, within the purchased or otherwise agreed scope, through approved user interfaces, integrations and APIs. Use must comply with applicable law, documentation, technical limits and permissions communicated by NovaLure."
  },
  {
    title: "6. Restrictions",
    body: "You must not use a service beyond the rights granted under this EULA or an applicable agreement.",
    items: [
      "Do not gain or attempt to gain unauthorised access to any account, system, data or network.",
      "Do not share credentials outside the authorised scope or bypass security, rate, usage or access controls.",
      "Do not introduce malware, destructive code or material intended to disrupt a service.",
      "Do not use a service unlawfully, infringe third-party rights or interfere with service operation.",
      "Do not reverse engineer or circumvent technical protections except to the limited extent such a restriction is prohibited by applicable law."
    ]
  },
  {
    title: "7. Accounts and Authorised Access",
    body: "Access may be provided to named users and to authorised service accounts, workload identities, automated agents, OAuth integrations or other machine identities. You are responsible for ensuring that each user or identity is authorised, acts within the permissions granted to it and is removed or disabled when access is no longer required. Machine requests do not need to be initiated individually by a natural person where the relevant automation is authorised."
  },
  {
    title: "8. Integrations and Connected Services",
    body: "A service may connect to systems selected or authorised by you. You authorise the service to exchange data and perform the requested actions within the permissions you grant. You are responsible for configuring the connected account, selecting appropriate scopes and ensuring that you have the right to connect it and provide relevant data. NovaLure does not receive broader authority merely because an integration is technically capable of broader access."
  },
  {
    title: "9. APIs and Automated Access",
    body: "Approved API credentials, access tokens, webhooks, service identities and automation interfaces may be used for authorised workflows within documented or agreed limits. You must not probe undocumented interfaces, evade rate or permission controls, or use automated access in a manner that materially degrades the service. NovaLure may change technical requirements or limits where reasonably necessary for security, reliability, legal compliance or service improvement."
  },
  {
    title: "10. AI and Automated Features",
    body: "Some services may use artificial intelligence, generate content or recommendations, classify information, automate workflows or trigger actions in connected services. Outputs may be incomplete, inaccurate or unsuitable for a particular purpose and should be reviewed in context. Unless a separate written agreement expressly states otherwise, you remain responsible for decisions that require professional, legal, financial, regulatory or other material judgement and for appropriate human oversight of automated workflows."
  },
  {
    title: "11. Customer and User Data",
    body: "As between you and NovaLure, you retain the rights you hold in data, instructions, files and other material submitted to a service. You grant NovaLure the limited rights necessary to host, transmit, process, reproduce and otherwise handle that material to provide, secure, support and improve the contracted service, subject to applicable privacy documentation and agreements. You are responsible for the lawfulness, accuracy and permissions associated with data you provide or instruct the service to process."
  },
  {
    title: "12. Intellectual Property",
    body: "NovaLure and its licensors retain all rights, title and interest in the services, software, interfaces, documentation, designs, workflows, trademarks and related intellectual property, including improvements and updates. Feedback may be used by NovaLure without an obligation to adopt it, provided that NovaLure does not thereby acquire ownership of your confidential information or customer data. Third-party materials remain owned by their respective rights holders."
  },
  {
    title: "13. Confidentiality",
    body: "Where non-public information is disclosed in connection with a service, each party must protect the other party's confidential information using reasonable care and use it only for the relevant relationship. This obligation does not apply to information that is public through no breach, was lawfully known without restriction, is independently developed, or is lawfully received from another source. Disclosure required by law is permitted, subject to legally available notice and safeguards. A separate confidentiality agreement controls if it provides more specific terms."
  },
  {
    title: "14. Security and Credentials",
    body: "You must take reasonable steps to secure accounts, devices, API keys, OAuth grants, service identities, passwords and access tokens. Credentials must be kept confidential, scoped to authorised use and rotated or revoked when compromise is suspected or access is no longer needed. Notify NovaLure promptly at hello@novalure.eu of suspected unauthorised use affecting a covered service."
  },
  {
    title: "15. Availability, Maintenance and Changes",
    body: "NovaLure may update, improve, replace, modify, suspend or discontinue features, interfaces or service components, subject to applicable law and any binding customer agreement. Maintenance, security events, third-party dependencies and other circumstances may affect availability. No uninterrupted, error-free or perpetual availability is promised, and no service-level commitment applies unless it is stated in a separate written agreement."
  },
  {
    title: "16. Third-Party Services",
    body: "Services may interoperate with third-party providers such as Microsoft, GitHub, Vercel, Resend, database or cloud providers, and social or media platforms. Those services are controlled by their respective providers and may have their own terms, privacy notices, limits and availability. NovaLure does not endorse a provider merely by supporting an integration and is not responsible for a third party's independent service, acts or omissions."
  },
  {
    title: "17. Fees and Paid Services",
    body: "Fees, subscriptions, usage allowances, taxes, payment terms and other commercial conditions are governed by the applicable order, proposal, subscription or customer agreement. This EULA does not create a price or payment obligation where none has otherwise been agreed. Failure to pay an undisputed amount when due may result in suspension or termination in accordance with the applicable commercial agreement and law."
  },
  {
    title: "18. Suspension and Termination",
    body: "NovaLure may suspend or terminate access where reasonably necessary to address a material breach, unlawful or unauthorised use, a security risk, non-payment under an applicable agreement, harm to the service or another user, or a legal requirement. Where reasonably practicable and permitted, NovaLure will give notice and an opportunity to remedy a remediable breach. You may stop using the service at any time, but contractual payment or notice obligations may continue. On termination, the licence ends and you must cease use; provisions intended by their nature to survive will remain effective."
  },
  {
    title: "19. Disclaimer of Warranties",
    body: "To the extent permitted by applicable law and except for an express commitment in a separate written agreement, services are provided on an 'as available' basis. NovaLure does not warrant that every service or output will be uninterrupted, error-free, complete or suitable for every purpose. Nothing in this section excludes an express contractual warranty or a warranty, condition or right that cannot lawfully be excluded or restricted."
  },
  {
    title: "20. Limitation of Liability",
    body: "To the extent permitted by applicable law, NovaLure is not liable for indirect or consequential loss, or for loss of profit, revenue, business opportunity, goodwill or data, arising from use of a service where such loss is not a direct and reasonably foreseeable result of NovaLure's breach. No monetary liability cap is created by this public EULA; any agreed cap must be set out in a separate binding agreement. Nothing in this EULA limits or excludes liability that applicable law does not permit to be limited or excluded. Nothing in this EULA limits any rights that cannot lawfully be excluded or restricted."
  },
  {
    title: "21. Indemnity for Business Use",
    body: "Where you use a service in the course of a business and to the extent permitted by law, you will indemnify NovaLure against a third-party claim arising directly from your unlawful use of the service, material you provide that infringes that third party's rights, or your deliberate breach of the access and security obligations in this EULA. This obligation does not apply to the extent a claim was caused by NovaLure's breach, negligence or wilful misconduct, and it does not apply to consumers where it would limit mandatory rights."
  },
  {
    title: "22. Data Protection and Privacy",
    body: "Personal-data processing is governed by the NovaLure Privacy Policy, applicable data-protection law and any data-processing or customer agreement that applies to the service. The Privacy Policy provides the general GDPR and EU data-protection information for NovaLure activities; it does not replace service-specific terms where those are required.",
    links: [
      { label: "Read the NovaLure Privacy Policy", href: "/en/legal/privacy" },
      { label: "Read the NovaLure Cookie Policy", href: "/en/legal/cookies" }
    ]
  },
  {
    title: "23. Updates to this EULA",
    body: "NovaLure may update this EULA to reflect changes in services, law, security practices or business operations. The current version and its last-updated date will be published at this URL. Where an update materially affects an active contracted service, any notice or acceptance requirements in the applicable agreement or law will be followed. Continued use after an update takes effect constitutes acceptance only to the extent permitted by applicable law."
  },
  {
    title: "24. Governing Law and Jurisdiction",
    body: "This EULA is governed by the laws of the Republic of Ireland, without prejudice to mandatory rules that apply regardless of that choice. Jurisdiction and venue are determined by applicable law or by a separate binding agreement; this EULA does not displace a mandatory consumer forum or other non-waivable right."
  },
  {
    title: "25. Severability and No Waiver",
    body: "If a provision of this EULA is held invalid, unlawful or unenforceable, it will be limited or removed only to the minimum extent necessary and the remaining provisions will continue in effect. A failure or delay in enforcing a right is not a waiver of that right."
  },
  {
    title: "26. Entire Agreement and Order of Precedence",
    body: "This EULA, together with documents expressly incorporated into it, is the agreement governing the licence where no more specific agreement applies. If you or your organisation has a separately signed customer agreement, order, proposal, data-processing agreement or other binding terms with NovaLure, that document controls to the extent of a conflict for the relevant service. Nothing in this public EULA overrides negotiated terms that expressly take precedence."
  },
  {
    title: "27. Contact",
    body: "Questions about this EULA or notices concerning a covered service may be sent to NovaLure CLG at hello@novalure.eu or by post to 20 Harcourt Street, Dublin 2, D02 H364, Ireland.",
    links: [
      { label: "Email hello@novalure.eu", href: "mailto:hello@novalure.eu" },
      { label: "View provider information", href: "/en/legal/imprint" }
    ]
  },
  {
    title: "28. Effective Date and Last Updated",
    body: `Effective date and last updated: ${eulaLastUpdated}. This is the first public version of this EULA.`
  }
];

export function createEulaPage(locale: Locale): PageContent {
  return {
    key: "eula",
    locale,
    template: "legal",
    eyebrow: "Legal",
    title: "End User Licence Agreement (EULA)",
    seoTitle: "End User Licence Agreement (EULA) | NovaLure",
    description: "Novalure Software, Applications and Integrations",
    metaDescription: "Terms governing authorised use of NovaLure software, applications, AI and automation features, APIs and integrations.",
    primaryCta: { label: "Privacy Policy", target: "privacy" },
    secondaryCta: { label: "Imprint", target: "imprint", variant: "subtle" },
    heroBullets: [
      "NovaLure CLG",
      "Software, applications and integrations",
      "APIs, service identities and automated agents",
      "Irish law",
      `Last updated: ${eulaLastUpdated}`
    ],
    sections: eulaSections
  };
}
