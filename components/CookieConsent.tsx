"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getPath, type Locale } from "@/lib/i18n";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  external: boolean;
  savedAt: string;
};

const cookieCopy = {
  de: {
    title: "Cookie-Einstellungen",
    ckText: "Wir verwenden Cookies für Grundfunktionen und – nur mit Ihrer Zustimmung – für Statistik, Marketing und externe Medien. Details in der",
    ckLink: "Cookie-Richtlinie", ckAll: "Alle akzeptieren", ckNec: "Nur notwendige", ckSet: "Einstellungen", ckSave: "Auswahl speichern",
    ckCatNec: "Notwendig", ckCatStats: "Statistik", ckCatMkt: "Marketing", ckCatExt: "Externe Medien",
    necessary: "Für Website-Betrieb, Sicherheit, Formulare und Ihre Auswahl erforderlich.",
    statistics: "Hilft uns, Nutzung und Leistung der Website zu verstehen.",
    marketing: "Erlaubt Kampagnenmessung, etwa über Meta oder LinkedIn.",
    external: "Erlaubt Drittanbieter-Einbindungen wie den HubSpot-Buchungskalender.",
    fixed: "Immer aktiv"
  },
  en: {
    title: "Cookie settings",
    ckText: "We use cookies for core functionality and – only with your consent – for statistics, marketing and external media. Details in the",
    ckLink: "cookie policy", ckAll: "Accept all", ckNec: "Necessary only", ckSet: "Settings", ckSave: "Save selection",
    ckCatNec: "Necessary", ckCatStats: "Statistics", ckCatMkt: "Marketing", ckCatExt: "External media",
    necessary: "Required for website operation, security, forms and saving your choice.",
    statistics: "Helps us understand website use and performance.",
    marketing: "Allows campaign measurement, for example through Meta or LinkedIn.",
    external: "Allows third-party embeds such as the HubSpot booking calendar.",
    fixed: "Always active"
  }
} as const;

export function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [external, setExternal] = useState(false);
  const titleRef = useRef<HTMLElement>(null);
  const t = cookieCopy[locale];
  const detail = t;

  useEffect(() => {
    function showSettings() {
      setVisible(true);
      setSettingsOpen(true);
    }

    window.addEventListener("novalure:open-cookie-settings", showSettings);
    const stored = window.localStorage.getItem("novalure-cookie-consent");
    window.localStorage.removeItem("novalure-consent");
    if (!stored) {
      setVisible(true);
      return () => window.removeEventListener("novalure:open-cookie-settings", showSettings);
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ConsentState>;
      const migrated: ConsentState = {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
        external: Boolean(parsed.external),
        savedAt: parsed.savedAt || new Date().toISOString()
      };
      setAnalytics(migrated.analytics);
      setMarketing(migrated.marketing);
      setExternal(migrated.external);
      window.localStorage.setItem("novalure-cookie-consent", JSON.stringify(migrated));
      window.dispatchEvent(new CustomEvent("novalure:consent", { detail: migrated }));
    } catch {
      window.localStorage.removeItem("novalure-cookie-consent");
      window.localStorage.removeItem("novalure-consent");
      setVisible(true);
    }

    return () => window.removeEventListener("novalure:open-cookie-settings", showSettings);
  }, []);

  useEffect(() => {
    if (visible) titleRef.current?.focus();
  }, [visible]);

  function save(nextAnalytics: boolean, nextMarketing: boolean, nextExternal: boolean) {
    const consent: ConsentState = {
      necessary: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      external: nextExternal,
      savedAt: new Date().toISOString()
    };
    window.localStorage.setItem("novalure-cookie-consent", JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("novalure:consent", { detail: consent }));
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setExternal(nextExternal);
    setVisible(false);
    setSettingsOpen(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-banner v3-cookie-banner" role="dialog" aria-labelledby="novalure-cookie-title">
      <div className="cookie-copy">
        <strong id="novalure-cookie-title" ref={titleRef} tabIndex={-1}>{detail.title}</strong>
        <p>{t.ckText} <Link href={getPath(locale, "cookies")}>{t.ckLink}</Link>.</p>
        {settingsOpen && (
          <div className="cookie-options" aria-label={detail.title}>
            <label className="cookie-option">
              <input type="checkbox" checked disabled />
              <span><strong>{t.ckCatNec}</strong><p>{detail.necessary}</p></span>
              <span className="sr-only">{detail.fixed}</span>
            </label>
            <label className="cookie-option">
              <span><strong>{t.ckCatStats}</strong><p>{detail.statistics}</p></span>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            </label>
            <label className="cookie-option">
              <span><strong>{t.ckCatMkt}</strong><p>{detail.marketing}</p></span>
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            </label>
            <label className="cookie-option">
              <span><strong>{t.ckCatExt}</strong><p>{detail.external}</p></span>
              <input type="checkbox" checked={external} onChange={(event) => setExternal(event.target.checked)} />
            </label>
          </div>
        )}
      </div>
      <div className="cookie-actions">
        <button className="v3-button v3-button-primary" type="button" onClick={() => save(true, true, true)}>{t.ckAll}</button>
        <button className="v3-button v3-button-dark-outline" type="button" onClick={() => save(false, false, false)}>{t.ckNec}</button>
        <button className="v3-button v3-button-dark-outline" type="button" onClick={() => settingsOpen ? save(analytics, marketing, external) : setSettingsOpen(true)}>
          {settingsOpen ? t.ckSave : t.ckSet}
        </button>
      </div>
    </aside>
  );
}
