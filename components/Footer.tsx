import Link from "next/link";
import { anchorLabels, getPath, getPlaybookFormPath, legalKeys, navLabels, navigationItems, type Locale } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

const footerCopy = {
  en: {
    intro: "CRM-ready lead systems for real estate teams that need clearer enquiries, cleaner handovers and better sales priority.",
    email: "Email",
    phone: "Phone",
    resources: "Pages",
    legal: "Legal"
  },
  de: {
    intro: "CRM-fähige Lead-Systeme für den Immobilienvertrieb, der weniger unklare Anfragen und bessere Sales-Priorisierung braucht.",
    email: "E-Mail",
    phone: "Telefon",
    resources: "Seiten",
    legal: "Rechtliches"
  }
};

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo locale={locale} />
          <p>{copy.intro}</p>
          <div className="footer-contact">
            <a href="mailto:hello@novalure.eu">{copy.email}: hello@novalure.eu</a>
            <a href="tel:+353892695248">{copy.phone}: +353 (0)89 269 5248</a>
          </div>
        </div>
        <nav aria-label={copy.resources}>
          <h2>{copy.resources}</h2>
          {navigationItems.map((item) => (
            <Link
              key={item.type === "route" ? item.key : item.key}
              href={item.type === "route" ? item.key === "playbooks" ? getPlaybookFormPath(locale) : getPath(locale, item.key) : item.href[locale]}
            >
              {item.type === "route" ? navLabels[locale][item.key] : anchorLabels[locale][item.key]}
            </Link>
          ))}
          <Link href={getPath(locale, "handover")}>{navLabels[locale].handover}</Link>
        </nav>
        <nav aria-label={copy.legal}>
          <h2>{copy.legal}</h2>
          {legalKeys.map((key) => (
            <Link key={key} href={getPath(locale, key)}>{navLabels[locale][key]}</Link>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NovaLure</span>
        <span>NovaLure CLG · Dublin, Ireland</span>
      </div>
    </footer>
  );
}
