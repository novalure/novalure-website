export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type PageKey =
  | "home"
  | "developers"
  | "agents"
  | "playbooks"
  | "contact"
  | "imprint"
  | "privacy"
  | "cookies";

export const routeMap: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/en", de: "/de" },
  developers: { en: "/en/developers", de: "/de/bautraeger" },
  agents: { en: "/en/agents", de: "/de/makler" },
  playbooks: { en: "/en/playbooks", de: "/de/playbooks" },
  contact: { en: "/en/contact", de: "/de/kontakt" },
  imprint: { en: "/en/legal/imprint", de: "/de/rechtliches/impressum" },
  privacy: { en: "/en/legal/privacy", de: "/de/rechtliches/datenschutz" },
  cookies: { en: "/en/legal/cookies", de: "/de/rechtliches/cookies" }
};

export type NavigationItem =
  | { type: "route"; key: PageKey }
  | { type: "anchor"; key: "system" | "process" | "team"; href: Record<Locale, string> };

export const navigationItems: NavigationItem[] = [
  { type: "route", key: "developers" },
  { type: "route", key: "agents" },
  { type: "route", key: "playbooks" },
  { type: "anchor", key: "system", href: { en: "/en#system", de: "/de#system" } },
  { type: "anchor", key: "process", href: { en: "/en#process", de: "/de#prozess" } },
  { type: "anchor", key: "team", href: { en: "/en#team", de: "/de#team" } },
  { type: "route", key: "contact" }
];

export const legalKeys: PageKey[] = ["imprint", "privacy", "cookies"];
export const allPageKeys = Object.keys(routeMap) as PageKey[];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getPath(locale: Locale, key: PageKey) {
  return routeMap[key][locale];
}

export function getPageKey(locale: Locale, slug?: string[]): PageKey | null {
  const path = `/${locale}${slug?.length ? `/${slug.join("/")}` : ""}`;
  return allPageKeys.find((key) => routeMap[key][locale] === path) ?? null;
}

export function getLocalizedParams() {
  return allPageKeys.flatMap((key) =>
    locales.map((locale) => {
      const slug = routeMap[key][locale].replace(`/${locale}`, "").split("/").filter(Boolean);
      return { locale, slug };
    })
  );
}

export function getAlternates(locale: Locale, key: PageKey) {
  return {
    canonical: routeMap[key][locale],
    languages: {
      "en-US": routeMap[key].en,
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
    playbooks: "Playbooks",
    contact: "Contact",
    imprint: "Imprint",
    privacy: "Privacy",
    cookies: "Cookies"
  },
  de: {
    home: "Start",
    developers: "Bauträger",
    agents: "Makler",
    playbooks: "Leitfäden",
    contact: "Kontakt",
    imprint: "Impressum",
    privacy: "Datenschutz",
    cookies: "Cookies"
  }
};

export const anchorLabels: Record<Locale, Record<"system" | "process" | "team", string>> = {
  en: {
    system: "System",
    process: "Process",
    team: "Team"
  },
  de: {
    system: "System",
    process: "Prozess",
    team: "Team"
  }
};
