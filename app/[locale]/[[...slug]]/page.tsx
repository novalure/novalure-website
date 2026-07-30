import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/MarketingPage";
import { pages } from "@/content/pages";
import { getAlternates, getLocalizedParams, getPageKey, isLocale, type Locale } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";
import { pageSchemas } from "@/lib/structured-data";

const siteUrl = getSiteUrl();

type RouteParams = {
  locale: string;
  slug?: string[];
};

export function generateStaticParams() {
  return getLocalizedParams();
}

export async function generateMetadata(props: { params: Promise<RouteParams> }): Promise<Metadata> {
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const key = getPageKey(locale, params.slug);
  if (!key) return {};
  const content = pages[locale][key];
  const description = content.metaDescription ?? content.description;

  return {
    title: content.seoTitle,
    description,
    alternates: getAlternates(locale, key),
    robots: ["imprint", "privacy", "cookies", "playbookThanks", "auditThanks"].includes(key)
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: content.seoTitle,
      description,
      url: `${siteUrl}${getAlternates(locale, key).canonical}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "en" ? "de_DE" : "en_US",
      images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: content.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description,
      images: ["/og-default.svg"]
    }
  };
}

export default async function LocalizedPage(props: { params: Promise<RouteParams> }) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const key = getPageKey(locale, params.slug);
  if (!key) notFound();

  const content = pages[locale][key];

  return (
    <>
      <MarketingPage content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchemas(content)) }}
      />
    </>
  );
}
