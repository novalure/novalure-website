import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page">
      <section className="state-card">
        <p className="eyebrow">404</p>
        <h1>This page was not found.</h1>
        <p>Choose the English or German website to continue.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/en">English</Link>
          <Link className="button button-secondary" href="/de">Deutsch</Link>
        </div>
      </section>
    </main>
  );
}
