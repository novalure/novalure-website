import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page v3-state-page">
      <section className="state-card v3-state-card">
        <span className="v3-state-mark" aria-hidden="true">404</span>
        <p className="v3-kicker"><span aria-hidden="true" />Page not found</p>
        <h1>This page was not found.</h1>
        <p>Choose the English or German website to continue.</p>
        <div className="v3-state-actions">
          <Link className="v3-button v3-button-primary" href="/en">English</Link>
          <Link className="v3-button v3-button-secondary" href="/de">Deutsch</Link>
        </div>
      </section>
    </main>
  );
}
