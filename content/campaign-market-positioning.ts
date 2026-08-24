import "@/content/spanish-market-positioning";
import { relaunchCopy } from "@/content/relaunch-copy";
import type { Locale } from "@/lib/i18n";

const campaignMarketCopy: Record<Locale, { d: string; g: string }> = {
  de: {
    d: "Zielgruppengenaue Kampagnen in DACH, der EU und ausgewählten internationalen Märkten.",
    g: "Reichweite bei kaufbereiten Zielgruppen – in DACH, europaweit und international, statt bei unverbindlichen Klicks."
  },
  en: {
    d: "Precisely targeted campaigns across Ireland, the UK, the EU and selected international markets.",
    g: "Reach among ready-to-buy audiences – in Ireland, the UK, across the EU and internationally, not low-intent clicks."
  },
  es: {
    d: "Campañas segmentadas para España, la Unión Europea y mercados internacionales seleccionados.",
    g: "Alcance entre públicos con intención real de compra, en España, en la UE y en mercados internacionales."
  }
};

(["de", "en", "es"] as const).forEach((locale) => {
  const steps = relaunchCopy[locale].steps as unknown as Array<{ n: string; t: string; d: string; g: string }>;
  const index = steps.findIndex((step) => step.n === "04");
  if (index >= 0) steps[index] = { ...steps[index], ...campaignMarketCopy[locale] };
});
