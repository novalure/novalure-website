export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const crmAppUrls: Record<Locale, string> = {
  en: "https://www.novalure-crm.app/login?lang=en",
  de: "https://www.novalure-crm.app/login?lang=de"
};

export function getCrmAppUrl(locale: Locale) {
  return crmAppUrls[locale];
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
  home: { en: "/en", de: "/de" },
  developers: { en: "/en/developers", de: "/de/bautraeger" },
  agents: { en: "/en/agents", de: "/de/makler" },
  playbooks: { en: "/en/playbooks", de: "/de/playbooks" },
  contact: { en: "/en/contact", de: "/de/kontakt" },
  handover: { en: "/en/real-estate-crm-handover", de: "/de/immobilien-crm-handover" },
  playbookThanks: { en: "/en/playbooks/thank-you", de: "/de/playbooks/danke" },
  auditThanks: { en: "/en/contact/thank-you", de: "/de/kontakt/danke" },
  imprint: { en: "/en/legal/imprint", de: "/de/rechtliches/impressum" },
  privacy: { en: "/en/legal/privacy", de: "/de/rechtliches/datenschutz" },
  cookies: { en: "/en/legal/cookies", de: "/de/rechtliches/cookies" }
};

export type NavigationItem =
  | { type: "route"; key: PageKey }
  | { type: "anchor"; key: "proof" | "system"; href: Record<Locale, string> };

export const navigationItems: NavigationItem[] = [
  { type: "route", key: "home" },
  { type: "route", key: "developers" },
  { type: "route", key: "agents" },
  { type: "anchor", key: "proof", href: { en: "/en#proof", de: "/de#proof" } },
  { type: "route", key: "playbooks" },
  { type: "route", key: "contact" }
];

export const legalKeys: PageKey[] = ["imprint", "privacy", "cookies"];
export const allPageKeys = Object.keys(routeMap) as PageKey[];

const routeAliases: Partial<Record<Locale, Partial<Record<string, PageKey>>>> = {
  de: {
    "/de/legal/privacy": "privacy"
  }
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getPath(locale: Locale, key: PageKey) {
  return routeMap[key][locale];
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
    handover: "CRM Handover",
    playbookThanks: "Playbook requested",
    auditThanks: "Audit requested",
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
    handover: "CRM-Handover",
    playbookThanks: "Playbook angefordert",
    auditThanks: "Audit angefragt",
    imprint: "Impressum",
    privacy: "Datenschutz",
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
  }
};
