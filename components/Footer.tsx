import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CookieSettingsButton } from "@/components/relaunch/RelaunchInteractive";
import { relaunchCopy } from "@/content/relaunch-copy";
import { getCrmAppUrl, getPath, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = relaunchCopy[locale];
  const homePath = getPath(locale, "home");
  const anchor = (id: string) => `${homePath}#${id}`;

  return (
    <footer className="site-footer v3-site-footer">
      <div className="v3-footer-main">
        <div className="v3-footer-brand">
          <Logo locale={locale} />
          <p>{t.footTag}</p>
          <a href="mailto:hello@novalure.eu">hello@novalure.eu</a>
          <a href="tel:+353892695248">+353 89 269 5248</a>
        </div>

        <nav aria-label={t.footPages}>
          <h2>{t.footPages}</h2>
          <Link href={getPath(locale, "developers")}>{t.navA}</Link>
          <Link href={getPath(locale, "agents")}>{t.navB}</Link>
          <Link href={anchor("prozess")}>{t.navC}</Link>
          <Link href={getPath(locale, "handover")}>{t.navD}</Link>
          <Link href={getPath(locale, "playbooks")}>{t.navE}</Link>
          <Link href={getPath(locale, "contact")}>{t.cta}</Link>
          <a href={getCrmAppUrl(locale)} target="_blank" rel="noreferrer" data-track="footer_crm_login">{t.login}</a>
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
          <small>{locale === "de" ? "Optionales Update-Opt-in wird per E-Mail bestätigt." : "Optional updates opt-in is confirmed by email."}</small>
        </div>
      </div>

      <div className="v3-footer-bottom">
        <span>© 2026 NovaLure · Dublin, Ireland</span>
        <nav className="v3-footer-languages" aria-label={locale === "de" ? "Sprache" : "Language"}>
          <Link className={locale === "de" ? "is-active" : ""} href={getPath("de", "home")} hrefLang="de">DE</Link>
          <Link className={locale === "en" ? "is-active" : ""} href={getPath("en", "home")} hrefLang="en">EN</Link>
        </nav>
      </div>
    </footer>
  );
}
