import type { Locale } from "@/lib/i18n";

export const architecturalCopy: Record<Locale, {
  heroStart: string;
  heroEmphasis: string;
  heroEnd: string;
  heroSecondary: string;
  sampleVisual: string;
  editorialTitle: string;
  projectTitle: string;
  projectIntro: string;
  projectVisualTitle: string;
  projectVisualNote: string;
  founderRole: string;
}> = {
  de: {
    heroStart: "Ihr Projekt verdient",
    heroEmphasis: "Käufer",
    heroEnd: "– nicht Kontaktlisten.",
    heroSecondary: "So funktioniert das System",
    sampleVisual: "Beispielvisualisierung · kein Verkaufsangebot",
    editorialTitle: "Mehr Anfragen sind nicht die Antwort. Ein besserer Vertriebsweg ist es.",
    projectTitle: "Projektpräsenz, die einen Vertriebsweg eröffnet.",
    projectIntro: "Ausgewählte Referenzen und offen gekennzeichnete Beispielvisualisierungen zeigen die Bandbreite der Projektarbeit.",
    projectVisualTitle: "Architektur sichtbar machen",
    projectVisualNote: "Beispielvisualisierung eines alpinen Neubauprojekts",
    founderRole: "Mandatsleitung · direkter Ansprechpartner"
  },
  en: {
    heroStart: "Your project deserves",
    heroEmphasis: "buyers",
    heroEnd: "– not contact lists.",
    heroSecondary: "See how the system works",
    sampleVisual: "Sample architectural visual · not a property offer",
    editorialTitle: "More enquiries are not the answer. A better sales path is.",
    projectTitle: "Project presence that opens a sales path.",
    projectIntro: "Selected references and clearly labelled sample visuals show the range of project work.",
    projectVisualTitle: "Make architecture tangible",
    projectVisualNote: "Sample visual of an alpine new-build project",
    founderRole: "Mandate lead · direct point of contact"
  },
  es: {
    heroStart: "Su promoción merece",
    heroEmphasis: "compradores",
    heroEnd: ", no listas de contactos.",
    heroSecondary: "Así funciona el sistema",
    sampleVisual: "Visualización de ejemplo · no es una oferta inmobiliaria",
    editorialTitle: "Más solicitudes no son la respuesta. Una mejor vía comercial sí.",
    projectTitle: "Una presencia de proyecto que abre el camino comercial.",
    projectIntro: "Las referencias seleccionadas y los ejemplos visuales identificados muestran el alcance del trabajo.",
    projectVisualTitle: "Hacer tangible la arquitectura",
    projectVisualNote: "Visualización de ejemplo de una promoción alpina",
    founderRole: "Responsable del proyecto · contacto directo"
  }
};
