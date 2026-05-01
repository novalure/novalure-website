import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("C:/Users/Franz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "playbooks");
const logoPath = path.join(root, "public", "novalure-logo.png");
const whiteLogoPath = path.join(root, "public", "novalure-logo-white.png");
const logoData = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
const whiteLogoData = `data:image/png;base64,${fs.readFileSync(whiteLogoPath).toString("base64")}`;

fs.mkdirSync(outDir, { recursive: true });

function findLocalBrowser() {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    `${process.env.LOCALAPPDATA || ""}/Google/Chrome/Application/chrome.exe`,
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate));
}

const shared = {
  en: {
    label: "English edition",
    primaryCta: "Book a Private Growth Audit",
    primaryUrl: "https://www.novalure.eu/en/contact",
    footer: "Novalure | PropTech Sales System for real estate developers and agents",
    note: "This playbook is a strategic guide, not a promise of specific lead numbers, revenue, delivery timing or legal compliance. Use it to diagnose and structure your sales system before making operational decisions."
  },
  de: {
    label: "Deutsche Ausgabe",
    primaryCta: "Privates Growth Audit buchen",
    primaryUrl: "https://www.novalure.eu/de/kontakt",
    footer: "Novalure | PropTech Sales System fuer Bautraeger und Immobilienmakler",
    note: "Dieses Playbook ist ein strategischer Leitfaden und kein Versprechen bestimmter Lead-Zahlen, Umsaetze, Lieferzeiten oder rechtlicher Konformitaet. Nutzen Sie es zur Diagnose und Strukturierung Ihres Vertriebssystems."
  }
};

const playbooks = [
  {
    slug: "developer-pipeline-playbook-en",
    lang: "en",
    audience: "developer",
    eyebrow: "Developer Pipeline Playbook",
    title: "Build a controllable buyer pipeline for real estate projects.",
    subtitle:
      "A practical operating guide for developers, project sellers and new-build teams who need qualified conversations instead of campaign noise.",
    promise:
      "This playbook shows how to connect project positioning, landing pages, paid demand, qualification and CRM handover into one sales infrastructure.",
    forWhom: [
      "Real estate developers preparing a project launch",
      "New-build providers selling units with longer decision cycles",
      "Investment property project sellers who need buyer readiness",
      "Sales teams that need cleaner CRM context before calling leads"
    ],
    sections: [
      {
        title: "The core problem: project marketing often stops too early",
        body:
          "Most project campaigns are built to create visibility: impressions, portal enquiries, brochure downloads and campaign reports. Visibility is useful, but it is not the same as a buyer pipeline. A project pipeline only exists when demand is captured, filtered, enriched and handed to sales with enough context to create the next conversation.",
        bullets: [
          "A lead without project fit is a distraction.",
          "A form submission without budget context is only a name in a database.",
          "A campaign report without CRM feedback cannot teach the sales team where real intent comes from.",
          "A launch without qualification turns sales into manual filtering."
        ]
      },
      {
        title: "The pipeline principle",
        body:
          "Your project does not need more random attention. It needs controlled movement from first signal to qualified buyer conversation. Every step should reduce uncertainty: who is this person, what do they want, why this project, what is their decision stage, and what should sales do next?",
        bullets: [
          "Position the project around the real buying decision, not only the architecture.",
          "Separate curious visitors from serious buyers before sales handover.",
          "Use CRM fields that help the first call, not only marketing attribution.",
          "Review pipeline quality weekly, not only traffic volume."
        ]
      },
      {
        title: "The four-layer project system",
        body:
          "A strong developer system has four layers working together. If one layer is missing, the pipeline becomes fragile: campaigns generate volume, landing pages collect weak enquiries, or the CRM receives records nobody trusts.",
        bullets: [
          "Project funnel architecture: message, offer, page flow and conversion logic.",
          "Multi-channel demand: paid search, paid social, retargeting and selected organic assets.",
          "Buyer qualification: budget, time horizon, use case, location fit and readiness.",
          "CRM handover and reporting: clean records, source context, follow-up status and feedback loops."
        ]
      },
      {
        title: "Project funnel architecture",
        body:
          "The funnel should make the buying decision easier to understand. It must answer the questions serious buyers already have: why this project, what kind of unit fits them, what is the location logic, what is the investment or lifestyle case, what happens next, and what information must they provide before a serious conversation.",
        bullets: [
          "Hero message: project outcome, buyer type and core differentiator.",
          "Decision blocks: location, availability, unit logic, investment angle, process.",
          "Conversion path: playbook, project pack, private review, sales conversation.",
          "Trust path: transparent next steps instead of exaggerated claims."
        ]
      },
      {
        title: "Buyer qualification logic",
        body:
          "Qualification should protect sales time without making the buyer feel interrogated. The best forms and follow-up flows ask questions that feel natural to the decision: intended use, preferred unit type, budget corridor, purchase horizon, financing status and desired next step.",
        bullets: [
          "Use progressive questions: do not ask everything on the first screen.",
          "Mark urgency separately from fit; fast does not always mean qualified.",
          "Capture disqualifying factors early enough to avoid wasted calls.",
          "Let the CRM show why the lead is worth attention."
        ]
      },
      {
        title: "CRM-ready handover",
        body:
          "The handover is where most marketing systems become useful or useless. A CRM record should tell sales where the lead came from, what they requested, which answers they gave, what page they converted on, and what follow-up should happen next.",
        bullets: [
          "Minimum CRM fields: source, campaign, project, buyer type, budget range, time horizon, preferred next step.",
          "Sales task: assigned owner, first-contact deadline, follow-up sequence.",
          "Reporting: qualified rate, booked-call rate, no-fit reasons and sales feedback.",
          "Governance: agreed definitions for enquiry, qualified lead, opportunity and lost reason."
        ]
      },
      {
        title: "Launch checklist",
        body:
          "Before media spend scales, run the project through a readiness check. The goal is not perfection. The goal is to avoid spending budget into a funnel that cannot qualify, hand over or learn.",
        bullets: [
          "Project positioning is specific enough for a defined buyer type.",
          "Landing page explains the buying case clearly on mobile.",
          "Every CTA has a next step and owner.",
          "Forms capture meaningful intent without creating friction.",
          "HubSpot or CRM fields match the sales process.",
          "Follow-up templates exist before the first lead arrives.",
          "Reports show pipeline quality, not only clicks."
        ]
      },
      {
        title: "What to review every week",
        body:
          "A pipeline system improves through operating rhythm. Review the same questions weekly so marketing, sales and leadership make decisions from the same reality.",
        bullets: [
          "Which channels created qualified conversations?",
          "Which pages converted but created weak fit?",
          "Which qualification answers predict serious sales conversations?",
          "Where are leads waiting too long for follow-up?",
          "Which objections repeat often enough to become page content?",
          "Which CRM fields are missing for the first sales call?"
        ]
      },
      {
        title: "Recommended next step",
        body:
          "Map your current project launch against the four layers. Mark every missing or unclear layer before increasing media budget. If the system is not connected, more traffic will usually create more manual work instead of more pipeline.",
        bullets: [
          "Audit the current funnel.",
          "Define the buyer qualification model.",
          "Align CRM fields with sales handover.",
          "Build the reporting loop before scaling."
        ]
      }
    ]
  },
  {
    slug: "bautraeger-pipeline-playbook-de",
    lang: "de",
    audience: "developer",
    eyebrow: "Bautraeger-Pipeline-Playbook",
    title: "Bauen Sie eine steuerbare Kaeufer-Pipeline fuer Immobilienprojekte.",
    subtitle:
      "Ein praktischer Leitfaden fuer Bautraeger, Projektentwickler und Neubauvertriebe, die qualifizierte Gespraeche statt Kampagnenrauschen brauchen.",
    promise:
      "Dieses Playbook zeigt, wie Projektpositionierung, Landingpages, Nachfrage, Qualifizierung und CRM-Uebergabe zu einer Vertriebsinfrastruktur verbunden werden.",
    forWhom: [
      "Bautraeger vor oder waehrend eines Projektlaunches",
      "Neubauanbieter mit laengeren Entscheidungszyklen",
      "Projektvertriebe fuer Investment- oder Eigennutzerprojekte",
      "Vertriebsteams, die vor dem Erstgespraech besseren CRM-Kontext brauchen"
    ],
    sections: [
      {
        title: "Das Kernproblem: Projektmarketing hoert oft zu frueh auf",
        body:
          "Viele Projektkampagnen erzeugen Sichtbarkeit: Impressionen, Portal-Anfragen, Expose-Downloads und Reporting. Sichtbarkeit ist hilfreich, aber noch keine Kaeufer-Pipeline. Eine Pipeline entsteht erst, wenn Nachfrage erfasst, gefiltert, angereichert und mit genug Kontext an den Vertrieb uebergeben wird.",
        bullets: [
          "Ein Lead ohne Projekt-Fit bindet Zeit.",
          "Eine Formularanfrage ohne Budgetkontext ist nur ein Datensatz.",
          "Ein Kampagnenreport ohne CRM-Feedback zeigt nicht, wo echte Kaufabsicht entsteht.",
          "Ein Launch ohne Qualifizierung macht den Vertrieb zum manuellen Filter."
        ]
      },
      {
        title: "Das Pipeline-Prinzip",
        body:
          "Ihr Projekt braucht nicht mehr zufaellige Aufmerksamkeit. Es braucht kontrollierte Bewegung vom ersten Signal bis zum qualifizierten Kaeufergespraech. Jeder Schritt sollte Unsicherheit reduzieren: Wer ist diese Person, was sucht sie, warum dieses Projekt, wie weit ist die Entscheidung und was soll der Vertrieb als Naechstes tun?",
        bullets: [
          "Positionieren Sie das Projekt entlang der Kaufentscheidung, nicht nur entlang der Architektur.",
          "Trennen Sie Interessenten von ernsthaften Kaeufern vor der Vertriebsuebergabe.",
          "Nutzen Sie CRM-Felder, die dem Erstgespraech helfen.",
          "Bewerten Sie Pipeline-Qualitaet woechentlich, nicht nur Traffic-Volumen."
        ]
      },
      {
        title: "Das Vier-Schichten-System fuer Projekte",
        body:
          "Ein starkes Bautraeger-System besteht aus vier verbundenen Schichten. Fehlt eine davon, wird die Pipeline instabil: Kampagnen bringen Volumen, Landingpages sammeln schwache Anfragen oder das CRM enthaelt Datensaetze, denen niemand vertraut.",
        bullets: [
          "Projekt-Funnel-Architektur: Botschaft, Angebot, Seitenfluss und Conversion-Logik.",
          "Multi-Channel-Nachfrage: Search, Social, Retargeting und gezielte Content-Assets.",
          "Kaeufer-Qualifizierung: Budget, Zeithorizont, Nutzung, Lage-Fit und Bereitschaft.",
          "CRM-Uebergabe und Reporting: saubere Datensaetze, Quellenkontext, Follow-up-Status und Feedback."
        ]
      },
      {
        title: "Projekt-Funnel-Architektur",
        body:
          "Der Funnel muss die Kaufentscheidung verstaendlicher machen. Er sollte die Fragen beantworten, die ernsthafte Kaeufer bereits haben: Warum dieses Projekt, welche Einheit passt, welche Lage-Logik steckt dahinter, was ist der Investment- oder Eigennutzer-Case, was passiert als Naechstes und welche Informationen sind vor einem Gespraech sinnvoll?",
        bullets: [
          "Hero-Botschaft: Projektergebnis, Kaeufertyp und Kernunterscheidung.",
          "Entscheidungsbloecke: Lage, Verfuegbarkeit, Einheitentypen, Investmentlogik, Prozess.",
          "Conversion-Pfad: Playbook, Projektpaket, private Pruefung, Vertriebsgespraech.",
          "Trust-Pfad: klare naechste Schritte statt uebertriebener Versprechen."
        ]
      },
      {
        title: "Kaeufer-Qualifizierung",
        body:
          "Qualifizierung soll Vertriebszeit schuetzen, ohne den Kaeufer abzuschrecken. Gute Formulare und Follow-up-Flows fragen nach Dingen, die zur Entscheidung passen: Nutzung, bevorzugter Einheitentyp, Budgetkorridor, Kaufhorizont, Finanzierungsstatus und gewuenschter naechster Schritt.",
        bullets: [
          "Nutzen Sie progressive Fragen und fragen Sie nicht alles auf einmal.",
          "Trennen Sie Dringlichkeit von Fit; schnell bedeutet nicht automatisch qualifiziert.",
          "Erfassen Sie Ausschlusskriterien frueh genug, um unnoetige Calls zu vermeiden.",
          "Das CRM sollte sichtbar machen, warum ein Lead Aufmerksamkeit verdient."
        ]
      },
      {
        title: "CRM-ready Uebergabe",
        body:
          "Die Uebergabe entscheidet, ob Marketing operativ nuetzlich wird. Ein CRM-Datensatz sollte zeigen, woher der Lead kommt, was angefragt wurde, welche Antworten gegeben wurden, auf welcher Seite die Conversion entstand und welches Follow-up sinnvoll ist.",
        bullets: [
          "Mindestfelder: Quelle, Kampagne, Projekt, Kaeufertyp, Budgetrahmen, Zeithorizont, gewuenschter naechster Schritt.",
          "Vertriebsaufgabe: Owner, Frist fuer Erstkontakt, Follow-up-Sequenz.",
          "Reporting: Qualifizierungsrate, gebuchte Gespraeche, No-Fit-Gruende und Vertriebsfeedback.",
          "Governance: gemeinsame Definitionen fuer Anfrage, qualifizierten Lead, Opportunity und Lost Reason."
        ]
      },
      {
        title: "Launch-Checkliste",
        body:
          "Bevor Media-Budget skaliert wird, sollte das Projekt durch einen Readiness-Check laufen. Es geht nicht um Perfektion. Es geht darum, kein Budget in einen Funnel zu lenken, der nicht qualifizieren, uebergeben oder lernen kann.",
        bullets: [
          "Die Positionierung ist fuer einen konkreten Kaeufertyp formuliert.",
          "Die Landingpage erklaert den Kauf-Case klar auf Mobile.",
          "Jeder CTA hat einen naechsten Schritt und einen Verantwortlichen.",
          "Formulare erfassen echte Absicht ohne unnoetige Reibung.",
          "HubSpot- oder CRM-Felder passen zum Vertriebsprozess.",
          "Follow-up-Vorlagen existieren vor dem ersten Lead.",
          "Reports zeigen Pipeline-Qualitaet statt nur Klicks."
        ]
      },
      {
        title: "Was Sie jede Woche pruefen sollten",
        body:
          "Ein Pipeline-System verbessert sich durch Rhythmus. Pruefen Sie jede Woche dieselben Fragen, damit Marketing, Vertrieb und Fuehrung auf derselben Realitaet entscheiden.",
        bullets: [
          "Welche Kanaele erzeugen qualifizierte Gespraeche?",
          "Welche Seiten konvertieren, bringen aber schwachen Fit?",
          "Welche Qualifizierungsantworten korrelieren mit ernsthaften Gespraechen?",
          "Wo warten Leads zu lange auf Follow-up?",
          "Welche Einwaende tauchen oft genug auf, um Page-Content zu werden?",
          "Welche CRM-Felder fehlen fuer das Erstgespraech?"
        ]
      },
      {
        title: "Empfohlener naechster Schritt",
        body:
          "Vergleichen Sie Ihren aktuellen Projektlaunch mit den vier Schichten. Markieren Sie jede unklare oder fehlende Schicht, bevor Sie Media-Budget erhoehen. Wenn das System nicht verbunden ist, erzeugt mehr Traffic meistens mehr manuelle Arbeit statt mehr Pipeline.",
        bullets: [
          "Aktuellen Funnel auditieren.",
          "Kaeufer-Qualifizierungsmodell definieren.",
          "CRM-Felder mit der Vertriebsuebergabe abgleichen.",
          "Reporting-Loop vor Skalierung aufbauen."
        ]
      }
    ]
  },
  {
    slug: "real-estate-agent-lead-playbook-en",
    lang: "en",
    audience: "agent",
    eyebrow: "Real Estate Agent Lead Playbook",
    title: "Build owned seller and buyer pipeline beyond portal dependency.",
    subtitle:
      "A field guide for agents, broker teams and real estate sales teams that want qualified conversations they can control.",
    promise:
      "This playbook shows how to build local seller and buyer funnels, qualify intent and move opportunities into a structured follow-up system.",
    forWhom: [
      "Independent real estate agents who want more owned demand",
      "Broker teams that rely too heavily on portals",
      "Agencies that need seller lead generation and buyer nurture",
      "Sales teams that need a cleaner follow-up rhythm"
    ],
    sections: [
      {
        title: "The core problem: portal dependency is not a pipeline",
        body:
          "Portals can create visibility, but they rarely create control. The agent competes inside someone else’s marketplace, receives mixed intent and often starts from a weak context. Owned pipeline means you create your own demand paths: seller education, valuation intent, buyer segmentation, local proof of expertise and CRM follow-up.",
        bullets: [
          "Portal leads are often shared with many competitors.",
          "Seller intent is fragile when the first contact is generic.",
          "Buyer enquiries need segmentation before sales attention.",
          "Without follow-up infrastructure, today’s weak signal is simply lost."
        ]
      },
      {
        title: "The owned pipeline principle",
        body:
          "An agent lead system should not only ask for contact details. It should create a reason to engage, qualify the next step and keep the relationship alive until the person is ready. Good real estate sales is timing plus trust plus structured follow-up.",
        bullets: [
          "Use local expertise as the conversion asset.",
          "Separate seller leads from buyer leads and nurture them differently.",
          "Capture motivation, timing and property context early.",
          "Follow up with useful assets, not random reminders."
        ]
      },
      {
        title: "Seller lead generation",
        body:
          "Seller leads usually need education before they are ready to talk. A strong seller funnel gives them a reason to share information: pricing context, market readiness, selling timeline, property potential, preparation checklist or a private valuation conversation.",
        bullets: [
          "Lead magnet: local seller guide, pricing checklist, market-readiness audit.",
          "Landing page: address the decision to sell, not only valuation.",
          "Qualification: property type, location, selling horizon, motivation and current obstacle.",
          "Follow-up: market insight, preparation steps and invitation to a private review."
        ]
      },
      {
        title: "Buyer lead generation",
        body:
          "Buyer leads need structure because not every buyer is equally ready. A buyer funnel should identify search criteria, budget corridor, financing readiness, location preference and urgency. Then it should match follow-up to the buyer’s stage.",
        bullets: [
          "Segment first-time buyers, investors, movers and premium buyers.",
          "Capture desired area, property type, budget and financing status.",
          "Offer property alerts, buyer readiness guides or private search review.",
          "Use CRM stages so serious buyers are not mixed with passive browsers."
        ]
      },
      {
        title: "The local funnel system",
        body:
          "Real estate is local. The funnel should prove that you understand the market better than a generic platform. Use area pages, market notes, seller questions, buyer guides and social proof that is process-based rather than fabricated.",
        bullets: [
          "Local pages: areas, property types, buyer/seller scenarios.",
          "Content assets: seller checklist, buyer readiness guide, market update.",
          "Ads: local intent and retargeting rather than broad attention.",
          "CRM: lifecycle stages for seller nurture and buyer nurture."
        ]
      },
      {
        title: "Qualification before the first call",
        body:
          "The first call should not begin with basic discovery that could have been captured earlier. The CRM should already show why the person engaged, what they want, what timing they indicated and what helpful next step is likely.",
        bullets: [
          "Seller fields: property type, location, ownership situation, target timing, reason for selling.",
          "Buyer fields: use case, preferred location, budget, financing, purchase horizon.",
          "Source fields: campaign, asset, landing page and conversion path.",
          "Follow-up fields: owner, next step, last touch and planned touch."
        ]
      },
      {
        title: "Follow-up rhythm",
        body:
          "A lead system becomes valuable when it keeps useful contact without becoming annoying. The rhythm should match the lead type and readiness. Seller nurture is trust-heavy; buyer nurture is timing-heavy.",
        bullets: [
          "Day 0: confirmation email and next-step clarity.",
          "Day 1-2: useful context related to the original request.",
          "Week 1: invite to private review if fit is strong.",
          "Monthly: market insight or search update for longer-term leads.",
          "Trigger-based: re-engage when the lead revisits, clicks or requests more information."
        ]
      },
      {
        title: "Operating checklist",
        body:
          "Before you scale campaigns, confirm that your agent system can qualify and follow up. Otherwise, more leads will create more unanswered messages, weak calls and unclear pipeline.",
        bullets: [
          "Seller and buyer funnels are separated.",
          "Each funnel has a specific lead magnet or conversion offer.",
          "Qualification fields match your real sales process.",
          "CRM stages are simple enough to be used daily.",
          "Follow-up templates exist before campaigns start.",
          "Weekly review includes lead quality, not only cost per lead.",
          "No fake proof, fake testimonials or fake numbers are used."
        ]
      },
      {
        title: "Recommended next step",
        body:
          "Audit where your current enquiries come from and how much control you actually have. If your pipeline depends mostly on portals, begin with one owned seller funnel and one owned buyer nurture path before scaling more channels.",
        bullets: [
          "Choose one local seller segment.",
          "Build one useful seller asset.",
          "Create one buyer segmentation flow.",
          "Connect both to CRM stages and follow-up."
        ]
      }
    ]
  },
  {
    slug: "makler-lead-playbook-de",
    lang: "de",
    audience: "agent",
    eyebrow: "Makler-Lead-Playbook",
    title: "Bauen Sie eigene Verkaeufer- und Kaeufer-Pipeline jenseits von Portalabhaengigkeit.",
    subtitle:
      "Ein Praxisleitfaden fuer Immobilienmakler, Maklerteams und Vertriebsorganisationen, die qualifizierte Gespraeche kontrollierbar aufbauen wollen.",
    promise:
      "Dieses Playbook zeigt, wie lokale Verkaeufer- und Kaeufer-Funnels aufgebaut, Absicht qualifiziert und Chancen in ein strukturiertes Follow-up-System ueberfuehrt werden.",
    forWhom: [
      "Selbststaendige Immobilienmakler, die eigene Nachfrage aufbauen wollen",
      "Maklerteams mit starker Portalabhaengigkeit",
      "Immobilienunternehmen, die Verkaeufer-Leads und Kaeufer-Nurturing brauchen",
      "Vertriebsteams, die einen klareren Follow-up-Rhythmus benoetigen"
    ],
    sections: [
      {
        title: "Das Kernproblem: Portalabhaengigkeit ist keine Pipeline",
        body:
          "Portale koennen Sichtbarkeit schaffen, aber selten Kontrolle. Der Makler konkurriert in einem fremden Marktplatz, erhaelt gemischte Absicht und startet oft mit schwachem Kontext. Eigene Pipeline bedeutet: eigene Nachfragepfade aufbauen - Verkaeuferaufklaerung, Bewertungsintention, Kaeufersegmentierung, lokale Expertise und CRM-Follow-up.",
        bullets: [
          "Portal-Leads werden haeufig mit mehreren Wettbewerbern geteilt.",
          "Verkaeuferabsicht ist fragil, wenn der Erstkontakt generisch wirkt.",
          "Kaeuferanfragen brauchen Segmentierung, bevor Vertriebskapazitaet eingesetzt wird.",
          "Ohne Follow-up-Infrastruktur geht ein schwaches Signal einfach verloren."
        ]
      },
      {
        title: "Das Prinzip eigener Pipeline",
        body:
          "Ein Makler-Lead-System sollte nicht nur Kontaktdaten abfragen. Es sollte einen Grund zur Kontaktaufnahme schaffen, den naechsten Schritt qualifizieren und die Beziehung halten, bis die Person bereit ist. Guter Immobilienvertrieb besteht aus Timing, Vertrauen und strukturiertem Follow-up.",
        bullets: [
          "Nutzen Sie lokale Expertise als Conversion-Asset.",
          "Trennen Sie Verkaeufer- und Kaeufer-Leads und pflegen Sie beide unterschiedlich.",
          "Erfassen Sie Motivation, Timing und Objektkontext frueh.",
          "Folgen Sie mit nuetzlichen Assets nach, nicht mit zufaelligen Erinnerungen."
        ]
      },
      {
        title: "Verkaeufer-Lead-Generierung",
        body:
          "Verkaeufer-Leads brauchen oft Aufklaerung, bevor ein Gespraech sinnvoll ist. Ein starker Verkaeufer-Funnel gibt einen Grund, Informationen zu teilen: Preisumfeld, Marktbereitschaft, Verkaufszeitplan, Objektpotenzial, Vorbereitungsliste oder private Bewertung.",
        bullets: [
          "Lead Magnet: lokaler Verkaeufer-Guide, Preis-Checkliste, Marktbereitschafts-Audit.",
          "Landingpage: die Verkaufsentscheidung adressieren, nicht nur die Bewertung.",
          "Qualifizierung: Objektart, Lage, Verkaufszeitraum, Motivation und aktuelles Hindernis.",
          "Follow-up: Markteinordnung, Vorbereitungsschritte und Einladung zur privaten Pruefung."
        ]
      },
      {
        title: "Kaeufer-Lead-Generierung",
        body:
          "Kaeufer-Leads brauchen Struktur, weil nicht jeder Kaeufer gleich weit ist. Ein Kaeufer-Funnel sollte Suchkriterien, Budgetkorridor, Finanzierungsstand, Lagepraeferenz und Dringlichkeit erfassen. Danach wird das Follow-up an die Phase angepasst.",
        bullets: [
          "Segmentieren Sie Erstkaeufer, Anleger, Umzieher und Premium-Kaeufer.",
          "Erfassen Sie Wunschlage, Objektart, Budget und Finanzierungsstatus.",
          "Bieten Sie Suchprofile, Kaeufer-Readiness-Guides oder eine private Suchpruefung an.",
          "Nutzen Sie CRM-Stufen, damit ernsthafte Kaeufer nicht mit passiven Browsern vermischt werden."
        ]
      },
      {
        title: "Das lokale Funnel-System",
        body:
          "Immobilien sind lokal. Der Funnel sollte zeigen, dass Sie den Markt besser verstehen als eine generische Plattform. Nutzen Sie Gebietseiten, Marktnotizen, Verkaeuferfragen, Kaeufer-Guides und prozessbasiertes Vertrauen statt erfundener Belege.",
        bullets: [
          "Lokale Seiten: Gebiete, Objektarten, Kaeufer- und Verkaeufer-Szenarien.",
          "Content Assets: Verkaeufer-Checkliste, Kaeufer-Readiness-Guide, Marktupdate.",
          "Ads: lokale Absicht und Retargeting statt breiter Aufmerksamkeit.",
          "CRM: Lifecycle-Stufen fuer Verkaeufer-Nurturing und Kaeufer-Nurturing."
        ]
      },
      {
        title: "Qualifizierung vor dem ersten Gespraech",
        body:
          "Das Erstgespraech sollte nicht mit Basisfragen beginnen, die vorher haetten erfasst werden koennen. Das CRM sollte bereits zeigen, warum die Person reagiert hat, was sie sucht, welches Timing genannt wurde und welcher naechste Schritt hilfreich ist.",
        bullets: [
          "Verkaeuferfelder: Objektart, Lage, Eigentumssituation, Zielzeitpunkt, Verkaufsgrund.",
          "Kaeuferfelder: Nutzung, Wunschlage, Budget, Finanzierung, Kaufhorizont.",
          "Quellenfelder: Kampagne, Asset, Landingpage und Conversion-Pfad.",
          "Follow-up-Felder: Owner, naechster Schritt, letzter Kontakt, geplanter Kontakt."
        ]
      },
      {
        title: "Follow-up-Rhythmus",
        body:
          "Ein Lead-System wird wertvoll, wenn es nuetzlichen Kontakt haelt, ohne aufdringlich zu werden. Der Rhythmus sollte zu Lead-Typ und Bereitschaft passen. Verkaeufer-Nurturing ist vertrauensintensiv; Kaeufer-Nurturing ist timingintensiv.",
        bullets: [
          "Tag 0: Bestaetigungs-E-Mail und Klarheit ueber den naechsten Schritt.",
          "Tag 1-2: nuetzlicher Kontext passend zur urspruenglichen Anfrage.",
          "Woche 1: Einladung zur privaten Pruefung, wenn der Fit stark ist.",
          "Monatlich: Marktimpuls oder Suchupdate fuer laengerfristige Leads.",
          "Trigger-basiert: Reaktivierung bei erneutem Besuch, Klick oder Informationswunsch."
        ]
      },
      {
        title: "Operative Checkliste",
        body:
          "Bevor Kampagnen skaliert werden, sollte das Makler-System qualifizieren und nachfassen koennen. Sonst erzeugen mehr Leads vor allem mehr unbeantwortete Nachrichten, schwache Gespraeche und unklare Pipeline.",
        bullets: [
          "Verkaeufer- und Kaeufer-Funnels sind getrennt.",
          "Jeder Funnel hat einen konkreten Lead Magnet oder ein klares Conversion-Angebot.",
          "Qualifizierungsfelder passen zum echten Vertriebsprozess.",
          "CRM-Stufen sind einfach genug fuer den taeglichen Gebrauch.",
          "Follow-up-Vorlagen existieren vor Kampagnenstart.",
          "Das woechentliche Review bewertet Leadqualitaet, nicht nur Kosten pro Lead.",
          "Es werden keine Fake-Belege, Fake-Testimonials oder Fake-Zahlen genutzt."
        ]
      },
      {
        title: "Empfohlener naechster Schritt",
        body:
          "Pruefen Sie, woher Ihre aktuellen Anfragen kommen und wie viel Kontrolle Sie wirklich haben. Wenn Ihre Pipeline ueberwiegend von Portalen abhaengt, starten Sie mit einem eigenen Verkaeufer-Funnel und einem eigenen Kaeufer-Nurturing-Pfad, bevor weitere Kanaele skaliert werden.",
        bullets: [
          "Ein lokales Verkaeufersegment auswaehlen.",
          "Ein nuetzliches Verkaeufer-Asset bauen.",
          "Einen Kaeufer-Segmentierungsflow erstellen.",
          "Beides mit CRM-Stufen und Follow-up verbinden."
        ]
      }
    ]
  }
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function restoreGermanUmlauts(value) {
  const protectedDataUrls = [];
  const protectedValue = value.replace(/data:image\/png;base64,[^"]+/g, (match) => {
    const token = `__NOVALURE_DATA_URL_${protectedDataUrls.length}__`;
    protectedDataUrls.push(match);
    return token;
  });

  const replacements = [
    ["Bautraeger", "Bauträger"],
    ["Kaeufer", "Käufer"],
    ["Verkaeufer", "Verkäufer"],
    ["Eigentuemer", "Eigentümer"],
    ["fuer", "für"],
    ["Fuer", "Für"],
    ["waehrend", "während"],
    ["laengeren", "längeren"],
    ["Umsaetze", "Umsätze"],
    ["Konformitaet", "Konformität"],
    ["Luecken", "Lücken"],
    ["naechsten", "nächsten"],
    ["Naechster", "Nächster"],
    ["Naechstes", "Nächstes"],
    ["naechster", "nächster"],
    ["Gespraeche", "Gespräche"],
    ["Gespraech", "Gespräch"],
    ["Uebergabe", "Übergabe"],
    ["uebergeben", "übergeben"],
    ["ueber", "über"],
    ["zufaellige", "zufällige"],
    ["ernsthaften Kaeufern", "ernsthaften Käufern"],
    ["Vertriebsuebergabe", "Vertriebsübergabe"],
    ["Erstgespraech", "Erstgespräch"],
    ["Qualitaet", "Qualität"],
    ["woechentlich", "wöchentlich"],
    ["fuehren", "führen"],
    ["gefuehrt", "geführt"],
    ["Pruefen", "Prüfen"],
    ["pruefen", "prüfen"],
    ["Pruefung", "Prüfung"],
    ["Suchpruefung", "Suchprüfung"],
    ["moechten", "möchten"],
    ["erhoehen", "erhöhen"],
    ["hoert", "hört"],
    ["frueh", "früh"],
    ["Kaeufertyp", "Käufertyp"],
    ["Bloecke", "Blöcke"],
    ["Verfuegbarkeit", "Verfügbarkeit"],
    ["uebertriebener", "übertriebener"],
    ["schuetzen", "schützen"],
    ["gewuenschter", "gewünschter"],
    ["nuetzlich", "nützlich"],
    ["Datensaetze", "Datensätze"],
    ["Gruende", "Gründe"],
    ["erklaert", "erklärt"],
    ["unnoetige", "unnötige"],
    ["Fuehrung", "Führung"],
    ["Realitaet", "Realität"],
    ["Kanaele", "Kanäle"],
    ["Einwaende", "Einwände"],
    ["auswaehlen", "auswählen"],
    ["Verkaeuferabsicht", "Verkäuferabsicht"],
    ["Portalabhaengigkeit", "Portalabhängigkeit"],
    ["koennen", "können"],
    ["koennte", "könnte"],
    ["erhaelt", "erhält"],
    ["Verkaeuferaufklaerung", "Verkäuferaufklärung"],
    ["Selbststaendige", "Selbstständige"],
    ["bestaetigungs", "bestätigungs"],
    ["Bestaetigungs", "Bestätigungs"],
    ["haetten", "hätten"],
    ["haelt", "hält"],
    ["taeglichen", "täglichen"],
    ["abhaengt", "abhängt"],
    ["ueberwiegend", "überwiegend"]
  ];

  const restored = replacements.reduce((text, [from, to]) => text.replaceAll(from, to), protectedValue);
  return protectedDataUrls.reduce((text, dataUrl, index) => text.replaceAll(`__NOVALURE_DATA_URL_${index}__`, dataUrl), restored);
}

function pipelineSvg(lang, audience) {
  const labels =
    lang === "de"
      ? audience === "developer"
        ? ["Nachfrage", "Projekt-Funnel", "Qualifizierung", "CRM", "Vertrieb"]
        : ["Lokale Nachfrage", "Lead Magnet", "Segmentierung", "CRM", "Follow-up"]
      : audience === "developer"
        ? ["Demand", "Project Funnel", "Qualification", "CRM", "Sales"]
        : ["Local Demand", "Lead Magnet", "Segmentation", "CRM", "Follow-up"];
  return `
  <svg viewBox="0 0 920 260" role="img" aria-label="Pipeline diagram">
    <defs>
      <linearGradient id="g1" x1="0" x2="1"><stop stop-color="#fff4b8"/><stop offset="1" stop-color="#ffd43b"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="920" height="260" rx="28" fill="#101217"/>
    <path d="M80 132 C210 40, 330 220, 470 130 S690 44, 840 130" fill="none" stroke="#343944" stroke-width="3" stroke-dasharray="8 10"/>
    ${labels
      .map((label, index) => {
        const x = 92 + index * 180;
        const y = index % 2 === 0 ? 96 : 158;
        return `<g filter="url(#glow)">
          <circle cx="${x}" cy="${y}" r="23" fill="url(#g1)"/>
          <circle cx="${x}" cy="${y}" r="8" fill="#111318"/>
          <rect x="${x - 66}" y="${y + 38}" width="132" height="42" rx="14" fill="#1b1f27" stroke="#333a45"/>
          <text x="${x}" y="${y + 64}" text-anchor="middle" fill="#ffffff" font-size="15" font-family="Arial" font-weight="700">${esc(label)}</text>
        </g>`;
      })
      .join("")}
  </svg>`;
}

function matrixSvg(lang, audience) {
  const x = lang === "de" ? "Absicht" : "Intent";
  const y = lang === "de" ? "Fit" : "Fit";
  const cells =
    lang === "de"
      ? ["Nurture", "Pruefen", "Disqualifizieren", "Sales-ready"]
      : ["Nurture", "Review", "Disqualify", "Sales-ready"];
  return `
  <svg viewBox="0 0 920 520" role="img" aria-label="Qualification matrix">
    <rect width="920" height="520" rx="28" fill="#f7f4eb"/>
    <line x1="160" y1="420" x2="790" y2="420" stroke="#1b1f27" stroke-width="3"/>
    <line x1="160" y1="420" x2="160" y2="90" stroke="#1b1f27" stroke-width="3"/>
    <text x="475" y="475" text-anchor="middle" fill="#111318" font-size="24" font-family="Arial" font-weight="700">${x}</text>
    <text x="70" y="255" text-anchor="middle" fill="#111318" font-size="24" font-family="Arial" font-weight="700" transform="rotate(-90 70 255)">${y}</text>
    <rect x="190" y="250" width="250" height="140" rx="20" fill="#ffffff" stroke="#ddd7c9"/>
    <rect x="500" y="250" width="250" height="140" rx="20" fill="#ffffff" stroke="#ddd7c9"/>
    <rect x="190" y="95" width="250" height="140" rx="20" fill="#ffffff" stroke="#ddd7c9"/>
    <rect x="500" y="95" width="250" height="140" rx="20" fill="#111318"/>
    <text x="315" y="325" text-anchor="middle" fill="#111318" font-size="25" font-family="Arial" font-weight="800">${cells[0]}</text>
    <text x="625" y="325" text-anchor="middle" fill="#111318" font-size="25" font-family="Arial" font-weight="800">${cells[1]}</text>
    <text x="315" y="170" text-anchor="middle" fill="#111318" font-size="25" font-family="Arial" font-weight="800">${cells[2]}</text>
    <text x="625" y="170" text-anchor="middle" fill="#ffd43b" font-size="25" font-family="Arial" font-weight="800">${cells[3]}</text>
    <circle cx="705" cy="130" r="14" fill="#ffd43b"/>
    <circle cx="728" cy="154" r="9" fill="#ffd43b" opacity=".7"/>
    <circle cx="675" cy="178" r="7" fill="#ffd43b" opacity=".5"/>
  </svg>`;
}

function systemSvg(lang) {
  const labels =
    lang === "de"
      ? ["Funnel", "Demand", "Qualifizierung", "CRM"]
      : ["Funnel", "Demand", "Qualification", "CRM"];
  return `
  <svg viewBox="0 0 920 340" role="img" aria-label="Four layer system">
    <rect width="920" height="340" rx="28" fill="#111318"/>
    ${labels
      .map((label, index) => {
        const y = 54 + index * 66;
        const width = 690 - index * 70;
        const x = 115 + index * 35;
        return `<rect x="${x}" y="${y}" width="${width}" height="48" rx="18" fill="${index === 3 ? "#ffd43b" : "#202630"}" stroke="#3a4350"/>
        <text x="${x + 28}" y="${y + 31}" fill="${index === 3 ? "#111318" : "#ffffff"}" font-family="Arial" font-size="20" font-weight="800">${index + 1}. ${esc(label)}</text>`;
      })
      .join("")}
    <text x="690" y="285" fill="#aeb6c3" font-family="Arial" font-size="17">${lang === "de" ? "Ein Ergebnis: sales-ready Pipeline" : "One outcome: sales-ready pipeline"}</text>
  </svg>`;
}

function renderHtml(book) {
  const ui = shared[book.lang];
  const title = esc(book.title);
  const highlights = book.forWhom.map((item) => `<li>${esc(item)}</li>`).join("");
  const sections = book.sections
    .map(
      (section, index) => `
        <section class="page section">
          <div class="section-number">${String(index + 1).padStart(2, "0")}</div>
          <h2>${esc(section.title)}</h2>
          <p class="body">${esc(section.body)}</p>
          <ul class="bullets">${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </section>`
    )
    .join("");

  return `<!doctype html>
<html lang="${book.lang}">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #d8d4c9; color: #111318; font-family: Arial, Helvetica, sans-serif; }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 20mm; background: #fbfaf6; page-break-after: always; position: relative; overflow: hidden; }
  .cover { background: radial-gradient(circle at 70% 22%, rgba(255,212,59,.24), transparent 28%), linear-gradient(135deg, #08090c, #151923 58%, #08090c); color: #fff; }
  .logo { width: 172px; height: auto; object-fit: contain; margin-bottom: 38mm; }
  .eyebrow { color: #ffd43b; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 800; font-size: 12px; }
  h1 { font-size: 56px; line-height: .98; letter-spacing: -1.8px; margin: 12px 0 18px; max-width: 690px; }
  .subtitle { color: #d9dee8; font-size: 21px; line-height: 1.45; max-width: 620px; }
  .promise { color: #fff1aa; font-size: 17px; line-height: 1.5; max-width: 620px; margin-top: 28px; }
  .cover-card { position: absolute; left: 20mm; right: 20mm; bottom: 20mm; border: 1px solid rgba(255,255,255,.16); border-radius: 22px; padding: 18px; background: rgba(255,255,255,.06); }
  .cover-card strong { color: #ffd43b; }
  .toc { background: #fbfaf6; }
  h2 { font-size: 38px; line-height: 1.08; margin: 0 0 16px; letter-spacing: -1px; }
  h3 { font-size: 24px; margin: 0 0 10px; }
  .kicker { color: #666f7d; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; font-size: 12px; margin-bottom: 12px; }
  .body { font-size: 18px; line-height: 1.62; color: #303640; max-width: 710px; }
  .bullets { list-style: none; padding: 0; margin: 28px 0 0; display: grid; gap: 12px; }
  .bullets li { font-size: 16px; line-height: 1.45; padding: 15px 16px 15px 44px; border: 1px solid #e1ddd2; border-radius: 16px; background: #fff; position: relative; }
  .bullets li:before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: #ffd43b; position: absolute; left: 20px; top: 21px; box-shadow: 0 0 0 5px rgba(255,212,59,.18); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 28px; }
  .card { border: 1px solid #ded9ce; border-radius: 18px; padding: 18px; background: #fff; min-height: 132px; }
  .card p { color: #3f4652; line-height: 1.5; }
  .visual { margin-top: 28px; }
  .visual svg { width: 100%; height: auto; display: block; }
  .section-number { color: #ffd43b; font-weight: 900; font-size: 16px; margin-bottom: 18px; }
  .section:nth-child(odd) { background: #101217; color: #fff; }
  .section:nth-child(odd) .body { color: #d0d7e2; }
  .section:nth-child(odd) .bullets li { background: #191e27; border-color: #303846; color: #fff; }
  .summary { background: #111318; color: #fff; }
  .summary .body { color: #d7deea; max-width: 690px; margin-bottom: 26px; }
  .summary .logo { margin-bottom: 42mm; }
  .cta { display: inline-block; margin-top: 16px; padding: 15px 22px; border-radius: 999px; background: #ffd43b; color: #171000; font-weight: 900; text-decoration: none; }
  .footer { position: absolute; left: 20mm; right: 20mm; bottom: 11mm; display: flex; justify-content: space-between; color: #8b93a0; font-size: 10px; }
  .page:after { content: ""; position: absolute; right: -60px; bottom: -60px; width: 190px; height: 190px; border-radius: 50%; background: rgba(255,212,59,.12); }
  .note { font-size: 13px; color: #606977; line-height: 1.5; margin-top: 24px; }
</style>
</head>
<body>
  <main>
    <section class="page cover">
      <img class="logo" src="${whiteLogoData}" alt="Novalure">
      <div class="eyebrow">${esc(book.eyebrow)} | ${esc(ui.label)}</div>
      <h1>${title}</h1>
      <p class="subtitle">${esc(book.subtitle)}</p>
      <p class="promise">${esc(book.promise)}</p>
      <div class="visual">${pipelineSvg(book.lang, book.audience)}</div>
      <div class="cover-card"><strong>Novalure</strong> ${esc(ui.footer)}</div>
    </section>
    <section class="page toc">
      <div class="kicker">${book.lang === "de" ? "Fuer wen dieses Playbook ist" : "Who this playbook is for"}</div>
      <h2>${book.lang === "de" ? "Ein System, kein weiterer Marketing-Ordner." : "A system, not another marketing folder."}</h2>
      <p class="body">${book.lang === "de" ? "Dieses Dokument ist als Arbeitsgrundlage gedacht. Es hilft Ihnen, Ihr aktuelles Setup zu pruefen, Luecken sichtbar zu machen und die naechsten operativen Schritte sauber zu priorisieren." : "This document is designed as a working guide. Use it to inspect your current setup, reveal gaps and prioritize the next operating steps with more clarity."}</p>
      <div class="grid">${book.forWhom.map((item) => `<div class="card"><h3>${esc(item)}</h3><p>${book.lang === "de" ? "Relevant, wenn Pipeline-Qualitaet wichtiger ist als reines Lead-Volumen." : "Relevant when pipeline quality matters more than raw lead volume."}</p></div>`).join("")}</div>
      <p class="note">${esc(ui.note)}</p>
      <div class="footer"><span>${esc(ui.footer)}</span><span>02</span></div>
    </section>
    <section class="page">
      <div class="kicker">${book.lang === "de" ? "Systemkarte" : "System map"}</div>
      <h2>${book.lang === "de" ? "Vier Schichten. Ein Ergebnis." : "Four layers. One outcome."}</h2>
      <p class="body">${book.lang === "de" ? "Die folgenden Grafiken zeigen das Betriebssystem hinter qualifizierter Immobilien-Pipeline: Nachfrage wird nicht nur erzeugt, sondern gefuehrt, gefiltert und mit Kontext an den Vertrieb uebergeben." : "The following visuals show the operating system behind qualified real estate pipeline: demand is not only generated, it is guided, filtered and handed to sales with context."}</p>
      <div class="visual">${systemSvg(book.lang)}</div>
      <div class="visual">${matrixSvg(book.lang, book.audience)}</div>
      <div class="footer"><span>${esc(ui.footer)}</span><span>03</span></div>
    </section>
    ${sections}
    <section class="page summary">
      <img class="logo" src="${whiteLogoData}" alt="Novalure">
      <div class="kicker">${book.lang === "de" ? "Naechster Schritt" : "Next step"}</div>
      <h2>${book.lang === "de" ? "Lassen Sie Ihr aktuelles Lead-System pruefen." : "Have your current lead system reviewed."}</h2>
      <p class="body">${book.lang === "de" ? "Wenn Sie sehen moechten, welche Schichten in Ihrem aktuellen Setup fehlen, buchen Sie ein privates Growth Audit. Wir pruefen Funnel, Lead-Qualifizierung, CRM-Uebergabe und Reporting-Logik ohne Druck und ohne falsche Versprechen." : "If you want to see which layers are missing in your current setup, book a Private Growth Audit. We review funnel logic, lead qualification, CRM handover and reporting without pressure and without fake promises."}</p>
      <a class="cta" href="${esc(ui.primaryUrl)}">${esc(ui.primaryCta)}</a>
      <p class="note">${esc(ui.note)}</p>
      <div class="footer"><span>${esc(ui.footer)}</span><span>${book.lang === "de" ? "Ende" : "End"}</span></div>
    </section>
  </main>
</body>
</html>`;
}

async function main() {
  const rendered = playbooks.map((book) => {
    const html = book.lang === "de" ? restoreGermanUmlauts(renderHtml(book)) : renderHtml(book);
    const htmlPath = path.join(outDir, `${book.slug}.html`);
    fs.writeFileSync(htmlPath, html, "utf8");
    console.log(`Created ${path.relative(root, htmlPath)}`);
    return { book, html };
  });

  if (process.env.NOVALURE_HTML_ONLY === "1") {
    return;
  }

  const executablePath = findLocalBrowser();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath });
  } catch {
    console.warn("PDF rendering skipped. Install Playwright browsers or run scripts/render-playbook-pdfs.py in an environment with ReportLab.");
    return;
  }

  for (const { book, html } of rendered) {
    const pdfPath = path.join(outDir, `${book.slug}.pdf`);
    const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }
    });
    await page.close();
    console.log(`Created ${path.relative(root, pdfPath)}`);
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
