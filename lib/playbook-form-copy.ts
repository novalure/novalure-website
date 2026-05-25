import type { Locale } from "@/lib/i18n";
import type { PlaybookKey } from "@/content/pages";

type PlaybookVariantCopy = {
  eyebrow: string;
  title: string;
  headline: string;
  subline: string;
  inside: string[];
};

type ConsentCopy = {
  requiredBefore: string;
  privacyLabel: string;
  requiredAfter: string;
  optional: string;
};

export const playbookFormCopy: Record<Locale, {
  fields: Record<"name" | "email" | "company" | "phone" | "honeypot", string>;
  selectorLabel: string;
  insideTitle: string;
  submit: string;
  loading: string;
  trust: string;
  previewAlt: string;
  consent: ConsentCopy;
  errors: Record<"required" | "email" | "phone" | "consent" | "submit", string>;
  success: {
    eyebrow: string;
    headline: string;
    sentBefore: string;
    sentAfter: string;
  };
  meeting: {
    title: string;
    body: string;
  };
  variants: Record<PlaybookKey, PlaybookVariantCopy>;
}> = {
  en: {
    fields: {
      name: "Name",
      email: "Work email",
      company: "Company",
      phone: "Phone number",
      honeypot: "Website"
    },
    selectorLabel: "Choose your playbook",
    insideTitle: "What's inside",
    submit: "Send me the playbook",
    loading: "Sending...",
    trust: "No spam · unsubscribe anytime · GDPR-compliant",
    previewAlt: "Playbook cover preview",
    consent: {
      requiredBefore: "Required: I consent to NovaLure processing my data in line with the ",
      privacyLabel: "Privacy Policy",
      requiredAfter: " to deliver the playbook by email.",
      optional: "Optional: Yes, I'd like to receive relevant content, updates and offers from NovaLure by email. Withdrawable any time via the unsubscribe link."
    },
    errors: {
      required: "This field is required.",
      email: "Enter a valid work email.",
      phone: "Enter a valid phone number or leave the field empty.",
      consent: "Consent is required to receive the playbook.",
      submit: "The request could not be sent. Please try again."
    },
    success: {
      eyebrow: "Playbook sent",
      headline: "Your playbook is on the way!",
      sentBefore: "We've sent the download link to ",
      sentAfter: "."
    },
    meeting: {
      title: "Book your Pipeline Audit",
      body: "Choose a time that works for you. The calendar opens with live availability and sends the Microsoft Teams link after booking."
    },
    variants: {
      developer: {
        eyebrow: "Playbook delivery",
        title: "Developer Pipeline Playbook",
        headline: "Get your Pipeline Playbook",
        subline: "{pages}-page diagnostic guide · PDF · delivered in 2 minutes",
        inside: [
          "Where project enquiries lose context before sales can act",
          "Which handover gaps make buyer leads expensive to sort",
          "Audit-readiness check: is your project concrete enough for a Pipeline Audit"
        ]
      },
      agent: {
        eyebrow: "Playbook delivery",
        title: "Real Estate Agent Lead Playbook",
        headline: "Get your Lead Playbook",
        subline: "{pages}-page diagnostic guide · PDF · delivered in 2 minutes",
        inside: [
          "Where seller and buyer enquiries lose intent before follow-up",
          "Which CRM context separates curiosity from sales readiness",
          "Audit-readiness check: is your local lead system ready for a Pipeline Audit"
        ]
      }
    }
  },
  de: {
    fields: {
      name: "Name",
      email: "Geschäftliche E-Mail",
      company: "Unternehmen",
      phone: "Telefonnummer",
      honeypot: "Website"
    },
    selectorLabel: "Wählen Sie Ihr Playbook",
    insideTitle: "Was drin ist",
    submit: "Schick mir den Leitfaden",
    loading: "Wird gesendet...",
    trust: "Kein Spam · jederzeit abbestellbar · DSGVO-konform",
    previewAlt: "Playbook-Cover-Vorschau",
    consent: {
      requiredBefore: "Pflicht: Ich stimme der Verarbeitung meiner Daten gemäß ",
      privacyLabel: "Datenschutzerklärung",
      requiredAfter: " zu, um das Playbook per E-Mail zu erhalten.",
      optional: "Optional: Ja, ich möchte zukünftig relevante Inhalte, Updates und Angebote von NovaLure per E-Mail erhalten. Jederzeit per Abmeldelink widerrufbar."
    },
    errors: {
      required: "Dieses Feld ist erforderlich.",
      email: "Bitte geben Sie eine gültige geschäftliche E-Mail ein.",
      phone: "Bitte geben Sie eine gültige Telefonnummer ein oder lassen Sie das Feld leer.",
      consent: "Die Zustimmung ist erforderlich, damit wir das Playbook senden können.",
      submit: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut."
    },
    success: {
      eyebrow: "Playbook versendet",
      headline: "Playbook ist unterwegs!",
      sentBefore: "Wir haben den Downloadlink an ",
      sentAfter: " gesendet."
    },
    meeting: {
      title: "Pipeline-Audit buchen",
      body: "Wählen Sie einen passenden Termin. Der Kalender zeigt verfügbare Zeiten und sendet nach der Buchung den Microsoft-Teams-Link."
    },
    variants: {
      developer: {
        eyebrow: "Playbook-Versand",
        title: "Bauträger-Pipeline-Leitfaden",
        headline: "Holen Sie sich Ihren Pipeline-Leitfaden",
        subline: "{pages}-seitiger Diagnose-Leitfaden · PDF · in 2 Minuten im Postfach",
        inside: [
          "Wo Projekt-Anfragen Kontext verlieren, bevor der Vertrieb übernimmt",
          "Welche Übergabe-Lücken Käufer-Leads teuer machen",
          "Audit-Reife-Check: Ist Ihr Projekt konkret genug für ein Pipeline-Audit"
        ]
      },
      agent: {
        eyebrow: "Playbook-Versand",
        title: "Makler-Lead-Leitfaden",
        headline: "Holen Sie sich Ihren Lead-Leitfaden",
        subline: "{pages}-seitiger Diagnose-Leitfaden · PDF · in 2 Minuten im Postfach",
        inside: [
          "Wo Verkäufer- und Käufer-Anfragen Intent verlieren",
          "Welcher CRM-Kontext Neugier von Verkaufsbereitschaft trennt",
          "Audit-Reife-Check: Ist Ihr lokales Lead-System bereit für ein Pipeline-Audit"
        ]
      }
    }
  }
};
