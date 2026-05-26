import { type Locale, type PageKey } from "@/lib/i18n";

export type Cta =
  | {
      label: string;
      target: PageKey;
      anchor?: string;
      variant?: "button" | "subtle";
    }
  | {
      label: string;
      href: string;
      variant?: "button" | "subtle";
    };

export type FaqItem = {
  question: string;
  answer: string;
};

export type PlaybookKey = "developer" | "agent";

export type Playbook = {
  key: PlaybookKey;
  title: string;
  subtitle: string;
  learns: string[];
};

export type PageSection = {
  eyebrow?: string;
  title: string;
  body: string;
  items?: string[];
};

export type PageContent = {
  key: PageKey;
  locale: Locale;
  template: "home" | "audience" | "playbooks" | "contact" | "legal" | "thank-you" | "handover";
  title: string;
  seoTitle: string;
  description: string;
  metaDescription?: string;
  eyebrow: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  heroBullets: string[];
  sections?: PageSection[];
  faq?: FaqItem[];
  finalCtaTitle?: string;
};

export type HomeContent = PageContent & {
  template: "home";
  audience: {
    title: string;
    cards: { title: string; body: string; hrefKey: "developers" | "agents"; points: string[] }[];
  };
  problem: { title: string; body: string; points: { title: string; body: string }[] };
  system: { title: string; body: string; layers: { label: string; title: string; body: string }[] };
  modules: { title: string; items: { title: string; audience: string; body: string }[] };
  playbookSection: { title: string; body: string };
  beforeAfter: { beforeTitle: string; afterTitle: string; before: string[]; after: string[] };
  process: { id: string; title: string; body: string; steps: string[] };
  team: { id: string; title: string; body: string; pillars: string[]; founder: string; workstyle: string; ireland: string };
};

const labels = {
  en: {
    audit: "Book a Pipeline Audit",
    handover: "View example handover",
    playbook: "Download playbook",
    developerPlaybook: "Developer Pipeline Playbook",
    agentPlaybook: "Real Estate Agent Lead Playbook"
  },
  de: {
    audit: "Pipeline-Audit buchen",
    handover: "Beispiel-Handover ansehen",
    playbook: "Playbook herunterladen",
    developerPlaybook: "Bauträger-Pipeline-Leitfaden",
    agentPlaybook: "Makler-Lead-Leitfaden"
  }
};

export const playbooks: Record<Locale, Playbook[]> = {
  en: [
    {
      key: "developer",
      title: labels.en.developerPlaybook,
      subtitle: "A diagnostic guide for checking whether project enquiries are sales-ready or only contact details.",
      learns: [
        "Where project demand loses context before sales can act",
        "Which handover gaps make buyer leads expensive to sort",
        "Whether your project is concrete enough for a Pipeline Audit"
      ]
    },
    {
      key: "agent",
      title: labels.en.agentPlaybook,
      subtitle: "A diagnostic guide for checking whether seller and buyer leads create conversations or only follow-up work.",
      learns: [
        "Where seller and buyer enquiries lose intent before follow-up",
        "Which CRM context separates curiosity from sales readiness",
        "Whether your local lead system is ready for a Pipeline Audit"
      ]
    }
  ],
  de: [
    {
      key: "developer",
      title: labels.de.developerPlaybook,
      subtitle: "Ein Diagnose-Leitfaden, um zu prüfen, ob Projektanfragen sales-ready sind oder nur Kontaktdaten.",
      learns: [
        "Wo Projektnachfrage vor dem Vertrieb Kontext verliert",
        "Welche Handover-Lücken Käuferleads teuer zu sortieren machen",
        "Ob Ihr Projekt konkret genug für ein Pipeline-Audit ist"
      ]
    },
    {
      key: "agent",
      title: labels.de.agentPlaybook,
      subtitle: "Ein Diagnose-Leitfaden, um zu prüfen, ob Verkäufer- und Käuferleads Gespräche erzeugen oder nur Follow-up-Arbeit.",
      learns: [
        "Wo Verkäufer- und Käuferanfragen vor dem Follow-up Absicht verlieren",
        "Welcher CRM-Kontext Neugier von Sales-Reife trennt",
        "Ob Ihr lokales Lead-System bereit für ein Pipeline-Audit ist"
      ]
    }
  ]
};

const hardFaq: Record<Locale, FaqItem[]> = {
  de: [
    {
      question: "Warum sollte ich NovaLure vertrauen, wenn es noch keine öffentlichen Referenzen gibt?",
      answer: "Weil wir keine Referenzen erfinden. Stattdessen zeigen wir Demo-Funnels, Beispiel-CRM-Handover, Audit-Outputs und QA-Checklisten. Entscheiden Sie anhand der Systemlogik, nicht anhand erfundener Logos."
    },
    {
      question: "Haben Sie schon Kunden?",
      answer: "Wir nennen Kunden nur, wenn eine saubere Freigabe vorliegt. Ohne Freigabe zeigen wir keine Logos, keine Namen und keine indirekten Hinweise. Deshalb arbeitet NovaLure mit Beispiel-Artefakten und Demo-Systemen statt Fake-Proof."
    },
    {
      question: "Warum nennen Sie keine Kundenlogos?",
      answer: "Weil Logos nur mit sauberer Freigabe verwendet werden. Keine Logo-Wand ist besser als eine unklare Logo-Wand."
    },
    {
      question: "Ist NovaLure eine Marketingagentur?",
      answer: "Nicht im klassischen Sinn. Kampagnen können Teil des Systems sein, aber das Ziel ist nicht Werbung. Das Ziel ist eine qualifizierte Pipeline: Landingpage, Fragen, CRM-Kontext, Follow-up und Reporting."
    },
    {
      question: "Garantiert NovaLure eine bestimmte Anzahl Leads?",
      answer: "Nein. Eine seriöse Lead-Zahl hängt von Markt, Projekt, Budget, Angebot, Timing und Vertrieb ab. NovaLure verkauft keine Fantasiezahlen, sondern ein System, das Anfragequalität, Priorisierung und Vertriebsübergabe verbessert."
    },
    {
      question: "Warum gibt es keine öffentlichen Preise?",
      answer: "Weil Scope, Assets, CRM-Reife, Projektart und Run-Aufwand stark variieren. Budgetfähigkeit wird aber vor dem Audit abgefragt, damit niemand Zeit verliert."
    },
    {
      question: "Was kostet so ein System ungefähr?",
      answer: "NovaLure veröffentlicht keine harte Preisliste. Vor dem Audit wird geprüft, ob grundsätzlich Budget für Setup, operative Betreuung und gegebenenfalls Media vorhanden ist. Ohne Budgetfähigkeit ist ein Audit nicht sinnvoll."
    },
    {
      question: "Was passiert, wenn keine guten Leads kommen?",
      answer: "Dann wird im Run geprüft: Quelle, Landingpage, Formular, Intent-Fragen, Asset, Markt, Budget und Sales-Follow-up. Es gibt keine Lead-Garantie, aber eine klare Optimierungslogik."
    },
    {
      question: "Brauchen wir ein eigenes Sales Team?",
      answer: "Nicht zwingend. Wenn bereits ein Vertriebsteam besteht, sorgt NovaLure dafür, dass es weniger Rohleads sortiert und schneller mit qualifizierten Chancen spricht. Wenn noch keine klare Sales-Struktur vorhanden ist, kann NovaLure den Prozess, die Qualifizierung, das Follow-up und die Übergabe operativ mit aufbauen."
    },
    {
      question: "Was brauche ich vor dem Start?",
      answer: "Projekt oder Marktgebiet, Zielgruppe, vorhandene Assets, CRM-Zugang, Entscheidungsperson, Budgetfreigabe und Ansprechpartner."
    },
    {
      question: "Arbeiten Sie alleine oder mit einem Team?",
      answer: "NovaLure wird durch die Teamleitung geführt. Franz führt Diagnose und Systemlogik. Spezialisten oder Partner können für Umsetzungsteile wie Landingpage, CRM, Tracking, Performance oder Content eingebunden werden."
    },
    {
      question: "Warum hat NovaLure seine Basis in Irland?",
      answer: "NovaLure ist ein in Irland verwurzeltes Unternehmen mit internationaler Ausrichtung. Die irische Basis schafft eine klare EU-Vertragsgrundlage, während die deutschsprachige Teamleitung operative Nähe zum DACH-Markt sicherstellt. Vertrags-, Datenschutz- und Tooldetails werden vor Mandatsbeginn sauber geklärt."
    },
    {
      question: "Ist das für DACH-Kunden rechtlich und operativ sauber?",
      answer: "NovaLure arbeitet im EU-Kontext und nutzt strukturierte Prozesse. Vertrags-, Datenschutz- und Tooldetails werden vor Mandatsbeginn sauber geklärt."
    },
    {
      question: "Warum reicht eine normale Website nicht?",
      answer: "Eine Website präsentiert. Ein Sales-System qualifiziert, übergibt und verfolgt nach. Ohne Handover bleibt Nachfrage oft im Postfach oder CRM liegen."
    },
    {
      question: "Warum reicht Meta oder Google Ads nicht?",
      answer: "Ads erzeugen Aufmerksamkeit. Ohne Funnel, Filter, CRM und Follow-up entsteht oft Volumen, aber keine nutzbare Pipeline."
    },
    {
      question: "Was unterscheidet NovaLure von Immo-Marketing-Agenturen?",
      answer: "NovaLure fokussiert nicht zuerst auf Kampagnenästhetik oder Klickpreise, sondern auf qualifizierte Immobiliengespräche. Entscheidend ist, ob Quelle, Motivation, Timing, Budgetnähe und nächster Schritt vor dem ersten Gespräch sichtbar sind."
    },
    {
      question: "Wann ist NovaLure nicht der richtige Partner?",
      answer: "Wenn kein Projekt, kein Marktgebiet, kein Budget und keine Bereitschaft zur strukturierten Nachverfolgung vorhanden sind. NovaLure eignet sich nicht für reine Logo-, Image- oder Reichweitenkampagnen ohne Vertriebsziel."
    },
    {
      question: "Was bekomme ich nach dem Pipeline-Audit?",
      answer: "Eine Einschätzung des aktuellen Lead-Systems, identifizierte Schwachstellen und eine Empfehlung, ob Build+Run sinnvoll ist. Das Audit liefert Klarheit über den nächsten Schritt, aber keine kostenlose Komplettstrategie."
    },
    {
      question: "Wann lohnt sich Build+Run nicht?",
      answer: "Wenn kein Projekt, kein Marktgebiet, kein Media- oder Umsetzungsbudget, kein Sales-Follow-up oder kein klares Ziel vorhanden ist."
    }
  ],
  en: [
    {
      question: "Why should I trust NovaLure without public references?",
      answer: "Because we do not invent references. Instead, we show demo funnels, example CRM handovers, audit outputs and QA checklists. Judge the system logic, not a fabricated logo wall."
    },
    {
      question: "Do you already have clients?",
      answer: "We only name clients when clear permission exists. Without permission, we show no logos, names or indirect hints. NovaLure uses example artefacts and demo systems instead of fabricated proof."
    },
    {
      question: "Why are there no client logos?",
      answer: "Because logos require explicit permission. No logo wall is better than an unclear logo wall."
    },
    {
      question: "Is NovaLure a marketing agency?",
      answer: "Not in the classic sense. Campaigns can be part of the system, but the goal is not advertising. The goal is a qualified pipeline: landing page, questions, CRM context, follow-up and reporting."
    },
    {
      question: "Does NovaLure guarantee a certain number of leads?",
      answer: "No. A serious lead number depends on market, project, budget, offer, timing and sales execution. NovaLure does not sell fantasy numbers. It builds a system that improves enquiry quality, prioritisation and sales handover."
    },
    {
      question: "Why are there no public prices?",
      answer: "Scope, assets, CRM maturity, project type and Run effort vary materially. Budget readiness is checked before the audit so no one wastes time."
    },
    {
      question: "What does a system like this cost?",
      answer: "NovaLure does not publish a hard price list. Before the audit we check whether budget for setup, operating support and possible media exists. Without budget readiness, an audit is not useful."
    },
    {
      question: "What happens if lead quality is poor?",
      answer: "The Run reviews source, landing page, form, intent questions, asset, market, budget and sales follow-up. There is no lead guarantee, but there is a clear optimisation logic."
    },
    {
      question: "Do we need our own sales team?",
      answer: "Not necessarily. If a sales team already exists, NovaLure helps it sort fewer raw enquiries and speak faster with qualified opportunities. If there is no clear sales structure yet, NovaLure can help build the process, qualification, follow-up and handover operationally."
    },
    {
      question: "What do I need before starting?",
      answer: "A project or market area, target group, available assets, CRM access, decision owner, budget readiness and a clear internal contact."
    },
    {
      question: "Do you work alone or with a team?",
      answer: "NovaLure is led by its team lead. Franz leads diagnosis and system logic. Specialists or partners can be involved for landing pages, CRM, tracking, performance or content."
    },
    {
      question: "Why is NovaLure based in Ireland?",
      answer: "NovaLure is a company rooted in Ireland with an international focus. The Irish base provides a clear EU contractual foundation, while the team lead ensures operational proximity to English-speaking and DACH markets. Contract, data protection and tooling details are clarified before any mandate begins."
    },
    {
      question: "Is this clean for DACH clients legally and operationally?",
      answer: "NovaLure works in an EU context and uses structured processes. Contract, privacy and tool details are clarified before a mandate starts."
    },
    {
      question: "Why is a normal website not enough?",
      answer: "A website presents. A sales system qualifies, hands over and follows up. Without handover, demand often gets stuck in an inbox or CRM."
    },
    {
      question: "Why are Meta or Google Ads not enough?",
      answer: "Ads create attention. Without funnel, filter, CRM and follow-up, teams often get volume but no usable pipeline."
    },
    {
      question: "How is NovaLure different from real estate marketing agencies?",
      answer: "NovaLure does not start with campaign aesthetics or cheap clicks. It starts with qualified real estate conversations. The question is whether source, motivation, timing, budget proximity and next step are visible before the first call."
    },
    {
      question: "When is NovaLure not the right partner?",
      answer: "When there is no project, no market area, no budget and no willingness to follow up in a structured way. NovaLure is not built for pure logo, image or reach campaigns without a sales goal."
    },
    {
      question: "What do I receive after the Pipeline Audit?",
      answer: "An assessment of the current lead system, identified weak points and a recommendation on whether Build+Run makes sense. The audit gives clarity on the next step, but not a free full strategy."
    },
    {
      question: "When is Build+Run not worth it?",
      answer: "When there is no project, market area, media or implementation budget, sales follow-up or clear goal."
    }
  ]
};

const homeContent: Record<Locale, HomeContent> = {
  de: {
    key: "home",
    locale: "de",
    template: "home",
    eyebrow: "Lead-Systeme für Immobilienvertrieb",
    title: "Mehr qualifizierte Immobiliengespräche. Weniger Rohleads im Vertrieb.",
    seoTitle: "NovaLure | Qualifizierte Immobiliengespräche statt Rohleads",
    description:
      "NovaLure baut Lead-Systeme für Bauträger, Projektvertriebe und Makler, die Interessenten vorqualifizieren, ins CRM übergeben und zeigen, wen Ihr Team zuerst anrufen sollte.",
    metaDescription:
      "NovaLure baut CRM-fähige Lead-Systeme für Bauträger, Projektvertriebe und Makler: qualifizierte Immobiliengespräche, klare Priorisierung und weniger Rohleads im Vertrieb.",
    primaryCta: { label: "Pipeline-Audit buchen", target: "contact", anchor: "book-audit" },
    secondaryCta: { label: "Beispiel-Handover ansehen", target: "home", anchor: "proof", variant: "subtle" },
    heroBullets: [
      "Weniger Zeit mit unqualifizierten Anfragen",
      "Mehr Kontext vor dem ersten Gespräch",
      "Klare Priorisierung im CRM",
      "Für Bauträger, Projektvertriebe und Makler"
    ],
    audience: {
      title: "Für Immobilienunternehmen, die aus Anfragen schneller qualifizierte Gespräche machen wollen.",
      cards: [
        {
          title: "Für Bauträger und Projektvertriebe",
          body: "Wenn ein Projekt verkauft werden muss, reichen Klicks nicht. Ihr Vertrieb braucht Käufer, die zum Projekt, Budget und Timing passen.",
          hrefKey: "developers",
          points: ["Projekt-Funnel nach Einheitentyp und Zielgruppe", "Käuferfragen zu Budget, Timing und Nutzung", "CRM-Übergabe mit nächstem Schritt"]
        },
        {
          title: "Für Makler und Maklerteams",
          body: "Wenn Eigentümer- und Käuferanfragen unsortiert im Postfach landen, verliert Ihr Team Zeit. NovaLure trennt Neugier von echter Verkaufs- oder Kaufabsicht.",
          hrefKey: "agents",
          points: ["Verkäufer-Lead-Systeme", "Käufer-Funnels mit Suchprofil-Logik", "Follow-up und CRM-Kontext statt Portalabhängigkeit"]
        }
      ]
    },
    problem: {
      title: "Viele Immobilienunternehmen haben kein Lead-Problem. Sie haben ein Sortierproblem.",
      body:
        "Anfragen kommen rein, aber Vertriebsteams wissen zu spät, wer wirklich passt. Jede unqualifizierte Anfrage kostet Vertriebszeit. NovaLure baut die Struktur, die aus Klicks qualifizierte Gespräche macht.",
      points: [
        { title: "Rohleads kosten Zeit", body: "Wenn Ihr Team erst im Telefonat merkt, dass Budget, Timing oder Motivation nicht passen, ist der Fehler schon vorher passiert." },
        { title: "CPL ist nicht Pipeline", body: "Mehr Leads lösen das Problem nicht, wenn die falschen Anfragen zuerst im Vertrieb landen." },
        { title: "Portalabhängigkeit bleibt riskant", body: "Portale schaffen Reichweite, aber keine eigene Funnel-Logik, CRM-Übergabe oder Follow-up-Disziplin." }
      ]
    },
    system: {
      title: "Ein PropTech Sales System ist die Struktur zwischen erstem Klick und qualifiziertem Gespräch.",
      body: "Es verbindet Landingpage, Fragen zur Kauf- oder Verkaufsabsicht, CRM-Übergabe, Follow-up und Reporting. Ads können Teil davon sein, sind aber nicht das Produkt.",
      layers: [
        { label: "01", title: "Der Weg vom Klick zur Anfrage", body: "Zielgruppe, Projekt oder Marktgebiet und die wichtigsten Entscheidungsfragen werden vor Media-Budget geklärt." },
        { label: "02", title: "Vorqualifizierende Fragen", body: "Fragen erkennen echte Kauf- oder Verkaufsabsicht, bevor Ihr Team Zeit in ein Gespräch investiert." },
        { label: "03", title: "Übergabe ins CRM", body: "Quelle, Motivation, Timing, Budgetnähe und nächster Schritt werden sichtbar statt nur Name und Telefonnummer." },
        { label: "04", title: "Aufbau plus laufende Optimierung", body: "Leadqualität wird anhand von Gesprächen, Feedback und Reporting verbessert, nicht nur anhand von Klicks." }
      ]
    },
    modules: {
      title: "Was NovaLure konkret liefert",
      items: [
        { title: "Landingpage oder Projekt-Funnel", audience: "Lieferung", body: "Ein klarer Weg vom ersten Klick bis zur qualifizierten Anfrage, passend zu Projekt, Marktgebiet oder Zielgruppe." },
        { title: "Vorqualifizierende Fragen", audience: "Lieferung", body: "Fragen, die echte Kauf- oder Verkaufsabsicht erkennen: Timing, Budgetnähe, Motivation, Objektart und nächster Schritt." },
        { title: "Lead-Magnet oder Sales Asset", audience: "Lieferung", body: "Ein Projektguide, Verkäufer-Check, Bewertungslogik oder Käuferprofil, das Anfragen konkreter macht." },
        { title: "CRM-fähige Übergabe", audience: "Lieferung", body: "Ihr Team sieht Quelle, Motivation, Timing, Budgetnähe und nächsten Schritt vor dem ersten Gespräch." },
        { title: "Priorisierung", audience: "Lieferung", body: "Anfragen werden nach Fit, Timing und Budgetnähe sortiert, damit die besten Chancen zuerst bearbeitet werden." },
        { title: "Follow-up-Struktur", audience: "Lieferung", body: "Segmentierte Nachverfolgung für Käufer, Eigentümer oder Projektinteressenten, damit keine ernsthafte Anfrage liegen bleibt." },
        { title: "Reporting nach Leadqualität", audience: "Lieferung", body: "Reporting zeigt nicht nur Klicks und CPL, sondern welche Quellen qualifizierte Gespräche erzeugen." },
        { title: "Operativer Aufbau", audience: "Lieferung", body: "Ob mit bestehendem Vertriebsteam oder ohne: NovaLure baut die Struktur, die aus Immobilienanfragen qualifizierte Gespräche macht." },
        { title: "Laufende Optimierung", audience: "Lieferung", body: "Aufbau plus laufende Verbesserung anhand von Leadqualität, Vertriebsecho und Pipeline-Sichtbarkeit." },
        { title: "Audit-Einstieg", audience: "Lieferung", body: "Vor dem Angebot wird geprüft, wo Ihr Lead-System Vertriebszeit verliert und ob Build+Run wirtschaftlich sinnvoll ist." }
      ]
    },
    playbookSection: {
      title: "Das Playbook bleibt der zweite Schritt, nicht der Hauptverkauf.",
      body: "Wenn Sie noch nicht bereit für ein Audit sind, zeigt das Playbook, wo Anfragen vor dem Vertrieb Kontext verlieren. Der direkte Weg bleibt das Pipeline-Audit."
    },
    beforeAfter: {
      beforeTitle: "Vor NovaLure",
      afterTitle: "Nach dem Build+Run-System",
      before: ["Unklare Formularleads", "CPL statt Pipeline-Sicht", "Follow-up hängt an Einzelpersonen", "CRM ohne Kontext", "Vertrieb sortiert manuell"],
      after: ["Quelle, Segment und Timing sichtbar", "Priorisierte Verkaufschancen im CRM", "Follow-up je Segment", "Handover-Notiz vor dem ersten Call", "Run-Optimierung nach Leadqualität"]
    },
    process: {
      id: "prozess",
      title: "Erst Diagnose. Dann Aufbau. Danach laufende Optimierung.",
      body: "NovaLure verkauft kein Standardpaket. Der Scope entsteht aus Leadproblem, Marktgebiet, Projektlogik, Sales-Struktur und wirtschaftlicher Sinnhaftigkeit.",
      steps: ["Pipeline-Audit", "Engpass klären", "Scope definieren", "Lead-Weg bauen", "CRM-Übergabe einrichten", "Launch", "Leadqualität optimieren"]
    },
    team: {
      id: "team",
      title: "Gebaut aus Immobilienvertriebsperspektive, nicht aus Kampagnenperspektive.",
      body:
        "NovaLure wird durch die Teamleitung geführt. Der Fokus liegt auf einem einfachen Problem: Viele Immobilienanfragen erreichen den Vertrieb ohne ausreichenden Kontext. NovaLure baut Systeme, die Nachfrage, Qualifizierung, CRM-Übergabe und Follow-up zusammenführen, damit schneller klar wird, welche Gespräche wirklich Priorität haben.",
      pillars: [
        "Immobilienvertrieb steht vor Kampagnenlogik: Erst Gesprächsqualität, dann Media.",
        "Fokus auf qualifizierte Immobiliengespräche statt reiner Leadanzahl.",
        "CRM-Kontext vor dem ersten Anruf: Quelle, Motivation, Timing, Budgetnähe und nächster Schritt.",
        "Audit vor Angebot: Scope wird erst nach Diagnose definiert.",
        "Bestehende Sales-Teams werden gestärkt; fehlende Sales-Struktur kann operativ mit aufgebaut werden."
      ],
      founder: "Franz Romih – Teamleitung: Diagnose, Systemarchitektur und kommerzielle Priorisierung",
      workstyle:
        "NovaLure wird durch die Teamleitung geführt. Franz verantwortet Diagnose, Architektur und kommerzielle Logik. Umsetzungsteile wie Landingpage, Tracking, CRM-Setup, Kampagnen und Assets können je nach Scope mit spezialisierten Partnern umgesetzt werden. Entscheidend ist: Die Verantwortung für Systemlogik, Qualität und Handover bleibt zentral bei der Teamleitung.",
      ireland:
        "NovaLure ist ein in Irland verwurzeltes Unternehmen mit internationaler Ausrichtung und betreut Kunden in Irland, UK, der DACH-Region und darüber hinaus. Operativ zählen klare Ansprechpartner, saubere Vertragsgrundlage, DSGVO-konforme Tools, nachvollziehbare Kommunikation und definierte Deliverables."
    },
    faq: hardFaq.de,
    finalCtaTitle: "Lassen Sie prüfen, wo Ihr Lead-System Vertriebszeit verliert."
  },
  en: {
    key: "home",
    locale: "en",
    template: "home",
    eyebrow: "Lead systems for real estate sales",
    title: "More qualified real estate conversations. Fewer raw leads for sales.",
    seoTitle: "NovaLure | Qualified real estate conversations instead of raw leads",
    description:
      "NovaLure builds lead systems for developers, project sales teams and real estate agents that pre-qualify enquiries, enrich them with context and show who sales should call first.",
    metaDescription:
      "NovaLure builds CRM-ready lead systems for developers, project sales teams and real estate agents: qualified real estate conversations, clear prioritisation and fewer raw leads for sales.",
    primaryCta: { label: "Book a Pipeline Audit", target: "contact", anchor: "book-audit" },
    secondaryCta: { label: "See sample handover", target: "home", anchor: "proof", variant: "subtle" },
    heroBullets: [
      "Less time wasted on unqualified enquiries",
      "More context before the first call",
      "Clear CRM prioritisation",
      "Built for developers, project sales teams and agents"
    ],
    audience: {
      title: "For real estate companies that need enquiries to become qualified conversations faster.",
      cards: [
        {
          title: "For developers and project sales teams",
          body: "When a project needs to sell, clicks are not enough. Sales needs buyers who match the project, budget and timing.",
          hrefKey: "developers",
          points: ["Project funnel by unit type and target group", "Buyer questions for budget, timing and use case", "CRM handover with next step"]
        },
        {
          title: "For agents and broker teams",
          body: "When seller and buyer enquiries land in an inbox without priority, your team loses time. NovaLure separates curiosity from real selling or buying intent.",
          hrefKey: "agents",
          points: ["Seller lead systems", "Buyer funnels with search-profile logic", "Follow-up and CRM context beyond portals"]
        }
      ]
    },
    problem: {
      title: "Most real estate companies do not have a lead problem. They have a sorting problem.",
      body:
        "Enquiries come in, but sales teams see too late who is actually worth their time. Every unqualified enquiry costs sales time. NovaLure builds the structure that turns clicks into qualified conversations.",
      points: [
        { title: "Raw leads waste time", body: "If your team only finds out during the call that budget, timing or motivation do not fit, the mistake happened earlier." },
        { title: "CPL is not pipeline", body: "More leads do not solve the problem if the wrong enquiries reach sales first." },
        { title: "Portal dependency stays risky", body: "Portals create reach, but not your own funnel logic, CRM handover or follow-up discipline." }
      ]
    },
    system: {
      title: "A PropTech Sales System is the structure between first click and qualified conversation.",
      body: "It connects landing page, qualification questions, CRM handover, follow-up and reporting. Ads can be part of it, but they are not the product.",
      layers: [
        { label: "01", title: "Path from click to enquiry", body: "Target group, project or market area and the key decision questions are defined before media spend." },
        { label: "02", title: "Pre-qualification questions", body: "Questions identify real buying or selling intent before your team invests time in a conversation." },
        { label: "03", title: "CRM-ready handover", body: "Source, motivation, timing, budget proximity and next step become visible instead of just name and phone number." },
        { label: "04", title: "Build plus ongoing optimisation", body: "Lead quality improves through sales feedback, reporting and conversation quality, not clicks alone." }
      ]
    },
    modules: {
      title: "What NovaLure actually delivers",
      items: [
        { title: "Landing page or project funnel", audience: "Delivery", body: "A clear path from first click to qualified enquiry, matched to project, market area or target group." },
        { title: "Pre-qualification questions", audience: "Delivery", body: "Questions that identify real buying or selling intent: timing, budget proximity, motivation, property type and next step." },
        { title: "Lead magnet or sales asset", audience: "Delivery", body: "A project guide, seller check, valuation logic or buyer profile that makes enquiries more concrete." },
        { title: "CRM-ready handover", audience: "Delivery", body: "Your team sees source, motivation, timing, budget proximity and next step before the first call." },
        { title: "Prioritisation", audience: "Delivery", body: "Enquiries are sorted by fit, timing and budget proximity so the best opportunities are handled first." },
        { title: "Follow-up structure", audience: "Delivery", body: "Segmented follow-up for buyers, sellers or project enquiries so serious opportunities do not sit idle." },
        { title: "Reporting by lead quality", audience: "Delivery", body: "Reporting shows not only clicks and CPL, but which sources create qualified conversations." },
        { title: "Operational build", audience: "Delivery", body: "With or without an existing sales team: NovaLure builds the structure that turns real estate enquiries into qualified conversations." },
        { title: "Ongoing optimisation", audience: "Delivery", body: "Build plus ongoing improvement based on lead quality, sales feedback and pipeline visibility." },
        { title: "Audit entry", audience: "Delivery", body: "Before a proposal, we check where your lead system wastes sales time and whether Build+Run makes commercial sense." }
      ]
    },
    playbookSection: {
      title: "The playbook is the second step, not the main sale.",
      body: "If you are not ready for an audit yet, the playbook shows where enquiries lose context before sales. The direct path remains the Pipeline Audit."
    },
    beforeAfter: {
      beforeTitle: "Before NovaLure",
      afterTitle: "After the Build+Run system",
      before: ["Unclear form leads", "CPL instead of pipeline visibility", "Follow-up depends on individuals", "CRM without context", "Sales teams sort leads manually"],
      after: ["Source, segment and timing visible", "Prioritised CRM opportunities", "Segmented follow-up", "Handover note before the first call", "Run optimisation by lead quality"]
    },
    process: {
      id: "process",
      title: "First diagnosis. Then build. Then ongoing optimisation.",
      body: "NovaLure does not sell a standard package. Scope follows lead problem, market area, project logic, sales structure and commercial fit.",
      steps: ["Pipeline Audit", "Clarify bottleneck", "Define scope", "Build lead path", "Set CRM handover", "Launch", "Optimise lead quality"]
    },
    team: {
      id: "team",
      title: "Built from a real estate sales perspective, not a campaign perspective.",
      body:
        "NovaLure is led by its team lead. The focus is on a simple problem: many real estate enquiries reach sales without sufficient context. NovaLure builds systems that combine demand, qualification, CRM handover and follow-up, so it becomes clear faster which conversations deserve priority.",
      pillars: [
        "Real estate sales before campaign logic: conversation quality first, media second.",
        "Focus on qualified real estate conversations instead of raw lead count.",
        "CRM context before the first call: source, motivation, timing, budget proximity and next step.",
        "Audit before proposal: scope is defined only after diagnosis.",
        "Existing sales teams get stronger; missing sales structure can be built operationally."
      ],
      founder: "Franz Romih – Team Lead: diagnosis, systems architecture and commercial prioritisation",
      workstyle:
        "NovaLure is led by its team lead. Franz oversees diagnosis, architecture and commercial logic. Implementation areas such as landing page, tracking, CRM setup, campaigns and assets are delivered with specialist partners depending on scope. What matters: responsibility for systems logic, quality and handover remains centrally with the team lead.",
      ireland:
        "NovaLure is a company rooted in Ireland with an international focus, serving clients in Ireland, the UK, the DACH region and beyond. What counts operationally: clear points of contact, sound contractual basis, GDPR-compliant tools, transparent communication and defined deliverables."
    },
    faq: hardFaq.en,
    finalCtaTitle: "Find out where your lead system is wasting sales time."
  }
};

export const pages: Record<Locale, Record<PageKey, PageContent | HomeContent>> = {
  de: {
    home: homeContent.de,
    developers: {
      key: "developers",
      locale: "de",
      template: "audience",
      eyebrow: "Für Bauträger und Projektvertriebe",
      title: "Mehr qualifizierte Käufergespräche für Bauträger und Projektvertriebe.",
      seoTitle: "Qualifizierte Käuferanfragen für Bauträger | NovaLure",
      description:
        "Wenn ein Projekt verkauft werden muss, reichen Klicks nicht. NovaLure baut Projekt-Funnels, Käuferfragen und CRM-Übergaben, damit Ihr Vertrieb schneller mit passenden Käufern spricht.",
      primaryCta: { label: "Pipeline-Audit buchen", target: "contact", anchor: "book-audit" },
      secondaryCta: { label: "Bauträger-Playbook herunterladen", target: "playbooks" },
      heroBullets: [
        "Projektlogik nach Lage, Einheitentyp und Käuferprofil",
        "Fragen zu Budget, Timing und Eigennutzung oder Investment",
        "CRM-Übergabe mit Quelle, Motivation und nächstem Schritt"
      ],
      sections: [
        {
          title: "Warum Bauträger-Leads vor dem Vertrieb Qualität verlieren",
          body: "Projektseiten sammeln oft Namen und Telefonnummern. Ihr Vertrieb braucht aber Käuferkontext: Einheitentyp, Timing, Budgetnähe, Finanzierungsstatus und nächsten Schritt.",
          items: [
            "Projektseite sammelt Anfragen ohne Käuferkontext.",
            "Formular fragt zu wenig.",
            "Vertrieb sieht Quelle, Interesse und Timing nicht.",
            "Leads werden nicht nach Einheitentyp, Budgetnähe oder Kaufphase sortiert.",
            "Kampagnen werden nach CPL bewertet statt nach Gesprächsqualität."
          ]
        },
        {
          title: "Was ein qualifizierter Projektlead enthalten sollte",
          body: "Ein Projektlead sollte Projekt, Lage, gewünschten Einheitentyp, Eigennutzung oder Investment, Timing, Budgetnähe, groben Finanzierungsstatus, Quelle und nächsten Schritt enthalten."
        },
        {
          title: "Was NovaLure für Bauträger konkret baut",
          body: "NovaLure baut Landingpage oder Projekt-Funnel, vorqualifizierende Fragen, Lead-Asset, CRM-Felder, Priorisierung, Handover-Notiz, Follow-up und Reporting."
        },
        {
          title: "Wann ein Pipeline-Audit sinnvoll ist",
          body: "Sinnvoll ist das Audit bei Neubauprojekten, Investmentprojekten, Projektvertrieben und Entwicklern mit Launch- oder Abverkaufsdruck.",
          items: ["Nicht geeignet: kein konkretes Projekt", "Nicht geeignet: kein Budget oder keine Entscheidungskompetenz", "Nicht geeignet: Lead-Garantie-Erwartung", "Nicht geeignet: reine Branding-Kampagne ohne Vertriebsziel"]
        }
      ],
      faq: hardFaq.de
    },
    agents: {
      key: "agents",
      locale: "de",
      template: "audience",
      eyebrow: "Für Maklerteams",
      title: "Mehr qualifizierte Eigentümer- und Käufergespräche für Immobilienmakler.",
      seoTitle: "Qualifizierte Eigentümer- und Käuferanfragen für Makler | NovaLure",
      description:
        "NovaLure baut lokale Lead-Systeme für Makler: Verkäufer-Intent, Käuferreife, CRM-Kontext und Follow-up, damit Ihr Team weniger sortiert und schneller mit echten Chancen spricht.",
      primaryCta: { label: "Pipeline-Audit buchen", target: "contact", anchor: "book-audit" },
      secondaryCta: { label: "Makler-Playbook herunterladen", target: "playbooks" },
      heroBullets: [
        "Ernsthafte Gespräche statt Formularvolumen",
        "Verkäufer- und Käuferabsicht sauber trennen",
        "CRM-Kontext und Follow-up für lokale Pipeline"
      ],
      sections: [
        {
          title: "Warum viele Makler-Leads nicht gesprächsreif sind",
          body: "Makler-Funnels brauchen eine klare Trennung zwischen echter Verkäuferabsicht, Käuferreife und bloßer Recherche.",
          items: [
            "Verkäufer-Leads ohne echte Verkaufsabsicht.",
            "Käufer-Leads ohne Budget- oder Suchprofil.",
            "Website-Anfragen landen ohne Priorität im Postfach.",
            "Portalabhängigkeit bleibt ungebrochen.",
            "Follow-up hängt an Einzelpersonen statt System."
          ]
        },
        {
          title: "Verkäufer-Leads und Käufer-Leads sauber trennen",
          body: "Verkäufer brauchen Felder zu Immobilientyp, Lage, Verkaufszeitpunkt, Motivation und Bewertungserwartung. Käufer brauchen Suchgebiet, Objektart, Budgetnähe, Finanzierung, Timing und Must-haves."
        },
        {
          title: "Was ein qualifizierter Maklerlead enthalten sollte",
          body: "Ein Maklerlead muss Quelle, Segment, Timing, Budgetnähe, Gesprächsnotiz und nächsten Schritt so übergeben, dass Follow-up sofort möglich ist."
        },
        {
          title: "Wann ein Makler-Funnel ein Audit braucht",
          body: "Ein Audit lohnt sich, wenn lokale Spezialisierung, Follow-up-Bereitschaft und Budget für Aufbau plus laufende Optimierung vorhanden sind.",
          items: ["Nicht geeignet: keine lokale Spezialisierung", "Nicht geeignet: keine Bereitschaft zu strukturiertem Follow-up", "Nicht geeignet: reine Leadzahl-Erwartung", "Nicht geeignet: kein Budget für Aufbau und Optimierung"]
        }
      ],
      faq: hardFaq.de
    },
    playbooks: {
      key: "playbooks",
      locale: "de",
      template: "playbooks",
      eyebrow: "Playbook",
      title: "Das Playbook, mit dem Sie prüfen, ob Ihr Lead-System qualifizierte Immobiliengespräche erzeugt oder nur Follow-up-Arbeit.",
      seoTitle: "Immobilien Lead-System Playbook | NovaLure",
      description:
        "Erkennen Sie, wo Immobilien-Leads vor dem Vertrieb Kontext verlieren, welche Handover-Lücken Zeit kosten und ob ein Pipeline-Audit der richtige nächste Schritt ist.",
      primaryCta: { label: labels.de.playbook, target: "playbooks", anchor: "playbook-download" },
      secondaryCta: { label: labels.de.audit, target: "contact", anchor: "book-audit" },
      heroBullets: [
        "Diagnose statt Gratis-Funnelplan",
        "Mini-Scorecard für Audit-Reife",
        "Klarer Übergang zur 30-Minuten-Diagnose"
      ],
      faq: hardFaq.de
    },
    contact: {
      key: "contact",
      locale: "de",
      template: "contact",
      eyebrow: "Pipeline-Audit",
      title: "Pipeline-Audit: Finden Sie heraus, wo Ihr Lead-System Vertriebszeit verliert.",
      seoTitle: "Pipeline-Audit für den Immobilienvertrieb | NovaLure",
      description:
        "In 30 Minuten prüfen wir Anzeige, Landingpage, Formular, Qualifizierung, CRM-Übergabe, Follow-up und Reporting. Danach wissen Sie, ob Aufbau plus laufende Optimierung wirtschaftlich sinnvoll ist.",
      primaryCta: { label: "Pipeline-Audit buchen", target: "contact", anchor: "book-audit" },
      secondaryCta: { label: labels.de.playbook, target: "playbooks" },
      heroBullets: ["Lead-System einschätzen", "Schwachstellen identifizieren", "Nächsten Schritt klären"],
      faq: hardFaq.de
    },
    handover: {
      key: "handover",
      locale: "de",
      template: "handover",
      eyebrow: "CRM-Handover",
      title: "CRM-Übergabe für qualifizierte Immobilien-Leads",
      seoTitle: "CRM-Handover für Immobilien-Leads | NovaLure",
      description:
        "Eine Anfrage ist erst dann vertriebsfähig, wenn Ihr Team Quelle, Motivation, Timing, Budgetnähe und nächsten Schritt sieht.",
      primaryCta: { label: labels.de.handover, target: "home", anchor: "proof" },
      secondaryCta: { label: labels.de.audit, target: "contact", anchor: "book-audit" },
      heroBullets: ["Quelle", "Segment", "Timing", "Budgetnähe", "Nächster Schritt"],
      faq: hardFaq.de.slice(0, 8)
    },
    playbookThanks: thankYou("de", "playbookThanks"),
    auditThanks: thankYou("de", "auditThanks"),
    imprint: legal("de", "imprint"),
    privacy: legal("de", "privacy"),
    cookies: legal("de", "cookies")
  },
  en: {
    home: homeContent.en,
    developers: {
      key: "developers",
      locale: "en",
      template: "audience",
      eyebrow: "For developers and project sales teams",
      title: "More qualified buyer conversations for developers and project sales teams.",
      seoTitle: "Qualified Buyer Enquiries for Developers | NovaLure",
      description:
        "When a project needs to sell, clicks are not enough. NovaLure builds project funnels, buyer questions and CRM handovers so sales can speak faster with the right buyers.",
      primaryCta: { label: "Book a Pipeline Audit", target: "contact", anchor: "book-audit" },
      secondaryCta: { label: "Download developer playbook", target: "playbooks" },
      heroBullets: [
        "Project logic by location, unit type and buyer profile",
        "CRM-ready handover with source, intent and call context",
        "CRM handover with source, motivation and next step"
      ],
      sections: [
        {
          title: "Why developer leads lose quality before sales",
          body: "Project pages often collect names and phone numbers. Sales needs buyer context: unit type, timing, budget proximity, financing status and next step.",
          items: ["Project pages collect enquiries without buyer context.", "Forms ask too little.", "Sales cannot see source, interest and timing.", "Leads are not sorted by unit type, budget proximity or purchase phase.", "Campaigns are judged by CPL instead of conversation quality."]
        },
        {
          title: "What a qualified project lead should contain",
          body: "A project lead should include project, location, unit type, own-use or investment intent, timing, budget proximity, rough financing status, source and next step."
        },
        {
          title: "What NovaLure builds for developers",
          body: "NovaLure builds landing page or project funnel, pre-qualification questions, lead asset, CRM fields, prioritisation, handover note, follow-up and reporting."
        },
        {
          title: "When a Pipeline Audit makes sense",
          body: "The audit is suitable for new-build projects, investment projects, project sales teams and launches with sales pressure.",
          items: ["Not a fit: no concrete project", "Not a fit: no budget or decision authority", "Not a fit: lead-guarantee expectation", "Not a fit: pure branding campaign without a sales goal"]
        }
      ],
      faq: hardFaq.en
    },
    agents: {
      key: "agents",
      locale: "en",
      template: "audience",
      eyebrow: "For real estate teams",
      title: "More qualified seller and buyer conversations for real estate agents.",
      seoTitle: "Qualified Seller and Buyer Enquiries for Agents | NovaLure",
      description:
        "NovaLure builds local lead systems for agents: seller intent, buyer readiness, CRM context and follow-up so your team sorts less and speaks faster with real opportunities.",
      primaryCta: { label: "Book a Pipeline Audit", target: "contact", anchor: "book-audit" },
      secondaryCta: { label: "Download agent playbook", target: "playbooks" },
      heroBullets: ["Serious conversations, not form volume", "Separate seller and buyer intent", "CRM context and follow-up for local pipeline"],
      sections: [
        {
          title: "Why many agent leads are not conversation-ready",
          body: "Agent funnels need a clear separation between real seller intent, buyer readiness and casual research.",
          items: ["Seller leads without real selling intent.", "Buyer leads without budget or search profile.", "Website enquiries land in the inbox without priority.", "Portal dependency stays untouched.", "Follow-up depends on individuals instead of a system."]
        },
        {
          title: "Separate seller and buyer leads cleanly",
          body: "Seller leads need property type, location, selling timeline, motivation and valuation expectation. Buyer leads need search area, property type, budget proximity, financing, timing and must-haves."
        },
        {
          title: "What a qualified agent lead should contain",
          body: "An agent lead must hand over source, segment, timing, budget proximity, call note and next step so follow-up can start immediately."
        },
        {
          title: "When an agent funnel needs an audit",
          body: "An audit makes sense when local specialisation, follow-up discipline and budget for build plus ongoing optimisation exist.",
          items: ["Not a fit: no local specialisation", "Not a fit: no willingness for structured follow-up", "Not a fit: raw lead-volume expectation", "Not a fit: no budget for build and optimisation"]
        }
      ],
      faq: hardFaq.en
    },
    playbooks: {
      key: "playbooks",
      locale: "en",
      template: "playbooks",
      eyebrow: "Playbook",
      title: "The playbook for checking whether your lead system creates qualified real estate conversations or only follow-up work.",
      seoTitle: "Real Estate Lead System Playbook | NovaLure",
      description:
        "See where real estate leads lose context before sales, which handover gaps cost time and whether a Pipeline Audit is the right next step.",
      primaryCta: { label: labels.en.playbook, target: "playbooks", anchor: "playbook-download" },
      secondaryCta: { label: labels.en.audit, target: "contact", anchor: "book-audit" },
      heroBullets: ["Diagnosis instead of a free funnel plan", "Mini scorecard for audit readiness", "Clear path to a 30-minute diagnosis"],
      faq: hardFaq.en
    },
    contact: {
      key: "contact",
      locale: "en",
      template: "contact",
      eyebrow: "Pipeline Audit",
      title: "Pipeline Audit: find out where your lead system wastes sales time.",
      seoTitle: "Pipeline Audit for Real Estate Sales | NovaLure",
      description:
        "In 30 minutes, we review ad, landing page, form, qualification, CRM handover, follow-up and reporting. After that, you know whether build plus ongoing optimisation makes commercial sense.",
      primaryCta: { label: "Book a Pipeline Audit", target: "contact", anchor: "book-audit" },
      secondaryCta: { label: labels.en.playbook, target: "playbooks" },
      heroBullets: ["Assess the lead system", "Identify weak points", "Clarify the next step"],
      faq: hardFaq.en
    },
    handover: {
      key: "handover",
      locale: "en",
      template: "handover",
      eyebrow: "CRM handover",
      title: "CRM handover for qualified real estate leads",
      seoTitle: "CRM Handover for Real Estate Leads | NovaLure",
      description:
        "An enquiry is only sales-ready when your team can see source, motivation, timing, budget proximity and next step.",
      primaryCta: { label: labels.en.handover, target: "home", anchor: "proof" },
      secondaryCta: { label: labels.en.audit, target: "contact", anchor: "book-audit" },
      heroBullets: ["Source", "Segment", "Timing", "Budget proximity", "Next step"],
      faq: hardFaq.en.slice(0, 8)
    },
    playbookThanks: thankYou("en", "playbookThanks"),
    auditThanks: thankYou("en", "auditThanks"),
    imprint: legal("en", "imprint"),
    privacy: legal("en", "privacy"),
    cookies: legal("en", "cookies")
  }
};

function thankYou(locale: Locale, key: "playbookThanks" | "auditThanks"): PageContent {
  const isPlaybook = key === "playbookThanks";
  const de = locale === "de";

  return {
    key,
    locale,
    template: "thank-you",
    eyebrow: isPlaybook ? (de ? "Playbook" : "Playbook") : (de ? "Audit-Anfrage" : "Audit request"),
    title: isPlaybook
      ? de ? "Ihr Playbook ist unterwegs." : "Your playbook is on its way."
      : de ? "Ihre Audit-Anfrage ist eingegangen." : "Your audit request has been received.",
    seoTitle: isPlaybook
      ? de ? "Playbook angefordert | NovaLure" : "Playbook requested | NovaLure"
      : de ? "Audit-Anfrage eingegangen | NovaLure" : "Audit request received | NovaLure",
    description: isPlaybook
      ? de
        ? "Lesen Sie zuerst die Abschnitte zu CRM-Handover und Intent-Filter. Wenn Sie ein konkretes Projekt, Marktgebiet oder Leadproblem haben, können Sie direkt ein Pipeline-Audit anfragen."
        : "Read the CRM handover and intent-filter sections first. If you have a concrete project, market area or lead-quality problem, you can request a Pipeline Audit."
      : de
        ? "Wir prüfen Ihre Angaben. Das Audit ist eine Diagnose, kein kostenloses Gutachten. Bitte bereiten Sie Projekt, Leadquellen, CRM-Prozess und größten Vertriebsengpass vor."
        : "We will review your details. The audit is a diagnosis, not a free consulting report. Please prepare your project, lead sources, CRM process and biggest sales bottleneck.",
    primaryCta: isPlaybook
      ? { label: de ? "Pipeline-Audit anfragen" : "Request a Pipeline Audit", target: "contact", anchor: "book-audit" }
      : { label: de ? "Beispiel-Handover ansehen" : "View example handover", target: "home", anchor: "proof" },
    secondaryCta: isPlaybook
      ? { label: de ? "Beispiel-Handover ansehen" : "View example handover", target: "home", anchor: "proof" }
      : { label: de ? "Playbook herunterladen" : "Download playbook", target: "playbooks" },
    heroBullets: isPlaybook
      ? de
        ? ["Wo verliert Ihr Vertrieb aktuell Zeit?", "Welche Leadquellen liefern zu wenig Kontext?", "Ist Budget für Build+Run grundsätzlich vorhanden?"]
        : ["Where does sales currently lose time?", "Which lead sources work but lack context?", "Is budget for Build+Run basically available?"]
      : de
        ? ["aktuelles Projekt / Marktgebiet", "bestehende Leadquellen", "CRM oder Leadmanagement", "größter Engpass", "Budgetfähigkeit", "Entscheiderstatus"]
        : ["current project / market area", "existing lead sources", "CRM or lead management", "biggest bottleneck", "budget readiness", "decision status"],
    sections: isPlaybook
      ? [
          {
            title: de ? "3 Fragen vor dem Audit" : "3 questions before the audit",
            body: de ? "Wenn diese Fragen konkret beantwortbar sind, ist ein Pipeline-Audit sinnvoller als weitere allgemeine Marketingideen." : "If these questions can be answered concretely, a Pipeline Audit is more useful than more general marketing ideas.",
            items: de
              ? ["Wo verliert Ihr Vertrieb aktuell Zeit?", "Welche Leadquellen funktionieren, aber liefern zu wenig Kontext?", "Ist Budget für Build+Run grundsätzlich vorhanden?"]
              : ["Where does your sales team currently lose time?", "Which lead sources work but provide too little context?", "Is budget for Build+Run basically available?"]
          }
        ]
      : [
          {
            title: de ? "Bitte vorbereiten" : "Please prepare",
            body: de ? "So wird aus der Anfrage eine klare Diagnose statt eines allgemeinen Erstgesprächs." : "This turns the request into a clear diagnosis instead of a generic first call.",
            items: de
              ? ["aktuelles Projekt / Marktgebiet", "bestehende Leadquellen", "CRM oder Leadmanagement", "aktuelle Landingpages / Kampagnen", "größter Engpass", "Budgetfähigkeit", "Entscheiderstatus"]
              : ["current project / market area", "existing lead sources", "CRM or lead management", "current landing pages / campaigns", "biggest bottleneck", "budget readiness", "decision status"]
          }
        ]
  };
}

function imprintSections(locale: Locale): PageSection[] {
  const de = locale === "de";

  if (de) {
    return [
      {
        title: "1. Anbieter und Website-Betreiber",
        body: "Website-Betreiber, Diensteanbieter und Verantwortlicher für die Unternehmensangaben dieser Website ist NovaLure CLG, eine company limited by guarantee nach irischem Recht.",
        items: [
          "Name und Rechtsform: NovaLure CLG.",
          "Eingetragen in Irland beim Companies Registration Office (CRO).",
          "Company registration number: 796735.",
          "Irische Umsatzsteuer-Identifikationsnummer (VAT): IE451718HH.",
          "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland.",
          "E-Mail: hello@novalure.eu.",
          "Telefon: +353 (0)89 269 5248.",
          "Website: www.novalure.eu."
        ]
      },
      {
        title: "2. Kontakt",
        body: "Für geschäftliche Anfragen, rechtliche Hinweise zur Website und sonstige Kommunikation erreichen Sie NovaLure über die folgenden Kontaktwege.",
        items: [
          "E-Mail: hello@novalure.eu.",
          "Telefon: +353 (0)89 269 5248.",
          "Postanschrift: NovaLure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland."
        ]
      },
      {
        title: "3. Registerangaben nach irischem Gesellschaftsrecht",
        body: "NovaLure CLG ist eine in Irland registrierte Gesellschaft. Nach irischem Gesellschaftsrecht müssen Name, Rechtsform, Registrierungsort, Registrierungsnummer und Registered Office auf einer leicht zugänglichen Website-Seite angegeben werden.",
        items: [
          "Register: Companies Registration Office, Ireland.",
          "Place of registration: Ireland.",
          "Registration number: 796735.",
          "Legal form: company limited by guarantee (CLG).",
          "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland."
        ]
      },
      {
        title: "4. Tätigkeit von NovaLure: PropTech Sales System",
        body: "NovaLure baut PropTech Sales Systeme und CRM-fähige Lead-Systeme für den Immobilienvertrieb. Der Fokus liegt auf Funnel-Architektur, Lead-Qualifizierung, CRM-Handover, Follow-up-Struktur, Tracking, Reporting und laufender Optimierung.",
        items: [
          "NovaLure arbeitet insbesondere mit Bauträgern, Immobilienentwicklern, Projektvertrieben, Maklerteams und weiteren B2B-Ansprechpartnern im Immobilienvertrieb.",
          "NovaLure ist kein klassischer Online-Shop und kein Immobilienportal, sondern ein B2B-Anbieter für Lead-Systeme, CRM-Handover und Pipeline-Sichtbarkeit.",
          "Die Website richtet sich primär an geschäftliche Nutzer und Entscheidungsträger, nicht an Verbraucherangebote im klassischen Online-Shop-Sinn.",
          "Konkrete Leistungen, Umfang, Preise, Laufzeiten und Verantwortlichkeiten werden individuell im Angebot oder Vertrag geregelt."
        ]
      },
      {
        title: "5. Keine regulierte Makler-, Finanz- oder Rechtsdienstleistung",
        body: "NovaLure bietet über diese Website keine regulierte Immobilienvermittlung, Finanzberatung, Investmentberatung, Zahlungsdienstleistung, Treuhanddienstleistung, Rechtsberatung oder Steuerberatung an.",
        items: [
          "NovaLure hält keine Kundengelder, Investorengelder oder Treuhandgelder.",
          "NovaLure vermittelt keine Immobilienkäufe, keine Finanzprodukte und keine Investments.",
          "Inhalte auf dieser Website sind allgemeine geschäftliche Informationen und ersetzen keine rechtliche, steuerliche, finanzielle oder regulatorische Beratung."
        ]
      },
      {
        title: "6. Aufsicht, Berufsregeln und Genehmigungen",
        body: "Die auf dieser Website dargestellten Leistungen unterliegen nach der aktuellen Ausrichtung von NovaLure keiner besonderen berufsrechtlichen Zulassung, keinem regulierten Beruf und keiner branchenspezifischen Aufsichtsbehörde für Makler-, Finanz- oder Rechtsdienstleistungen.",
        items: [
          "NovaLure ist nicht als regulierter Immobilienmakler, Finanzdienstleister, Investmentdienstleister, Zahlungsdienstleister, Rechtsanwalt oder Steuerberater tätig.",
          "Falls ein zukünftiger Leistungsbereich eine Genehmigung, Aufsicht oder besondere Berufsregeln erfordert, werden die entsprechenden Angaben ergänzt, bevor dieser Leistungsbereich angeboten wird."
        ]
      },
      {
        title: "7. Umsatzsteuer und Preise",
        body: "Auf dieser Website werden derzeit keine verbindlichen öffentlichen Preise, Warenkorbpreise oder Online-Bestellpreise angeboten. Leistungen werden nach Diagnose, Umfang und Vertrag individuell angeboten.",
        items: [
          "Irische Umsatzsteuer-Identifikationsnummer (VAT): IE451718HH.",
          "Soweit zukünftig öffentliche Preise dargestellt werden, werden diese klar und eindeutig angegeben, einschließlich anwendbarer Steuern oder sonstiger Kosten, soweit rechtlich erforderlich.",
          "Individuelle Angebote können zusätzliche Steuer-, Währungs-, Laufzeit- und Leistungsbedingungen enthalten."
        ]
      },
      {
        title: "8. Kommerzielle Kommunikation und Direktmarketing",
        body: "Kommerzielle Kommunikation von NovaLure soll als solche erkennbar sein. Nutzer können Marketing-Kommunikation über die vorgesehenen Consent-, Abmelde- oder Kontaktmöglichkeiten verwalten.",
        items: [
          "Bei Formularen mit freiwilliger Marketing-Einwilligung wird der Marketingwunsch getrennt vom Pflichtprozess abgefragt.",
          "Marketing-E-Mails sollen eine einfache Möglichkeit zur Abmeldung enthalten.",
          "Details zur Verarbeitung personenbezogener Daten und zu Cookie-/Tracking-Technologien stehen in den Datenschutzinformationen und der Cookie-Richtlinie."
        ]
      },
      {
        title: "9. Vertragsabschluss über elektronische Kommunikation",
        body: "Die Website selbst ist derzeit kein automatisierter Online-Shop. Anfragen über Formulare, Playbook-Downloads oder Terminbuchungen führen nicht automatisch zu einem Vertrag über kostenpflichtige Leistungen.",
        items: [
          "Ein Vertrag über NovaLure-Leistungen kommt erst zustande, wenn ein individuelles Angebot angenommen oder ein gesonderter Vertrag geschlossen wird.",
          "Vor einem kostenpflichtigen Mandat werden Leistungsumfang, Verantwortlichkeiten, Vergütung, Laufzeit und weitere Bedingungen individuell geklärt.",
          "Formular- und Terminbestätigungen dienen der Anfragebearbeitung und Vorbereitung, nicht automatisch dem Vertragsschluss."
        ]
      },
      {
        title: "10. Verantwortlichkeit für Website-Inhalte",
        body: "Verantwortlich für eigene Inhalte dieser Website ist NovaLure CLG. Die Inhalte werden mit Sorgfalt erstellt, dienen aber der allgemeinen Information über NovaLure und seine Leistungen.",
        items: [
          "NovaLure übernimmt keine Garantie für bestimmte Leadzahlen, Umsätze, Abschlüsse, Provisionen oder wirtschaftliche Ergebnisse.",
          "Fallbeispiele, Demo-Systeme, Handover-Beispiele und Playbooks können illustrative oder diagnostische Inhalte enthalten und sind nicht als Zusage eines konkreten Ergebnisses zu verstehen.",
          "NovaLure kann Website-Inhalte jederzeit ändern, ergänzen oder entfernen."
        ]
      },
      {
        title: "11. Externe Links und Drittanbieter",
        body: "Diese Website kann auf externe Websites, Tools, Kalender, Formulare, Plattformen oder Inhalte Dritter verlinken oder diese einbinden.",
        items: [
          "Für Inhalte, Verfügbarkeit, Sicherheit und Datenschutz externer Anbieter ist grundsätzlich der jeweilige Anbieter verantwortlich.",
          "Externe Links werden bei Einbindung geprüft, können sich aber nachträglich ändern.",
          "Wenn Sie externe Dienste nutzen, können zusätzliche Bedingungen und Datenschutzinformationen des jeweiligen Anbieters gelten."
        ]
      },
      {
        title: "12. Urheberrechte, Marken und Nutzung der Inhalte",
        body: "Texte, Grafiken, Layouts, Playbooks, Demo-Handover, Funnel-Strukturen, Marken, Logos und sonstige Inhalte dieser Website sind urheberrechtlich, markenrechtlich oder durch sonstige Rechte geschützt, soweit sie nicht ausdrücklich als fremde Inhalte gekennzeichnet sind.",
        items: [
          "Eine Nutzung, Vervielfältigung, Bearbeitung oder Weitergabe außerhalb gesetzlich erlaubter Fälle erfordert vorherige Zustimmung von NovaLure oder dem jeweiligen Rechteinhaber.",
          "Downloads und Playbooks dürfen nur für den vorgesehenen eigenen Informationszweck verwendet werden.",
          "Marken, Logos und Namen Dritter bleiben Eigentum der jeweiligen Rechteinhaber."
        ]
      },
      {
        title: "13. Datenschutz, Cookies und rechtliche Dokumente",
        body: "Datenschutz, Cookies und Tracking werden in gesonderten Dokumenten beschrieben. Diese sind über den Footer der Website erreichbar.",
        items: [
          "Datenschutzinformationen: /de/rechtliches/datenschutz.",
          "Cookie-Richtlinie: /de/rechtliches/cookies.",
          "Englischer Imprint: /en/legal/imprint."
        ]
      },
      {
        title: "14. Anwendbares Recht und Gerichtsstand",
        body: "Soweit rechtlich zulässig, unterliegen Nutzung der Website, geschäftliche Kommunikation und Vertragsbeziehungen mit NovaLure irischem Recht. Zwingende gesetzliche Rechte, insbesondere zwingende Verbraucher- oder Datenschutzrechte, bleiben unberührt.",
        items: [
          "Für B2B-Verträge kann ein individueller Gerichtsstand oder eine Streitbeilegungsregelung im jeweiligen Vertrag vereinbart werden.",
          "Für Datenschutzanliegen gelten die in den Datenschutzinformationen beschriebenen Kontakt- und Beschwerdemöglichkeiten."
        ]
      },
      {
        title: "15. Stand dieses Impressums",
        body: "Stand: Mai 2026. Dieses Impressum kann aktualisiert werden, wenn sich rechtliche, technische oder geschäftliche Angaben ändern."
      }
    ];
  }

  return [
    {
      title: "1. Provider and website operator",
      body: "The website operator, service provider and company-information owner for this website is NovaLure CLG, a company limited by guarantee incorporated under the laws of Ireland.",
      items: [
        "Name and legal form: NovaLure CLG.",
        "Registered in Ireland with the Companies Registration Office (CRO).",
        "Company registration number: 796735.",
        "Irish VAT number: IE451718HH.",
        "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland.",
        "Email: hello@novalure.eu.",
        "Phone: +353 (0)89 269 5248.",
        "Website: www.novalure.eu."
      ]
    },
    {
      title: "2. Contact",
      body: "For business enquiries, legal website notices and general communication, NovaLure can be contacted through the following channels.",
      items: [
        "Email: hello@novalure.eu.",
        "Phone: +353 (0)89 269 5248.",
        "Postal address: NovaLure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland."
      ]
    },
    {
      title: "3. Irish company disclosures",
      body: "NovaLure CLG is an Irish-registered company. Irish company law requires the company name, legal form, place of registration, registration number and registered office to be displayed in a prominent and easily accessible place on the website.",
      items: [
        "Register: Companies Registration Office, Ireland.",
        "Place of registration: Ireland.",
        "Registration number: 796735.",
        "Legal form: company limited by guarantee (CLG).",
        "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland."
      ]
    },
    {
      title: "4. Business activity: PropTech Sales System",
      body: "NovaLure builds PropTech Sales Systems and CRM-ready lead systems for real estate sales. The focus is funnel architecture, lead qualification, CRM handover, follow-up structure, tracking, reporting and ongoing optimisation.",
      items: [
        "NovaLure works in particular with property developers, real estate developers, project sales teams, broker teams and other B2B contacts in real estate sales.",
        "NovaLure is not a conventional online shop or property portal; it is a B2B provider for lead systems, CRM handover and pipeline visibility.",
        "The website is primarily directed at business users and decision-makers, not at consumer offers in the classic online-shop sense.",
        "Concrete services, scope, pricing, term and responsibilities are agreed individually in the relevant proposal or contract."
      ]
    },
    {
      title: "5. No regulated brokerage, finance or legal service",
      body: "Through this website, NovaLure does not provide regulated real estate brokerage, financial advice, investment advice, payment services, escrow services, legal advice or tax advice.",
      items: [
        "NovaLure does not hold client funds, investor funds or escrow funds.",
        "NovaLure does not broker property purchases, financial products or investments.",
        "Content on this website is general business information and does not replace legal, tax, financial or regulatory advice."
      ]
    },
    {
      title: "6. Supervision, professional rules and authorisations",
      body: "Based on NovaLure's current service scope, the services presented on this website are not subject to a specific professional authorisation scheme, a regulated profession or a sector-specific supervisory authority for brokerage, financial or legal services.",
      items: [
        "NovaLure does not operate as a regulated real estate agent, financial service provider, investment service provider, payment service provider, solicitor or tax adviser.",
        "If a future service area requires authorisation, supervision or specific professional rules, the relevant information will be added before that service area is offered."
      ]
    },
    {
      title: "7. VAT and pricing",
      body: "This website currently does not offer binding public prices, shopping-cart prices or online order prices. Services are proposed individually after diagnosis, scope and contract review.",
      items: [
        "Irish VAT number: IE451718HH.",
        "If public prices are shown in the future, they will be stated clearly and unambiguously, including applicable taxes or other costs where legally required.",
        "Individual proposals may include additional tax, currency, term and scope conditions."
      ]
    },
    {
      title: "8. Commercial communication and direct marketing",
      body: "Commercial communication from NovaLure should be identifiable as such. Users can manage marketing communication through the relevant consent, unsubscribe or contact options.",
      items: [
        "Where forms include voluntary marketing consent, the marketing request is separated from the required processing step.",
        "Marketing emails should include an easy way to unsubscribe.",
        "Details on personal-data processing and cookie or tracking technologies are set out in the Privacy Policy and Cookie Policy."
      ]
    },
    {
      title: "9. Contracts by electronic communication",
      body: "The website itself is currently not an automated online shop. Form enquiries, playbook downloads or meeting bookings do not automatically create a contract for paid services.",
      items: [
        "A contract for NovaLure services is formed only when an individual proposal is accepted or a separate contract is concluded.",
        "Before a paid mandate, scope of work, responsibilities, fees, term and further conditions are clarified individually.",
        "Form and meeting confirmations are used for enquiry handling and preparation, not automatically for contract formation."
      ]
    },
    {
      title: "10. Responsibility for website content",
      body: "NovaLure CLG is responsible for its own website content. The content is prepared with care but is provided as general information about NovaLure and its services.",
      items: [
        "NovaLure does not guarantee specific lead volumes, revenues, sales, commissions or economic outcomes.",
        "Case examples, demo systems, handover examples and playbooks may contain illustrative or diagnostic content and are not a promise of a specific result.",
        "NovaLure may change, supplement or remove website content at any time."
      ]
    },
    {
      title: "11. External links and third-party services",
      body: "This website may link to or embed external websites, tools, calendars, forms, platforms or third-party content.",
      items: [
        "The relevant provider is generally responsible for the content, availability, security and privacy practices of external services.",
        "External links are reviewed when added, but third-party content can change afterwards.",
        "If you use external services, additional terms and privacy information from the relevant provider may apply."
      ]
    },
    {
      title: "12. Copyright, trademarks and use of content",
      body: "Texts, graphics, layouts, playbooks, demo handovers, funnel structures, trademarks, logos and other website content are protected by copyright, trademark or other rights unless expressly identified as third-party content.",
      items: [
        "Use, reproduction, adaptation or distribution outside legally permitted cases requires prior permission from NovaLure or the relevant rights holder.",
        "Downloads and playbooks may be used only for the intended internal information purpose.",
        "Third-party trademarks, logos and names remain the property of their respective rights holders."
      ]
    },
    {
      title: "13. Privacy, cookies and legal documents",
      body: "Privacy, cookies and tracking are described in separate documents available through the website footer.",
      items: [
        "Privacy Policy: /en/legal/privacy.",
        "Cookie Policy: /en/legal/cookies.",
        "German Impressum: /de/rechtliches/impressum."
      ]
    },
    {
      title: "14. Governing law and jurisdiction",
      body: "To the extent legally permitted, use of the website, business communication and contractual relationships with NovaLure are governed by Irish law. Mandatory statutory rights, including mandatory consumer or data protection rights, remain unaffected.",
      items: [
        "For B2B contracts, an individual jurisdiction or dispute-resolution clause may be agreed in the relevant contract.",
        "For privacy matters, the contact and complaint options described in the Privacy Policy apply."
      ]
    },
    {
      title: "15. Status of this Imprint",
      body: "Effective date: May 2026. This Imprint may be updated if legal, technical or business details change."
    }
  ];
}

function privacySections(locale: Locale): PageSection[] {
  const de = locale === "de";

  if (de) {
    return [
      {
        title: "1. Stand und Geltungsbereich",
        body: "Stand: Mai 2026. Diese Datenschutzinformationen erklären, wie NovaLure CLG personenbezogene Daten verarbeitet, wenn Sie novalure.eu besuchen, ein Playbook anfordern, ein Formular absenden, einen Pipeline-Audit anfragen, einen Termin buchen oder mit uns per E-Mail, Telefon oder anderen geschäftlichen Kanälen kommunizieren.",
        items: [
          "Diese Informationen gelten für Website-Besucher, Interessenten, Kunden, Geschäftspartner und Ansprechpartner in Unternehmen.",
          "Soweit wir für Kunden eigene Lead-Systeme, CRM-Prozesse oder Kampagnen umsetzen, können zusätzlich projektbezogene Datenschutzvereinbarungen, Auftragsverarbeitungsverträge oder gemeinsame Verantwortlichkeitsregelungen gelten."
        ]
      },
      {
        title: "2. Verantwortlicher",
        body: "Verantwortlicher im Sinne der Datenschutz-Grundverordnung ist NovaLure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland, Registration number: 796735, Irish VAT number: IE451718HH. Kontakt für Datenschutzanfragen: hello@novalure.eu.",
        items: [
          "NovaLure CLG ist in Irland ansässig. Maßgeblich sind insbesondere die DSGVO, der Irish Data Protection Act 2018 und die irischen ePrivacy-Regeln.",
          "Website: www.novalure.eu.",
          "Ein Datenschutzbeauftragter ist derzeit nicht bestellt. Datenschutzanfragen können direkt an hello@novalure.eu gesendet werden."
        ]
      },
      {
        title: "3. Welche Daten wir verarbeiten",
        body: "Je nach Nutzung der Website und Kommunikation verarbeiten wir unterschiedliche Kategorien personenbezogener Daten. Wir erheben nur Daten, die für den jeweiligen Zweck erforderlich oder freiwillig von Ihnen angegeben sind.",
        items: [
          "Kontakt- und Identifikationsdaten: Name, E-Mail-Adresse, Telefonnummer, Unternehmen, Rolle oder Position.",
          "Geschäfts- und Projektinformationen: Website, Marktgebiet, Zielgruppe, Projektart, Leadproblem, CRM-Reife, Leadvolumen, Budgetbereitschaft, Entscheidungsstatus und Angaben zu bestehenden Assets.",
          "Formular- und Playbookdaten: ausgewähltes Playbook, Einwilligungsstatus, Marketing-Einwilligung, Zeitstempel, Sprache, Seiten-URL, UTM-Parameter und technische Formularschutzsignale.",
          "Kommunikationsdaten: Inhalte aus Anfragen, E-Mails, Terminbuchungen, Gesprächsvorbereitung, Follow-up und Support.",
          "Technische Daten: IP-Adresse, Datum und Uhrzeit, Browser, Gerät, Betriebssystem, Referrer, aufgerufene Seiten, Cookie- und Consent-Informationen sowie Sicherheits- und Server-Logdaten.",
          "Analytics- und Marketingdaten: Seitenaufrufe, Klicks, Kampagnenquellen, Conversion-Ereignisse und Cookie-Kennungen nur, soweit die jeweilige Technologie aktiviert ist und eine erforderliche Einwilligung vorliegt."
        ]
      },
      {
        title: "4. Zwecke der Verarbeitung",
        body: "Wir verarbeiten personenbezogene Daten für klar bestimmte geschäftliche Zwecke rund um unsere Website, Lead-Systeme und Kundenkommunikation.",
        items: [
          "Betrieb, Sicherheit, Fehleranalyse und technische Bereitstellung der Website.",
          "Bearbeitung von Kontakt-, Playbook-, Termin- und Pipeline-Audit-Anfragen.",
          "Zustellung angeforderter Inhalte, insbesondere Playbooks, Bestätigungs-E-Mails und vorbereitende Informationen.",
          "Vorbereitung, Durchführung und Nachbereitung von Beratung, Angeboten, Vertragsverhandlungen und Kundenmandaten.",
          "Pflege von CRM-Daten, Lead-Qualifizierung, Follow-up, Segmentierung und Priorisierung von geschäftlichen Anfragen.",
          "Messung von Website-Performance, Kampagnenerfolg und Funnel-Ereignissen, soweit dies einwilligungsbasiert oder rechtlich zulässig erfolgt.",
          "Erfüllung gesetzlicher, steuerlicher, buchhalterischer und regulatorischer Pflichten.",
          "Geltendmachung, Ausübung oder Verteidigung rechtlicher Ansprüche."
        ]
      },
      {
        title: "5. Rechtsgrundlagen",
        body: "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 DSGVO. Welche Rechtsgrundlage gilt, hängt vom jeweiligen Zweck ab.",
        items: [
          "Art. 6 Abs. 1 lit. b DSGVO: vorvertragliche Maßnahmen und Vertragserfüllung, wenn Sie ein Angebot, ein Audit, einen Termin, ein Playbook oder eine Leistung anfragen.",
          "Art. 6 Abs. 1 lit. f DSGVO: berechtigte Interessen an B2B-Kommunikation, Website-Sicherheit, Betrugs- und Spamvermeidung, CRM-Verwaltung, interner Organisation, Direktkontakt zu geschäftlichen Ansprechpartnern und Rechtsverteidigung.",
          "Art. 6 Abs. 1 lit. a DSGVO: Einwilligung für optionale Cookies, Analytics, Marketing-Technologien, externe Medien, freiwillige Marketing-Kommunikation und vergleichbare zustimmungspflichtige Vorgänge.",
          "Art. 6 Abs. 1 lit. c DSGVO: rechtliche Pflichten, insbesondere steuerliche, buchhalterische, handelsrechtliche und aufsichtsrechtliche Aufbewahrungs- oder Mitwirkungspflichten."
        ]
      },
      {
        title: "6. Website, Hosting und Sicherheit",
        body: "Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, um die Seite auszuliefern, Angriffe zu erkennen, Fehler zu analysieren und die Stabilität der Website sicherzustellen.",
        items: [
          "Die Website kann über Vercel und vergleichbare Infrastruktur- oder Hosting-Dienstleister bereitgestellt werden.",
          "Als Datenbankanbieter kann Neon mit PostgreSQL eingesetzt werden. Der für NovaLure vorgesehene Serverstandort ist Frankfurt am Main, Deutschland.",
          "Server-Logs können IP-Adresse, Zeitstempel, angeforderte URL, Referrer, User-Agent und technische Statusdaten enthalten.",
          "Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren, performanten und zuverlässigen Website-Betrieb."
        ]
      },
      {
        title: "7. Formulare, Playbooks und Pipeline-Audit",
        body: "Wenn Sie ein Formular absenden, verarbeiten wir die angegebenen Daten, um Ihre Anfrage zu prüfen, das gewünschte Playbook bereitzustellen, eine Audit-Anfrage vorzubereiten oder mit Ihnen geschäftlich Kontakt aufzunehmen.",
        items: [
          "Bei Playbook-Anfragen verarbeiten wir Name, E-Mail, Unternehmen, Telefonnummer, ausgewähltes Playbook, Sprache, Seiten-URL, UTM-Parameter, erforderliche Verarbeitungseinwilligung, optionale Marketing-Einwilligung, Consent-Zeitstempel und die jeweils gültige Datenschutzversion.",
          "Bei Pipeline-Audit- und Kontaktanfragen verarbeiten wir die Formularangaben zu Unternehmen, Website, Rolle, Projekt oder Marktgebiet, Leadproblem, CRM, Leadvolumen, Sales-Engpass, Assets, Timing, Budgetbereitschaft, Entscheidungsstatus und Nachricht.",
          "Soweit die Website- oder Formularlogik eine Datenbank nutzt, können entsprechende Anfragen, Einwilligungs- und Systemdaten in einer Neon PostgreSQL-Datenbank am Serverstandort Frankfurt verarbeitet werden.",
          "Für Formularschutz kann ein verstecktes Feld oder eine vergleichbare Spam-Prüfung genutzt werden.",
          "Pflichtfelder sind erforderlich, damit wir die Anfrage sinnvoll bearbeiten können. Freiwillige Angaben helfen bei Einordnung und Vorbereitung."
        ]
      },
      {
        title: "8. E-Mail, CRM und Terminbuchung",
        body: "Für die Bearbeitung von Anfragen, Playbook-Versand, Terminvorbereitung und Kundenkommunikation können wir professionelle Dienstleister und interne Systeme einsetzen.",
        items: [
          "Resend kann für transaktionale E-Mails wie Playbook-Zustellung, Eingangsbestätigungen und interne Benachrichtigungen eingesetzt werden.",
          "HubSpot kann für Formulare, CRM, Kontaktverwaltung, Meeting-Scheduler, Follow-up und Marketing-Einwilligungsverwaltung eingesetzt werden.",
          "Microsoft 365 und Microsoft Teams können für E-Mail, Kalender, interne Zusammenarbeit, Gesprächsvorbereitung und Kundentermine eingesetzt werden.",
          "Wenn Sie einen HubSpot-Meeting-Link oder eine eingebettete Terminbuchung nutzen, verarbeitet HubSpot die eingegebenen Buchungsdaten nach den dort geltenden technischen und vertraglichen Einstellungen."
        ]
      },
      {
        title: "9. Cookies, Consent, Analytics und Marketing",
        body: "Wir verwenden notwendige Technologien für den Website-Betrieb und optionale Technologien nur nach Maßgabe Ihrer Auswahl im Cookie-Banner oder einer anderen gültigen Rechtsgrundlage.",
        items: [
          "Notwendige Technologien sichern Grundfunktionen, Sicherheit, Formularübermittlung und das Speichern Ihrer Cookie-Auswahl im lokalen Browser-Speicher.",
          "Optionale Analytics- und Marketing-Technologien werden nur aktiviert, wenn eine erforderliche Einwilligung vorliegt.",
          "Je nach Konfiguration können Google Analytics 4, Google Tag Manager, Meta Pixel, LinkedIn Insight Tag, Hotjar und HubSpot Tracking Code eingesetzt werden.",
          "Sie können Ihre Cookie-Auswahl jederzeit über den Cookie-Button auf der Website ändern oder widerrufen. Der Widerruf wirkt für die Zukunft."
        ]
      },
      {
        title: "10. Direkte elektronische Marketing-Kommunikation",
        body: "Marketing-E-Mails, Newsletter oder vergleichbare elektronische Direktwerbung versenden wir grundsätzlich nur mit vorheriger Einwilligung oder, soweit anwendbar, auf Grundlage der eng begrenzten Bestandskunden-Ausnahme der irischen ePrivacy-Regeln.",
        items: [
          "Wenn Sie freiwillig Marketing-E-Mails anfordern, protokollieren wir Einwilligung, Zeitpunkt, Inhalt der Erklärung und Datenschutzversion.",
          "Jede Marketing-Nachricht soll eine einfache Möglichkeit zum Abmelden oder Widersprechen enthalten.",
          "Service-E-Mails zur Bearbeitung einer konkreten Anfrage, Playbook-Zustellung, Terminbestätigung oder Vertragskommunikation sind keine freiwillige Marketing-Kommunikation."
        ]
      },
      {
        title: "11. Empfänger und Dienstleister",
        body: "Wir verkaufen personenbezogene Daten nicht. Daten werden nur weitergegeben, wenn dies für die beschriebenen Zwecke erforderlich, gesetzlich vorgeschrieben oder von Ihnen veranlasst ist.",
        items: [
          "Mögliche Empfänger sind Hosting-, Infrastruktur-, E-Mail-, CRM-, Analytics-, Consent-, Kalender-, Kommunikations- und Security-Dienstleister.",
          "Je nach Konfiguration können insbesondere Vercel, Neon (PostgreSQL-Datenbank, Serverstandort Frankfurt), Sanity, Resend, HubSpot, Microsoft, Google, Meta, LinkedIn und Hotjar beteiligt sein.",
          "Außerdem können Steuerberater, Rechtsberater, Behörden, Gerichte oder sonstige professionelle Stellen Empfänger sein, soweit dies erforderlich oder gesetzlich vorgeschrieben ist.",
          "Auftragsverarbeiter werden, soweit erforderlich, über Verträge zur Auftragsverarbeitung und Vertraulichkeit eingebunden."
        ]
      },
      {
        title: "12. Drittlandübermittlungen",
        body: "NovaLure ist in Irland ansässig und arbeitet im EU-Kontext. Einige technische Dienstleister oder Unterauftragnehmer können personenbezogene Daten außerhalb der EU oder des EWR verarbeiten.",
        items: [
          "Bei Drittlandübermittlungen prüfen wir geeignete Übermittlungsmechanismen nach Kapitel V DSGVO.",
          "Für die Neon-Datenbank ist der vorgesehene Serverstandort Frankfurt am Main, Deutschland. Anbieter-, Support- oder Unterauftragnehmerstrukturen können zusätzlich vertragliche Schutzmaßnahmen erfordern.",
          "Mögliche Mechanismen sind Angemessenheitsbeschlüsse der Europäischen Kommission, Standardvertragsklauseln, zusätzliche Schutzmaßnahmen oder eine andere zulässige Grundlage nach Art. 44 bis 49 DSGVO.",
          "Bei US-Anbietern können je nach Anbieter und Dienst zusätzlich der EU-U.S. Data Privacy Framework-Status, Standardvertragsklauseln und technische Schutzmaßnahmen relevant sein."
        ]
      },
      {
        title: "13. Speicherdauer",
        body: "Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungsfristen, Nachweisinteressen oder Rechtsansprüche dies rechtfertigen.",
        items: [
          "Website- und Sicherheitslogs werden grundsätzlich nur so lange gespeichert, wie es für Betrieb, Sicherheit und Fehleranalyse erforderlich ist.",
          "Anfragen und CRM-Daten werden so lange gespeichert, wie die Geschäftsbeziehung, Anfragebearbeitung, Nachverfolgung oder ein berechtigtes Dokumentationsinteresse besteht.",
          "Vertrags-, Rechnungs- und Buchhaltungsunterlagen werden nach den anwendbaren gesetzlichen Aufbewahrungsfristen gespeichert.",
          "Marketing-Einwilligungen und Widerrufe werden gespeichert, solange dies zum Nachweis der Einwilligung, zur Unterdrückung weiterer Zusendungen oder zur Erfüllung rechtlicher Pflichten erforderlich ist.",
          "Daten werden gelöscht oder anonymisiert, wenn der Zweck entfällt und keine gesetzlichen oder berechtigten Gründe für eine weitere Speicherung bestehen."
        ]
      },
      {
        title: "14. Ihre Rechte",
        body: "Sie haben nach der DSGVO die folgenden Rechte, soweit die gesetzlichen Voraussetzungen erfüllt sind. Zur Ausübung Ihrer Rechte genügt eine Nachricht an hello@novalure.eu.",
        items: [
          "Auskunft über die zu Ihrer Person verarbeiteten Daten.",
          "Berichtigung unrichtiger oder unvollständiger Daten.",
          "Löschung Ihrer Daten, soweit keine Aufbewahrungspflicht oder ein anderer vorrangiger Grund entgegensteht.",
          "Einschränkung der Verarbeitung.",
          "Datenübertragbarkeit, soweit die gesetzlichen Voraussetzungen erfüllt sind.",
          "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen.",
          "Widerruf einer Einwilligung mit Wirkung für die Zukunft, ohne dass die Rechtmäßigkeit der Verarbeitung vor dem Widerruf berührt wird."
        ]
      },
      {
        title: "15. Beschwerderecht bei der Datenschutzaufsicht",
        body: "Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere in dem EU-Mitgliedstaat Ihres gewöhnlichen Aufenthalts, Ihres Arbeitsplatzes oder des mutmaßlichen Verstoßes. Da NovaLure CLG in Irland ansässig ist, ist die irische Data Protection Commission eine zuständige Aufsichtsbehörde.",
        items: [
          "Data Protection Commission, 6 Pembroke Row, Dublin 2, D02 X963, Ireland.",
          "Website: www.dataprotection.ie.",
          "Die irische Aufsicht empfiehlt in der Regel, das Anliegen zuerst direkt mit dem Unternehmen zu klären, bevor eine Beschwerde eingereicht wird."
        ]
      },
      {
        title: "16. Automatisierte Entscheidungen und Profiling",
        body: "Wir treffen keine ausschließlich automatisierten Entscheidungen mit rechtlicher Wirkung oder ähnlich erheblicher Beeinträchtigung im Sinne von Art. 22 DSGVO.",
        items: [
          "Formular-, CRM- und Trackingdaten können zur internen Einordnung, Segmentierung, Priorisierung und Verbesserung von Follow-up-Prozessen genutzt werden.",
          "Eine solche interne Qualifizierung ersetzt keine menschliche Prüfung einer Anfrage und führt nicht automatisch zu Vertragsabschluss, Ablehnung oder einem rechtlich relevanten Ergebnis."
        ]
      },
      {
        title: "17. Bereitstellung von Daten",
        body: "Sie sind grundsätzlich nicht verpflichtet, personenbezogene Daten bereitzustellen. Ohne bestimmte Angaben können wir jedoch eine Anfrage, Playbook-Zustellung, Terminbuchung, Angebotserstellung oder Vertragsdurchführung möglicherweise nicht bearbeiten.",
        items: [
          "Pflichtfelder in Formularen sind auf die Bearbeitung der jeweiligen Anfrage ausgerichtet.",
          "Optionale Angaben können ausgelassen werden, können aber die Einordnung und Vorbereitung verbessern."
        ]
      },
      {
        title: "18. Änderungen dieser Datenschutzinformationen",
        body: "Wir können diese Datenschutzinformationen aktualisieren, wenn sich rechtliche, technische oder geschäftliche Anforderungen ändern. Die jeweils aktuelle Fassung ist auf der Website verfügbar."
      }
    ];
  }

  return [
    {
      title: "1. Effective date and scope",
      body: "Effective date: May 2026. This Privacy Policy explains how NovaLure CLG processes personal data when you visit novalure.eu, request a playbook, submit a form, request a Pipeline Audit, book a meeting or communicate with us by email, phone or other business channels.",
      items: [
        "This policy applies to website visitors, prospects, clients, business partners and company contacts.",
        "Where we build lead systems, CRM processes or campaigns for clients, additional project-specific privacy terms, data processing agreements or joint-controller arrangements may apply."
      ]
    },
    {
      title: "2. Controller",
      body: "The controller is NovaLure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland, registration number: 796735, Irish VAT number: IE451718HH. Privacy contact: hello@novalure.eu.",
      items: [
        "NovaLure CLG is established in Ireland. The GDPR, the Irish Data Protection Act 2018 and Irish ePrivacy rules are particularly relevant to our processing.",
        "Website: www.novalure.eu.",
        "We have not appointed a Data Protection Officer at this time. Privacy requests can be sent directly to hello@novalure.eu."
      ]
    },
    {
      title: "3. Personal data we process",
      body: "Depending on how you use the website and communicate with us, we process different categories of personal data. We collect only data that is necessary for the relevant purpose or voluntarily provided by you.",
      items: [
        "Contact and identification data: name, email address, phone number, company, role or position.",
        "Business and project data: website, market area, target group, project type, lead problem, CRM maturity, lead volume, budget readiness, decision status and information about existing assets.",
        "Form and playbook data: selected playbook, consent status, marketing consent, timestamp, language, page URL, UTM parameters and technical form-protection signals.",
        "Communication data: enquiry content, emails, meeting booking information, preparation notes, follow-up and support communication.",
        "Technical data: IP address, date and time, browser, device, operating system, referrer, visited pages, cookie and consent information, security data and server logs.",
        "Analytics and marketing data: page views, clicks, campaign sources, conversion events and cookie identifiers only where the relevant technology is active and any required consent has been given."
      ]
    },
    {
      title: "4. Purposes of processing",
      body: "We process personal data for clear business purposes connected with our website, lead systems and client communication.",
      items: [
        "Operating, securing, debugging and technically delivering the website.",
        "Handling contact, playbook, meeting and Pipeline Audit requests.",
        "Delivering requested content, including playbooks, confirmation emails and preparation information.",
        "Preparing, performing and following up on consulting, proposals, contract negotiations and client mandates.",
        "Maintaining CRM records, qualifying leads, following up, segmenting and prioritising business enquiries.",
        "Measuring website performance, campaign success and funnel events where this is consent-based or otherwise legally permitted.",
        "Complying with legal, tax, accounting and regulatory obligations.",
        "Establishing, exercising or defending legal claims."
      ]
    },
    {
      title: "5. Legal bases",
      body: "Processing is based on Article 6 GDPR. The applicable legal basis depends on the specific purpose.",
      items: [
        "Article 6(1)(b) GDPR: pre-contractual steps and contract performance where you request a proposal, audit, meeting, playbook or service.",
        "Article 6(1)(f) GDPR: legitimate interests in B2B communication, website security, fraud and spam prevention, CRM management, internal administration, direct contact with business representatives and legal defence.",
        "Article 6(1)(a) GDPR: consent for optional cookies, analytics, marketing technologies, external media, voluntary marketing communication and similar consent-based processing.",
        "Article 6(1)(c) GDPR: legal obligations, including tax, accounting, company-law, regulatory and record-keeping obligations."
      ]
    },
    {
      title: "6. Website, hosting and security",
      body: "When the website is accessed, technically necessary data is processed to deliver the site, detect attacks, analyse errors and maintain website stability.",
      items: [
        "The website may be delivered through Vercel and comparable infrastructure or hosting providers.",
        "Neon with PostgreSQL may be used as the database provider. The intended NovaLure server location is Frankfurt am Main, Germany.",
        "Server logs may contain IP address, timestamp, requested URL, referrer, user agent and technical status data.",
        "The legal basis is our legitimate interest in secure, performant and reliable website operation."
      ]
    },
    {
      title: "7. Forms, playbooks and Pipeline Audit",
      body: "When you submit a form, we process the data you provide to review your request, deliver the requested playbook, prepare a Pipeline Audit or contact you for business follow-up.",
      items: [
        "For playbook requests, we process name, email, company, phone number, selected playbook, language, page URL, UTM parameters, required processing consent, optional marketing consent, consent timestamp and the applicable privacy-policy version.",
        "For Pipeline Audit and contact requests, we process form details about company, website, role, project or market area, lead problem, CRM, lead volume, sales bottleneck, assets, timing, budget readiness, decision status and message content.",
        "Where website or form logic uses a database, relevant enquiry, consent and system data may be processed in a Neon PostgreSQL database with server location in Frankfurt, Germany.",
        "For form protection, we may use a hidden field or comparable spam check.",
        "Mandatory fields are required so we can meaningfully handle the request. Voluntary information helps us assess and prepare the next step."
      ]
    },
    {
      title: "8. Email, CRM and meeting booking",
      body: "We may use professional service providers and internal systems to process enquiries, deliver playbooks, prepare meetings and manage client communication.",
      items: [
        "Resend may be used for transactional email such as playbook delivery, confirmations and internal notifications.",
        "HubSpot may be used for forms, CRM, contact management, meeting scheduling, follow-up and marketing-consent management.",
        "Microsoft 365 and Microsoft Teams may be used for email, calendar, internal collaboration, call preparation and client meetings.",
        "If you use a HubSpot meeting link or embedded booking widget, HubSpot processes the booking data entered according to the applicable technical and contractual settings."
      ]
    },
    {
      title: "9. Cookies, consent, analytics and marketing",
      body: "We use necessary technologies for website operation and optional technologies only according to your cookie-banner choices or another valid legal basis.",
      items: [
        "Necessary technologies support core functions, security, form delivery and storing your cookie choice in local browser storage.",
        "Optional analytics and marketing technologies are activated only where any required consent has been given.",
        "Depending on configuration, Google Analytics 4, Google Tag Manager, Meta Pixel, LinkedIn Insight Tag, Hotjar and HubSpot Tracking Code may be used.",
        "You can change or withdraw your cookie choice at any time through the cookie button on the website. Withdrawal applies for the future."
      ]
    },
    {
      title: "10. Direct electronic marketing",
      body: "We generally send marketing emails, newsletters or comparable electronic direct marketing only with prior consent or, where applicable, under the limited existing-customer exemption in Irish ePrivacy rules.",
      items: [
        "If you voluntarily request marketing emails, we record the consent, time, wording of the declaration and privacy-policy version.",
        "Each marketing message should include an easy way to unsubscribe or object.",
        "Service emails for a specific request, playbook delivery, meeting confirmation or contract communication are not voluntary marketing communication."
      ]
    },
    {
      title: "11. Recipients and service providers",
      body: "We do not sell personal data. Data is shared only where necessary for the purposes described, legally required or initiated by you.",
      items: [
        "Possible recipients include hosting, infrastructure, email, CRM, analytics, consent, calendar, communication and security providers.",
        "Depending on configuration, this may include Vercel, Neon (PostgreSQL database, server location Frankfurt), Sanity, Resend, HubSpot, Microsoft, Google, Meta, LinkedIn and Hotjar.",
        "Tax advisers, legal advisers, authorities, courts or other professional bodies may also receive data where necessary or legally required.",
        "Processors are engaged under data processing agreements and confidentiality terms where required."
      ]
    },
    {
      title: "12. International transfers",
      body: "NovaLure is established in Ireland and operates in an EU context. Some technical providers or subprocessors may process personal data outside the EU or EEA.",
      items: [
        "For third-country transfers, we assess appropriate transfer mechanisms under Chapter V GDPR.",
        "For the Neon database, the intended server location is Frankfurt am Main, Germany. Provider, support or subprocessor structures may still require contractual safeguards.",
        "Possible mechanisms include European Commission adequacy decisions, Standard Contractual Clauses, supplementary safeguards or another permitted basis under Articles 44 to 49 GDPR.",
        "For US providers, the EU-U.S. Data Privacy Framework status, Standard Contractual Clauses and technical safeguards may be relevant depending on the provider and service."
      ]
    },
    {
      title: "13. Retention",
      body: "We retain personal data only for as long as necessary for the relevant purpose or where statutory retention periods, evidence needs or legal claims justify continued storage.",
      items: [
        "Website and security logs are generally retained only as long as needed for operation, security and error analysis.",
        "Enquiries and CRM data are retained as long as needed for the business relationship, request handling, follow-up or a legitimate documentation interest.",
        "Contract, invoice and accounting records are retained in line with applicable statutory retention periods.",
        "Marketing consents and withdrawals are retained as long as needed to evidence consent, suppress further messages or comply with legal obligations.",
        "Data is deleted or anonymised when the purpose no longer applies and there are no legal or legitimate reasons for further retention."
      ]
    },
    {
      title: "14. Your rights",
      body: "Under the GDPR, you have the following rights where the legal requirements are met. To exercise your rights, contact hello@novalure.eu.",
      items: [
        "Access to personal data processed about you.",
        "Rectification of inaccurate or incomplete data.",
        "Erasure of your data where no retention obligation or overriding reason applies.",
        "Restriction of processing.",
        "Data portability where the legal requirements are met.",
        "Objection to processing based on legitimate interests.",
        "Withdrawal of consent with effect for the future, without affecting the lawfulness of processing before withdrawal."
      ]
    },
    {
      title: "15. Right to lodge a complaint",
      body: "You may lodge a complaint with a data protection supervisory authority, in particular in the EU Member State of your habitual residence, place of work or the alleged infringement. As NovaLure CLG is established in Ireland, the Irish Data Protection Commission is a competent supervisory authority.",
      items: [
        "Data Protection Commission, 6 Pembroke Row, Dublin 2, D02 X963, Ireland.",
        "Website: www.dataprotection.ie.",
        "The Irish authority generally expects you to raise the matter directly with the organisation first before submitting a complaint."
      ]
    },
    {
      title: "16. Automated decision-making and profiling",
      body: "We do not make solely automated decisions with legal or similarly significant effects within the meaning of Article 22 GDPR.",
      items: [
        "Form, CRM and tracking data may be used internally to assess, segment, prioritise and improve follow-up processes.",
        "This internal qualification does not replace human review of an enquiry and does not automatically produce a contract, rejection or legally relevant outcome."
      ]
    },
    {
      title: "17. Providing data",
      body: "You are generally not obliged to provide personal data. Without certain data, however, we may not be able to handle an enquiry, deliver a playbook, book a meeting, prepare a proposal or perform a contract.",
      items: [
        "Mandatory form fields are aligned with handling the relevant request.",
        "Optional information may be omitted, but it can improve assessment and preparation."
      ]
    },
    {
      title: "18. Changes to this Privacy Policy",
      body: "We may update this Privacy Policy where legal, technical or business requirements change. The current version is available on the website."
    }
  ];
}

function legal(locale: Locale, key: "imprint" | "privacy" | "cookies"): PageContent {
  const de = locale === "de";
  const titleMap = {
    imprint: de ? "Impressum" : "Imprint",
    privacy: de ? "Datenschutzinformationen" : "Privacy Policy",
    cookies: de ? "Cookie-Richtlinie" : "Cookie Policy"
  };
  const title = titleMap[key];

  const common = {
    key,
    locale,
    template: "legal" as const,
    eyebrow: de ? "Rechtliches" : "Legal",
    title,
    seoTitle: `${title} | NovaLure`,
    primaryCta: { label: de ? "Pipeline-Audit anfragen" : "Request a Pipeline Audit", target: "contact" as PageKey, anchor: "book-audit" },
    secondaryCta: { label: de ? "Playbook herunterladen" : "Download playbook", target: "playbooks" as PageKey },
    heroBullets: [
      "NovaLure CLG",
      "20 Harcourt Street, Dublin 2, D02 H364, Ireland",
      "Registration number: 796735",
      de ? "Irische VAT-Nummer: IE451718HH" : "Irish VAT number: IE451718HH",
      "hello@novalure.eu"
    ]
  };

  if (key === "imprint") {
    return {
      ...common,
      description: de
        ? "Ausführliches Impressum und Anbieterkennzeichnung der NovaLure CLG nach irischem Gesellschaftsrecht und EU-E-Commerce-Vorgaben."
        : "Detailed imprint and provider information for NovaLure CLG under Irish company law and EU e-commerce disclosure rules.",
      sections: imprintSections(locale)
    };
  }

  if (key === "privacy") {
    return {
      ...common,
      description: de
        ? "Ausführliche Datenschutzinformationen zur Verarbeitung personenbezogener Daten durch NovaLure CLG nach irischem Datenschutzrecht, DSGVO und ePrivacy-Regeln."
        : "Detailed privacy information for personal data processed by NovaLure CLG under Irish data protection law, the GDPR and ePrivacy rules.",
      sections: privacySections(locale)
    };
  }

  return {
    ...common,
    description: de ? "Hinweise zu Cookies, Tracking und externen Diensten auf der NovaLure-Website." : "Information about cookies, tracking and external services on the NovaLure website.",
    sections: [
      {
        title: de ? "Anbieter dieser Website" : "Website provider",
        body: de
          ? "Anbieter dieser Website ist NovaLure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland, Registration number: 796735, Irish VAT number: IE451718HH. Kontakt: hello@novalure.eu."
          : "The provider of this website is NovaLure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland, registration number: 796735, Irish VAT number: IE451718HH. Contact: hello@novalure.eu."
      },
      {
        title: de ? "Cookie-Kategorien" : "Cookie categories",
        body: de
          ? "Notwendige Technologien sichern Grundfunktionen der Website. Analytics, Marketing und externe Medien werden nur dort aktiviert, wo rechtlich erforderlich und eine entsprechende Einwilligung vorliegt."
          : "Necessary technologies support core website functions. Analytics, marketing and external media are activated only where legally required consent has been given."
      },
      {
        title: de ? "Mögliche Anbieter" : "Possible providers",
        body: "Vercel, Sanity, Resend, Microsoft 365, Microsoft Teams, Google Analytics 4, Google Tag Manager, Meta Pixel, Hotjar and LinkedIn Insight Tag."
      },
      {
        title: de ? "Einwilligung ändern" : "Changing consent",
        body: de
          ? "Sie können Ihre Cookie-Einstellungen über den Cookie-Button auf der Website ändern oder widerrufen. Browser-Einstellungen bleiben davon unberührt."
          : "You can change or withdraw cookie choices through the cookie button on the website. Browser settings remain separate."
      }
    ]
  };
}
