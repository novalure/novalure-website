import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CookieSettingsButton } from "@/components/relaunch/RelaunchInteractive";
import { managedServiceCopy } from "@/content/managed-service-copy";
import { relaunchCopy } from "@/content/relaunch-copy";
import { getPath, getProcessAnchor, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const managed = managedServiceCopy[locale];
  const homePath = getPath(locale, "home");
  const anchor = (id: string) => `${homePath}#${id}`;

  return (
    <footer className="site-footer v3-site-footer">
      <div className="v3-footer-main">
        <div className="v3-footer-brand">
          <Logo locale={locale} />
          <p>{t.footTag}</p>
          <small>{managed.footerNote}</small>
          <a href="mailto:hello@novalure.eu">hello@novalure.eu</a>
          <a href="tel:+353892695248">+353 89 269 5248</a>
        </div>

        <nav aria-label={t.footPages}>
          <h2>{t.footPages}</h2>
          <Link href={getPath(locale, "developers")}>{t.navA}</Link>
          <Link href={getPath(locale, "agents")}>{t.navB}</Link>
          <Link href={anchor(getProcessAnchor(locale))}>{t.navC}</Link>
          <Link href={getPath(locale, "handover")}>{t.navD}</Link>
          <Link href={getPath(locale, "playbooks")}>{t.navE}</Link>
          <Link href={getPath(locale, "contact")}>{t.cta}</Link>
          <Link href={getPath(locale, "handover")} data-track="footer_system_example">{managed.navLabel}</Link>
        </nav>

        <nav aria-label={t.footLegal}>
          <h2>{t.footLegal}</h2>
          <Link href={getPath(locale, "imprint")}>{t.imprint}</Link>
          <Link href={getPath(locale, "privacy")}>{t.privacy}</Link>
          <Link href={getPath(locale, "cookies")}>{t.cookies}</Link>
          <CookieSettingsButton>{t.ckSettingsLabel}</CookieSettingsButton>
        </nav>

        <div className="v3-footer-newsletter">
          <h2>{t.pbKicker}</h2>
          <p>{t.pbBody}</p>
          <Link className="v3-button v3-button-primary" href={getPath(locale, "playbooks")}>{t.pbBtn}</Link>
          <small>{locale === "de" ? "Optionales Update-Opt-in wird per E-Mail bestätigt." : locale === "es" ? "La suscripción opcional se confirma por correo electrónico." : "Optional updates opt-in is confirmed by email."}</small>
        </div>
      </div>

      <div className="v3-footer-bottom">
        <span>© 2026 NovaLure · Dublin, Ireland</span>
        <nav className="v3-footer-languages" aria-label={locale === "de" ? "Sprache" : locale === "es" ? "Idioma" : "Language"}>
          <Link className={locale === "de" ? "is-active" : ""} href={getPath("de", "home")} hrefLang="de">DE</Link>
          <Link className={locale === "en" ? "is-active" : ""} href={getPath("en", "home")} hrefLang="en">EN</Link>
          <Link className={locale === "es" ? "is-active" : ""} href={getPath("es", "home")} hrefLang="es">ES</Link>
        </nav>
      </div>
    </footer>
  );
}
