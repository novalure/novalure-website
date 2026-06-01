import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  ({ chromium } = require("playwright"));
} catch {
  try {
    ({ chromium } = require("C:/Users/Franz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
  } catch {
    chromium = null;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "playbooks");
const whiteLogoPath = path.join(root, "public", "novalure-logo-white.png");
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
    primaryCta: "Request a Project Check",
    primaryUrl: "https://www.novalure.eu/en/contact#book-audit",
    footer: "NovaLure | Project marketing with prepared handover",
    introEyebrow: "Why this playbook exists",
    introTitle: "A focused review, not a full blueprint.",
    introBody:
      "This playbook is built to surface whether your current path from enquiry to sales creates context or only contact details. It gives enough structure to identify the problem, not a complete implementation plan that replaces a proper diagnosis.",
    introCardBody: "Relevant when you need sharper sales context before the next call.",
    systemEyebrow: "Diagnosis frame",
    systemTitle: "Demand becomes useful when sales can act on it.",
    systemBody:
      "The operating question is simple: does your system capture the right signal, qualify intent, prepare context and create a clear next step for sales?",
    summaryEyebrow: "Next step",
    summaryTitle: "Have your current project path reviewed.",
    summaryBody:
      "If you have a concrete project, market area or lead-quality problem, the Project Check is the next step. We review project presence, qualification, handover and follow-up readiness. No full free blueprint. No lead guarantee. Clear diagnosis before proposal.",
    note:
      "This playbook is a diagnostic guide. It is not a promise of lead volume, revenue, delivery timing or legal compliance, and it does not include a full implementation blueprint, media strategy or scoring model."
  },
  de: {
    label: "Deutsche Ausgabe",
    primaryCta: "Projekt-Check anfragen",
    primaryUrl: "https://www.novalure.eu/de/kontakt#book-audit",
    footer: "NovaLure | Projektvermarktung mit vorbereiteter Übergabe",
    introEyebrow: "Warum dieses Playbook existiert",
    introTitle: "Ein fokussierter Check, kein vollständiger Blueprint.",
    introBody:
      "Dieses Playbook soll sichtbar machen, ob Ihr aktueller Weg von Anfrage zu Vertrieb Kontext erzeugt oder nur Kontaktdaten sammelt. Es gibt genug Struktur, um das Problem zu erkennen, aber keinen vollständigen Umsetzungsplan, der eine saubere Diagnose ersetzt.",
    introCardBody: "Relevant, wenn Ihr Vertrieb vor dem nächsten Call mehr Kontext braucht.",
    systemEyebrow: "Diagnose-Rahmen",
    systemTitle: "Nachfrage wird erst nutzbar, wenn der Vertrieb damit arbeiten kann.",
    systemBody:
      "Die operative Frage ist einfach: Erfasst Ihr System das richtige Signal, qualifiziert es Absicht, bereitet es Kontext vor und erzeugt es einen klaren nächsten Schritt für Sales?",
    summaryEyebrow: "Nächster Schritt",
    summaryTitle: "Lassen Sie Ihren aktuellen Projektweg prüfen.",
    summaryBody:
      "Wenn Sie ein konkretes Projekt, Marktgebiet oder Leadproblem haben, ist der Projekt-Check der nächste Schritt. Wir prüfen Projektauftritt, Qualifizierung, Übergabe und Nachfass-Reife. Kein vollständiger Gratis-Blueprint. Keine Lead-Garantie. Klare Diagnose vor Angebot.",
    note:
      "Dieses Playbook ist ein diagnostischer Leitfaden. Es verspricht keine Leadmenge, Umsätze, Lieferzeiten oder rechtliche Konformität und enthält keinen vollständigen Umsetzungs-Blueprint, keine Media-Strategie und kein Scoring-Modell."
  }
};

const developerSectionsEn = [
  {
    title: "The actual problem: enquiries without sales context",
    body:
      "Developer campaigns often look active while sales still works manually. The funnel collects names, brochure requests or vague project interest, but the CRM does not explain why this person matters now. More traffic then creates more sorting work instead of more qualified buyer conversations.",
    bullets: [
      "A project enquiry is not sales-ready just because it has a phone number.",
      "A buyer who likes the architecture may still be far from timing, budget or decision readiness.",
      "A campaign that reports leads without CRM feedback cannot show where real buyer intent starts.",
      "If sales has to rebuild the context on every first call, the handover is not doing its job."
    ],
    question: "Where does your sales team currently lose time: before the call, during the call or after the lead enters the CRM?"
  },
  {
    title: "Typical project path leaks",
    body:
      "Most weak project paths do not fail in one dramatic place. They lose quality in several small handovers: from ad to page, from page to form, from form to handover and from handover to follow-up. The leak is commercial, not cosmetic.",
    bullets: [
      "The page explains the project but not the buying decision.",
      "The form captures contact details but not project fit, timing or buyer type.",
      "The CRM record shows a source but not the reason for urgency.",
      "Follow-up starts the same way for every lead, regardless of readiness.",
      "Reporting focuses on cost per lead while sales still filters manually."
    ],
    question: "Which of these leaks can you prove is under control today?"
  },
  {
    title: "What a sales-ready project lead must show",
    body:
      "A sales-ready project lead gives the first call a useful starting point. It does not need to reveal every detail, but it should show enough context for sales to decide whether to call, how to open the call and what next step makes sense.",
    bullets: [
      "Project or location interest is visible before sales opens the record.",
      "Buyer type, unit logic or use case is at least directionally clear.",
      "Timing and budget proximity are not hidden in free-text notes.",
      "Source, landing page and requested asset are connected to the record.",
      "The next step is obvious enough that follow-up can start without guesswork."
    ],
    question: "If your CRM does not show this context reliably, is the lead weak or is the handover incomplete?"
  },
  {
    title: "Mini scorecard: is the project ready for review?",
    body:
      "Ready for review does not mean the system is already strong. It means the business has a concrete enough situation to inspect: project, market pressure, current lead sources, sales process and a real commercial reason to improve lead quality.",
    bullets: [
      "There is a specific project, launch, stock pressure or market area.",
      "Leads already exist, but sales cannot trust or prioritize them cleanly.",
      "The CRM or lead management process is visible enough to inspect.",
      "Sales can explain which leads waste time and which create real conversations.",
      "Budget and decision readiness can be discussed without turning the check into free consulting."
    ],
    question: "Can you name the project, lead problem and sales bottleneck in one sentence?"
  },
  {
    title: "Symptoms worth reviewing, not a full solution",
    body:
      "This playbook intentionally stops before a complete blueprint. A serious project path depends on market, offer, assets, sales capacity, system maturity and timing. Generic advice can create activity while the real bottleneck remains untouched.",
    bullets: [
      "High lead volume but low booked-call quality points to weak qualification.",
      "Many brochure downloads but few serious conversations points to unclear next steps.",
      "Fast follow-up with poor outcomes points to bad fit, not only bad sales execution.",
      "Slow follow-up points to ownership, CRM and process gaps.",
      "Low trust in reports points to missing definitions between marketing and sales."
    ],
    question: "Which symptom is expensive enough that it deserves diagnosis before more media spend?"
  },
  {
    title: "What the Project Check clarifies",
    body:
      "The Project Check is not a free strategy workshop. It is a focused review of where the current project path loses commercial quality before sales can act.",
    bullets: [
      "Where project demand enters the system and where context is lost.",
      "Whether the landing page and lead asset attract the right buyer type.",
      "Whether intent filtering protects sales time or only adds friction.",
      "Whether the handover gives sales enough context for the first call.",
      "Whether follow-up and reporting can support ongoing improvement after launch."
    ],
    question: "Which check question would be uncomfortable to answer from your current data?"
  },
  {
    title: "When the Project Check fits and when it does not",
    body:
      "The check is useful when there is a real project, sales pressure and willingness to improve the path from visibility to conversation. It is not useful when the goal is only to collect free ideas, demand a lead guarantee or avoid follow-up discipline.",
    bullets: [
      "Fit: active project, launch pressure, internal sales ownership and budget readiness.",
      "Fit: existing lead sources that produce volume but not enough usable context.",
      "No fit: no concrete project, no sales function or no willingness to operate the system.",
      "No fit: expectation of guaranteed lead numbers or a full campaign blueprint from a free call."
    ],
    question: "Are you trying to diagnose a commercial bottleneck or only gather more marketing ideas?"
  },
  {
    title: "Clear next step: review the project path",
    body:
      "If the scorecard exposed a real gap, the useful next step is not another generic checklist. It is a 30-minute review of the current path and a decision on whether a structured setup is commercially sensible.",
    bullets: [
      "Use the check to test whether the system is missing project clarity, qualification or prepared handover.",
      "Bring one concrete project, market area or lead-quality problem.",
      "Prepare the current lead sources, handover process and biggest sales bottleneck.",
      "Expect a clear assessment, not a free implementation plan."
    ],
    question: "Should your next move be more traffic, or a diagnosis of why current demand is not becoming qualified conversations?"
  }
];

const developerSectionsDe = [
  {
    title: "Das eigentliche Problem: Anfragen ohne Vertriebskontext",
    body:
      "Bauträger-Kampagnen wirken oft aktiv, während der Vertrieb trotzdem manuell sortiert. Der Anfrageweg sammelt Namen, Exposé-Anfragen oder vages Projektinteresse, aber die Übergabe erklärt nicht, warum diese Person jetzt relevant ist. Mehr Traffic erzeugt dann mehr Sortierarbeit statt mehr qualifizierte Käufergespräche.",
    bullets: [
      "Eine Projektanfrage ist nicht sales-ready, nur weil eine Telefonnummer vorhanden ist.",
      "Ein Interessent, dem die Architektur gefällt, ist noch nicht automatisch nah an Timing, Budget oder Entscheidung.",
      "Ein Kampagnenreport ohne CRM-Feedback zeigt nicht, wo echte Kaufabsicht beginnt.",
      "Wenn Sales den Kontext im Erstgespräch neu aufbauen muss, erfüllt die Übergabe ihren Zweck nicht."
    ],
    question: "Wo verliert Ihr Vertrieb aktuell Zeit: vor dem Call, im Call oder nachdem der Lead im CRM landet?"
  },
  {
    title: "Typische Pipeline-Leaks bei Projekten",
    body:
      "Schwache Projektwege scheitern selten an einer einzigen Stelle. Qualität geht in mehreren kleinen Übergaben verloren: von der Anzeige zur Seite, von der Seite zum Formular, vom Formular in die Übergabe und von dort ins Follow-up. Das Leak ist wirtschaftlich, nicht kosmetisch.",
    bullets: [
      "Die Seite erklärt das Projekt, aber nicht die Kaufentscheidung.",
      "Das Formular erfasst Kontaktdaten, aber nicht Projekt-Fit, Timing oder Käufertyp.",
      "Der CRM-Datensatz zeigt eine Quelle, aber keinen Grund für Priorität.",
      "Follow-up startet für jeden Lead gleich, unabhängig von Reife und Kontext.",
      "Reporting betrachtet Kosten pro Lead, während Sales weiterhin manuell filtert."
    ],
    question: "Welches dieser Leaks können Sie heute nachweislich ausschließen?"
  },
  {
    title: "Was ein sales-ready Projektlead zeigen muss",
    body:
      "Ein sales-ready Projektlead gibt dem ersten Gespräch einen belastbaren Einstieg. Er muss nicht jedes Detail enthalten, aber genug Kontext zeigen, damit Sales entscheiden kann, ob ein Call sinnvoll ist, wie der Einstieg lautet und welcher nächste Schritt passt.",
    bullets: [
      "Projekt- oder Lageinteresse ist sichtbar, bevor Sales den Datensatz öffnet.",
      "Käufertyp, Einheitenlogik oder Nutzung sind zumindest grob erkennbar.",
      "Timing und Budgetnähe verschwinden nicht in freien Notizen.",
      "Quelle, Landingpage und angefragtes Asset sind mit dem Datensatz verbunden.",
      "Der nächste Schritt ist klar genug, damit Follow-up ohne Raten beginnen kann."
    ],
    question: "Wenn Ihr CRM diesen Kontext nicht zuverlässig zeigt, ist dann der Lead schwach oder die Übergabe unvollständig?"
  },
  {
    title: "Mini-Scorecard: Ist Ihr Projekt prüfenswert vorbereitet?",
    body:
      "Prüfenswert vorbereitet bedeutet nicht, dass das System bereits stark ist. Es bedeutet, dass die Situation konkret genug für einen Check ist: Projekt, Marktdruck, aktuelle Leadquellen, Sales-Prozess und ein echter wirtschaftlicher Grund, Leadqualität zu verbessern.",
    bullets: [
      "Es gibt ein konkretes Projekt, einen Launch, Abverkaufsdruck oder ein Marktgebiet.",
      "Leads existieren bereits, aber Sales kann sie nicht sauber priorisieren.",
      "CRM oder Leadmanagement sind sichtbar genug, um geprüft zu werden.",
      "Sales kann erklären, welche Leads Zeit binden und welche echte Gespräche erzeugen.",
      "Budget- und Entscheidungsfähigkeit können geklärt werden, ohne den Check als Gratisberatung zu behandeln."
    ],
    question: "Können Sie Projekt, Leadproblem und Vertriebsengpass in einem Satz benennen?"
  },
  {
    title: "Symptome prüfen, keine vollständige Lösung verschenken",
    body:
      "Dieses Playbook endet bewusst vor dem vollständigen Blueprint. Ein seriöser Projektweg hängt von Markt, Angebot, Assets, Sales-Kapazität, Systemreife und Timing ab. Allgemeine Tipps können Aktivität erzeugen, während der eigentliche Engpass unberührt bleibt.",
    bullets: [
      "Viele Leads, aber wenige gute Calls deuten auf schwache Qualifizierung.",
      "Viele Exposé-Downloads, aber wenige Gespräche deuten auf unklare nächste Schritte.",
      "Schnelles Follow-up mit schwachen Ergebnissen deutet auf schlechten Fit, nicht nur Sales-Ausführung.",
      "Langsames Follow-up deutet auf Ownership-, CRM- und Prozesslücken.",
      "Geringes Vertrauen ins Reporting deutet auf fehlende Definitionen zwischen Marketing und Vertrieb."
    ],
    question: "Welches Symptom ist teuer genug, dass es vor weiterem Media-Budget diagnostiziert werden sollte?"
  },
  {
    title: "Welche Fragen der Projekt-Check klärt",
    body:
      "Der Projekt-Check ist kein kostenloser Strategie-Workshop. Er ist eine fokussierte Prüfung, wo der aktuelle Projektweg wirtschaftliche Qualität verliert, bevor Sales handeln kann.",
    bullets: [
      "Wo Projektnachfrage ins System eintritt und wo Kontext verloren geht.",
      "Ob Landingpage und Lead-Asset den richtigen Käufertyp anziehen.",
      "Ob Intent-Filter Vertriebszeit schützt oder nur zusätzliche Reibung erzeugt.",
      "Ob die Übergabe genug Kontext für den ersten Call liefert.",
      "Ob Follow-up und Reporting laufende Verbesserung nach dem Start tragen können."
    ],
    question: "Welche Check-Frage könnten Sie mit Ihren aktuellen Daten nur unsicher beantworten?"
  },
  {
    title: "Wann der Projekt-Check passt und wann nicht",
    body:
      "Der Check ist sinnvoll, wenn ein echtes Projekt, Vertriebsdruck und die Bereitschaft zum Systemaufbau vorhanden sind. Er ist nicht sinnvoll, wenn nur kostenlose Ideen gesammelt, Lead-Garantien erwartet oder Nachfass-Disziplin vermieden werden sollen.",
    bullets: [
      "Passend: aktives Projekt, Launch-Druck, Sales-Verantwortung und Budgetfähigkeit.",
      "Passend: vorhandene Leadquellen mit Volumen, aber zu wenig nutzbarem Kontext.",
      "Nicht passend: kein konkretes Projekt, kein aktiver Vertrieb oder keine Bereitschaft zum Betrieb.",
      "Nicht passend: Erwartung garantierter Leadzahlen oder eines vollständigen Gratis-Blueprints."
    ],
    question: "Wollen Sie einen wirtschaftlichen Engpass diagnostizieren oder nur weitere Marketingideen sammeln?"
  },
  {
    title: "Klarer nächster Schritt: Projektweg prüfen lassen",
    body:
      "Wenn die Scorecard eine echte Lücke sichtbar gemacht hat, ist der nächste sinnvolle Schritt keine weitere allgemeine Checkliste. Sinnvoll ist ein 30-Minuten-Check des aktuellen Projektwegs und die Entscheidung, ob ein strukturierter Aufbau wirtschaftlich tragfähig ist.",
    bullets: [
      "Nutzen Sie den Check, um fehlende Projektklarheit, Qualifizierung oder vorbereitete Übergabe zu prüfen.",
      "Bringen Sie ein konkretes Projekt, Marktgebiet oder Leadqualitätsproblem mit.",
      "Bereiten Sie aktuelle Leadquellen, Übergabeprozess und größten Vertriebsengpass vor.",
      "Erwarten Sie eine klare Einschätzung, keinen kostenlosen Umsetzungsplan."
    ],
    question: "Brauchen Sie wirklich mehr Traffic, oder zuerst eine Diagnose, warum bestehende Nachfrage nicht zur Pipeline wird?"
  }
];

const agentSectionsEn = [
  {
    title: "The actual problem: seller and buyer leads without context",
    body:
      "Agent lead generation often produces contact details before it produces sales context. Seller leads arrive without motivation, timing or property reality. Buyer leads arrive without budget proximity, search logic or readiness. The team then spends time discovering basics that should have been prepared before the first call.",
    bullets: [
      "A seller lead is not valuable if selling intent is unclear.",
      "A buyer lead is not sales-ready if budget, timing and search area are missing.",
      "Portal dependency creates activity, but not enough control over source, segment or follow-up.",
      "If follow-up depends on individual memory, the enquiry path is not yet operating."
    ],
    question: "Where does your team currently lose more time: seller qualification, buyer sorting or follow-up discipline?"
  },
  {
    title: "Typical agent enquiry leaks",
    body:
      "Broker enquiry paths usually leak where curiosity is treated like intent. A valuation click, portal enquiry or local guide download can be useful, but only if the system separates weak signals from serious next steps.",
    bullets: [
      "Seller funnels invite curiosity but do not reveal urgency or motivation.",
      "Buyer funnels collect interest but do not separate search profile from casual browsing.",
      "Local expertise is used as content, but not as a conversion filter.",
      "CRM stages are too broad to show who needs a call now.",
      "Nurture is either absent or too generic to create a future sales conversation."
    ],
    question: "Which lead type currently looks active in reporting but weak in real conversations?"
  },
  {
    title: "What a sales-ready agent lead must show",
    body:
      "A useful agent lead does not need to expose the entire private situation. It should show enough context to choose the right conversation: seller review, buyer search call, nurture path or no-fit decision.",
    bullets: [
      "Seller context: property type, location, likely timeline and reason for interest.",
      "Buyer context: search area, property type, budget proximity, financing direction and timing.",
      "Source context: asset, page, campaign or referral path that created the signal.",
      "Follow-up context: owner, last action, next step and segment.",
      "Readiness context: why this person should be contacted now or nurtured later."
    ],
    question: "If this context is missing, is your team following up with a lead or reconstructing the lead from scratch?"
  },
  {
    title: "Mini scorecard: is the market ready for review?",
    body:
      "An agent funnel is ready for review when there is a concrete market, an active sales function and a visible lead-quality problem. The check is not for teams that only want more names. It is for teams that want to understand why existing demand is not becoming reliable conversations.",
    bullets: [
      "There is a defined local market, property segment or seller/buyer focus.",
      "The team already receives enquiries, portal leads, valuation requests or website conversions.",
      "Sales can explain which leads waste time and which become real conversations.",
      "CRM or lead management exists, even if it is incomplete.",
      "Budget for a structured setup can be discussed if the diagnosis supports it."
    ],
    question: "Can you state which segment should improve first and why now?"
  },
  {
    title: "Symptoms worth reviewing, not a full solution",
    body:
      "This playbook does not provide a full seller funnel, buyer nurture sequence or campaign plan. Those decisions depend on market position, sales capacity, local trust, assets and CRM maturity. The useful first step is to identify which symptom is causing commercial drag.",
    bullets: [
      "Many valuation leads but few serious selling conversations indicate weak intent filtering.",
      "Many buyer enquiries but poor appointment quality indicate missing search and budget context.",
      "High portal activity but few owned opportunities indicate channel dependency.",
      "Manual follow-up and lost reminders indicate CRM and process gaps.",
      "Unclear source quality indicates reporting that cannot guide decisions."
    ],
    question: "Which symptom keeps repeating even after more campaigns, portals or content?"
  },
  {
    title: "What the Project Check clarifies",
    body:
      "The Project Check reviews whether your current enquiry path can qualify, segment and prepare leads in a way sales can use. It does not produce a full campaign plan for free.",
    bullets: [
      "Whether seller and buyer demand are separated before sales attention.",
      "Whether lead magnets attract the right local signal or only generic curiosity.",
      "Whether the right fields make seller and buyer readiness visible.",
      "Whether follow-up has enough structure to protect future opportunities.",
      "Whether a structured setup is commercially sensible for the market and team."
    ],
    question: "Which part of your enquiry path would be hardest to inspect honestly today?"
  },
  {
    title: "When the Project Check fits and when it does not",
    body:
      "The check fits broker teams, agencies and professional agents with a concrete market, active sales discipline and a real lead-quality problem. It does not fit if the expectation is raw lead volume, a guarantee or a free implementation plan.",
    bullets: [
      "Fit: local specialization, active follow-up and a clear sales bottleneck.",
      "Fit: existing traffic or portal dependency that needs owned enquiry structure.",
      "No fit: no sales ownership, no CRM discipline or no implementation budget.",
      "No fit: expectation that a free call should replace strategy, build and run."
    ],
    question: "Do you have a lead-quality problem that can be diagnosed, or only a wish for more volume?"
  },
  {
    title: "Clear next step: review the funnel before scaling it",
    body:
      "If your current system cannot separate seller intent, buyer readiness and follow-up priority, scaling it will usually scale the confusion. The next step is a focused diagnosis before more lead volume is added.",
    bullets: [
      "Use the check to test seller intent, buyer segmentation and prepared handover.",
      "Bring one local market, target segment or lead source that currently creates friction.",
      "Prepare examples of good and weak leads from recent weeks.",
      "Expect a decision on whether a structured setup makes sense, not a free operating manual."
    ],
    question: "Should you add more enquiries, or first inspect why current enquiries do not become reliable sales conversations?"
  }
];

const agentSectionsDe = [
  {
    title: "Das eigentliche Problem: Verkäufer- und Käuferleads ohne Kontext",
    body:
      "Makler-Leadgenerierung erzeugt oft Kontaktdaten, bevor sie Vertriebskontext erzeugt. Verkäuferleads kommen ohne Motivation, Timing oder Objektrealität. Käuferleads kommen ohne Budgetnähe, Suchlogik oder Reife. Das Team verbringt Zeit mit Basisfragen, die das System vorbereiten müsste.",
    bullets: [
      "Ein Verkäuferlead ist nicht wertvoll, wenn die Verkaufsabsicht unklar bleibt.",
      "Ein Käuferlead ist nicht sales-ready, wenn Budget, Timing und Suchgebiet fehlen.",
      "Portalabhängigkeit erzeugt Aktivität, aber zu wenig Kontrolle über Quelle, Segment und Follow-up.",
      "Wenn Follow-up von persönlicher Erinnerung abhängt, arbeitet der Anfrageweg noch nicht."
    ],
    question: "Wo verliert Ihr Team aktuell mehr Zeit: Verkäuferqualifizierung, Käufersortierung oder Follow-up-Disziplin?"
  },
  {
    title: "Typische Pipeline-Leaks bei Maklerteams",
    body:
      "Makler-Pipelines verlieren Qualität oft dort, wo Neugier wie Absicht behandelt wird. Ein Bewertungs-Klick, eine Portal-Anfrage oder ein lokaler Guide-Download kann nützlich sein, aber nur, wenn das System schwache Signale von ernsthaften nächsten Schritten trennt.",
    bullets: [
      "Verkäuferwege erzeugen Neugier, zeigen aber nicht Dringlichkeit oder Motivation.",
      "Käuferwege erfassen Interesse, trennen aber Suchprofil nicht von Stöbern.",
      "Lokale Expertise wird als Content genutzt, aber nicht als Conversion-Filter.",
      "CRM-Stufen sind zu grob, um zu zeigen, wer jetzt einen Call braucht.",
      "Nurturing fehlt oder ist zu allgemein, um spätere Verkaufsgespräche aufzubauen."
    ],
    question: "Welcher Leadtyp sieht im Reporting aktiv aus, ist aber in echten Gesprächen schwach?"
  },
  {
    title: "Was ein sales-ready Maklerlead zeigen muss",
    body:
      "Ein brauchbarer Maklerlead muss nicht die gesamte private Situation offenlegen. Er sollte aber genug Kontext zeigen, um die richtige Gesprächsart zu wählen: Verkäuferprüfung, Suchprofil-Call, Nurture-Pfad oder No-Fit-Entscheidung.",
    bullets: [
      "Verkäuferkontext: Objektart, Lage, wahrscheinliches Timing und Grund des Interesses.",
      "Käuferkontext: Suchgebiet, Objektart, Budgetnähe, Finanzierungsrichtung und Timing.",
      "Quellenkontext: Asset, Seite, Kampagne oder Empfehlungspfad, der das Signal erzeugt hat.",
      "Follow-up-Kontext: Owner, letzte Aktion, nächster Schritt und Segment.",
      "Reifekontext: warum diese Person jetzt kontaktiert oder später gepflegt werden sollte."
    ],
    question: "Wenn dieser Kontext fehlt, fasst Ihr Team dann einem Lead nach oder rekonstruiert es den Lead neu?"
  },
  {
    title: "Mini-Scorecard: Ist Ihr Markt prüfenswert vorbereitet?",
    body:
      "Ein Makler-Funnel ist prüfenswert vorbereitet, wenn ein konkreter Markt, aktive Vertriebsarbeit und ein sichtbares Leadqualitätsproblem vorhanden sind. Der Check ist nicht für Teams gedacht, die nur mehr Namen wollen. Er ist für Teams gedacht, die verstehen wollen, warum bestehende Nachfrage keine verlässliche Pipeline wird.",
    bullets: [
      "Es gibt einen definierten lokalen Markt, ein Objektsegment oder einen Verkäufer-/Käuferfokus.",
      "Das Team erhält bereits Anfragen, Portal-Leads, Bewertungsanfragen oder Website-Conversions.",
      "Sales kann erklären, welche Leads Zeit binden und welche echte Gespräche werden.",
      "CRM oder Leadmanagement existiert, auch wenn es unvollständig ist.",
      "Budget für einen strukturierten Aufbau kann besprochen werden, wenn die Diagnose es rechtfertigt."
    ],
    question: "Können Sie benennen, welches Segment zuerst besser werden soll und warum jetzt?"
  },
  {
    title: "Symptome prüfen, keine vollständige Lösung verschenken",
    body:
      "Dieses Playbook liefert keinen vollständigen Verkäuferweg, keine Käufer-Nurture-Sequenz und keinen Kampagnenplan. Diese Entscheidungen hängen von Marktposition, Sales-Kapazität, lokaler Vertrauensbasis, Assets und Systemreife ab. Der erste sinnvolle Schritt ist, das Symptom mit wirtschaftlicher Wirkung zu erkennen.",
    bullets: [
      "Viele Bewertungsleads, aber wenige ernsthafte Verkaufsgespräche deuten auf schwache Intent-Filter.",
      "Viele Käuferanfragen, aber schwache Terminqualität deuten auf fehlenden Such- und Budgetkontext.",
      "Hohe Portalaktivität, aber geringe eigene Pipeline deutet auf Kanalabhängigkeit.",
      "Manuelles Follow-up und verlorene Erinnerungen deuten auf CRM- und Prozesslücken.",
      "Unklare Quellenqualität deutet auf Reporting, das keine Entscheidungen führen kann."
    ],
    question: "Welches Symptom wiederholt sich trotz weiterer Kampagnen, Portale oder Inhalte?"
  },
  {
    title: "Welche Fragen der Projekt-Check klärt",
    body:
      "Der Projekt-Check prüft, ob Ihr aktueller Anfrageweg Leads so qualifizieren, segmentieren und vorbereiten kann, dass Sales damit arbeiten kann. Er liefert keinen vollständigen Kampagnenplan gratis.",
    bullets: [
      "Ob Verkäufer- und Käufernachfrage vor Sales-Aufwand sauber getrennt werden.",
      "Ob Lead Magnets das richtige lokale Signal anziehen oder nur allgemeine Neugier.",
      "Ob die richtigen Felder Verkäufer- und Käuferreife sichtbar machen.",
      "Ob Follow-up genug Struktur hat, um spätere Chancen zu schützen.",
      "Ob ein strukturierter Aufbau für Markt und Team wirtschaftlich sinnvoll ist."
    ],
    question: "Welcher Teil Ihres Anfragewegs wäre heute am schwierigsten ehrlich zu prüfen?"
  },
  {
    title: "Wann der Projekt-Check passt und wann nicht",
    body:
      "Der Check passt für Maklerteams, Agenturen und professionelle Makler mit konkretem Markt, aktiver Vertriebsdisziplin und echtem Leadqualitätsproblem. Er passt nicht, wenn nur rohe Leadmenge, eine Garantie oder ein kostenloser Umsetzungsplan erwartet wird.",
    bullets: [
      "Passend: lokale Spezialisierung, aktives Follow-up und klarer Vertriebsengpass.",
      "Passend: vorhandener Traffic oder Portalabhängigkeit, die eigene Pipeline-Struktur braucht.",
      "Nicht passend: keine Sales-Verantwortung, keine CRM-Disziplin oder kein Umsetzungsbudget.",
      "Nicht passend: Erwartung, dass ein kostenloser Call Strategie, Build und Run ersetzt."
    ],
    question: "Haben Sie ein Leadqualitätsproblem, das diagnostiziert werden kann, oder nur den Wunsch nach mehr Volumen?"
  },
  {
    title: "Klarer nächster Schritt: Funnel prüfen, bevor er skaliert",
    body:
      "Wenn Ihr aktuelles System Verkäuferabsicht, Käuferreife und Follow-up-Priorität nicht sauber trennt, skaliert mehr Volumen meistens die Unklarheit. Der nächste Schritt ist eine fokussierte Diagnose, bevor weitere Leads hinzukommen.",
    bullets: [
      "Nutzen Sie den Check, um Verkäufer-Intent, Käufersegmentierung und vorbereitete Übergabe zu prüfen.",
      "Bringen Sie einen lokalen Markt, ein Zielsegment oder eine Leadquelle mit, die aktuell Reibung erzeugt.",
      "Bereiten Sie Beispiele guter und schwacher Leads aus den letzten Wochen vor.",
      "Erwarten Sie eine Entscheidung, ob ein strukturierter Aufbau sinnvoll ist, kein kostenloses Betriebshandbuch."
    ],
    question: "Sollten Sie mehr Anfragen hinzufügen oder zuerst prüfen, warum aktuelle Anfragen keine verlässlichen Verkaufsgespräche werden?"
  }
];

const playbooks = [
  {
    slug: "developer-pipeline-playbook-en",
    lang: "en",
    audience: "developer",
    eyebrow: "Developer Project Playbook",
    title: "Are your project leads sales-ready, or just contact details?",
    subtitle:
      "A diagnostic guide for developers and project sales teams that need buyer conversations with prepared context, not more campaign noise.",
    promise:
      "Use this playbook to identify where project demand loses quality before sales can act, then decide whether a Project Check is the right next step.",
    forWhom: [
      "Developers with a concrete launch, project or sales pressure",
      "Project sales teams receiving enquiries but missing buyer context",
      "New-build or investment teams that need cleaner prepared handover",
      "Teams considering a structured setup but not yet sure where the leak sits"
    ],
    sections: developerSectionsEn
  },
  {
    slug: "bautraeger-pipeline-playbook-de",
    lang: "de",
    audience: "developer",
    eyebrow: "Bauträger-Projekt-Playbook",
    title: "Sind Ihre Projektleads sales-ready oder nur Kontaktdaten?",
    subtitle:
      "Ein Diagnose-Leitfaden für Bauträger, Projektentwickler und Neubauvertriebe, die Käufergespräche mit vorbereitetem Kontext brauchen, nicht mehr Kampagnenrauschen.",
    promise:
      "Nutzen Sie dieses Playbook, um zu erkennen, wo Projektnachfrage vor dem Vertrieb an Qualität verliert, und ob ein Projekt-Check der richtige nächste Schritt ist.",
    forWhom: [
      "Bauträger mit konkretem Launch, Projekt oder Vertriebsdruck",
      "Projektvertriebe mit Anfragen, aber zu wenig Käuferkontext",
      "Neubau- oder Investmentteams, die sauberere vorbereitete Übergabe brauchen",
      "Teams, die einen strukturierten Aufbau prüfen, aber den Engpass noch nicht klar sehen"
    ],
    sections: developerSectionsDe
  },
  {
    slug: "real-estate-agent-lead-playbook-en",
    lang: "en",
    audience: "agent",
    eyebrow: "Real Estate Agent Lead Playbook",
    title: "Do your seller and buyer leads create conversations, or just follow-up work?",
    subtitle:
      "A diagnostic guide for agents and broker teams that need owned demand, clearer intent and follow-up context beyond portals.",
    promise:
      "Use this playbook to see where seller and buyer demand loses quality, then decide whether a Project Check should review the system.",
    forWhom: [
      "Broker teams with portal dependency and weak owned demand",
      "Agents receiving seller or buyer enquiries without clear readiness",
      "Real estate teams that need prepared context before follow-up",
      "Teams considering a structured setup for a defined local market"
    ],
    sections: agentSectionsEn
  },
  {
    slug: "makler-lead-playbook-de",
    lang: "de",
    audience: "agent",
    eyebrow: "Makler-Lead-Playbook",
    title: "Erzeugen Ihre Verkäufer- und Käuferleads Gespräche oder nur Follow-up-Arbeit?",
    subtitle:
      "Ein Diagnose-Leitfaden für Makler und Maklerteams, die eigene Pipeline, klarere Absicht und Follow-up-Kontext jenseits von Portalen brauchen.",
    promise:
      "Nutzen Sie dieses Playbook, um zu erkennen, wo Verkäufer- und Käufernachfrage an Qualität verliert, und ob ein Projekt-Check das System prüfen sollte.",
    forWhom: [
      "Maklerteams mit Portalabhängigkeit und schwacher eigener Pipeline",
      "Makler mit Verkäufer- oder Käuferanfragen ohne klare Reife",
      "Immobilienteams, die vor dem Follow-up mehr vorbereiteten Kontext brauchen",
      "Teams, die einen strukturierten Aufbau für einen definierten lokalen Markt prüfen"
    ],
    sections: agentSectionsDe
  }
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pipelineSvg(lang, audience) {
  const labels =
    lang === "de"
      ? audience === "developer"
        ? ["Nachfrage", "Projekt-Fit", "Intent-Filter", "Übergabe", "Check-Frage"]
        : ["Lokale Nachfrage", "Segment", "Intent-Filter", "Übergabe", "Check-Frage"]
      : audience === "developer"
        ? ["Demand", "Project Fit", "Intent Filter", "Handover", "Check Question"]
        : ["Local Demand", "Segment", "Intent Filter", "Handover", "Check Question"];
  return `
  <svg viewBox="0 0 920 260" role="img" aria-label="Project check diagram">
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
          <rect x="${x - 70}" y="${y + 38}" width="140" height="42" rx="14" fill="#1b1f27" stroke="#333a45"/>
          <text x="${x}" y="${y + 64}" text-anchor="middle" fill="#ffffff" font-size="14" font-family="Arial" font-weight="700">${esc(label)}</text>
        </g>`;
      })
      .join("")}
  </svg>`;
}

function matrixSvg(lang) {
  const x = lang === "de" ? "Absicht" : "Intent";
  const y = lang === "de" ? "Kontext" : "Context";
  const cells =
    lang === "de"
      ? ["Nurture", "Prüfen", "No-Fit", "Prüfbar"]
      : ["Nurture", "Review", "No-fit", "Review-ready"];
  const label = (text, x, y, color, size = 25) => {
    if (text.length > 12) {
      const [first, second] = text.includes("-") ? text.split("-") : [text.slice(0, 7), text.slice(7)];
      return `<text x="${x}" y="${y - 11}" text-anchor="middle" fill="${color}" font-size="${size - 3}" font-family="Arial" font-weight="800"><tspan x="${x}">${esc(first)}${text.includes("-") ? "-" : ""}</tspan><tspan x="${x}" dy="28">${esc(second)}</tspan></text>`;
    }
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}" font-family="Arial" font-weight="800">${esc(text)}</text>`;
  };
  return `
  <svg viewBox="0 0 920 520" role="img" aria-label="Project check readiness matrix">
    <rect width="920" height="520" rx="28" fill="#f7f4eb"/>
    <line x1="160" y1="420" x2="790" y2="420" stroke="#1b1f27" stroke-width="3"/>
    <line x1="160" y1="420" x2="160" y2="90" stroke="#1b1f27" stroke-width="3"/>
    <text x="475" y="475" text-anchor="middle" fill="#111318" font-size="24" font-family="Arial" font-weight="700">${esc(x)}</text>
    <text x="70" y="255" text-anchor="middle" fill="#111318" font-size="24" font-family="Arial" font-weight="700" transform="rotate(-90 70 255)">${esc(y)}</text>
    <rect x="190" y="250" width="250" height="140" rx="20" fill="#ffffff" stroke="#ddd7c9"/>
    <rect x="500" y="250" width="250" height="140" rx="20" fill="#ffffff" stroke="#ddd7c9"/>
    <rect x="190" y="95" width="250" height="140" rx="20" fill="#ffffff" stroke="#ddd7c9"/>
    <rect x="500" y="95" width="250" height="140" rx="20" fill="#111318"/>
    ${label(cells[0], 315, 325, "#111318")}
    ${label(cells[1], 625, 325, "#111318")}
    ${label(cells[2], 315, 170, "#111318")}
    ${label(cells[3], 625, 170, "#ffd43b")}
  </svg>`;
}

function systemSvg(lang) {
  const labels =
    lang === "de"
      ? ["Signal", "Fit", "Übergabe", "Prüfbarkeit"]
      : ["Signal", "Fit", "Handover", "Review Readiness"];
  return `
  <svg viewBox="0 0 920 340" role="img" aria-label="Four-layer diagnosis system">
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
    <text x="640" y="285" fill="#aeb6c3" font-family="Arial" font-size="17">${lang === "de" ? "Ziel: vorbereitete Gespräche" : "Goal: prepared conversations"}</text>
  </svg>`;
}

function renderHtml(book) {
  const ui = shared[book.lang];
  const title = esc(book.title);
  const sections = book.sections
    .map(
      (section, index) => `
        <section class="page section">
          <div class="section-number">${String(index + 1).padStart(2, "0")}</div>
          <h2>${esc(section.title)}</h2>
          <p class="body">${esc(section.body)}</p>
          <ul class="bullets">${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
          <p class="diagnostic-question">${esc(section.question)}</p>
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
  .logo { width: 292px; height: auto; object-fit: contain; margin-bottom: 28mm; }
  .eyebrow { color: #ffd43b; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 800; font-size: 12px; }
  h1 { font-size: 54px; line-height: 1; letter-spacing: -1px; margin: 12px 0 18px; max-width: 700px; }
  .subtitle { color: #d9dee8; font-size: 21px; line-height: 1.45; max-width: 640px; }
  .promise { color: #fff1aa; font-size: 17px; line-height: 1.5; max-width: 640px; margin-top: 26px; }
  .cover-card { position: absolute; left: 20mm; right: 20mm; bottom: 20mm; border: 1px solid rgba(255,255,255,.16); border-radius: 8px; padding: 18px; background: rgba(255,255,255,.06); }
  .cover-card strong { color: #ffd43b; }
  .toc { background: #fbfaf6; }
  h2 { font-size: 38px; line-height: 1.08; margin: 0 0 16px; letter-spacing: 0; }
  h3 { font-size: 23px; margin: 0 0 10px; letter-spacing: 0; }
  .kicker { color: #666f7d; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; font-size: 12px; margin-bottom: 12px; }
  .body { font-size: 18px; line-height: 1.62; color: #303640; max-width: 710px; }
  .bullets { list-style: none; padding: 0; margin: 24px 0 0; display: grid; gap: 11px; }
  .bullets li { font-size: 15.5px; line-height: 1.42; padding: 14px 16px 14px 42px; border: 1px solid #e1ddd2; border-radius: 8px; background: #fff; position: relative; }
  .bullets li:before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: #ffd43b; position: absolute; left: 19px; top: 21px; box-shadow: 0 0 0 5px rgba(255,212,59,.18); }
  .diagnostic-question { margin-top: 28px; padding: 18px 20px; border-left: 5px solid #ffd43b; background: rgba(255,212,59,.14); font-size: 19px; line-height: 1.42; font-weight: 800; color: #151923; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 28px; }
  .card { border: 1px solid #ded9ce; border-radius: 8px; padding: 18px; background: #fff; min-height: 132px; }
  .card p { color: #3f4652; line-height: 1.5; }
  .visual { margin-top: 28px; }
  .visual svg { width: 100%; height: auto; display: block; }
  .diagnosis-page { min-height: 297mm; height: 297mm; }
  .diagnosis-page h2 { font-size: 35px; }
  .diagnosis-page .body { font-size: 17px; line-height: 1.5; }
  .system-visual-grid { display: block; margin-top: 22px; }
  .system-visual-grid .visual { margin-top: 0; }
  .system-visual-grid .visual + .visual { margin-top: 16px; }
  .diagnosis-page .diagnostic-question { margin-top: 20px; padding: 16px 18px; font-size: 17px; }
  .section-number { color: #ffd43b; font-weight: 900; font-size: 16px; margin-bottom: 18px; }
  .section:nth-child(odd) { background: #101217; color: #fff; }
  .section:nth-child(odd) .body { color: #d0d7e2; }
  .section:nth-child(odd) .bullets li { background: #191e27; border-color: #303846; color: #fff; }
  .section:nth-child(odd) .diagnostic-question { color: #fff7c7; background: rgba(255,212,59,.1); }
  .summary { background: #111318; color: #fff; }
  .summary .body { color: #d7deea; max-width: 700px; margin-bottom: 26px; }
  .summary .logo { margin-bottom: 34mm; }
  .cta { display: inline-block; margin-top: 16px; padding: 15px 22px; border-radius: 8px; background: #ffd43b; color: #171000; font-weight: 900; text-decoration: none; }
  .footer { position: absolute; left: 20mm; right: 20mm; bottom: 11mm; display: flex; justify-content: space-between; color: #8b93a0; font-size: 10px; }
  .page:after { content: ""; position: absolute; right: -60px; bottom: -60px; width: 190px; height: 190px; border-radius: 50%; background: rgba(255,212,59,.12); }
  .note { font-size: 13px; color: #606977; line-height: 1.5; margin-top: 24px; }
</style>
</head>
<body>
  <main>
    <section class="page cover">
      <img class="logo" src="${whiteLogoData}" alt="NovaLure">
      <div class="eyebrow">${esc(book.eyebrow)} | ${esc(ui.label)}</div>
      <h1>${title}</h1>
      <p class="subtitle">${esc(book.subtitle)}</p>
      <p class="promise">${esc(book.promise)}</p>
      <div class="visual">${pipelineSvg(book.lang, book.audience)}</div>
      <div class="cover-card"><strong>NovaLure</strong> | ${esc(ui.footer.replace(/^NovaLure\s*\|\s*/, ""))}</div>
    </section>
    <section class="page toc">
      <div class="kicker">${esc(ui.introEyebrow)}</div>
      <h2>${esc(ui.introTitle)}</h2>
      <p class="body">${esc(ui.introBody)}</p>
      <div class="grid">${book.forWhom.map((item) => `<div class="card"><h3>${esc(item)}</h3><p>${esc(ui.introCardBody)}</p></div>`).join("")}</div>
      <p class="diagnostic-question">${book.lang === "de" ? "Wenn diese Ausgangslage konkret ist, ist ein Projekt-Check sinnvoller als weitere allgemeine Marketingideen." : "If this situation is concrete, a Project Check is more useful than another set of general marketing ideas."}</p>
      <p class="note">${esc(ui.note)}</p>
      <div class="footer"><span>${esc(ui.footer)}</span><span>02</span></div>
    </section>
    <section class="page diagnosis-page">
      <div class="kicker">${esc(ui.systemEyebrow)}</div>
      <h2>${esc(ui.systemTitle)}</h2>
      <p class="body">${esc(ui.systemBody)}</p>
      <div class="system-visual-grid">
        <div class="visual">${systemSvg(book.lang)}</div>
        <div class="visual">${matrixSvg(book.lang)}</div>
      </div>
      <p class="diagnostic-question">${book.lang === "de" ? "Wenn ein Feld in dieser Logik unklar bleibt, sollte es im Projekt-Check geprüft werden, bevor mehr Budget in Reichweite fließt." : "If one part of this logic is unclear, it should be reviewed in the Project Check before more budget is pushed into reach."}</p>
      <div class="footer"><span>${esc(ui.footer)}</span><span>03</span></div>
    </section>
    ${sections}
    <section class="page summary">
      <img class="logo" src="${whiteLogoData}" alt="NovaLure">
      <div class="kicker">${esc(ui.summaryEyebrow)}</div>
      <h2>${esc(ui.summaryTitle)}</h2>
      <p class="body">${esc(ui.summaryBody)}</p>
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
    const html = renderHtml(book);
    const htmlPath = path.join(outDir, `${book.slug}.html`);
    fs.writeFileSync(htmlPath, html, "utf8");
    console.log(`Created ${path.relative(root, htmlPath)}`);
    return { book, html };
  });

  if (process.env.NOVALURE_HTML_ONLY === "1") {
    return;
  }

  if (!chromium) {
    console.warn("PDF rendering skipped. Playwright is not available; run scripts/render-playbook-pdfs.py in an environment with ReportLab.");
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
