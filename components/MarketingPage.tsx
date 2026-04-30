import Link from "next/link";
import { getPath } from "@/lib/i18n";
import { playbooks, type HomeContent, type PageContent } from "@/content/pages";
import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholders";
import { PipelineVisual } from "@/components/PipelineVisual";

export function MarketingPage({ content }: { content: PageContent | HomeContent }) {
  if (content.template === "home") return <HomePage content={content as HomeContent} />;
  if (content.template === "playbooks") return <PlaybooksPage content={content} />;
  if (content.template === "contact") return <ContactPage content={content} />;
  if (content.template === "legal") return <LegalPage content={content} />;
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
          <Link className="button button-primary" href={getPath(content.locale, content.primaryCta.target)}>
            {content.primaryCta.label}
          </Link>
          <Link className="button button-secondary" href={getPath(content.locale, content.secondaryCta.target)}>
            {content.secondaryCta.label}
          </Link>
        </div>
        <ul className="hero-bullets">
          {content.heroBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
      {visual ? <PipelineVisual /> : <SystemMiniCard bullets={content.heroBullets} />}
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

      <section className="audience-section">
        <div className="section-heading">
          <p className="eyebrow">{locale === "en" ? "Who it serves" : "Für wen es gebaut ist"}</p>
          <h2>{content.audience.title}</h2>
        </div>
        <div className="audience-grid">
          {content.audience.cards.map((card) => (
            <Link className="premium-card audience-card" href={getPath(locale, card.hrefKey)} key={card.title}>
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

      <section className="problem-section">
        <div className="section-heading narrow">
          <p className="eyebrow">{locale === "en" ? "The problem" : "Das Problem"}</p>
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

      <SystemSection content={content} />
      <ModuleSection content={content} />
      <PlaybookConversion locale={locale} title={content.playbookSection.title} body={content.playbookSection.body} />
      <BeforeAfter content={content} />
      <ProcessBlock content={content} />
      <TeamBlock content={content} />
      <FaqSection locale={locale} items={content.faq || []} />
      <FinalCta content={content} title={content.finalCtaTitle} />
    </main>
  );
}

function SystemSection({ content }: { content: HomeContent }) {
  return (
    <section className="system-section" id="system">
      <div className="section-heading">
        <p className="eyebrow">{content.locale === "en" ? "The system" : "Das System"}</p>
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

function ModuleSection({ content }: { content: HomeContent }) {
  return (
    <section className="module-section">
      <div className="section-heading">
        <p className="eyebrow">{content.locale === "en" ? "Modules" : "Module"}</p>
        <h2>{content.modules.title}</h2>
      </div>
      <div className="module-grid">
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

function PlaybookConversion({ locale, title, body }: { locale: "en" | "de"; title: string; body: string }) {
  return <PlaybookHub locale={locale} title={title} body={body} eyebrow={locale === "en" ? "Primary conversion" : "Primäre Conversion"} />;
}

function PlaybookHub({
  locale,
  title,
  body,
  eyebrow
}: {
  locale: "en" | "de";
  title: string;
  body: string;
  eyebrow?: string;
}) {
  return (
    <section className="playbook-section">
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
        <p className="eyebrow">{content.locale === "en" ? "Team" : "Team"}</p>
        <h2>{content.team.title}</h2>
        <p>{content.team.body}</p>
      </div>
      <div className="team-grid">
        <article className="founder-card">
          <span>FR</span>
          <h3>{content.team.founder}</h3>
          <p>
            {content.locale === "en"
              ? "Commercial real estate sales thinking connected to the operating system behind qualified pipeline."
              : "Kommerzielles Immobilienvertriebsdenken verbunden mit dem Betriebssystem hinter qualifizierter Pipeline."}
          </p>
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
  const playbookKey = content.key === "developers" ? "developer" : "agent";
  const playbook = playbooks[content.locale].find((item) => item.key === playbookKey)!;

  return (
    <main>
      <Hero content={content} visual />
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
        title={playbook.title}
        body={playbook.subtitle}
      />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function PlaybooksPage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} />
      <PlaybookHub
        locale={content.locale}
        title={content.locale === "en" ? "Two playbooks. One goal: better qualified pipeline." : "Zwei Playbooks. Ein Ziel: bessere qualifizierte Pipeline."}
        body={content.description}
      />
      <FaqSection locale={content.locale} items={content.faq || []} />
      <FinalCta content={content} />
    </main>
  );
}

function ContactPage({ content }: { content: PageContent }) {
  return (
    <main>
      <Hero content={content} />
      <section className="section-grid">
        {content.sections?.map((section, index) => (
          <article className="content-section" key={section.title}>
            <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      <section className="meeting-section">
        <HubSpotMeetingEmbed locale={content.locale} />
      </section>
      <FaqSection locale={content.locale} items={content.faq || []} />
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
            {section.items && (
              <ul className="check-list">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

function FaqSection({ locale, items }: { locale: "en" | "de"; items: { question: string; answer: string }[] }) {
  if (!items.length) return null;

  return (
    <section className="faq-section">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>{locale === "en" ? "Questions worth answering before we talk." : "Fragen, die vor einem Gespräch wichtig sind."}</h2>
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
        <h2>{title || (content.locale === "en" ? "Download the Playbook first. Book the audit when you want the system reviewed." : "Laden Sie zuerst das Playbook herunter. Buchen Sie das Audit, wenn Ihr System geprüft werden soll.")}</h2>
      </div>
      <div className="hero-actions">
        <Link className="button button-primary" href={getPath(content.locale, "playbooks")}>
          {content.locale === "en" ? "Download Playbook" : "Playbook herunterladen"}
        </Link>
        <Link className="button button-secondary dark" href={getPath(content.locale, "contact")}>
          {content.locale === "en" ? "Book Private Growth Audit" : "Privates Growth Audit buchen"}
        </Link>
      </div>
    </section>
  );
}
