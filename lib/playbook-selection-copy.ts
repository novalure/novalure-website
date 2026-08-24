import type { Locale } from "@/lib/i18n";
import type { PrimaryPlaybookType } from "@/lib/playbooks-meta";

type SelectionCopy = {
  heading: string;
  roleLegend: string;
  roles: Record<PrimaryPlaybookType, { title: string; description: string }>;
  international: { label: string; help: string };
  selected: string;
  fields: {
    name: string;
    email: string;
    company: string;
    phone: string;
    honeypot: string;
  };
  consent: {
    requiredBefore: string;
    privacyLabel: string;
    requiredAfter: string;
    optional: string;
  };
  submit: string;
  loading: string;
  trust: string;
  successSingle: string;
  successMultiple: string;
  successBody: string;
  errors: {
    required: string;
    email: string;
    phone: string;
    consent: string;
    submit: string;
  };
};

export const playbookSelectionCopy: Record<Locale, SelectionCopy> = {
  de: {
    heading: "Die passende Auswahl für Ihren Vertriebsweg",
    roleLegend: "Welcher Bereich beschreibt Ihre aktuelle Situation?",
    roles: {
      developer: {
        title: "Bauträger / Projektvertrieb",
        description: "Sie erhalten das Playbook „Projekt-Nachfrage“."
      },
      agent: {
        title: "Makler / Agentur",
        description: "Sie erhalten das Playbook „Eigene Nachfrage“."
      }
    },
    international: {
      label: "Wir sprechen gezielt internationale Käufer an.",
      help: "Sie erhalten zusätzlich das Spezial-Playbook „Internationale Käufer“."
    },
    selected: "Ihre Auswahl",
    fields: {
      name: "Name",
      email: "Geschäftliche E-Mail",
      company: "Unternehmen",
      phone: "Telefonnummer",
      honeypot: "Website"
    },
    consent: {
      requiredBefore: "Pflicht: Ich stimme der Verarbeitung meiner Daten gemäß ",
      privacyLabel: "Datenschutzerklärung",
      requiredAfter: " zu, damit NovaLure mir die ausgewählten Playbooks per E-Mail senden kann.",
      optional: "Optional: Ja, ich möchte zukünftig relevante Inhalte, Updates und Angebote von NovaLure per E-Mail erhalten. Jederzeit per Abmeldelink widerrufbar."
    },
    submit: "Ausgewählte Playbooks erhalten",
    loading: "Wird gesendet...",
    trust: "Kein Spam · jederzeit abbestellbar · DSGVO-konform",
    successSingle: "Ihr Playbook ist unterwegs.",
    successMultiple: "Ihre Playbooks sind unterwegs.",
    successBody: "Wir haben die Downloadlinks an Ihre geschäftliche E-Mail-Adresse gesendet.",
    errors: {
      required: "Dieses Feld ist erforderlich.",
      email: "Bitte geben Sie eine gültige geschäftliche E-Mail ein.",
      phone: "Bitte geben Sie eine gültige Telefonnummer ein oder lassen Sie das Feld leer.",
      consent: "Die Zustimmung ist für den Versand erforderlich.",
      submit: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut."
    }
  },
  en: {
    heading: "The right selection for your sales path",
    roleLegend: "Which area best describes your current situation?",
    roles: {
      developer: {
        title: "Property developer / project sales",
        description: "You will receive the Project Demand Playbook."
      },
      agent: {
        title: "Estate agency / brokerage team",
        description: "You will receive the Owned Demand Playbook."
      }
    },
    international: {
      label: "We actively target international buyers.",
      help: "You will also receive the International Buyers Specialist Playbook."
    },
    selected: "Your selection",
    fields: {
      name: "Name",
      email: "Work email",
      company: "Company",
      phone: "Phone number",
      honeypot: "Website"
    },
    consent: {
      requiredBefore: "Required: I consent to NovaLure processing my data in line with the ",
      privacyLabel: "Privacy Policy",
      requiredAfter: " so the selected playbooks can be delivered by email.",
      optional: "Optional: Yes, I would like to receive relevant content, updates and offers from NovaLure by email. I can unsubscribe at any time."
    },
    submit: "Receive selected playbooks",
    loading: "Sending...",
    trust: "No spam · unsubscribe anytime · GDPR-compliant",
    successSingle: "Your playbook is on the way.",
    successMultiple: "Your playbooks are on the way.",
    successBody: "We have sent the download links to your work email address.",
    errors: {
      required: "This field is required.",
      email: "Enter a valid work email.",
      phone: "Enter a valid phone number or leave the field empty.",
      consent: "Consent is required for delivery.",
      submit: "The request could not be sent. Please try again."
    }
  },
  es: {
    heading: "La selección adecuada para su recorrido comercial",
    roleLegend: "¿Qué opción describe mejor su situación actual?",
    roles: {
      developer: {
        title: "Promotor inmobiliario / equipo de venta de obra nueva",
        description: "Recibirá el Playbook sobre demanda de promociones."
      },
      agent: {
        title: "Agencia inmobiliaria / equipo comercial",
        description: "Recibirá el Playbook sobre demanda propia."
      }
    },
    international: {
      label: "Nos dirigimos activamente a compradores internacionales.",
      help: "También recibirá el Playbook especializado sobre compradores internacionales."
    },
    selected: "Su selección",
    fields: {
      name: "Nombre",
      email: "Correo electrónico profesional",
      company: "Empresa",
      phone: "Número de teléfono",
      honeypot: "Sitio web"
    },
    consent: {
      requiredBefore: "Obligatorio: Consiento que NovaLure trate mis datos de acuerdo con la ",
      privacyLabel: "Política de privacidad",
      requiredAfter: " para enviarme por correo electrónico los Playbooks seleccionados.",
      optional: "Opcional: Sí, deseo recibir contenidos, novedades y ofertas relevantes de NovaLure por correo electrónico. Puedo darme de baja en cualquier momento."
    },
    submit: "Recibir los Playbooks seleccionados",
    loading: "Enviando...",
    trust: "Sin spam · baja en cualquier momento · conforme al RGPD",
    successSingle: "Su Playbook está en camino.",
    successMultiple: "Sus Playbooks están en camino.",
    successBody: "Hemos enviado los enlaces de descarga a su correo electrónico profesional.",
    errors: {
      required: "Este campo es obligatorio.",
      email: "Introduzca un correo electrónico profesional válido.",
      phone: "Introduzca un número de teléfono válido o deje el campo vacío.",
      consent: "El consentimiento es obligatorio para el envío.",
      submit: "No hemos podido enviar la solicitud. Inténtelo de nuevo."
    }
  }
};
