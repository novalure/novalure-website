"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

export function ProjectCheckLink({
  children,
  className,
  projectType,
  track
}: {
  children: React.ReactNode;
  className?: string;
  projectType?: "developers" | "agents";
  track?: string;
}) {
  function selectProjectType() {
    if (!projectType) return;
    window.dispatchEvent(new CustomEvent("novalure:project-type", { detail: projectType }));
  }

  return (
    <a className={className} href="#kontakt" data-track={track} onClick={selectProjectType}>
      {children}
    </a>
  );
}

export function CookieSettingsButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="v3-footer-link-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event("novalure:open-cookie-settings"))}
    >
      {children}
    </button>
  );
}

export function SectionReveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".relaunch-home [data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 500, easing: "cubic-bezier(.22,.8,.35,1)", fill: "both" }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function ProofCounters({ locale, firstLabel, secondLabel }: { locale: Locale; firstLabel: string; secondLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState({ lower: 15, upper: 20, volume: 110 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let started = false;

    function reveal() {
      if (started) return;
      started = true;

      if (reduceMotion) {
        setValues({ lower: 15, upper: 20, volume: 110 });
        return;
      }

      setValues({ lower: 0, upper: 0, volume: 0 });
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = easeOutCubic(progress);
        setValues({
          lower: Math.round(15 * eased),
          upper: Math.round(20 * eased),
          volume: Math.round(110 * eased)
        });
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="v3-proof-stats" ref={rootRef}>
      <div>
        <strong aria-label={locale === "de" ? "15 bis 20" : locale === "es" ? "de 15 a 20" : "15 to 20"}>
          {values.lower}–{values.upper}
        </strong>
        <span>{firstLabel}</span>
      </div>
      <div>
        <strong>EUR {values.volume}k+</strong>
        <span>{secondLabel}</span>
      </div>
    </div>
  );
}

export function ProcessSteps({
  steps,
  getLabel
}: {
  steps: ReadonlyArray<{ readonly n: string; readonly t: string; readonly d: string; readonly g: string }>;
  getLabel: string;
}) {
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("is-motion-ready");

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      root.classList.add("is-active");
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(root);
    return () => {
      observer.disconnect();
      root.classList.remove("is-motion-ready", "is-active");
    };
  }, []);

  return (
    <ol className="v3-process-list" ref={rootRef}>
      {steps.map((step, index) => (
        <li key={step.n}>
          <ProcessVisual index={index} />
          <span className="v3-step-number">{step.n}</span>
          <h3>{step.t}</h3>
          <p>{step.d}</p>
          <small><strong>{getLabel}</strong> {step.g}</small>
        </li>
      ))}
    </ol>
  );
}

export function ProcessStory({
  steps,
  getLabel
}: {
  steps: ReadonlyArray<{ readonly n: string; readonly t: string; readonly d: string; readonly g: string }>;
  getLabel: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-process-step]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!(visible?.target instanceof HTMLElement)) return;
        setActiveIndex(Number(visible.target.dataset.processStep || 0));
      },
      { rootMargin: "-28% 0px -38%", threshold: [0.15, 0.4, 0.7] }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="v4-process-story" ref={rootRef}>
      <aside className="v4-process-stage" aria-hidden="true">
        <div className="v4-process-stage-inner" key={activeIndex}>
          <span>{steps[activeIndex].n}</span>
          <ProcessVisual index={activeIndex} />
          <p>{steps[activeIndex].t}</p>
        </div>
        <div className="v4-process-progress"><i style={{ height: `${((activeIndex + 1) / steps.length) * 100}%` }} /></div>
      </aside>
      <ol className="v4-process-steps">
        {steps.map((step, index) => (
          <li className={activeIndex === index ? "is-active" : ""} data-process-step={index} key={step.n}>
            <div className="v4-process-mobile-visual"><ProcessVisual index={index} /></div>
            <span>{step.n}</span>
            <h3>{step.t}</h3>
            <p>{step.d}</p>
            <small><strong>{getLabel}</strong> {step.g}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProcessVisual({ index }: { index: number }) {
  const common = {
    className: `v3-process-visual v3-process-visual-${index + 1}`,
    viewBox: "0 0 120 76",
    "aria-hidden": true,
    focusable: false
  } as const;

  if (index === 0) {
    return (
      <svg {...common}>
        <g className="v3-visual-enter">
          <path className="v3-icon-fill" d="M30 35 64 22v32L30 43Z" />
          <path className="v3-icon-line" d="M30 35 64 22v32L30 43Zm0 0h-9v8h9m8 3 4 12h9l-6-15" />
          <path className="v3-sound-wave wave-one" d="M72 30c5 4 5 12 0 16" />
          <path className="v3-sound-wave wave-two" d="M81 24c10 8 10 20 0 28" />
          <path className="v3-sound-wave wave-three" d="M91 18c16 12 16 28 0 40" />
        </g>
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg {...common}>
        <circle className="v3-draw-dot" cx="21" cy="58" r="2.5" />
        <path className="v3-architect-line" pathLength="1" d="M21 58V39l20-17 17 12V19h13v26l13 11V28h14v30H21Zm11 0V43h15v15m14 0V43h10v15m19-20h8m-8 8h8" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg {...common}>
        <g className="v3-visual-enter v3-book-base">
          <path className="v3-icon-fill" d="M24 21h34c6 0 10 4 10 10v33H34c-6 0-10-4-10-10H24Z" />
          <path className="v3-icon-line" d="M24 21h34c6 0 10 4 10 10v33H34c-6 0-10-4-10-10H24Zm44 10c0-6 4-10 10-10h18v43H68" />
          <path className="v3-book-detail" d="M35 38h20m-20 7h16m28-7h9m-9 7h9" />
        </g>
        <path className="v3-book-page page-one" d="M68 31c0-6 4-10 10-10h18v43H68Z" />
        <path className="v3-book-page page-two" d="M68 31c0-6 4-10 10-10h12v36l-22 7Z" />
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg {...common}>
        <g className="v3-campaign-links"><path d="M60 38 29 19m31 19 31-19M60 38 29 58m31-20 31 20" /></g>
        <g className="v3-campaign-center">
          <circle className="v3-icon-fill" cx="60" cy="38" r="10" />
          <circle className="v3-icon-line" cx="60" cy="38" r="5" />
          <circle className="v3-icon-dot" cx="60" cy="38" r="2" />
        </g>
        <g className="v3-channel channel-google" transform="translate(20 10)"><circle cx="9" cy="9" r="9" /><text x="9" y="13">G</text></g>
        <g className="v3-channel channel-instagram" transform="translate(82 10)"><rect width="18" height="18" rx="5" /><circle cx="9" cy="9" r="4" /><circle className="v3-icon-dot" cx="14" cy="4" r="1.2" /></g>
        <g className="v3-channel channel-facebook" transform="translate(20 49)"><circle cx="9" cy="9" r="9" /><text x="9" y="14">f</text></g>
        <g className="v3-channel channel-openai" transform="translate(82 49)"><circle cx="9" cy="9" r="9" /><path d="m5.5 7 3.5-2 3.5 2v4L9 13l-3.5-2Zm0 0L9 9m3.5-2L9 9m0 4V9" /></g>
      </svg>
    );
  }

  if (index === 4) {
    return (
      <svg {...common}>
        <g className="v3-lead-card v3-visual-enter">
          <rect className="v3-icon-fill" x="14" y="22" width="36" height="38" rx="5" />
          <circle className="v3-icon-line" cx="26" cy="35" r="5" />
          <path className="v3-icon-line" d="M19 50c3-7 12-7 15 0m7-15h4m-4 7h4" />
        </g>
        <path className="v3-follow-line" pathLength="1" d="M50 41h11m10 0h8m10 0h8" />
        <g className="v3-follow-icon follow-chat"><path d="M59 32h14v12H66l-4 4v-4h-3Z" /><circle className="v3-icon-dot" cx="64" cy="38" r="1" /><circle className="v3-icon-dot" cx="68" cy="38" r="1" /></g>
        <g className="v3-follow-icon follow-phone"><path d="M78 33c1 8 5 12 13 14l3-5-5-2-2 2c-3-1-5-3-6-6l2-2-2-4Z" /></g>
        <g className="v3-follow-icon follow-mail"><rect x="96" y="33" width="17" height="13" rx="2" /><path d="m97 35 7.5 6 7.5-6" /></g>
        <g className="v3-qualified-check"><circle cx="104" cy="56" r="8" /><path d="m100 56 3 3 6-7" /></g>
      </svg>
    );
  }

  return (
    <svg {...common}>
      <g className="v3-celebration v3-visual-enter">
        <path className="v3-icon-fill" d="m35 48 10-22 18 18-22 10Z" />
        <path className="v3-icon-line" d="m35 48 10-22 18 18-22 10Zm10-22c3 8 10 15 18 18" />
        <path className="v3-success-check" d="m70 50 5 5 10-12" />
      </g>
      <g className="v3-confetti">
        <path d="m67 29 5-7m2 13 9-2M62 21l-1-8m20 11 6-6" />
        <circle cx="91" cy="34" r="2" />
      </g>
    </svg>
  );
}

export function FaqAccordion({
  items,
  locale
}: {
  items: ReadonlyArray<{ readonly q: string; readonly a: string }>;
  locale: Locale;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="v3-faq-list">
      {items.map((item, index) => {
        const open = openIndex === index;
        const answerId = `v3-faq-answer-${locale}-${index}`;
        return (
          <article className={open ? "is-open" : ""} key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={answerId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span>{item.q}</span>
                <span className="v3-faq-plus" aria-hidden="true">+</span>
              </button>
            </h3>
            <div className="v3-faq-answer" id={answerId} hidden={!open}>
              <p>{item.a}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
