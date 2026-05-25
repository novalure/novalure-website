import Image from "next/image";
import Link from "next/link";
import { getPath, getPlaybookFormPath } from "@/lib/i18n";
import { playbooks, type HomeContent, type PageContent } from "@/content/pages";
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
          <Link className="button button-primary" href={getCtaHref(content.locale, content.primaryCta)} data-track="cta_primary">
            {content.primaryCta.label}
          </Link>
          <Link className="button button-secondary" href={getCtaHref(content.locale, content.secondaryCta)} data-track="cta_secondary">
            {content.secondaryCta.label}
          </Link>
        </div>
        <ul className="hero-bullets">
          {content.heroBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
      {visual ? <FunnelHeroVisual /> : <SystemMiniCard bullets={content.heroBullets} />}
    </section>
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
  const locale = content.locale;

  return (
    <main>
      <Hero content={content} visual />
      <ProofSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <DeliverablesSection content={content} />
      <AudienceOverview content={content} />
      <ProblemSection content={content} />
      <SystemSection content={content} />
      <TeamBlock content={content} />
      <PlaybookConversion locale={locale} title={content.playbookSection.title} body={content.playbookSection.body} />
      <BeforeAfter content={content} />
      <AntiPromisesSection locale={locale} />
      <ProcessBlock content={content} />
      <FaqSection locale={locale} items={content.faq || []} />
      <FinalCta content={content} title={content.finalCtaTitle} />
    </main>
  );
}

function TestimonialsSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const copy = de
    ? {
        eyebrow: "KUNDENSTIMMEN",
        headline: "Vertrauen aus der Praxis.",
        intro: "Echte Stimmen aus der DACH-Immobilienbranche. Keine erfundenen Cases, keine gemieteten Logos — nur Kunden, die mit NovaLure arbeiten.",
        quote: "Die Zusammenarbeit mit NovaLure hat unsere Verkäuferakquise messbar verändert. Wir bekommen kontinuierlich qualifizierte Anfragen statt ungefilterter Kontakte — das macht unsere Pipeline planbar.",
        name: "SV Thomas Grasl",
        subline: "Inhaber GRASL Immobilien, Schwaz",
        firstMetric: "15–20",
        firstMetricLabel: "Qualifizierte Anfragen pro Monat",
        secondMetric: "€110k+",
        secondMetricLabel: "Provisionsvolumen aus aktiven Mandaten"
      }
    : {
        eyebrow: "CLIENT TESTIMONIALS",
        headline: "Trusted in practice.",
        intro: "Real voices from the DACH real estate industry. No invented case studies, no rented logos — only clients who work with NovaLure.",
        quote: "Working with NovaLure has measurably changed how we acquire seller leads. We now receive a steady flow of qualified inquiries instead of unfiltered contacts — that makes our pipeline predictable.",
        name: "SV Thomas Grasl",
        subline: "Owner, GRASL Immobilien, Schwaz",
        firstMetric: "15–20",
        firstMetricLabel: "Qualified inquiries per month",
        secondMetric: "€110k+",
        secondMetricLabel: "Commission volume from active mandates"
      };

  return (
    <section className="testimonials-section" id="kundenstimmen" aria-labelledby="kundenstimmen-title">
      <div className="testimonials-heading">
        <p className="testimonials-eyebrow">{copy.eyebrow}</p>
        <h2 id="kundenstimmen-title">{copy.headline}</h2>
        <p>{copy.intro}</p>
      </div>

      <article className="testimonial-card">
        <span className="testimonial-quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote className="testimonial-body">
          <Image
            className="testimonial-avatar"
            src="/images/thomas-grasl-portrait.jpg"
            alt="SV Thomas Grasl"
            width={96}
            height={96}
            sizes="96px"
          />
          <div className="testimonial-content">
            <p className="testimonial-quote">{copy.quote}</p>
            <footer className="testimonial-person-row">
              <div className="testimonial-person">
                <strong>{copy.name}</strong>
                <span>{copy.subline}</span>
              </div>
              <Image
                className="testimonial-logo"
                src="/images/grasl-immobilien-logo.png"
                alt="GRASL Immobilien Logo"
                width={71}
                height={52}
                sizes="(max-width: 700px) 150px, 180px"
              />
            </footer>
          </div>
        </blockquote>

        <div className="testimonial-divider" aria-hidden="true" />
        <dl className="testimonial-metrics">
          <div className="testimonial-metric">
            <dt>{copy.firstMetric}</dt>
            <dd>{copy.firstMetricLabel}</dd>
          </div>
          <div className="testimonial-metric">
            <dt>{copy.secondMetric}</dt>
            <dd>{copy.secondMetricLabel}</dd>
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
        <p className="eyebrow">{de ? "Proof ohne Fake-Referenzen" : "Proof without invented references"}</p>
        <h2>{de ? "Proof ohne Logo-Wand: So sieht das System aus" : "Proof without a logo wall: what the system looks like"}</h2>
        <p>
          {de
            ? "NovaLure zeigt keine erfundenen Kundenlogos, keine Fake-Testimonials und keine Show-Inszenierung. Stattdessen sehen Sie ruhige Systemgrafiken und konkrete Beispiel-Artefakte: Demo-Funnel, CRM-Handover, Audit-Auswertung, Lead-Scoring und QA-Checkliste. Alles klar als Beispiel markiert."
            : "NovaLure shows no invented client logos, no fabricated testimonials and no presentation theatre. Instead, you see calm system graphics and concrete example artefacts: demo funnel, CRM handover, audit output, lead scoring and QA checklist. Everything is clearly marked as an example."}
        </p>
      </div>
      <div className="proof-grid">
        <ProofCard title={de ? "Was Ihr Vertrieb vor dem ersten Call sehen sollte" : "What sales should see before the first call"} label={de ? "Demo - keine echten Kundendaten" : "Demo - no real client data"}>
          <MockHandover locale={locale} compact />
        </ProofCard>
        <ProofCard title={de ? "Was im Audit geprüft wird" : "What the audit reviews"} label={de ? "Beispiel-Auszug" : "Example excerpt"}>
          <Scorecard locale={locale} />
        </ProofCard>
        <ProofCard title={de ? "So trennen wir Neugier von Verkaufschance" : "How curiosity is separated from sales opportunity"} label={de ? "Lead-Scoring-Matrix" : "Lead scoring matrix"}>
          <ScoringMatrix locale={locale} />
        </ProofCard>
        <ProofCard title={de ? "Demo-Funnel für ein fiktives Neubauprojekt" : "Demo funnel for a fictional new-build project"} label={de ? "Fiktiver Demo-Funnel" : "Fictional demo funnel"}>
          <FlowMock locale={locale} />
        </ProofCard>
        <ProofCard title={de ? "Kein Launch ohne Handover-Check" : "No launch without handover check"} label={de ? "QA-Launch-Checkliste" : "QA launch checklist"}>
          <Checklist locale={locale} />
        </ProofCard>
        <ProofCard title={de ? "Was nach 10, 15 und 21 Tagen stehen kann" : "What can be ready after 10, 15 and 21 days"} label={de ? "Typischer Lieferplan" : "Typical delivery plan"}>
          <Timeline locale={locale} />
        </ProofCard>
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
        ["Signal", "Projekt- oder Verkaufsinteresse"],
        ["Quelle", "Asset, Kampagne oder Empfehlung"],
        ["Kontextlücke", "Timing oder Motiv unklar"],
        ["CRM-Sichtbarkeit", "Anfrage ohne klaren nächsten Schritt"],
        ["Vertriebsfrage", "Was muss zuerst geklärt werden?"],
        ["Audit-Hinweis", "Handover prüfen, bevor Budget steigt"]
      ]
    : [
        ["Signal", "Project or seller/buyer enquiry"],
        ["Source", "Asset, campaign or referral path"],
        ["Context gap", "Timing or motivation unclear"],
        ["CRM visibility", "Enquiry without a clear next step"],
        ["Sales question", "What must be clarified first?"],
        ["Audit prompt", "Check handover before more spend"]
      ];

  return (
    <div className={`mock-table ${compact ? "mock-table-compact" : ""}`}>
      <span className="mock-badge">{locale === "de" ? "Demo - keine echten Kundendaten" : "Demo - no real client data"}</span>
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
        ["CRM-Kontext zum Lead", "teilweise", "amber"],
        ["Intent-Filter", "teilweise", "amber"],
        ["Sales-Handover", "offen", "red"],
        ["Audit-Frage", "klären", "red"]
      ]
    : [
        ["Concrete project / market area", "clear", "green"],
        ["CRM lead context", "partial", "amber"],
        ["Intent filter", "partial", "amber"],
        ["Sales handover", "open", "red"],
        ["Audit question", "clarify", "red"]
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
    ? [["Fit", 22], ["Intent", 26], ["Timing", 18], ["Budgetnähe", 16], ["Sales Readiness", 12]]
    : [["Fit", 22], ["Intent", 26], ["Timing", 18], ["Budget proximity", 16], ["Sales readiness", 12]];

  return (
    <div className="matrix">
      {rows.map(([label, score]) => (
        <div key={String(label)}>
          <span>{label}</span>
          <div><i style={{ width: `${score}%` }} /></div>
          <strong>{score}</strong>
        </div>
      ))}
      <p>{locale === "de" ? "Gesamt: 94 / 100 - Sales-priorisiert" : "Total: 94 / 100 - sales-prioritised"}</p>
    </div>
  );
}

function FlowMock({ locale }: { locale: Locale }) {
  const steps = locale === "de"
    ? ["Ad / Quelle", "Landingpage", "Intent-Filter", "AI-CRM", "Sales-Handover", "Follow-up"]
    : ["Ad / source", "Landing page", "Intent filter", "AI CRM", "Sales handover", "Follow-up"];

  return (
    <div className="flow-mock">
      {steps.map((step) => <span key={step}>{step}</span>)}
    </div>
  );
}

function Checklist({ locale }: { locale: Locale }) {
  const items = locale === "de"
    ? ["Warum dieses Playbook existiert", "Leads ohne Vertriebskontext", "Typische Pipeline-Leaks", "Mindestkontext für sales-ready Leads", "Audit-Reife-Scorecard", "Fragen für das Pipeline-Audit", "Wann ein Audit sinnvoll ist", "Nächster Schritt: 30-Minuten-Diagnose"]
    : ["Why this playbook exists", "Leads without sales context", "Typical pipeline leaks", "Minimum context for sales-ready leads", "Audit-readiness scorecard", "Questions for the Pipeline Audit", "When an audit makes sense", "Next step: 30-minute diagnosis"];

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
            ? "NovaLure does not sell a loose marketing package. The delivery is a Build+Run system that connects demand, qualification, CRM handover and follow-up."
            : "NovaLure verkauft kein loses Marketingpaket. Geliefert wird ein Build+Run-System, das Nachfrage, Qualifizierung, CRM-Handover und Follow-up verbindet."}
        </p>
      </div>
      <div className="module-grid module-grid-wide">
        {content.modules.items.map((item, index) => (
          <article className="module-card" key={item.title}>
            <span>{String(index + 1).padStart(2, "0")} · {item.audience}</span>
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

function AntiPromisesSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const rows = de
    ? [
        ["„Wir garantieren 50 Leads pro Monat“", "Wir garantieren Struktur, nicht Volumen"],
        ["Logo-Wand ohne Freigabe", "Demo-Artefakte mit klarer Kennzeichnung"],
        ["One-Shot-Kampagne", "Mindestens 3 Monate Run mit Optimierung"],
        ["„Wir machen alles“", "Audit vor Angebot – kein Standardscope"]
      ]
    : [
        ["“We guarantee 50 leads per month”", "We guarantee structure, not volume"],
        ["Logo wall without release", "Demo artefacts with clear labelling"],
        ["One-shot campaign", "At least 3 months run with optimisation"],
        ["“We do everything”", "Audit before proposal – no standard scope"]
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
        title={content.locale === "en" ? "Download the playbook, then request an audit if the problem is concrete." : "Laden Sie das Playbook, dann fragen Sie bei konkretem Problem das Audit an."}
        body={content.locale === "en" ? "The playbook prepares your team for a sharper diagnosis." : "Das Playbook bereitet Ihr Team auf eine schärfere Diagnose vor."}
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
    ? de ? "Demo: CRM-fähiger Bauträger-Lead" : "Demo: CRM-ready developer lead"
    : de ? "Demo: CRM-fähige Makler-Leads" : "Demo: CRM-ready agent leads";

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
          <ProofCard title={de ? "Beispielseite: Lead ohne Vertriebskontext" : "Example page: lead without sales context"} label={de ? "Demo-Seite" : "Demo page"}>
            <MockHandover locale={content.locale} compact />
          </ProofCard>
          <ProofCard title={de ? "Ist das Lead-System audit-reif?" : "Is the lead system audit-ready?"} label={de ? "Mini-Scorecard" : "Mini scorecard"}>
            <Scorecard locale={content.locale} />
          </ProofCard>
          <ProofCard title={de ? "Typische Symptome, keine fertige Lösung" : "Typical symptoms, not a full solution"} label={de ? "Beispiel-Auszug" : "Example excerpt"}>
            <ul className="qa-list">
              {(de
                ? ["CRM zeigt Anfrage, aber kein Motiv", "Follow-up startet ohne Segment", "Sales sieht Quelle, aber keinen nächsten Schritt", "Kampagne wird optimiert, obwohl die Übergabe unklar ist"]
                : ["CRM shows an enquiry, but no motivation", "Follow-up starts without a segment", "Sales sees the source, but no clear next step", "Campaigns get optimised while handover remains unclear"]
              ).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ProofCard>
        </div>
      </section>
      <PlaybookHub
        id="playbook-download"
        locale={content.locale}
        title={de ? "Playbook herunterladen und Audit-Reife prüfen" : "Download the playbook and check audit readiness"}
        body={content.description}
      />
      <EmailSequenceSection locale={content.locale} />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function EmailSequenceSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const days = de
    ? [["Tag 0", "Ihr NovaLure Playbook"], ["Tag 1", "Wo verliert Ihre Pipeline zuerst Qualität?"], ["Tag 3", "Beispiel: ein CRM-fähiger Immobilienlead"], ["Tag 5", "Der häufigste Fehler: Leads ohne Vertriebslogik"], ["Tag 7", "Sollten wir Ihr Lead-System prüfen?"], ["Tag 10", "Wir haben schon Marketing reicht nicht"], ["Tag 14", "Letzter klarer Schritt"]]
    : [["Day 0", "Your NovaLure Playbook"], ["Day 1", "Where does your pipeline first lose quality?"], ["Day 3", "Example: a CRM-ready real estate lead"], ["Day 5", "The common mistake: leads without sales logic"], ["Day 7", "Should we review your lead system?"], ["Day 10", "We already have marketing is not enough"], ["Day 14", "Last clear step"]];

  return (
    <section className="process-section">
      <div className="section-heading narrow">
        <p className="eyebrow">{de ? "E-Mail-Sequenz vorbereitet" : "Email sequence prepared"}</p>
        <h2>{de ? "Follow-up führt zum Audit, nicht in Newsletter-Rauschen." : "Follow-up moves toward the audit, not newsletter noise."}</h2>
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
    ? ["Sie sind Bauträger, Projektentwickler, Projektvertrieb, Maklerteam oder professioneller Makler.", "Sie haben bereits Leads, Kampagnen, Portale oder Projektanfragen.", "Ihr Vertrieb verliert Zeit durch unqualifizierte Anfragen.", "Sie sind bereit, ein System zu bauen und mindestens 3 Monate zu betreiben.", "Sie können Budget und Entscheidungskompetenz realistisch klären."]
    : ["You are a developer, project sales team, broker team or professional real estate agent.", "You already have leads, campaigns, portals or project enquiries.", "Your sales team loses time through unqualified enquiries.", "You are ready to build a system and operate it for at least 3 months.", "You can realistically clarify budget and decision authority."];
  const noFit = de
    ? ["Sie sammeln nur kostenlose Marketingideen.", "Sie erwarten eine Lead-Garantie.", "Sie suchen Build-only oder Run-only.", "Sie wollen keine CRM- oder Vertriebsdisziplin aufbauen.", "Sie können aktuell kein Projekt, Marktgebiet oder Leadproblem benennen."]
    : ["You only want free marketing ideas.", "You expect a lead guarantee.", "You want Build-only or Run-only.", "You do not want CRM or sales discipline.", "You cannot name a project, market area or lead-quality problem."];
  const checks = de
    ? ["Zielgruppe und Projekt-/Marktlogik", "bestehende Leadquellen", "Landingpage- und Formularlogik", "Qualifizierungsfragen", "CRM-Handover", "Follow-up-Disziplin", "Engpass zwischen Marketing und Vertrieb", "ob ein Build+Run wirtschaftlich sinnvoll ist"]
    : ["target group and project/market logic", "existing lead sources", "landing page and form logic", "qualification questions", "CRM handover", "follow-up discipline", "bottleneck between marketing and sales", "whether Build+Run is commercially sensible"];
  const after = de
    ? ["Klare Einschätzung: geeignet / nicht geeignet / noch nicht bereit", "3-5 identifizierte Pipeline-Leaks", "Empfehlung, ob Build+Run sinnvoll ist", "Nächster Schritt: Angebot, zweites Diagnosegespräch oder Absage"]
    : ["clear assessment: fit / no fit / not ready yet", "3-5 identified pipeline leaks", "recommendation on whether Build+Run makes sense", "next step: proposal, second diagnosis call or refusal"];
  const notIncluded = de
    ? ["keine vollständige Funnel-Strategie gratis", "keine Media-Planung gratis", "keine Lead-Garantie", "keine rechtliche oder finanzielle Beratung", "keine Zusage ohne Scope-Prüfung"]
    : ["no full funnel strategy for free", "no free media planning", "no lead guarantee", "no legal or financial advice", "no commitment without scope review"];

  return (
    <section className="audit-section">
      <div className="audit-grid">
        <article className="content-section"><h2>{de ? "Dieses Audit ist richtig für Sie, wenn..." : "This audit is right for you if..."}</h2><ul className="check-list">{fit.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section"><h2>{de ? "Dieses Audit ist nicht richtig für Sie, wenn..." : "This audit is not right for you if..."}</h2><ul className="check-list">{noFit.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section"><h2>{de ? "Was wir in 30 Minuten prüfen" : "What we review in 30 minutes"}</h2><ul className="check-list">{checks.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="content-section"><h2>{de ? "Was Sie nach dem Audit bekommen" : "What you receive after the audit"}</h2><ul className="check-list">{after.map((item) => <li key={item}>{item}</li>)}</ul></article>
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

  return (
    <section className="faq-section">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>{locale === "en" ? "Hard questions before we talk." : "Harte Fragen vor dem Gespräch."}</h2>
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ content, title }: { content: PageContent; title?: string }) {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">{content.locale === "en" ? "Next step" : "Nächster Schritt"}</p>
        <h2>{title || (content.locale === "en" ? "Review whether your funnel needs a Build+Run system." : "Prüfen Sie in 30 Minuten, ob Ihr Funnel ein Build+Run-System braucht.")}</h2>
        <p>{content.locale === "en" ? "No free consulting report is included. No lead guarantee. Clear diagnosis before proposal." : "Kein kostenloses Gutachten. Keine Lead-Garantie. Klare Diagnose vor Angebot."}</p>
      </div>
      <div className="hero-actions">
        <div className="cta-primary-group">
          <Link className="button button-primary" href={`${getPath(content.locale, "contact")}#book-audit`} data-track="cta_audit">
            {content.locale === "en" ? "Request a Pipeline Audit" : "Pipeline-Audit anfragen"}
          </Link>
          <p className="cta-microcopy">
            {content.locale === "en"
              ? "30 min diagnosis. No sales pitch. No free funnel plans."
              : "30 Min. Diagnose. Kein Verkaufsgespräch. Keine kostenlosen Funnel-Pläne."}
          </p>
        </div>
        <Link className="button button-secondary dark" href={getPlaybookFormPath(content.locale)} data-track="cta_playbook">
          {content.locale === "en" ? "Download playbook" : "Playbook herunterladen"}
        </Link>
      </div>
    </section>
  );
}

function getCtaHref(locale: Locale, cta: PageContent["primaryCta"]) {
  if (cta.target === "playbooks" && !cta.anchor) {
    return getPlaybookFormPath(locale);
  }
  const base = getPath(locale, cta.target);
  return cta.anchor ? `${base}#${cta.anchor}` : base;
}
