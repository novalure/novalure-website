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
    <main className="state-page v3-state-page">
      <section className="state-card v3-state-card">
        <span className="v3-state-mark" aria-hidden="true">404</span>
        <p className="v3-kicker"><span aria-hidden="true" />{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="v3-state-actions">
          <Link className="v3-button v3-button-primary" href={getPath(locale, "home")}>{copy.cta}</Link>
        </div>
      </section>
    </main>
  );
}
