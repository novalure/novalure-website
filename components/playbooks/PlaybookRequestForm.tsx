"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
type FieldName = "name" | "email" | "company" | "phone" | "consent";

type FormErrors = Partial<Record<FieldName, string>>;

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
  const [role, setRole] = useState<PrimaryPlaybookType>(playbook);
  const [internationalBuyers, setInternationalBuyers] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [requiredConsent, setRequiredConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const selectedKeys = useMemo(
    () => getSelectedPlaybookKeys(locale, role, internationalBuyers),
    [internationalBuyers, locale, role]
  );
  const selectedItems = selectedKeys.map((key) => playbooks[key]);

  function validate(formData: FormData) {
    const nextErrors: FormErrors = {};
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!name) nextErrors.name = copy.errors.required;
    if (!company) nextErrors.company = copy.errors.required;
    if (!email) nextErrors.email = copy.errors.required;
    else if (!isEmail(email)) nextErrors.email = copy.errors.email;
    if (!isPhone(phone)) nextErrors.phone = copy.errors.phone;
    if (!requiredConsent) nextErrors.consent = copy.errors.consent;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!validate(formData)) return;

    const website = String(formData.get("website") || "").trim();
    if (website) {
      setState("success");
      return;
    }

    const consentTimestamp = new Date().toISOString();
    const submissionId = createSubmissionId();
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
    }
  }

  if (state === "success") {
    return (
      <section className={`hubspot-card playbook-request-card hubspot-card-wide ${styles.card} ${compact ? styles.compact : ""}`} aria-live="polite">
        <div className={styles.success}>
          <span className={styles.successMark} aria-hidden="true">✓</span>
          <h3>{selectedKeys.length > 1 ? copy.successMultiple : copy.successSingle}</h3>
          <p>{copy.successBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`hubspot-card playbook-request-card hubspot-card-wide ${styles.card} ${compact ? styles.compact : ""}`}>
      <h2 className={styles.heading}>{copy.heading}</h2>
      <form className={styles.form} data-track-form="playbook" noValidate onSubmit={onSubmit}>
        <fieldset className={styles.roleFieldset}>
          <legend>{copy.roleLegend}</legend>
          {(["developer", "agent"] as const).map((option) => {
            const selected = role === option;
            return (
              <label className={`${styles.roleCard} ${selected ? styles.roleCardSelected : ""}`} key={option}>
                <input
                  type="radio"
                  name="role"
                  value={option}
                  checked={selected}
                  disabled={!selectable}
                  onChange={() => setRole(option)}
                />
                <span>
                  <strong>{copy.roles[option].title}</strong>
                  <small>{copy.roles[option].description}</small>
                </span>
              </label>
            );
          })}
        </fieldset>

        <label className={styles.addOn}>
          <input
            type="checkbox"
            name="internationalBuyers"
            checked={internationalBuyers}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInternationalBuyers(event.target.checked)}
          />
          <span>
            <strong>{copy.international.label}</strong>
            <small>{copy.international.help}</small>
          </span>
        </label>

        <div className={styles.selectionPanel} aria-live="polite">
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
                sizes="112px"
              />
            ))}
          </div>
        </div>

        <div className={styles.fields}>
          {(["name", "email", "company", "phone"] as const).map((field) => (
            <label className={styles.field} key={field}>
              <span>{copy.fields[field]}</span>
              <input
                name={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "tel"}
                aria-invalid={Boolean(errors[field])}
                required={field !== "phone"}
              />
              {errors[field] && <small className={styles.error}>{errors[field]}</small>}
            </label>
          ))}
        </div>

        <label className={styles.honeypot} aria-hidden="true">
          {copy.fields.honeypot}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <div className={styles.consentStack}>
          <label className={styles.consentRow}>
            <input
              type="checkbox"
              name="consentRequired"
              checked={requiredConsent}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRequiredConsent(event.target.checked)}
            />
            <span>
              {copy.consent.requiredBefore}
              <Link href={getPath(locale, "privacy")} target="_blank" rel="noopener noreferrer">
                {copy.consent.privacyLabel}
              </Link>
              {copy.consent.requiredAfter}
            </span>
          </label>
          <label className={styles.consentRow}>
            <input
              type="checkbox"
              name="consentMarketing"
              checked={marketingConsent}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMarketingConsent(event.target.checked)}
            />
            <span>{copy.consent.optional}</span>
          </label>
          {errors.consent && <small className={styles.error}>{errors.consent}</small>}
        </div>

        <button className={styles.submit} type="submit" disabled={state === "loading"} data-track="playbook_submit_click">
          {state === "loading" ? copy.loading : copy.submit}
        </button>
        {state === "error" && <p className={styles.status}>{copy.errors.submit}</p>}
        <p className={styles.trust}>{copy.trust}</p>
      </form>
    </section>
  );
}
