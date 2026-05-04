import Link from "next/link";
import { anchorLabels, getPath, legalKeys, navLabels, navigationItems, type Locale } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

const footerCopy = {
  en: {
    intro: "PropTech Sales System for developers and agents who need qualified demand, clean handovers and pipeline visibility.",
    cta: "Book Pipeline Audit",
    email: "Email",
    phone: "Phone",
    resources: "Pages",
    legal: "Legal"
  },
  de: {
    intro: "PropTech Sales System für Bauträger und Makler, die qualifizierte Nachfrage, klare Übergaben und Pipeline-Sichtbarkeit brauchen.",
    cta: "Pipeline-Audit buchen",
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
          <Link className="button button-primary" href={`${getPath(locale, "contact")}#book-audit`}>{copy.cta}</Link>
        </div>
        <nav aria-label={copy.resources}>
          <h2>{copy.resources}</h2>
          {navigationItems.map((item) => (
            <Link
              key={item.type === "route" ? item.key : item.key}
              href={item.type === "route" ? getPath(locale, item.key) : item.href[locale]}
            >
              {item.type === "route" ? navLabels[locale][item.key] : anchorLabels[locale][item.key]}
            </Link>
          ))}
        </nav>
        <nav aria-label={copy.legal}>
          <h2>{copy.legal}</h2>
          {legalKeys.map((key) => (
            <Link key={key} href={getPath(locale, key)}>{navLabels[locale][key]}</Link>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Novalure</span>
        <span>Novalure CLG · Dublin, Ireland</span>
      </div>
    </footer>
  );
}
