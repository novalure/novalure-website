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
      </div>
      {visual ? <FunnelHeroVisual locale={content.locale} /> : <SystemMiniCard bullets={content.heroBullets} />}
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
      <TrustSnapshot locale={locale} />
      <ProblemSection content={content} />
      <AudienceOverview content={content} />
      <SystemSection content={content} />
      <DeliverablesSection content={content} />
      <ProofSection locale={locale} />
      <PipelineAuditSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <BeforeAfter content={content} />
      <MarketComparisonSection locale={locale} />
      <TeamBlock content={content} />
      <ProcessBlock content={content} />
      <PlaybookConversion locale={locale} title={content.playbookSection.title} body={content.playbookSection.body} />
      <FaqSection locale={locale} items={content.faq || []} />
      <FinalCta content={content} title={content.finalCtaTitle} />
    </main>
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
          label: "CRM-Übergabe",
          metric: "CRM-ready",
          body: "Quelle, Motivation, Timing, Budgetnähe und nächster Schritt sind vor dem ersten Gespräch sichtbar."
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
          label: "CRM handover",
          metric: "CRM-ready",
          body: "source, motivation, timing, budget proximity and next step are visible before the first call."
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

function TestimonialsSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const copy = de
    ? {
        eyebrow: "KUNDENSTIMMEN",
        headline: "Qualifizierte Anfragen sind messbar besser als Rohleads.",
        intro: "Ein Beispiel aus der DACH-Immobilienbranche: weniger ungefilterte Kontakte, mehr planbare Pipeline und klarere Gespräche.",
        quote: "Die Zusammenarbeit mit NovaLure hat unsere Verkäuferakquise messbar verändert. Wir bekommen kontinuierlich qualifizierte Anfragen statt ungefilterter Kontakte — das macht unsere Pipeline planbar.",
        name: "SV Thomas Grasl",
        subline: "Inhaber GRASL Immobilien, Schwaz",
        firstMetric: "15–20",
        firstMetricLabel: "Qualifizierte Anfragen pro Monat",
        secondMetric: "EUR 110k+",
        secondMetricLabel: "Provisionsvolumen aus aktiven Mandaten"
      }
    : {
        eyebrow: "CLIENT TESTIMONIALS",
        headline: "Qualified enquiries beat raw leads.",
        intro: "An example from the DACH real estate market: fewer unfiltered contacts, more predictable pipeline and clearer conversations.",
        quote: "Working with NovaLure has measurably changed how we acquire seller leads. We now receive a steady flow of qualified inquiries instead of unfiltered contacts — that makes our pipeline predictable.",
        name: "SV Thomas Grasl",
        subline: "Owner, GRASL Immobilien, Schwaz",
        firstMetric: "15–20",
        firstMetricLabel: "Qualified inquiries per month",
        secondMetric: "EUR 110k+",
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
        <p className="eyebrow">{de ? "Beispiel-Handover" : "Sample handover"}</p>
        <h2>{de ? "Was ein qualifizierter Lead vor dem ersten Gespräch enthalten sollte" : "What a qualified lead should contain before the first call"}</h2>
        <p>
          {de
            ? "Der Wert entsteht nicht durch Name und Telefonnummer. Der Wert entsteht, wenn Quelle, Motivation, Timing, Budgetnähe und nächster Schritt sichtbar sind."
            : "The value is not the name and phone number. The value appears when source, motivation, timing, budget proximity and next step are visible."}
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
        ["Segment", "Käufer, Eigentümer oder Projektinteressent"],
        ["Quelle", "Asset, Kampagne, Portal oder Empfehlung"],
        ["Motivation", "Kaufen, verkaufen, investieren oder informieren"],
        ["Timing", "0-3 Monate, 3-6 Monate oder später"],
        ["Budgetnähe", "passt / offen / nicht passend"],
        ["Nächster Schritt", "Rückruf, Suchprofil, Bewertung oder Projektgespräch"]
      ]
    : [
        ["Segment", "Buyer, seller or project enquiry"],
        ["Source", "Asset, campaign, portal or referral"],
        ["Motivation", "Buy, sell, invest or research"],
        ["Timing", "0-3 months, 3-6 months or later"],
        ["Budget proximity", "fit / open / not a fit"],
        ["Next step", "Callback, search profile, valuation or project call"]
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
            ? "NovaLure delivers the structure between first click and qualified conversation: funnel, questions, CRM handover, follow-up and reporting."
            : "NovaLure liefert die Struktur zwischen erstem Klick und qualifiziertem Gespräch: Funnel, Fragen, CRM-Übergabe, Follow-up und Reporting."}
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

function PipelineAuditSection({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const checks = de
    ? ["Anzeige und Quelle", "Landingpage und Formular", "Qualifizierende Fragen", "CRM-Übergabe", "Follow-up", "Reporting nach Leadqualität"]
    : ["Ad and source", "Landing page and form", "Qualification questions", "CRM handover", "Follow-up", "Reporting by lead quality"];
  const outcomes = de
    ? ["Einschätzung des aktuellen Lead-Systems", "Identifizierte Schwachstellen", "Empfehlung, ob Aufbau plus laufende Optimierung sinnvoll ist", "Klarheit über den nächsten Schritt"]
    : ["Assessment of the current lead system", "Identified weak points", "Recommendation whether setup plus ongoing optimisation makes sense", "Clarity on the next step"];

  return (
    <section className="audit-section home-audit-section" id="pipeline-audit">
      <div className="section-heading narrow">
        <p className="eyebrow">{de ? "Pipeline-Audit" : "Pipeline Audit"}</p>
        <h2>
          {de
            ? "Finden Sie heraus, wo Ihr Lead-System Vertriebszeit verliert."
            : "Find out where your lead system is wasting sales time."}
        </h2>
        <p>
          {de
            ? "Das Pipeline-Audit prüft, ob Ihr aktueller Weg von Anzeige bis CRM qualifizierte Gespräche erzeugt oder nur neue Sortierarbeit."
            : "The Pipeline Audit checks whether your current path from ad to CRM creates qualified conversations or just more sorting work."}
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
          {de ? "Pipeline-Audit buchen" : "Book a Pipeline Audit"}
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
          points: ["Fokus auf Kampagnen, Klicks und Creatives", "CRM-Kontext oft nachgelagert", "Erfolg häufig über CPL gemessen"]
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
          points: ["Focus on campaigns, clicks and creatives", "CRM context often comes too late", "Success often measured by CPL"]
        },
        {
          title: "Lead portal",
          points: ["Reach, but no owned pipeline", "Leads are often shared or interchangeable", "Limited control over funnel and data"]
        },
        {
          title: "NovaLure",
          points: ["Owned lead path with pre-qualification", "CRM-ready handover with next step", "Reporting by lead quality and focus on qualified conversations"]
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
    ? ["Sie sind Bauträger, Projektentwickler, Projektvertrieb, Maklerteam oder professioneller Makler.", "Sie haben bereits Leads, Kampagnen, Portale oder Projektanfragen.", "Sie verlieren Zeit durch unqualifizierte Anfragen oder fehlenden CRM-Kontext.", "Sie wollen aus Anfragen qualifizierte Gespräche machen.", "Sie können Budget und Entscheidungskompetenz realistisch klären."]
    : ["You are a developer, project sales team, broker team or professional real estate agent.", "You already have leads, campaigns, portals or project enquiries.", "You lose time through unqualified enquiries or missing CRM context.", "You want enquiries to become qualified conversations.", "You can realistically clarify budget and decision authority."];
  const noFit = de
    ? ["Sie sammeln nur kostenlose Marketingideen.", "Sie erwarten eine feste Lead-Zahl unabhängig von Markt und Angebot.", "Sie wollen keine CRM- oder Follow-up-Struktur aufbauen.", "Sie können aktuell kein Projekt, Marktgebiet oder Leadproblem benennen."]
    : ["You only want free marketing ideas.", "You expect a fixed lead number regardless of market and offer.", "You do not want CRM or follow-up structure.", "You cannot name a project, market area or lead-quality problem."];
  const checks = de
    ? ["Zielgruppe und Projekt-/Marktlogik", "bestehende Leadquellen", "Landingpage- und Formularlogik", "Qualifizierungsfragen", "CRM-Handover", "Follow-up-Disziplin", "Engpass zwischen Marketing und Vertrieb", "ob ein Build+Run wirtschaftlich sinnvoll ist"]
    : ["target group and project/market logic", "existing lead sources", "landing page and form logic", "qualification questions", "CRM handover", "follow-up discipline", "bottleneck between marketing and sales", "whether Build+Run is commercially sensible"];
  const after = de
    ? ["Einschätzung des aktuellen Lead-Systems", "3-5 identifizierte Schwachstellen", "Empfehlung, ob Aufbau plus laufende Optimierung sinnvoll ist", "Nächster Schritt: Angebot, zweites Diagnosegespräch oder klare Absage"]
    : ["assessment of the current lead system", "3-5 identified weak points", "recommendation on whether build plus ongoing optimisation makes sense", "next step: proposal, second diagnosis call or clear refusal"];
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
        <p>{content.locale === "en" ? "See whether your current funnel creates qualified conversations or only more sorting work." : "Sehen Sie, ob Ihr aktueller Funnel qualifizierte Gespräche erzeugt oder nur neue Sortierarbeit."}</p>
      </div>
      <div className="hero-actions">
        <div className="cta-primary-group">
          <Link className="button button-primary" href={`${getPath(content.locale, "contact")}#book-audit`} data-track="cta_audit">
            {content.locale === "en" ? "Book a Pipeline Audit" : "Pipeline-Audit buchen"}
          </Link>
          <p className="cta-microcopy">
            {content.locale === "en"
              ? "30 min diagnosis. Clear bottleneck. Clear next step."
              : "30 Min. Diagnose. Klarer Engpass. Klarer nächster Schritt."}
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
