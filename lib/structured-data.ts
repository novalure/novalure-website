import { routeMap, type Locale, type PageKey } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";
import type { FaqItem, PageContent } from "@/content/pages";

const siteUrl = getSiteUrl();

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "NovaLure",
    url: `${siteUrl}${routeMap.home[locale]}`,
    description:
      locale === "en"
        ? "CRM-ready lead systems for real estate sales."
        : "CRM-fähige Lead-Systeme für den Immobilienvertrieb.",
    logo: `${siteUrl}/novalure-logo.png`,
    areaServed: ["AT", "DE", "CH", "LI", "IE", "EU"],
    founder: {
      "@type": "Person",
      name: "Franz Romih",
      jobTitle: locale === "en" ? "Team Lead" : "Teamleitung"
    }
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "NovaLure",
    url: `${siteUrl}${routeMap.home[locale]}`,
    inLanguage: locale === "de" ? "de-DE" : "en-GB"
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

  if (content.faq?.length) {
    schemas.push(faqSchema(content.faq));
  }

  return schemas;
}
