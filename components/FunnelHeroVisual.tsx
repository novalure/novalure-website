import Image from "next/image";
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
        <source src="/videos/novalure-hero-transparent-desktop.webm" type="video/webm" />
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
        <source src="/videos/novalure-hero-transparent-mobile.webm" type="video/webm" />
      </video>
      <Image
        className="hero-loop-poster hero-loop-poster-mobile"
        src="/images/novalure-hero-mobile-poster.png"
        alt=""
        width={1080}
        height={1350}
        aria-hidden="true"
        loading="eager"
        unoptimized
      />
      <div className="hero-video-fallback" aria-hidden="true">
        <span>NovaLure CRM</span>
        <strong>{locale === "de" ? "Lead-Kontext vor dem ersten Call" : "Lead context before the first call"}</strong>
      </div>
    </div>
  );
}
