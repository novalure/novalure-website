import { routeMap, type Locale, type PageKey } from "@/lib/i18n";
import type { FaqItem, PageContent } from "@/content/pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Novalure",
    url: `${siteUrl}${routeMap.home[locale]}`,
    description:
      locale === "en"
        ? "PropTech Sales System for real estate developers and agents."
        : "PropTech Sales System für Bauträger und Immobilienmakler.",
    logo: `${siteUrl}/novalure-logo.png`,
    areaServed: ["AT", "DE", "CH", "LI", "IE", "EU"],
    founder: {
      "@type": "Person",
      name: "Franz Romih",
      jobTitle: locale === "en" ? "Founder & Real Estate Sales Lead" : "Gründer & Real Estate Sales Lead"
    }
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Novalure",
    url: `${siteUrl}${routeMap.home[locale]}`,
    inLanguage: locale === "de" ? "de-DE" : "en-US"
  };
}

export function breadcrumbSchema(locale: Locale, key: PageKey, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "en" ? "Home" : "Start",
        item: `${siteUrl}${routeMap.home[locale]}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `${siteUrl}${routeMap[key][locale]}`
      }
    ]
  };
}

export function faqSchema(items: FaqItem[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function pageSchemas(content: PageContent) {
  const schemas: unknown[] = [
    organizationSchema(content.locale),
    websiteSchema(content.locale),
    breadcrumbSchema(content.locale, content.key, content.title)
  ];

  return schemas;
}
