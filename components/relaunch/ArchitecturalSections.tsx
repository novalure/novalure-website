import Image from "next/image";
import { architecturalCopy } from "@/content/architectural-copy";
import { relaunchCopy } from "@/content/relaunch-copy";
import type { Locale } from "@/lib/i18n";
import { ReferenceBrands } from "./ReferenceBrands";

export function ProjectShowcase({ locale }: { locale: Locale }) {
  const t = architecturalCopy[locale];
  const original = relaunchCopy[locale];

  return (
    <section className="v3-section ai-showcase" id="projects" data-reveal>
      <div className="ai-showcase-heading">
        <p className="v3-kicker"><span aria-hidden="true" />{original.chipKicker}</p>
        <h2>{t.projectTitle}</h2>
        <p>{t.projectIntro}</p>
      </div>
      <div className="ai-showcase-layout">
        <figure className="ai-showcase-visual">
          <Image
            src="/images/visual-exterior-01.jpg"
            alt={t.projectVisualNote}
            fill
            sizes="(min-width: 1100px) 65vw, 100vw"
          />
          <figcaption>
            <span>{t.sampleVisual}</span>
            <strong>{t.projectVisualTitle}</strong>
            <small>{t.projectVisualNote}</small>
          </figcaption>
        </figure>
        <div className="ai-showcase-references">
          <ReferenceBrands locale={locale} kicker={original.chipKicker} />
        </div>
      </div>
    </section>
  );
}

export function FounderSection({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const architectural = architecturalCopy[locale];

  return (
    <section className="v3-section ai-founder" id="team" data-reveal>
      <div className="ai-founder-portrait">
        <Image
          src="/team/franz-romih.jpg"
          alt="Franz Romih"
          fill
          sizes="(min-width: 900px) 34vw, 100vw"
        />
      </div>
      <div className="ai-founder-copy">
        <p className="v3-kicker"><span aria-hidden="true" />{t.teamKicker}</p>
        <h2>{t.teamH}</h2>
        <p>{t.teamBody}</p>
        <div className="ai-founder-signature">
          <strong>Franz Romih</strong>
          <span>{architectural.founderRole}</span>
        </div>
      </div>
    </section>
  );
}
