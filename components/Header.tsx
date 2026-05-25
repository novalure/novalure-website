"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { anchorLabels, getPath, getPlaybookFormPath, navLabels, navigationItems, routeMap, type Locale } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

const ctaLabels = {
  en: { primary: "Pipeline Audit", secondary: "Playbook", menu: "Menu", close: "Close menu" },
  de: { primary: "Pipeline-Audit", secondary: "Playbook", menu: "Menü", close: "Menü schließen" }
};

const headerNavigationItems = navigationItems.filter(
  (item) => item.type !== "route" || (item.key !== "playbooks" && item.key !== "contact")
);

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

  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      <div className="header-brand-group">
        <Logo locale={locale} />
        <span className="header-trust-badge">
          {locale === "de" ? "Verwurzelt in Irland · Tätig in DACH, UK & international" : "Rooted in Ireland · Active in DACH, UK & international"}
        </span>
      </div>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {headerNavigationItems.map((item) => (
          <Link
            key={item.type === "route" ? item.key : item.key}
            href={item.type === "route" ? item.key === "playbooks" ? playbookHref : getPath(locale, item.key) : item.href[locale]}
          >
            {item.type === "route" ? navLabels[locale][item.key] : anchorLabels[locale][item.key]}
          </Link>
        ))}
      </nav>

      <div className="header-actions desktop-actions">
        <Link className="button button-secondary" href={playbookHref} data-track="nav_playbook">{labels.secondary}</Link>
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
        {headerNavigationItems.map((item) => (
          <Link
            key={item.type === "route" ? item.key : item.key}
            href={item.type === "route" ? item.key === "playbooks" ? playbookHref : getPath(locale, item.key) : item.href[locale]}
            onClick={() => setOpen(false)}
          >
            {item.type === "route" ? navLabels[locale][item.key] : anchorLabels[locale][item.key]}
          </Link>
        ))}
        <Link className="button button-secondary" href={playbookHref} onClick={() => setOpen(false)}>
          {labels.secondary}
        </Link>
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
