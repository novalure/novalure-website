"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="state-page v3-state-page">
          <section className="state-card v3-state-card" role="alert">
            <span className="v3-state-mark" aria-hidden="true">!</span>
            <p className="v3-kicker"><span aria-hidden="true" />Error</p>
            <h1>NovaLure could not load.</h1>
            <p>Please try again. If the problem continues, return to the website later.</p>
            <div className="v3-state-actions">
              <button className="v3-button v3-button-primary" type="button" onClick={() => reset()}>Try again</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
