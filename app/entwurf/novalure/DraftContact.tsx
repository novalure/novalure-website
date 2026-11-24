"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { NovalureWordmark } from "@/components/NovalureWordmark";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
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
      ["01", "Anfrage", "Sie wählen die passenden Bereiche und können Ihr Projekt kurz beschreiben."],
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
      ["01", "Enquiry", "Choose the areas you need and optionally tell us about your project."],
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
      ["01", "Consulta", "Elija las áreas que necesita y, si lo desea, describa su proyecto."],
      ["02", "Valoración", "Comprobamos si el análisis del proyecto es el siguiente paso adecuado."],
      ["03", "Conversación", "Aclaramos juntos el obstáculo, las posibilidades y el siguiente paso."]
    ],
    legal: "Información legal", imprint: "Aviso legal", privacyLabel: "Privacidad", cookies: "Cookies", contact: "Contacto", back: "Volver al inicio"
  }
} as const;

const serviceKeys = ["project_presentation", "campaigns", "qualification_handover", "full_journey", "other", "unsure"] as const;
type Service = typeof serviceKeys[number];
const timingKeys = ["asap", "within_3_months", "later_or_undecided"] as const;

const wizardCopy = {
  de: {
    progress: "Schritt", of: "von", next: "Weiter", back: "Zurück", optional: "Optional",
    steps: ["Ihr Vorhaben", "Kontakt"], duration: "NovaLure / 30 Minuten Gespräch",
    serviceTitle: "Wobei dürfen wir Sie unterstützen?", serviceHint: "Wählen Sie mindestens einen Bereich. Mehrere Antworten sind möglich.",
    services: ["Projektauftritt und Visualisierung", "Nachfrage und Kampagnen", "Anfragen qualifizieren und an den Vertrieb übergeben", "Den gesamten Projektweg prüfen", "Etwas anderes", "Noch nicht sicher"],
    otherLabel: "Was benötigen Sie?", otherHint: "Erzählen Sie uns kurz davon.",
    projectLabel: "Was sollten wir über Ihr Projekt wissen?", projectHint: "Zum Beispiel Projekt, Marktgebiet oder aktuelle Herausforderung.",
    contactTitle: "Wie erreichen wir Sie?", contactHint: "Name und E-Mail genügen. Alles Weitere ist freiwillig.",
    timings: ["So bald wie möglich", "In den nächsten drei Monaten", "Später oder noch offen"], timingLabel: "Gewünschter Start", choose: "Bitte auswählen",
    moreDetails: "Weitere Angaben (optional)", roleNone: "Keine Angabe", summary: "Ihre Auswahl", edit: "Auswahl bearbeiten", emptyServices: "Bitte wählen Sie mindestens eine Möglichkeit.", emptyField: "Bitte geben Sie Ihren Namen ein.", invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", invalidUrl: "Bitte geben Sie einen Link mit http:// oder https:// ein."
  },
  en: {
    progress: "Step", of: "of", next: "Continue", back: "Back", optional: "Optional",
    steps: ["Your project", "Contact"], duration: "NovaLure / 30-minute conversation",
    serviceTitle: "How can we help?", serviceHint: "Choose at least one area. You can select more than one.",
    services: ["Project presentation and visualisation", "Demand and campaigns", "Qualifying enquiries and handing them to sales", "Review the whole project journey", "Something else", "Not sure yet"],
    otherLabel: "What do you need?", otherHint: "Tell us a little more.",
    projectLabel: "What should we know about your project?", projectHint: "For example, your project, market or current challenge.",
    contactTitle: "How can we reach you?", contactHint: "Your name and email are enough. Everything else is optional.",
    timings: ["As soon as possible", "Within the next three months", "Later or undecided"], timingLabel: "Preferred start", choose: "Please select",
    moreDetails: "Additional details (optional)", roleNone: "Prefer not to say", summary: "Your selection", edit: "Edit selection", emptyServices: "Please select at least one option.", emptyField: "Please enter your name.", invalidEmail: "Please enter a valid email address.", invalidUrl: "Please enter a link starting with http:// or https://."
  },
  es: {
    progress: "Paso", of: "de", next: "Continuar", back: "Volver", optional: "Opcional",
    steps: ["Su proyecto", "Contacto"], duration: "NovaLure / conversación de 30 minutos",
    serviceTitle: "¿En qué podemos ayudarle?", serviceHint: "Seleccione al menos un área. Puede elegir varias.",
    services: ["Presentación y visualización del proyecto", "Demanda y campañas", "Revisar consultas y prepararlas para ventas", "Revisar todo el recorrido del proyecto", "Otra cosa", "Aún no lo sé"],
    otherLabel: "¿Qué necesita?", otherHint: "Cuéntenos brevemente.",
    projectLabel: "¿Qué deberíamos saber sobre su proyecto?", projectHint: "Por ejemplo, el proyecto, el mercado o su reto actual.",
    contactTitle: "¿Cómo podemos contactar con usted?", contactHint: "Bastan su nombre y correo electrónico. Todo lo demás es opcional.",
    timings: ["Lo antes posible", "En los próximos tres meses", "Más adelante o por decidir"], timingLabel: "Inicio previsto", choose: "Seleccione una opción",
    moreDetails: "Datos adicionales (opcional)", roleNone: "Sin indicar", summary: "Su selección", edit: "Editar selección", emptyServices: "Seleccione al menos una opción.", emptyField: "Introduzca su nombre.", invalidEmail: "Introduzca una dirección de correo válida.", invalidUrl: "Introduzca un enlace que empiece por http:// o https://."
  }
} as const;

type Values = { name: string; email: string; company: string; role: string; inquiry: string; phone: string; projectUrl: string; website: string; otherService: string; startTiming: string };
const emptyValues: Values = { name: "", email: "", company: "", role: "", inquiry: "", phone: "", projectUrl: "", website: "", otherService: "", startTiming: "" };
const meetingUrls: Record<Locale, string> = {
  de: "https://meetings-eu1.hubspot.com/franz-romih?locale=de-de",
  en: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en?locale=en-us",
  es: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en?locale=es-es"
};

export default function DraftContact({ locale, preview = true }: { locale: Locale; preview?: boolean }) {
  const t = copy[locale];
  const w = wizardCopy[locale];
  const homeHref = siteHome(locale, preview);
  const contactHref = (lang: Locale) => sitePath(lang, "contact", preview);
  const legalHref = (key: "imprint" | "privacy" | "cookies") => sitePath(locale, key, preview);
  const [scrolled, setScrolled] = useState(false);
  const [values, setValues] = useState<Values>(emptyValues);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesError, setServicesError] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const optionalDetails = useRef<HTMLDetailsElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const submission = useRef<{ id: string; pageUri: string; utm: Record<string, string> } | null>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) stepHeading.current?.focus();
  }, [step]);

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
  }, [status]);

  function toggleService(key: Service) {
    setServicesError(false);
    setServices((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      return key === "unsure" ? [key] : [...current.filter((item) => item !== "unsure"), key];
    });
  }

  function moveTo(nextStep: number) {
    hasNavigated.current = true;
    setStatus("idle");
    setStep(nextStep);
  }

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (step === 0) {
      if (!services.length) {
        setServicesError(true);
        event.currentTarget.querySelector<HTMLInputElement>('input[name="services"]')?.focus();
        return;
      }
      moveTo(1);
      return;
    }
    const fields = event.currentTarget;
    if (!values.name.trim()) {
      const field = fields.querySelector<HTMLInputElement>('input[name="name"]');
      field?.setCustomValidity(w.emptyField);
      field?.reportValidity();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      const field = fields.querySelector<HTMLInputElement>('input[name="email"]');
      field?.setCustomValidity(w.invalidEmail);
      field?.reportValidity();
      return;
    }
    if (values.projectUrl.trim() && !/^https?:\/\//i.test(values.projectUrl.trim())) {
      const field = fields.querySelector<HTMLInputElement>('input[name="projectUrl"]');
      if (optionalDetails.current) optionalDetails.current.open = true;
      field?.setCustomValidity(w.invalidUrl);
      field?.reportValidity();
      return;
    }
    setStatus("sending");
    if (!submission.current) submission.current = { id: crypto.randomUUID(), pageUri: window.location.href, utm: Object.fromEntries(new URLSearchParams(window.location.search)) };
    const attempt = submission.current;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          services,
          otherService: services.includes("other") ? values.otherService : "",
          language: locale,
          source: "asme_draft_project_check",
          submissionId: attempt.id,
          pageUri: attempt.pageUri,
          utm: attempt.utm
        })
      });
      if (!response.ok || !(await response.json()).ok) throw new Error("Request failed");
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
          <Link className={chrome.brand} href={homeHref} aria-label={`NovaLure – ${t.back}`}><NovalureWordmark /></Link>
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

          <div className={styles.formCard} id="formular"><span id="book-audit" className={styles.anchor} aria-hidden="true" />
            {status === "success" ? (
              <div className={styles.success} role="status">
                {createPortal(<div className={styles.confetti} aria-hidden="true">{Array.from({ length: 96 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 3) % 100}%`, "--delay": `${(i % 8) * 90}ms`, "--drift": `${((i * 53) % 180) - 90}px`, "--spin": `${(i % 2 ? 1 : -1) * (360 + (i % 5) * 90)}deg` } as CSSProperties} />)}</div>, document.body)}
                <div className={styles.celebration} aria-hidden="true"><span className={styles.successIcon}><Check size={25} /></span></div>
                <h2 ref={successHeading} tabIndex={-1}>{t.successTitle}</h2>
                <p>{t.successBody}</p>
                <a className={styles.submit} href={meetingUrls[locale]} target="_blank" rel="noopener noreferrer">{t.schedule}<ArrowUpRight size={18} /></a>
              </div>
            ) : (
              <>
                <div className={styles.formHead}><p>{w.duration}</p><h2>{t.formTitle}</h2></div>
                <div className={styles.progress} aria-label={`${w.progress} ${step + 1} ${w.of} 2`}>
                  <div className={styles.progressText}><span>{w.progress} {step + 1} {w.of} 2</span><span>{w.steps[step]}</span></div>
                  <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${(step + 1) * 50}%` }} /></div>
                </div>
                <form className={styles.form} onSubmit={submit} onChangeCapture={() => { submission.current = null; }} data-track-form="asme_project_check">
                  <fieldset className={styles.step} key={step} disabled={status === "sending"}>
                    <h3 ref={stepHeading} tabIndex={-1} className={styles.stepTitle}>{step === 0 ? w.serviceTitle : w.contactTitle}</h3>
                    <p className={styles.stepHint}>{step === 0 ? w.serviceHint : w.contactHint}</p>
                    {step === 0 && <>
                      <fieldset className={styles.choices} aria-describedby={servicesError ? "service-error" : undefined} aria-invalid={servicesError || undefined}>
                        <legend className={styles.srOnly}>{w.serviceTitle}</legend>
                        {serviceKeys.map((key, index) => <label key={key}><input type="checkbox" name="services" value={key} checked={services.includes(key)} onChange={() => toggleService(key)} /><span>{w.services[index]}<i aria-hidden="true" /></span></label>)}
                      </fieldset>
                      {servicesError && <p id="service-error" className={styles.error} role="alert">{w.emptyServices}</p>}
                      {services.includes("other") && <label className={styles.field}><span>{w.otherLabel} <small>{w.optional}</small></span><input name="otherService" value={values.otherService} onChange={(event) => setValues({ ...values, otherService: event.target.value })} placeholder={w.otherHint} maxLength={300} /></label>}
                      <label className={styles.field}><span>{w.projectLabel} <small>{w.optional}</small></span><textarea name="inquiry" value={values.inquiry} onChange={(event) => setValues({ ...values, inquiry: event.target.value })} placeholder={w.projectHint} rows={3} maxLength={1500} /></label>
                    </>}
                    {step === 1 && <>
                      <div className={styles.summary}><span>{w.summary}: {services.map((key) => w.services[serviceKeys.indexOf(key)]).join(", ")}</span><button type="button" onClick={() => moveTo(0)}>{w.edit}</button></div>
                      <label className={styles.field}><span>{t.name} <small>{t.required}</small></span><input name="name" value={values.name} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, name: event.target.value }); }} autoComplete="name" required maxLength={120} /></label>
                      <label className={styles.field}><span>{t.email} <small>{t.required}</small></span><input name="email" type="email" value={values.email} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, email: event.target.value }); }} autoComplete="email" required maxLength={254} /></label>
                      <details ref={optionalDetails} className={styles.optionalDetails} onInvalidCapture={(event) => { event.currentTarget.open = true; }}>
                        <summary>{w.moreDetails}</summary>
                        <div className={styles.optionalFields}>
                      <label className={styles.field}><span>{t.company} <small>{w.optional}</small></span><input name="company" value={values.company} onChange={(event) => setValues({ ...values, company: event.target.value })} autoComplete="organization" maxLength={160} /></label>
                      <fieldset className={styles.role}><legend>{t.role} <small>{w.optional}</small></legend><div>{(["developer", "agent", "other", ""] as const).map((role) => <label key={role || "none"}><input type="radio" name="role" value={role} checked={values.role === role} onChange={(event) => setValues({ ...values, role: event.target.value })} /><span>{role ? t[role] : w.roleNone}</span></label>)}</div></fieldset>
                      <label className={styles.field}><span>{t.phone}</span><input name="phone" type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} autoComplete="tel" maxLength={60} /></label>
                      <label className={styles.field}><span>{t.projectUrl}</span><input name="projectUrl" type="url" value={values.projectUrl} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, projectUrl: event.target.value }); }} placeholder="https://" maxLength={500} /></label>
                      <label className={styles.field}><span>{w.timingLabel} <small>{w.optional}</small></span><select name="startTiming" value={values.startTiming} onChange={(event) => setValues({ ...values, startTiming: event.target.value })}><option value="">{w.choose}</option>{timingKeys.map((key, index) => <option value={key} key={key}>{w.timings[index]}</option>)}</select></label>
                        </div>
                      </details>
                    </>}
                  </fieldset>
                  <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues({ ...values, website: event.target.value })} /></label>
                  <div className={styles.actions}>
                    {step > 0 && <button className={styles.previous} type="button" disabled={status === "sending"} onClick={() => moveTo(step - 1)}><ArrowLeft size={17} />{w.back}</button>}
                    <button className={styles.submit} type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : step === 1 ? t.send : w.next}<ArrowRight size={18} /></button>
                  </div>
                  {status === "error" && <p className={styles.error} role="alert">{t.error}</p>}
                  {step === 1 && <p className={styles.privacy}>{t.privacy} <Link href={legalHref("privacy")}>{t.privacyLink}</Link>.</p>}
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
            <div><Link className={chrome.footerBrand} href={homeHref}><NovalureWordmark /></Link><p>NovaLure CLG · Dublin 2, Ireland</p></div>
            <nav aria-label={t.legal}><p>{t.legal}</p><Link href={legalHref("imprint")}>{t.imprint}</Link><Link href={legalHref("privacy")}>{t.privacyLabel}</Link><Link href={legalHref("cookies")}>{t.cookies}</Link></nav>
            <div className={chrome.footerContact}><p>{t.contact}</p><a href="mailto:hello@novalure.eu">hello@novalure.eu</a><a href="#formular">{t.formTitle}<ArrowUpRight size={14} /></a></div>
          </div>
          <Link className={chrome.footerWordmark} href={homeHref}><NovalureWordmark /></Link>
          <div className={chrome.footerBottom}><span>© 2026 NovaLure CLG</span><div><StaffLoginLink locale={locale} />{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={contactHref(lang)} hrefLang={lang}>{lang.toUpperCase()}</Link>)}</div></div>
        </div>
      </footer>
    </main>
  );
}
