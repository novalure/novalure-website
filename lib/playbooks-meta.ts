export type PlaybookKey = "de-developer" | "de-agent" | "en-developer" | "en-agent" | "es-developer" | "es-agent";

export const privacyPolicyVersion = "2026-05";

export const playbooks: Record<PlaybookKey, {
  pages: number;
  readingMinutes: number;
  cover: string;
  file: string;
}> = {
  "de-developer": { pages: 12, readingMinutes: 8, cover: "/playbooks/covers/bautraeger-de-cover.png", file: "/playbooks/bautraeger-pipeline-playbook-de.pdf" },
  "de-agent": { pages: 12, readingMinutes: 8, cover: "/playbooks/covers/makler-de-cover.png", file: "/playbooks/makler-lead-playbook-de.pdf" },
  "en-developer": { pages: 12, readingMinutes: 8, cover: "/playbooks/covers/developer-en-cover.png", file: "/playbooks/developer-pipeline-playbook-en.pdf" },
  "en-agent": { pages: 12, readingMinutes: 8, cover: "/playbooks/covers/agent-en-cover.png", file: "/playbooks/real-estate-agent-lead-playbook-en.pdf" },
  "es-developer": { pages: 12, readingMinutes: 8, cover: "/playbooks/covers/promotores-es-cover.png", file: "/playbooks/novalure-playbook-promotores-es.pdf" },
  "es-agent": { pages: 12, readingMinutes: 8, cover: "/playbooks/covers/agencias-es-cover.png", file: "/playbooks/novalure-playbook-agencias-inmobiliarias-es.pdf" }
};
