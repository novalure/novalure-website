export const playbookLocales = ["de", "en", "es"] as const;
export type PlaybookLocale = (typeof playbookLocales)[number];

export const playbookTypes = ["developer", "agent", "international"] as const;
export type PlaybookType = (typeof playbookTypes)[number];
export type PrimaryPlaybookType = Exclude<PlaybookType, "international">;
export type PlaybookKey = `${PlaybookLocale}-${PlaybookType}`;

export const privacyPolicyVersion = "2026-05";

type PlaybookMeta = {
  locale: PlaybookLocale;
  type: PlaybookType;
  pages: number;
  readingMinutes: number;
  title: string;
  cover: string;
  file: string;
};

export const playbooks: Record<PlaybookKey, PlaybookMeta> = {
  "de-developer": {
    locale: "de",
    type: "developer",
    pages: 10,
    readingMinutes: 9,
    title: "Projekt-Nachfrage",
    cover: "/playbooks/covers/novalure-project-demand-de.png",
    file: "/playbooks/novalure-project-demand-de.pdf"
  },
  "de-agent": {
    locale: "de",
    type: "agent",
    pages: 10,
    readingMinutes: 9,
    title: "Eigene Nachfrage",
    cover: "/playbooks/covers/novalure-owned-demand-de.png",
    file: "/playbooks/novalure-owned-demand-de.pdf"
  },
  "de-international": {
    locale: "de",
    type: "international",
    pages: 10,
    readingMinutes: 9,
    title: "Internationale Käufer",
    cover: "/playbooks/covers/novalure-international-buyers-de.png",
    file: "/playbooks/novalure-international-buyers-de.pdf"
  },
  "en-developer": {
    locale: "en",
    type: "developer",
    pages: 10,
    readingMinutes: 9,
    title: "Project Demand",
    cover: "/playbooks/covers/novalure-project-demand-en.png",
    file: "/playbooks/novalure-project-demand-en.pdf"
  },
  "en-agent": {
    locale: "en",
    type: "agent",
    pages: 10,
    readingMinutes: 9,
    title: "Owned Demand",
    cover: "/playbooks/covers/novalure-owned-demand-en.png",
    file: "/playbooks/novalure-owned-demand-en.pdf"
  },
  "en-international": {
    locale: "en",
    type: "international",
    pages: 10,
    readingMinutes: 9,
    title: "International Buyers",
    cover: "/playbooks/covers/novalure-international-buyers-en.png",
    file: "/playbooks/novalure-international-buyers-en.pdf"
  },
  "es-developer": {
    locale: "es",
    type: "developer",
    pages: 10,
    readingMinutes: 9,
    title: "Demanda de promociones",
    cover: "/playbooks/covers/novalure-project-demand-es.png",
    file: "/playbooks/novalure-project-demand-es.pdf"
  },
  "es-agent": {
    locale: "es",
    type: "agent",
    pages: 10,
    readingMinutes: 9,
    title: "Demanda propia",
    cover: "/playbooks/covers/novalure-owned-demand-es.png",
    file: "/playbooks/novalure-owned-demand-es.pdf"
  },
  "es-international": {
    locale: "es",
    type: "international",
    pages: 10,
    readingMinutes: 9,
    title: "Compradores internacionales",
    cover: "/playbooks/covers/novalure-international-buyers-es.png",
    file: "/playbooks/novalure-international-buyers-es.pdf"
  }
};

export function isPlaybookKey(value: unknown): value is PlaybookKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(playbooks, value);
}

export function getPrimaryPlaybookKey(locale: PlaybookLocale, role: PrimaryPlaybookType): PlaybookKey {
  return `${locale}-${role}`;
}

export function getInternationalPlaybookKey(locale: PlaybookLocale): PlaybookKey {
  return `${locale}-international`;
}

export function getSelectedPlaybookKeys(
  locale: PlaybookLocale,
  role: PrimaryPlaybookType,
  includeInternational: boolean
): PlaybookKey[] {
  return includeInternational
    ? [getPrimaryPlaybookKey(locale, role), getInternationalPlaybookKey(locale)]
    : [getPrimaryPlaybookKey(locale, role)];
}
