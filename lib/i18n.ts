export const locales = ["en", "de", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const crmAppUrl = "https://novalure-crm.app";

export function getCrmAppUrl(_locale: Locale) {
  return crmAppUrl;
}

export type PageKey =
  | "home"
  | "developers"
  | "agents"
  | "playbooks"
  | "contact"
  | "handover"
  | "playbookThanks"
  | "auditThanks"
  | "imprint"
  | "privacy"
  | "cookies";

export const routeMap: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/en", de: "/de", es: "/es" },
  developers: { en: "/en/developers", de: "/de/bautraeger", es: "/es/promotores" },
  agents: { en: "/en/agents", de: "/de/makler", es: "/es/agencias-inmobiliarias" },
  playbooks: { en: "/en/playbooks", de: "/de/playbooks", es: "/es/playbooks" },
  contact: { en: "/en/contact", de: "/de/kontakt", es: "/es/analisis-del-proyecto" },
  handover: { en: "/en/system-example", de: "/de/systembeispiel", es: "/es/ejemplo-del-sistema" },
  playbookThanks: { en: "/en/playbooks/thank-you", de: "/de/playbooks/danke", es: "/es/playbooks/gracias" },
  auditThanks: { en: "/en/contact/thank-you", de: "/de/kontakt/danke", es: "/es/analisis-del-proyecto/gracias" },
  imprint: { en: "/en/legal/imprint", de: "/de/rechtliches/impressum", es: "/es/aviso-legal" },
  privacy: { en: "/en/legal/privacy", de: "/de/rechtliches/datenschutz", es: "/es/privacidad" },
  cookies: { en: "/en/legal/cookies", de: "/de/rechtliches/cookies", es: "/es/cookies" }
};

export type NavigationItem =
  | { type: "route"; key: PageKey }
  | { type: "anchor"; key: "proof" | "system"; href: Record<Locale, string> };

export const navigationItems: NavigationItem[] = [
  { type: "route", key: "home" },
  { type: "route", key: "developers" },
  { type: "route", key: "agents" },
  { type: "anchor", key: "proof", href: { en: "/en#proof", de: "/de#proof", es: "/es#proof" } },
  { type: "route", key: "playbooks" },
  { type: "route", key: "contact" }
];

export const legalKeys: PageKey[] = ["imprint", "privacy", "cookies"];
export const allPageKeys = Object.keys(routeMap) as PageKey[];

const routeAliases: Partial<Record<Locale, Partial<Record<string, PageKey>>>> = {
  de: {
    "/de/legal/privacy": "privacy"
  },
  es: {
    "/es/sistema": "handover",
    "/es/proceso": "home"
  }
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getPath(locale: Locale, key: PageKey) {
  return routeMap[key][locale];
}

export function getProcessAnchor(locale: Locale) {
  return locale === "es" ? "proceso" : "prozess";
}

export function getPlaybookFormPath(locale: Locale) {
  return `${getPath(locale, "playbooks")}#playbook-download`;
}

export function getPageKey(locale: Locale, slug?: string[]): PageKey | null {
  const path = `/${locale}${slug?.length ? `/${slug.join("/")}` : ""}`;
  const alias = routeAliases[locale]?.[path];
  if (alias) return alias;
  return allPageKeys.find((key) => routeMap[key][locale] === path) ?? null;
}

export function getLocalizedParams() {
  const canonicalParams = allPageKeys.flatMap((key) =>
    locales.map((locale) => {
      const slug = routeMap[key][locale].replace(`/${locale}`, "").split("/").filter(Boolean);
      return { locale, slug };
    })
  );

  const aliasParams = Object.entries(routeAliases).flatMap(([locale, aliases]) =>
    Object.keys(aliases || {}).map((path) => ({
      locale: locale as Locale,
      slug: path.replace(`/${locale}`, "").split("/").filter(Boolean)
    }))
  );

  return [...canonicalParams, ...aliasParams];
}

export function getAlternates(locale: Locale, key: PageKey) {
  return {
    canonical: routeMap[key][locale],
    languages: {
      "en-GB": routeMap[key].en,
      "de-DE": routeMap[key].de,
      "es-ES": routeMap[key].es,
      "x-default": routeMap[key].en
    }
  };
}

export const navLabels: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: "Home",
    developers: "Developers",
    agents: "Agents",
    playbooks: "Playbook",
    contact: "Project Check",
    handover: "System Example",
    playbookThanks: "Playbook requested",
    auditThanks: "Project Check requested",
    imprint: "Imprint",
    privacy: "Privacy",
    cookies: "Cookies"
  },
  de: {
    home: "Start",
    developers: "Bauträger",
    agents: "Makler",
    playbooks: "Playbook",
    contact: "Projekt-Check",
    handover: "Systembeispiel",
    playbookThanks: "Playbook angefordert",
    auditThanks: "Projekt-Check angefragt",
    imprint: "Impressum",
    privacy: "Datenschutz",
    cookies: "Cookies"
  },
  es: {
    home: "Inicio",
    developers: "Promotores",
    agents: "Agencias inmobiliarias",
    playbooks: "Playbook",
    contact: "Análisis del proyecto",
    handover: "Ejemplo del sistema",
    playbookThanks: "Playbook solicitado",
    auditThanks: "Análisis solicitado",
    imprint: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies"
  }
};

export const anchorLabels: Record<Locale, Record<"proof" | "system", string>> = {
  en: {
    proof: "Proof / examples",
    system: "System"
  },
  de: {
    proof: "Proof / Systembeispiele",
    system: "System"
  },
  es: {
    proof: "Referencias / ejemplos",
    system: "Sistema"
  }
};

export function localeValue<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale];
}
