"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { PlaybookKey } from "@/content/pages";

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
    auditSubmit: "Request audit",
    loading: "Preparing your request...",
    error: "Please complete the required fields before submitting.",
    success: "Your playbook is on its way.",
    successBody: "Want us to review your current lead system next?",
    successCta: "Book a Private Growth Audit",
    formPlaceholder: "Playbook delivery",
    meetingTitle: "HubSpot Meeting Scheduler",
    meetingBody: "Connect HUBSPOT_MEETING_SCHEDULER_EMBED / NEXT_PUBLIC_HUBSPOT_MEETING_URL to render the live scheduler."
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
    auditSubmit: "Audit anfragen",
    loading: "Ihre Anfrage wird vorbereitet...",
    error: "Bitte füllen Sie die erforderlichen Felder aus.",
    success: "Ihr Playbook ist unterwegs.",
    successBody: "Möchten Sie, dass wir Ihr aktuelles Lead-System prüfen?",
    successCta: "Privates Growth Audit buchen",
    formPlaceholder: "Playbook-Versand",
    meetingTitle: "HubSpot Meeting Scheduler",
    meetingBody: "HUBSPOT_MEETING_SCHEDULER_EMBED / NEXT_PUBLIC_HUBSPOT_MEETING_URL verbinden, um den Live-Scheduler zu rendern."
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
      <a className="button button-secondary" href={locale === "en" ? "/en/contact" : "/de/kontakt"}>
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
  const meetingUrl = process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL;

  return (
    <section className="hubspot-card meeting-card">
      <div>
        <span className="panel-label">{text.meetingTitle}</span>
        <p>{text.meetingBody}</p>
      </div>
      <code>{meetingUrl || "HUBSPOT_MEETING_SCHEDULER_EMBED"}</code>
    </section>
  );
}
