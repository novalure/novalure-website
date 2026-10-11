"use client";

import { useState } from "react";
import Link from "next/link";
import { getPath, type Locale } from "@/lib/i18n";
import { playbooks, privacyPolicyVersion, type PlaybookKey } from "@/lib/playbooks-meta";
import styles from "./EditorialPlaybooksPage.module.css";

const copy = {
  de: { title: "Ihr Playbook anfordern", select: "Gewünschte Ausgabe", email: "E-Mail-Adresse", marketing: "Optional: Ich möchte später relevante Inhalte und Angebote per E-Mail erhalten. Diese Einwilligung kann ich jederzeit widerrufen.", privacy: "Wir verwenden Ihre E-Mail für die Zustellung. Weitere E-Mails erhalten Sie nur nach gesonderter Bestätigung. Details im Datenschutz.", submit: "Playbook anfordern", loading: "Wird versendet …", done: "Ihr Playbook wurde per E-Mail versendet. Sie können es auch sofort hier öffnen.", open: "PDF jetzt öffnen", error: "Der Versand hat nicht funktioniert. Bitte versuchen Sie es erneut." },
  en: { title: "Request your playbook", select: "Choose an edition", email: "Email address", marketing: "Optional: I would like relevant content and offers by email later. I can withdraw this choice at any time.", privacy: "We use your email to deliver the PDF. Further emails require separate confirmation. See our privacy notice.", submit: "Request playbook", loading: "Sending …", done: "Your playbook has been sent by email. You can also open it here now.", open: "Open PDF now", error: "Delivery failed. Please try again." },
  es: { title: "Solicite su playbook", select: "Elija una edición", email: "Correo electrónico", marketing: "Opcional: Deseo recibir más adelante contenidos y ofertas relevantes por correo. Puedo retirar esta elección en cualquier momento.", privacy: "Usamos su correo para entregar el PDF. Otros correos requieren confirmación aparte. Consulte la política de privacidad.", submit: "Solicitar el playbook", loading: "Enviando …", done: "Hemos enviado el playbook por correo. También puede abrirlo ahora aquí.", open: "Abrir PDF ahora", error: "No se ha podido enviar. Inténtelo de nuevo." }
};

export function FieldGuideRequestForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const keys = [`${locale}-developer`, `${locale}-agent`, `${locale}-international`] as PlaybookKey[];
  const [selection, setSelection] = useState<PlaybookKey>(keys[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (String(values.get("website") || "").trim()) { setStatus("done"); return; }
    setStatus("loading");
    try {
      const response = await fetch("/api/playbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "field-guide", locale, playbookKey: selection,
          email: String(values.get("email") || "").trim(),
          consentMarketing: values.get("marketing") === "on",
          consentTimestamp: new Date().toISOString(), privacyPolicyVersion,
          submissionId: crypto.randomUUID()
        })
      });
      if (!response.ok) throw new Error(`Delivery: ${response.status}`);
      const result = await response.json();
      setDownloadUrl(result.downloadUrl);
      setStatus("done");
    } catch { setStatus("error"); }
  }

  return <section className={styles.formSection} id="playbook-download" aria-labelledby="field-guide-form-title">
    <div className={styles.formIntro}><span>04 / PDF</span><h2 id="field-guide-form-title">{t.title}</h2><p>{t.privacy} <Link href={getPath(locale, "privacy")}>{locale === "de" ? "Datenschutz" : locale === "es" ? "Privacidad" : "Privacy"}</Link></p></div>
    {status === "done" ? <div className={styles.success} role="status"><p>{t.done}</p>{downloadUrl && <a className={styles.primaryButton} href={downloadUrl} target="_blank" rel="noopener noreferrer">{t.open}</a>}</div> :
      <form className={styles.form} onSubmit={submit} aria-busy={status === "loading"}>
        <label>{t.select}<select value={selection} onChange={e => setSelection(e.target.value as PlaybookKey)}>{keys.map(key => <option key={key} value={key}>{playbooks[key].title}</option>)}</select></label>
        <label>{t.email}<input name="email" type="email" autoComplete="email" required /></label>
        <label className={styles.marketing}><input name="marketing" type="checkbox" /> <span>{t.marketing}</span></label>
        <div className={styles.honeypot} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button className={styles.primaryButton} type="submit" disabled={status === "loading"}>{status === "loading" ? t.loading : t.submit}</button>
        {status === "error" && <p role="alert" className={styles.error}>{t.error}</p>}
      </form>}
  </section>;
}
