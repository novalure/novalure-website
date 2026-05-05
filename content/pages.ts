import type { Locale, PageKey } from "@/lib/i18n";

export type Cta = {
  label: string;
  target: PageKey;
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

export type PageContent = {
  key: PageKey;
  locale: Locale;
  template: "home" | "audience" | "playbooks" | "contact" | "legal";
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  heroBullets: string[];
  sections?: {
    eyebrow?: string;
    title: string;
    body: string;
    items?: string[];
  }[];
  faq?: FaqItem[];
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
  team: { id: string; title: string; body: string; pillars: string[]; founder: string };
  finalCtaTitle: string;
};

const labels = {
  en: {
    download: "Download Playbook",
    audit: "Book Pipeline Audit",
    developerPlaybook: "Developer Pipeline Playbook",
    agentPlaybook: "Real Estate Agent Lead Playbook"
  },
  de: {
    download: "Playbook herunterladen",
    audit: "Pipeline-Audit buchen",
    developerPlaybook: "Bauträger-Pipeline-Playbook",
    agentPlaybook: "Makler-Lead-Playbook"
  }
};

export const playbooks: Record<Locale, Playbook[]> = {
  en: [
    {
      key: "developer",
      title: labels.en.developerPlaybook,
      subtitle: "A practical system map for turning project demand into qualified buyer conversations.",
      learns: [
        "How to structure a project funnel before media spend scales",
        "Where buyer intent should be filtered before sales handover",
        "Which CRM context your sales team needs before the first call"
      ]
    },
    {
      key: "agent",
      title: labels.en.agentPlaybook,
      subtitle: "A field guide for agents who want owned seller and buyer demand beyond portals.",
      learns: [
        "How to separate portal dependency from owned pipeline",
        "What seller and buyer lead flows need to qualify intent",
        "How follow-up structure protects serious opportunities"
      ]
    }
  ],
  de: [
    {
      key: "developer",
      title: labels.de.developerPlaybook,
      subtitle: "Eine praktische Systemkarte, um Projektnachfrage in qualifizierte Käufergespräche zu verwandeln.",
      learns: [
        "Wie ein Projekt-Funnel aufgebaut wird, bevor Media-Budget skaliert",
        "Wo Kaufabsicht vor der Vertriebsübergabe gefiltert werden sollte",
        "Welchen CRM-Kontext Ihr Vertrieb vor dem ersten Gespräch braucht"
      ]
    },
    {
      key: "agent",
      title: labels.de.agentPlaybook,
      subtitle: "Ein Leitfaden für Makler, die eigene Verkäufer- und Käufernachfrage jenseits von Portalen aufbauen wollen.",
      learns: [
        "Wie Sie Portalabhängigkeit von eigener Pipeline trennen",
        "Welche Filter Verkäufer- und Käufer-Leads wirklich brauchen",
        "Wie strukturierte Nachverfolgung ernsthafte Chancen schützt"
      ]
    }
  ]
};

const sharedFaq: Record<Locale, FaqItem[]> = {
  en: [
    {
      question: "Who is Novalure for?",
      answer: "Novalure is for real estate developers, project sellers, broker teams and agents who need qualified pipeline, not generic traffic or one-off campaign activity."
    },
    {
      question: "Is Novalure an agency?",
      answer: "Not in the classic sense. Novalure builds a PropTech Sales System: funnel architecture, campaign logic, lead qualification, CRM handover, sales assets and reporting working together."
    },
    {
      question: "What is a PropTech Sales System?",
      answer: "It is the digital sales infrastructure between first click and qualified conversation. It connects positioning, landing pages, campaigns, qualification, CRM data and follow-up."
    },
    {
      question: "Do you work with developers and agents?",
      answer: "Yes. The system is built for property developers, new-build providers, investment project sellers, broker teams and independent real estate agents."
    },
    {
      question: "Do you guarantee leads?",
      answer: "No. We do not promise unverifiable lead numbers. We build the system, qualification logic and reporting needed to improve lead quality and sales visibility."
    },
    {
      question: "How does lead qualification work?",
      answer: "Qualification is designed around intent signals, project fit, budget readiness, source context and sales follow-up requirements before a lead reaches the team."
    },
    {
      question: "Do you use HubSpot?",
      answer: "The site and system are prepared for HubSpot forms, meeting scheduling, CRM handover and tracking. Other CRM setups can be discussed in the audit."
    },
    {
      question: "What happens after someone downloads the Playbook?",
      answer: "HubSpot captures the request, sends the relevant Playbook by email and offers a clear next step: a Pipeline Audit for teams that want their current lead system reviewed."
    },
    {
      question: "Is the website prepared for GDPR compliance?",
      answer: "The website is prepared for consent-first tracking and lawful HubSpot embeds. Final legal wording, vendor lists and consent settings must be reviewed before launch."
    },
    {
      question: "What budget should a client expect?",
      answer: "Budgets depend on market, project type, sales cycle, assets and media requirements. Pricing is defined after the Pipeline Audit as a custom proposal, not through public packages."
    },
    {
      question: "Who actually does the work?",
      answer: "A senior-led specialist team covers real estate sales strategy, funnel architecture, performance marketing, CRM and lead operations, and sales asset production."
    },
    {
      question: "Why is pricing not public?",
      answer: "Because a developer launch, a seller mandate funnel and a buyer pipeline system need different architecture, assets and operating support. The proposal is scoped after diagnosis."
    }
  ],
  de: [
    {
      question: "Für wen ist Novalure geeignet?",
      answer: "Novalure ist für Bauträger, Projektentwickler, Projektvertriebe, Maklerteams und Immobilienmakler, die qualifizierte Pipeline statt generischem Traffic benötigen."
    },
    {
      question: "Ist Novalure eine Agentur?",
      answer: "Nicht im klassischen Sinn. Novalure baut ein PropTech Sales System: Funnel-Architektur, Kampagnenlogik, Lead-Qualifizierung, CRM-Übergabe, Sales Assets und Reporting als verbundenes System."
    },
    {
      question: "Was ist ein PropTech Sales System?",
      answer: "Es ist die digitale Vertriebsinfrastruktur zwischen erstem Klick und qualifiziertem Gespräch. Sie verbindet Positionierung, Landingpages, Kampagnen, Qualifizierung, CRM-Daten und Follow-up."
    },
    {
      question: "Arbeiten Sie mit Bauträgern und Maklern?",
      answer: "Ja. Das System ist für Bauträger, Neubauanbieter, Projektverkäufer, Maklerteams und selbstständige Immobilienmakler konzipiert."
    },
    {
      question: "Garantieren Sie Leads?",
      answer: "Nein. Wir versprechen keine unbelegbaren Lead-Zahlen. Wir bauen das System, die Qualifizierungslogik und das Reporting, um Leadqualität und Vertriebsübersicht zu verbessern."
    },
    {
      question: "Wie funktioniert Lead-Qualifizierung?",
      answer: "Die Qualifizierung orientiert sich an Intent-Signalen, Projekt-Fit, Budgetnähe, Quellenkontext und den Anforderungen Ihres Vertriebs, bevor Leads übergeben werden."
    },
    {
      question: "Nutzen Sie HubSpot?",
      answer: "Die Website und das System sind für HubSpot Forms, Meeting Scheduling, CRM-Übergabe und Tracking vorbereitet. Andere CRM-Setups können im Audit besprochen werden."
    },
    {
      question: "Was passiert nach dem Playbook-Download?",
      answer: "HubSpot erfasst die Anfrage, sendet das passende Playbook per E-Mail und bietet als nächsten Schritt ein Pipeline-Audit des aktuellen Lead-Systems an."
    },
    {
      question: "Ist die Website DSGVO-konform vorbereitet?",
      answer: "Die Website ist für consent-basiertes Tracking und rechtlich steuerbare HubSpot-Embeds vorbereitet. Finale Rechtstexte, Anbieterlisten und Consent-Einstellungen müssen vor dem Launch geprüft werden."
    },
    {
      question: "Mit welchem Budget sollte man rechnen?",
      answer: "Das hängt von Markt, Projektart, Sales Cycle, vorhandenen Assets und Media-Anforderungen ab. Preise werden nach der Diagnose im Pipeline-Audit als individuelles Angebot festgelegt."
    },
    {
      question: "Wer setzt die Arbeit um?",
      answer: "Ein senior-geführtes Spezialistenteam verbindet Immobilienvertriebsstrategie, Funnel-Architektur, Performance Marketing, CRM- und Lead-Operations sowie Vertriebs-Assets und Content."
    },
    {
      question: "Warum gibt es keine öffentlichen Preise?",
      answer: "Weil ein Bauträger-Launch, ein Verkäufer-Funnel und eine Käufer-Pipeline unterschiedliche Architektur, Assets und operative Unterstützung benötigen. Das Angebot wird nach Diagnose definiert."
    }
  ]
};

export const pages: Record<Locale, Record<PageKey, PageContent | HomeContent>> = {
  en: {
    home: {
      key: "home",
      locale: "en",
      template: "home",
      eyebrow: "Lead infrastructure for real estate",
      title: "Pipeline, not impressions.",
      seoTitle: "Novalure | PropTech Sales System for Developers & Agents",
      description:
        "Novalure is a PropTech Sales System for real estate developers and agents. We build digital sales infrastructure from first click to qualified conversation.",
      primaryCta: { label: labels.en.download, target: "playbooks" },
      secondaryCta: { label: labels.en.audit, target: "contact" },
      heroBullets: ["Not an agency", "Not just a website", "Not only ads", "From first click to CRM-ready opportunity"],
      audience: {
        title: "Built for the two real estate teams that need pipeline clarity most.",
        cards: [
          {
            title: "For Developers",
            body: "Control buyer demand for new developments, investment projects and project launches before your sales team loses momentum.",
            hrefKey: "developers",
            points: ["Project funnel architecture", "Buyer intent qualification", "CRM-ready handover"]
          },
          {
            title: "For Real Estate Agents",
            body: "Reduce portal dependency and build owned seller and buyer funnels that create serious conversations.",
            hrefKey: "agents",
            points: ["Seller lead systems", "Buyer lead funnels", "Structured follow-up"]
          }
        ]
      },
      problem: {
        title: "You do not have a lead problem. You have a problem with the wrong leads.",
        body:
          "Most marketing setups bring volume. Volume is not the metric. Pipeline is. Portals, ads and landing pages only matter when they create qualified conversations your sales team can act on.",
        points: [
          { title: "Click reports without sales clarity", body: "Campaigns often optimize attention while sales teams need readiness, context and next steps." },
          { title: "Unqualified enquiries drain the team", body: "When lead quality is uncontrolled, your strongest salespeople spend time filtering instead of selling." },
          { title: "Portals are not a system", body: "They can create exposure, but they do not own your funnel logic, CRM handover or follow-up discipline." }
        ]
      },
      system: {
        title: "Four layers. One outcome.",
        body: "No magic. No black box. Engineered around how property is actually sold.",
        layers: [
          { label: "Layer 1", title: "Project Funnel Architecture", body: "One project, one market, one buyer logic. Mobile-first pages built to qualify intent before enquiry." },
          { label: "Layer 2", title: "Multi-Channel Lead Generation", body: "Google, Meta and retargeting campaigns connected to buyer behavior, not vanity metrics." },
          { label: "Layer 3", title: "Lead Qualification Layer", body: "Intent, fit and readiness filters prioritize serious buyers and sellers before sales handover." },
          { label: "Layer 4", title: "CRM Handover & Reporting", body: "Leads reach your CRM with source context, qualification notes and reporting your team can use." }
        ]
      },
      modules: {
        title: "Four modules. Pick what fits your sales system.",
        items: [
          { title: "Project Marketing for Developers", audience: "Developers", body: "Launch funnels for new developments, investment units and project sales." },
          { title: "Seller Lead Generation for Agents", audience: "Agents", body: "Localized funnels for homeowners with genuine selling intent." },
          { title: "Buyer Lead Generation for Agents", audience: "Agents", body: "Search and social campaigns filtered for buyer intent and viewing readiness." },
          { title: "Sales Asset Production", audience: "Both", body: "Landing copy, lead magnets, sales decks, project visuals and campaign assets." }
        ]
      },
      playbookSection: {
        title: "Start with the Playbook that matches your pipeline.",
        body: "No direct PDF download. Choose the relevant Playbook, submit the form and HubSpot sends the right resource by email."
      },
      beforeAfter: {
        beforeTitle: "Before Novalure",
        afterTitle: "After the system",
        before: ["Portal dependency", "Unqualified enquiries", "No CRM handover", "No follow-up automation", "Click reports without sales clarity", "Sales team wastes time"],
        after: ["Qualified conversations", "CRM-ready leads", "Structured follow-up", "Clear funnel logic", "Better sales focus", "Pipeline visibility"]
      },
      process: {
        id: "process",
        title: "A structured sales-system process, not campaign guesswork.",
        body: "Each step is designed to reduce noise, protect sales time and make pipeline movement visible.",
        steps: ["Pipeline Audit", "Strategy & Funnel Architecture", "Build & Setup", "Campaign Launch", "Lead Qualification", "CRM Handover", "Optimization & Reporting"]
      },
      team: {
        id: "team",
        title: "Senior-led specialist team, built around real estate sales.",
        body:
          "Novalure combines commercial sales thinking with funnel architecture, performance marketing, CRM operations and sales assets. The work stays focused because the team is specialist, not generic.",
        pillars: ["Real Estate Sales Strategy", "Funnel Architecture", "Performance Marketing", "CRM & Lead Operations", "Sales Assets & Content"],
        founder: "Franz Romih — Real Estate Sales Lead"
      },
      faq: sharedFaq.en,
      finalCtaTitle: "Download the Playbook. Then book a Pipeline Audit when you want your current lead system reviewed."
    },
    developers: {
      key: "developers",
      locale: "en",
      template: "audience",
    eyebrow: "For real estate developers",
    title: "Real estate developer lead generation for a controlled buyer pipeline.",
    seoTitle: "Real Estate Developer Lead Generation | Project Pipeline | Novalure",
    description:
      "Lead generation for real estate developers, new-build projects and investment properties: project funnels, buyer qualification, CRM handover and pipeline visibility.",
      primaryCta: { label: labels.en.download, target: "playbooks" },
      secondaryCta: { label: labels.en.audit, target: "contact" },
    heroBullets: ["Real estate developer leads", "New-build projects", "Buyer qualification", "Project funnels"],
    sections: [
      { title: "Real estate developer lead generation needs more than reach", body: "Project launches often create attention before they create sales clarity. Property developer marketing only becomes useful when enquiries are qualified, routed and visible in the sales pipeline.", items: ["Project marketing optimized for CPL instead of pipeline", "Landing pages that do not qualify buyer intent", "No structured CRM handover for project sales"] },
      { title: "Property developer marketing system", body: "Novalure connects positioning, project landing pages, paid search and social traffic, lead qualification and sales reporting into one controlled launch architecture." },
      { title: "Project funnel architecture for real estate developers", body: "Each project is built around dedicated funnel logic: location, buyer profile, investment case, unit mix and next-step readiness." },
      { title: "Buyer qualification before sales handover", body: "We separate casual curiosity from buyer signals your team can act on, without inventing unverifiable lead promises." },
      { title: "CRM handover for project sales teams", body: "Your sales team receives source, intent and conversation context so the first call starts closer to a real buying discussion." }
      ],
      faq: sharedFaq.en.slice(0, 8)
    },
    agents: {
      key: "agents",
      locale: "en",
      template: "audience",
      eyebrow: "For real estate agents",
    title: "Real estate agent lead generation beyond portals.",
    seoTitle: "Real Estate Agent Lead Generation | Agent Sales System | Novalure",
    description:
      "Build an owned lead generation system for real estate agents with seller and buyer funnels, lead qualification, CRM handover and structured follow-up.",
      primaryCta: { label: labels.en.download, target: "playbooks" },
      secondaryCta: { label: labels.en.audit, target: "contact" },
    heroBullets: ["Real estate agent leads", "Seller lead generation", "Buyer funnels", "CRM follow-up"],
    sections: [
      { title: "Real estate agent lead generation without portal dependency", body: "Portals can create exposure, but they rarely create owned pipeline. Serious real estate agents need seller and buyer lead flows they can control, qualify and follow up consistently.", items: ["Portal dependency", "Weak seller intent", "Buyer enquiries without readiness", "Manual follow-up gaps"] },
      { title: "Seller lead generation for real estate agents", body: "Localized campaigns and landing pages position your team as the specialist for a market, property type or seller situation." },
      { title: "Buyer lead generation with local funnel logic", body: "Search and social funnels capture active demand and filter for viewing readiness, budget context and intent." },
      { title: "Owned local funnel system", body: "Your pipeline becomes a controlled operating asset, not just a list of third-party enquiries." },
      { title: "CRM follow-up for real estate agents", body: "Leads are structured so your team knows who to contact, why they converted and what follow-up should happen next." }
      ],
      faq: sharedFaq.en.slice(0, 8)
    },
    playbooks: {
      key: "playbooks",
      locale: "en",
      template: "playbooks",
      eyebrow: "Playbook hub",
      title: "Choose the Playbook for your pipeline problem.",
      seoTitle: "Real Estate Sales Playbooks for Developers & Agents | Novalure",
      description:
        "Download the Developer Pipeline Playbook or Real Estate Agent Lead Playbook through HubSpot forms.",
      primaryCta: { label: labels.en.download, target: "playbooks" },
      secondaryCta: { label: labels.en.audit, target: "contact" },
      heroBullets: ["Developer pipeline", "Agent lead systems", "HubSpot delivery", "Audit next step"],
      faq: sharedFaq.en.slice(6, 12)
    },
    contact: {
      key: "contact",
      locale: "en",
      template: "contact",
      eyebrow: "Pipeline Audit",
      title: "Book a confidential review of your current lead system.",
      seoTitle: "Book a Pipeline Audit for Real Estate Sales | Novalure",
      description:
        "Book a no-pressure Pipeline Audit to review your project positioning, funnel logic, CRM handover and lead quality gaps.",
      primaryCta: { label: labels.en.audit, target: "contact" },
      secondaryCta: { label: labels.en.download, target: "playbooks" },
      heroBullets: ["No generic pitch", "Lead-system diagnosis", "Clear next steps", "Microsoft Teams appointment"],
      sections: [
        { title: "What the audit is", body: "A focused review of your current lead generation, sales handover and pipeline visibility." },
        { title: "Who it is for", body: "Developers, project sellers, broker teams and agents who want better qualified conversations." },
        { title: "What to prepare", body: "Bring your project or market focus, current lead sources, CRM setup and the point where sales momentum most often breaks down." }
      ],
      faq: sharedFaq.en.slice(0, 6)
    },
    imprint: legal("en", "imprint"),
    privacy: legal("en", "privacy"),
    cookies: legal("en", "cookies")
  },
  de: {
    home: {
      key: "home",
      locale: "de",
      template: "home",
      eyebrow: "Lead-Infrastruktur für Immobilien",
      title: "Pipeline, nicht Impressionen.",
      seoTitle: "Novalure | PropTech Sales System für Bauträger & Makler",
      description:
        "Novalure ist ein PropTech Sales System für Bauträger und Immobilienmakler. Wir bauen digitale Vertriebsinfrastruktur vom ersten Klick bis zum qualifizierten Gespräch.",
      primaryCta: { label: labels.de.download, target: "playbooks" },
      secondaryCta: { label: labels.de.audit, target: "contact" },
      heroBullets: ["Keine klassische Agentur", "Nicht nur eine Website", "Nicht einfach nur Werbung", "Vom ersten Klick zur CRM-fähigen Verkaufschance"],
      audience: {
        title: "Entwickelt für die zwei Immobilien-Teams, die Pipeline-Klarheit am stärksten brauchen.",
        cards: [
          {
            title: "Für Bauträger",
            body: "Steuern Sie Käufernachfrage für Neubauprojekte, Investmentprojekte und Projekt-Launches, bevor Vertriebsmomentum verloren geht.",
            hrefKey: "developers",
            points: ["Projekt-Funnel-Architektur", "Käufer-Intent-Qualifizierung", "CRM-fähige Übergabe"]
          },
          {
            title: "Für Immobilienmakler",
            body: "Reduzieren Sie Portalabhängigkeit und bauen Sie eigene Verkäufer- und Käufer-Funnels für ernsthafte Gespräche auf.",
            hrefKey: "agents",
            points: ["Verkäufer-Lead-Systeme", "Käufer-Lead-Funnels", "Strukturiertes Follow-up"]
          }
        ]
      },
      problem: {
        title: "Sie haben kein Lead-Problem. Sie haben ein Problem mit den falschen Leads.",
        body:
          "Die meisten Marketing-Setups bringen Volumen. Volumen ist jedoch nicht die entscheidende Metrik. Entscheidend ist Pipeline. Portale, Anzeigen und Landingpages zählen nur, wenn daraus qualifizierte Gespräche entstehen.",
        points: [
          { title: "Klickberichte ohne Vertriebsklarheit", body: "Kampagnen optimieren häufig auf Aufmerksamkeit, während Ihr Vertrieb Reifegrad, Kontext und nächste Schritte braucht." },
          { title: "Unqualifizierte Anfragen kosten Zeit", body: "Wenn Leadqualität nicht gesteuert wird, filtert Ihr Vertrieb, statt zu verkaufen." },
          { title: "Portale sind kein System", body: "Sie können Reichweite schaffen, ersetzen aber keine eigene Funnel-Logik, CRM-Übergabe oder Follow-up-Disziplin." }
        ]
      },
      system: {
        title: "Vier Schichten. Ein Ergebnis.",
        body: "Keine Magie. Keine Black Box. Entwickelt entlang der Realität, wie Immobilien verkauft werden.",
        layers: [
          { label: "Schicht 1", title: "Projekt-Funnel-Architektur", body: "Ein Projekt, ein Markt, eine Käuferlogik. Mobile-first-Seiten, die Kaufabsicht vor der Anfrage qualifizieren." },
          { label: "Schicht 2", title: "Multi-Channel-Leadgenerierung", body: "Google, Meta und Retargeting werden mit Kaufverhalten verbunden, nicht mit reinen Reichweitenkennzahlen." },
          { label: "Schicht 3", title: "Lead-Qualifizierung", body: "Intent-, Fit- und Bereitschaftsfilter priorisieren ernsthafte Käufer und Verkäufer vor der Übergabe." },
          { label: "Schicht 4", title: "CRM-Übergabe & Reporting", body: "Leads erreichen Ihr CRM mit Quellenkontext, Qualifizierungsnotizen und nutzbarem Reporting." }
        ]
      },
      modules: {
        title: "Vier Module. Wählen Sie, was zu Ihrem Vertriebssystem passt.",
        items: [
          { title: "Projektmarketing für Bauträger", audience: "Bauträger", body: "Launch-Funnels für Neubauprojekte, Investment-Einheiten und Projektvertrieb." },
          { title: "Verkäufer-Leadgenerierung für Makler", audience: "Makler", body: "Lokalisierte Funnels für Eigentümer mit echter Verkaufsabsicht." },
          { title: "Käufer-Leadgenerierung für Makler", audience: "Makler", body: "Search- und Social-Kampagnen, gefiltert nach Käufer-Intent und Besichtigungsnähe." },
          { title: "Vertriebs-Assets", audience: "Beide", body: "Landingpage-Texte, Lead Magnets, Sales Decks, Projektvisuals und Kampagnenassets." }
        ]
      },
      playbookSection: {
        title: "Starten Sie mit dem Playbook, das zu Ihrer Pipeline passt.",
        body: "Kein direkter PDF-Download. Wählen Sie das relevante Playbook, senden Sie das Formular ab und HubSpot sendet die passende Ressource per E-Mail."
      },
      beforeAfter: {
        beforeTitle: "Vor Novalure",
        afterTitle: "Nach dem System",
        before: ["Portalabhängigkeit", "Unqualifizierte Anfragen", "Keine CRM-Übergabe", "Keine Follow-up-Automatisierung", "Klickberichte ohne Vertriebsklarheit", "Vertrieb verliert Zeit"],
        after: ["Qualifizierte Gespräche", "CRM-fähige Leads", "Strukturiertes Follow-up", "Klare Funnel-Logik", "Besserer Vertriebsfokus", "Pipeline-Sichtbarkeit"]
      },
      process: {
        id: "prozess",
        title: "Ein strukturierter Sales-System-Prozess, kein Raten bei Kampagnen.",
        body: "Jeder Schritt reduziert Rauschen, schützt Vertriebszeit und macht Pipeline-Entwicklung sichtbar.",
        steps: ["Pipeline-Audit", "Strategie & Funnel-Architektur", "Aufbau & Einrichtung", "Kampagnenstart", "Lead-Qualifizierung", "CRM-Übergabe", "Optimierung & Reporting"]
      },
      team: {
        id: "team",
        title: "Senior-geführtes Spezialistenteam für Immobilienvertrieb.",
        body:
          "Novalure verbindet kommerzielles Vertriebsdenken mit Funnel-Architektur, Performance Marketing, CRM-Operations und Vertriebs-Assets. Die Arbeit bleibt fokussiert, weil das Team spezialisiert ist.",
        pillars: ["Immobilienvertriebsstrategie", "Funnel-Architektur", "Performance Marketing", "CRM- und Lead-Operations", "Vertriebs-Assets & Content"],
        founder: "Franz Romih — Real Estate Sales Lead"
      },
      faq: sharedFaq.de,
      finalCtaTitle: "Laden Sie das Playbook herunter. Danach buchen Sie ein Pipeline-Audit, wenn Ihr aktuelles Lead-System geprüft werden soll."
    },
    developers: {
      key: "developers",
      locale: "de",
      template: "audience",
    eyebrow: "Für Bauträger und Projektentwickler",
    title: "Bauträger-Marketing für eine kontrollierbare Käufer-Pipeline.",
    seoTitle: "Bauträger-Marketing & Leadgenerierung | Projekt-Pipeline | Novalure",
    description:
      "Bauträger-Marketing für Neubau- und Immobilienprojekte: Projekt-Funnels, Käuferqualifizierung, CRM-Übergabe und planbare Pipeline statt nur Impressionen.",
      primaryCta: { label: labels.de.download, target: "playbooks" },
      secondaryCta: { label: labels.de.audit, target: "contact" },
    heroBullets: ["Bauträger-Leads", "Neubauprojekte", "Käuferqualifizierung", "Projekt-Funnels"],
    sections: [
      { title: "Bauträger-Marketing braucht mehr als Reichweite", body: "Projekt-Launches erzeugen oft Aufmerksamkeit, bevor Vertriebsklarheit entsteht. Bauträger-Marketing wird erst wertvoll, wenn Käuferanfragen qualifiziert, sauber übergeben und im Vertrieb sichtbar werden.", items: ["Kampagnen optimieren auf CPL statt auf Projekt-Pipeline", "Landingpages qualifizieren Kaufabsicht nicht sauber", "Keine strukturierte CRM-Übergabe für den Projektvertrieb"] },
      { title: "Leadgenerierung für Neubau- und Immobilienprojekte", body: "Novalure verbindet Positionierung, Projekt-Landingpages, Google- und Meta-Kampagnen, Qualifizierung und Sales Reporting in einer kontrollierten Launch-Architektur." },
      { title: "Projekt-Funnel für Bauträger", body: "Jedes Projekt erhält eine eigene Funnel-Logik rund um Lage, Käuferprofil, Investment Case, Wohnungsmix und Reife für den nächsten Schritt." },
      { title: "Käuferqualifizierung vor der Vertriebsübergabe", body: "Wir trennen allgemeine Neugier von Kaufsignalen, mit denen Ihr Vertrieb arbeiten kann, ohne unbelegbare Lead-Versprechen zu machen." },
      { title: "CRM-Übergabe für den Projektvertrieb", body: "Der Vertrieb erhält Quelle, Kaufabsicht und Gesprächskontext, damit der erste Kontakt näher an einem echten Kaufgespräch beginnt." }
      ],
      faq: sharedFaq.de.slice(0, 8)
    },
    agents: {
      key: "agents",
      locale: "de",
      template: "audience",
      eyebrow: "Für Immobilienmakler",
    title: "Leadgenerierung für Immobilienmakler, die nicht bei Portalen endet.",
    seoTitle: "Leadgenerierung für Immobilienmakler | Makler Lead System | Novalure",
    description:
      "Novalure baut ein digitales Lead-System für Immobilienmakler: Verkäufer- und Käufer-Leads, Qualifizierung, CRM-Übergabe und weniger Portalabhängigkeit.",
      primaryCta: { label: labels.de.download, target: "playbooks" },
      secondaryCta: { label: labels.de.audit, target: "contact" },
    heroBullets: ["Immobilienmakler-Leads", "Verkäufer-Leads", "Käufer-Leads", "CRM-Follow-up"],
    sections: [
      { title: "Makler-Leadgenerierung ohne reine Portalabhängigkeit", body: "Portale schaffen Reichweite, aber selten eine eigene Pipeline. Professionelle Immobilienmakler brauchen Verkäufer- und Käufer-Funnels, die sie selbst steuern, qualifizieren und nachverfolgen können.", items: ["Portalabhängigkeit", "Schwacher Eigentümer-Intent", "Käuferanfragen ohne Reife", "Manuelle Follow-up-Lücken"] },
      { title: "Verkäufer-Leadgenerierung für Immobilienmakler", body: "Lokalisierte Kampagnen und Landingpages positionieren Ihr Team als Spezialist für Markt, Objekttyp oder Verkäufersituation." },
      { title: "Käufer-Leadgenerierung mit lokaler Funnel-Logik", body: "Suchmaschinen- und Social-Kampagnen erfassen aktive Nachfrage und filtern nach Besichtigungsnähe, Budgetkontext und Kaufabsicht." },
      { title: "Eigenes lokales Funnel-System", body: "Ihre Pipeline wird zu einem eigenen vertrieblichen Asset, nicht nur zu einer Liste externer Anfragen." },
      { title: "CRM-Follow-up für Maklerteams", body: "Leads sind so strukturiert, dass Ihr Team weiß, wen es kontaktieren soll, warum die Person konvertiert hat und welcher nächste Schritt sinnvoll ist." }
      ],
      faq: sharedFaq.de.slice(0, 8)
    },
    playbooks: {
      key: "playbooks",
      locale: "de",
      template: "playbooks",
      eyebrow: "Playbook Hub",
      title: "Wählen Sie das Playbook für Ihr Pipeline-Problem.",
      seoTitle: "Immobilien-Playbooks für Bauträger & Makler | Novalure",
      description:
        "Laden Sie das Bauträger-Pipeline-Playbook oder Makler-Lead-Playbook über HubSpot-Formulare herunter.",
      primaryCta: { label: labels.de.download, target: "playbooks" },
      secondaryCta: { label: labels.de.audit, target: "contact" },
      heroBullets: ["Bauträger-Pipeline", "Makler-Lead-Systeme", "HubSpot-Versand", "Audit als nächster Schritt"],
      faq: sharedFaq.de.slice(6, 12)
    },
    contact: {
      key: "contact",
      locale: "de",
      template: "contact",
      eyebrow: "Pipeline-Audit",
      title: "Buchen Sie eine vertrauliche Prüfung Ihres aktuellen Lead-Systems.",
      seoTitle: "Pipeline-Audit für Immobilienvertrieb | Novalure",
      description:
        "Buchen Sie ein unverbindliches Pipeline-Audit für Positionierung, Funnel-Logik, CRM-Übergabe und Lücken in der Leadqualität.",
      primaryCta: { label: labels.de.audit, target: "contact" },
      secondaryCta: { label: labels.de.download, target: "playbooks" },
      heroBullets: ["Kein generischer Pitch", "Lead-System-Diagnose", "Klare nächste Schritte", "Microsoft-Teams-Termin"],
      sections: [
        { title: "Was das Audit ist", body: "Eine fokussierte Prüfung Ihrer aktuellen Leadgenerierung, Vertriebsübergabe und Pipeline-Sichtbarkeit." },
        { title: "Für wen es geeignet ist", body: "Bauträger, Projektvertriebe, Maklerteams und Immobilienmakler, die mehr qualifizierte Gespräche führen möchten." },
        { title: "Was Sie vorbereiten sollten", body: "Bringen Sie Ihr Projekt oder Marktgebiet, aktuelle Leadquellen, Ihr CRM-Setup und den Punkt mit, an dem Vertriebsmomentum am häufigsten verloren geht." }
      ],
      faq: sharedFaq.de.slice(0, 6)
    },
    imprint: legal("de", "imprint"),
    privacy: legal("de", "privacy"),
    cookies: legal("de", "cookies")
  }
};

function legal(locale: Locale, key: "imprint" | "privacy" | "cookies"): PageContent {
  const titles = {
    en: {
      imprint: "Legal Imprint",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy"
    },
    de: {
      imprint: "Impressum",
      privacy: "Datenschutzerklärung",
      cookies: "Cookie-Richtlinie"
    }
  };

  const body = locale === "en"
    ? "This legal page is a placeholder and requires legal review before launch. Do not publish without replacing the bracketed fields with verified legal information."
    : "Diese rechtliche Seite ist ein Platzhalter und erfordert vor dem Launch eine rechtliche Prüfung. Bitte nicht veröffentlichen, bevor die Platzhalter mit geprüften Angaben ersetzt wurden.";

  if (key === "imprint") {
    const imprintTitle = locale === "en" ? "Legal Imprint" : "Impressum";
    const imprintBody =
      "This imprint is based on the company information provided in Novalure CLG's General Terms and Conditions. It should be reviewed by legal counsel before final publication.";

    return {
      key,
      locale,
      template: "legal",
      eyebrow: "Company information",
      title: imprintTitle,
      seoTitle: `${imprintTitle} | Novalure`,
      description: "Company and contact information for Novalure CLG, an Irish company limited by guarantee.",
      primaryCta: { label: labels[locale].download, target: "playbooks" },
      secondaryCta: { label: labels[locale].audit, target: "contact" },
      heroBullets: [
        "Novalure CLG",
        "20 Harcourt Street, Dublin 2, D02 H364, Ireland",
        "Registration number: 796735",
        "hello@novalure.eu",
      ],
      sections: [
        {
          title: "Company Information",
          body: imprintBody,
          items: [
            "Novalure CLG",
            "A company limited by guarantee incorporated under the laws of Ireland",
            "Registered with: Companies Registration Office (CRO), Ireland",
            "Registration number: 796735",
            "Registered office: 20 Harcourt Street, Dublin 2, D02 H364, Ireland",
            "E-mail: hello@novalure.eu"
          ]
        },
        {
          title: "Business Activity",
          body:
            "Novalure CLG operates as an independent international advisory and consulting firm specialising in real estate-related structuring, project advisory and investor sourcing services."
        },
        {
          title: "Regulatory Position",
          body:
            "Novalure provides non-regulated advisory and consulting services. Novalure does not act as a regulated real estate broker, financial intermediary, investment firm, credit institution, payment service provider, trustee or escrow agent."
        },
        {
          title: "No Handling of Client or Investor Funds",
          body:
            "Novalure never holds, receives, manages or administers client funds, investor funds or third-party assets. All payments between clients and third parties are conducted directly between those parties."
        },
        {
          title: "Legal Review Notice",
          body:
            "This imprint should be reviewed by qualified legal counsel before publication. Company registration number, VAT number and any additional mandatory disclosure details should be added if legally required."
        },
        {
          title: "Last Updated",
          body: "December 2025"
        }
      ]
    };
  }

  if (key === "privacy") {
    return {
      key,
      locale,
      template: "legal",
      eyebrow: "Data protection",
      title: "Privacy Policy",
      seoTitle: "Privacy Policy | Novalure",
      description:
        "This Privacy Policy explains how Novalure CLG collects, uses, stores and protects personal data under the GDPR and Irish data protection law.",
      primaryCta: { label: labels[locale].download, target: "playbooks" },
      secondaryCta: { label: labels[locale].audit, target: "contact" },
      heroBullets: [
        "Novalure CLG",
        "GDPR and Irish Data Protection Act 2018",
        "Consent-based analytics and marketing tracking",
        "hello@novalure.eu"
      ],
      sections: [
        {
          title: "1. Introduction",
          body:
            "This Privacy Policy explains how Novalure CLG (\"we\", \"us\", \"our\") collects, uses, stores and protects personal data in accordance with the General Data Protection Regulation (EU) 2016/679 (GDPR), the Irish Data Protection Act 2018 and applicable ePrivacy rules. We are committed to protecting your privacy and handling your personal data in a transparent and lawful manner."
        },
        {
          title: "2. Data Controller",
          body:
            "The data controller is Novalure CLG, 20 Harcourt Street, Dublin 2, D02 H364, Ireland. E-mail: hello@novalure.eu. Website: www.novalure.eu."
        },
        {
          title: "3. Scope of Application",
          body:
            "This Privacy Policy applies to visitors of our website, prospective clients, investors and business partners, users downloading playbooks, users booking meetings and users contacting us via email, forms or other communication channels."
        },
        {
          title: "4. Legal Basis for Processing",
          body:
            "We process personal data on one or more of the following legal bases under Article 6 GDPR: consent, performance of a contract or pre-contractual measures, compliance with legal obligations, and legitimate interests such as business communication, website security, internal administration and B2B marketing where such interests are not overridden by your rights."
        },
        {
          title: "5. Categories of Personal Data",
          body:
            "Depending on your interaction with us, we may process identification data, contact data, company information, business and project-related information, communication content, form submissions, meeting booking information, marketing preferences and technical data such as IP address, browser type, device information, cookie identifiers, page interactions and referral information."
        },
        {
          title: "6. Purposes of Processing",
          body:
            "We process personal data to operate and secure the website, respond to enquiries, provide advisory and consulting services, manage contractual and pre-contractual relationships, deliver requested playbooks, schedule meetings, maintain CRM records, analyse website performance, measure marketing campaigns, improve user experience and comply with legal or regulatory obligations."
        },
        {
          title: "7. Forms, Playbooks and Meeting Bookings",
          body:
            "When you submit a playbook form or book a meeting, we process the information you provide in order to respond to your request, send the relevant playbook, prepare the meeting and manage follow-up communication. We may use HubSpot for forms, CRM and meeting scheduling, Resend for transactional email delivery and Microsoft Teams or Microsoft 365 for meeting communication."
        },
        {
          title: "8. Cookies, Analytics and Tracking Technologies",
          body:
            "Our website uses cookies and similar technologies. Strictly necessary technologies are used to operate the website and remember consent preferences. Analytics, marketing and behavioural tracking technologies are used only where legally permitted and, where required, only after your prior consent. These may include Google Analytics 4, Google Tag Manager, Meta Pixel, Hotjar, HubSpot Tracking Code, LinkedIn Insight Tag and other analytics or advertising tools configured in the cookie consent system. You can withdraw or change your consent at any time through the cookie settings on the website."
        },
        {
          title: "9. Hosting and Technical Infrastructure",
          body:
            "Our website may be hosted and delivered through professional technical service providers such as Vercel and related infrastructure providers. We may also use Sanity for content management, HubSpot for CRM and forms, Resend for email delivery, Microsoft 365 and Microsoft Teams for communication, and other service providers required to operate the website and business systems."
        },
        {
          title: "10. Disclosure of Data to Third Parties",
          body:
            "We do not sell or rent personal data. Personal data may be disclosed to processors and service providers, professional advisors, authorities where legally required, and business partners where this is necessary for the requested service or communication. Processors are bound by contractual safeguards, including Data Processing Agreements where required."
        },
        {
          title: "11. International Data Transfers",
          body:
            "Some service providers may process data outside the EU or EEA. Where personal data is transferred internationally, we rely on adequacy decisions, Standard Contractual Clauses, supplementary safeguards or another lawful transfer mechanism under Articles 44 to 49 GDPR."
        },
        {
          title: "12. Data Retention",
          body:
            "We retain personal data only for as long as necessary for the relevant purpose, including responding to enquiries, maintaining business records, fulfilling contracts, complying with statutory retention obligations and establishing or defending legal claims. Marketing and tracking data is retained in accordance with the relevant tool settings and consent choices."
        },
        {
          title: "13. Your Rights",
          body:
            "You have the right of access, rectification, erasure, restriction of processing, data portability, objection to processing and withdrawal of consent at any time. Requests can be submitted to hello@novalure.eu. Withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal."
        },
        {
          title: "14. Right to Lodge a Complaint",
          body:
            "You have the right to lodge a complaint with a supervisory authority. The competent supervisory authority in Ireland is the Data Protection Commission (DPC), 6 Pembroke Row, Dublin 2, D02 X963, Ireland."
        },
        {
          title: "15. Security Measures",
          body:
            "We implement appropriate technical and organisational measures to protect personal data against loss, misuse, unauthorised access, disclosure, alteration or destruction."
        },
        {
          title: "16. Changes to This Privacy Policy",
          body:
            "We may update this Privacy Policy where necessary to reflect legal, technical or business changes. The current version is always available on our website."
        },
        {
          title: "17. Contact",
          body:
            "If you have any questions about this Privacy Policy or the processing of your personal data, please contact Novalure CLG at hello@novalure.eu."
        },
        {
          title: "Last Updated",
          body: "December 2025"
        }
      ]
    };
  }

  if (key === "cookies") {
    return {
      key,
      locale,
      template: "legal",
      eyebrow: "Cookie information",
      title: "Cookie Policy",
      seoTitle: "Cookie Policy | Novalure",
      description:
        "This Cookie Policy explains how Novalure CLG uses cookies, pixels, analytics tools, marketing tags and external embeds on www.novalure.eu.",
      primaryCta: { label: labels[locale].download, target: "playbooks" },
      secondaryCta: { label: labels[locale].audit, target: "contact" },
      heroBullets: [
        "Necessary cookies are always active",
        "Analytics and marketing require consent",
        "Consent can be changed at any time",
        "GDPR and Irish ePrivacy aligned"
      ],
      sections: [
        {
          title: "1. Introduction",
          body:
            "This Cookie Policy explains how Novalure CLG (\"we\", \"us\", \"our\") uses cookies and similar technologies on www.novalure.eu. Similar technologies include pixels, tags, local storage, scripts, tracking identifiers and embedded third-party tools. This policy should be read together with our Privacy Policy."
        },
        {
          title: "2. What Cookies Are",
          body:
            "Cookies are small text files stored on your device when you visit a website. They can help a website work properly, remember preferences, measure performance, analyse user behaviour, support marketing campaigns or display external embedded content."
        },
        {
          title: "3. Legal Basis and Consent",
          body:
            "Under GDPR and Irish ePrivacy rules, strictly necessary cookies may be used where they are required to provide the website or a service requested by the user. Optional cookies and similar technologies, including analytics, marketing, behavioural tracking and many third-party embeds, are used only where legally permitted and, where required, only after your prior consent. Consent must be freely given, specific, informed and unambiguous. You can withdraw or change your consent at any time."
        },
        {
          title: "4. Cookie Banner and Consent Choices",
          body:
            "Our cookie banner is designed to give you a clear choice. Optional categories are not pre-selected. You can accept all optional cookies, reject all optional cookies and use necessary cookies only, or save a custom selection by category. Rejecting optional cookies does not prevent you from using the website."
        },
        {
          title: "5. Necessary Technologies",
          body:
            "Necessary technologies are required for the basic operation, security and functionality of the website. They may include technologies used for routing, page delivery, security, form operation, consent storage and basic technical functionality. These technologies do not require consent where they are strictly necessary."
        },
        {
          title: "6. Analytics Technologies",
          body:
            "Analytics technologies help us understand how visitors use the website, which pages are visited, how users interact with content and where technical or content improvements may be needed. We may use Google Analytics 4, Google Tag Manager and Hotjar for analytics, performance measurement, interaction analysis and website improvement. These tools are activated only where the relevant consent has been given."
        },
        {
          title: "7. Marketing and Advertising Technologies",
          body:
            "Marketing technologies help us measure campaign performance, understand lead sources, build advertising audiences and improve B2B marketing communication. We may use Meta Pixel, LinkedIn Insight Tag, HubSpot Tracking Code, Google Tag Manager and related advertising or conversion measurement technologies. These tools are activated only where the relevant consent has been given."
        },
        {
          title: "8. External Media and Embedded Services",
          body:
            "Some parts of the website may use external services or embeds, such as HubSpot forms, HubSpot meeting scheduler, Microsoft Teams-related meeting workflows or other third-party content. Where these services set optional cookies or process data for non-essential purposes, they are loaded only after the relevant consent where required."
        },
        {
          title: "9. Tools That May Be Used",
          body:
            "Depending on configuration and your consent choices, the website may use the following providers or systems: Vercel for hosting and delivery, Sanity for content management, HubSpot for forms, CRM, tracking and meeting scheduling, Resend for transactional email delivery, Microsoft 365 and Microsoft Teams for communication and meetings, Google Analytics 4, Google Tag Manager, Meta Pixel, Hotjar and LinkedIn Insight Tag."
        },
        {
          title: "10. Consent Categories",
          body:
            "Necessary: required for the website and always active. Analytics: used to measure and improve website performance and user experience. Marketing: used to measure advertising campaigns, lead sources and remarketing audiences. External media and embeds: used to display or enable third-party content and embedded tools."
        },
        {
          title: "11. Managing or Withdrawing Consent",
          body:
            "You can change or withdraw your consent at any time by opening the cookie settings on the website. When you withdraw consent, optional tracking technologies will no longer be activated from that point forward. You can also delete cookies through your browser settings."
        },
        {
          title: "12. Browser Settings",
          body:
            "Most browsers allow you to block, delete or restrict cookies. If you disable cookies through your browser, some website functions may not work as intended. Browser-level settings are separate from the consent choices provided on this website."
        },
        {
          title: "13. International Transfers",
          body:
            "Some providers may process data outside the EU or EEA. Where this occurs, Novalure relies on adequacy decisions, Standard Contractual Clauses or other lawful transfer mechanisms under GDPR, as further explained in our Privacy Policy."
        },
        {
          title: "14. Updates to This Cookie Policy",
          body:
            "We may update this Cookie Policy if our website, legal requirements or technology providers change. The current version is always available on this website."
        },
        {
          title: "15. Contact",
          body:
            "If you have questions about cookies, consent or data protection, please contact Novalure CLG at hello@novalure.eu."
        },
        {
          title: "Last Updated",
          body: "December 2025"
        }
      ]
    };
  }

  return {
    key,
    locale,
    template: "legal",
    eyebrow: locale === "en" ? "Legal review required" : "Rechtliche Prüfung erforderlich",
    title: titles[locale][key],
    seoTitle: `${titles[locale][key]} | Novalure`,
    description: body,
    primaryCta: { label: labels[locale].download, target: "playbooks" },
    secondaryCta: { label: labels[locale].audit, target: "contact" },
    heroBullets: ["[COMPANY LEGAL NAME]", "[REGISTERED ADDRESS]", "[COMPANY NUMBER]", "[VAT NUMBER]"],
    sections: [
      {
        title: locale === "en" ? "Required placeholders" : "Erforderliche Platzhalter",
        body,
        items: [
          "[COMPANY LEGAL NAME]",
          "[REGISTERED ADDRESS]",
          "[COMPANY NUMBER]",
          "[VAT NUMBER]",
          "[RESPONSIBLE PERSON]",
          "[EMAIL]",
          "[HOSTING PROVIDER]",
          "[HUBSPOT DETAILS]",
          "[ANALYTICS TOOLS]",
          "[COOKIE CONSENT PROVIDER]"
        ]
      },
      {
        title: locale === "en" ? "External tools placeholder" : "Externe Tools Platzhalter",
        body: locale === "en"
          ? "HubSpot, analytics, tracking and cookie consent vendors must be listed here after final configuration."
          : "HubSpot, Analytics, Tracking und Cookie-Consent-Anbieter müssen nach finaler Konfiguration hier aufgeführt werden."
      }
    ]
  };
}
