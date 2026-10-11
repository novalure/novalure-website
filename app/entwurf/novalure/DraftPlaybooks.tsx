"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Download } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { playbooks, privacyPolicyVersion, type PlaybookType } from "@/lib/playbooks-meta";
import chrome from "./DraftLegal.module.css";
import styles from "./DraftPlaybooks.module.css";
import { siteHome, sitePath, sitePlaybookPath } from "./SiteRoutes";

const types: PlaybookType[] = ["developer", "agent", "international"];
const stems: Record<PlaybookType, string> = {
  developer: "project-demand",
  agent: "owned-demand",
  international: "international-buyers"
};

const copy = {
  de: {
    overview: "Zum Entwurf", language: "Sprache", selectNav: "Ausgaben", formNav: "Download",
    eyebrow: "Kostenlose Field Guides", title: "Drei Playbooks. Ein klarer nächster Schritt.",
    intro: "Praktische Arbeitsvorlagen für Bauträger und Maklerteams. Wählen Sie die Frage, die Sie gerade lösen möchten – und nutzen Sie das PDF direkt in Ihrer nächsten Teamrunde.",
    heroCta: "Playbook auswählen", directCta: "Direkt zum Download", heroNote: "Kostenlos · PDF direkt verfügbar · Kein Beratungsgespräch nötig",
    chooseEyebrow: "01 / Die passende Ausgabe", chooseTitle: "Wo möchten Sie zuerst ansetzen?",
    chooseIntro: "Jede Ausgabe enthält eine ausfüllbare Vorlage, ein vollständiges Beispiel und einen konkreten Schritt für die nächsten sieben Tage.",
    select: "Diese Ausgabe wählen", chosen: "Ausgewählt", pages: "Seiten", forWhom: "Für wen", result: "Ihr Werkzeug",
    bookEyebrow: "02 / Ein Blick hinein", bookTitle: "Nicht nur lesen. Anwenden.",
    bookIntro: "Beim Aufschlagen sehen Sie echte Innenseiten: links die Arbeitsvorlage, rechts ein vollständig ausgefülltes Beispiel. Das PDF lässt sich auch ohne NovaLure im Team verwenden.",
    worksheet: "Ausfüllbare Vorlage", example: "Ausgefülltes Beispiel", openPreview: "Innenseiten ansehen",
    formEyebrow: "03 / Ihr Download", formTitle: "Das Playbook ist für Sie bereit.",
    formIntro: "Nur Ihre E-Mail-Adresse ist erforderlich. Wir senden Ihnen die gewählte Ausgabe und zeigen den PDF-Link direkt nach der Anfrage.",
    edition: "Gewählte Ausgabe", email: "E-Mail-Adresse", emailHint: "name@unternehmen.de",
    marketing: "Optional: Ich möchte gelegentlich relevante Inhalte und Angebote von NovaLure per E-Mail erhalten. Dafür erhalte ich eine separate Bestätigung; ich kann mich jederzeit abmelden.",
    privacy: "Wir verwenden Ihre E-Mail zur Zustellung des PDFs. Weitere Marketing-E-Mails gibt es nur nach freiwilliger Bestätigung. Details im", privacyLink: "Datenschutz",
    submit: "Kostenloses PDF erhalten", sending: "Playbook wird bereitgestellt …", formFoot: "Kostenlos · Sofortiger PDF-Zugriff nach erfolgreicher Anfrage",
    successTitle: "Ihr Playbook ist bereit.", successBody: "Der Link wurde auch an Ihre E-Mail-Adresse gesendet. Sie können das PDF jetzt direkt herunterladen.",
    download: "PDF herunterladen", next: "Konkretes Projekt besprechen", error: "Das Playbook konnte gerade nicht zugestellt werden. Bitte versuchen Sie es erneut.",
    faqTitle: "Gut zu wissen", faq: [["Sind die Playbooks kostenlos?", "Ja. Sie erhalten das gewählte PDF kostenlos und ohne Beratungsgespräch."], ["Kann ich das PDF sofort herunterladen?", "Ja. Nach erfolgreicher Anfrage erscheint der Download-Link direkt auf dieser Seite. Wir senden ihn Ihnen zusätzlich per E-Mail."], ["Muss ich Marketing-E-Mails zustimmen?", "Nein. Die Einwilligung ist freiwillig und unabhängig vom PDF-Download."]],
    footerLegal: "Rechtliches", imprint: "Impressum", privacyLabel: "Datenschutz", cookies: "Cookies", footerContact: "Kontakt",
    topics: {
      developer: { label: "Für Bauträger", promise: "Vor dem Käufergespräch wissen, worum es geht.", who: "Bauträger und Projektvertrieb mit einem konkreten Verkaufsprojekt.", result: "Ein Übergabeprotokoll für fünf aktuelle Anfragen." },
      agent: { label: "Für Maklerteams", promise: "Eigentümer- und Käuferanfragen richtig weiterführen.", who: "Maklerteams mit eigenen Kanälen neben Portalen.", result: "Zwei Erstkontaktkarten mit ausgefüllten Beispielen." },
      international: { label: "Spezialausgabe", promise: "Eine Käuferreise für genau einen Zielmarkt prüfen.", who: "Teams mit konkreter grenzüberschreitender Nachfrage.", result: "Eine Zielmarkt-Matrix mit Verantwortlichen und offenen Fragen." }
    }
  },
  en: {
    overview: "View the draft", language: "Language", selectNav: "Editions", formNav: "Download",
    eyebrow: "Free field guides", title: "Three playbooks. One clear next step.",
    intro: "Practical worksheets for developers and real estate teams. Choose the question you need to solve now and bring the PDF to your next team discussion.",
    heroCta: "Choose a playbook", directCta: "Go to download", heroNote: "Free · Instant PDF access · No consultation required",
    chooseEyebrow: "01 / Find your edition", chooseTitle: "Where would you start?",
    chooseIntro: "Each edition includes a fillable worksheet, a completed example and one concrete action for the next seven days.",
    select: "Choose this edition", chosen: "Selected", pages: "pages", forWhom: "For whom", result: "Your tool",
    bookEyebrow: "02 / Look inside", bookTitle: "Read it. Then use it.",
    bookIntro: "As the book opens, you see real inside pages: the worksheet on the left and a completed example on the right. Your team can use the PDF without NovaLure.",
    worksheet: "Fillable worksheet", example: "Completed example", openPreview: "View inside pages",
    formEyebrow: "03 / Your download", formTitle: "Your playbook is ready.",
    formIntro: "Only your email address is required. We send your chosen edition and show the PDF link right after your request.",
    edition: "Chosen edition", email: "Email address", emailHint: "name@company.com",
    marketing: "Optional: I would like occasional relevant content and offers from NovaLure by email. I will receive a separate confirmation and can unsubscribe at any time.",
    privacy: "We use your email to deliver the PDF. Marketing emails require separate, voluntary confirmation. Details in our", privacyLink: "privacy notice",
    submit: "Get the free PDF", sending: "Preparing your playbook …", formFoot: "Free · Instant PDF access after a successful request",
    successTitle: "Your playbook is ready.", successBody: "We also sent the link to your email address. You can download the PDF now.",
    download: "Download PDF", next: "Discuss a real project", error: "We could not deliver the playbook just now. Please try again.",
    faqTitle: "Good to know", faq: [["Are the playbooks free?", "Yes. Your chosen PDF is free and does not require a consultation."], ["Can I download the PDF immediately?", "Yes. After a successful request, the download link appears on this page. We also email it to you."], ["Do I have to agree to marketing emails?", "No. Consent is voluntary and separate from the PDF download."]],
    footerLegal: "Legal", imprint: "Imprint", privacyLabel: "Privacy", cookies: "Cookies", footerContact: "Contact",
    topics: {
      developer: { label: "For developers", promise: "Know the context before the buyer conversation.", who: "Developers and project sales teams with a live sales project.", result: "A handover record for five current enquiries." },
      agent: { label: "For agent teams", promise: "Guide seller and buyer enquiries down the right path.", who: "Real estate teams building demand through their own channels.", result: "Two first-contact cards with completed examples." },
      international: { label: "Specialist edition", promise: "Test the buyer journey for one target market.", who: "Teams with a defined cross-border buyer market.", result: "A target-market matrix with owners and open questions." }
    }
  },
  es: {
    overview: "Ver el diseño", language: "Idioma", selectNav: "Ediciones", formNav: "Descarga",
    eyebrow: "Guías prácticas gratuitas", title: "Tres playbooks. Un siguiente paso claro.",
    intro: "Herramientas prácticas para promotores y equipos inmobiliarios. Elija la cuestión que necesita resolver ahora y lleve el PDF a la próxima reunión de su equipo.",
    heroCta: "Elegir un playbook", directCta: "Ir a la descarga", heroNote: "Gratis · Acceso directo al PDF · Sin llamada obligatoria",
    chooseEyebrow: "01 / Elija su edición", chooseTitle: "¿Por dónde quiere empezar?",
    chooseIntro: "Cada edición incluye una hoja rellenable, un ejemplo completo y una acción concreta para los próximos siete días.",
    select: "Elegir esta edición", chosen: "Seleccionado", pages: "páginas", forWhom: "Para quién", result: "Su herramienta",
    bookEyebrow: "02 / Vea el interior", bookTitle: "Léalo. Y aplíquelo.",
    bookIntro: "Al abrir el libro verá páginas reales: la hoja de trabajo a la izquierda y un ejemplo completo a la derecha. Su equipo puede usar el PDF sin NovaLure.",
    worksheet: "Hoja rellenable", example: "Ejemplo completo", openPreview: "Ver páginas interiores",
    formEyebrow: "03 / Su descarga", formTitle: "Su playbook está preparado.",
    formIntro: "Solo necesitamos su correo electrónico. Le enviamos la edición elegida y mostramos el enlace al PDF justo después de la solicitud.",
    edition: "Edición elegida", email: "Correo electrónico", emailHint: "nombre@empresa.com",
    marketing: "Opcional: Deseo recibir ocasionalmente contenidos y ofertas relevantes de NovaLure por correo. Recibiré una confirmación aparte y podré darme de baja en cualquier momento.",
    privacy: "Usamos su correo para entregar el PDF. Los correos comerciales requieren una confirmación voluntaria y separada. Más detalles en nuestra", privacyLink: "política de privacidad",
    submit: "Obtener el PDF gratis", sending: "Preparando su playbook …", formFoot: "Gratis · Acceso directo al PDF tras una solicitud correcta",
    successTitle: "Su playbook está listo.", successBody: "También enviamos el enlace a su correo. Puede descargar el PDF ahora.",
    download: "Descargar PDF", next: "Hablar de un proyecto", error: "Ahora mismo no hemos podido enviar el playbook. Inténtelo de nuevo.",
    faqTitle: "Conviene saberlo", faq: [["¿Son gratuitos los playbooks?", "Sí. Recibirá el PDF elegido gratis y sin necesidad de una llamada."], ["¿Puedo descargar el PDF inmediatamente?", "Sí. Tras una solicitud correcta, el enlace aparece en esta página. También se lo enviamos por correo."], ["¿Debo aceptar correos comerciales?", "No. El consentimiento es voluntario e independiente de la descarga del PDF."]],
    footerLegal: "Información legal", imprint: "Aviso legal", privacyLabel: "Privacidad", cookies: "Cookies", footerContact: "Contacto",
    topics: {
      developer: { label: "Para promotores", promise: "Conozca el contexto antes de hablar con el comprador.", who: "Promotores y equipos comerciales con un proyecto de venta concreto.", result: "Un protocolo de traspaso para cinco consultas actuales." },
      agent: { label: "Para agencias", promise: "Guíe las consultas de propietarios y compradores por el camino adecuado.", who: "Equipos inmobiliarios que generan demanda por sus propios canales.", result: "Dos fichas de primer contacto con ejemplos completos." },
      international: { label: "Edición especializada", promise: "Compruebe el recorrido de un mercado comprador concreto.", who: "Equipos con demanda transfronteriza definida.", result: "Una matriz de mercado con responsables y cuestiones pendientes." }
    }
  }
} as const;

const cover = (locale: Locale, type: PlaybookType) => playbooks[`${locale}-${type}`].cover;
const preview = (locale: Locale, type: PlaybookType, page: "worksheet" | "sample") => `/playbooks/previews/novalure-${stems[type]}-${locale}-${page}.png`;

export default function DraftPlaybooks({ locale, previewMode = true }: { locale: Locale; previewMode?: boolean }) {
  const t = copy[locale];
  const overviewLabel = previewMode ? t.overview : { de: "Zur Startseite", en: "Home", es: "Inicio" }[locale];
  const homeHref = siteHome(locale, previewMode);
  const playbookHref = (lang: Locale, type?: PlaybookType) => sitePlaybookPath(lang, previewMode, type);
  const legalHref = (key: "imprint" | "privacy" | "cookies") => sitePath(locale, key, previewMode);
  const contactHref = sitePath(locale, "contact", previewMode);
  const [selected, setSelected] = useState<PlaybookType>("developer");
  const [opened, setOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("ausgabe");
    if (types.some((type) => type === requested)) setSelected(requested as PlaybookType);
  }, []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const node = bookRef.current;
    if (!node) return;
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpened(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setOpened(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [selected]);

  function choose(type: PlaybookType) {
    if (status === "sending") return;
    if (type !== selected) setOpened(false);
    setSelected(type);
    setStatus("idle");
    setDownloadUrl("");
    const url = new URL(window.location.href);
    url.searchParams.set("ausgabe", type);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new CustomEvent("novalure:funnel-event", { detail: { name: "playbook_edition_select", source: "asme_draft_playbooks", playbook: `${locale}-${type}` } }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const formData = new FormData(event.currentTarget);
    if (String(formData.get("website") || "").trim()) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/playbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "field-guide",
          locale,
          playbookKey: `${locale}-${selected}`,
          email: email.trim(),
          consentMarketing: marketing,
          consentTimestamp: new Date().toISOString(),
          privacyPolicyVersion,
          submissionId: crypto.randomUUID()
        })
      });
      if (!response.ok) throw new Error(`Playbook delivery: ${response.status}`);
      const result: { downloadUrl?: string } = await response.json();
      if (!result.downloadUrl?.startsWith("/playbooks/")) throw new Error("Missing download link");
      setDownloadUrl(result.downloadUrl);
      setStatus("success");
      window.dispatchEvent(new CustomEvent("novalure:funnel-event", { detail: { name: "playbook_request_submit", source: "asme_draft_playbooks", playbook: `${locale}-${selected}` } }));
    } catch {
      setStatus("error");
    }
  }

  const selectedMeta = playbooks[`${locale}-${selected}`];

  return <main className={chrome.page}>
    <header className={chrome.header}>
      <nav className={`${chrome.nav} ${scrolled ? chrome.navScrolled : ""}`} aria-label={t.eyebrow}>
        <Link className={chrome.brand} href={homeHref} aria-label={`NovaLure – ${overviewLabel}`}>novalure<span>.</span></Link>
        <div className={chrome.headerLinks}><Link href={homeHref}>{overviewLabel}</Link><a href="#auswahl">{t.selectNav}</a><a href="#anfrage">{t.formNav}</a></div>
        <div className={chrome.localeSwitch} aria-label={t.language}>
          {(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={playbookHref(lang, selected)} hrefLang={lang} aria-current={locale === lang ? "page" : undefined}>{lang.toUpperCase()}</Link>)}
        </div>
      </nav>
    </header>

    <section className={styles.hero} aria-labelledby="playbooks-title">
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h1 id="playbooks-title">{t.title}</h1>
          <p>{t.intro}</p>
          <div className={styles.heroActions}><a className={styles.primaryLight} href="#auswahl" data-track="playbooks_choose">{t.heroCta}<ArrowDown size={19} /></a><a className={styles.secondaryLight} href="#anfrage" data-track="playbooks_direct_download">{t.directCta}<ArrowDown size={17} /></a></div>
          <div className={styles.heroNote}><Check size={16} />{t.heroNote}</div>
        </div>
        <div className={styles.heroCovers} aria-hidden="true">
          {types.map((type, index) => <div className={`${styles.heroCover} ${styles[`heroCover${index + 1}`]}`} key={type}><Image src={cover(locale, type)} alt="" width={390} height={550} sizes="(max-width: 850px) 36vw, 20vw" priority={index === 0} /></div>)}
        </div>
      </div>
    </section>

    <section className={styles.choose} id="auswahl" aria-labelledby="choose-title">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span className={styles.eyebrowDark}>{t.chooseEyebrow}</span><h2 id="choose-title">{t.chooseTitle}</h2><p>{t.chooseIntro}</p></div>
        <div className={styles.cardGrid}>
          {types.map((type, index) => {
            const meta = playbooks[`${locale}-${type}`];
            const topic = t.topics[type];
            return <article className={`${styles.card} ${selected === type ? styles.cardSelected : ""}`} key={type}>
              <div className={styles.cardTop}><span>0{index + 1} / {topic.label}</span><span>{meta.pages} {t.pages}</span></div>
              <div className={styles.cardBody}>
                <div className={styles.cardCover}><Image src={meta.cover} alt={`${meta.title} – ${topic.label}`} width={200} height={283} sizes="(max-width: 700px) 38vw, 13vw" /></div>
                <h3>{meta.title}</h3><p className={styles.cardPromise}>{topic.promise}</p>
                <dl><div><dt>{t.forWhom}</dt><dd>{topic.who}</dd></div><div><dt>{t.result}</dt><dd>{topic.result}</dd></div></dl>
              </div>
              <a className={styles.cardAction} href="#anfrage" onClick={() => choose(type)} data-track={`playbooks_select_${type}`} aria-label={`${t.select}: ${meta.title}`}><span>{selected === type ? t.chosen : t.select}</span><ArrowUpRight size={18} /></a>
            </article>;
          })}
        </div>
      </div>
    </section>

    <section className={styles.downloadSection} id="formular" aria-labelledby="download-title">
      <div className={`${styles.wrap} ${styles.downloadGrid}`}>
        <div className={styles.inside}>
          <span className={styles.eyebrow}>{t.bookEyebrow}</span>
          <h2>{t.bookTitle}</h2><p>{t.bookIntro}</p>
          <div className={styles.bookStage} ref={bookRef} aria-label={`${selectedMeta.title}: ${t.worksheet}, ${t.example}`}>
            <div key={`${locale}-${selected}`} className={`${styles.book} ${opened ? styles.bookOpened : ""}`} data-state={opened ? "open" : "closed"}>
              <div className={styles.spread}>
                <div className={styles.pageLeft}><Image src={preview(locale, selected, "worksheet")} alt={t.worksheet} fill sizes="(max-width: 700px) 42vw, 19vw" /></div>
                <div className={styles.pageRight}><Image src={preview(locale, selected, "sample")} alt={t.example} fill sizes="(max-width: 700px) 42vw, 19vw" /></div>
              </div>
              <div className={styles.paperLeaf} aria-hidden="true">
                <div className={styles.paperFront}><Image src={preview(locale, selected, "worksheet")} alt="" fill sizes="(max-width: 700px) 42vw, 19vw" /></div>
                <div className={styles.paperBack}><Image src={preview(locale, selected, "worksheet")} alt="" fill sizes="(max-width: 700px) 42vw, 19vw" /></div>
              </div>
              <div className={styles.coverLeaf}>
                <div className={styles.coverFront}><Image src={cover(locale, selected)} alt="" fill sizes="(max-width: 700px) 42vw, 19vw" /></div>
                <div className={styles.coverBack}><span>novalure<span>.</span></span><small>{selectedMeta.title}</small></div>
              </div>
            </div>
          </div>
          <div className={styles.bookLegend}><span>01 — {t.worksheet}</span><span>02 — {t.example}</span></div>
          <a className={styles.previewLink} href={preview(locale, selected, "worksheet")} target="_blank" rel="noopener noreferrer">{t.openPreview}<ArrowUpRight size={16} /></a>
        </div>

        <div className={styles.formPanel} id="anfrage">
          {status === "success" ? <div className={styles.success} role="status" aria-live="polite">
            <span className={styles.successIcon}><Check size={28} /></span>
            <span className={styles.formEyebrow}>{t.formEyebrow}</span>
            <h2 id="download-title">{t.successTitle}</h2><p>{t.successBody}</p>
            <div className={styles.successBook}><Image src={selectedMeta.cover} alt="" width={72} height={102} /><div><strong>{selectedMeta.title}</strong><span>{selectedMeta.pages} {t.pages} · PDF</span></div></div>
            <a className={styles.formSubmit} href={downloadUrl} download data-track="playbooks_pdf_download"><Download size={18} />{t.download}<ArrowRight size={18} /></a>
            <Link className={styles.nextLink} href={`${contactHref}#formular`}>{t.next}<ArrowUpRight size={16} /></Link>
          </div> : <>
            <span className={styles.formEyebrow}>{t.formEyebrow}</span>
            <h2 id="download-title">{t.formTitle}</h2><p className={styles.formIntro}>{t.formIntro}</p>
            <form onSubmit={submit} aria-busy={status === "sending"}>
              <label className={styles.field} htmlFor="playbook-edition">{t.edition}<select id="playbook-edition" value={selected} disabled={status === "sending"} onChange={(event) => choose(event.target.value as PlaybookType)}>{types.map(type => <option value={type} key={type}>{playbooks[`${locale}-${type}`].title}</option>)}</select></label>
              <label className={styles.field} htmlFor="playbook-email">{t.email}<input id="playbook-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.emailHint} autoComplete="email" required /></label>
              <label className={styles.marketing}><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /><span>{t.marketing}</span></label>
              <div className={styles.honeypot} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <button className={styles.formSubmit} type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.submit}<ArrowRight size={18} /></button>
              {status === "error" && <p className={styles.error} role="alert">{t.error}</p>}
              <p className={styles.formFoot}><Check size={14} />{t.formFoot}</p>
              <p className={styles.privacy}>{t.privacy} <Link href={legalHref("privacy")}>{t.privacyLink}</Link>.</p>
            </form>
          </>}
        </div>
      </div>
    </section>

    <section className={styles.faq} aria-labelledby="playbooks-faq-title"><div className={styles.wrap}><span className={styles.eyebrowDark}>FAQ</span><h2 id="playbooks-faq-title">{t.faqTitle}</h2><div className={styles.faqGrid}>{t.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

    <footer className={chrome.footer}>
      <div className={chrome.footerInner}>
        <div className={chrome.footerTop}>
          <div><Link className={chrome.footerBrand} href={homeHref}>novalure<span>.</span></Link><p>NovaLure CLG · Dublin 2, Ireland</p></div>
          <nav aria-label={t.footerLegal}><p>{t.footerLegal}</p><Link href={legalHref("imprint")}>{t.imprint}</Link><Link href={legalHref("privacy")}>{t.privacyLabel}</Link><Link href={legalHref("cookies")}>{t.cookies}</Link></nav>
          <div className={chrome.footerContact}><p>{t.footerContact}</p><a href="mailto:hello@novalure.eu">hello@novalure.eu</a><Link href={contactHref}><ArrowLeft size={14} />{t.next}</Link></div>
        </div>
        <Link className={chrome.footerWordmark} href={homeHref}>novalure<span>.</span></Link>
        <div className={chrome.footerBottom}><span>© 2026 NovaLure CLG</span><div>{(["de", "en", "es"] as const).map(lang => <Link key={lang} href={playbookHref(lang, selected)} hrefLang={lang}>{lang.toUpperCase()}</Link>)}</div></div>
      </div>
    </footer>
  </main>;
}
