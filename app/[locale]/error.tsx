"use client";

import { usePathname } from "next/navigation";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname();
  const de = pathname.startsWith("/de");
  const es = pathname.startsWith("/es");
  const copy = de
    ? {
        eyebrow: "Fehler",
        title: "Diese Seite konnte nicht vollständig geladen werden.",
        body: "Bitte versuchen Sie es erneut. Wenn der Fehler bestehen bleibt, können Sie jederzeit zur Startseite zurückkehren.",
        retry: "Erneut versuchen"
      }
    : es
      ? {
          eyebrow: "Error",
          title: "No hemos podido cargar esta página por completo.",
          body: "Inténtelo de nuevo. Si el problema continúa, puede volver a la página de inicio.",
          retry: "Volver a intentarlo"
        }
      : {
        eyebrow: "Error",
        title: "This page could not be loaded completely.",
        body: "Please try again. If the problem continues, you can return to the homepage at any time.",
        retry: "Try again"
      };

  return (
    <main className="state-page v3-state-page">
      <section className="state-card v3-state-card" role="alert">
        <span className="v3-state-mark" aria-hidden="true">!</span>
        <p className="v3-kicker"><span aria-hidden="true" />{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="v3-state-actions">
          <button className="v3-button v3-button-primary" type="button" onClick={() => reset()}>{copy.retry}</button>
        </div>
      </section>
    </main>
  );
}
