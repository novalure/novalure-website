import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import styles from "./ReferenceBrands.module.css";

const referenceLabels: Record<Locale, string> = {
  de: "Ausgewählte Referenzprojekte",
  en: "Selected reference projects",
  es: "Proyectos de referencia seleccionados"
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

export function ReferenceBrands({ locale, kicker }: { locale: Locale; kicker: string }) {
  return (
    <div className={`v3-reference-chip ${styles.frame}`}>
      <span>{kicker}</span>
      <div className={styles.grid} role="list" aria-label={referenceLabels[locale]}>
        <div className={`${styles.mark} ${styles.grasl}`} role="listitem" aria-label="GRASL Immobilien, Schwaz">
          <strong>GRASL</strong>
          <span>Immobilien</span>
          <small>Schwaz</small>
        </div>

        <div className={`${styles.mark} ${styles.vallis}`} role="listitem" aria-label="Vallis Achen Residenzen">
          <Image
            className={styles.vallisLogo}
            src="/images/vallis-aachen-residenzen-logo.png"
            alt="Vallis Achen Residenzen"
            width={344}
            height={194}
            sizes="(max-width: 479px) 112px, 124px"
            priority
          />
        </div>

        <div className={`${styles.mark} ${styles.wildschoenau}`} role="listitem" aria-label="Wildschönau Apartments">
          <strong>Wildschönau</strong>
          <span>Apartments</span>
        </div>

        <div className={`${styles.mark} ${styles.heigl}`} role="listitem" aria-label="beim Heigl">
          <HeiglHouseIcon />
          <strong>beim Heigl</strong>
        </div>
      </div>
    </div>
  );
}
