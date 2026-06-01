import Image from "next/image";
import Link from "next/link";
import { getPath, getPlaybookFormPath } from "@/lib/i18n";
import { playbooks, type Cta, type HomeContent, type PageContent } from "@/content/pages";
import { ContactInquiryForm } from "@/components/ContactInquiryForm";
import { FunnelHeroVisual } from "@/components/FunnelHeroVisual";
import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholders";
import { TeamLeadImage } from "@/components/TeamLeadImage";

type Locale = "en" | "de";

export function MarketingPage({ content }: { content: PageContent | HomeContent }) {
  if (content.template === "home") return <HomePage content={content as HomeContent} />;
  if (content.template === "playbooks") return <PlaybooksPage content={content} />;
  if (content.template === "contact") return <ContactPage content={content} />;
  if (content.template === "legal") return <LegalPage content={content} />;
  if (content.template === "thank-you") return <ThankYouPage content={content} />;
  if (content.template === "handover") return <HandoverPage content={content} />;
  return <AudiencePage content={content} />;
}

function Hero({ content, visual = false }: { content: PageContent; visual?: boolean }) {
  return (
    <section className={`hero hero-${content.template}`}>
      <div className="hero-copy">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="hero-description">{content.description}</p>
        <div className="hero-actions">
          <CtaLink className="button button-primary" locale={content.locale} cta={content.primaryCta} track="cta_primary" />
          <CtaLink className={getSecondaryCtaClass(content.secondaryCta)} locale={content.locale} cta={content.secondaryCta} track="cta_secondary" />
        </div>
        <ul className="hero-bullets">
          {content.heroBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
        {content.template === "home" && <HeroLeadPreview locale={content.locale} />}
      </div>
      {visual ? <FunnelHeroVisual locale={content.locale} /> : <SystemMiniCard bullets={content.heroBullets} />}
    </section>
  );
}

function HeroLeadPreview({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const rows = de
    ? [
        ["Anfrage", "Eigentümer möchte Verkaufsoptionen prüfen"],
        ["Kontext", "Motivation, Timing und Objektart bekannt"],
        ["Nächster Schritt", "Priorisierter Rückruf statt Rohlead im Postfach"]
      ]
    : [
        ["Enquiry", "Seller wants to review selling options"],
        ["Context", "Motivation, timing and property type known"],
        ["Next step", "Prioritised callback instead of a raw inbox lead"]
      ];

  return (
    <div className="hero-lead-preview" aria-label={de ? "Mini-Handover Beispiel" : "Mini handover example"}>
      <span>{de ? "Mini-Handover" : "Mini handover"}</span>
      {rows.map(([label, value]) => (
        <div key={label}>
          <small>{label}</small>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function SystemMiniCard({ bullets }: { bullets: string[] }) {
  return (
    <div className="hero-panel" aria-label="System highlights">
      {bullets.map((point, index) => (
        <div className="metric" key={point}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{point}</strong>
        </div>
      ))}
    </div>
  );
}

function HomePage({ content }: { content: HomeContent }) {
  return <DeveloperLandingPage locale={content.locale} />;
}

const landingCtaLabels = {
  de: { primary: "Projekt-Check anfragen", secondary: "Playbook herunterladen" },
  en: { primary: "Request Project Check", secondary: "Download playbook" }
} as const;

const developerLandingCopy = {
  de: {
    hero: {
      label: "Projektvermarktung mit Vertriebsstruktur",
      headline: "Vom Projektauftritt bis zum qualifizierten Käufergespräch.",
      subline:
        "Wir entwickeln Storytelling, Visualisierung, Exposé, Kampagne, Nachfassen und systemgestützte Übergabe so, dass Interessenten nicht nur anfragen, sondern vorbereitet beim Vertrieb ankommen."
    },
    visible: {
      label: "Was wir sichtbar machen",
      headline: "Material, das Interesse weckt und die richtige Erwartung setzt.",
      text:
        "Visualisierung, Exposé und Projektstory sind der sichtbare Teil. Sie sollen nicht nur gut aussehen, sondern die passenden Käufer anziehen und die spätere Qualifizierung vorbereiten.",
      captions: ["Außenvisualisierung – Beispiel", "Innenvisualisierung – Beispiel", "Exposé-Auszug – Beispiel"]
    },
    journey: {
      label: "Wie aus Projektinteresse ein Gespräch wird",
      headline: "Wir bauen den Weg, nicht nur einzelne Marketingteile.",
      text:
        "Ein gutes Projekt braucht einen sauberen Ablauf: Aufmerksamkeit, Information, Anfrage, Nachfassen, Qualifizierung und eine klare Übergabe an den Vertrieb.",
      steps: [
        ["01", "Storytelling", "Eine Positionierung, die echtes Kaufinteresse anspricht."],
        ["02", "Visualisierung", "Bilder, die zeigen, was wirklich entsteht."],
        ["03", "Exposé", "Unterlagen, die informieren und gleichzeitig qualifizieren."],
        ["04", "Kampagne", "Reichweite bei genau der richtigen Zielgruppe."],
        ["05", "Nachfassen", "Strukturiert und persönlich dort, wo es sinnvoll ist."],
        ["06", "Übergabe", "Der Vertrieb sieht Kontext, Priorität und den nächsten Schritt."]
      ],
      closing: "Am Ende steht keine lose Anfrage, sondern ein vorbereiteter Gesprächsanlass."
    },
    system: {
      label: "Das System im Hintergrund",
      headline: "Unser eigenes CRM-System hält den Prozess zusammen.",
      text:
        "Material, Anfragen und Nachfassen dürfen nicht verstreut bleiben. Dafür nutzen wir ein eigenes System, in dem Anfrage, Verlauf, Zuständigkeit und nächster Schritt zusammenlaufen.",
      points: [
        "Jede Anfrage bekommt Kontext: Herkunft, Interesse, Timing und Budgetnähe.",
        "Jeder Lead braucht Zuständigkeit, Status und eine nächste Aktion.",
        "Das System bleibt im Hintergrund. Für Sie zählt, dass der Vertrieb vorbereitet arbeiten kann."
      ],
      closing:
        "Das CRM ist kein Zusatzprodukt auf der Website, sondern der operative Rahmen hinter Vermarktung, Nachfassen und Übergabe."
    },
    outcome: {
      label: "Was bei Ihrem Vertrieb ankommt",
      headline: "Vorbereitete Anfragen statt Kontakte zum Sortieren.",
      text:
        "Ihr Team sieht, woher die Anfrage kommt, was der Interessent sucht, wann ein Kauf realistisch ist und welcher nächste Schritt sinnvoll ist."
    },
    reference: {
      label: "Ein echtes Beispiel",
      headline: "Aus ungefilterten Kontakten wurde eine planbare Pipeline.",
      quote:
        "Wir bekommen jetzt einen steten Fluss qualifizierter Anfragen statt ungefilterter Kontakte – das macht unsere Pipeline planbar.",
      person: "SV Thomas Grasl, Inhaber, GRASL Immobilien, Schwaz",
      metrics: "15–20 qualifizierte Anfragen pro Monat · über 110.000 EUR Provisionsvolumen aus aktiven Mandaten"
    },
    team: {
      label: "Wer dahintersteht",
      headline: "Ein fester Ansprechpartner. Ein Team, das liefert.",
      text:
        "Bei NovaLure werden Sie nicht durch wechselnde Kontakte gereicht. Franz Romih ist Ihr direkter Ansprechpartner – er analysiert Ihr Projekt, führt durch den Prozess und sorgt dafür, dass alle Teile ineinandergreifen. Dahinter arbeitet ein eingespieltes Team aus festen Mitstreitern und ausgewählten Spezialisten für Visualisierung, Exposé, Performance-Marketing und die Entwicklung unseres eigenen CRM-Systems. Sie sprechen mit einer Person, die Ihr Projekt kennt – und bekommen die Fachtiefe eines ganzen Teams."
    },
    playbook: {
      label: "Playbook",
      headline: "Bevor wir sprechen: Sehen Sie, wo Leads Qualität verlieren.",
      text:
        "Das Playbook zeigt die typischen Lücken zwischen Projektauftritt, Anfrage, Nachfassen und Vertrieb. Es zeigt genug, um das Problem zu erkennen, ohne die komplette Maschine offenzulegen."
    },
    audience: {
      label: "Für wen wir arbeiten",
      headline: "Für Bauträger, die ihr Projekt strukturiert vermarkten und verkaufen wollen.",
      text:
        "Wenn ein Projekt verkauft werden muss, reichen einzelne Maßnahmen nicht. Ihr Vertrieb braucht Interessenten, die zu Projekt, Budget und Zeitplan passen. Genau dafür bauen wir den Weg vom Projektauftritt bis zum Gespräch.",
      link: "Für Makler & Maklerteams"
    },
    trust: {
      label: "Warum Sie uns vertrauen können",
      headline: "Keine erfundenen Zahlen. Echtes Material.",
      points: [
        "Sie sehen, was Sie bekommen. Visualisierungen und Exposé-Beispiele liegen offen – beurteilen Sie die Qualität selbst.",
        "Kein Lead-Versprechen aus der Luft. Anfragenzahlen hängen von Projekt, Markt und Budget ab. Wir nennen keine Fantasiewerte.",
        "Ein echter Prozess, kein anonymer Funnel. Entscheidend ist, dass jede Anfrage einen nächsten Schritt bekommt."
      ]
    },
    closing: {
      headline: "Lassen Sie uns Ihren Projektweg prüfen.",
      subline:
        "30 Minuten. Wir schauen auf Projektauftritt, Nachfrage, Nachfassen und Übergabe und klären, wo ein sauberer Prozess für Sie Sinn macht."
    }
  },
  en: {
    hero: {
      label: "Project marketing with sales structure",
      headline: "From project presence to qualified buyer conversation.",
      subline:
        "We create storytelling, visuals, expose, campaign, follow-up and system-supported handover so enquiries do not just arrive, but reach sales prepared."
    },
    visible: {
      label: "What we make visible",
      headline: "Material that creates interest and sets the right expectation.",
      text:
        "Visuals, exposes and project story are the visible layer. They should not only look good, but attract the right buyers and prepare later qualification.",
      captions: ["Exterior visual – example", "Interior visual – example", "Expose excerpt – example"]
    },
    journey: {
      label: "How project interest becomes a conversation",
      headline: "We build the path, not just isolated marketing pieces.",
      text:
        "A good project needs a clear flow: attention, information, enquiry, follow-up, qualification and a useful handover to sales.",
      steps: [
        ["01", "Storytelling", "Positioning that speaks to real buying intent."],
        ["02", "Visualisation", "Visuals that show what is actually being built."],
        ["03", "Expose", "Documents that inform and qualify at the same time."],
        ["04", "Campaign", "Reach aimed at exactly the right audience."],
        ["05", "Follow-up", "Structured and personal where it makes sense."],
        ["06", "Handover", "Sales sees context, priority and the next step."]
      ],
      closing: "The result is not a loose enquiry, but a prepared reason to speak."
    },
    system: {
      label: "The system behind the process",
      headline: "Our own CRM system keeps the process together.",
      text:
        "Material, enquiries and follow-up cannot stay scattered. We use our own system so enquiry, history, ownership and next step come together.",
      points: [
        "Every enquiry receives context: source, interest, timing and budget proximity.",
        "Every lead needs ownership, status and a next action.",
        "The system stays in the background. What matters is that sales can work prepared."
      ],
      closing:
        "The CRM is not the product demo on the website. It is the operating frame behind marketing, follow-up and handover."
    },
    outcome: {
      label: "What reaches your sales team",
      headline: "Prepared enquiries instead of contacts to sort.",
      text:
        "Your team sees where the enquiry came from, what the buyer wants, when a purchase may be realistic and which next step makes sense."
    },
    reference: {
      label: "A real example",
      headline: "Unfiltered contacts became a predictable pipeline.",
      quote:
        "We now receive a steady flow of qualified enquiries instead of unfiltered contacts — that makes our pipeline predictable.",
      person: "SV Thomas Grasl, Owner, GRASL Immobilien, Schwaz",
      metrics: "15–20 qualified enquiries per month · EUR 110k+ commission volume from active mandates"
    },
    team: {
      label: "The people behind NovaLure",
      headline: "One consistent contact. A team that delivers.",
      text:
        "At NovaLure you are not passed between changing contacts. Franz Romih is your direct point of contact — he analyses your project, guides the process and makes sure every part fits together. Behind him works an established team of core people and selected specialists for visualisation, exposes, performance marketing and the development of our own CRM system. You speak with one person who knows your project — and get the depth of a whole team."
    },
    playbook: {
      label: "Playbook",
      headline: "Before we talk: see where leads lose quality.",
      text:
        "The playbook shows the typical gaps between project presence, enquiry, follow-up and sales. It shows enough to recognise the problem without exposing the whole machine."
    },
    audience: {
      label: "Who we work for",
      headline: "For developers who want to market and sell their project with structure.",
      text:
        "When a project needs to sell, isolated measures are not enough. Sales needs buyers who match the project, budget and timing. We build the path from project presence to conversation.",
      link: "For agents & broker teams"
    },
    trust: {
      label: "Why you can trust us",
      headline: "No invented numbers. Real material.",
      points: [
        "You see what you get. Visuals and expose examples are open — judge the quality yourself.",
        "No lead promises out of thin air. Enquiry numbers depend on project, market and budget. We do not quote fantasy figures.",
        "A real process, not an anonymous funnel. What matters is that every enquiry receives a next step."
      ]
    },
    closing: {
      headline: "Let us review your project path.",
      subline:
        "30 minutes. We look at project presence, demand, follow-up and handover and clarify where a clean process makes sense."
    }
  }
} as const;

function DeveloperLandingPage({ locale }: { locale: Locale }) {
  const copy = developerLandingCopy[locale];
  const de = locale === "de";

  return (
    <main className="developer-landing">
      <section className="developer-hero">
        <div className="developer-hero-copy">
          <p className="eyebrow">{copy.hero.label}</p>
          <h1>{copy.hero.headline}</h1>
          <p className="developer-hero-subline">{copy.hero.subline}</p>
          <LandingCtaPair locale={locale} />
        </div>
        <div className="developer-hero-media" aria-label={de ? "Hero-Video Projektvisualisierung" : "Hero visualisation video"}>
          <video
            className="developer-hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/hero-visualisation-fallback.png"
          >
            <source src="/videos/hero-visualisation-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="landing-section landing-visible-work" id="visible-work">
        <LandingSectionHeading label={copy.visible.label} headline={copy.visible.headline} />
        <div className="visual-rendering-grid">
          <RenderingVisual
            src="/images/visual-exterior-01.jpg"
            alt={de ? "Aussenvisualisierung eines alpinen Wohnprojekts" : "Exterior rendering of an alpine residential project"}
            ratio="landscape"
            caption={copy.visible.captions[0]}
          />
          <RenderingVisual
            src="/images/visual-interior-01.jpg"
            alt={de ? "Innenvisualisierung eines Badezimmers mit Holz und Stein" : "Interior rendering of a bathroom with wood and stone finishes"}
            ratio="landscape"
            caption={copy.visible.captions[1]}
          />
          <ExposeExcerptPreview locale={locale} caption={copy.visible.captions[2]} />
        </div>
        <p className="landing-section-text">{copy.visible.text}</p>
      </section>

      <section className="landing-section landing-journey" id="project-path">
        <LandingSectionHeading label={copy.journey.label} headline={copy.journey.headline} body={copy.journey.text} />
        <ol className="journey-list">
          {copy.journey.steps.map(([number, title, body]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="landing-closing-line">{copy.journey.closing}</p>
      </section>

      <section className="landing-section landing-system" id="system">
        <div>
          <LandingSectionHeading label={copy.system.label} headline={copy.system.headline} body={copy.system.text} />
          <ul className="system-point-list">
            {copy.system.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <p className="landing-closing-line">{copy.system.closing}</p>
        </div>
        <SystemDashboardMock locale={locale} />
      </section>

      <section className="landing-section landing-outcome" id="proof">
        <div>
          <LandingSectionHeading label={copy.outcome.label} headline={copy.outcome.headline} body={copy.outcome.text} />
        </div>
        <MockHandover locale={locale} compact />
      </section>

      <LandingCtaBand locale={locale} />

      <CaseProofSection locale={locale} />

      <section className="landing-section landing-team" id="team">
        <div className="team-photo-frame">
          <Image
            src="/images/team-franz-romih.png"
            alt="Franz Romih, NovaLure"
            width={1448}
            height={1086}
            sizes="(min-width: 900px) 46vw, 92vw"
          />
        </div>
        <div className="team-copy">
          <LandingSectionHeading label={copy.team.label} headline={copy.team.headline} />
          <p className="landing-section-text">{copy.team.text}</p>
        </div>
      </section>

      <section className="landing-section landing-playbook" id="playbook">
        <div>
          <LandingSectionHeading label={copy.playbook.label} headline={copy.playbook.headline} body={copy.playbook.text} />
          <Link className="button button-primary" href={getPlaybookFormPath(locale)} data-track="home_playbook_primary">
            {landingCtaLabels[locale].secondary}
          </Link>
        </div>
      </section>

      <section className="landing-section landing-audience" id="audience">
        <LandingSectionHeading label={copy.audience.label} headline={copy.audience.headline} body={copy.audience.text} />
        <Link className="landing-text-link landing-text-link-dark" href={getPath(locale, "agents")}>
          {copy.audience.link}
        </Link>
      </section>

      <section className="landing-section landing-trust" id="trust">
        <LandingSectionHeading label={copy.trust.label} headline={copy.trust.headline} />
        <ul className="trust-point-list">
          {copy.trust.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>

      <section className="landing-closing-cta" id="project-check">
        <h2>{copy.closing.headline}</h2>
        <p>{copy.closing.subline}</p>
        <LandingCtaPair locale={locale} />
      </section>
    </main>
  );
}

function LandingSectionHeading({ label, headline, body }: { label: string; headline: string; body?: string }) {
  return (
    <div className="landing-section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{headline}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function LandingCtaPair({ locale }: { locale: Locale }) {
  return (
    <div className="landing-cta-row">
      <Link className="button button-primary" href={`${getPath(locale, "contact")}#book-audit`} data-track="project_check_cta">
        {landingCtaLabels[locale].primary}
      </Link>
      <Link className="landing-text-link" href={getPlaybookFormPath(locale)} data-track="playbook_text_cta">
        {landingCtaLabels[locale].secondary}
      </Link>
    </div>
  );
}

function LandingCtaBand({ locale }: { locale: Locale }) {
  return (
    <section className="landing-mid-cta">
      <LandingCtaPair locale={locale} />
    </section>
  );
}

function RenderingVisual({ src, alt, ratio, caption }: { src: string; alt: string; ratio: "landscape" | "portrait"; caption: string }) {
  return (
    <figure className={`visual-rendering visual-rendering-${ratio}`}>
      <div className="visual-rendering-frame">
        <Image src={src} alt={alt} fill sizes="(min-width: 1180px) 31vw, (min-width: 900px) 46vw, 92vw" />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function ExposeExcerptPreview({ locale, caption }: { locale: Locale; caption: string }) {
  const de = locale === "de";
  const copy = de
    ? {
        eyebrow: "Exklusive Neubau-Residenz",
        title: "Penthouse-Residenz",
        location: "Alpine Höhenlage · Südausrichtung · Bergpanorama",
        imageAlt: "Moderne alpine Penthouse-Terrasse mit Glasfronten, Naturstein und Bergpanorama",
        headline: "Privater Rückzugsort mit Panorama, Licht und diskreter Architektur.",
        text:
          "Großzügige Glasflächen, warme Holzdecken und Naturstein schaffen eine ruhige Penthouse-Atmosphäre. Die Terrasse erweitert den Wohnraum nach außen und setzt das Bergpanorama als zentrales Gestaltungselement.",
        facts: [["Wohnfläche", "142 m²"], ["Terrasse", "38 m²"], ["Zimmer", "4"], ["Etage", "Penthouse"]],
        features: ["Bodentiefe Fenster", "Eichenparkett und Natursteinbäder", "Smart-Home, Tiefgarage und Concierge"],
        footer: "Preis auf Anfrage · Bezugsfertig in Vorbereitung"
      }
    : {
        eyebrow: "Exclusive new-build residence",
        title: "Penthouse Residence",
        location: "Alpine elevation · south-facing · mountain panorama",
        imageAlt: "Modern alpine penthouse terrace with glass fronts, natural stone and mountain panorama",
        headline: "A private retreat shaped by panorama, light and quiet architecture.",
        text:
          "Generous glazing, warm timber ceilings and natural stone create a calm penthouse atmosphere. The terrace extends the living space outdoors and frames the mountain panorama as the defining design element.",
        facts: [["Living space", "142 m²"], ["Terrace", "38 m²"], ["Rooms", "4"], ["Floor", "Penthouse"]],
        features: ["Floor-to-ceiling windows", "Oak flooring and natural-stone bathrooms", "Smart home, underground parking and concierge"],
        footer: "Price on request · Occupancy in preparation"
      };

  return (
    <figure className="expose-excerpt-preview">
      <article className="expose-sheet" aria-label={de ? "A4 Exposé-Auszug" : "A4 expose excerpt"}>
        <header className="expose-sheet-header">
          <div>
            <span>{copy.eyebrow}</span>
            <h3>{copy.title}</h3>
          </div>
          <p>{copy.location}</p>
        </header>
        <div className="expose-sheet-image">
          <Image
            src="/images/ai-render-15594499.jpg"
            alt={copy.imageAlt}
            fill
            sizes="(min-width: 1180px) 23vw, (min-width: 900px) 46vw, 92vw"
          />
        </div>
        <dl className="expose-facts">
          {copy.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="expose-sheet-body">
          <h4>{copy.headline}</h4>
          <p>{copy.text}</p>
        </div>
        <ul className="expose-highlight-list">
          {copy.features.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <footer className="expose-sheet-footer">
          <span>{copy.footer}</span>
        </footer>
      </article>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function SystemDashboardMock({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const stats = de
    ? [
        ["Projekt", "Pre-Launch"],
        ["Material", "6 Assets"],
        ["Anfragen", "vorbereitet"]
      ]
    : [
        ["Project", "Pre-launch"],
        ["Material", "6 assets"],
        ["Enquiries", "prepared"]
      ];
  const rows = de
    ? [
        ["Penthouse A3", "Besichtigung", "87"],
        ["Gartenhaus B1", "Finanzierung", "74"],
        ["Loft C2", "Kontakt", "68"]
      ]
    : [
        ["Penthouse A3", "Viewing", "87"],
        ["Garden Home B1", "Funding", "74"],
        ["Loft C2", "Callback", "68"]
      ];

  return (
    <div className="system-dashboard-mock" aria-label={de ? "NovaLure CRM Systemansicht" : "NovaLure CRM system view"}>
      <div className="system-dashboard-top">
        <span aria-hidden="true" />
        <strong>NovaLure CRM</strong>
        <em>{de ? "Systembeispiel" : "System example"}</em>
      </div>
      <div className="system-dashboard-stats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="system-dashboard-main">
        <div className="system-dashboard-bars" aria-hidden="true">
          <span style={{ height: "54%" }} />
          <span style={{ height: "76%" }} />
          <span style={{ height: "63%" }} />
          <span style={{ height: "88%" }} />
          <span style={{ height: "70%" }} />
        </div>
        <div className="system-dashboard-pipeline">
          <p>{de ? "Pipeline Handover" : "Pipeline handover"}</p>
          {rows.map(([project, status, score]) => (
            <div key={project}>
              <span>{project}</span>
              <strong>{status}</strong>
              <em>{score}</em>
            </div>
          ))}
        </div>
      </div>
      <div className="system-dashboard-footer">
        <span>{de ? "Quelle" : "Source"}</span>
        <strong>{de ? "Kampagne, Visualisierung, Exposé und Übergabe verbunden" : "Campaign, visualisation, expose and handover connected"}</strong>
      </div>
    </div>
  );
}

function TrustSnapshot({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const cards = de
    ? [
        {
          label: "Leadqualität",
          metric: "Bessere Anfragen",
          body: "Der Fokus liegt auf echter Kauf- oder Verkaufsabsicht statt auf möglichst vielen Rohkontakten."
        },
        {
          label: "Vertriebszeit",
          metric: "Weniger Sortierarbeit",
          body: "Ihr Team erkennt früher, welche Anfragen passen und welche erst später relevant sind."
        },
        {
          label: "Übergabe",
          metric: "vorbereitet",
          body: "Quelle, Interesse, Timing, Budgetnähe und nächster Schritt sind vor dem ersten Gespräch sichtbar."
        },
        {
          label: "Unternehmen",
          metric: "EU-basiert",
          body: "NovaLure CLG in Irland, spezialisiert auf Immobilienvertrieb in DACH, UK und international."
        }
      ]
    : [
        {
          label: "Lead quality",
          metric: "Better enquiries",
          body: "The focus is real buyer or seller intent, not the highest possible volume of raw contacts."
        },
        {
          label: "Sales time",
          metric: "Less sorting work",
          body: "Your team sees earlier which enquiries fit and which ones should be followed later."
        },
        {
          label: "Handover",
          metric: "prepared",
          body: "Source, interest, timing, budget proximity and next step are visible before the first call."
        },
        {
          label: "Company",
          metric: "EU-based",
          body: "NovaLure CLG in Ireland, specialised in real estate sales across DACH, UK and international markets."
        }
      ];

  return (
    <section className="trust-snapshot" aria-label={de ? "Vertrauenssignale" : "Trust signals"}>
      <div className="trust-copy">
        <p className="eyebrow">{de ? "Sofort klar" : "Immediate proof"}</p>
        <h2>{de ? "Es geht nicht um mehr Rohleads. Es geht um bessere Gespräche." : "This is not about more raw leads. It is about better conversations."}</h2>
        <p>
          {de
            ? "NovaLure ist auf Immobilienvertrieb spezialisiert: weniger Sortierarbeit, mehr Kontext und ein klarer nächster Schritt für Käufer, Eigentümer oder Projektinteressenten."
            : "NovaLure is specialised in real estate sales: less manual sorting, more context and a clear next step for buyers, sellers or project enquiries."}
        </p>
      </div>
      <div className="trust-proof">
        <div className="trust-grid">
          {cards.map((card) => (
            <article className="trust-card" key={card.metric}>
              <small>{card.label}</small>
              <strong>{card.metric}</strong>
              <span>{card.body}</span>
            </article>
          ))}
        </div>
        <p className="trust-note">
          {de
            ? "Konkrete Kundenergebnisse bleiben im Testimonial. Dieser Abschnitt erklärt, worauf NovaLure optimiert: Qualität, Kontext und weniger Vertriebszeitverlust."
            : "Concrete client outcomes stay in the testimonial. This section explains what NovaLure optimises for: quality, context and less wasted sales time."}
        </p>
      </div>
    </section>
  );
}

function CaseProofSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const copy = de
    ? {
        eyebrow: "Reales Beispiel",
        headline: "Ein reales Beispiel: weniger Rohkontakte, mehr qualifizierte Gespräche.",
        body: "Bei GRASL Immobilien wurde aus ungefilterter Verkäuferakquise eine planbarere Pipeline mit qualifizierten Anfragen.",
        quote: "Wir bekommen kontinuierlich qualifizierte Anfragen statt ungefilterter Kontakte - das macht unsere Pipeline planbar.",
        name: "SV Thomas Grasl",
        role: "Inhaber GRASL Immobilien, Schwaz",
        firstMetric: "15-20",
        firstLabel: "qualifizierte Anfragen pro Monat",
        secondMetric: "EUR 110k+",
        secondLabel: "Provisionsvolumen aus aktiven Mandaten",
        cta: "Beispiel-Handover ansehen"
      }
    : {
        eyebrow: "Real example",
        headline: "A real example: fewer raw contacts, more qualified conversations.",
        body: "For GRASL Immobilien, unfiltered seller acquisition turned into a more predictable pipeline with qualified enquiries.",
        quote: "We now receive a steady flow of qualified enquiries instead of unfiltered contacts - that makes our pipeline predictable.",
        name: "SV Thomas Grasl",
        role: "Owner, GRASL Immobilien, Schwaz",
        firstMetric: "15-20",
        firstLabel: "qualified enquiries per month",
        secondMetric: "EUR 110k+",
        secondLabel: "commission volume from active mandates",
        cta: "See sample handover"
      };

  return (
    <section className="case-proof-section" id="case-proof" aria-label={de ? "Grasl Immobilien Beispiel" : "GRASL Immobilien example"}>
      <div className="case-proof-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.headline}</h2>
        <p>{copy.body}</p>
        <Link className="hero-subtle-link case-proof-link" href={`${getPath(locale, "home")}#proof`} data-track="case_handover">
          {copy.cta}
        </Link>
      </div>
      <article className="case-proof-card">
        <div className="case-proof-person">
          <Image
            className="testimonial-avatar"
            src="/images/thomas-grasl-portrait.jpg"
            alt="SV Thomas Grasl"
            width={84}
            height={84}
            sizes="84px"
          />
          <div>
            <strong>{copy.name}</strong>
            <span>{copy.role}</span>
          </div>
          <Image
            className="testimonial-logo"
            src="/images/grasl-immobilien-logo.png"
            alt="GRASL Immobilien Logo"
            width={71}
            height={52}
            sizes="120px"
          />
        </div>
        <p className="case-proof-quote">&ldquo;{copy.quote}&rdquo;</p>
        <dl className="case-proof-metrics">
          <div>
            <dt>{copy.firstMetric}</dt>
            <dd>{copy.firstLabel}</dd>
          </div>
          <div>
            <dt>{copy.secondMetric}</dt>
            <dd>{copy.secondLabel}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

function ProofSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  return (
    <section className="proof-section" id="proof" data-track-section="proof">
      <div className="section-heading">
        <p className="eyebrow">{de ? "Systembeispiel" : "System example"}</p>
        <h2>{de ? "Was eine vorbereitete Anfrage vor dem ersten Gespräch enthalten sollte" : "What a prepared enquiry should contain before the first call"}</h2>
        <p>
          {de
            ? "Der Wert entsteht nicht durch Name und Telefonnummer. Der Wert entsteht, wenn Quelle, Interesse, Timing, Budgetnähe, Zuständigkeit und nächster Schritt sichtbar sind."
            : "The value is not the name and phone number. The value appears when source, interest, timing, budget proximity, ownership and next step are visible."}
        </p>
      </div>
      <div className="proof-feature-grid">
        <article className="proof-card proof-card-feature">
          <span className="proof-label">{de ? "Vorbereitete Übergabe" : "Prepared handover"}</span>
          <h3>{de ? "Eine Anfrage wird erst wertvoll, wenn Vertrieb den nächsten sinnvollen Schritt sieht." : "An enquiry becomes valuable when sales can see the next sensible step."}</h3>
          <MockHandover locale={locale} compact />
        </article>
        <div className="proof-support-grid">
        <ProofCard title={de ? "Was im Projekt-Check geprüft wird" : "What the Project Check reviews"} label={de ? "Beispiel-Auszug" : "Example excerpt"}>
          <Scorecard locale={locale} />
        </ProofCard>
        <ProofCard title={de ? "So trennen wir Neugier von Gesprächsreife" : "How curiosity is separated from conversation readiness"} label={de ? "Einordnung" : "Readiness view"}>
          <ScoringMatrix locale={locale} />
        </ProofCard>
        </div>
      </div>
    </section>
  );
}

function ProofCard({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return (
    <article className="proof-card">
      <span className="proof-label">{label}</span>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function MockHandover({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const rows = locale === "de"
    ? [
        ["Segment", "Käufer, Eigentümer oder Projektinteressent"],
        ["Quelle", "Asset, Kampagne, Portal oder Empfehlung"],
        ["Interesse", "Kaufen, verkaufen, investieren oder informieren"],
        ["Timing", "0-3 Monate, 3-6 Monate oder später"],
        ["Budgetnähe", "passt / offen / nicht passend"],
        ["Nächster Schritt", "Rückruf, Suchprofil, Bewertung oder Projektgespräch"]
      ]
    : [
        ["Segment", "Buyer, seller or project enquiry"],
        ["Source", "Asset, campaign, portal or referral"],
        ["Interest", "Buy, sell, invest or research"],
        ["Timing", "0-3 months, 3-6 months or later"],
        ["Budget proximity", "fit / open / not a fit"],
        ["Next step", "Callback, search profile, valuation or project call"]
      ];

  return (
    <div className={`mock-table ${compact ? "mock-table-compact" : ""}`}>
      <span className="mock-badge">{locale === "de" ? "Demo – keine echten Kundendaten" : "Demo – no real client data"}</span>
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function Scorecard({ locale }: { locale: Locale }) {
  const rows = locale === "de"
    ? [
        ["Konkretes Projekt / Marktgebiet", "klar", "green"],
        ["Kontext zur Anfrage", "teilweise", "amber"],
        ["Intent-Filter", "teilweise", "amber"],
        ["Übergabe an Vertrieb", "offen", "red"],
        ["Check-Frage", "klären", "red"]
      ]
    : [
        ["Concrete project / market area", "clear", "green"],
        ["Enquiry context", "partial", "amber"],
        ["Intent filter", "partial", "amber"],
        ["Sales handover", "open", "red"],
        ["Check question", "clarify", "red"]
      ];

  return (
    <div className="scorecard">
      {rows.map(([label, value, tone]) => (
        <div key={label}>
          <span className={`dot dot-${tone}`} />
          <strong>{label}</strong>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

function ScoringMatrix({ locale }: { locale: Locale }) {
  const rows = locale === "de"
    ? [["Fit", 22], ["Interesse", 26], ["Timing", 18], ["Budgetnähe", 16], ["Gesprächsreife", 12]]
    : [["Fit", 22], ["Interest", 26], ["Timing", 18], ["Budget proximity", 16], ["Conversation readiness", 12]];

  return (
    <div className="matrix">
      {rows.map(([label, score]) => (
        <div key={String(label)}>
          <span>{label}</span>
          <div><i style={{ width: `${score}%` }} /></div>
          <strong>{score}</strong>
        </div>
      ))}
      <p>{locale === "de" ? "Gesamt: 94 / 100 - priorisiert" : "Total: 94 / 100 - prioritised"}</p>
    </div>
  );
}

function FlowMock({ locale }: { locale: Locale }) {
  const steps = locale === "de"
    ? ["Quelle", "Projektseite", "Qualifizierung", "System", "Übergabe", "Nachfassen"]
    : ["Source", "Project page", "Qualification", "System", "Handover", "Follow-up"];

  return (
    <div className="flow-mock">
      {steps.map((step) => <span key={step}>{step}</span>)}
    </div>
  );
}

function Checklist({ locale }: { locale: Locale }) {
  const items = locale === "de"
    ? ["Warum dieses Playbook existiert", "Anfragen ohne Vertriebskontext", "Typische Lücken zwischen Auftritt und Gespräch", "Mindestkontext für vorbereitete Leads", "Scorecard für Projekt- und Lead-Reife", "Fragen für den Projekt-Check", "Wann ein Check sinnvoll ist", "Nächster Schritt: 30-Minuten-Check"]
    : ["Why this playbook exists", "Enquiries without sales context", "Typical gaps between project presence and conversation", "Minimum context for prepared leads", "Scorecard for project and lead readiness", "Questions for the Project Check", "When a check makes sense", "Next step: 30-minute check"];

  return (
    <ul className="qa-list">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function Timeline({ locale }: { locale: Locale }) {
  const rows = locale === "de"
    ? [["Tag 10", "Architektur und Handover-Logik"], ["Tag 15", "Landingpage/Form/CRM vorbereitet"], ["Tag 21", "Launchfähig, wenn Assets und Freigaben vorliegen"]]
    : [["Day 10", "Architecture and handover logic"], ["Day 15", "Landing page/form/CRM prepared"], ["Day 21", "Launch-ready if assets and approvals exist"]];

  return (
    <div className="timeline">
      {rows.map(([day, text]) => (
        <div key={day}>
          <strong>{day}</strong>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}

function DeliverablesSection({ content }: { content: HomeContent }) {
  return (
    <section className="module-section" id="system">
      <div className="section-heading">
        <p className="eyebrow">{content.locale === "en" ? "Deliverables" : "Konkrete Lieferung"}</p>
        <h2>{content.modules.title}</h2>
        <p>
          {content.locale === "en"
            ? "NovaLure delivers the structure between first click and qualified conversation: funnel, questions, handover, follow-up and reporting."
            : "NovaLure liefert die Struktur zwischen erstem Klick und qualifiziertem Gespräch: Funnel, Fragen, Übergabe, Follow-up und Reporting."}
        </p>
      </div>
      <div className="module-grid deliverables-focus-grid">
        {content.modules.items.map((item, index) => (
          <article className="module-card" key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AudienceOverview({ content }: { content: HomeContent }) {
  return (
    <section className="audience-section">
      <div className="section-heading">
        <p className="eyebrow">{content.locale === "en" ? "Who it serves" : "Für wen es entwickelt wurde"}</p>
        <h2>{content.audience.title}</h2>
      </div>
      <div className="audience-grid">
        {content.audience.cards.map((card) => (
          <Link className="premium-card audience-card" href={getPath(content.locale, card.hrefKey)} key={card.title}>
            <span>{card.hrefKey === "developers" ? "01" : "02"}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <ul>
              {card.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProblemSection({ content }: { content: HomeContent }) {
  return (
    <section className="problem-section">
      <div className="section-heading narrow">
        <p className="eyebrow">{content.locale === "en" ? "The problem" : "Das Problem"}</p>
        <h2>{content.problem.title}</h2>
        <p>{content.problem.body}</p>
      </div>
      <div className="problem-grid">
        {content.problem.points.map((point) => (
          <article className="premium-card light" key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SystemSection({ content }: { content: HomeContent }) {
  return (
    <section className="system-section">
      <div className="section-heading">
        <p className="eyebrow">{content.locale === "en" ? "Operating model" : "Arbeitsmodell"}</p>
        <h2>{content.system.title}</h2>
        <p>{content.system.body}</p>
      </div>
      <div className="layer-grid">
        {content.system.layers.map((layer) => (
          <article className="layer-card" key={layer.title}>
            <span>{layer.label}</span>
            <h3>{layer.title}</h3>
            <p>{layer.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PipelineAuditSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const checks = de
    ? ["Anzeige und Quelle", "Landingpage und Formular", "Qualifizierende Fragen", "Vorbereitete Übergabe", "Follow-up", "Reporting nach Leadqualität"]
    : ["Ad and source", "Landing page and form", "Qualification questions", "Prepared handover", "Follow-up", "Reporting by lead quality"];
  const outcomes = de
    ? ["Einschätzung des aktuellen Lead-Wegs", "Identifizierte Schwachstellen", "Empfehlung, ob Aufbau plus laufende Optimierung sinnvoll ist", "Klarheit über den nächsten Schritt"]
    : ["Assessment of the current lead path", "Identified weak points", "Recommendation whether setup plus ongoing optimisation makes sense", "Clarity on the next step"];

  return (
    <section className="audit-section home-audit-section" id="pipeline-audit">
      <div className="section-heading narrow">
        <p className="eyebrow">{de ? "Projekt-Check" : "Project Check"}</p>
        <h2>
          {de
            ? "Finden Sie heraus, wo Ihr Lead-Weg Vertriebszeit verliert."
            : "Find out where your lead path is wasting sales time."}
        </h2>
        <p>
          {de
            ? "Der Projekt-Check prüft, ob Ihr aktueller Weg von Auftritt bis Übergabe qualifizierte Gespräche erzeugt oder nur neue Sortierarbeit."
            : "The Project Check reviews whether your current path from presence to handover creates qualified conversations or just more sorting work."}
        </p>
      </div>
      <div className="audit-grid">
        <article className="content-section">
          <h2>{de ? "Was geprüft wird" : "What gets reviewed"}</h2>
          <ul className="check-list">{checks.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="content-section">
          <h2>{de ? "Was Sie danach wissen" : "What you know afterwards"}</h2>
          <ul className="check-list">{outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>
      <div className="section-actions">
        <Link className="button button-primary" href={`${getPath(locale, "contact")}#book-audit`} data-track="home_audit">
          {de ? "Projekt-Check anfragen" : "Request Project Check"}
        </Link>
        <Link className="button button-secondary dark" href={getPlaybookFormPath(locale)} data-track="home_playbook_secondary">
          {de ? "Playbook herunterladen" : "Download playbook"}
        </Link>
      </div>
    </section>
  );
}

function PlaybookConversion({ locale, title, body }: { locale: Locale; title: string; body: string }) {
  return <PlaybookHub locale={locale} title={title} body={body} eyebrow={locale === "en" ? "Secondary funnel" : "Secondary Funnel"} />;
}

function PlaybookHub({ locale, title, body, eyebrow, id }: { locale: Locale; title: string; body: string; eyebrow?: string; id?: string }) {
  return (
    <section className="playbook-section" id={id}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow || (locale === "en" ? "Playbook selection" : "Playbook-Auswahl")}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div className="playbook-hub-grid">
        {playbooks[locale].map((playbook) => (
          <article className="playbook-summary-card" key={playbook.key}>
            <span className="pill">{playbook.key === "developer" ? (locale === "en" ? "Developers" : "Bauträger") : locale === "en" ? "Agents" : "Makler"}</span>
            <h3>{playbook.title}</h3>
            <p>{playbook.subtitle}</p>
            <ul className="check-list">
              {playbook.learns.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
        <HubSpotForm locale={locale} playbook="developer" selectable />
      </div>
    </section>
  );
}

function BeforeAfter({ content }: { content: HomeContent }) {
  return (
    <section className="before-after">
      <div className="comparison-card before">
        <h2>{content.beforeAfter.beforeTitle}</h2>
        {content.beforeAfter.before.map((item) => <p key={item}>{item}</p>)}
      </div>
      <div className="comparison-card after">
        <h2>{content.beforeAfter.afterTitle}</h2>
        {content.beforeAfter.after.map((item) => <p key={item}>{item}</p>)}
      </div>
    </section>
  );
}

function MarketComparisonSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const columns = de
    ? [
        {
          title: "Klassische Agentur",
          points: ["Fokus auf Kampagnen, Klicks und Creatives", "Übergabekontext oft nachgelagert", "Erfolg häufig über CPL gemessen"]
        },
        {
          title: "Lead-Portal",
          points: ["Reichweite, aber keine eigene Pipeline", "Leads oft geteilt oder austauschbar", "Wenig Kontrolle über Funnel und Daten"]
        },
        {
          title: "NovaLure",
          points: ["Eigener Lead-Weg mit Vorqualifizierung", "CRM-fähige Übergabe mit nächstem Schritt", "Reporting nach Leadqualität und Fokus auf qualifizierte Gespräche"]
        }
      ]
    : [
        {
          title: "Classic agency",
          points: ["Focus on campaigns, clicks and creatives", "Handover context often comes too late", "Success often measured by CPL"]
        },
        {
          title: "Lead portal",
          points: ["Reach, but no owned pipeline", "Leads are often shared or interchangeable", "Limited control over funnel and data"]
        },
        {
          title: "NovaLure",
          points: ["Owned lead path with pre-qualification", "Prepared handover with next step", "Reporting by lead quality and focus on qualified conversations"]
        }
      ];

  return (
    <section className="market-comparison-section">
      <div className="section-heading narrow">
        <p className="eyebrow">{de ? "Vergleich" : "Comparison"}</p>
        <h2>{de ? "NovaLure vs. klassische Agentur vs. Lead-Portal" : "NovaLure vs. classic agency vs. lead portal"}</h2>
        <p>
          {de
            ? "NovaLure konkurriert nicht über lautere Versprechen. Der Unterschied liegt darin, ob Anfragen mit Kontext, Priorität und nächstem Schritt im Vertrieb ankommen."
            : "NovaLure does not compete through louder promises. The difference is whether enquiries reach sales with context, priority and a next step."}
        </p>
      </div>
      <div className="market-comparison-grid">
        {columns.map((column) => (
          <article className="market-comparison-card" key={column.title}>
            <h3>{column.title}</h3>
            <ul className="check-list">
              {column.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function AntiPromisesSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const rows = de
    ? [
        ["„Wir garantieren 50 Leads pro Monat“", "Wir garantieren Struktur, nicht Volumen"],
        ["Logo-Wand ohne Freigabe", "Demo-Artefakte mit klarer Kennzeichnung"],
        ["One-Shot-Kampagne", "Mindestens 3 Monate Run mit Optimierung"],
        ["„Wir machen alles“", "Check vor Angebot – kein Standardscope"]
      ]
    : [
        ["“We guarantee 50 leads per month”", "We guarantee structure, not volume"],
        ["Logo wall without release", "Demo artefacts with clear labelling"],
        ["One-shot campaign", "At least 3 months run with optimisation"],
        ["“We do everything”", "Check before proposal – no standard scope"]
      ];

  return (
    <section className="anti-promises-section">
      <div className="section-heading narrow">
        <p className="eyebrow">{de ? "Klare Abgrenzung" : "Clear positioning"}</p>
        <h2>{de ? "Was wir nicht machen." : "What we don't do."}</h2>
        <p>
          {de
            ? "NovaLure ist bewusst gegen lautes Versprechen-Marketing positioniert. Diese Tabelle zeigt, worin wir uns von Standard-Agenturen und Verkaufs-Methoden im Immobilienmarketing unterscheiden."
            : "NovaLure is deliberately positioned against loud promise-marketing. This table shows how we differ from standard agencies and aggressive sales methods in real estate marketing."}
        </p>
      </div>
      <div className="anti-promises-table">
        <div className="anti-promises-head">
          <span>{de ? "Was Sie woanders hören" : "What you hear elsewhere"}</span>
          <span>{de ? "Was wir tun" : "What we do"}</span>
        </div>
        {rows.map(([elsewhere, novalure]) => (
          <div className="anti-promises-row" key={elsewhere}>
            <p>{elsewhere}</p>
            <p>{novalure}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessBlock({ content }: { content: HomeContent }) {
  return (
    <section className="process-section" id={content.process.id}>
      <div className="section-heading narrow">
        <p className="eyebrow">{content.locale === "en" ? "Process" : "Prozess"}</p>
        <h2>{content.process.title}</h2>
        <p>{content.process.body}</p>
      </div>
      <ol className="process-list">
        {content.process.steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TeamBlock({ content }: { content: HomeContent }) {
  return (
    <section className="team-section" id={content.team.id}>
      <div className="section-heading narrow">
        <p className="eyebrow">{content.locale === "en" ? "Team Lead" : "Teamleitung"}</p>
        <h2>{content.team.title}</h2>
        <p>{content.team.body}</p>
      </div>
      <div className="team-grid">
        <article className="founder-card">
          <TeamLeadImage locale={content.locale} />
          <div className="team-lead-title-row">
            <h3>{content.team.founder}</h3>
          </div>
          <p>{content.team.workstyle}</p>
          <p>{content.team.ireland}</p>
          <div className="region-badges" aria-label={content.locale === "en" ? "Active regions" : "Aktive Regionen"}>
            <span><b>IE</b>{content.locale === "en" ? "Ireland" : "Irland"}</span>
            <span><b>UK</b>UK</span>
            <span><b>AT/DE/CH</b>DACH</span>
          </div>
          <span className="compliance-badge">{content.locale === "en" ? "GDPR-compliant" : "DSGVO-konform"}</span>
        </article>
        <div className="pillar-grid">
          {content.team.pillars.map((pillar) => (
            <article className="pillar-card" key={pillar}>{pillar}</article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AudiencePage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} visual />
      <AudienceProof locale={content.locale} pageKey={content.key} />
      <section className="section-grid">
        {content.sections?.map((section, index) => (
          <article className="content-section" key={section.title}>
            <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items && (
              <ul className="check-list">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>
      <PlaybookConversion
        locale={content.locale}
        title={content.locale === "en" ? "Download the playbook, then request a check if the problem is concrete." : "Laden Sie das Playbook, dann fragen Sie bei konkretem Problem den Projekt-Check an."}
        body={content.locale === "en" ? "The playbook prepares your team for a sharper review." : "Das Playbook bereitet Ihr Team auf einen schärferen Check vor."}
      />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function AudienceProof({ locale, pageKey }: { locale: Locale; pageKey: PageContent["key"] }) {
  const isDeveloper = pageKey === "developers";
  const de = locale === "de";
  const title = isDeveloper
    ? de ? "Demo: vorbereitete Bauträger-Anfrage" : "Demo: prepared developer enquiry"
    : de ? "Demo: vorbereitete Makler-Anfragen" : "Demo: prepared agent enquiries";

  return (
    <section className="proof-section compact-proof">
      <div className="section-heading">
        <p className="eyebrow">{de ? "Handover-Beispiel" : "Handover example"}</p>
        <h2>{title}</h2>
        <p>{de ? "Alle Daten sind Demo-Daten und suggerieren keine echten Kunden." : "All data is demo data and does not suggest real clients."}</p>
      </div>
      {isDeveloper ? (
        <MockHandover locale={locale} />
      ) : (
        <div className="dual-mock">
          <MockHandover locale={locale} />
          <div className="mock-table">
            <span className="mock-badge">{de ? "Demo - Käuferlead" : "Demo - buyer lead"}</span>
            {(de
              ? [["Suchgebiet", "Wien Süd"], ["Objektart", "Eigentumswohnung"], ["Budgetnähe", "bis 650.000"], ["Finanzierung", "vorbesprochen"], ["Timing", "0-6 Monate"], ["Must-haves", "Balkon, 3 Zimmer"], ["Nächster Schritt", "Suchprofil-Call"]]
              : [["Search area", "Vienna South"], ["Property type", "Apartment"], ["Budget proximity", "up to 650,000"], ["Financing", "pre-discussed"], ["Timing", "0-6 months"], ["Must-haves", "balcony, 3 rooms"], ["Next step", "Search profile call"]]
            ).map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PlaybooksPage({ content }: { content: PageContent }) {
  const de = content.locale === "de";
  return (
    <main>
      <Hero content={content} />
      <section className="proof-section">
        <div className="section-heading">
          <p className="eyebrow">{de ? "Vorschau" : "Preview"}</p>
          <h2>{de ? "Was im Playbook enthalten ist" : "What the playbook includes"}</h2>
        </div>
        <div className="proof-grid">
          <ProofCard title={de ? "Diagnose-Rahmen des Playbooks" : "Playbook diagnosis frame"} label={de ? "Vorschau" : "Preview"}>
            <Checklist locale={content.locale} />
          </ProofCard>
          <ProofCard title={de ? "Beispiel: Anfrage mit Übergabekontext" : "Example: enquiry with handover context"} label={de ? "Demo-Seite" : "Demo page"}>
            <MockHandover locale={content.locale} compact />
          </ProofCard>
          <ProofCard title={de ? "Ist der Projektweg prüfenswert?" : "Is the project path worth reviewing?"} label={de ? "Mini-Scorecard" : "Mini scorecard"}>
            <Scorecard locale={content.locale} />
          </ProofCard>
          <ProofCard title={de ? "Typische Lücken, keine fertige Lösung" : "Typical gaps, not a full solution"} label={de ? "Beispiel-Auszug" : "Example excerpt"}>
            <ul className="qa-list">
              {(de
                ? ["Anfrage ist da, aber Motiv und Timing fehlen", "Nachfassen startet ohne klares Segment", "Vertrieb sieht Quelle, aber keinen nächsten Schritt", "Kampagne wird optimiert, obwohl die Übergabe unklar ist"]
                : ["The enquiry exists, but motivation and timing are missing", "Follow-up starts without a clear segment", "Sales sees the source, but no next step", "Campaigns get optimised while handover remains unclear"]
              ).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ProofCard>
        </div>
      </section>
      <PlaybookHub
        id="playbook-download"
        locale={content.locale}
        title={de ? "Zwei Playbooks. Ein Ziel: bessere Gespräche aus vorhandener Nachfrage." : "Two playbooks. One goal: better conversations from existing demand."}
        body={de ? "Laden Sie das passende Playbook herunter und prüfen Sie, wo Projektauftritt, Anfrage, Nachfassen und Übergabe auseinanderfallen." : "Download the relevant playbook and see where project presence, enquiry, follow-up and handover fall apart."}
      />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function EmailSequenceSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const days = de
    ? [["Tag 0", "Ihr NovaLure Playbook"], ["Tag 1", "Wo verliert Ihre Anfrage zuerst Qualität?"], ["Tag 3", "Beispiel: eine vorbereitete Immobilienanfrage"], ["Tag 5", "Der häufigste Fehler: Leads ohne Vertriebslogik"], ["Tag 7", "Sollten wir Ihren Projektweg prüfen?"], ["Tag 10", "Wir haben schon Marketing reicht nicht"], ["Tag 14", "Letzter klarer Schritt"]]
    : [["Day 0", "Your NovaLure Playbook"], ["Day 1", "Where does your enquiry first lose quality?"], ["Day 3", "Example: a prepared real estate enquiry"], ["Day 5", "The common mistake: leads without sales logic"], ["Day 7", "Should we review your project path?"], ["Day 10", "We already have marketing is not enough"], ["Day 14", "Last clear step"]];

  return (
    <section className="process-section">
      <div className="section-heading narrow">
        <p className="eyebrow">{de ? "Nachfasslogik vorbereitet" : "Follow-up logic prepared"}</p>
        <h2>{de ? "Nachfassen führt zum Projekt-Check, nicht in Newsletter-Rauschen." : "Follow-up moves toward the Project Check, not newsletter noise."}</h2>
        <p>{de ? "Die vollständigen exportierbaren Inhalte liegen zusätzlich in der Funnel-Ops-Checkliste." : "The full exportable content is also documented in the funnel ops checklist."}</p>
      </div>
      <ol className="process-list email-sequence-list">
        {days.map(([day, subject]) => (
          <li key={day}><span>{day}</span><strong>{subject}</strong></li>
        ))}
      </ol>
    </section>
  );
}

function ContactPage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} />
      <AuditExplainer locale={content.locale} />
      <section className="meeting-section" id="book-audit">
        <HubSpotMeetingEmbed locale={content.locale} />
      </section>
      <ContactInquiryForm locale={content.locale} />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function AuditExplainer({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const fit = de
    ? ["Sie sind Bauträger, Projektentwickler, Projektvertrieb, Maklerteam oder professioneller Makler.", "Sie haben ein konkretes Projekt, Marktgebiet oder eine klare Zielgruppe.", "Sie möchten Projektauftritt, Kampagne, Nachfassen und Übergabe sauber verbinden.", "Sie verlieren Zeit durch unqualifizierte Anfragen oder fehlenden Kontext.", "Sie können Budget und Entscheidungskompetenz realistisch klären."]
    : ["You are a developer, project sales team, broker team or professional real estate agent.", "You have a concrete project, market area or target audience.", "You want project presence, campaign, follow-up and handover to connect cleanly.", "You lose time through unqualified enquiries or missing context.", "You can realistically clarify budget and decision authority."];
  const noFit = de
    ? ["Sie sammeln nur kostenlose Marketingideen.", "Sie erwarten eine feste Lead-Zahl unabhängig von Markt und Angebot.", "Sie wollen keine CRM- oder Follow-up-Struktur aufbauen.", "Sie können aktuell kein Projekt, Marktgebiet oder Leadproblem benennen."]
    : ["You only want free marketing ideas.", "You expect a fixed lead number regardless of market and offer.", "You do not want follow-up or handover structure.", "You cannot name a project, market area or lead-quality problem."];
  const checks = de
    ? ["Zielgruppe und Projekt-/Marktlogik", "Story, Visualisierung und Exposé-Logik", "bestehende Leadquellen", "Landingpage- und Formularlogik", "Qualifizierungsfragen", "Nachfassen und Übergabe", "Engpass zwischen Marketing und Vertrieb", "ob Aufbau und laufende Verbesserung wirtschaftlich sinnvoll sind"]
    : ["target group and project/market logic", "story, visualisation and expose logic", "existing lead sources", "landing page and form logic", "qualification questions", "follow-up and handover", "bottleneck between marketing and sales", "whether setup and ongoing improvement are commercially sensible"];
  const after = de
    ? ["Einschätzung des aktuellen Projekt- und Lead-Wegs", "3-5 identifizierte Schwachstellen", "Empfehlung, ob Aufbau plus laufende Verbesserung sinnvoll ist", "Nächster Schritt: Angebot, zweites Diagnosegespräch oder klare Absage"]
    : ["assessment of the current project and lead path", "3-5 identified weak points", "recommendation on whether setup plus ongoing improvement makes sense", "next step: proposal, second diagnosis call or clear refusal"];
  const notIncluded = de
    ? ["keine vollständige Funnel-Strategie gratis", "keine Media-Planung gratis", "keine Lead-Garantie", "keine rechtliche oder finanzielle Beratung", "keine Zusage ohne Scope-Prüfung"]
    : ["no full funnel strategy for free", "no free media planning", "no lead guarantee", "no legal or financial advice", "no commitment without scope review"];

  return (
    <section className="audit-section">
      <div className="audit-grid">
        <article className="content-section"><h2>{de ? "Dieser Check ist richtig für Sie, wenn..." : "This check is right for you if..."}</h2><ul className="check-list">{fit.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section"><h2>{de ? "Dieser Check ist nicht richtig für Sie, wenn..." : "This check is not right for you if..."}</h2><ul className="check-list">{noFit.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section"><h2>{de ? "Was wir in 30 Minuten prüfen" : "What we review in 30 minutes"}</h2><ul className="check-list">{checks.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section"><h2>{de ? "Was Sie nach dem Check bekommen" : "What you receive after the check"}</h2><ul className="check-list">{after.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section content-section-wide"><h2>{de ? "Was Sie nicht bekommen" : "What you do not receive"}</h2><ul className="check-list">{notIncluded.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>
  );
}

function HandoverPage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} />
      <ProofSection locale={content.locale} />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function ThankYouPage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} />
      <section className="legal-section">
        {content.sections?.map((section) => (
          <article className="legal-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items && <ul className="check-list">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          </article>
        ))}
      </section>
    </main>
  );
}

function LegalPage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} />
      <section className="legal-section">
        {content.sections?.map((section) => (
          <article className="legal-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.items && <ul className="check-list">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          </article>
        ))}
      </section>
    </main>
  );
}

function FaqSection({ locale, items }: { locale: Locale; items: { question: string; answer: string }[] }) {
  if (!items.length) return null;
  const groups = groupFaqItems(locale, items);

  return (
    <section className="faq-section">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>{locale === "en" ? "Hard questions before we talk." : "Harte Fragen vor dem Gespräch."}</h2>
      </div>
      <div className="faq-group-grid">
        {groups.map((group) => (
          <article className="faq-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="faq-list">
              {group.items.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function groupFaqItems(locale: Locale, items: { question: string; answer: string }[]) {
  const de = locale === "de";
  const labels = de
    ? ["Vertrauen", "Angebot", "Zusammenarbeit", "Grenzen"]
    : ["Trust", "Offer", "Working together", "Boundaries"];

  return [
    { title: labels[0], items: items.slice(0, 3) },
    { title: labels[1], items: items.slice(3, 8) },
    { title: labels[2], items: items.slice(8, 13) },
    { title: labels[3], items: items.slice(13) }
  ].filter((group) => group.items.length);
}

function FinalCta({ content, title }: { content: PageContent; title?: string }) {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">{content.locale === "en" ? "Next step" : "Nächster Schritt"}</p>
        <h2>{title || (content.locale === "en" ? "Review whether your current path creates prepared conversations." : "Prüfen Sie in 30 Minuten, ob Ihr aktueller Weg vorbereitete Gespräche erzeugt.")}</h2>
        <p>{content.locale === "en" ? "See whether project presence, follow-up and handover work together or create more sorting work." : "Sehen Sie, ob Projektauftritt, Nachfassen und Übergabe zusammenspielen oder neue Sortierarbeit erzeugen."}</p>
      </div>
      <div className="hero-actions">
        <div className="cta-primary-group">
          <Link className="button button-primary" href={`${getPath(content.locale, "contact")}#book-audit`} data-track="cta_audit">
            {content.locale === "en" ? "Request Project Check" : "Projekt-Check anfragen"}
          </Link>
          <p className="cta-microcopy">
            {content.locale === "en"
              ? "30 min review. Clear bottleneck. Clear next step."
              : "30 Min. Check. Klarer Engpass. Klarer nächster Schritt."}
          </p>
        </div>
        <Link className="button button-secondary dark" href={getPlaybookFormPath(content.locale)} data-track="cta_playbook">
          {content.locale === "en" ? "Download playbook" : "Playbook herunterladen"}
        </Link>
      </div>
    </section>
  );
}

function CtaLink({ className, locale, cta, track }: { className: string; locale: Locale; cta: Cta; track: string }) {
  const href = getCtaHref(locale, cta);

  if ("href" in cta) {
    return (
      <a className={className} href={href} data-track={track}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link className={className} href={href} data-track={track}>
      {cta.label}
    </Link>
  );
}

function getSecondaryCtaClass(cta: Cta) {
  return cta.variant === "subtle" ? "hero-subtle-link" : "button button-secondary";
}

function getCtaHref(locale: Locale, cta: Cta) {
  if ("href" in cta) {
    return cta.href;
  }

  if (cta.target === "playbooks" && !cta.anchor) {
    return getPlaybookFormPath(locale);
  }
  const base = getPath(locale, cta.target);
  return cta.anchor ? `${base}#${cta.anchor}` : base;
}
