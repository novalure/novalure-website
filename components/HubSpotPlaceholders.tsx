"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { PlaybookKey } from "@/content/pages";

const defaultMeetingUrls: Record<Locale, string> = {
  en: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en",
  de: "https://meetings-eu1.hubspot.com/franz-romih"
};

const copy = {
  en: {
    fields: {
      name: "Name",
      email: "Work email",
      company: "Company"
    },
    selectorLabel: "Choose your playbook",
    developer: "Developer Pipeline Playbook",
    agent: "Real Estate Agent Lead Playbook",
    submit: "Send me the Playbook",
    auditSubmit: "Request Pipeline Audit",
    loading: "Preparing your request...",
    error: "Please complete the required fields before submitting.",
    success: "Your playbook is on its way.",
    successBody: "Want us to review your current lead system next?",
    successCta: "Book Pipeline Audit",
    formPlaceholder: "Playbook delivery",
    meetingTitle: "Book your Pipeline Audit",
    meetingBody: "Choose a time that works for you. The calendar opens with live availability and sends the Microsoft Teams link after booking."
  },
  de: {
    fields: {
      name: "Name",
      email: "Geschäftliche E-Mail",
      company: "Unternehmen"
    },
    selectorLabel: "Wählen Sie Ihr Playbook",
    developer: "Bauträger-Pipeline-Playbook",
    agent: "Makler-Lead-Playbook",
    submit: "Playbook anfordern",
    auditSubmit: "Pipeline-Audit anfragen",
    loading: "Ihre Anfrage wird vorbereitet...",
    error: "Bitte füllen Sie die erforderlichen Felder aus.",
    success: "Ihr Playbook ist unterwegs.",
    successBody: "Möchten Sie, dass wir Ihr aktuelles Lead-System prüfen?",
    successCta: "Pipeline-Audit buchen",
    formPlaceholder: "Playbook-Versand",
    meetingTitle: "Pipeline-Audit buchen",
    meetingBody: "Wählen Sie einen passenden Termin. Der Kalender zeigt verfügbare Zeiten und sendet nach der Buchung den Microsoft Teams-Link."
  }
};

export function FormLoadingState({ locale }: { locale: Locale }) {
  return <p className="form-state loading-state">{copy[locale].loading}</p>;
}

export function FormErrorState({ locale }: { locale: Locale }) {
  return (
    <p className="form-state form-state-error" role="alert">
      {copy[locale].error}
    </p>
  );
}

export function FormSuccessState({ locale, playbook }: { locale: Locale; playbook: PlaybookKey }) {
  const title = playbook === "developer" ? copy[locale].developer : copy[locale].agent;

  return (
    <div className="form-state form-state-success" role="status">
      <span>{title}</span>
      <strong>{copy[locale].success}</strong>
      <p>{copy[locale].successBody}</p>
      <a className="button button-secondary" href={locale === "en" ? "/en/contact#book-audit" : "/de/kontakt#book-audit"}>
        {copy[locale].successCta}
      </a>
    </div>
  );
}

export function HubSpotForm({
  locale,
  playbook = "developer",
  selectable = false
}: {
  locale: Locale;
  playbook?: PlaybookKey;
  selectable?: boolean;
}) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookKey>(playbook);
  const text = copy[locale];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("name") || !data.get("email")) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const response = await fetch("/api/playbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          playbook: selectedPlaybook,
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          pageUri: window.location.href
        })
      });

      if (!response.ok) {
        throw new Error("Playbook request failed");
      }

      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <section className={`hubspot-card${selectable ? " hubspot-card-wide" : ""}`}>
      <div className="hubspot-meta">
        <span>{text.formPlaceholder}</span>
        <strong>{selectedPlaybook === "developer" ? text.developer : text.agent}</strong>
      </div>
      {state !== "success" && (
        <form className="contact-form" onSubmit={submit}>
          {selectable && (
            <fieldset className="playbook-selector">
              <legend>{text.selectorLabel}</legend>
              <label className={selectedPlaybook === "developer" ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="playbook"
                  value="developer"
                  checked={selectedPlaybook === "developer"}
                  onChange={() => setSelectedPlaybook("developer")}
                />
                <span>{text.developer}</span>
              </label>
              <label className={selectedPlaybook === "agent" ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="playbook"
                  value="agent"
                  checked={selectedPlaybook === "agent"}
                  onChange={() => setSelectedPlaybook("agent")}
                />
                <span>{text.agent}</span>
              </label>
            </fieldset>
          )}
          <label>
            {text.fields.name}
            <input name="name" autoComplete="name" />
          </label>
          <label>
            {text.fields.email}
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            {text.fields.company}
            <input name="company" autoComplete="organization" />
          </label>
          <button className="button button-primary" type="submit">
            {text.submit}
          </button>
        </form>
      )}
      {state === "loading" && <FormLoadingState locale={locale} />}
      {state === "error" && <FormErrorState locale={locale} />}
      {state === "success" && <FormSuccessState locale={locale} playbook={selectedPlaybook} />}
    </section>
  );
}

export function HubSpotMeetingEmbed({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const localizedMeetingUrl = locale === "de"
    ? process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_DE
    : process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_EN;
  const meetingUrl = localizedMeetingUrl || process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL || defaultMeetingUrls[locale];
  const schedulerUrl = meetingUrl ? withSchedulerLocale(meetingUrl, locale) : "";

  return (
    <section className="hubspot-card meeting-card">
      <div>
        <span className="panel-label">{text.meetingTitle}</span>
        <p>{text.meetingBody}</p>
      </div>
      {schedulerUrl ? (
        <iframe
          className="hubspot-meeting-frame"
          src={schedulerUrl}
          title={text.meetingTitle}
          loading="lazy"
        />
      ) : (
        <code>{locale === "de" ? "NEXT_PUBLIC_HUBSPOT_MEETING_URL_DE" : "NEXT_PUBLIC_HUBSPOT_MEETING_URL_EN"}</code>
      )}
    </section>
  );
}

function withSchedulerLocale(url: string, locale: Locale) {
  const separator = url.includes("?") ? "&" : "?";
  const hubspotLocale = locale === "de" ? "de-de" : "en-us";
  return `${url}${separator}locale=${hubspotLocale}`;
}
