import { managedServiceCopy } from "@/content/managed-service-copy";
import type { Locale } from "@/lib/i18n";
import styles from "./DraftLegal.module.css";

export default function ManagedServiceBrief({ locale }: { locale: Locale }) {
  const copy = managedServiceCopy[locale];
  return <aside className={styles.serviceNote} aria-label={copy.noticeEyebrow}>
    <div className={styles.serviceNoteInner}>
      <span>{copy.noticeEyebrow}</span>
      <h2>{copy.noticeTitle}</h2>
      <p>{copy.noticeBody}</p>
    </div>
  </aside>;
}
