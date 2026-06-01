"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getCrmAppUrl, getPath, getPlaybookFormPath, navLabels, routeMap, type Locale } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

const ctaLabels = {
  en: { primary: "Request Project Check", menu: "Menu", close: "Close menu" },
  de: { primary: "Projekt-Check anfragen", menu: "Menü", close: "Menü schließen" }
};

const headerRouteItems = ["developers", "agents", "handover", "playbooks"] as const;

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const labels = ctaLabels[locale];

  const switchLocale = locale === "en" ? "de" : "en";
  const activeKey = Object.entries(routeMap).find(([, paths]) => paths[locale] === pathname)?.[0] as
    | keyof typeof routeMap
    | undefined;
  const switchHref = activeKey ? routeMap[activeKey][switchLocale] : getPath(switchLocale, "home");
  const playbookHref = getPlaybookFormPath(locale);
  const auditHref = `${getPath(locale, "contact")}#book-audit`;
  const crmHref = getCrmAppUrl(locale);

  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      <div className="header-brand-group">
        <Logo locale={locale} />
        <span className="header-trust-badge">
          {locale === "de" ? "Verwurzelt in Irland · Tätig in DACH, UK & international" : "Rooted in Ireland · Active in DACH, UK & international"}
        </span>
      </div>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {headerRouteItems.map((key) => (
          <Link
            key={key}
            href={key === "playbooks" ? playbookHref : getPath(locale, key)}
          >
            {navLabels[locale][key]}
          </Link>
        ))}
      </nav>

      <div className="header-actions desktop-actions">
        <a className="crm-login-link" href={crmHref} target="_blank" rel="noreferrer" data-track="nav_crm_login">
          CRM Login
        </a>
        <Link className="button button-primary" href={auditHref} data-track="nav_audit">{labels.primary}</Link>
        <Link className="locale-switch" href={switchHref} hrefLang={switchLocale}>{switchLocale.toUpperCase()}</Link>
      </div>

      <Link className="button button-primary mobile-sticky-cta" href={auditHref}>
        {labels.primary}
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? labels.close : labels.menu}</span>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
        {headerRouteItems.map((key) => (
          <Link
            key={key}
            href={key === "playbooks" ? playbookHref : getPath(locale, key)}
            onClick={() => setOpen(false)}
          >
            {navLabels[locale][key]}
          </Link>
        ))}
        <a className="crm-login-link" href={crmHref} target="_blank" rel="noreferrer" data-track="mobile_crm_login" onClick={() => setOpen(false)}>
          CRM Login
        </a>
        <Link className="button button-primary" href={auditHref} onClick={() => setOpen(false)}>
          {labels.primary}
        </Link>
        <Link className="locale-switch mobile-locale" href={switchHref} hrefLang={switchLocale} onClick={() => setOpen(false)}>
          {switchLocale.toUpperCase()}
        </Link>
      </nav>
    </header>
  );
}
