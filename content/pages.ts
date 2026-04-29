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
    audit: "Book Private Growth Audit",
    developerPlaybook: "Developer Pipeline Playbook",
    agentPlaybook: "Real Estate Agent Lead Playbook"
  },
  de: {
    download: "Playbook herunterladen",
    audit: "Privates Growth Audit buchen",
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
      answer: "HubSpot captures the request, sends the relevant Playbook by email and offers a secondary audit CTA for teams that want their current lead system reviewed."
    },
    {
      question: "Is this GDPR-ready?",
      answer: "The build is prepared for consent-first tracking and lawful HubSpot embeds. Final legal wording, vendor lists and consent settings must be reviewed before launch."
    },
    {
      question: "What budget should a client expect?",
      answer: "Budgets depend on market, project type, sales cycle, assets and media requirements. Pricing is handled through a private audit and custom proposal, not public packages."
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
      answer: "Nein. Wir versprechen keine nicht belegbaren Lead-Zahlen. Wir bauen das System, die Qualifizierungslogik und das Reporting, um Leadqualität und Vertriebsübersicht zu verbessern."
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
      answer: "HubSpot erfasst die Anfrage, sendet das passende Playbook per E-Mail und bietet als nächsten Schritt ein privates Audit des aktuellen Lead-Systems an."
    },
    {
      question: "Ist das DSGVO-ready?",
      answer: "Der Build ist für consent-basiertes Tracking und rechtlich steuerbare HubSpot-Embeds vorbereitet. Finale Rechtstexte, Vendorenlisten und Consent-Einstellungen müssen vor dem Launch geprüft werden."
    },
    {
      question: "Mit welchem Budget sollte man rechnen?",
      answer: "Das hängt von Markt, Projektart, Sales Cycle, vorhandenen Assets und Media-Anforderungen ab. Preise entstehen nach Diagnose im privaten Audit und als individuelles Angebot."
    },
    {
      question: "Wer setzt die Arbeit um?",
      answer: "Ein senior-geführtes Spezialistenteam verbindet Real Estate Sales Strategy, Funnel Architecture, Performance Marketing, CRM & Lead Operations sowie Sales Assets & Content."
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
        title: "You do not have a lead problem. You have a wrong-leads problem.",
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
          { label: "Layer 1", title: "Project Funnel Architecture", body: "One project, one market, one buyer logic. Mobile-first pages built to qualify intent before submission." },
          { label: "Layer 2", title: "Multi-Channel Lead Generation", body: "Google, Meta and retargeting campaigns connected to buyer behavior, not vanity traffic." },
          { label: "Layer 3", title: "Lead Qualification Layer", body: "Intent, fit and readiness filters prioritize serious buyers and sellers before sales handover." },
          { label: "Layer 4", title: "CRM Handover & Reporting", body: "Leads reach your CRM with source context, qualification notes and reporting your team can use." }
        ]
      },
      modules: {
        title: "Four modules. Pick what fits your growth system.",
        items: [
          { title: "Project Marketing for Developers", audience: "Developers", body: "Launch funnels for new developments, investment units and project sell-out." },
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
        title: "A sales-system process, not campaign guesswork.",
        body: "Each step is designed to reduce noise, protect sales time and make pipeline movement visible.",
        steps: ["Private Growth Audit", "Strategy & Funnel Architecture", "Build & Setup", "Campaign Launch", "Lead Qualification", "CRM Handover", "Optimization & Reporting"]
      },
      team: {
        id: "team",
        title: "Senior-led specialist team, built around real estate sales.",
        body:
          "Novalure combines commercial sales thinking with funnel architecture, performance marketing, CRM operations and sales assets. It feels focused because the team is specialist, not generic.",
        pillars: ["Real Estate Sales Strategy", "Funnel Architecture", "Performance Marketing", "CRM & Lead Operations", "Sales Assets & Content"],
        founder: "Franz Romih — Founder & Real Estate Sales Lead"
      },
      faq: sharedFaq.en,
      finalCtaTitle: "Download the Playbook. Then decide if your current lead system deserves a private audit."
    },
    developers: {
      key: "developers",
      locale: "en",
      template: "audience",
      eyebrow: "For developers",
      title: "Your project does not need more impressions. It needs a controllable buyer pipeline.",
      seoTitle: "For Developers | Novalure PropTech Sales System",
      description:
        "Developer-focused PropTech Sales System for project funnel architecture, buyer qualification, CRM handover and launch reporting.",
      primaryCta: { label: labels.en.download, target: "playbooks" },
      secondaryCta: { label: labels.en.audit, target: "contact" },
      heroBullets: ["New developments", "Investment projects", "Project sales teams", "CRM-ready buyer demand"],
      sections: [
        { title: "Developer pain points", body: "Launches often create attention before they create sales clarity. Ad spend rises, enquiries stay mixed and sales teams receive leads without context.", items: ["Campaigns optimized for CPL instead of pipeline", "Landing pages that do not qualify intent", "No structured CRM handover"] },
        { title: "Developer PropTech Sales System", body: "Novalure connects positioning, project landing pages, traffic, qualification and sales reporting into one controlled launch architecture." },
        { title: "Project funnel architecture", body: "Each project gets a dedicated funnel logic around location, buyer profile, investment case, unit mix and next-step readiness." },
        { title: "Buyer qualification logic", body: "We separate casual curiosity from buyer signals your team can act on, without inventing unverifiable lead promises." },
        { title: "CRM handover", body: "Sales receives source, intent and conversation context so the first call starts closer to a real buying discussion." }
      ],
      faq: sharedFaq.en.slice(0, 8)
    },
    agents: {
      key: "agents",
      locale: "en",
      template: "audience",
      eyebrow: "For real estate agents",
      title: "Stop depending only on portals. Build your own lead pipeline.",
      seoTitle: "For Agents | Novalure PropTech Sales System",
      description:
        "Agent-focused lead infrastructure for seller lead generation, buyer lead generation, local funnels, CRM follow-up and pipeline visibility.",
      primaryCta: { label: labels.en.download, target: "playbooks" },
      secondaryCta: { label: labels.en.audit, target: "contact" },
      heroBullets: ["Seller demand", "Buyer funnels", "Local authority", "Follow-up structure"],
      sections: [
        { title: "Agent pain points", body: "Portals can create exposure, but they rarely create owned pipeline. Serious agents need seller and buyer lead flows they can control.", items: ["Portal dependency", "Weak owner intent", "Buyer enquiries without readiness", "Manual follow-up gaps"] },
        { title: "Seller lead generation", body: "Localized campaigns and landing pages position your team as the specialist for a market, property type or seller situation." },
        { title: "Buyer lead generation", body: "Search and social funnels capture active demand and filter for viewing readiness, budget context and intent." },
        { title: "Local funnel system", body: "Your pipeline becomes an owned operating asset, not just a list of third-party enquiries." },
        { title: "CRM follow-up", body: "Leads are structured so your team knows who to contact, why they converted and what follow-up should happen next." }
      ],
      faq: sharedFaq.en.slice(0, 8)
    },
    playbooks: {
      key: "playbooks",
      locale: "en",
      template: "playbooks",
      eyebrow: "Playbook hub",
      title: "Choose the Playbook for your pipeline problem.",
      seoTitle: "Playbooks | Novalure",
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
      eyebrow: "Private Growth Audit",
      title: "Book a private review of your current lead system.",
      seoTitle: "Contact | Book a Private Growth Audit",
      description:
        "Book a no-pressure private audit to review your project positioning, funnel logic, CRM handover and lead quality gaps.",
      primaryCta: { label: labels.en.audit, target: "contact" },
      secondaryCta: { label: labels.en.download, target: "playbooks" },
      heroBullets: ["No generic pitch", "Lead-system diagnosis", "Clear next steps", "HubSpot scheduler placeholder"],
      sections: [
        { title: "What the audit is", body: "A focused review of your current lead generation, sales handover and pipeline visibility." },
        { title: "Who it is for", body: "Developers, project sellers, broker teams and agents who want better qualified conversations." },
        { title: "What to prepare", body: "Bring your project or market focus, current lead sources, CRM setup and the biggest point where sales momentum breaks." }
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
      heroBullets: ["Keine klassische Agentur", "Nicht nur eine Website", "Nicht einfach nur Werbung", "Vom ersten Klick zur CRM-fähigen Chance"],
      audience: {
        title: "Gebaut für die zwei Immobilien-Teams, die Pipeline-Klarheit am stärksten brauchen.",
        cards: [
          {
            title: "Für Bauträger",
            body: "Steuern Sie Käufernachfrage für Neubauprojekte, Investmentprojekte und Projektlaunches, bevor Momentum im Vertrieb verloren geht.",
            hrefKey: "developers",
            points: ["Projekt-Funnel-Architektur", "Käufer-Intent-Qualifizierung", "CRM-fähige Übergabe"]
          },
          {
            title: "Für Immobilienmakler",
            body: "Reduzieren Sie Portalabhängigkeit und bauen Sie eigene Verkäufer- und Käufer-Funnels für ernsthafte Gespräche.",
            hrefKey: "agents",
            points: ["Verkäufer-Lead-Systeme", "Käufer-Lead-Funnels", "Strukturiertes Follow-up"]
          }
        ]
      },
      problem: {
        title: "Sie haben kein Lead-Problem. Sie haben ein Falsche-Leads-Problem.",
        body:
          "Die meisten Marketing-Setups bringen Volumen. Volumen ist nicht die Metrik. Pipeline ist es. Portale, Anzeigen und Landingpages zählen nur, wenn daraus qualifizierte Gespräche entstehen.",
        points: [
          { title: "Klickberichte ohne Vertriebsklarheit", body: "Kampagnen optimieren häufig Aufmerksamkeit, während Ihr Vertrieb Reife, Kontext und nächste Schritte braucht." },
          { title: "Unqualifizierte Anfragen kosten Zeit", body: "Wenn Leadqualität nicht gesteuert wird, filtert Ihr Vertrieb, statt zu verkaufen." },
          { title: "Portale sind kein System", body: "Sie können Reichweite schaffen, aber sie besitzen nicht Ihre Funnel-Logik, CRM-Übergabe oder Follow-up-Disziplin." }
        ]
      },
      system: {
        title: "Vier Schichten. Ein Ergebnis.",
        body: "Keine Magie. Keine Black Box. Konstruiert entlang der Realität, wie Immobilien verkauft werden.",
        layers: [
          { label: "Schicht 1", title: "Projekt-Funnel-Architektur", body: "Ein Projekt, ein Markt, eine Käuferlogik. Mobile-first Seiten, die Intent vor der Anfrage qualifizieren." },
          { label: "Schicht 2", title: "Multi-Channel-Lead-Generation", body: "Google, Meta und Retargeting verbunden mit Kaufverhalten statt Vanity Traffic." },
          { label: "Schicht 3", title: "Lead-Qualifizierungs-Schicht", body: "Intent-, Fit- und Bereitschaftsfilter priorisieren ernsthafte Käufer und Verkäufer vor der Übergabe." },
          { label: "Schicht 4", title: "CRM-Übergabe & Reporting", body: "Leads erreichen Ihr CRM mit Quellenkontext, Qualifizierungsnotizen und nutzbarem Reporting." }
        ]
      },
      modules: {
        title: "Vier Module. Wählen Sie, was zu Ihrem Growth System passt.",
        items: [
          { title: "Project Marketing für Bauträger", audience: "Bauträger", body: "Launch-Funnels für Neubauprojekte, Investment-Einheiten und Projektvertrieb." },
          { title: "Seller Lead Generation für Makler", audience: "Makler", body: "Lokalisierte Funnels für Eigentümer mit echter Verkaufsabsicht." },
          { title: "Buyer Lead Generation für Makler", audience: "Makler", body: "Search- und Social-Kampagnen, gefiltert nach Käufer-Intent und Besichtigungsnähe." },
          { title: "Sales Asset Production", audience: "Beide", body: "Landing Copy, Lead Magnets, Sales Decks, Projektvisuals und Kampagnenassets." }
        ]
      },
      playbookSection: {
        title: "Starten Sie mit dem Playbook, das zu Ihrer Pipeline passt.",
        body: "Kein direkter PDF-Download. Wählen Sie das relevante Playbook, senden Sie das Formular ab und HubSpot verschickt die passende Ressource per E-Mail."
      },
      beforeAfter: {
        beforeTitle: "Vor Novalure",
        afterTitle: "Nach dem System",
        before: ["Portalabhängigkeit", "Unqualifizierte Anfragen", "Keine CRM-Übergabe", "Keine Follow-up-Automation", "Klickberichte ohne Vertriebsklarheit", "Vertrieb verliert Zeit"],
        after: ["Qualifizierte Gespräche", "CRM-fähige Leads", "Strukturiertes Follow-up", "Klare Funnel-Logik", "Besserer Vertriebsfokus", "Pipeline-Sichtbarkeit"]
      },
      process: {
        id: "prozess",
        title: "Ein Sales-System-Prozess, kein Kampagnenraten.",
        body: "Jeder Schritt reduziert Rauschen, schützt Vertriebszeit und macht Pipeline-Bewegung sichtbar.",
        steps: ["Privates Growth Audit", "Strategie & Funnel Architecture", "Build & Setup", "Campaign Launch", "Lead Qualification", "CRM-Übergabe", "Optimierung & Reporting"]
      },
      team: {
        id: "team",
        title: "Senior-geführtes Spezialistenteam, gebaut um Real Estate Sales.",
        body:
          "Novalure verbindet kommerzielles Vertriebsdenken mit Funnel Architecture, Performance Marketing, CRM Operations und Sales Assets. Fokussiert, weil das Team spezialisiert ist.",
        pillars: ["Real Estate Sales Strategy", "Funnel Architecture", "Performance Marketing", "CRM & Lead Operations", "Sales Assets & Content"],
        founder: "Franz Romih — Gründer & Real Estate Sales Lead"
      },
      faq: sharedFaq.de,
      finalCtaTitle: "Laden Sie das Playbook herunter. Danach entscheiden Sie, ob Ihr aktuelles Lead-System ein privates Audit verdient."
    },
    developers: {
      key: "developers",
      locale: "de",
      template: "audience",
      eyebrow: "Für Bauträger",
      title: "Ihr Projekt braucht nicht mehr Impressionen. Es braucht eine steuerbare Käufer-Pipeline.",
      seoTitle: "Für Bauträger | Novalure PropTech Sales System",
      description:
        "PropTech Sales System für Bauträger: Projekt-Funnel-Architektur, Käuferqualifizierung, CRM-Übergabe und Launch-Reporting.",
      primaryCta: { label: labels.de.download, target: "playbooks" },
      secondaryCta: { label: labels.de.audit, target: "contact" },
      heroBullets: ["Neubauprojekte", "Investmentprojekte", "Projektvertrieb", "CRM-fähige Käufernachfrage"],
      sections: [
        { title: "Bauträger-Pain-Points", body: "Launches erzeugen oft Aufmerksamkeit, bevor Vertriebsklarheit entsteht. Media-Kosten steigen, Anfragen bleiben gemischt und der Vertrieb erhält Leads ohne Kontext.", items: ["Kampagnen optimieren CPL statt Pipeline", "Landingpages qualifizieren Intent nicht sauber", "Keine strukturierte CRM-Übergabe"] },
        { title: "Developer PropTech Sales System", body: "Novalure verbindet Positionierung, Projekt-Landingpages, Traffic, Qualifizierung und Sales Reporting in einer kontrollierten Launch-Architektur." },
        { title: "Projekt-Funnel-Architektur", body: "Jedes Projekt erhält eine eigene Funnel-Logik rund um Lage, Käuferprofil, Investment Case, Wohnungsmix und Next-Step-Reife." },
        { title: "Käufer-Qualifizierungslogik", body: "Wir trennen allgemeine Neugier von Kaufsignalen, mit denen Ihr Vertrieb arbeiten kann, ohne nicht belegbare Lead-Versprechen zu machen." },
        { title: "CRM-Übergabe", body: "Der Vertrieb erhält Quelle, Intent und Gesprächskontext, damit der erste Kontakt näher an einem echten Kaufgespräch beginnt." }
      ],
      faq: sharedFaq.de.slice(0, 8)
    },
    agents: {
      key: "agents",
      locale: "de",
      template: "audience",
      eyebrow: "Für Immobilienmakler",
      title: "Verlassen Sie sich nicht nur auf Portale. Bauen Sie Ihre eigene Lead-Pipeline.",
      seoTitle: "Für Makler | Novalure PropTech Sales System",
      description:
        "Lead-Infrastruktur für Immobilienmakler: Verkäufer-Leads, Käufer-Leads, lokale Funnels, CRM-Follow-up und Pipeline-Sichtbarkeit.",
      primaryCta: { label: labels.de.download, target: "playbooks" },
      secondaryCta: { label: labels.de.audit, target: "contact" },
      heroBullets: ["Verkäufernachfrage", "Käufer-Funnels", "Lokale Autorität", "Follow-up-Struktur"],
      sections: [
        { title: "Makler-Pain-Points", body: "Portale schaffen Reichweite, aber selten eigene Pipeline. Professionelle Makler brauchen Verkäufer- und Käufer-Flows, die sie steuern können.", items: ["Portalabhängigkeit", "Schwacher Eigentümer-Intent", "Käuferanfragen ohne Reife", "Manuelle Follow-up-Lücken"] },
        { title: "Seller Lead Generation", body: "Lokalisierte Kampagnen und Landingpages positionieren Ihr Team als Spezialist für Markt, Objekttyp oder Verkäufersituation." },
        { title: "Buyer Lead Generation", body: "Search- und Social-Funnels erfassen aktive Nachfrage und filtern nach Besichtigungsnähe, Budgetkontext und Intent." },
        { title: "Lokales Funnel-System", body: "Ihre Pipeline wird zu einem eigenen Betriebsvermögen, nicht nur zu einer Liste externer Anfragen." },
        { title: "CRM-Follow-up", body: "Leads sind so strukturiert, dass Ihr Team weiß, wen es kontaktieren sollte, warum die Person konvertiert hat und welcher nächste Schritt sinnvoll ist." }
      ],
      faq: sharedFaq.de.slice(0, 8)
    },
    playbooks: {
      key: "playbooks",
      locale: "de",
      template: "playbooks",
      eyebrow: "Playbook Hub",
      title: "Wählen Sie das Playbook für Ihr Pipeline-Problem.",
      seoTitle: "Playbooks | Novalure",
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
      eyebrow: "Privates Growth Audit",
      title: "Buchen Sie eine private Prüfung Ihres aktuellen Lead-Systems.",
      seoTitle: "Kontakt | Privates Growth Audit buchen",
      description:
        "Buchen Sie ein unverbindliches privates Audit für Positionierung, Funnel-Logik, CRM-Übergabe und Leadqualitätslücken.",
      primaryCta: { label: labels.de.audit, target: "contact" },
      secondaryCta: { label: labels.de.download, target: "playbooks" },
      heroBullets: ["Kein generischer Pitch", "Lead-System-Diagnose", "Klare nächste Schritte", "HubSpot Scheduler Platzhalter"],
      sections: [
        { title: "Was das Audit ist", body: "Eine fokussierte Prüfung Ihrer aktuellen Leadgenerierung, Vertriebsübergabe und Pipeline-Sichtbarkeit." },
        { title: "Für wen es geeignet ist", body: "Bauträger, Projektvertriebe, Maklerteams und Immobilienmakler, die bessere qualifizierte Gespräche wollen." },
        { title: "Was Sie vorbereiten sollten", body: "Ihr Projekt oder Marktgebiet, aktuelle Leadquellen, CRM-Setup und die Stelle, an der Vertriebsmomentum am häufigsten bricht." }
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
