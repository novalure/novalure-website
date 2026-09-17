"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { playbookSelectionCopy } from "@/lib/playbook-selection-copy";
import {
  getSelectedPlaybookKeys,
  playbooks,
  privacyPolicyVersion,
  type PrimaryPlaybookType
} from "@/lib/playbooks-meta";
import { getPath, type Locale } from "@/lib/i18n";
import styles from "./PlaybookRequestForm.module.css";

type Props = {
  locale: Locale;
  playbook?: PrimaryPlaybookType;
  selectable?: boolean;
  compact?: boolean;
};

type FormState = "idle" | "loading" | "success" | "error";
type InputField = "name" | "email" | "company" | "phone";
type FieldName = InputField | "consent";
type FormErrors = Partial<Record<FieldName, string>>;

const fieldHints: Record<Locale, string> = {
  de: "* Pflichtfelder. Die Telefonnummer ist optional.",
  en: "* Required fields. Phone number is optional.",
  es: "* Campos obligatorios. El número de teléfono es opcional."
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string) {
  return !value || /^[+\d\s()./-]{6,}$/.test(value);
}

function createSubmissionId() {
  if (typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  const randomHex = () => Math.floor(Math.random() * 16).toString(16);
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
    .replace(/x/g, randomHex)
    .replace(/y/g, () => ((Math.floor(Math.random() * 4) + 8).toString(16)));
}

function getUtm() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, params.get(key) || ""] as const)
      .filter(([, value]) => value)
  );
}

export function PlaybookRequestForm({
  locale,
  playbook = "developer",
  selectable = true,
  compact = false
}: Props) {
  const copy = playbookSelectionCopy[locale];
  const id = useId();
  const [role, setRole] = useState<PrimaryPlaybookType>(playbook);
  const [internationalBuyers, setInternationalBuyers] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [requiredConsent, setRequiredConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const sendingRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const submitErrorRef = useRef<HTMLParagraphElement>(null);
  const loading = state === "loading";
  const cardClass = `hubspot-card playbook-request-card hubspot-card-wide ${styles.card} ${compact ? styles.compact : ""}`;

  useEffect(() => {
    if (state === "success") successRef.current?.focus();
    if (state === "error") submitErrorRef.current?.focus();
  }, [state]);

  const selectedKeys = useMemo(
    () => getSelectedPlaybookKeys(locale, role, internationalBuyers),
    [internationalBuyers, locale, role]
  );
  const selectedItems = selectedKeys.map((key) => playbooks[key]);

  function fieldError(field: InputField, rawValue: string) {
    const value = rawValue.trim();
    if (field !== "phone" && !value) return copy.errors.required;
    if (field === "email" && !isEmail(value)) return copy.errors.email;
    if (field === "phone" && !isPhone(value)) return copy.errors.phone;
    return "";
  }

  function updateFieldError(field: InputField, value: string) {
    const message = fieldError(field, value);
    setErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function validate(formData: FormData) {
    const nextErrors: FormErrors = {};
    for (const field of ["name", "email", "company", "phone"] as const) {
      const message = fieldError(field, String(formData.get(field) || ""));
      if (message) nextErrors[field] = message;
    }
    if (!requiredConsent) nextErrors.consent = copy.errors.consent;
    setErrors(nextErrors);
    return nextErrors;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validate(formData);
    const firstInvalid = (["name", "email", "company", "phone", "consent"] as const)
      .find((field) => nextErrors[field]);
    if (firstInvalid) {
      const control = form.elements.namedItem(firstInvalid === "consent" ? "consentRequired" : firstInvalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }

    const website = String(formData.get("website") || "").trim();
    if (website) {
      setState("success");
      return;
    }

    const consentTimestamp = new Date().toISOString();
    const submissionId = createSubmissionId();
    sendingRef.current = true;
    setState("loading");

    try {
      const response = await fetch("/api/playbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          role,
          playbook: selectedKeys[0],
          playbooks: selectedKeys,
          internationalBuyers,
          segment: role === "developer" ? "developers" : "agents",
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          company: String(formData.get("company") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          website,
          pageUri: typeof window === "undefined" ? "" : window.location.href,
          utm: getUtm(),
          consentRequired: requiredConsent,
          consentMarketing: marketingConsent,
          consentTimestamp,
          privacyPolicyVersion,
          submissionId
        })
      });

      if (!response.ok) throw new Error(`Playbook request failed with ${response.status}`);
      setState("success");
      form.reset();
      setRequiredConsent(false);
      setMarketingConsent(false);
    } catch (error) {
      console.error("novalure_playbook_request_client_failed", error);
      setState("error");
    } finally {
      sendingRef.current = false;
    }
  }

  if (state === "success") {
    return (
      <section className={cardClass} data-playbook-request data-state={state} aria-labelledby={`${id}-success`}>
        <div className={styles.success} role="status" ref={successRef} tabIndex={-1}>
          <span className={styles.successMark} aria-hidden="true">✓</span>
          <h3 id={`${id}-success`}>{selectedKeys.length > 1 ? copy.successMultiple : copy.successSingle}</h3>
          <p>{copy.successBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={cardClass} data-playbook-request data-state={state} aria-labelledby={`${id}-heading`}>
      <h2 className={styles.heading} id={`${id}-heading`}>{copy.heading}</h2>
      <form className={styles.form} data-track-form="playbook" noValidate onSubmit={onSubmit} aria-busy={loading}>
        <fieldset className={styles.roleFieldset}>
          <legend>{copy.roleLegend}</legend>
          <div className={styles.roleOptions}>
            {(["developer", "agent"] as const).map((option) => {
              const selected = role === option;
              return (
                <label className={`${styles.roleCard} ${selected ? styles.roleCardSelected : ""}`} key={option}>
                  <input
                    type="radio"
                    name="role"
                    value={option}
                    checked={selected}
                    disabled={!selectable || loading}
                    onChange={() => setRole(option)}
                  />
                  <span>
                    <strong>{copy.roles[option].title}</strong>
                    <small>{copy.roles[option].description}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className={styles.addOn}>
          <input
            type="checkbox"
            name="internationalBuyers"
            checked={internationalBuyers}
            disabled={loading}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInternationalBuyers(event.target.checked)}
          />
          <span>
            <strong>{copy.international.label}</strong>
            <small>{copy.international.help}</small>
          </span>
        </label>

        <div className={styles.selectionPanel} aria-live="polite" aria-atomic="true">
          <div className={styles.selectionText}>
            <span>{copy.selected}</span>
            <ul>
              {selectedItems.map((item) => <li key={`${item.locale}-${item.type}`}>{item.title}</li>)}
            </ul>
          </div>
          <div className={styles.covers} aria-hidden="true">
            {selectedItems.map((item) => (
              <Image
                className={styles.cover}
                key={`${item.locale}-${item.type}`}
                src={item.cover}
                alt=""
                width={420}
                height={594}
                sizes="(max-width: 720px) 128px, 144px"
              />
            ))}
          </div>
        </div>

        <div className={styles.fields}>
          {(["name", "email", "company", "phone"] as const).map((field) => (
            <label className={styles.field} key={field}>
              <span>
                {copy.fields[field]}
                {field !== "phone" && <span className={styles.requiredMarker} aria-hidden="true"> *</span>}
              </span>
              <input
                name={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "tel"}
                aria-invalid={Boolean(errors[field])}
                aria-describedby={errors[field] ? `${id}-${field}-error` : `${id}-field-hint`}
                required={field !== "phone"}
                disabled={loading}
                onBlur={(event) => updateFieldError(field, event.currentTarget.value)}
                onChange={(event) => {
                  if (errors[field]) updateFieldError(field, event.currentTarget.value);
                }}
              />
              {errors[field] && <small className={styles.error} id={`${id}-${field}-error`}>{errors[field]}</small>}
            </label>
          ))}
        </div>
        <p className={styles.fieldHint} id={`${id}-field-hint`}>{fieldHints[locale]}</p>

        <label className={styles.honeypot} aria-hidden="true">
          {copy.fields.honeypot}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <div className={styles.consentStack}>
          <div>
            <label className={`${styles.consentRow} ${styles.consentRequired}`}>
              <input
                type="checkbox"
                name="consentRequired"
                checked={requiredConsent}
                required
                disabled={loading}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setRequiredConsent(event.target.checked);
                  if (event.target.checked) setErrors((current) => {
                    const next = { ...current };
                    delete next.consent;
                    return next;
                  });
                }}
              />
              <span>
                {copy.consent.requiredBefore}
                <Link href={getPath(locale, "privacy")} target="_blank" rel="noopener noreferrer">
                  {copy.consent.privacyLabel}
                </Link>
                {copy.consent.requiredAfter}
              </span>
            </label>
            {errors.consent && <small className={styles.error} id={`${id}-consent-error`}>{errors.consent}</small>}
          </div>
          <label className={styles.consentRow}>
            <input
              type="checkbox"
              name="consentMarketing"
              checked={marketingConsent}
              disabled={loading}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMarketingConsent(event.target.checked)}
            />
            <span>{copy.consent.optional}</span>
          </label>
        </div>

        <button className={styles.submit} type="submit" disabled={loading} data-track="playbook_submit_click">
          {loading ? copy.loading : copy.submit}
        </button>
        {state === "error" && (
          <p className={styles.status} role="alert" ref={submitErrorRef} tabIndex={-1}>{copy.errors.submit}</p>
        )}
        <p className={styles.trust}>{copy.trust}</p>
      </form>
    </section>
  );
}
