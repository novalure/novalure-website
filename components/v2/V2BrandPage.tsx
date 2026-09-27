import Image from "next/image";
import Link from "next/link";
import { getPath, type Locale } from "@/lib/i18n";

export type BrandPageKind = "solutions" | "work" | "system" | "evelyn" | "insights";

const pageCopy = {
  en: {
    solutions: ["Solutions", "ONE SALES INFRASTRUCTURE. BUILT AROUND YOUR PROJECT.", "Developers|Project Sales Teams|Brokerages|International Buyer Campaigns", "NovaLure connects project story, presence, demand, qualification and sales handover. Modules can stand alone; the operating logic stays connected."],
    work: ["Selected work", "WORK THAT MOVES PROJECTS.", "GRASL Immobilien|Wildschönau Apartments|beim Heigl", "Only publicly released projects and reference material appear here. Unpublished results remain unpublished."],
    system: ["Operated service", "THE SYSTEM BEHIND THE SALE.", "Capture|Source|Intent|Timing|Budget proximity|Lead scoring|Follow-up|Handover|Reporting", "NovaLure configures and operates the process for each mandate. Client teams receive qualified handovers, status, next steps and agreed reporting — not an implied self-service software licence."],
    evelyn: ["Internal operating system · Technology preview", "MEET EVELYN.", "Signals|Workflow graph|Approval flow|Task routing|Pipeline status", "Evelyn is the internal operations and intelligence layer behind NovaLure. This page describes a technology preview, not a generally available customer product."],
    insights: ["Insights", "NOTES FROM PROJECT SALES.", "Project Sales|Demand|Visualisation|Lead Qualification|International Buyers|Real Estate Technology", "The NovaLure editorial desk is being prepared. We will publish considered field notes rather than generic filler articles."]
  },
  de: {
    solutions: ["Lösungen", "EINE VERTRIEBSINFRASTRUKTUR. RUND UM IHR PROJEKT.", "Bauträger|Projektvertrieb|Maklerunternehmen|Internationale Käuferkampagnen", "NovaLure verbindet Projektstory, Auftritt, Nachfrage, Qualifizierung und Vertriebsübergabe. Module können einzeln arbeiten; die Logik bleibt verbunden."],
    work: ["Ausgewählte Arbeiten", "ARBEIT, DIE PROJEKTE BEWEGT.", "GRASL Immobilien|Wildschönau Apartments|beim Heigl", "Hier erscheinen ausschließlich öffentlich freigegebene Projekte und Referenzmaterialien. Nicht veröffentlichte Ergebnisse bleiben unveröffentlicht."],
    system: ["Betriebener Service", "DAS SYSTEM HINTER DEM VERKAUF.", "Erfassung|Quelle|Absicht|Timing|Budgetnähe|Lead-Scoring|Follow-up|Übergabe|Reporting", "NovaLure konfiguriert und betreibt den Prozess je Mandat. Kundenteams erhalten qualifizierte Übergaben, Status, nächste Schritte und vereinbartes Reporting — kein suggeriertes Self-Service-Softwareprodukt."],
    evelyn: ["Internes Betriebssystem · Technologie-Vorschau", "MEET EVELYN.", "Signale|Workflow-Graph|Freigaben|Aufgabensteuerung|Pipeline-Status", "Evelyn ist die interne Operations- und Intelligence-Ebene hinter NovaLure. Die Seite beschreibt eine Technologie-Vorschau, kein allgemein verfügbares Kundenprodukt."],
    insights: ["Insights", "NOTIZEN AUS DEM PROJEKTVERTRIEB.", "Projektvertrieb|Nachfrage|Visualisierung|Lead-Qualifizierung|Internationale Käufer|Immobilientechnologie", "Die NovaLure Redaktion wird vorbereitet. Wir veröffentlichen fundierte Praxiseinblicke statt generischer Platzhalterartikel."]
  },
  es: {
    solutions: ["Soluciones", "UNA INFRAESTRUCTURA COMERCIAL. CREADA ALREDEDOR DE SU PROYECTO.", "Promotores|Equipos comerciales|Agencias|Campañas internacionales", "NovaLure conecta historia, presencia, demanda, cualificación y traspaso comercial. Los módulos pueden contratarse por separado; la lógica permanece conectada."],
    work: ["Trabajo seleccionado", "TRABAJO QUE MUEVE PROYECTOS.", "GRASL Immobilien|Wildschönau Apartments|beim Heigl", "Aquí solo aparecen proyectos y referencias ya publicados. Los resultados no publicados siguen siendo confidenciales."],
    system: ["Servicio operado", "EL SISTEMA DETRÁS DE LA VENTA.", "Captación|Fuente|Intención|Timing|Presupuesto|Scoring|Seguimiento|Traspaso|Reporting", "NovaLure configura y opera el proceso para cada mandato. Los equipos reciben oportunidades cualificadas, estado, próximos pasos e informes acordados — no una licencia self-service implícita."],
    evelyn: ["Sistema operativo interno · Vista previa", "CONOZCA A EVELYN.", "Señales|Grafo de flujo|Aprobaciones|Asignación|Estado del pipeline", "Evelyn es la capa interna de operaciones e inteligencia de NovaLure. Esta página describe una vista previa tecnológica, no un producto generalmente disponible."],
    insights: ["Insights", "NOTAS DESDE LA VENTA DE PROYECTOS.", "Ventas de proyectos|Demanda|Visualización|Cualificación|Compradores internacionales|Tecnología inmobiliaria", "La sección editorial de NovaLure está en preparación. Publicaremos conocimiento de campo, no artículos genéricos de relleno."]
  }
} as const;

const visuals: Record<BrandPageKind, string> = {
  solutions: "/images/visual-exterior-01.jpg",
  work: "/images/hero-visualisation-fallback.png",
  system: "/images/visual-interior-01.jpg",
  evelyn: "/og-default.svg",
  insights: "/images/visual-exterior-01.jpg"
};

export function getBrandPageTitle(locale: Locale, kind: BrandPageKind) {
  return `${pageCopy[locale][kind][0]} | NovaLure`;
}

export function V2BrandPage({ locale, kind }: { locale: Locale; kind: BrandPageKind }) {
  const [eyebrow, title, itemsString, body] = pageCopy[locale][kind];
  const items = itemsString.split("|");
  const contact = getPath(locale, "contact");
  const cta = locale === "de" ? "Projekt-Check anfragen" : locale === "es" ? "Solicitar análisis" : "Request a project review";
  return (
    <main className={`nl-brand-page is-${kind}`}>
      <section className="nl-brand-hero">
        <div><p className="nl-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p></div>
        <div className="nl-brand-media"><Image src={visuals[kind]} alt="" fill priority sizes="50vw" /></div>
      </section>
      <section className="nl-brand-list" aria-label={eyebrow}>
        {items.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2,"0")}</span><h2>{item}</h2></article>)}
      </section>
      {kind === "work" && <section className="nl-brand-note"><h2>GRASL IMMOBILIEN</h2><p>15–20 {locale === "de" ? "qualifizierte Anfragen / Monat" : locale === "es" ? "consultas cualificadas / mes" : "qualified enquiries / month"} · €110K+ {locale === "de" ? "Provisionsvolumen aus aktiven Mandaten" : locale === "es" ? "volumen de comisiones de mandatos activos" : "commission volume from active mandates"}</p></section>}
      {kind === "insights" && <section className="nl-brand-note"><p className="nl-eyebrow">Editorial</p><h2>{locale === "de" ? "IN VORBEREITUNG." : locale === "es" ? "EN PREPARACIÓN." : "COMING WITH INTENT."}</h2></section>}
      <section className="nl-brand-cta"><h2>{locale === "de" ? "IHR PROJEKT. EIN KLARER NÄCHSTER SCHRITT." : locale === "es" ? "SU PROYECTO. UN PRÓXIMO PASO CLARO." : "YOUR PROJECT. ONE CLEAR NEXT STEP."}</h2><Link className="nl-button is-light" href={`${contact}#book-audit`}>{cta} →</Link></section>
    </main>
  );
}
