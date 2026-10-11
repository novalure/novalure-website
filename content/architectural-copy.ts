import type { Locale } from "@/lib/i18n";

export const architecturalCopy: Record<Locale, {
  heroStart: string;
  heroEmphasis: string;
  heroEnd: string;
  heroSecondary: string;
  heroRole: string;
  pathLabel: string;
  pathTitle: string;
  pathSteps: readonly string[];
  manifestoKicker: string;
  manifestoStart: string;
  manifestoEmphasis: string;
  manifestoEnd: string;
  manifestoIntro: string;
  manifestoApproachLabel: string;
  manifestoApproach: string;
  manifestoDeliveryLabel: string;
  manifestoDelivery: string;
  sampleVisual: string;
  editorialTitle: string;
  projectTitle: string;
  projectIntro: string;
  projectVisualTitle: string;
  projectVisualNote: string;
  founderRole: string;
}> = {
  de: {
    heroStart: "Von der",
    heroEmphasis: "Projektvision",
    heroEnd: "zur qualifizierten Übergabe.",
    heroSecondary: "So funktioniert das System",
    heroRole: "NovaLure vermarktet im Auftrag. Verkaufsgespräche und Abschlüsse führt Ihr Vertrieb.",
    pathLabel: "Ein Mandat · ein durchgängiger Prozess",
    pathTitle: "Von der Idee zum vorbereiteten Gespräch",
    pathSteps: ["Positionierung", "Projektpräsenz", "Nachfrage & Qualifizierung", "Übergabe an Ihren Vertrieb"],
    manifestoKicker: "Unser Ansatz",
    manifestoStart: "Architektur sichtbar machen.",
    manifestoEmphasis: "Vertrieb vorbereiten.",
    manifestoEnd: "",
    manifestoIntro: "Gute Projektvermarktung endet nicht beim Bild. Wir verbinden die Geschichte und Präsenz eines Projekts mit einem strukturierten Weg für Nachfrage und Nachfassen.",
    manifestoApproachLabel: "Vision × Struktur",
    manifestoApproach: "Positionierung, Visualisierung, Exposé und Projektwebsite bilden eine verständliche Projektwelt – abgestimmt auf die Menschen, die Sie erreichen wollen.",
    manifestoDeliveryLabel: "Nachfrage × Übergabe",
    manifestoDelivery: "Kampagnen, Qualifizierung und Follow-up bereiten Gespräche vor. Ihr Vertrieb erhält Kontext, Status und den nächsten Schritt; der Verkauf bleibt bei Ihrem Team.",
    sampleVisual: "Beispielvisualisierung · kein Verkaufsangebot",
    editorialTitle: "Mehr Anfragen sind nicht die Antwort. Ein besserer Vertriebsweg ist es.",
    projectTitle: "Projektpräsenz, die einen Vertriebsweg eröffnet.",
    projectIntro: "Ausgewählte Referenzen und offen gekennzeichnete Beispielvisualisierungen zeigen die Bandbreite der Projektarbeit.",
    projectVisualTitle: "Architektur sichtbar machen",
    projectVisualNote: "Beispielvisualisierung eines alpinen Neubauprojekts",
    founderRole: "Mandatsleitung · direkter Ansprechpartner"
  },
  en: {
    heroStart: "From project",
    heroEmphasis: "vision",
    heroEnd: "to qualified handover.",
    heroSecondary: "See how the system works",
    heroRole: "NovaLure markets on your behalf. Your sales team leads buyer conversations and closes the sale.",
    pathLabel: "One mandate · one connected process",
    pathTitle: "From idea to prepared conversation",
    pathSteps: ["Positioning", "Project presence", "Demand & qualification", "Handover to your sales team"],
    manifestoKicker: "Our approach",
    manifestoStart: "Make architecture tangible.",
    manifestoEmphasis: "Prepare the sale.",
    manifestoEnd: "",
    manifestoIntro: "Project marketing does not end with a visual. We connect the story and presence of a project to a structured path for demand and follow-up.",
    manifestoApproachLabel: "Vision × structure",
    manifestoApproach: "Positioning, visualisation, brochure and project website create a coherent project world for the people you need to reach.",
    manifestoDeliveryLabel: "Demand × handover",
    manifestoDelivery: "Campaigns, qualification and follow-up prepare conversations. Your sales team receives context, status and the next step; the sale stays with your team.",
    sampleVisual: "Sample architectural visual · not a property offer",
    editorialTitle: "More enquiries are not the answer. A better sales path is.",
    projectTitle: "Project presence that opens a sales path.",
    projectIntro: "Selected references and clearly labelled sample visuals show the range of project work.",
    projectVisualTitle: "Make architecture tangible",
    projectVisualNote: "Sample visual of an alpine new-build project",
    founderRole: "Mandate lead · direct point of contact"
  },
  es: {
    heroStart: "De la",
    heroEmphasis: "visión",
    heroEnd: "al traspaso comercial cualificado.",
    heroSecondary: "Así funciona el sistema",
    heroRole: "NovaLure comercializa por encargo. Su equipo dirige las conversaciones y cierra la venta.",
    pathLabel: "Un encargo · un proceso conectado",
    pathTitle: "De la idea a la conversación preparada",
    pathSteps: ["Posicionamiento", "Presencia del proyecto", "Demanda y cualificación", "Traspaso a su equipo comercial"],
    manifestoKicker: "Nuestro enfoque",
    manifestoStart: "Hacer visible la arquitectura.",
    manifestoEmphasis: "Preparar la venta.",
    manifestoEnd: "",
    manifestoIntro: "La comercialización de una promoción no termina en la imagen. Conectamos su historia y presencia con un recorrido estructurado de captación y seguimiento.",
    manifestoApproachLabel: "Visión × estructura",
    manifestoApproach: "Posicionamiento, visualización, dossier y web del proyecto crean una presencia coherente para el público al que desea llegar.",
    manifestoDeliveryLabel: "Demanda × traspaso",
    manifestoDelivery: "Campañas, cualificación y seguimiento preparan conversaciones. Su equipo recibe contexto, estado y próximo paso; la venta permanece en sus manos.",
    sampleVisual: "Visualización de ejemplo · no es una oferta inmobiliaria",
    editorialTitle: "Más solicitudes no son la respuesta. Una mejor vía comercial sí.",
    projectTitle: "Una presencia de proyecto que abre el camino comercial.",
    projectIntro: "Las referencias seleccionadas y los ejemplos visuales identificados muestran el alcance del trabajo.",
    projectVisualTitle: "Hacer tangible la arquitectura",
    projectVisualNote: "Visualización de ejemplo de una promoción alpina",
    founderRole: "Responsable del proyecto · contacto directo"
  }
};
