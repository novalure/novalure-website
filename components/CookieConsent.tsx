"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  external: boolean;
  savedAt: string;
};

const copy = {
  en: {
    title: "Cookie preferences",
    body: "We use necessary cookies to run this website. Analytics, marketing and external media only activate if you consent.",
    intro: "You can choose which optional technologies may be used. You can change your choice at any time.",
    accept: "Accept all",
    reject: "Necessary only",
    save: "Save choices",
    manage: "Cookie settings",
    necessary: "Necessary",
    necessaryBody: "Required for website operation, security, form delivery and saving your consent choice. Always active.",
    analytics: "Analytics",
    analyticsBody: "Helps us understand website performance, for example through Google Analytics and Hotjar.",
    marketing: "Marketing",
    marketingBody: "Helps measure campaigns and build audiences, for example through Meta Pixel, LinkedIn Insight Tag and HubSpot tracking.",
    external: "External media and embeds",
    externalBody: "Allows third-party embeds such as HubSpot meeting scheduling or other external content."
  },
  de: {
    title: "Cookie-Einstellungen",
    body: "Wir nutzen notwendige Cookies für den Betrieb der Website. Analytics, Marketing und externe Medien werden nur nach Ihrer Zustimmung aktiviert.",
    intro: "Sie können auswählen, welche optionalen Technologien verwendet werden dürfen. Sie können Ihre Auswahl jederzeit ändern.",
    accept: "Alle akzeptieren",
    reject: "Nur notwendige",
    save: "Auswahl speichern",
    manage: "Cookie-Einstellungen",
    necessary: "Notwendig",
    necessaryBody: "Erforderlich für Website-Betrieb, Sicherheit, Formulare und das Speichern Ihrer Cookie-Auswahl. Immer aktiv.",
    analytics: "Analytics",
    analyticsBody: "Hilft uns, die Website-Leistung zu verstehen, zum Beispiel mit Google Analytics und Hotjar.",
    marketing: "Marketing",
    marketingBody: "Hilft bei Kampagnenmessung und Zielgruppenbildung, zum Beispiel mit Meta Pixel, LinkedIn Insight Tag und HubSpot Tracking.",
    external: "Externe Medien und Einbindungen",
    externalBody: "Erlaubt Drittanbieter-Einbindungen wie HubSpot Meeting Scheduling oder andere externe Inhalte."
  }
};

export function CookieConsent({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<ConsentState | null>(null);
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [external, setExternal] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    const value = window.localStorage.getItem("novalure-cookie-consent");
    if (!value) {
      setVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(value) as ConsentState;
      setStatus(parsed);
      setAnalytics(Boolean(parsed.analytics));
      setMarketing(Boolean(parsed.marketing));
      setExternal(Boolean(parsed.external));
      window.dispatchEvent(new CustomEvent("novalure:consent", { detail: parsed }));
    } catch {
      window.localStorage.removeItem("novalure-cookie-consent");
      setVisible(true);
    }
  }, []);

  function save(value: Omit<ConsentState, "necessary" | "savedAt">) {
    const consent: ConsentState = {
      necessary: true,
      ...value,
      savedAt: new Date().toISOString()
    };

    window.localStorage.setItem("novalure-cookie-consent", JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("novalure:consent", { detail: consent }));
    setStatus(consent);
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
    setExternal(consent.external);
    setVisible(false);
  }

  if (!visible) {
    return status ? (
      <button className="cookie-manage" type="button" onClick={() => setVisible(true)}>
        {text.manage}
      </button>
    ) : null;
  }

  return (
    <aside className="cookie-banner" aria-label={text.title}>
      <div className="cookie-copy">
        <strong>{text.title}</strong>
        <p>{text.body}</p>
        <p>{text.intro}</p>
        <div className="cookie-options" aria-label={text.title}>
          <div className="cookie-option">
            <div>
              <strong>{text.necessary}</strong>
              <p>{text.necessaryBody}</p>
            </div>
            <span className="cookie-required">Always active</span>
          </div>
          <label className="cookie-option">
            <span>
              <strong>{text.analytics}</strong>
              <p>{text.analyticsBody}</p>
            </span>
            <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
          </label>
          <label className="cookie-option">
            <span>
              <strong>{text.marketing}</strong>
              <p>{text.marketingBody}</p>
            </span>
            <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
          </label>
          <label className="cookie-option">
            <span>
              <strong>{text.external}</strong>
              <p>{text.externalBody}</p>
            </span>
            <input type="checkbox" checked={external} onChange={(event) => setExternal(event.target.checked)} />
          </label>
        </div>
      </div>
      <div className="cookie-actions">
        <button className="button button-secondary" type="button" onClick={() => save({ analytics: false, marketing: false, external: false })}>
          {text.reject}
        </button>
        <button className="button button-secondary" type="button" onClick={() => save({ analytics, marketing, external })}>
          {text.save}
        </button>
        <button className="button button-primary" type="button" onClick={() => save({ analytics: true, marketing: true, external: true })}>
          {text.accept}
        </button>
      </div>
    </aside>
  );
}
