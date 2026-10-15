"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NovalureWordmark } from "@/components/NovalureWordmark";
import type { Locale } from "@/lib/i18n";
import { homeCopy } from "./DraftHomeCopy";
import { siteHome, sitePath, sitePlaybookPath } from "./SiteRoutes";
import StaffLoginLink from "./StaffLoginLink";
import styles from "./DraftHome.module.css";

const innovationHeroVideo = "/videos/novalure-asme-hero.mp4";
const innovationHeroPoster = "/images/novalure-asme-hero-poster.jpg";

function Eyebrow({ index, children, light = false }: { index: string; children: React.ReactNode; light?: boolean }) {
  return <div className={`${styles.eyebrow} ${light ? styles.eyebrowLight : ""}`}><span>{index}</span><span className={styles.eyebrowLine} /><span>{children}</span></div>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.reveal} ${className}`} data-nl-reveal>{children}</div>;
}

export default function DraftHome({ locale = "de", preview = true }: { locale?: Locale; preview?: boolean }) {
  const t = homeCopy[locale];
  const homeHref = siteHome(locale, preview);
  const contactHref = `${sitePath(locale, "contact", preview)}#formular`;
  const playbooksHref = sitePlaybookPath(locale, preview);
  const processAnchor = locale === "es" ? "proceso" : "prozess";
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const heroVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 40);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-nl-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.IntersectionObserver || reducedMotion) {
      nodes.forEach((node) => node.classList.add(styles.visible));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = heroVideo.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    let heroVisible = true;
    let lastTime = video.currentTime;
    let stalledChecks = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const startVideo = () => {
      if (document.hidden || !heroVisible) return;
      video.muted = true;
      video.loop = true;
      if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setVideoPlaying(true);
      void video.play().catch(() => {
        // A later visibility, scroll or media event retries muted playback.
      });
    };
    const queueResume = () => {
      clearTimeout(resumeTimer);
      if (!document.hidden && heroVisible) resumeTimer = setTimeout(startVideo, 250);
    };
    const recoverVideo = () => {
      if (document.hidden || !heroVisible) return;
      if (video.error || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        video.load();
      } else {
        video.currentTime = 0;
      }
      startVideo();
    };
    const onPlaying = () => {
      stalledChecks = 0;
      lastTime = video.currentTime;
      setVideoPlaying(true);
    };
    const onVisibilityChange = () => {
      if (!document.hidden) startVideo();
    };
    const visibilityObserver = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) startVideo();
    }, { threshold: 0.01 }) : null;
    visibilityObserver?.observe(video.parentElement ?? video);
    const watchdog = window.setInterval(() => {
      if (document.hidden || !heroVisible) {
        stalledChecks = 0;
        lastTime = video.currentTime;
        return;
      }
      const progressed = Math.abs(video.currentTime - lastTime) > 0.1;
      stalledChecks = progressed ? 0 : stalledChecks + 1;
      lastTime = video.currentTime;
      if (stalledChecks >= 2) {
        stalledChecks = 0;
        recoverVideo();
      }
    }, 2000);
    video.addEventListener("canplay", startVideo);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", queueResume);
    video.addEventListener("ended", recoverVideo);
    window.addEventListener("pageshow", startVideo);
    document.addEventListener("visibilitychange", onVisibilityChange);
    startVideo();

    return () => {
      clearTimeout(resumeTimer);
      window.clearInterval(watchdog);
      visibilityObserver?.disconnect();
      video.removeEventListener("canplay", startVideo);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", queueResume);
      video.removeEventListener("ended", recoverVideo);
      window.removeEventListener("pageshow", startVideo);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={styles.draft}>
      <header className={styles.header}>
        <nav className={`${styles.nav} ${headerScrolled ? styles.navScrolled : ""}`} aria-label={t.navigation}>
          <a className={`${styles.brandWordmark} ${styles.wordmark}`} href="#start" onClick={closeMenu} aria-label={t.toTop}><NovalureWordmark /></a>
          <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}>
            <a href="#ansatz" onClick={closeMenu}>{t.approach}</a>
            <a href="#leistungen" onClick={closeMenu}>{t.services}</a>
            <a href={`#${processAnchor}`} onClick={closeMenu}>{t.process}</a>
            <a href="#referenzen" onClick={closeMenu}>{t.references}</a>
            <div className={styles.localeSwitchMobile} aria-label="Language">{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={siteHome(lang, preview)} hrefLang={lang} aria-current={lang === locale ? "page" : undefined}>{lang.toUpperCase()}</Link>)}</div>
          </div>
          <Link className={`${styles.navCta} ${styles.liquidGlass}`} href={contactHref} onClick={closeMenu}><span className={styles.navCtaFull}>{t.projectCheck}</span><span className={styles.navCtaShort}>{t.projectCheckShort}</span><ArrowUpRight size={16} strokeWidth={1.8} /></Link>
          <div className={styles.localeSwitch} aria-label="Language">{(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={siteHome(lang, preview)} hrefLang={lang} aria-current={lang === locale ? "page" : undefined}>{lang.toUpperCase()}</Link>)}</div>
          <button className={styles.menuButton} type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? t.menuClose : t.menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </nav>
      </header>
      <section className={styles.hero} id="start" aria-labelledby="draft-hero-title">
        <video ref={heroVideo} className={`${styles.heroVideo} ${videoPlaying ? styles.heroVideoPlaying : ""}`} src={innovationHeroVideo} poster={innovationHeroPoster} autoPlay muted playsInline loop preload="auto" aria-hidden="true" />
        <div className={styles.heroShade} aria-hidden="true" />

        <div className={styles.heroContent}>
          <h1 id="draft-hero-title">{t.heroLead} <em>{t.heroAccent}</em></h1>
          <Link className={`${styles.heroGlassCta} ${styles.liquidGlass}`} href={contactHref}><span>{t.projectCheck}</span><span className={styles.heroGlassArrow}><ArrowRight size={21} /></span></Link>
          <p className={styles.heroLead}>{t.heroBody}</p>
        </div>
        <div className={styles.heroBottom}>
          <a className={styles.scrollCue} href="#ansatz">{t.explore} <ArrowDown size={17} strokeWidth={1.7} /></a>
        </div>
      </section>

      <section className={styles.statement} id="ansatz">
        <div className={styles.container}>
          <Eyebrow index="01">{t.ideaLabel}</Eyebrow>
          <Reveal className={styles.statementGrid}>
            <h2>{t.ideaTitle} <em>{t.ideaAccent}</em></h2>
            <div className={styles.statementAside}>
              <span className={styles.smallRule} />
              <p>{t.ideaBody}</p>
              <a className={styles.textLink} href="#leistungen">{t.ideaLink} <ArrowUpRight size={18} /></a>
            </div>
          </Reveal>
          <Reveal className={styles.threeWords}>{t.ideaWords.map((word) => <span key={word}>{word}</span>)}</Reveal>
        </div>
      </section>

      <section className={styles.proof} id="leistungen">
        <div className={styles.container}>
          <Reveal className={styles.sectionHead}>
            <Eyebrow index="02">{t.servicesLabel}</Eyebrow>
            <div className={styles.sectionHeadRow}><h2>{t.servicesTitle}</h2><p>{t.servicesIntro}</p></div>
          </Reveal>
          <div className={styles.featureGrid}>
            <Reveal className={`${styles.featureCard} ${styles.featureVisual}`}>
              <div className={styles.featureImage}><Image src="/images/ai-render-15594499.jpg" alt={t.visualAlt} fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
              <div className={styles.featureOverlay}><span>01 / {t.visualLabel}</span><h3>{t.visualTitle}</h3><p>{t.visualBody}</p></div>
            </Reveal>
            <Reveal className={`${styles.featureCard} ${styles.featureCream}`}>
              <span className={styles.cardIndex}>02 / {t.demandLabel}</span>
              <div className={styles.orbit} aria-hidden="true"><span /><span /><span /></div>
              <div><h3>{t.demandTitle}</h3><p>{t.demandBody}</p></div>
            </Reveal>
            <Reveal className={`${styles.featureCard} ${styles.featureBlue}`}>
              <span className={styles.cardIndex}>03 / {t.salesLabel}</span>
              <div className={styles.miniFlow} aria-hidden="true"><span>{t.flow[0]}</span><i /><span>{t.flow[1]}</span><i /><span>{t.flow[2]}</span></div>
              <div><h3>{t.salesTitle}</h3><p>{t.salesBody}</p></div>
            </Reveal>
          </div>
          <Reveal className={styles.proofBar}>
            <div><span className={styles.proofValue}>01</span><span>{t.proofOne}<br />{t.proofOneAfter}</span></div>
            <div><span className={styles.proofValue}>02</span><span>{t.proofTwo}<br />{t.proofTwoAfter}</span></div>
            <p>{t.proofBody}</p>
          </Reveal>
          <Reveal className={styles.proofAction}><Link className={styles.textLink} href={contactHref}>{t.proofLink} <ArrowUpRight size={18} /></Link></Reveal>
        </div>
      </section>

      <section className={styles.process} id={processAnchor}>
        <div className={styles.container}>
          <Reveal className={styles.processHeader}><Eyebrow index="03">{t.processLabel}</Eyebrow><h2>{t.processTitle} <em>{t.processAccent}</em></h2><p>{t.processIntro}</p></Reveal>
          <div className={styles.processList}>
            {t.steps.map(([number, title, body]) => <Reveal className={styles.processItem} key={number}><span className={styles.processNumber}>{number}</span><h3>{title}</h3><p>{body}</p><ArrowUpRight className={styles.processArrow} size={24} strokeWidth={1.2} /></Reveal>)}
          </div>
          <Reveal className={styles.processFoot}><span>{t.processFoot}</span><Link className={styles.textLink} href={contactHref}>{t.projectCheck} <ArrowUpRight size={18} /></Link></Reveal>
        </div>
      </section>

      <section className={styles.system} id="system">
        <div className={styles.container}>
          <div className={styles.systemGrid}>
            <Reveal className={styles.systemCopy}>
              <Eyebrow index="04" light>{t.systemLabel}</Eyebrow>
              <h2>{t.systemTitle} <em>{t.systemAccent}</em></h2>
              <p>{t.systemBody}</p>
              <ul>{t.systemPoints.map((point) => <li key={point}><Check size={17} />{point}</li>)}</ul>
              <Link className={styles.buttonLight} href={sitePath(locale, "handover", preview)}>{t.systemLink} <ArrowUpRight size={17} /></Link>
            </Reveal>
            <Reveal className={styles.systemDemo}>
              <div className={styles.demoTop}><span><i /><i /><i /></span><strong>{t.demoTitle}</strong><small>{t.demo}</small></div>
              <div className={styles.demoBody}>
                <div className={styles.demoColumn}><span className={styles.demoColumnTitle}>{t.demoColumns[0]} <b>04</b></span>{t.demoCards.slice(0, 2).map(([name, state, source]) => <div className={styles.demoLead} key={name}><small>{name}</small><strong>{state}</strong><span>{source}</span></div>)}</div>
                <div className={styles.demoColumn}><span className={styles.demoColumnTitle}>{t.demoColumns[1]} <b>03</b></span>{t.demoCards.slice(2, 4).map(([name, state, source]) => <div className={styles.demoLead} key={name}><small>{name}</small><strong>{state}</strong><span>{source}</span></div>)}</div>
                <div className={styles.demoColumn}><span className={styles.demoColumnTitle}>{t.demoColumns[2]} <b>02</b></span><div className={`${styles.demoLead} ${styles.demoLeadActive}`}><small>{t.demoCards[4][0]}</small><strong>{t.demoCards[4][1]}</strong><span>{t.demoCards[4][2]}</span></div></div>
              </div>
              <p>{t.demoNote}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.playbookTeaser} id="playbooks">
        <div className={styles.container}>
          <Eyebrow index="05">{t.playbookLabel}</Eyebrow>
          <div className={styles.playbookTeaserGrid}>
            <div><h2>{t.playbookTitle}</h2><p>{t.playbookBody}</p><Link className={styles.textLink} href={playbooksHref}>{t.playbookLink} <ArrowUpRight size={18} /></Link></div>
            <div className={styles.playbookCovers}>
              {(["project-demand", "owned-demand", "international-buyers"] as const).map((topic, index) => <Link href={`${playbooksHref}?ausgabe=${["developer", "agent", "international"][index]}#anfrage`} key={topic} aria-label={t.coverNames[index]}><Image src={`/playbooks/covers/novalure-${topic}-${locale}.png`} alt={t.coverNames[index]} width={250} height={354} sizes="(max-width: 760px) 29vw, 15vw" /></Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.references} id="referenzen">
        <div className={styles.container}>
          <Reveal className={styles.sectionHead}><Eyebrow index="06">{t.referencesLabel}</Eyebrow><div className={styles.sectionHeadRow}><h2>{t.referencesTitle}</h2><p>{t.referencesIntro}</p></div></Reveal>
          <div className={styles.referenceGrid}>
            <Reveal className={styles.referenceMain}>
              <div className={styles.referencePhoto}><Image src="/images/visual-exterior-01.jpg" alt={t.referenceAlt} fill sizes="(max-width: 900px) 100vw, 60vw" /></div>
              <div className={styles.referenceCaption}><div><span>{t.referenceCaption}</span><h3>{t.referenceTitle}</h3></div><ArrowUpRight size={24} /></div>
            </Reveal>
            <Reveal className={styles.referenceSide}>
              <span className={styles.cardIndex}>{t.referenceSideLabel}</span>
              <blockquote>{t.referenceQuote}</blockquote>
              <p>{t.referenceBody}</p>
              <Link className={styles.textLink} href={playbooksHref}>{t.referenceLink} <ArrowUpRight size={18} /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.contact} id="kontakt">
        <div className={styles.container}>
          <Reveal className={styles.contactInner}>
            <Eyebrow index="07" light>{t.contactLabel}</Eyebrow>
            <h2>{t.contactTitle} <em>{t.contactAccent}</em></h2>
            <p>{t.contactBody}</p>
            <div className={styles.contactActions}><Link className={styles.buttonLight} href={contactHref}>{t.projectCheck} <ArrowUpRight size={18} /></Link><a className={styles.contactMail} href="mailto:hello@novalure.eu">hello@novalure.eu <ArrowUpRight size={16} /></a></div>
          </Reveal>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerIntro}>
              <a className={`${styles.brandWordmark} ${styles.footerBrand}`} href="#start" aria-label={t.toTop}><NovalureWordmark /></a>
              <p>{t.footerIntro}</p>
            </div>
            <nav className={styles.footerColumn} aria-label={t.discover}>
              <h3>{t.discover}</h3>
              <a href="#ansatz">{t.ourApproach}</a>
              <a href="#leistungen">{t.services}</a>
              <a href={`#${processAnchor}`}>{t.process}</a>
              <a href="#system">{t.theSystem}</a>
              <Link href={playbooksHref}>Playbooks</Link>
              <a href="#referenzen">{t.references}</a>
              <Link href={sitePath(locale, "developers", preview)}>{t.forDevelopers}</Link>
              <Link href={sitePath(locale, "agents", preview)}>{t.forAgents}</Link>
            </nav>
            <div className={styles.footerColumn}>
              <h3>{t.contact}</h3>
              <a href="mailto:hello@novalure.eu">hello@novalure.eu</a>
              <Link href={contactHref}>{t.projectCheck}</Link>
            </div>
            <div className={styles.footerColumn}>
              <h3>{t.howWeWork}</h3>
              <p>{t.howWeWorkBody}</p>
              <Link className={styles.footerAccentLink} href={homeHref}>{t.about} <ArrowUpRight size={15} /></Link>
            </div>
          </div>

          <a className={`${styles.brandWordmark} ${styles.footerWordmark}`} href="#start" aria-label={t.toTop}><NovalureWordmark /></a>

          <div className={styles.footerBottom}>
            <div>
              <p>© 2026 NovaLure. {t.copyright}</p>
              <p>NovaLure CLG · Registered in Ireland · Company no. 796735 · Dublin 2, Ireland.</p>
            </div>
            <nav aria-label={t.legalLabel}>
              <Link href={sitePath(locale, "imprint", preview)}>{t.imprint}</Link>
              <Link href={sitePath(locale, "privacy", preview)}>{t.privacy}</Link>
              <Link href={sitePath(locale, "cookies", preview)}>{t.cookies}</Link>
              <Link href={sitePath("en", "eula", preview)}>EULA</Link>
              <StaffLoginLink locale={locale} />
              {(["de", "en", "es"] as const).map((lang) => <Link key={lang} href={siteHome(lang, preview)} hrefLang={lang} aria-current={lang === locale ? "page" : undefined}>{lang.toUpperCase()}</Link>)}
              {preview && <a href="https://novalure.eu/de">{t.currentSite}</a>}
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
