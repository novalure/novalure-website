import Link from "next/link";
import { getCrmAppUrl, getPath, getPlaybookFormPath, legalKeys, navLabels, type Locale } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

const footerCopy = {
  en: {
    intro: "CRM-supported lead systems for real estate teams that need clearer enquiries, cleaner handovers and better sales priority.",
    contact: "Contact",
    pages: "Pages",
    newsletter: "Newsletter",
    newsletterText: "Practical marketing insights for developers – no spam, unsubscribe anytime.",
    newsletterCta: "Download playbook",
    projectCheck: "Project Check",
    crmLogin: "CRM login"
  },
  de: {
    intro: "CRM-gestützte Lead-Systeme für Immobilienteams, die klarere Anfragen, sauberere Übergaben und bessere Vertriebspriorität brauchen.",
    contact: "Kontakt",
    pages: "Seiten",
    newsletter: "Newsletter",
    newsletterText: "Konkrete Vermarktungs-Impulse für Bauträger – kein Spam, jederzeit abbestellbar.",
    newsletterCta: "Playbook herunterladen",
    projectCheck: "Projekt-Check",
    crmLogin: "CRM-Login"
  }
} as const;

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];
  const switchLocale = locale === "en" ? "de" : "en";

  return (
    <footer className="site-footer">
      <div className="footer-main footer-main-four">
        <div className="footer-brand">
          <Logo locale={locale} />
          <p>{copy.intro}</p>
        </div>

        <div className="footer-contact-column">
          <h2>{copy.contact}</h2>
          <a href="tel:+353892695248">+353 (0)89 269 5248</a>
          <a href="mailto:hello@novalure.eu">hello@novalure.eu</a>
        </div>

        <nav aria-label={copy.pages}>
          <h2>{copy.pages}</h2>
          <Link href={getPath(locale, "developers")}>{navLabels[locale].developers}</Link>
          <Link href={getPath(locale, "agents")}>{navLabels[locale].agents}</Link>
          <Link href={getPlaybookFormPath(locale)}>{navLabels[locale].playbooks}</Link>
          <Link href={`${getPath(locale, "contact")}#book-audit`}>{copy.projectCheck}</Link>
          <Link href={getPath(locale, "handover")}>{navLabels[locale].handover}</Link>
          <a href={getCrmAppUrl(locale)}>{copy.crmLogin}</a>
        </nav>

        <div className="footer-newsletter">
          <h2>{copy.newsletter}</h2>
          <p>{copy.newsletterText}</p>
          <Link className="footer-newsletter-link" href={getPlaybookFormPath(locale)}>
            {copy.newsletterCta}
          </Link>
        </div>
      </div>

      <div className="footer-bottom footer-bottom-redesign">
        <span>NovaLure CLG · Dublin, Ireland</span>
        <nav aria-label={locale === "de" ? "Rechtliche Links" : "Legal links"}>
          {legalKeys.map((key) => (
            <Link key={key} href={getPath(locale, key)}>{navLabels[locale][key]}</Link>
          ))}
        </nav>
        <Link href={getPath(switchLocale, "home")} hrefLang={switchLocale}>{switchLocale.toUpperCase()}</Link>
        <span>© 2026 NovaLure</span>
      </div>
    </footer>
  );
}
