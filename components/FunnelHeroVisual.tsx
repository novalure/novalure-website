import type { Locale } from "@/lib/i18n";

export function FunnelHeroVisual({ locale }: { locale: Locale }) {
  const label = locale === "de"
    ? "Animation: rohe Immobilien-Leads werden durch NovaLure qualifiziert und als CRM-Handover an den Vertrieb übergeben."
    : "Animation: raw real estate leads are qualified by NovaLure and handed over to sales in the CRM.";

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
        <source src="/videos/novalure-hero-transparent-mobile.webm?v=20260525-transparent-mobile" type="video/webm" />
      </video>
      <div className="hero-video-fallback" aria-hidden="true">
        <span>NovaLure CRM</span>
        <strong>{locale === "de" ? "Lead-Kontext vor dem ersten Call" : "Lead context before the first call"}</strong>
      </div>
    </div>
  );
}
