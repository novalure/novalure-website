import type { Locale } from "@/lib/i18n";
import type { PlaybookType } from "@/lib/playbooks-meta";

export type PlaybookCatalogItem = {
  key: PlaybookType;
  audience: string;
  title: string;
  subtitle: string;
  learns: string[];
};

export const playbookCatalog: Record<Locale, PlaybookCatalogItem[]> = {
  de: [
    {
      key: "developer",
      audience: "Bauträger / Projektvertrieb",
      title: "Projekt-Nachfrage",
      subtitle: "Für Projekte, bei denen Anfragen zwischen Kampagne, Qualifizierung und Vertrieb ihren Kaufkontext verlieren.",
      learns: [
        "Wo Quelle, Kaufabsicht, Timing und nächster Schritt verloren gehen",
        "Warum mehr Projektanfragen nicht automatisch mehr Einheiten verkaufen",
        "Woran Sie erkennen, ob Ihr Projektweg Gespräche oder Sortierarbeit erzeugt"
      ]
    },
    {
      key: "agent",
      audience: "Makler / Agentur",
      title: "Eigene Nachfrage",
      subtitle: "Für Maklerteams, die Portalabhängigkeit reduzieren und Verkäufer- sowie Käuferanfragen vorbereitet entwickeln wollen.",
      learns: [
        "Warum Bewertungsneugier nicht automatisch Verkaufsabsicht ist",
        "Welcher Kontext Eigentümer- und Käuferanfragen wirklich qualifiziert",
        "Wie eigene Nachfrage zu vorbereiteten Gesprächen statt Telefonlisten wird"
      ]
    },
    {
      key: "international",
      audience: "Spezial-Playbook",
      title: "Internationale Käufer",
      subtitle: "Für Bauträger, Projektvertriebe und Agenturen mit grenzüberschreitenden Käuferzielgruppen.",
      learns: [
        "Warum Übersetzung noch keine lokalisierte Käuferreise ist",
        "Welche Vertrauens-, Finanzierungs- und Prozessfragen früh geklärt werden müssen",
        "Wie Sprache, Zeitzone und Zuständigkeit im Follow-up beherrschbar werden"
      ]
    }
  ],
  en: [
    {
      key: "developer",
      audience: "Developer / project sales",
      title: "Project Demand",
      subtitle: "For developments where buying context gets lost between campaign, qualification and sales.",
      learns: [
        "Where source, intent, timing and the next step disappear",
        "Why more project enquiries do not automatically sell more units",
        "How to tell whether the project path creates conversations or sorting work"
      ]
    },
    {
      key: "agent",
      audience: "Estate agency / brokerage",
      title: "Owned Demand",
      subtitle: "For agency teams that want less portal dependency and better-prepared seller and buyer conversations.",
      learns: [
        "Why valuation curiosity is not the same as an intention to sell",
        "Which context actually qualifies seller and buyer enquiries",
        "How owned demand becomes prepared conversations rather than call lists"
      ]
    },
    {
      key: "international",
      audience: "Specialist playbook",
      title: "International Buyers",
      subtitle: "For developers, project sales teams and agencies targeting buyers across borders.",
      learns: [
        "Why translation alone does not create a localised buyer journey",
        "Which trust, finance and process questions need early answers",
        "How to manage language, time zones and ownership in follow-up"
      ]
    }
  ],
  es: [
    {
      key: "developer",
      audience: "Promotor / venta de obra nueva",
      title: "Demanda de promociones",
      subtitle: "Para promociones donde el contexto de compra se pierde entre campaña, cualificación y ventas.",
      learns: [
        "Dónde desaparecen el origen, la intención, los plazos y el siguiente paso",
        "Por qué más solicitudes no venden automáticamente más viviendas",
        "Cómo saber si el recorrido genera conversaciones o trabajo de clasificación"
      ]
    },
    {
      key: "agent",
      audience: "Agencia / equipo comercial",
      title: "Demanda propia",
      subtitle: "Para agencias que quieren depender menos de los portales y preparar mejor las conversaciones con propietarios y compradores.",
      learns: [
        "Por qué la curiosidad por una valoración no equivale a intención de vender",
        "Qué contexto cualifica de verdad a propietarios y compradores",
        "Cómo convertir demanda propia en conversaciones preparadas, no en listas"
      ]
    },
    {
      key: "international",
      audience: "Playbook especializado",
      title: "Compradores internacionales",
      subtitle: "Para promotores, equipos de venta y agencias que se dirigen a compradores de otros países.",
      learns: [
        "Por qué traducir no basta para localizar el recorrido de compra",
        "Qué cuestiones de confianza, financiación y proceso deben aclararse pronto",
        "Cómo gestionar idioma, zona horaria y responsabilidad en el seguimiento"
      ]
    }
  ]
};
