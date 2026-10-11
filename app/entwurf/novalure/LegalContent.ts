import { pages, type PageContent } from "@/content/pages";
import type { Locale, PageKey } from "@/lib/i18n";

export type DraftLegalKey = Extract<PageKey, "imprint" | "privacy" | "cookies" | "eula" | "vercelIntegrationEula">;

export const draftLegalKeys: DraftLegalKey[] = ["imprint", "privacy", "cookies", "eula", "vercelIntegrationEula"];

// The work-in-progress playbook form changed one privacy paragraph in the shared
// content. The draft legal pages reproduce the wording currently published on
// novalure.eu, as requested, without changing that separate form work.
const publishedPlaybookPrivacyItem: Record<Locale, string> = {
  de: "Bei Playbook-Anfragen verarbeiten wir Name, E-Mail, Unternehmen, Telefonnummer, ausgewähltes Playbook, Sprache, Seiten-URL, UTM-Parameter, erforderliche Verarbeitungseinwilligung, optionale Marketing-Einwilligung, Consent-Zeitstempel und die jeweils gültige Datenschutzversion.",
  en: "For playbook requests, we process name, email, company, phone number, selected playbook, language, page URL, UTM parameters, required processing consent, optional marketing consent, consent timestamp and the applicable privacy-policy version.",
  es: "Para Playbooks tratamos nombre, correo, empresa, teléfono, Playbook, idioma, URL, UTM, consentimiento obligatorio, consentimiento opcional de marketing, marca temporal y versión de la Política de privacidad."
};

export function getDraftLegalContent(locale: Locale, key: DraftLegalKey): PageContent {
  const content = pages[locale][key];
  if (key !== "privacy") return content;

  const sections = content.sections?.map((section) => {
    if (!section.title.startsWith("7.")) return section;
    return {
      ...section,
      items: section.items?.map((item, index) => index === 0 ? publishedPlaybookPrivacyItem[locale] : item)
    };
  });

  return { ...content, sections };
}
