"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="state-page">
          <section className="state-card" role="alert">
            <p className="eyebrow">Global error</p>
            <h1>Novalure could not render.</h1>
            <p>Check environment configuration, rebuild the project and try again.</p>
            <button className="button button-primary" type="button" onClick={() => reset()}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
