import Image from "next/image";
import Link from "next/link";
import { ContactInquiryForm } from "@/components/ContactInquiryForm";
import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholdersV2";
import { managedServiceCopy } from "@/content/managed-service-copy";
import { relaunchCopy } from "@/content/relaunch-copy";
import { getPath, getProcessAnchor, type Locale } from "@/lib/i18n";
import { FaqAccordion, ProcessStory, ProjectCheckLink, ProofCounters, SectionReveals } from "@/components/relaunch/RelaunchInteractive";
import { ReferenceBrands } from "@/components/relaunch/ReferenceBrands";

function SectionKicker({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <p className={`v3-kicker${inverse ? " is-inverse" : ""}`}><span aria-hidden="true" />{children}</p>;
}

function SystemBoard({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const managed = managedServiceCopy[locale];
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
      <p>{managed.demoNote}</p>
    </div>
  );
}

export function RelaunchHomePageManaged({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const managed = managedServiceCopy[locale];
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
  const editorial = locale === "de" ? {
    problemKicker: "Vom Interesse zum Gespräch",
    problemH: "Nicht mehr Anfragen. Besser vorbereitete Gespräche.",
    raw: "Unsortierte Anfragen",
    qualified: "Qualifizierte Käufergespräche",
    pathLabel: "Der NovaLure Projektweg",
    audienceKicker: "Für wen wir arbeiten",
    audienceH: "Ein System. Zwei klare Einsatzfelder.",
    developerTitle: "Bauträger",
    developerBody: "Für Projekte, die vom ersten Auftritt bis zur Vertriebsübergabe aus einem Guss geführt werden sollen.",
    agentTitle: "Makler & Teams",
    agentBody: "Für Projektvertriebe, die Nachfrage strukturiert qualifizieren und vorbereitet übernehmen wollen.",
    aboutKicker: "Über NovaLure",
    aboutH: "Spezialisierte Arbeit. Ein gemeinsamer Projektweg.",
    aboutBody: "NovaLure koordiniert Strategie, Kreation, Performance und Interessentenkommunikation rund um Ihr Mandat. Technologie bleibt dabei operativ im Hintergrund – entscheidend sind nachvollziehbare Arbeitsschritte, klare Zuständigkeiten und eine saubere Übergabe an Ihren Vertrieb.",
    explore: "Mehr erfahren",
    next: "Nächster Schritt"
  } : locale === "es" ? {
    problemKicker: "Del interés a la conversación",
    problemH: "No más solicitudes. Mejores conversaciones preparadas.",
    raw: "Solicitudes sin clasificar",
    qualified: "Conversaciones cualificadas",
    pathLabel: "El recorrido NovaLure",
    audienceKicker: "Para quién trabajamos",
    audienceH: "Un sistema. Dos aplicaciones claras.",
    developerTitle: "Promotores",
    developerBody: "Para promociones que necesitan un recorrido coherente desde su presentación hasta el traspaso comercial.",
    agentTitle: "Agencias y equipos",
    agentBody: "Para equipos que quieren cualificar la demanda y recibir conversaciones preparadas.",
    aboutKicker: "Sobre NovaLure",
    aboutH: "Trabajo especializado. Un recorrido de proyecto compartido.",
    aboutBody: "NovaLure coordina estrategia, creatividad, rendimiento y comunicación con interesados alrededor de su mandato. La tecnología permanece en segundo plano: importan los pasos verificables, las responsabilidades claras y un traspaso ordenado a su equipo comercial.",
    explore: "Más información",
    next: "Siguiente paso"
  } : {
    problemKicker: "From interest to conversation",
    problemH: "Not more enquiries. Better-prepared conversations.",
    raw: "Unsorted enquiries",
    qualified: "Qualified buyer conversations",
    pathLabel: "The NovaLure project path",
    audienceKicker: "Who we work for",
    audienceH: "One system. Two clear applications.",
    developerTitle: "Developers",
    developerBody: "For projects that need one coherent path from first impression to sales handover.",
    agentTitle: "Agents & teams",
    agentBody: "For project sales teams that want to qualify demand and take over prepared conversations.",
    aboutKicker: "About NovaLure",
    aboutH: "Specialist work. One shared project path.",
    aboutBody: "NovaLure coordinates strategy, creative, performance and enquiry communication around your mandate. Technology stays operationally in the background; what matters are traceable steps, clear ownership and a clean handover to your sales team.",
    explore: "Explore",
    next: "Next step"
  };
  const playbookCover = locale === "de" ? "/playbooks/covers/bautraeger-de-cover.png" : locale === "es" ? "/playbooks/covers/promotores-es-cover.png" : "/playbooks/covers/developer-en-cover.png";

  return (
    <main className="relaunch-home">
      <SectionReveals />
      <section className="v4-hero" id="top">
        <video className="v4-hero-media" autoPlay muted loop playsInline preload="metadata" poster="/images/hero-visualisation-fallback.png" aria-hidden="true">
          <source src="/videos/hero-visualisation-video.mp4" type="video/mp4" />
        </video>
        <div className="v4-hero-shade" aria-hidden="true" />
        <div className="v4-hero-copy">
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
          <p className="v4-trust-line">{t.trust}</p>
        </div>
        <div className="v4-hero-path" aria-label={editorial.pathLabel}>
          {[t.steps[0].t, t.steps[1].t, t.steps[3].t, t.steps[5].t].map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>)}
        </div>
        <div className="v4-scroll-cue" aria-hidden="true"><i /></div>
      </section>

      <section className="v3-section v4-problem" id="bautraeger" data-reveal>
        <div className="v4-problem-intro">
          <SectionKicker>{editorial.problemKicker}</SectionKicker>
          <h2>{editorial.problemH}</h2>
          <div className="v4-transformation" aria-label={`${editorial.raw} zu ${editorial.qualified}`}>
            <span>{editorial.raw}</span><i aria-hidden="true" /><strong>{editorial.qualified}</strong>
          </div>
        </div>
        <div className="v4-problem-list">
          {t.pairs.map((pair, index) => (
            <article key={pair.p}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{t.probLabel}</small><p>{pair.p}</p></div>
              <div><small>{t.solLabel}</small><strong>{pair.s}</strong></div>
            </article>
          ))}
        </div>
        <div className="v4-inline-cta">
          <p>{t.bauResult}</p>
          <ProjectCheckLink className="v3-button v3-button-primary" projectType="developers" track="v3_developer_project_check">
            {t.cta}
          </ProjectCheckLink>
        </div>
      </section>

      <section className="v3-section v4-process" id={getProcessAnchor(locale)} data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.procKicker}</SectionKicker>
          <h2>{t.procH}</h2>
        </div>
        <ProcessStory steps={t.steps} getLabel={t.getLabel} />
        <p className="v3-process-note">{t.procNote}</p>
      </section>

      <section className="v3-section v4-material" data-reveal>
        <div className="v3-section-heading">
          <SectionKicker>{t.matKicker}</SectionKicker>
          <h2>{t.matH}</h2>
        </div>
        <div className="v4-material-grid">
          {material.map((item, index) => (
            <figure className={`is-item-${index + 1}`} key={item.title}>
              <div><Image src={item.src} alt={item.meta} fill sizes={index === 0 ? "(min-width: 900px) 64vw, 100vw" : "(min-width: 900px) 32vw, 100vw"} /></div>
              <figcaption><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.meta}</p></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="v3-section v3-system" id="system" data-reveal>
        <div className="v3-system-copy">
          <SectionKicker inverse>{t.sysKicker}</SectionKicker>
          <h2>{t.sysH}</h2>
          <ul>
            {[t.sysB1, t.sysB2, managed.systemPoint].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <SystemBoard locale={locale} />
      </section>

      <section className="v3-section v4-case" id="case-study" data-reveal data-track-section="proof">
        <div className="v3-section-heading">
          <SectionKicker>{t.caseKicker}</SectionKicker>
          <h2>GRASL Immobilien, Schwaz</h2>
        </div>
        <div className="v4-case-layout">
          <div className="v3-case-grid">
          {[[t.c1t, t.c1], [t.c2t, managed.caseSetup], [t.c3t, t.c3]].map(([title, body], index) => (
            <article className={index === 2 ? "is-result" : ""} key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
          </div>
          <div className="v4-case-proof">
            <ProofCounters locale={locale} firstLabel={t.kpi1} secondLabel={t.kpi2} />
            <p>{t.proofNote}</p>
            <figure className="v3-case-quote">
              <Image src="/images/thomas-grasl-portrait.jpg" alt="SV Thomas Grasl" width={176} height={176} sizes="88px" />
              <blockquote>{t.quote}</blockquote>
              <figcaption><strong>SV Thomas Grasl</strong><span>GRASL Immobilien, Schwaz</span></figcaption>
            </figure>
            <ProjectCheckLink className="v3-button v3-button-primary" track="v4_case_project_check">{t.cta}</ProjectCheckLink>
          </div>
        </div>
      </section>

      <section className="v3-section v4-audiences" id="makler" data-reveal>
        <div className="v3-section-heading"><SectionKicker>{editorial.audienceKicker}</SectionKicker><h2>{editorial.audienceH}</h2></div>
        <div className="v4-audience-grid">
          <Link className="is-developer" href={getPath(locale, "developers")}>
            <span>01</span><h3>{editorial.developerTitle}</h3><p>{editorial.developerBody}</p><strong>{editorial.explore} →</strong>
          </Link>
          <Link className="is-agent" href={getPath(locale, "agents")}>
            <span>02</span><h3>{editorial.agentTitle}</h3><p>{editorial.agentBody}</p><strong>{editorial.explore} →</strong>
          </Link>
        </div>
      </section>

      <section className="v3-section v4-about" id="about" data-reveal>
        <div>
          <SectionKicker>{editorial.aboutKicker}</SectionKicker>
          <h2>{editorial.aboutH}</h2>
        </div>
        <p>{editorial.aboutBody}</p>
      </section>

      <section className="v3-section v3-trust" data-reveal>
        <div className="v3-section-heading"><h2>{t.trH}</h2></div>
        <div className="v3-trust-grid">
          {trustItems.map(([title, body], index) => (
            <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="v3-section v3-playbook" id="playbook" data-reveal>
        <div className="v3-playbook-shell">
          <div className="v4-playbook-object" aria-hidden="true">
            <div className="v4-playbook-shadow" />
            <Image src={playbookCover} alt="" width={612} height={792} sizes="(min-width: 900px) 28vw, 62vw" />
          </div>
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
        <FaqAccordion items={[...t.faq, managed.faq]} locale={locale} />
      </section>

      <section className="v3-section v3-contact" id="kontakt" data-reveal>
        <div className="v3-section-heading is-centered">
          <SectionKicker inverse>{editorial.next}</SectionKicker>
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
