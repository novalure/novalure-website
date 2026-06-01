import type { Locale } from "@/lib/i18n";

export function FunnelHeroVisual({ locale }: { locale: Locale }) {
  const label = locale === "de"
    ? "Animation: rohe Immobilien-Leads werden durch NovaLure qualifiziert und vorbereitet an den Vertrieb übergeben."
    : "Animation: raw real estate leads are qualified by NovaLure and handed over to sales with context.";

  return (
    <div className="funnel-hero-visual hero-video-visual" aria-label={label}>
      <video
        className="hero-loop-video hero-loop-video-desktop"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/novalure-hero-transparent-desktop.webm?v=20260526-desktop" type="video/webm" />
      </video>
      <video
        className="hero-loop-video hero-loop-video-mobile"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/novalure-hero-transparent-mobile.webm?v=20260526-mobile-tablet-alpha" type="video/webm" />
      </video>
      <div className="hero-video-fallback" aria-hidden="true">
        <span>NovaLure System</span>
        <strong>{locale === "de" ? "Kontext vor dem ersten Gespräch" : "Context before the first call"}</strong>
      </div>
    </div>
  );
}
