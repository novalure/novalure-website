"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { PageContent } from "@/content/pages";
import { siteHome, sitePath, sitePlaybookPath } from "./SiteRoutes";
import chrome from "./DraftLegal.module.css";
import styles from "./DraftEditorialPage.module.css";

const ui = {
  de: { back: "Zur Startseite", contents: "Inhalte", next: "Nächster Schritt", check: "Projekt-Check anfragen", guide: "Passendes Playbook ansehen", questions: "Häufige Fragen", legal: "Rechtliches", contact: "Kontakt", imprint: "Impressum", privacy: "Datenschutz", cookies: "Cookies", example: "Illustratives Beispiel – keine echten Kundendaten." },
  en: { back: "Back to homepage", contents: "Explore", next: "Next step", check: "Request a Project Check", guide: "Explore the relevant playbook", questions: "Common questions", legal: "Legal", contact: "Contact", imprint: "Imprint", privacy: "Privacy", cookies: "Cookies", example: "Illustrative example – no real customer data." },
  es: { back: "Volver al inicio", contents: "Explorar", next: "Siguiente paso", check: "Solicitar un análisis", guide: "Ver el playbook correspondiente", questions: "Preguntas frecuentes", legal: "Información legal", contact: "Contacto", imprint: "Aviso legal", privacy: "Privacidad", cookies: "Cookies", example: "Ejemplo ilustrativo – sin datos reales de clientes." }
} as const;

const covers = {
  developer: "project-demand",
  agent: "owned-demand"
} as const;

export default function DraftEditorialPage({ content, preview = true }: { content: PageContent; preview?: boolean }) {
  const locale = content.locale;
  const t = ui[locale];
  const [scrolled, setScrolled] = useState(false);
  const homeHref = siteHome(locale, preview);
  const contactHref = `${sitePath(locale, "contact", preview)}#formular`;
  const edition = content.key === "agents" ? "agent" : "developer";
  const guideHref = `${sitePlaybookPath(locale, preview, edition)}#anfrage`;
  const isAudience = content.key === "developers" || content.key === "agents";
  const isSystem = content.key === "handover";
  const isThankYou = content.key === "playbookThanks" || content.key === "auditThanks";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <main className={chrome.page}>
    <header className={chrome.header}><nav className={`${chrome.nav} ${scrolled ? chrome.navScrolled : ""}`} aria-label={t.contents}>
      <Link className={chrome.brand} href={homeHref}>novalure<span>.</span></Link>
      <div className={chrome.headerLinks}><Link href={homeHref}>{t.back}</Link><a href="#inhalt">{t.contents}</a></div>
      <div className={chrome.localeSwitch} aria-label="Language">{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={sitePath(lang, content.key, preview)} hrefLang={lang} aria-current={lang === locale ? "page" : undefined}>{lang.toUpperCase()}</Link>)}</div>
    </nav></header>

    <section className={styles.hero} aria-labelledby="editorial-title"><div className={styles.heroGlow} aria-hidden="true" /><div className={styles.wrap}>
      <span className={styles.eyebrow}>{content.eyebrow}</span>
      <h1 id="editorial-title">{content.title}</h1><p className={styles.lead}>{content.description}</p>
      <div className={styles.heroActions}><a className={styles.lightButton} href="#inhalt">{t.contents}<ArrowDown size={17} /></a><Link className={styles.textLight} href={contactHref}>{t.check}<ArrowUpRight size={16} /></Link></div>
      <div className={styles.heroBottom}><span>NovaLure CLG</span><span>{locale.toUpperCase()} / 2026</span></div>
    </div></section>

    <section className={styles.body} id="inhalt"><div className={styles.wrap}>
      {isAudience && <div className={styles.introGrid}><div className={styles.cover}><Image src={`/playbooks/covers/novalure-${covers[edition]}-${locale}.png`} alt="" width={300} height={424} /></div><div><span className={styles.sectionLabel}>01 / {content.eyebrow}</span><h2>{content.title}</h2><ul className={styles.bullets}>{content.heroBullets.map((bullet) => <li key={bullet}><Check size={18} />{bullet}</li>)}</ul><Link className={styles.blueButton} href={guideHref}>{t.guide}<ArrowUpRight size={18} /></Link></div></div>}
      {isSystem && <div className={styles.systemExample}><span className={styles.sectionLabel}>01 / {content.eyebrow}</span><div className={styles.systemGrid}>{content.heroBullets.map((bullet, index) => <div key={bullet}><span>0{index + 1}</span><strong>{bullet}</strong></div>)}</div><p>{t.example}</p></div>}
      {isThankYou && <div className={styles.thanks}><span className={styles.sectionLabel}>01 / {content.eyebrow}</span><ul className={styles.bullets}>{content.heroBullets.map((bullet) => <li key={bullet}><Check size={18} />{bullet}</li>)}</ul></div>}
      {content.sections && <div className={styles.sections}>{content.sections.map((section, index) => <article className={styles.section} key={section.title}><span className={styles.sectionLabel}>{String(index + 2).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p>{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div></article>)}</div>}
      {content.faq && <div className={styles.faq}><span className={styles.sectionLabel}>{t.questions}</span><h2>{t.questions}</h2><div>{content.faq.slice(0, 5).map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div>}
    </div></section>

    <section className={styles.finalCta}><div className={styles.wrap}><span className={styles.eyebrow}>{t.next}</span><h2>{isSystem ? content.description : content.title}</h2><div><Link className={styles.lightButton} href={content.key === "auditThanks" ? homeHref : content.key === "playbookThanks" ? sitePlaybookPath(locale, preview) : contactHref}>{content.key === "auditThanks" ? t.back : content.key === "playbookThanks" ? t.guide : t.check}<ArrowRight size={18} /></Link>{(isAudience || isThankYou) && <Link className={styles.textLight} href={isAudience ? guideHref : contactHref}>{isAudience ? t.guide : t.check}<ArrowUpRight size={16} /></Link>}</div></div></section>

    <footer className={chrome.footer}><div className={chrome.footerInner}><div className={chrome.footerTop}>
      <div><Link className={chrome.footerBrand} href={homeHref}>novalure<span>.</span></Link><p>NovaLure CLG · Dublin 2, Ireland</p></div>
      <nav aria-label={t.legal}><p>{t.legal}</p><Link href={sitePath(locale, "imprint", preview)}>{t.imprint}</Link><Link href={sitePath(locale, "privacy", preview)}>{t.privacy}</Link><Link href={sitePath(locale, "cookies", preview)}>{t.cookies}</Link></nav>
      <div className={chrome.footerContact}><p>{t.contact}</p><a href="mailto:hello@novalure.eu">hello@novalure.eu</a><Link href={homeHref}><ArrowLeft size={14} />{t.back}</Link></div>
    </div><Link className={chrome.footerWordmark} href={homeHref}>novalure<span>.</span></Link><div className={chrome.footerBottom}><span>© 2026 NovaLure CLG</span><div>{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={sitePath(lang, content.key, preview)} hrefLang={lang}>{lang.toUpperCase()}</Link>)}</div></div></div></footer>
  </main>;
}
