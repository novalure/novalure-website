"use client";

import Link from "next/link";
import { NovalureWordmark } from "@/components/NovalureWordmark";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { PageContent } from "@/content/pages";
import { getPath, type Locale } from "@/lib/i18n";
import type { DraftLegalKey } from "./LegalContent";
import styles from "./DraftLegal.module.css";
import { siteHome, sitePath } from "./SiteRoutes";
import StaffLoginLink from "./StaffLoginLink";

const copy = {
  de: { overview: "Übersicht", contents: "Inhalt", sections: "Abschnitte", menu: "Rechtliche Seiten", back: "Zurück zum Entwurf", contact: "Kontakt", legal: "Rechtliches", current: "Aktuelle Website", company: "Unternehmensangaben" },
  en: { overview: "Overview", contents: "Contents", sections: "Sections", menu: "Legal pages", back: "Back to the draft", contact: "Contact", legal: "Legal", current: "Current website", company: "Company details" },
  es: { overview: "Resumen", contents: "Contenido", sections: "Secciones", menu: "Páginas legales", back: "Volver al diseño", contact: "Contacto", legal: "Información legal", current: "Sitio actual", company: "Datos de la empresa" }
} as const;

const legalNav = ["imprint", "privacy", "cookies", "eula"] as const satisfies readonly DraftLegalKey[];
const legalLabels: Record<Locale, Record<(typeof legalNav)[number], string>> = {
  de: { imprint: "Impressum", privacy: "Datenschutz", cookies: "Cookies", eula: "EULA" },
  en: { imprint: "Imprint", privacy: "Privacy", cookies: "Cookies", eula: "EULA" },
  es: { imprint: "Aviso legal", privacy: "Privacidad", cookies: "Cookies", eula: "EULA" }
};

function remapLegalHref(href: string, preview: boolean) {
  if (preview && /^\/(de|en|es)\/(rechtliches|legal|aviso-legal|privacidad|cookies|eula|vercel-integration-eula)/.test(href)) {
    return `/entwurf/novalure${href}`;
  }
  return href;
}

export default function DraftLegal({ content, keyName, preview = true }: { content: PageContent; keyName: DraftLegalKey; preview?: boolean }) {
  const locale = content.locale;
  const t = copy[locale];
  const overviewLabel = preview ? t.overview : { de: "Startseite", en: "Home", es: "Inicio" }[locale];
  const backLabel = preview ? t.back : { de: "Zurück zur Startseite", en: "Back to homepage", es: "Volver al inicio" }[locale];
  const homeHref = siteHome(locale, preview);
  const legalHref = (lang: Locale, key: DraftLegalKey) => sitePath(lang, key, preview);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`} aria-label={t.menu}>
          <Link className={styles.brand} href={homeHref} aria-label={`NovaLure – ${backLabel}`}><NovalureWordmark /></Link>
          <div className={styles.headerLinks}>
            <Link href={homeHref}>{overviewLabel}</Link>
            <a href="#inhalt">{t.contents}</a>
          </div>
          <div className={styles.localeSwitch} aria-label="Language">
            {(["de", "en", "es"] as const).map((lang) => (
              <Link key={lang} href={legalHref(lang, keyName)} hrefLang={lang} aria-current={locale === lang ? "page" : undefined}>{lang.toUpperCase()}</Link>
            ))}
          </div>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="legal-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}><span>01</span><i />{content.eyebrow}</div>
          <h1 id="legal-title">{content.title}<span aria-hidden="true">.</span></h1>
          <p className={styles.heroDescription}>{content.description}</p>
          <div className={styles.heroActions}>
            <a href="#inhalt" className={styles.heroButton}>{t.contents}<ArrowRight size={18} /></a>
            <Link href={homeHref} className={styles.backLink}><ArrowLeft size={16} />{backLabel}</Link>
          </div>
          <div className={styles.heroMeta}><span>NovaLure CLG</span><span>DE / EN / ES</span><span>{String(content.sections?.length ?? 0).padStart(2, "0")} {t.sections}</span></div>
        </div>
      </section>

      <section className={styles.document} id="inhalt">
        <div className={styles.documentInner}>
          <aside className={styles.sidebar} aria-label={t.contents}>
            <div className={styles.sidebarTop}><span className={styles.sideRule} /><p>{t.contents}</p></div>
            <nav className={styles.contentsNav}>
              {content.sections?.map((section, index) => (
                <a key={index} href={`#abschnitt-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title.replace(/^\d+\.\s*/, "")}</a>
              ))}
            </nav>
            <div className={styles.companyBox}>
              <p>{t.company}</p>
              {content.heroBullets.map((item, index) => <span key={index}>{item}</span>)}
            </div>
          </aside>

          <div className={styles.sections}>
            {content.sections?.map((section, index) => (
              <article className={styles.section} id={`abschnitt-${index + 1}`} key={index}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.sectionContent}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                  {section.items && <ul>{section.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>}
                  {section.links && <div className={styles.sectionLinks}>{section.links.map((link, linkIndex) => <Link key={linkIndex} href={remapLegalHref(link.href, preview)}>{link.label}<ArrowUpRight size={15} /></Link>)}</div>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div><Link className={styles.footerBrand} href={homeHref}><NovalureWordmark /></Link><p>NovaLure CLG · Dublin 2, Ireland</p></div>
            <nav aria-label={t.legal}>
              <p>{t.legal}</p>
              {legalNav.map((key) => <Link key={key} href={legalHref(locale, key)}>{legalLabels[locale][key]}</Link>)}
            </nav>
            <div className={styles.footerContact}><p>{t.contact}</p><a href="mailto:hello@novalure.eu">hello@novalure.eu</a>{preview && <a href={`https://www.novalure.eu${getPath(locale, keyName)}`} target="_blank" rel="noopener noreferrer">{t.current}<ArrowUpRight size={14} /></a>}</div>
          </div>
          <Link className={styles.footerWordmark} href={homeHref}><NovalureWordmark /></Link>
          <div className={styles.footerBottom}><span>© 2026 NovaLure CLG</span><div><StaffLoginLink locale={locale} />{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={legalHref(lang, keyName)} hrefLang={lang}>{lang.toUpperCase()}</Link>)}</div></div>
        </div>
      </footer>
    </main>
  );
}
