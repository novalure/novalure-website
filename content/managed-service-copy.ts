import type { Locale } from "@/lib/i18n";

type ManagedServiceCopy = {
  navLabel: string;
  demoNote: string;
  systemPoint: string;
  caseSetup: string;
  noticeEyebrow: string;
  noticeTitle: string;
  noticeBody: string;
  noticeIntegration: string;
  footerNote: string;
  faq: {
    q: string;
    a: string;
  };
};

export const managedServiceCopy: Record<Locale, ManagedServiceCopy> = {
  de: {
    navLabel: "Systembeispiel ansehen",
    demoNote:
      "Von NovaLure betriebene Beispielansicht – keine echten Kundendaten. Ihr Team erhält qualifizierte Übergaben, dokumentierte nächste Schritte und vereinbarte Auswertungen.",
    systemPoint:
      "NovaLure führt den Prozess operativ im System. Ihr Team erhält qualifizierte Übergaben, klare nächste Schritte und vereinbarte Auswertungen – ohne das CRM selbst administrieren zu müssen.",
    caseSetup:
      "Lead-Pfad mit Qualifizierung, Follow-up und dokumentierter Übergabe an den Vertrieb. Eine Übertragung in ein bestehendes Kunden-CRM wird je Mandat technisch und vertraglich vereinbart.",
    noticeEyebrow: "Operativ geführter Service",
    noticeTitle: "NovaLure betreibt den Lead- und Vertriebsprozess für Ihr Mandat.",
    noticeBody:
      "Wir erfassen, qualifizieren, priorisieren, dokumentieren und verfolgen Anfragen im vereinbarten Umfang. Ihr Team erhält vorbereitete Gespräche, Statusinformationen, klare nächste Schritte und vereinbarte Auswertungen – ohne das System selbst administrieren zu müssen.",
    noticeIntegration:
      "Eine Übertragung in ein bestehendes Kunden-CRM wird nur im jeweiligen Mandat technisch und vertraglich vereinbart.",
    footerNote:
      "NovaLure richtet den Lead-Prozess ein und führt ihn operativ. Ihr Team erhält qualifizierte Übergaben und vereinbarte Auswertungen.",
    faq: {
      q: "Wie erhalten wir die Ergebnisse aus dem System?",
      a:
        "Der öffentlich angebotene Standard ist ein operativ geführter Service. NovaLure richtet das System für das Mandat ein, betreibt es und übergibt Ihrem Team qualifizierte Anfragen, Statusinformationen, nächste Schritte und vereinbarte Auswertungen. Ein eigener Login oder die eigenständige Administration des NovaLure-CRM ist derzeit kein Standardbestandteil. Eine Anbindung an ein vorhandenes Kunden-CRM wird bei Bedarf individuell vereinbart."
    }
  },
  en: {
    navLabel: "View system example",
    demoNote:
      "Example view operated by NovaLure — no real client data. Your team receives qualified handovers, documented next steps and agreed reporting.",
    systemPoint:
      "NovaLure operates the process in the system on your behalf. Your team receives qualified handovers, clear next steps and agreed reporting without having to administer the CRM.",
    caseSetup:
      "A lead path with qualification, follow-up and documented handover to sales. Any transfer into an existing client CRM is agreed technically and contractually for the individual mandate.",
    noticeEyebrow: "Operated service",
    noticeTitle: "NovaLure operates the lead and sales process for each mandate.",
    noticeBody:
      "We capture, qualify, prioritise, document and follow up enquiries within the agreed scope. Your team receives prepared conversations, status information, clear next steps and agreed reporting without having to administer the system.",
    noticeIntegration:
      "Any transfer into an existing client CRM is agreed technically and contractually for the individual mandate.",
    footerNote:
      "NovaLure configures and operates the lead process. Your team receives qualified handovers and agreed reporting.",
    faq: {
      q: "How do we receive the information from the system?",
      a:
        "The standard public offer is an operated service. NovaLure configures and runs the system for the mandate, then gives your team qualified enquiries, status information, next steps and agreed reporting. A separate login or self-administration of the NovaLure CRM is not currently a standard component. Integration with an existing client CRM can be agreed individually where required."
    }
  },
  es: {
    navLabel: "Ver ejemplo del sistema",
    demoNote:
      "Vista de ejemplo operada por NovaLure; no contiene datos reales de clientes. Su equipo recibe traspasos cualificados, próximos pasos documentados e informes acordados.",
    systemPoint:
      "NovaLure opera el proceso dentro del sistema por cuenta del cliente. Su equipo recibe traspasos cualificados, próximos pasos claros e informes acordados sin tener que administrar el CRM.",
    caseSetup:
      "Recorrido con cualificación, seguimiento y traspaso documentado al equipo comercial. La transferencia a un CRM ya existente del cliente se acuerda técnica y contractualmente para cada encargo.",
    noticeEyebrow: "Servicio operado",
    noticeTitle: "NovaLure opera el proceso de captación y gestión comercial para cada encargo.",
    noticeBody:
      "Registramos, cualificamos, priorizamos, documentamos y realizamos el seguimiento de las solicitudes dentro del alcance acordado. Su equipo recibe conversaciones preparadas, información de estado, próximos pasos claros e informes acordados sin tener que administrar el sistema.",
    noticeIntegration:
      "La transferencia a un CRM ya existente del cliente se acuerda técnica y contractualmente para cada encargo.",
    footerNote:
      "NovaLure configura y opera el proceso de captación. Su equipo recibe traspasos cualificados e informes acordados.",
    faq: {
      q: "¿Cómo recibimos la información del sistema?",
      a:
        "La oferta estándar que se presenta públicamente es un servicio operado. NovaLure configura y gestiona el sistema para cada encargo y entrega al equipo solicitudes cualificadas, estados, próximos pasos e informes acordados. Un acceso independiente o la administración autónoma del CRM de NovaLure no forman parte actualmente del servicio estándar. Cuando sea necesario, la integración con un CRM ya existente del cliente se acuerda de forma individual."
    }
  }
};
