import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { getPath, isLocale, locales, type Locale } from "@/lib/i18n";
import DraftLegal from "../../DraftLegal";
import DraftContact from "../../DraftContact";
import DraftPlaybooks from "../../DraftPlaybooks";
import DraftEditorialPage from "../../DraftEditorialPage";
import DraftHome from "../../DraftHome";
import { pages, type PageContent } from "@/content/pages";
import { draftLegalKeys, getDraftLegalContent, type DraftLegalKey } from "../../LegalContent";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"], weight: "400", style: ["normal", "italic"],
  variable: "--font-novalure-instrument", display: "swap"
});

type Params = { locale: string; slug?: string[] };

function findLegalKey(locale: Locale, slug?: string[]): DraftLegalKey | null {
  const path = `/${locale}/${(slug ?? []).join("/")}`;
  return draftLegalKeys.find((key) => getPath(locale, key) === path) ?? null;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => [...draftLegalKeys, "home" as const, "contact" as const, "playbooks" as const, "developers" as const, "agents" as const, "handover" as const].map((key) => ({
    locale,
    slug: getPath(locale, key).slice(locale.length + 2).split("/")
  })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: candidate, slug } = await params;
  if (!isLocale(candidate)) return {};
  if (!slug?.length) {
    return { title: `${pages[candidate].home.seoTitle} | NovaLure Entwurf`, description: pages[candidate].home.description, robots: { index: false, follow: false } };
  }
  if (`/${candidate}/${(slug ?? []).join("/")}` === getPath(candidate, "contact")) {
    return {
      title: `${candidate === "de" ? "Projekt-Check anfragen" : candidate === "es" ? "Solicitar un análisis del proyecto" : "Request a Project Check"} | NovaLure Entwurf`,
      description: candidate === "de" ? "Besprechen Sie Ihr Immobilienprojekt mit NovaLure." : candidate === "es" ? "Hable de su proyecto inmobiliario con NovaLure." : "Discuss your real estate project with NovaLure.",
      robots: { index: false, follow: false }
    };
  }
  if (`/${candidate}/${(slug ?? []).join("/")}` === getPath(candidate, "playbooks")) {
    return {
      title: `${candidate === "de" ? "Kostenlose Playbooks" : candidate === "es" ? "Playbooks gratuitos" : "Free Playbooks"} | NovaLure Entwurf`,
      description: candidate === "de" ? "Drei kostenlose Arbeitsvorlagen für Bauträger und Maklerteams." : candidate === "es" ? "Tres herramientas gratuitas para promotores y equipos inmobiliarios." : "Three free field guides for developers and real estate teams.",
      robots: { index: false, follow: false }
    };
  }
  const editorialKey = (["developers", "agents", "handover"] as const).find((key) => `/${candidate}/${(slug ?? []).join("/")}` === getPath(candidate, key));
  if (editorialKey) {
    const content = pages[candidate][editorialKey];
    return { title: `${content.seoTitle} | NovaLure Entwurf`, description: content.description, robots: { index: false, follow: false } };
  }
  const key = findLegalKey(candidate, slug);
  if (!key) return {};
  const content = getDraftLegalContent(candidate, key);
  return {
    title: `${content.title} | NovaLure Entwurf`,
    description: content.description,
    robots: { index: false, follow: false }
  };
}

export default async function DraftLegalRoute({ params }: { params: Promise<Params> }) {
  const { locale: candidate, slug } = await params;
  if (!isLocale(candidate)) notFound();
  if (!slug?.length) return <div className={instrumentSerif.variable}><DraftHome locale={candidate} /></div>;
  if (`/${candidate}/${(slug ?? []).join("/")}` === getPath(candidate, "contact")) {
    return <div className={instrumentSerif.variable}><DraftContact locale={candidate} /></div>;
  }
  if (`/${candidate}/${(slug ?? []).join("/")}` === getPath(candidate, "playbooks")) {
    return <div className={instrumentSerif.variable}><DraftPlaybooks locale={candidate} /></div>;
  }
  const editorialKey = (["developers", "agents", "handover"] as const).find((key) => `/${candidate}/${(slug ?? []).join("/")}` === getPath(candidate, key));
  if (editorialKey) return <div className={instrumentSerif.variable}><DraftEditorialPage content={pages[candidate][editorialKey] as PageContent} /></div>;
  const key = findLegalKey(candidate, slug);
  if (!key) notFound();
  const content = getDraftLegalContent(candidate, key);
  return <div className={instrumentSerif.variable}><DraftLegal content={content} keyName={key} /></div>;
}
