import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import styles from "./ReferenceBrands.module.css";

const referenceLabels: Record<Locale, string> = {
  de: "Ausgewählte Referenzprojekte",
  en: "Selected reference projects",
  es: "Referencias de nuestros mandatos en el mercado DACH"
};

const vallisLinkLabels: Record<Locale, { ariaLabel: string; title: string }> = {
  de: {
    ariaLabel: "Website von Vallis Achen Residenzen besuchen; öffnet in einem neuen Tab",
    title: "Vallis Achen Residenzen besuchen"
  },
  en: {
    ariaLabel: "Visit the Vallis Achen Residenzen website; opens in a new tab",
    title: "Visit Vallis Achen Residenzen"
  },
  es: {
    ariaLabel: "Visitar la web de Vallis Achen Residenzen; se abre en una pestaña nueva",
    title: "Visitar Vallis Achen Residenzen"
  }
};

const preparationLabels: Record<Locale, { visible: string; explanation: string }> = {
  de: {
    visible: "Projektseite in Vorbereitung",
    explanation: "Projektseite in Vorbereitung; derzeit noch nicht verlinkt"
  },
  en: {
    visible: "Project page coming soon",
    explanation: "Project page coming soon; no link is available yet"
  },
  es: {
    visible: "Web del proyecto en preparación",
    explanation: "Web del proyecto en preparación; el enlace aún no está disponible"
  }
};

function HeiglHouseIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 44 50 6 92 44" />
        <path d="M22 36V94M78 36V94M22 68h56" />
      </g>
    </svg>
  );
}

function VallisLogo() {
  return (
    <Image
      className={styles.vallisLogo}
      src="/images/vallis-aachen-residenzen-logo.png"
      alt="Vallis Achen Residenzen"
      width={344}
      height={194}
      sizes="(max-width: 479px) 112px, 124px"
      priority
    />
  );
}

export function ReferenceBrands({ locale, kicker }: { locale: Locale; kicker: string }) {
  const vallisLink = vallisLinkLabels[locale];
  const preparation = preparationLabels[locale];

  return (
    <div className={`v3-reference-chip ${styles.frame}`}>
      <span>{kicker}</span>
      <div className={styles.grid} role="list" aria-label={referenceLabels[locale]}>
        <div className={`${styles.mark} ${styles.grasl}`} role="listitem" aria-label="GRASL Immobilien, Schwaz">
          <Image
            className={styles.graslLogo}
            src="/images/grasl-immobilien-logo-white.svg"
            alt="GRASL Immobilien"
            width={900}
            height={663}
            sizes="(max-width: 479px) 84px, 94px"
            priority
          />
        </div>

        <div className={styles.linkItem} role="listitem">
          <a
            className={`${styles.mark} ${styles.vallis} ${styles.linkedMark}`}
            href="https://vallis-achen.at/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={vallisLink.ariaLabel}
            title={vallisLink.title}
          >
            <VallisLogo />
          </a>
        </div>

        <div
          className={`${styles.mark} ${styles.preparationMark} ${styles.wildschoenau}`}
          role="listitem"
          aria-label={`Wildschönau Apartments. ${preparation.explanation}`}
          title={preparation.explanation}
        >
          <div className={styles.brandRow}>
            <strong>Wildschönau</strong>
            <span>Apartments</span>
          </div>
          <small className={styles.preparationStatus}>{preparation.visible}</small>
        </div>

        <div
          className={`${styles.mark} ${styles.preparationMark} ${styles.heigl}`}
          role="listitem"
          aria-label={`beim Heigl. ${preparation.explanation}`}
          title={preparation.explanation}
        >
          <div className={styles.brandRow}>
            <HeiglHouseIcon />
            <strong>beim Heigl</strong>
          </div>
          <small className={styles.preparationStatus}>{preparation.visible}</small>
        </div>
      </div>
    </div>
  );
}
