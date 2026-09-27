import Link from "next/link";
import { CookieSettingsButton } from "@/components/relaunch/RelaunchInteractive";
import { getCrmAppUrl, getPath, type Locale } from "@/lib/i18n";

const copy = {
  en: { h: "LET'S MOVE YOUR PROJECT FORWARD.", cta: "Request Project Check", pages: "Navigate", legal: "Legal", region: "Ireland · DACH · UK · International", privacy: "Privacy", imprint: "Imprint", cookies: "Cookies", settings: "Cookie settings" },
  de: { h: "BRINGEN WIR IHR PROJEKT VORAN.", cta: "Projekt-Check anfragen", pages: "Navigation", legal: "Rechtliches", region: "Irland · DACH · UK · International", privacy: "Datenschutz", imprint: "Impressum", cookies: "Cookies", settings: "Cookie-Einstellungen" },
  es: { h: "HAGAMOS AVANZAR SU PROYECTO.", cta: "Solicitar análisis", pages: "Navegación", legal: "Legal", region: "Irlanda · DACH · UK · Internacional", privacy: "Privacidad", imprint: "Aviso legal", cookies: "Cookies", settings: "Configurar cookies" }
} as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const crmLabel = locale === "de" ? "CRM-Login" : locale === "es" ? "Acceso al CRM" : "CRM login";
  return (
    <footer className="nl-footer">
      <div className="nl-footer-cta"><h2>{t.h}</h2><Link className="nl-button is-light" href={`${getPath(locale,"contact")}#book-audit`}>{t.cta} →</Link></div>
      <div className="nl-footer-grid">
        <div><strong>NOVALURE</strong><p>Real estate demand, media and sales infrastructure — built as one system.</p><span>{t.region}</span></div>
        <nav aria-label={t.pages}><h3>{t.pages}</h3><Link href={`/${locale}/solutions`}>Solutions</Link><Link href={`/${locale}/work`}>Work</Link><Link href={`/${locale}/system`}>System</Link><Link href={`/${locale}/evelyn`}>Evelyn</Link><Link href={`/${locale}/insights`}>Insights</Link></nav>
        <nav aria-label={t.legal}><h3>{t.legal}</h3><Link href={getPath(locale,"imprint")}>{t.imprint}</Link><Link href={getPath(locale,"privacy")}>{t.privacy}</Link><Link href={getPath(locale,"cookies")}>{t.cookies}</Link><CookieSettingsButton>{t.settings}</CookieSettingsButton></nav>
        <div className="nl-footer-contact"><h3>Contact</h3><a href="mailto:hello@novalure.eu">hello@novalure.eu</a><a href="tel:+353892695248">+353 89 269 5248</a><Link href={getPath(locale,"playbooks")}>Playbooks →</Link><Link href={getPath(locale, "handover")} data-track="footer_system_example">CRM Demo →</Link><a href={getCrmAppUrl(locale)} target="_blank" rel="noreferrer" data-track="footer_crm_login">{crmLabel} →</a></div>
      </div>
      <div className="nl-footer-bottom"><span>© 2026 NovaLure · Dublin, Ireland</span><nav aria-label="Language"><Link href="/de">DE</Link><Link href="/en">EN</Link><Link href="/es">ES</Link></nav></div>
    </footer>
  );
}
