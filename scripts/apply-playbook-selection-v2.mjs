import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function replaceRequired(file, previous, replacement, expectedCount = 1) {
  const absolute = path.join(root, file);
  let source = fs.readFileSync(absolute, "utf8");
  const count = source.split(previous).length - 1;

  if (count === 0 && source.includes(replacement)) {
    console.log(`${file}: replacement already present`);
    return;
  }
  if (count !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} occurrence(s), found ${count}: ${previous.slice(0, 120)}`);
  }

  source = source.replace(previous, replacement);
  fs.writeFileSync(absolute, source, "utf8");
  console.log(`${file}: updated`);
}

replaceRequired(
  "components/MarketingPage.tsx",
  'import { playbooks, type Cta, type HomeContent, type PageContent } from "@/content/pages";',
  'import { type Cta, type HomeContent, type PageContent } from "@/content/pages";\nimport { playbookCatalog as playbooks } from "@/content/playbook-catalog";'
);

replaceRequired(
  "components/MarketingPage.tsx",
  'import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholders";',
  'import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholdersV2";'
);

replaceRequired(
  "components/MarketingPage.tsx",
  '        title={localeCopy(locale, "Two playbooks. One goal: better conversations from existing demand.", "Zwei Playbooks. Ein Ziel: bessere Gespräche aus vorhandener Nachfrage.", "Dos Playbooks. Un objetivo: mejores conversaciones a partir de la demanda existente.")}',
  '        title={localeCopy(locale, "Three playbooks. One goal: better conversations from the demand you create.", "Drei Playbooks. Ein Ziel: bessere Gespräche aus der Nachfrage, die Sie erzeugen.", "Tres Playbooks. Un objetivo: mejores conversaciones a partir de la demanda que genera.")}'
);

replaceRequired(
  "components/MarketingPage.tsx",
  '      <PlaybookConversion\n        locale={content.locale}\n        title={localeCopy(content.locale, "Download the playbook, then request a check if the problem is concrete.", "Laden Sie das Playbook, dann fragen Sie bei konkretem Problem den Projekt-Check an.", "Descargue el Playbook y solicite un análisis cuando el problema sea concreto.")}',
  '      <PlaybookConversion\n        locale={content.locale}\n        defaultRole={content.key === "agents" ? "agent" : "developer"}\n        title={localeCopy(content.locale, "Download the playbook, then request a check if the problem is concrete.", "Laden Sie das Playbook, dann fragen Sie bei konkretem Problem den Projekt-Check an.", "Descargue el Playbook y solicite un análisis cuando el problema sea concreto.")}'
);

replaceRequired(
  "components/MarketingPage.tsx",
  'function PlaybookConversion({ locale, title, body }: { locale: Locale; title: string; body: string }) {\n  return <PlaybookHub locale={locale} title={title} body={body} eyebrow={localeCopy(locale, "Secondary funnel", "Secondary Funnel", "Recurso complementario")} />;\n}',
  'function PlaybookConversion({\n  locale,\n  title,\n  body,\n  defaultRole = "developer"\n}: {\n  locale: Locale;\n  title: string;\n  body: string;\n  defaultRole?: "developer" | "agent";\n}) {\n  return <PlaybookHub locale={locale} title={title} body={body} defaultRole={defaultRole} eyebrow={localeCopy(locale, "Secondary funnel", "Secondary Funnel", "Recurso complementario")} />;\n}'
);

replaceRequired(
  "components/MarketingPage.tsx",
  'function PlaybookHub({ locale, title, body, eyebrow, id }: { locale: Locale; title: string; body: string; eyebrow?: string; id?: string }) {',
  'function PlaybookHub({ locale, title, body, eyebrow, id, defaultRole = "developer" }: { locale: Locale; title: string; body: string; eyebrow?: string; id?: string; defaultRole?: "developer" | "agent" }) {'
);

replaceRequired(
  "components/MarketingPage.tsx",
  '<span className="pill">{playbook.key === "developer" ? localeCopy(locale, "Developers", "Bauträger", "Promotores") : localeCopy(locale, "Agents", "Makler", "Agencias inmobiliarias")}</span>',
  '<span className="pill">{playbook.audience}</span>'
);

replaceRequired(
  "components/MarketingPage.tsx",
  '<HubSpotForm locale={locale} playbook="developer" selectable />',
  '<HubSpotForm locale={locale} playbook={defaultRole} selectable />'
);

replaceRequired(
  "components/relaunch/RelaunchHomePageManaged.tsx",
  'import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholders";',
  'import { HubSpotForm, HubSpotMeetingEmbed } from "@/components/HubSpotPlaceholdersV2";'
);

console.log("Playbook selection v2 source patches applied successfully.");
