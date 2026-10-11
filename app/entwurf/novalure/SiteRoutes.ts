import { getPath, type Locale, type PageKey } from "@/lib/i18n";

export function siteHome(locale: Locale, preview: boolean) {
  return preview ? locale === "de" ? "/entwurf/novalure" : `/entwurf/novalure/${locale}` : getPath(locale, "home");
}

export function sitePath(locale: Locale, key: PageKey, preview: boolean) {
  return `${preview ? "/entwurf/novalure" : ""}${getPath(locale, key)}`;
}

export function sitePlaybookPath(locale: Locale, preview: boolean, edition?: string) {
  const path = sitePath(locale, "playbooks", preview);
  return edition ? `${path}?ausgabe=${edition}` : path;
}
