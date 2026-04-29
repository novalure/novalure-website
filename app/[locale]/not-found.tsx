"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPath, type Locale } from "@/lib/i18n";

export default function LocaleNotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/de") ? "de" : "en";
  const copy = locale === "de"
    ? {
        eyebrow: "404",
        title: "Diese Seite wurde nicht gefunden.",
        body: "Der Link ist veraltet oder die Seite existiert in dieser Sprache nicht.",
        cta: "Zur Startseite"
      }
    : {
        eyebrow: "404",
        title: "This page was not found.",
        body: "The link may be outdated or the page does not exist in this language.",
        cta: "Back to home"
      };

  return (
    <main className="state-page">
      <section className="state-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <Link className="button button-primary" href={getPath(locale, "home")}>{copy.cta}</Link>
      </section>
    </main>
  );
}
