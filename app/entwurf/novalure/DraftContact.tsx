"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { siteHome, sitePath } from "./SiteRoutes";
import StaffLoginLink from "./StaffLoginLink";
import ManagedServiceBrief from "./ManagedServiceBrief";
import chrome from "./DraftLegal.module.css";
import styles from "./DraftContact.module.css";

const copy = {
  de: {
    overview: "Zum Entwurf", language: "Sprache", eyebrow: "Der nächste Schritt", title: "Aus Ihrem Projekt wird ein Plan.",
    intro: "Im 30-Minuten-Projekt-Check schauen wir gemeinsam auf Projektauftritt, Nachfrage und Vertriebsübergabe. Erzählen Sie uns kurz, woran Sie arbeiten.",
    points: ["Für konkrete Immobilienprojekte und Marktgebiete", "Einordnung von Auftritt, Anfragen und Übergabe", "Ein klarer nächster Schritt nach dem Gespräch"],
    formTitle: "Projekt-Check anfragen", formIntro: "Fünf kurze Angaben genügen für den Einstieg.",
    name: "Name", email: "Geschäftliche E-Mail", company: "Unternehmen", role: "Sie sind", developer: "Bauträger / Projektentwickler", agent: "Makler / Vertriebsteam", other: "Sonstiges",
    inquiry: "Worum geht es bei Ihrem Projekt?", inquiryHint: "Ein bis zwei Sätze reichen. Zum Beispiel Projekt, Marktgebiet oder aktuelle Hürde.",
    phone: "Telefonnummer (optional)", projectUrl: "Projektlink (optional)", required: "Pflichtfeld", send: "Projekt-Check anfragen", sending: "Anfrage wird gesendet …",
    privacy: "Ihre Angaben nutzen wir zur Bearbeitung Ihrer Anfrage. Einzelheiten finden Sie in unserer", privacyLink: "Datenschutzerklärung", emailAlternative: "Lieber direkt schreiben?",
    successTitle: "Ihre Anfrage ist angekommen.", successBody: "Vielen Dank. Wir prüfen Ihr Anliegen und melden uns bei Ihnen. Wenn Sie bereits einen passenden Termin wählen möchten, können Sie das hier tun.", schedule: "Optional: Termin wählen",
    error: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an hello@novalure.eu.",
    nextEyebrow: "So geht es weiter", nextTitle: "Klarheit vor dem ersten Vorschlag.", nextSteps: [
      ["01", "Anfrage", "Sie beschreiben Ihr Projekt und die wichtigste offene Frage."],
      ["02", "Einordnung", "Wir prüfen, ob ein Projekt-Check für Ihr Vorhaben der richtige Schritt ist."],
      ["03", "Gespräch", "Gemeinsam klären wir Engpass, Möglichkeiten und einen sinnvollen nächsten Schritt."]
    ],
    legal: "Rechtliches", imprint: "Impressum", privacyLabel: "Datenschutz", cookies: "Cookies", contact: "Kontakt", back: "Zur Startseite"
  },
  en: {
    overview: "View the draft", language: "Language", eyebrow: "The next step", title: "Give your project a clear plan.",
    intro: "In a 30-minute Project Check, we review your project presence, demand and sales handover. Tell us briefly what you are working on.",
    points: ["For specific real estate projects and market areas", "A review of presence, enquiries and handover", "A clear next step after the conversation"],
    formTitle: "Request a Project Check", formIntro: "Five short details are enough to get started.",
    name: "Name", email: "Work email", company: "Company", role: "Your role", developer: "Developer / project owner", agent: "Agent / sales team", other: "Other",
    inquiry: "What is your project about?", inquiryHint: "One or two sentences are enough. For example, the project, market area or current challenge.",
    phone: "Phone number (optional)", projectUrl: "Project link (optional)", required: "Required", send: "Request a Project Check", sending: "Sending your enquiry …",
    privacy: "We use your details to respond to your enquiry. Read more in our", privacyLink: "privacy policy", emailAlternative: "Prefer to write directly?",
    successTitle: "Your enquiry has arrived.", successBody: "Thank you. We will review your enquiry and get back to you. If you would like to choose a suitable time already, you can do so here.", schedule: "Optional: choose a time",
    error: "We could not send your enquiry. Please try again or email hello@novalure.eu.",
    nextEyebrow: "What happens next", nextTitle: "Clarity before a proposal.", nextSteps: [
      ["01", "Enquiry", "Tell us about your project and your most important open question."],
      ["02", "Review", "We check whether a Project Check is the right next step for you."],
      ["03", "Conversation", "Together we clarify the bottleneck, opportunities and a sensible next step."]
    ],
    legal: "Legal", imprint: "Imprint", privacyLabel: "Privacy", cookies: "Cookies", contact: "Contact", back: "Back to homepage"
  },
  es: {
    overview: "Ver el diseño", language: "Idioma", eyebrow: "El siguiente paso", title: "Dé a su proyecto un plan claro.",
    intro: "En un análisis de 30 minutos revisamos la presentación del proyecto, la demanda y el traspaso al equipo comercial. Cuéntenos brevemente en qué está trabajando.",
    points: ["Para promociones inmobiliarias y mercados concretos", "Análisis de la presentación, las consultas y el traspaso", "Un siguiente paso claro tras la conversación"],
    formTitle: "Solicitar un análisis del proyecto", formIntro: "Cinco datos breves son suficientes para empezar.",
    name: "Nombre", email: "Correo electrónico profesional", company: "Empresa", role: "Su perfil", developer: "Promotor / desarrollador", agent: "Agencia / equipo comercial", other: "Otro",
    inquiry: "¿De qué trata su proyecto?", inquiryHint: "Basta con una o dos frases: proyecto, zona de mercado o reto actual.",
    phone: "Teléfono (opcional)", projectUrl: "Enlace del proyecto (opcional)", required: "Obligatorio", send: "Solicitar un análisis", sending: "Enviando su consulta …",
    privacy: "Utilizamos sus datos para responder a su consulta. Encontrará más información en nuestra", privacyLink: "política de privacidad", emailAlternative: "¿Prefiere escribirnos directamente?",
    successTitle: "Hemos recibido su consulta.", successBody: "Gracias. Revisaremos su solicitud y nos pondremos en contacto con usted. Si ya desea elegir una hora adecuada, puede hacerlo aquí.", schedule: "Opcional: elegir una hora",
    error: "No se ha podido enviar su consulta. Inténtelo de nuevo o escriba a hello@novalure.eu.",
    nextEyebrow: "Cómo seguimos", nextTitle: "Claridad antes de una propuesta.", nextSteps: [
      ["01", "Consulta", "Describa su proyecto y la pregunta más importante."],
      ["02", "Valoración", "Comprobamos si el análisis del proyecto es el siguiente paso adecuado."],
      ["03", "Conversación", "Aclaramos juntos el obstáculo, las posibilidades y el siguiente paso."]
    ],
    legal: "Información legal", imprint: "Aviso legal", privacyLabel: "Privacidad", cookies: "Cookies", contact: "Contacto", back: "Volver al inicio"
  }
} as const;

type Values = { name: string; email: string; company: string; role: string; inquiry: string; phone: string; projectUrl: string; website: string };
const emptyValues: Values = { name: "", email: "", company: "", role: "", inquiry: "", phone: "", projectUrl: "", website: "" };
const meetingUrls: Record<Locale, string> = {
  de: "https://meetings-eu1.hubspot.com/franz-romih?locale=de-de",
  en: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en?locale=en-us",
  es: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en?locale=es-es"
};

export default function DraftContact({ locale, preview = true }: { locale: Locale; preview?: boolean }) {
  const t = copy[locale];
  const homeHref = siteHome(locale, preview);
  const contactHref = (lang: Locale) => sitePath(lang, "contact", preview);
  const legalHref = (key: "imprint" | "privacy" | "cookies") => sitePath(locale, key, preview);
  const [scrolled, setScrolled] = useState(false);
  const [values, setValues] = useState<Values>(emptyValues);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          language: locale,
          source: "asme_draft_project_check",
          pageUri: window.location.href,
          utm: Object.fromEntries(new URLSearchParams(window.location.search))
        })
      });
      if (!response.ok) throw new Error("Request failed");
      window.dispatchEvent(new CustomEvent("novalure:funnel-event", { detail: { name: "contact_inquiry_submit", source: "asme_draft_project_check" } }));
      setValues(emptyValues);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className={chrome.page}>
      <header className={chrome.header}>
        <nav className={`${chrome.nav} ${scrolled ? chrome.navScrolled : ""}`} aria-label={t.contact}>
          <Link className={chrome.brand} href={homeHref} aria-label={`NovaLure – ${t.back}`}>novalure<span>.</span></Link>
          <div className={chrome.headerLinks}><Link href={homeHref}>{preview ? t.overview : t.back}</Link><a href="#formular">{t.contact}</a></div>
          <div className={chrome.localeSwitch} aria-label={t.language}>
            {(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={contactHref(lang)} hrefLang={lang} aria-current={locale === lang ? "page" : undefined}>{lang.toUpperCase()}</Link>)}
          </div>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="contact-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}><span>01</span><i />{t.eyebrow}</p>
            <h1 id="contact-title">{t.title}</h1>
            <p className={styles.lead}>{t.intro}</p>
            <ul className={styles.points}>{t.points.map((point) => <li key={point}><Check size={17} strokeWidth={1.8} />{point}</li>)}</ul>
            <Link className={styles.back} href={homeHref}><ArrowLeft size={16} />{t.back}</Link>
          </div>

          <div className={styles.formCard} id="formular">
            {status === "success" ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon}><Check size={25} /></span>
                <h2>{t.successTitle}</h2>
                <p>{t.successBody}</p>
                <a className={styles.submit} href={meetingUrls[locale]} target="_blank" rel="noopener noreferrer">{t.schedule}<ArrowUpRight size={18} /></a>
              </div>
            ) : (
              <>
                <div className={styles.formHead}><p>NovaLure / 30 MIN</p><h2>{t.formTitle}</h2><span>{t.formIntro}</span></div>
                <form className={styles.form} onSubmit={submit} data-track-form="asme_project_check">
                  <label className={styles.field}><span>{t.name} <small>{t.required}</small></span><input name="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} autoComplete="name" required maxLength={120} /></label>
                  <label className={styles.field}><span>{t.email} <small>{t.required}</small></span><input name="email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} autoComplete="email" required maxLength={254} /></label>
                  <label className={styles.field}><span>{t.company} <small>{t.required}</small></span><input name="company" value={values.company} onChange={(event) => setValues({ ...values, company: event.target.value })} autoComplete="organization" required maxLength={160} /></label>
                  <fieldset className={styles.role}><legend>{t.role} <small>{t.required}</small></legend><div>{(["developer", "agent", "other"] as const).map((role) => <label key={role}><input type="radio" name="role" value={role} checked={values.role === role} onChange={(event) => setValues({ ...values, role: event.target.value })} required /><span>{t[role]}</span></label>)}</div></fieldset>
                  <label className={styles.field}><span>{t.inquiry} <small>{t.required}</small></span><textarea name="inquiry" value={values.inquiry} onChange={(event) => setValues({ ...values, inquiry: event.target.value })} placeholder={t.inquiryHint} rows={3} required maxLength={2000} /></label>
                  <div className={styles.optionalRow}>
                    <label className={styles.field}><span>{t.phone}</span><input name="phone" type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} autoComplete="tel" maxLength={60} /></label>
                    <label className={styles.field}><span>{t.projectUrl}</span><input name="projectUrl" type="url" value={values.projectUrl} onChange={(event) => setValues({ ...values, projectUrl: event.target.value })} placeholder="https://" maxLength={500} /></label>
                  </div>
                  <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues({ ...values, website: event.target.value })} /></label>
                  <button className={styles.submit} type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.send}<ArrowRight size={18} /></button>
                  {status === "error" && <p className={styles.error} role="alert">{t.error}</p>}
                  <p className={styles.privacy}>{t.privacy} <Link href={legalHref("privacy")}>{t.privacyLink}</Link>.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.next} aria-labelledby="next-title">
        <div className={styles.nextInner}>
          <p className={styles.nextEyebrow}>{t.nextEyebrow}</p>
          <h2 id="next-title">{t.nextTitle}</h2>
          <div className={styles.steps}>{t.nextSteps.map(([number, title, body]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>)}</div>
          <p className={styles.emailLine}>{t.emailAlternative} <a href="mailto:hello@novalure.eu">hello@novalure.eu <ArrowUpRight size={15} /></a></p>
        </div>
      </section>

      <ManagedServiceBrief locale={locale} />
      <footer className={chrome.footer}>
        <div className={chrome.footerInner}>
          <div className={chrome.footerTop}>
            <div><Link className={chrome.footerBrand} href={homeHref}>novalure<span>.</span></Link><p>NovaLure CLG · Dublin 2, Ireland</p></div>
            <nav aria-label={t.legal}><p>{t.legal}</p><Link href={legalHref("imprint")}>{t.imprint}</Link><Link href={legalHref("privacy")}>{t.privacyLabel}</Link><Link href={legalHref("cookies")}>{t.cookies}</Link></nav>
            <div className={chrome.footerContact}><p>{t.contact}</p><a href="mailto:hello@novalure.eu">hello@novalure.eu</a><a href="#formular">{t.formTitle}<ArrowUpRight size={14} /></a></div>
          </div>
          <Link className={chrome.footerWordmark} href={homeHref}>novalure<span>.</span></Link>
          <div className={chrome.footerBottom}><span>© 2026 NovaLure CLG</span><div><StaffLoginLink locale={locale} />{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={contactHref(lang)} hrefLang={lang}>{lang.toUpperCase()}</Link>)}</div></div>
        </div>
      </footer>
    </main>
  );
}
