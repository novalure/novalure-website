import Image from "next/image";
import { ContactInquiryForm } from "@/components/ContactInquiryForm";
import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholders";
import { relaunchCopy } from "@/content/relaunch-copy";
import { getProcessAnchor, type Locale } from "@/lib/i18n";
import { FaqAccordion, ProcessSteps, ProjectCheckLink, ProofCounters, SectionReveals } from "@/components/relaunch/RelaunchInteractive";
import { ReferenceBrands } from "@/components/relaunch/ReferenceBrands";

function SectionKicker({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <p className={`v3-kicker${inverse ? " is-inverse" : ""}`}><span aria-hidden="true" />{children}</p>;
}

function HeroPipeline({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const cards = [
    { name: t.unitPenthouseA3, score: 87, status: t.stViewing, source: t.srcCampaign, next: t.next1, tone: "high" },
    { name: t.unitGardenB1, score: 74, status: t.stQualified, source: t.srcBrochure, next: t.next2, tone: "medium" },
    { name: t.unitDuplexC2, score: 69, status: t.stFollowup, source: t.srcLanding, next: t.next3, tone: "medium" },
    { name: t.unitApartmentD4, score: 91, status: t.stHandover, source: t.srcReferral, next: t.next4, tone: "high" }
  ] as const;

  return (
    <div className="v3-hero-visual" aria-label={t.mockTitle}>
      <div className="v3-pipeline-window">
        <div className="v3-window-bar">
          <span className="v3-window-dots" aria-hidden="true"><i /><i /><i /></span>
          <strong>{t.mockTitle}</strong>
          <span className="v3-demo-badge">{t.demoBadge}</span>
        </div>
        <div className="v3-pipeline-grid">
          {cards.map((card, index) => (
            <article className={`v3-pipeline-card v3-card-${index + 1}`} key={card.name}>
              <div>
                <strong>{card.name}</strong>
                <span className={`v3-score is-${card.tone}`}>{t.scoreLabel} {card.score}</span>
              </div>
              <p>{card.status} · {card.source}</p>
              <small>→ {card.next}</small>
            </article>
          ))}
        </div>
        <p className="v3-demo-note">{t.demoNote}</p>
      </div>
      <ReferenceBrands locale={locale} kicker={t.chipKicker} />
    </div>
  );
}

function SystemBoard({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const columns: Array<{
    title: string;
    count: number;
    cards: Array<{ name: string; score: number; note: string; highlight?: boolean; scorePill?: boolean }>;
  }> = [
    {
      title: t.colA,
      count: 4,
      cards: [
        { name: t.unitGardenB2, score: 41, note: t.srcBrochure },
        { name: t.unitApartmentE1, score: 38, note: t.srcCampaign },
        { name: t.unitDuplexC1, score: 33, note: t.srcLanding }
      ]
    },
    {
      title: t.colB,
      count: 3,
      cards: [
        { name: t.unitGardenB1, score: 74, note: t.next2 },
        { name: t.unitDuplexC2, score: 69, note: t.stDocs }
      ]
    },
    {
      title: t.colC,
      count: 2,
      cards: [
        { name: t.unitPenthouseA3, score: 87, note: `${t.stViewing} · ${locale === "de" ? "Do 14:00" : locale === "es" ? "jue. 14:00" : "Thu 2pm"}`, highlight: true, scorePill: true },
        { name: t.unitApartmentD4, score: 91, note: t.stHandover, scorePill: true }
      ]
    }
  ];

  return (
    <div className="v3-system-board" aria-label={t.pipeTitle}>
      <div className="v3-board-head">
        <span className="v3-window-dots" aria-hidden="true"><i /><i /><i /></span>
        <strong>NovaLure CRM · {t.pipeTitle}</strong>
        <span>{t.demoBadge}</span>
      </div>
      <div className="v3-board-scroll">
        <div className="v3-board-columns">
          {columns.map((column) => (
            <section key={column.title}>
              <h3>{column.title}<span>{column.count}</span></h3>
              {column.cards.map((card) => (
                <article className={card.highlight ? "is-highlighted" : ""} key={card.name}>
                  {card.scorePill ? (
                    <>
                      <div><strong>{card.name}</strong><span aria-label={`${t.scoreLabel} ${card.score}`}>{card.score}</span></div>
                      <small>{card.note}</small>
                    </>
                  ) : (
                    <>
                      <strong>{card.name}</strong>
                      <small>{card.note} · {t.scoreLabel} {card.score}</small>
                    </>
                  )}
                </article>
              ))}
            </section>
          ))}
        </div>
      </div>
      <p>{t.demoNote}</p>
    </div>
  );
}

export function RelaunchHomePage({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const trustItems = [
    [t.tr1b, t.tr1],
    [t.tr2b, t.tr2],
    [t.tr3b, t.tr3]
  ];
  const material = [
    { src: "/images/visual-exterior-01.jpg", title: t.mat1t, meta: t.mat1m },
    { src: "/images/visual-interior-01.jpg", title: t.mat2t, meta: t.mat2m },
    { src: locale === "de" ? "/playbooks/covers/bautraeger-de-cover.png" : locale === "es" ? "/playbooks/covers/promotores-es-cover.png" : "/playbooks/covers/developer-en-cover.png", title: t.mat3t, meta: t.mat3m }
  ];

  return (
    <main className="relaunch-home">
      <SectionReveals />
      <section className="v3-hero" id="top">
        <div className="v3-hero-copy">
          <SectionKicker>{t.kicker}</SectionKicker>
          <h1>{t.heroH1}</h1>
          <p>{t.heroSub}</p>
          <div className="v3-actions">
            <ProjectCheckLink className="v3-button v3-button-primary" track="v3_hero_project_check">
              {t.cta}
            </ProjectCheckLink>
            <a className="v3-button v3-button-secondary" href="#playbook" data-track="v3_hero_playbook">
              {t.ctaPlaybook}
            </a>
          </div>
          <p className="v3-trust-line">{t.trust}</p>
        </div>
        <HeroPipeline locale={locale} />
      </section>

      <section className="v3-proof" data-reveal data-track-section="proof" aria-label={locale === "de" ? "Referenzwerte" : locale === "es" ? "Valores de referencia" : "Reference values"}>
        <ProofCounters locale={locale} firstLabel={t.kpi1} secondLabel={t.kpi2} />
        <p>{t.proofNote}</p>
      </section>

      <section className="v3-section v3-developers" id="bautraeger" data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.bauKicker}</SectionKicker>
          <h2>{t.bauH}</h2>
        </div>
        <div className="v3-problem-grid">
          {t.pairs.map((pair) => (
            <article key={pair.p}>
              <small>{t.probLabel}</small>
              <p>{pair.p}</p>
              <span className="v3-solution-arrow" aria-hidden="true"><i />↓</span>
              <small>{t.solLabel}</small>
              <strong>{pair.s}</strong>
            </article>
          ))}
        </div>
        <div className="v3-section-result">
          <strong>{t.bauResult}</strong>
          <ProjectCheckLink className="v3-button v3-button-primary" projectType="developers" track="v3_developer_project_check">
            {t.cta}
          </ProjectCheckLink>
        </div>
      </section>

      <section className="v3-section v3-process" id={getProcessAnchor(locale)} data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.procKicker}</SectionKicker>
          <h2>{t.procH}</h2>
        </div>
        <ProcessSteps steps={t.steps} getLabel={t.getLabel} />
        <p className="v3-process-note">{t.procNote}</p>
      </section>

      <section className="v3-section v3-system" id="system" data-reveal>
        <div className="v3-system-copy">
          <SectionKicker inverse>{t.sysKicker}</SectionKicker>
          <h2>{t.sysH}</h2>
          <ul>
            {[t.sysB1, t.sysB2, t.sysB3].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <SystemBoard locale={locale} />
      </section>

      <section className="v3-section v3-case" data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.caseKicker}</SectionKicker>
          <h2>GRASL Immobilien, Schwaz</h2>
        </div>
        <div className="v3-case-grid">
          {[[t.c1t, t.c1], [t.c2t, t.c2], [t.c3t, t.c3]].map(([title, body], index) => (
            <article className={index === 2 ? "is-result" : ""} key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <figure className="v3-case-quote">
          <Image src="/images/thomas-grasl-portrait.jpg" alt="SV Thomas Grasl" width={176} height={176} sizes="88px" />
          <blockquote>{t.quote}</blockquote>
          <figcaption><strong>SV Thomas Grasl</strong><span>GRASL Immobilien, Schwaz</span></figcaption>
        </figure>
      </section>

      <section className="v3-section v3-agents" id="makler" data-reveal>
        <SectionKicker>{t.mkKicker}</SectionKicker>
        <h2>{t.mkH}</h2>
        <p>{t.mkBody}</p>
        <ProjectCheckLink className="v3-button v3-button-secondary" projectType="agents" track="v3_agents_project_check">
          {t.mkCta}
        </ProjectCheckLink>
      </section>

      <section className="v3-section v3-material" data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.matKicker}</SectionKicker>
          <h2>{t.matH}</h2>
        </div>
        <div className="v3-material-grid">
          {material.map((item) => (
            <article key={item.title}>
              <Image src={item.src} alt={item.meta} fill sizes="(min-width: 1100px) 33vw, (min-width: 768px) 50vw, 100vw" />
              <span>{t.matBadge}</span>
              <div><h3>{item.title}</h3><p>{item.meta}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="v3-section v3-trust" data-reveal>
        <div className="v3-section-heading"><h2>{t.trH}</h2></div>
        <div className="v3-trust-grid">
          {trustItems.map(([title, body]) => (
            <article key={title}><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="v3-section v3-team" id="team" data-reveal>
        <div className="v3-team-inner">
          <div className="v3-team-image">
            <Image src="/images/team-franz-romih.png" alt="Franz Romih, NovaLure" fill sizes="(min-width: 768px) 340px, 100vw" />
          </div>
          <div className="v3-team-copy">
            <SectionKicker>{t.teamKicker}</SectionKicker>
            <h2>{t.teamH}</h2>
            <p>{t.teamBody}</p>
            <div className="v3-team-person">
              <strong>Franz Romih</strong>
            </div>
            <div className="v3-tags">{[t.tagA, t.tagB, t.tagC].map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="v3-section v3-playbook" id="playbook" data-reveal>
        <div className="v3-playbook-shell">
          <div className="v3-playbook-intro">
            <SectionKicker inverse>{t.pbKicker}</SectionKicker>
            <h2>{t.pbH}</h2>
            <p>{t.pbBody}</p>
          </div>
          <HubSpotForm locale={locale} playbook="developer" selectable compact />
        </div>
      </section>

      <section className="v3-section v3-faq" id="faq" data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.faqKicker}</SectionKicker>
          <h2>{t.faqH}</h2>
        </div>
        <FaqAccordion items={t.faq} locale={locale} />
      </section>

      <section className="v3-section v3-contact" id="kontakt" data-reveal>
        <div className="v3-section-heading is-centered">
          <h2>{t.finalH}</h2>
          <p>{t.finalSub}</p>
          {/* TODO: Kapazitätszahl [X] erst mit verifiziertem Wert veröffentlichen. */}
        </div>
        <p className="v3-contact-note">{t.bothWays}</p>
        <div className="v3-contact-grid">
          <ContactInquiryForm locale={locale} compact />
          <HubSpotMeetingEmbed locale={locale} title={t.calH} body={t.calSub} linkLabel={t.calBtn} />
        </div>
      </section>
    </main>
  );
}
