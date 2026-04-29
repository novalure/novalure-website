"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="state-page">
      <section className="state-card" role="alert">
        <p className="eyebrow">Error state</p>
        <h1>Something did not load correctly.</h1>
        <p>The page shell is ready, but a runtime dependency failed. Try again or check the connected CMS and environment IDs.</p>
        <button className="button button-primary" type="button" onClick={() => reset()}>Try again</button>
      </section>
    </main>
  );
}
