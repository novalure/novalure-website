import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ContactInquiryForm } from "@/components/ContactInquiryForm";
import { HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholdersV2";
import { PlaybookRequestForm } from "@/components/playbooks/PlaybookRequestForm";
import { SectionReveals } from "@/components/relaunch/RelaunchInteractive";
import { getPath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Real estate sales infrastructure",
    hero: <>WE DON&apos;T STOP<br />AT LEADS.<br /><em>WE BUILD DEMAND.</em></>,
    sub: "Digital sales infrastructure for new-build real estate.",
    support: "Strategy · Storytelling · Visualisation · Campaigns · Qualification · Sales Systems",
    review: "Request a project review",
    how: "See how it works",
    rooted: "Rooted in Ireland · Active in DACH, UK & internationally",
    proof: <>PROOF<br />BEFORE<br />PROMISES.</>,
    enquiries: "Qualified enquiries / month",
    volume: "Commission volume from active mandates",
    reference: "Reference values from an active mandate — GRASL Immobilien.",
    work: <>SELECTED<br />WORK.</>,
    workIntro: "Public work and reference material already released by NovaLure.",
    coming: "Project page coming soon",
    system: <>ONE SYSTEM.<br /><em>SIX DISCIPLINES.</em></>,
    systemIntro: "Everything between the first project impression and the prepared sales conversation works as one connected system.",
    disciplines: [
      ["01", "STORY", "MAKE THE PROJECT MEAN SOMETHING.", "Positioning · Target groups · Narrative · Messaging"],
      ["02", "VISUAL", "SELL WHAT DOESN'T EXIST YET.", "Exterior · Interior · Architecture imagery · Sales visuals"],
      ["03", "PRESENT", "TURN INTEREST INTO UNDERSTANDING.", "Brochure · Landing page · Project website · Sales material"],
      ["04", "AMPLIFY", "PUT THE PROJECT IN FRONT OF THE RIGHT MARKET.", "Campaign strategy · Meta · Google · International audiences"],
      ["05", "QUALIFY", "SEPARATE INTEREST FROM INTENT.", "Scoring · Follow-up · Timing · Budget proximity · Next step"],
      ["06", "HANDOVER", "CONVERSATIONS. NOT SPREADSHEETS.", "Source · Context · Intent · Timing · Structured handover"]
    ],
    worlds: "Three disciplines. One commercial outcome.",
    studioH: "MAKE THEM SEE IT BEFORE IT EXISTS.",
    studioB: "Storytelling, visualisation, project branding and sales material.",
    demandH: "ATTENTION ISN'T DEMAND.",
    demandB: "Campaigns and conversion paths that connect the right audience with the right project story.",
    systemsH: "EVERY LEAD. EVERY STEP. ONE SYSTEM.",
    systemsB: "Qualification, follow-up, handover, automation and agreed reporting — operated by NovaLure.",
    pipeline: <>FROM CLICK<br />TO CONTRACT.</>,
    pipelineBody: "A front-end demonstration of how an enquiry gains source, context, priority and a next step.",
    demo: "DEMO — NO REAL CLIENT DATA",
    operated: "Operated by NovaLure",
    stages: ["NEW", "QUALIFIED", "VIEWING", "SALES HANDOVER", "NEXT STEP"],
    evelyn: <>MEET<br /><em>EVELYN.</em></>,
    evelynSub: "The intelligence behind NovaLure.",
    evelynBody: "An internal operating-system preview for signals, workflows, approvals and task routing. It is not presented as a publicly available customer product.",
    preview: "INTERNAL OPERATING SYSTEM · TECHNOLOGY PREVIEW",
    meet: "Meet Evelyn",
    grasl: <>GRASL<br />IMMOBILIEN.</>,
    start: "Starting point",
    startBody: "Unfiltered contacts, no prioritisation, no predictable pipeline.",
    built: "What we built",
    builtBody: "A lead path with qualification, follow-up and documented handover to sales. Any transfer into an existing client CRM is agreed for the individual mandate.",
    result: "Result",
    resultBody: "15–20 qualified enquiries/month, EUR 110k+ commission volume, a structured pipeline.",
    founder: <>BUILT FROM<br />THE SALES<br /><em>FLOOR.</em></>,
    founderBody: "NovaLure was built from real estate sales experience around a simple problem: marketing creates attention, but sales needs context. NovaLure connects both from project presence to prepared conversation.",
    founderRole: "Franz Romih · Founder, NovaLure",
    playbook: <>THE NOVALURE<br /><em>PROJECT DEMAND</em><br />PLAYBOOK.</>,
    playbookBody: "How project presence becomes a qualified buyer conversation.",
    check: <>30 MINUTES.<br />ONE CLEAR<br /><em>NEXT STEP.</em></>,
    checkBody: "We review project presence, campaign, qualification, follow-up and handover — then identify the biggest bottlenecks in the sales path.",
    formTitle: "Request your Project Check",
    bookingTitle: "Or choose a time directly"
  },
  de: {
    eyebrow: "Vertriebsinfrastruktur für Immobilien",
    hero: <>WIR HÖREN BEI<br />ANFRAGEN NICHT AUF.<br /><em>WIR SCHAFFEN NACHFRAGE.</em></>,
    sub: "Digitale Vertriebsinfrastruktur für Neubauimmobilien.",
    support: "Strategie · Storytelling · Visualisierung · Kampagnen · Qualifizierung · Vertriebssysteme",
    review: "Projekt-Check anfragen",
    how: "So funktioniert es",
    rooted: "In Irland verwurzelt · Aktiv in DACH, UK & international",
    proof: <>BELEGE<br />VOR<br />VERSPRECHEN.</>,
    enquiries: "Qualifizierte Anfragen / Monat",
    volume: "Provisionsvolumen aus aktiven Mandaten",
    reference: "Referenzwerte aus einem aktiven Mandat — GRASL Immobilien.",
    work: <>AUSGEWÄHLTE<br />PROJEKTE.</>,
    workIntro: "Öffentlich freigegebene Arbeiten und Referenzmaterialien von NovaLure.",
    coming: "Projektseite folgt",
    system: <>EIN SYSTEM.<br /><em>SECHS DISZIPLINEN.</em></>,
    systemIntro: "Alles zwischen dem ersten Projekteindruck und dem vorbereiteten Verkaufsgespräch arbeitet als ein verbundenes System.",
    disciplines: [
      ["01", "STORY", "GEBEN SIE DEM PROJEKT BEDEUTUNG.", "Positionierung · Zielgruppen · Narrativ · Botschaften"],
      ["02", "VISUAL", "VERKAUFEN, WAS NOCH NICHT EXISTIERT.", "Außen · Innen · Architekturbilder · Verkaufsvisuals"],
      ["03", "PRESENT", "AUS INTERESSE WIRD VERSTÄNDNIS.", "Exposé · Landingpage · Projektwebsite · Verkaufsmaterial"],
      ["04", "AMPLIFY", "DAS PROJEKT VOR DEN RICHTIGEN MARKT BRINGEN.", "Kampagnenstrategie · Meta · Google · internationale Zielgruppen"],
      ["05", "QUALIFY", "INTERESSE VON ABSICHT TRENNEN.", "Scoring · Nachfassen · Timing · Budgetnähe · nächster Schritt"],
      ["06", "HANDOVER", "GESPRÄCHE. KEINE TABELLEN.", "Quelle · Kontext · Absicht · Timing · strukturierte Übergabe"]
    ],
    worlds: "Drei Produktwelten. Ein vertriebliches Ziel.",
    studioH: "ZEIGEN, BEVOR ES EXISTIERT.", studioB: "Storytelling, Visualisierung, Projektmarke und Verkaufsunterlagen.",
    demandH: "AUFMERKSAMKEIT IST NOCH KEINE NACHFRAGE.", demandB: "Kampagnen und Wege, die die richtige Zielgruppe mit der richtigen Projektstory verbinden.",
    systemsH: "JEDE ANFRAGE. JEDER SCHRITT. EIN SYSTEM.", systemsB: "Qualifizierung, Follow-up, Übergabe, Automatisierung und vereinbartes Reporting — betrieben von NovaLure.",
    pipeline: <>VOM KLICK<br />ZUM VERTRAG.</>, pipelineBody: "Eine Frontend-Demo, wie eine Anfrage Quelle, Kontext, Priorität und einen nächsten Schritt erhält.",
    demo: "DEMO — KEINE ECHTEN KUNDENDATEN", operated: "Betrieben von NovaLure", stages: ["NEU", "QUALIFIZIERT", "BESICHTIGUNG", "VERTRIEBSÜBERGABE", "NÄCHSTER SCHRITT"],
    evelyn: <>MEET<br /><em>EVELYN.</em></>, evelynSub: "Die Intelligenz hinter NovaLure.", evelynBody: "Vorschau eines internen Betriebssystems für Signale, Workflows, Freigaben und Aufgabensteuerung. Kein öffentlich verfügbares Kundenprodukt.", preview: "INTERNES BETRIEBSSYSTEM · TECHNOLOGIE-VORSCHAU", meet: "Evelyn entdecken",
    grasl: <>GRASL<br />IMMOBILIEN.</>, start: "Ausgangslage", startBody: "Ungefilterte Kontakte, keine Priorisierung, keine planbare Pipeline.", built: "Was wir aufgebaut haben", builtBody: "Lead-Pfad mit Qualifizierung, Follow-up und dokumentierter Vertriebsübergabe. Eine Übertragung in ein Kunden-CRM wird je Mandat vereinbart.", result: "Ergebnis", resultBody: "15–20 qualifizierte Anfragen/Monat, EUR 110k+ Provisionsvolumen, strukturierte Pipeline.",
    founder: <>AUS DEM<br />VERTRIEB<br /><em>ENTSTANDEN.</em></>, founderBody: "NovaLure entstand aus Erfahrung im Immobilienvertrieb und einem einfachen Problem: Marketing schafft Aufmerksamkeit, Vertrieb braucht Kontext. NovaLure verbindet beides vom Projektauftritt bis zum vorbereiteten Gespräch.", founderRole: "Franz Romih · Founder, NovaLure",
    playbook: <>DAS NOVALURE<br /><em>PROJECT DEMAND</em><br />PLAYBOOK.</>, playbookBody: "Wie aus Projektpräsenz ein qualifiziertes Käufergespräch wird.",
    check: <>30 MINUTEN.<br />EIN KLARER<br /><em>NÄCHSTER SCHRITT.</em></>, checkBody: "Wir prüfen Projektauftritt, Kampagne, Qualifizierung, Follow-up und Übergabe — und identifizieren die größten Engpässe im Vertriebsweg.", formTitle: "Projekt-Check anfragen", bookingTitle: "Oder direkt einen Termin wählen"
  },
  es: {
    eyebrow: "Infraestructura comercial inmobiliaria",
    hero: <>NO NOS QUEDAMOS<br />EN LOS LEADS.<br /><em>CREAMOS DEMANDA.</em></>,
    sub: "Infraestructura digital de ventas para promociones de obra nueva.",
    support: "Estrategia · Storytelling · Visualización · Campañas · Cualificación · Sistemas comerciales",
    review: "Solicitar análisis del proyecto", how: "Ver cómo funciona", rooted: "Con base en Irlanda · Activos en DACH, UK y mercados internacionales",
    proof: <>PRUEBAS<br />ANTES QUE<br />PROMESAS.</>, enquiries: "Consultas cualificadas / mes", volume: "Volumen de comisiones de mandatos activos", reference: "Valores de referencia de un mandato activo — GRASL Immobilien.",
    work: <>TRABAJO<br />SELECCIONADO.</>, workIntro: "Proyectos y referencias ya publicados por NovaLure.", coming: "Página del proyecto próximamente",
    system: <>UN SISTEMA.<br /><em>SEIS DISCIPLINAS.</em></>, systemIntro: "Todo lo que ocurre entre la primera impresión y la conversación comercial preparada funciona como un único sistema.",
    disciplines: [["01","STORY","HAGA QUE EL PROYECTO SIGNIFIQUE ALGO.","Posicionamiento · Audiencias · Narrativa · Mensajes"],["02","VISUAL","VENDA LO QUE AÚN NO EXISTE.","Exterior · Interior · Arquitectura · Visuales comerciales"],["03","PRESENT","CONVIERTA INTERÉS EN COMPRENSIÓN.","Dossier · Landing page · Web del proyecto · Material comercial"],["04","AMPLIFY","LLEVE EL PROYECTO AL MERCADO ADECUADO.","Estrategia · Meta · Google · Audiencias internacionales"],["05","QUALIFY","SEPARE INTERÉS DE INTENCIÓN.","Scoring · Seguimiento · Timing · Presupuesto · Próximo paso"],["06","HANDOVER","CONVERSACIONES. NO HOJAS DE CÁLCULO.","Fuente · Contexto · Intención · Timing · Traspaso estructurado"]],
    worlds: "Tres áreas. Un resultado comercial.", studioH: "HÁGALO VISIBLE ANTES DE QUE EXISTA.", studioB: "Storytelling, visualización, identidad de proyecto y material comercial.", demandH: "ATENCIÓN NO ES DEMANDA.", demandB: "Campañas y recorridos que conectan la audiencia adecuada con la historia del proyecto.", systemsH: "CADA LEAD. CADA PASO. UN SISTEMA.", systemsB: "Cualificación, seguimiento, traspaso, automatización e informes acordados — operado por NovaLure.",
    pipeline: <>DEL CLIC<br />AL CONTRATO.</>, pipelineBody: "Una demostración visual de cómo cada consulta obtiene fuente, contexto, prioridad y próximo paso.", demo: "DEMO — SIN DATOS REALES", operated: "Operado por NovaLure", stages: ["NUEVO","CUALIFICADO","VISITA","TRASPASO COMERCIAL","PRÓXIMO PASO"],
    evelyn: <>CONOZCA A<br /><em>EVELYN.</em></>, evelynSub: "La inteligencia detrás de NovaLure.", evelynBody: "Vista previa de un sistema operativo interno para señales, flujos, aprobaciones y asignación de tareas. No se presenta como producto público para clientes.", preview: "SISTEMA OPERATIVO INTERNO · VISTA PREVIA", meet: "Conocer Evelyn",
    grasl: <>GRASL<br />IMMOBILIEN.</>, start: "Punto de partida", startBody: "Contactos sin filtrar, sin priorización y sin pipeline previsible.", built: "Qué construimos", builtBody: "Un recorrido con cualificación, seguimiento y traspaso documentado. La integración con un CRM del cliente se acuerda para cada mandato.", result: "Resultado", resultBody: "15–20 consultas cualificadas/mes, EUR 110k+ en volumen de comisiones y un pipeline estructurado.",
    founder: <>CREADO DESDE<br />LA REALIDAD<br /><em>COMERCIAL.</em></>, founderBody: "NovaLure nació de la experiencia en ventas inmobiliarias y de un problema sencillo: el marketing genera atención, pero ventas necesita contexto. NovaLure conecta ambos desde la presencia del proyecto hasta la conversación preparada.", founderRole: "Franz Romih · Founder, NovaLure",
    playbook: <>EL PLAYBOOK<br /><em>PROJECT DEMAND</em><br />DE NOVALURE.</>, playbookBody: "Cómo convertir la presencia del proyecto en una conversación cualificada.",
    check: <>30 MINUTOS.<br />UN PRÓXIMO PASO<br /><em>CLARO.</em></>, checkBody: "Revisamos presencia, campaña, cualificación, seguimiento y traspaso para detectar los principales cuellos de botella.", formTitle: "Solicitar análisis del proyecto", bookingTitle: "O elegir una hora directamente"
  }
} as const;

const projects = [
  { name: "GRASL IMMOBILIEN", place: "Schwaz, Austria", scope: "Sales infrastructure · Qualification · Handover", image: "/images/visual-exterior-01.jpg" },
  { name: "WILDSCHÖNAU APARTMENTS", place: "Austria", scope: "Project presence · Visualisation · Sales infrastructure", image: "/images/hero-visualisation-fallback.png" },
  { name: "BEIM HEIGL", place: "Austria", scope: "Project presentation · Visualisation", image: "/images/visual-interior-01.jpg" }
] as const;

export function V2HomePage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const home = getPath(locale, "home");
  const contact = getPath(locale, "contact");
  return (
    <main className="nl-site">
      <SectionReveals />
      <section className="nl-hero" id="top">
        <Image src="/images/hero-visualisation-fallback.png" alt="Contemporary new-build architecture visualisation" fill priority sizes="100vw" />
        <div className="nl-hero-shade" />
        <div className="nl-hero-content">
          <p className="nl-eyebrow">{t.eyebrow}</p>
          <h1>{t.hero}</h1>
          <div className="nl-hero-bottom"><div><p>{t.sub}</p><small>{t.support}</small></div><div className="nl-actions"><Link href={`${contact}#book-audit`} className="nl-button is-light">{t.review} →</Link><a href="#system" className="nl-text-link">{t.how}</a></div></div>
          <p className="nl-location">{t.rooted}</p>
        </div>
      </section>

      <section className="nl-proof" id="proof" data-reveal>
        <h2>{t.proof}</h2>
        <div className="nl-proof-stats"><article><strong>15–20</strong><span>{t.enquiries}</span></article><article><strong>€110K+</strong><span>{t.volume}</span></article></div>
        <p>{t.reference}</p>
      </section>

      <section className="nl-work" data-reveal>
        <header className="nl-split-head"><h2>{t.work}</h2><p>{t.workIntro}</p></header>
        <div className="nl-projects">{projects.map((project, index) => <article className="nl-project" key={project.name}><div className="nl-project-media"><Image src={project.image} alt={`${project.name} project material`} fill sizes="(min-width: 900px) 70vw, 100vw" /></div><div className="nl-project-copy"><span>0{index + 1}</span><h3>{project.name}</h3><p>{project.place}</p><small>{project.scope}</small>{index > 0 && <em>{t.coming}</em>}</div></article>)}</div>
        <Link className="nl-arrow-link" href={`/${locale}/work`}>{locale === "de" ? "Alle Arbeiten" : locale === "es" ? "Ver todos los proyectos" : "View all work"} →</Link>
      </section>

      <section className="nl-disciplines" id="system" data-reveal>
        <header><p className="nl-eyebrow">NovaLure method</p><h2>{t.system}</h2><p>{t.systemIntro}</p></header>
        <div>{t.disciplines.map(([n, label, title, body]) => <article key={n}><span>{n}</span><small>{label}</small><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="nl-worlds" data-reveal>
        <p className="nl-eyebrow">NovaLure</p><h2>{t.worlds}</h2>
        <article className="is-studios"><span>01 / STUDIOS</span><h3>{t.studioH}</h3><p>{t.studioB}</p><Link href={`/${locale}/solutions`}>Explore Studios →</Link></article>
        <article className="is-demand"><span>02 / DEMAND</span><h3>{t.demandH}</h3><p>{t.demandB}</p><Link href={`/${locale}/solutions`}>Explore Demand →</Link></article>
        <article className="is-systems"><span>03 / SYSTEMS</span><h3>{t.systemsH}</h3><p>{t.systemsB}</p><Link href={`/${locale}/system`}>See the system →</Link></article>
      </section>

      <section className="nl-pipeline" data-reveal>
        <div className="nl-pipeline-copy"><p className="nl-eyebrow">CRM experience</p><h2>{t.pipeline}</h2><p>{t.pipelineBody}</p><strong>{t.demo}</strong><small>{t.operated}</small></div>
        <div className="nl-pipeline-ui" aria-label={t.demo}><div className="nl-ui-top"><i /><i /><i /><span>NOVALURE / PIPELINE</span></div><div className="nl-lead"><b>PENTHOUSE A3</b><span>Score 87</span><small>Source: campaign · Budget fit: high</small></div><ol>{t.stages.map((stage, i) => <li className={i < 4 ? "is-active" : ""} key={stage}><span>{String(i + 1).padStart(2,"0")}</span>{stage}</li>)}</ol><div className="nl-next">→ {locale === "de" ? "Finanzierungsgespräch · Do 14:00" : locale === "es" ? "Llamada de financiación · jue. 14:00" : "Financing call · Thu 2pm"}</div></div>
      </section>

      <section className="nl-evelyn" data-reveal>
        <div><p className="nl-eyebrow">Evelyn / operations layer</p><h2>{t.evelyn}</h2><h3>{t.evelynSub}</h3><p>{t.evelynBody}</p><span>{t.preview}</span><Link className="nl-button is-blue" href={`/${locale}/evelyn`}>{t.meet} →</Link></div>
        <div className="nl-evelyn-visual" aria-hidden="true"><b>E</b><div className="nl-signal"><i /><i /><i /><i /><i /></div><ul><li>01 — SIGNAL</li><li>02 — ROUTE</li><li>03 — APPROVE</li><li>04 — HANDOVER</li></ul></div>
      </section>

      <section className="nl-case" data-reveal><header><p className="nl-eyebrow">Reference / Schwaz, Austria</p><h2>{t.grasl}</h2></header><div>{[[t.start,t.startBody],[t.built,t.builtBody],[t.result,t.resultBody]].map(([title,body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div><blockquote>“We don’t get contact lists — we get prepared conversations. That’s the difference.”<cite>SV Thomas Grasl · GRASL Immobilien</cite></blockquote></section>

      <section className="nl-founder" data-reveal><h2>{t.founder}</h2><div className="nl-founder-note"><span>FR / 01</span><p>{t.founderBody}</p><strong>{t.founderRole}</strong></div></section>

      <section className="nl-playbook" id="playbook" data-reveal><div className="nl-playbook-copy"><p className="nl-eyebrow">Editorial resource</p><h2>{t.playbook}</h2><p>{t.playbookBody}</p><div className="nl-book" aria-hidden="true"><span>NOVALURE</span><b>PROJECT<br />DEMAND</b><small>PLAYBOOK / 2026</small></div></div><PlaybookRequestForm locale={locale} playbook="developer" selectable /></section>

      <section className="nl-check" id="project-check" data-reveal><header><p className="nl-eyebrow">Project Check</p><h2>{t.check}</h2><p>{t.checkBody}</p></header><div className="nl-check-grid"><div><h3>{t.formTitle}</h3><ContactInquiryForm locale={locale} /></div><div><h3>{t.bookingTitle}</h3><HubSpotMeetingEmbed locale={locale} /></div></div><Link className="nl-backtop" href={`${home}#top`}>↑ TOP</Link></section>
    </main>
  );
}
