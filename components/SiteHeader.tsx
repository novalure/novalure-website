"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { getCrmAppUrl, getPath, routeMap, type Locale } from "@/lib/i18n";

const headerCopy = {
  en: {
    menu: "Open menu", close: "Close menu", navigation: "Primary navigation",
    nav: ["Solutions", "Work", "System", "Evelyn", "Insights"], cta: "Project review", login: "CRM login"
  },
  de: {
    menu: "Menü öffnen", close: "Menü schließen", navigation: "Hauptnavigation",
    nav: ["Lösungen", "Work", "System", "Evelyn", "Insights"], cta: "Projekt-Check", login: "CRM-Login"
  },
  es: {
    menu: "Abrir menú", close: "Cerrar menú", navigation: "Navegación principal",
    nav: ["Soluciones", "Work", "Sistema", "Evelyn", "Insights"], cta: "Análisis del proyecto", login: "Acceso al CRM"
  }
} as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = headerCopy[locale];
  const crmHref = getCrmAppUrl(locale);
  const systemExampleHref = getPath(locale, "handover");

  const activeKey = Object.entries(routeMap).find(([, paths]) => paths[locale] === pathname)?.[0] as
    | keyof typeof routeMap
    | undefined;
  const switchHref = (targetLocale: Locale) => activeKey
    ? routeMap[activeKey][targetLocale]
    : pathname.replace(/^\/(en|de|es)(?=\/|$)/, `/${targetLocale}`);
  const navItems = [
    [t.nav[0], `/${locale}/solutions`],
    [t.nav[1], `/${locale}/work`],
    [t.nav[2], `/${locale}/system`],
    [t.nav[3], `/${locale}/evelyn`],
    [t.nav[4], `/${locale}/insights`]
  ] as const;

  useEffect(() => {
    document.cookie = `novalure_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    const menu = menuRef.current;
    const headerRoot = Array.from(document.body.children).find((element) => menu && element.contains(menu));
    const inertTargets = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== headerRoot
    );
    const previousInert = inertTargets.map((element) => element.inert);
    inertTargets.forEach((element) => { element.inert = true; });
    const headerTargets = Array.from(menu?.parentElement?.children || []).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== menu
    );
    const previousHeaderInert = headerTargets.map((element) => element.inert);
    headerTargets.forEach((element) => { element.inert = true; });
    const focusable = menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach((element, index) => { element.inert = previousInert[index]; });
      headerTargets.forEach((element, index) => { element.inert = previousHeaderInert[index]; });
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={`site-header v3-site-header${open ? " menu-open" : ""}`}>
        <Logo locale={locale} priority />

        <nav className="desktop-nav v3-desktop-nav" aria-label={t.navigation}>
          {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>

        <div className="header-actions desktop-actions v3-header-actions">
          <div className="v3-language-switch" aria-label={locale === "de" ? "Sprache" : locale === "es" ? "Idioma" : "Language"}>
            <Link className={locale === "de" ? "is-active" : ""} href={locale === "de" ? pathname : switchHref("de")} hrefLang="de">DE</Link>
            <Link className={locale === "en" ? "is-active" : ""} href={locale === "en" ? pathname : switchHref("en")} hrefLang="en">EN</Link>
            <Link className={locale === "es" ? "is-active" : ""} href={locale === "es" ? pathname : switchHref("es")} hrefLang="es">ES</Link>
          </div>
          <a className="v3-header-login" href={crmHref} target="_blank" rel="noreferrer" data-track="nav_crm_login">{t.login}</a>
          <Link className="v3-header-login" href={systemExampleHref} data-track="nav_system_example">CRM Demo</Link>
          <Link className="v3-button v3-button-primary v3-header-cta" href={`${getPath(locale, "contact")}#book-audit`} data-track="nav_audit">{t.cta} →</Link>
        </div>

        <button
          className="menu-toggle v3-menu-toggle"
          type="button"
          ref={toggleRef}
          aria-label={open ? t.close : t.menu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          className="mobile-menu v3-mobile-menu"
          id="mobile-menu"
          aria-label={t.navigation}
          aria-hidden={!open}
          ref={menuRef}
        >
          <div className="v3-mobile-menu-head">
            <Logo locale={locale} />
            <button ref={closeRef} type="button" aria-label={t.close} onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="v3-mobile-menu-links">
            {navItems.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
          </div>
          <div className="v3-mobile-menu-actions">
            <div className="nl-menu-columns">
              <span>SOLUTIONS</span><Link href={getPath(locale,"developers")}>Developers</Link><Link href={getPath(locale,"agents")}>Sales teams</Link><Link href={`/${locale}/solutions`}>NovaLure Studios</Link><Link href={`/${locale}/solutions`}>Demand</Link><Link href={`/${locale}/system`}>Systems</Link>
              <span>COMPANY</span><Link href={`/${locale}/work`}>Work</Link><Link href={`/${locale}/insights`}>Insights</Link><Link href={getPath(locale,"contact")}>Contact</Link>
              <span>RESOURCES</span><Link href={getPath(locale,"playbooks")}>Playbooks</Link><Link href={getPath(locale,"handover")}>CRM Demo</Link><Link href={getPath(locale,"contact")}>Project Check</Link>
            </div>
            <Link className="v3-button v3-button-primary" href={`${getPath(locale, "contact")}#book-audit`} onClick={() => setOpen(false)}>{t.cta}</Link>
            <a className="v3-button v3-button-dark-outline" href={crmHref} target="_blank" rel="noreferrer" data-track="mobile_crm_login" onClick={() => setOpen(false)}>{t.login}</a>
            <Link className="v3-button v3-button-dark-outline" href={systemExampleHref} data-track="mobile_system_example" onClick={() => setOpen(false)}>CRM Demo</Link>
            <div className="v3-language-switch is-dark">
              <Link className={locale === "de" ? "is-active" : ""} href={locale === "de" ? pathname : switchHref("de")} hrefLang="de">DE</Link>
              <Link className={locale === "en" ? "is-active" : ""} href={locale === "en" ? pathname : switchHref("en")} hrefLang="en">EN</Link>
              <Link className={locale === "es" ? "is-active" : ""} href={locale === "es" ? pathname : switchHref("es")} hrefLang="es">ES</Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="v3-mobile-sticky-bar">
        <Link className="v3-mobile-sticky-cta" href={`${getPath(locale, "contact")}#book-audit`}>{t.cta}</Link>
      </div>
    </>
  );
}
