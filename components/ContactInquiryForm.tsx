"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

type Status = "idle" | "loading" | "success" | "error";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  inquiry: string;
};

const emptyValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  interest: "",
  inquiry: ""
};

const copy = {
  en: {
    eyebrow: "Direct inquiry",
    title: "Send a confidential inquiry.",
    body: "Share your contact details and the Novalure team will respond directly.",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Business Email",
      phone: "Phone Number",
      company: "Company",
      interest: "Interested in",
      inquiry: "Your Message"
    },
    interests: {
      placeholder: "Select an option",
      developers: "Developers",
      agents: "Real Estate Agents"
    },
    placeholders: {
      firstName: "First name",
      lastName: "Last name",
      email: "you@company.com",
      phone: "+353...",
      company: "Company name",
      inquiry: "Briefly describe what you would like to discuss."
    },
    submit: "Send Inquiry",
    loading: "Sending...",
    success: "Thank you. Your inquiry has been received.",
    error: "Something went wrong. Please try again or email hello@novalure.eu"
  },
  de: {
    eyebrow: "Direkte Anfrage",
    title: "Senden Sie eine vertrauliche Anfrage.",
    body: "Hinterlassen Sie Ihre Kontaktdaten. Das Novalure-Team meldet sich direkt bei Ihnen.",
    fields: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "Geschäftsemail",
      phone: "Telefonnummer",
      company: "Unternehmen",
      interest: "Interesse",
      inquiry: "Ihr Anliegen"
    },
    interests: {
      placeholder: "Option auswählen",
      developers: "Bauträger",
      agents: "Immobilienmakler"
    },
    placeholders: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "sie@unternehmen.com",
      phone: "+43...",
      company: "Unternehmen",
      inquiry: "Beschreiben Sie kurz, worum es geht."
    },
    submit: "Anfrage senden",
    loading: "Wird gesendet...",
    success: "Vielen Dank. Ihre Anfrage wurde übermittelt.",
    error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie an hello@novalure.eu"
  }
} as const;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactInquiryForm({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const isLoading = status === "loading";

  function updateValue(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      interest: values.interest.trim(),
      inquiry: values.inquiry.trim(),
      language: locale
    };

    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.phone ||
      !payload.company ||
      !payload.interest ||
      !payload.inquiry ||
      !isValidEmail(payload.email)
    ) {
      setStatus("error");
      setStatusMessage(text.error);
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setValues(emptyValues);
      setStatus("success");
      setStatusMessage(text.success);
    } catch {
      setStatus("error");
      setStatusMessage(text.error);
    }
  }

  return (
    <section className="contact-inquiry-section" aria-labelledby="contact-inquiry-title">
      <div className="contact-inquiry-shell">
        <div className="contact-inquiry-copy">
          <p className="eyebrow">{text.eyebrow}</p>
          <h2 id="contact-inquiry-title">{text.title}</h2>
          <p>{text.body}</p>
        </div>
        <form className="contact-inquiry-form" onSubmit={submitForm}>
          <label className="contact-field">
            <span>{text.fields.firstName}</span>
            <input
              name="firstName"
              value={values.firstName}
              onChange={updateValue}
              placeholder={text.placeholders.firstName}
              required
              autoComplete="given-name"
            />
          </label>
          <label className="contact-field">
            <span>{text.fields.lastName}</span>
            <input
              name="lastName"
              value={values.lastName}
              onChange={updateValue}
              placeholder={text.placeholders.lastName}
              required
              autoComplete="family-name"
            />
          </label>
          <label className="contact-field">
            <span>{text.fields.email}</span>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={updateValue}
              placeholder={text.placeholders.email}
              required
              autoComplete="email"
            />
          </label>
          <label className="contact-field">
            <span>{text.fields.phone}</span>
            <input
              name="phone"
              type="tel"
              value={values.phone}
              onChange={updateValue}
              placeholder={text.placeholders.phone}
              required
              autoComplete="tel"
            />
          </label>
          <label className="contact-field">
            <span>{text.fields.company}</span>
            <input
              name="company"
              value={values.company}
              onChange={updateValue}
              placeholder={text.placeholders.company}
              required
              autoComplete="organization"
            />
          </label>
          <label className="contact-field">
            <span>{text.fields.interest}</span>
            <select name="interest" value={values.interest} onChange={updateValue} required>
              <option value="">{text.interests.placeholder}</option>
              <option value="developers">{text.interests.developers}</option>
              <option value="agents">{text.interests.agents}</option>
            </select>
          </label>
          <label className="contact-field contact-field-full">
            <span>{text.fields.inquiry}</span>
            <textarea
              name="inquiry"
              value={values.inquiry}
              onChange={updateValue}
              placeholder={text.placeholders.inquiry}
              required
            />
          </label>
          <div className="contact-form-actions">
            <button className="button button-primary" type="submit" disabled={isLoading}>
              {isLoading ? text.loading : text.submit}
            </button>
            <p
              className={`contact-form-status ${status === "success" ? "is-success" : ""} ${
                status === "error" ? "is-error" : ""
              }`}
              aria-live="polite"
            >
              {statusMessage}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
