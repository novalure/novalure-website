"use client";

import { usePathname } from "next/navigation";
import { managedServiceCopy } from "@/content/managed-service-copy";
import { getPath, type Locale } from "@/lib/i18n";

const relevantPageKeys = ["developers", "agents", "playbooks", "contact", "handover"] as const;

export function ManagedServiceNotice({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const shouldRender = relevantPageKeys.some((key) => getPath(locale, key) === pathname);

  if (!shouldRender) return null;

  const copy = managedServiceCopy[locale];

  return (
    <aside className="proof-section compact-proof" aria-labelledby={`managed-service-${locale}`}>
      <div className="section-heading narrow">
        <p className="eyebrow">{copy.noticeEyebrow}</p>
        <h2 id={`managed-service-${locale}`}>{copy.noticeTitle}</h2>
        <p>{copy.noticeBody}</p>
      </div>
      <article className="content-section">
        <p>{copy.noticeIntegration}</p>
      </article>
    </aside>
  );
}
