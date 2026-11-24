"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

const prompt = `Überarbeite die bestehende Kontaktseite meiner Kanzlei-Website. Prüfe zuerst den vorhandenen Aufbau, das Designsystem und die technischen Anforderungen. Verwende den bestehenden Stack und verändere keine anderen Seiten oder Inhalte unnötig.

Ziel: Das Kontaktformular soll sofort als Formular erkennbar und einfach zu bedienen sein, ohne den reduzierten Schwarz-Weiß-Auftritt der Kanzlei zu verlieren. Die Seite soll persönlich, vertrauenswürdig und klar wirken.

Gestaltung:
- Behalte die bestehende Typografie und die große Überschrift „Reden wir darüber.“ bei. Setze das Formular in eine helle, deutlich vom dunklen Hintergrund abgesetzte Fläche.
- Verwende dunkle, dauerhaft sichtbare Beschriftungen und klar umrandete oder gefüllte Eingabefelder. Der Kontrast von Text muss mindestens 4,5:1, der für notwendige Feldbegrenzungen und Fokusmarkierungen mindestens 3:1 betragen.
- Platziere auf großen Bildschirmen Einleitung und Kontaktdaten links und das Formular rechts. Auf schmalen Bildschirmen ordne alles einspaltig an und ergänze bei Bedarf einen gut sichtbaren Sprunglink zum Formular. Prüfe Desktop, Tablet und Smartphone.
- Sorge für ausreichend große Bedienelemente, sichtbaren Tastaturfokus, sinnvolle Tab-Reihenfolge und gut lesbare Schrift. Respektiere reduzierte Bewegung.

Inhalt und Funktion:
- Halte das Formular kurz: „Worum geht es?“ mit den Optionen Kauf oder Verkauf, Schenkung oder Übergabe, rechtliche Klärung oder Vertretung und ein anderes Anliegen; die Auswahl ist optional. Name, E-Mail-Adresse und Nachricht sind Pflichtfelder und als solche erkennbar. Eine Telefonnummer nur bei Bedarf optional anbieten.
- Bitte direkt vor dem Nachrichtenfeld darum, zunächst keine vertraulichen Unterlagen oder sensiblen Details zu senden. Erkläre die Datenschutzverarbeitung und verlinke die gültige Datenschutzerklärung der Kanzlei. Den vorhandenen Hinweis, dass Aufwand und Honorar vor kostenpflichtigen Leistungen geklärt werden, beibehalten.
- Zeige verständliche Hinweise bei fehlenden oder ungültigen Angaben sowie sichtbare Lade-, Erfolgs- und Fehlerzustände. Erhalte eingegebene Daten bei einem Fehler. Verwende passende Autocomplete-Felder und serverseitige Validierung sowie angemessenen Spam-Schutz.
- Ermittle vor der Umsetzung gemeinsam mit mir den tatsächlichen E-Mail-Empfänger der Kanzlei und nutze ausschließlich diesen. Verwende keine Adresse aus einer Vorschau. Prüfe die datenschutzkonforme Verarbeitung und den bestehenden Versandweg; erfinde keine Versandbestätigung oder Rückmeldefrist.

Teste die Bedienung mit Tastatur, die Lesbarkeit und die Darstellung auf mehreren Bildschirmgrößen. Teste den tatsächlichen Versand nur mit vorher vereinbarten Testdaten und prüfe Erfolg sowie Fehlerfall. Gib mir anschließend eine kurze Zusammenfassung der Änderungen und offener Punkte. Veröffentliche Änderungen erst nach meiner ausdrücklichen Freigabe.`;

type Status = "idle" | "sending" | "success" | "error";

export function LudwigPreview() {
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    setStatus("sending");
    try {
      const response = await fetch("/api/kanzlei-ludwig-kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="ludwig" lang="de-AT" id="anfang">
      <a className="ludwig-skip" href="#kontaktformular">Zum Formular springen</a>
      <div className="ludwig-preview-bar">Entwurf von Novalure Studio <span aria-hidden="true">/</span> Vorschau für Kanzlei Ludwig</div>
      <header className="ludwig-header">
        <div className="ludwig-brand">MAG. DANIEL LUDWIG LL.M.<span>RECHTSANWALT · SCHWAZ</span></div>
        <a href="#kontaktformular">Kontakt <span aria-hidden="true">↗</span></a>
      </header>
      <section className="ludwig-contact" aria-labelledby="ludwig-title">
        <div className="ludwig-topline"><span>KONTAKT / DANIEL LUDWIG</span><span>SCHWAZ · TIROL</span></div>
        <div className="ludwig-grid">
          <div className="ludwig-intro">
            <h1 id="ludwig-title">Reden wir<br /><span>darüber.</span></h1>
            <p className="ludwig-lead">Schildern Sie mir kurz Ihr Anliegen. Ich melde mich bei Ihnen, um die nächsten Schritte zu besprechen.</p>
            <p className="ludwig-fee">Aufwand und Honorar klären wir, bevor kostenpflichtige Leistungen beginnen.</p>
            <a className="ludwig-mobile-jump" href="#kontaktformular">Zum Kontaktformular <span aria-hidden="true">↓</span></a>
            <div className="ludwig-details">
              <p><a href="mailto:office@kanzlei-ludwig.at">office@kanzlei-ludwig.at <span aria-hidden="true">↗</span></a><br /><a href="tel:+43524298212">+43 5242 98212</a></p>
              <p>Mag. Daniel Ludwig LL.M.<br />Münchner Straße 15 · Osttrakt<br />3. Stock · Top 12<br />6130 Schwaz, Tirol</p>
            </div>
          </div>
          <div className="ludwig-form-card" id="kontaktformular">
            <div className="ludwig-card-top"><span>KONTAKTFORMULAR</span><span aria-hidden="true">↗</span></div>
            <h2>Ihr Anliegen.<br /><span>In wenigen Worten.</span></h2>
            <p className="ludwig-card-intro">Ein kurzer erster Schritt genügt. Beschreiben Sie, worüber Sie sprechen möchten.</p>
            <div className="ludwig-demo-notice"><strong>Bitte beachten: Vorschauformular</strong><br />Nachrichten von dieser Seite gehen an <strong>hello@novalure.eu</strong>, nicht an die Kanzlei Ludwig. Bitte geben Sie keine vertraulichen oder sensiblen Daten ein.</div>
            <form onSubmit={send}>
              <label htmlFor="ludwig-concern">Worum geht es? <span>Optional</span></label>
              <select id="ludwig-concern" name="concern" defaultValue="">
                <option value="">Bitte auswählen</option><option>Kauf oder Verkauf</option><option>Schenkung oder Übergabe</option><option>Rechtliche Klärung oder Vertretung</option><option>Ein anderes Anliegen</option>
              </select>
              <label htmlFor="ludwig-name">Ihr Name <span>Pflichtfeld</span></label>
              <input id="ludwig-name" name="name" autoComplete="name" placeholder="Vor- und Nachname" required maxLength={120} />
              <label htmlFor="ludwig-email">Ihre E-Mail-Adresse <span>Pflichtfeld</span></label>
              <input id="ludwig-email" name="email" type="email" autoComplete="email" placeholder="name@beispiel.at" required maxLength={254} />
              <label htmlFor="ludwig-message">Ihre Nachricht <span>Pflichtfeld</span></label>
              <p className="ludwig-field-note" id="ludwig-message-note">Bitte senden Sie zunächst keine vertraulichen Unterlagen oder sensiblen Angaben. Mindestens 10 Zeichen.</p>
              <textarea id="ludwig-message" name="message" placeholder="Was möchten Sie besprechen?" required minLength={10} maxLength={3000} rows={4} aria-describedby="ludwig-message-note" />
              <div className="ludwig-trap" aria-hidden="true"><label htmlFor="ludwig-website">Website</label><input id="ludwig-website" name="website" tabIndex={-1} autoComplete="off" /></div>
              <p className="ludwig-privacy">Ihre Angaben werden zur Bearbeitung dieser Vorschau-Anfrage an Novalure übermittelt. Weitere Informationen finden Sie in der <Link href="/de/rechtliches/datenschutz">Datenschutzerklärung</Link>.</p>
              <button className="ludwig-submit" type="submit" disabled={!ready || status === "sending"}>{status === "sending" ? "Wird gesendet …" : "Vorschau-Anfrage senden"}<span aria-hidden="true">↗</span></button>
              <p className={`ludwig-status ${status}`} role="status" aria-live="polite">{status === "success" ? "Vielen Dank. Ihre Nachricht wurde an Novalure übermittelt." : status === "error" ? "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an hello@novalure.eu." : ""}</p>
              <noscript>Für den Formularversand ist JavaScript erforderlich. Sie erreichen Novalure unter hello@novalure.eu.</noscript>
            </form>
          </div>
        </div>
      </section>
      <section className="ludwig-explanation" aria-labelledby="ludwig-why-title">
        <div className="ludwig-section-label">ZUR UMSETZUNG <span>FÜR KANZLEI LUDWIG</span></div>
        <div className="ludwig-explanation-grid">
          <div><h2 id="ludwig-why-title">Ein klarer erster Schritt.</h2><p className="ludwig-explanation-lead">Weniger suchen.<br />Leichter Kontakt aufnehmen.</p></div>
          <div className="ludwig-explanation-copy"><p>Auf der bisherigen Kontaktseite liegen die Formularfelder auf schwarzem Hintergrund und sind hauptsächlich durch feine graue Linien erkennbar. Dadurch können Besucher das Formular leicht übersehen.</p><p>Die helle Fläche macht den Kontaktbereich unmittelbar sichtbar. Klar abgegrenzte Felder, lesbare Beschriftungen und erkennbare Pflichtangaben helfen bei der Orientierung. Das kurze Formular und der Hinweis zum Honorar senken die Hürde für den ersten Kontakt.</p><p><strong>So verwenden Sie den Vorschlag:</strong> Kopieren Sie den folgenden Prompt in Ihr bevorzugtes KI-Werkzeug. Geben Sie ihm Zugriff auf Ihre bestehende Website oder deren Projektdateien und lassen Sie die Änderungen zunächst als Entwurf umsetzen. Prüfen Sie insbesondere Empfänger, Datenschutz und Versand, bevor Sie die Änderung veröffentlichen.</p></div>
        </div>
      </section>
      <section className="ludwig-prompt-section" aria-labelledby="ludwig-prompt-title">
        <div className="ludwig-prompt-head"><div><p>FÜR IHR KI-WERKZEUG</p><h2 id="ludwig-prompt-title">Prompt zur Umsetzung.</h2></div><button type="button" onClick={copyPrompt}>{copied ? "Kopiert ✓" : "Prompt kopieren ↗"}</button></div>
        <pre className="ludwig-prompt" tabIndex={0}>{prompt}</pre>
        <p className="ludwig-prompt-foot">Falls das Kopieren nicht funktioniert, können Sie den Text markieren und manuell kopieren.</p>
      </section>
    </main>
  );
}
