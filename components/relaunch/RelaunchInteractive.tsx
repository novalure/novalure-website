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
        <strong aria-label={locale === "de" ? "15 bis 20" : "15 to 20"}>
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

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      Array.from(root.children).forEach((element, index) => {
        element.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 420, delay: index * 65, easing: "cubic-bezier(.22,.8,.35,1)", fill: "both" }
        );
      });
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <ol className="v3-process-list" ref={rootRef}>
      {steps.map((step) => (
        <li key={step.n}>
          <span className="v3-step-number">{step.n}</span>
          <h3>{step.t}</h3>
          <p>{step.d}</p>
          <small><strong>{getLabel}</strong> {step.g}</small>
        </li>
      ))}
    </ol>
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
