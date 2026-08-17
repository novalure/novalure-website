"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { PlaybookKey as ContentPlaybookKey } from "@/content/pages";
import { getPath } from "@/lib/i18n";
import { playbookFormCopy } from "@/lib/playbook-form-copy";
import { playbooks as playbookMeta, privacyPolicyVersion, type PlaybookKey as MetaPlaybookKey } from "@/lib/playbooks-meta";

const defaultMeetingUrls: Record<Locale, string> = {
  en: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en",
  de: "https://meetings-eu1.hubspot.com/franz-romih",
  es: "https://meetings-eu1.hubspot.com/franz-romih/private-growth-audit-en"
};

type FieldKey = "name" | "email" | "company" | "phone" | "requiredConsent";
type FormValues = {
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
  requiredConsent: boolean;
  marketingConsent: boolean;
};
type FormErrors = Partial<Record<FieldKey, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
  requiredConsent: false,
  marketingConsent: false
};

function toMetaKey(locale: Locale, playbook: ContentPlaybookKey): MetaPlaybookKey {
  return `${locale}-${playbook}` as MetaPlaybookKey;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  if (!value.trim()) return true;
  return /^[+\d\s()./-]{6,}$/.test(value.trim());
}

function getPrivacyHref(locale: Locale) {
  return getPath(locale, "privacy");
}

function fieldError(field: FieldKey, values: FormValues, locale: Locale) {
  const errors = playbookFormCopy[locale].errors;

  if (field === "requiredConsent") {
    return values.requiredConsent ? "" : errors.consent;
  }

  if (field === "phone") {
    return isValidPhone(values.phone) ? "" : errors.phone;
  }

  const value = values[field].trim();
  if (!value) return errors.required;
  if (field === "email" && !isValidEmail(value)) return errors.email;
  return "";
}

function validate(values: FormValues, locale: Locale) {
  const fields: FieldKey[] = ["name", "email", "company", "phone", "requiredConsent"];
  return fields.reduce<FormErrors>((result, field) => {
    const error = fieldError(field, values, locale);
    if (error) result[field] = error;
    return result;
  }, {});
}

function formatSubline(template: string, pages: number) {
  return template.replace("{pages}", String(pages));
}

function CheckIcon() {
  return (
    <svg className="success-check-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HubSpotForm({
  locale,
  playbook = "developer",
  selectable = false,
  compact = false
}: {
  locale: Locale;
  playbook?: ContentPlaybookKey;
  selectable?: boolean;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedPlaybook, setSelectedPlaybook] = useState<ContentPlaybookKey>(playbook);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedEmail, setSubmittedEmail] = useState("");
  const submissionRef = useRef<{ id: string; consentTimestamp: string } | null>(null);
  const text = playbookFormCopy[locale];
  const previewKey = toMetaKey(locale, selectedPlaybook);
  const meta = playbookMeta[previewKey];
  const variant = text.variants[selectedPlaybook];
  const consentDisabled = !values.requiredConsent || state === "loading";

  const previewAlt = useMemo(
    () => `${text.previewAlt}: ${variant.title}`,
    [text.previewAlt, variant.title]
  );

  function updateField(field: keyof FormValues, value: string | boolean) {
    submissionRef.current = null;
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field in errors || field === "requiredConsent") {
        const nextField = field === "website" || field === "marketingConsent" ? null : field as FieldKey;
        if (nextField) {
          const error = fieldError(nextField, next, locale);
          setErrors((currentErrors) => {
            const updated = { ...currentErrors };
            if (error) updated[nextField] = error;
            else delete updated[nextField];
            return updated;
          });
        }
      }
      return next;
    });
  }

  function onInputChange(field: keyof FormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      updateField(field, event.currentTarget.type === "checkbox" ? event.currentTarget.checked : event.currentTarget.value);
    };
  }

  function onFieldBlur(field: FieldKey) {
    const error = fieldError(field, values, locale);
    setErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  }

  function onPlaybookChange(nextPlaybook: ContentPlaybookKey) {
    submissionRef.current = null;
    setSelectedPlaybook(nextPlaybook);
    setState("idle");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("idle");

    if (values.website.trim()) {
      return;
    }

    const nextErrors = validate(values, locale);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setState("loading");
    const submission = submissionRef.current ?? {
      id: window.crypto.randomUUID(),
      consentTimestamp: new Date().toISOString()
    };
    submissionRef.current = submission;

    try {
      const response = await fetch("/api/playbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          playbook: previewKey,
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          phone: values.phone.trim(),
          website: values.website.trim(),
          pageUri: window.location.href,
          segment: selectedPlaybook === "developer" ? "developers" : "agents",
          utm: Object.fromEntries(new URLSearchParams(window.location.search)),
          consentRequired: values.requiredConsent,
          consentMarketing: values.marketingConsent,
          consentTimestamp: submission.consentTimestamp,
          submissionId: submission.id,
          privacyPolicyVersion
        })
      });
      await response.json().catch(() => ({}));

      if (!response.ok) throw new Error("Playbook request failed");

      window.dispatchEvent(new CustomEvent("novalure:funnel-event", { detail: { name: "playbook_submit", playbook: previewKey } }));
      setSubmittedEmail(values.email.trim());
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <section className={`hubspot-card playbook-request-card${selectable ? " hubspot-card-wide" : ""}`}>
      <div className="playbook-form-layout">
        <aside className="playbook-preview-panel" aria-label={variant.title}>
          <AnimatePresence mode="wait">
            <motion.div
              key={previewKey}
              className="playbook-cover-frame"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                className="playbook-cover-image"
                src={meta.cover}
                alt={previewAlt}
                width={400}
                height={566}
                sizes="(min-width: 768px) 34vw, 82vw"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
          <div className="playbook-inside">
            <span>{text.insideTitle}</span>
            <ul>
              {variant.inside.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="playbook-form-panel">
          {state === "success" ? (
            <div className="form-state form-state-success" role="status">
              <CheckIcon />
              <span>{text.success.eyebrow}</span>
              <strong>{text.success.headline}</strong>
              <p>
                {text.success.sentBefore}
                <b>{submittedEmail}</b>
                {text.success.sentAfter}
              </p>
            </div>
          ) : (
            <>
              {!compact && (
                <div className="hubspot-meta playbook-form-heading">
                  <span>{variant.eyebrow}</span>
                  <strong>{variant.headline}</strong>
                  <p>{formatSubline(variant.subline, meta.pages)}</p>
                </div>
              )}

              <form className="contact-form playbook-contact-form" onSubmit={submit} data-track-form="playbook" noValidate>
                {selectable && (
                  <fieldset className="playbook-selector">
                    <legend>{text.selectorLabel}</legend>
                    {(["developer", "agent"] as ContentPlaybookKey[]).map((option) => (
                      <label className={selectedPlaybook === option ? "is-selected" : ""} key={option}>
                        <input
                          type="radio"
                          name="playbook"
                          value={option}
                          checked={selectedPlaybook === option}
                          onChange={() => onPlaybookChange(option)}
                        />
                        <span>{text.variants[option].title}</span>
                      </label>
                    ))}
                  </fieldset>
                )}

                <label>
                  <span>{text.fields.name}<span className="required-marker" aria-hidden="true">*</span></span>
                  <input name="name" autoComplete="name" required aria-required="true" value={values.name} onChange={onInputChange("name")} onBlur={() => onFieldBlur("name")} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <small className="field-error">{errors.name}</small>}
                </label>

                <label>
                  <span>{text.fields.email}<span className="required-marker" aria-hidden="true">*</span></span>
                  <input name="email" type="email" autoComplete="email" required aria-required="true" value={values.email} onChange={onInputChange("email")} onBlur={() => onFieldBlur("email")} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <small className="field-error">{errors.email}</small>}
                </label>

                <label>
                  <span>{text.fields.company}<span className="required-marker" aria-hidden="true">*</span></span>
                  <input name="company" autoComplete="organization" required aria-required="true" value={values.company} onChange={onInputChange("company")} onBlur={() => onFieldBlur("company")} aria-invalid={Boolean(errors.company)} />
                  {errors.company && <small className="field-error">{errors.company}</small>}
                </label>

                <label>
                  {text.fields.phone}
                  <input name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={onInputChange("phone")} onBlur={() => onFieldBlur("phone")} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <small className="field-error">{errors.phone}</small>}
                </label>

                <label className="honeypot-field" aria-hidden="true">
                  {text.fields.honeypot}
                  <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onInputChange("website")} />
                </label>

                <div className="consent-stack">
                  <label className="consent-row">
                    <input type="checkbox" name="consentRequired" checked={values.requiredConsent} onChange={onInputChange("requiredConsent")} onBlur={() => onFieldBlur("requiredConsent")} />
                    <span>
                      {text.consent.requiredBefore}
                      <a href={getPrivacyHref(locale)} target="_blank" rel="noopener noreferrer">{text.consent.privacyLabel}</a>
                      {text.consent.requiredAfter}
                    </span>
                  </label>
                  {errors.requiredConsent && <small className="field-error">{errors.requiredConsent}</small>}

                  <label className="consent-row">
                    <input type="checkbox" name="consentMarketing" checked={values.marketingConsent} onChange={onInputChange("marketingConsent")} />
                    <span>{text.consent.optional}</span>
                  </label>
                </div>

                <button className="button button-primary playbook-submit-button" type="submit" data-track="playbook_submit_click" disabled={consentDisabled}>
                  {state === "loading" && <span className="button-spinner" aria-hidden="true" />}
                  {state === "loading" ? text.loading : text.submit}
                </button>
                <p className="trust-microcopy">{text.trust}</p>
                {state === "error" && (
                  <p className="form-state form-state-error" role="alert">
                    {text.errors.submit}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function HubSpotMeetingEmbed({
  locale,
  title,
  body,
  linkLabel
}: {
  locale: Locale;
  title?: string;
  body?: string;
  linkLabel?: string;
}) {
  const [externalAllowed, setExternalAllowed] = useState(false);
  const text = playbookFormCopy[locale].meeting;
  const localizedMeetingUrl = locale === "de"
    ? process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_DE
    : locale === "es"
      ? process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_ES
      : process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL_EN;
  const meetingUrl = localizedMeetingUrl || process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL || defaultMeetingUrls[locale];
  const schedulerUrl = meetingUrl ? withSchedulerLocale(meetingUrl, locale) : "";

  useEffect(() => {
    function updateConsent(event: Event) {
      const consent = (event as CustomEvent<{ external?: boolean }>).detail;
      setExternalAllowed(Boolean(consent?.external));
    }

    window.addEventListener("novalure:consent", updateConsent);
    try {
      const stored = window.localStorage.getItem("novalure-cookie-consent");
      if (stored) {
        updateConsent(new CustomEvent("novalure:consent", { detail: JSON.parse(stored) }));
      }
    } catch {
      setExternalAllowed(false);
    }

    return () => window.removeEventListener("novalure:consent", updateConsent);
  }, []);

  return (
    <section className="hubspot-card meeting-card">
      <div>
        <span className="panel-label">{title || text.title}</span>
        <p>{body || text.body}</p>
      </div>
      {schedulerUrl && externalAllowed ? (
        <iframe className="hubspot-meeting-frame" src={schedulerUrl} title={title || text.title} loading="lazy" />
      ) : schedulerUrl ? (
        <div className="hubspot-meeting-consent">
          <p>{locale === "de" ? "Aktivieren Sie externe Medien, um den HubSpot-Buchungskalender zu laden." : locale === "es" ? "Active los medios externos para cargar el calendario de reservas de HubSpot." : "Allow external media to load the HubSpot booking calendar."}</p>
          <button className="button button-secondary" type="button" onClick={() => window.dispatchEvent(new Event("novalure:open-cookie-settings"))}>
            {locale === "de" ? "Cookie-Einstellungen öffnen" : locale === "es" ? "Abrir la configuración de cookies" : "Open cookie settings"}
          </button>
          <a href={schedulerUrl} target="_blank" rel="noopener noreferrer">
            {linkLabel || (locale === "de" ? "Terminseite direkt öffnen" : locale === "es" ? "Abrir directamente la página de reservas" : "Open booking page directly")}
          </a>
        </div>
      ) : (
        <code>{locale === "de" ? "NEXT_PUBLIC_HUBSPOT_MEETING_URL_DE" : locale === "es" ? "NEXT_PUBLIC_HUBSPOT_MEETING_URL_ES" : "NEXT_PUBLIC_HUBSPOT_MEETING_URL_EN"}</code>
      )}
    </section>
  );
}

function withSchedulerLocale(url: string, locale: Locale) {
  const separator = url.includes("?") ? "&" : "?";
  const hubspotLocale = locale === "de" ? "de-de" : locale === "es" ? "es-es" : "en-us";
  return `${url}${separator}locale=${hubspotLocale}`;
}
