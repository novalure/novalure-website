import "@/content/spanish-market-positioning";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ManagedServiceNotice } from "@/components/ManagedServiceNotice";
import { TrackingPlaceholders } from "@/components/TrackingPlaceholders";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale = requestedLocale as Locale;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : "en-GB")};`
        }}
      />
      <Header locale={locale} />
      {children}
      <ManagedServiceNotice locale={locale} />
      <Footer locale={locale} />
      <CookieConsent locale={locale} />
      <TrackingPlaceholders />
    </>
  );
}
