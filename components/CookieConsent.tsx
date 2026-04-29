"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

const copy = {
  en: {
    title: "Cookie preferences",
    body: "We use necessary cookies for the site. Analytics, marketing and external media only activate after consent.",
    accept: "Accept all",
    reject: "Necessary only",
    saved: "Preferences saved"
  },
  de: {
    title: "Cookie-Einstellungen",
    body: "Wir nutzen notwendige Cookies für die Website. Analytics, Marketing und externe Medien werden erst nach Zustimmung aktiviert.",
    accept: "Alle akzeptieren",
    reject: "Nur notwendig",
    saved: "Einstellungen gespeichert"
  }
};

export function CookieConsent({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    const value = window.localStorage.getItem("novalure-cookie-consent");
    setStatus(value);
    setVisible(!value);
  }, []);

  function save(value: "all" | "essential") {
    window.localStorage.setItem("novalure-cookie-consent", value);
    window.dispatchEvent(new CustomEvent("novalure:consent", { detail: value }));
    setStatus(value);
    setVisible(false);
  }

  if (!visible) {
    return status ? <span className="sr-only">{text.saved}</span> : null;
  }

  return (
    <aside className="cookie-banner" aria-label={text.title}>
      <div>
        <strong>{text.title}</strong>
        <p>{text.body}</p>
      </div>
      <div className="cookie-actions">
        <button className="button button-secondary" type="button" onClick={() => save("essential")}>{text.reject}</button>
        <button className="button button-primary" type="button" onClick={() => save("all")}>{text.accept}</button>
      </div>
    </aside>
  );
}
