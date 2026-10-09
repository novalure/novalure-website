"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { getPath, getProcessAnchor, routeMap, type Locale } from "@/lib/i18n";

const headerCopy = {
  en: {
    menu: "Open menu", close: "Close menu", navigation: "Primary navigation",
    nav: ["Developers", "Agents", "Services", "Our approach", "About NovaLure", "Contact"], cta: "Request a project check"
  },
  de: {
    menu: "Menü öffnen", close: "Menü schließen", navigation: "Hauptnavigation",
    nav: ["Bauträger", "Makler", "Leistungen", "Unser Ansatz", "Über NovaLure", "Kontakt"], cta: "Projekt-Check anfragen"
  },
  es: {
    menu: "Abrir menú", close: "Cerrar menú", navigation: "Navegación principal",
    nav: ["Promotores", "Agencias", "Servicios", "Nuestro enfoque", "Sobre NovaLure", "Contacto"], cta: "Solicitar un análisis"
  }
} as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = headerCopy[locale];
  const homePath = getPath(locale, "home");
  const isHome = pathname === homePath || pathname === `${homePath}/`;

  useEffect(() => {
    if (!isHome) return;
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  const activeKey = Object.entries(routeMap).find(([, paths]) => paths[locale] === pathname)?.[0] as
    | keyof typeof routeMap
    | undefined;
  const switchHref = (targetLocale: Locale) => activeKey
    ? routeMap[activeKey][targetLocale]
    : getPath(targetLocale, "home");
  const anchor = (id: string) => `${homePath}#${id}`;
  const navItems = [
    [t.nav[0], getPath(locale, "developers")],
    [t.nav[1], getPath(locale, "agents")],
    [t.nav[2], anchor(getProcessAnchor(locale))],
    [t.nav[3], anchor("trust")],
    [t.nav[4], anchor("about")],
    [t.nav[5], anchor("kontakt")]
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
      <header className={`site-header v3-site-header${open ? " menu-open" : ""}${isHome ? " is-home" : ""}${scrolled ? " is-scrolled" : ""}`}>
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
          <Link className="v3-button v3-button-primary v3-header-cta" href={anchor("kontakt")} data-track="nav_audit">{t.cta}</Link>
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
            <Link className="v3-button v3-button-primary" href={anchor("kontakt")} onClick={() => setOpen(false)}>{t.cta}</Link>
            <div className="v3-language-switch is-dark">
              <Link className={locale === "de" ? "is-active" : ""} href={locale === "de" ? pathname : switchHref("de")} hrefLang="de">DE</Link>
              <Link className={locale === "en" ? "is-active" : ""} href={locale === "en" ? pathname : switchHref("en")} hrefLang="en">EN</Link>
              <Link className={locale === "es" ? "is-active" : ""} href={locale === "es" ? pathname : switchHref("es")} hrefLang="es">ES</Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="v3-mobile-sticky-bar">
        <Link className="v3-mobile-sticky-cta" href={anchor("kontakt")}>{t.cta}</Link>
      </div>
    </>
  );
}
