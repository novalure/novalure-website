"use client";

import Link from "next/link";
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

const wizardCopy = {
  de: {
    progress: "Schritt", of: "von", next: "Weiter", back: "Zurück", optional: "Optional",
    steps: ["Vorhaben", "Ziel", "Zeitrahmen", "Kontakt"],
    serviceTitle: "Wobei dürfen wir Sie unterstützen?", serviceHint: "Wählen Sie den Bereich, der Ihrem Vorhaben am nächsten kommt.",
    services: ["Projektauftritt und Visualisierung", "Nachfrage und Kampagnen", "Qualifizierung und Vertriebsübergabe", "Den gesamten Projektweg prüfen", "Noch nicht sicher"],
    goalTitle: "Was möchten Sie erreichen?", goalHint: "Wählen Sie Ihr wichtigstes Ziel und erzählen Sie uns kurz von Ihrem Projekt oder Marktgebiet.",
    goals: ["Ein Projekt überzeugend präsentieren", "Passende Interessenten erreichen", "Anfragen besser qualifizieren und übergeben", "Den nächsten sinnvollen Schritt finden"],
    timingTitle: "Wann soll es losgehen?", timingHint: "Optional: Eine grobe Einschätzung genügt. Sie können auch einen Projektlink ergänzen.",
    timings: ["So bald wie möglich", "In den nächsten drei Monaten", "Später oder noch offen"],
    contactTitle: "Wie erreichen wir Sie?", contactHint: "Damit wir Ihre Anfrage persönlich beantworten können.",
    projectLabel: "Projekt oder Marktgebiet und aktuelle Herausforderung", serviceLabel: "Unterstützung", goalLabel: "Ziel", timingLabel: "Zeitrahmen", summary: "Ihre Angaben", notSpecified: "Nicht angegeben", emptyProject: "Bitte beschreiben Sie kurz Ihr Projekt oder Marktgebiet.", emptyField: "Bitte füllen Sie dieses Feld aus.", invalidUrl: "Bitte geben Sie einen Link mit http:// oder https:// ein."
  },
  en: {
    progress: "Step", of: "of", next: "Continue", back: "Back", optional: "Optional",
    steps: ["Your project", "Goal", "Timing", "Contact"],
    serviceTitle: "How can we help?", serviceHint: "Choose the area closest to what you need.",
    services: ["Project presence and visualisation", "Demand and campaigns", "Qualification and sales handover", "Review the whole project journey", "Not sure yet"],
    goalTitle: "What would you like to achieve?", goalHint: "Choose your main goal and briefly tell us about your project or market.",
    goals: ["Present a project convincingly", "Reach the right prospective buyers", "Qualify and hand over enquiries better", "Find the right next step"],
    timingTitle: "When would you like to start?", timingHint: "Optional: a rough estimate is fine. You can also add a project link.",
    timings: ["As soon as possible", "Within the next three months", "Later or undecided"],
    contactTitle: "How can we reach you?", contactHint: "So we can respond to your enquiry personally.",
    projectLabel: "Project or market and current challenge", serviceLabel: "Support", goalLabel: "Goal", timingLabel: "Timing", summary: "Your details", notSpecified: "Not specified", emptyProject: "Please briefly describe your project or market.", emptyField: "Please fill in this field.", invalidUrl: "Please enter a link starting with http:// or https://."
  },
  es: {
    progress: "Paso", of: "de", next: "Continuar", back: "Volver", optional: "Opcional",
    steps: ["Proyecto", "Objetivo", "Plazo", "Contacto"],
    serviceTitle: "¿En qué podemos ayudarle?", serviceHint: "Elija el área que más se acerque a lo que necesita.",
    services: ["Presentación y visualización del proyecto", "Demanda y campañas", "Cualificación y traspaso comercial", "Revisar todo el recorrido del proyecto", "Aún no lo sé"],
    goalTitle: "¿Qué quiere conseguir?", goalHint: "Elija su objetivo principal y cuéntenos brevemente sobre su proyecto o mercado.",
    goals: ["Presentar un proyecto de forma convincente", "Llegar a compradores interesados", "Cualificar y traspasar mejor las consultas", "Encontrar el siguiente paso adecuado"],
    timingTitle: "¿Cuándo le gustaría empezar?", timingHint: "Opcional: basta con una estimación aproximada. También puede añadir un enlace al proyecto.",
    timings: ["Lo antes posible", "En los próximos tres meses", "Más adelante o por decidir"],
    contactTitle: "¿Cómo podemos contactar con usted?", contactHint: "Así podremos responder a su consulta personalmente.",
    projectLabel: "Proyecto o mercado y reto actual", serviceLabel: "Apoyo", goalLabel: "Objetivo", timingLabel: "Plazo", summary: "Sus datos", notSpecified: "Sin indicar", emptyProject: "Describa brevemente su proyecto o mercado.", emptyField: "Complete este campo.", invalidUrl: "Introduzca un enlace que empiece por http:// o https://."
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
  const w = wizardCopy[locale];
  const homeHref = siteHome(locale, preview);
  const contactHref = (lang: Locale) => sitePath(lang, "contact", preview);
  const legalHref = (key: "imprint" | "privacy" | "cookies") => sitePath(locale, key, preview);
  const [scrolled, setScrolled] = useState(false);
  const [values, setValues] = useState<Values>(emptyValues);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [goal, setGoal] = useState("");
  const [timing, setTiming] = useState("");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) stepHeading.current?.focus();
  }, [step]);

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
  }, [status]);

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
    if (step === 1 && !values.inquiry.trim()) {
      const field = event.currentTarget.querySelector<HTMLTextAreaElement>('textarea[name="inquiry"]');
      field?.setCustomValidity(w.emptyProject);
      field?.reportValidity();
      return;
    }
    if (step === 2 && values.projectUrl.trim() && !/^https?:\/\//i.test(values.projectUrl.trim())) {
      const field = event.currentTarget.querySelector<HTMLInputElement>('input[name="projectUrl"]');
      field?.setCustomValidity(w.invalidUrl);
      field?.reportValidity();
      return;
    }
    if (step === 3) {
      for (const name of ["name", "company"] as const) {
        if (!values[name].trim()) {
          const field = event.currentTarget.querySelector<HTMLInputElement>(`input[name="${name}"]`);
          field?.setCustomValidity(w.emptyField);
          field?.reportValidity();
          return;
        }
      }
    }
    if (step < 3) {
      moveTo(step + 1);
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          inquiry: `${w.serviceLabel}: ${service}\n${w.goalLabel}: ${goal}${timing ? `\n${w.timingLabel}: ${timing}` : ""}\n\n${w.projectLabel}: ${values.inquiry}`,
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
                <div className={styles.celebration} aria-hidden="true"><span className={styles.successIcon}><Check size={25} /></span>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--piece": i } as CSSProperties} />)}</div>
                <h2 ref={successHeading} tabIndex={-1}>{t.successTitle}</h2>
                <p>{t.successBody}</p>
                <a className={styles.submit} href={meetingUrls[locale]} target="_blank" rel="noopener noreferrer">{t.schedule}<ArrowUpRight size={18} /></a>
              </div>
            ) : (
              <>
                <div className={styles.formHead}><p>NovaLure / 30 MIN</p><h2>{t.formTitle}</h2></div>
                <div className={styles.progress} aria-label={`${w.progress} ${step + 1} ${w.of} 4`}>
                  <div className={styles.progressText}><span>{w.progress} {step + 1} {w.of} 4</span><span>{w.steps[step]}</span></div>
                  <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${(step + 1) * 25}%` }} /></div>
                </div>
                <form className={styles.form} onSubmit={submit} data-track-form="asme_project_check">
                  <div className={styles.step} key={step}>
                    <h3 ref={stepHeading} tabIndex={-1} className={styles.stepTitle}>{[w.serviceTitle, w.goalTitle, w.timingTitle, w.contactTitle][step]}</h3>
                    <p className={styles.stepHint}>{[w.serviceHint, w.goalHint, w.timingHint, w.contactHint][step]}</p>
                    {step === 0 && <fieldset className={styles.choices}><legend className={styles.srOnly}>{w.serviceTitle}</legend>{w.services.map((item) => <label key={item}><input type="radio" name="service" value={item} checked={service === item} onChange={() => setService(item)} required /><span>{item}<i aria-hidden="true" /></span></label>)}</fieldset>}
                    {step === 1 && <><fieldset className={styles.choices}><legend className={styles.srOnly}>{w.goalTitle}</legend>{w.goals.map((item) => <label key={item}><input type="radio" name="goal" value={item} checked={goal === item} onChange={() => setGoal(item)} required /><span>{item}<i aria-hidden="true" /></span></label>)}</fieldset><label className={styles.field}><span>{w.projectLabel} <small>{t.required}</small></span><textarea name="inquiry" value={values.inquiry} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, inquiry: event.target.value }); }} placeholder={t.inquiryHint} rows={3} required maxLength={1500} /></label></>}
                    {step === 2 && <><fieldset className={styles.choices}><legend className={styles.srOnly}>{w.timingTitle}</legend>{w.timings.map((item) => <label key={item}><input type="radio" name="timing" value={item} checked={timing === item} onChange={() => setTiming(item)} /><span>{item}<i aria-hidden="true" /></span></label>)}</fieldset><label className={styles.field}><span>{t.projectUrl}</span><input name="projectUrl" type="url" value={values.projectUrl} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, projectUrl: event.target.value }); }} placeholder="https://" maxLength={500} /></label></>}
                    {step === 3 && <>
                      <details className={styles.summary} open><summary>{w.summary}</summary><dl><div><dt>{w.serviceLabel}</dt><dd>{service}</dd></div><div><dt>{w.goalLabel}</dt><dd>{goal}</dd></div><div><dt>{w.projectLabel}</dt><dd>{values.inquiry}</dd></div><div><dt>{w.timingLabel}</dt><dd>{timing || w.notSpecified}</dd></div>{values.projectUrl && <div><dt>{t.projectUrl}</dt><dd>{values.projectUrl}</dd></div>}</dl></details>
                      <label className={styles.field}><span>{t.name} <small>{t.required}</small></span><input name="name" value={values.name} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, name: event.target.value }); }} autoComplete="name" required maxLength={120} /></label>
                      <label className={styles.field}><span>{t.email} <small>{t.required}</small></span><input name="email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} autoComplete="email" required maxLength={254} /></label>
                      <label className={styles.field}><span>{t.company} <small>{t.required}</small></span><input name="company" value={values.company} onChange={(event) => { event.target.setCustomValidity(""); setValues({ ...values, company: event.target.value }); }} autoComplete="organization" required maxLength={160} /></label>
                      <fieldset className={styles.role}><legend>{t.role} <small>{t.required}</small></legend><div>{(["developer", "agent", "other"] as const).map((role) => <label key={role}><input type="radio" name="role" value={role} checked={values.role === role} onChange={(event) => setValues({ ...values, role: event.target.value })} required /><span>{t[role]}</span></label>)}</div></fieldset>
                      <label className={styles.field}><span>{t.phone}</span><input name="phone" type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} autoComplete="tel" maxLength={60} /></label>
                    </>}
                  </div>
                  <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues({ ...values, website: event.target.value })} /></label>
                  <div className={styles.actions}>
                    {step > 0 && <button className={styles.previous} type="button" disabled={status === "sending"} onClick={() => moveTo(step - 1)}><ArrowLeft size={17} />{w.back}</button>}
                    <button className={styles.submit} type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : step === 3 ? t.send : w.next}<ArrowRight size={18} /></button>
                  </div>
                  {status === "error" && <p className={styles.error} role="alert">{t.error}</p>}
                  {step === 3 && <p className={styles.privacy}>{t.privacy} <Link href={legalHref("privacy")}>{t.privacyLink}</Link>.</p>}
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
