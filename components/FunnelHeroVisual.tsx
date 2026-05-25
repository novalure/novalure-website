import Image from "next/image";
import type { Locale } from "@/lib/i18n";

const routes = [
  ["funnel-route-paid", 0],
  ["funnel-route-search", 0.1],
  ["funnel-route-organic", 0.2],
  ["funnel-route-referral", 0.3]
] as const;

export function FunnelHeroVisual({ locale }: { locale: Locale }) {
  const crmCopy = locale === "de"
    ? {
        title: "NovaLure CRM",
        body: "Übergabe mit Kontext",
        fields: ["Quelle", "Motiv", "Timing", "Nächster Schritt"]
      }
    : {
        title: "NovaLure CRM",
        body: "Handover with context",
        fields: ["Source", "Intent", "Timing", "Next step"]
      };

  return (
    <div className="funnel-hero-visual" aria-label="Animated qualified demand funnel">
      <Image
        className="funnel-hero-image"
        src="/nv-funnel-transparent.png"
        alt="3D glass funnel with lead sources flowing through Capture, Qualify and Handover into qualified demand."
        fill
        priority
        sizes="(max-width: 560px) 250vw, (max-width: 900px) calc(100vw - 32px), 62vw"
      />
      <svg
        className="funnel-hero-svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="funnel-title funnel-desc"
      >
        <title id="funnel-title">Animated funnel stage flow</title>
        <desc id="funnel-desc">Lead particles enter the funnel, flow through three stages, and produce gold qualified demand.</desc>

        <defs>
          <filter id="funnel-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="funnel-gold" x1="0" y1="-14" x2="0" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F4D77A" />
            <stop offset="1" stopColor="#A8841C" />
          </linearGradient>
          <g id="funnel-lead">
            <circle r="15" fill="#3B82F6" opacity=".28" filter="url(#funnel-glow)" />
            <circle r="8" fill="#3B82F6" />
          </g>
          <g id="funnel-drop">
            <path d="M0 -14 C9 -3 12 5 6 12 C2 17 -6 17 -10 11 C-16 3 -8 -6 0 -14 Z" fill="url(#funnel-gold)" />
          </g>
        </defs>

        <g aria-hidden="true">
          <rect className="funnel-stage funnel-stage-capture" x="350" y="320" width="360" height="80" rx="40" fill="#2563EB" />
          <rect className="funnel-stage funnel-stage-qualify" x="385" y="420" width="290" height="80" rx="40" fill="#2563EB" />
          <rect className="funnel-stage funnel-stage-handover" x="420" y="520" width="220" height="80" rx="40" fill="#2563EB" />
        </g>

        <g aria-hidden="true">
          <path className="funnel-flow-track" d="M530 290 C530 325 530 335 530 360 C530 392 530 428 530 460 C530 492 530 528 530 560 C530 595 530 615 530 635" />
          <circle className="funnel-stage-node funnel-stage-node-capture" cx="530" cy="360" r="38" />
          <circle className="funnel-stage-node funnel-stage-node-qualify" cx="530" cy="460" r="34" />
          <circle className="funnel-stage-node funnel-stage-node-handover" cx="530" cy="560" r="30" />
          <g className="funnel-flow-bead">
            <circle r="22" fill="#3B82F6" opacity=".28" />
            <circle r="11" fill="#60A5FA" />
          </g>
        </g>

        <g aria-hidden="true">
          <circle className="funnel-source-dot funnel-source-paid" cx="410" cy="140" r="13" fill="#3B82F6" />
          <circle className="funnel-source-dot funnel-source-search" cx="490" cy="140" r="13" fill="#3B82F6" />
          <circle className="funnel-source-dot funnel-source-organic" cx="570" cy="140" r="13" fill="#3B82F6" />
          <circle className="funnel-source-dot funnel-source-referral" cx="650" cy="140" r="13" fill="#3B82F6" />
        </g>

        <g aria-hidden="true">
          {routes.flatMap(([route, phase]) =>
            Array.from({ length: 15 }, (_, index) => (
              <use
                key={`${route}-${index}`}
                href="#funnel-lead"
                className={`funnel-particle ${route}${index % 2 ? " funnel-mobile-skip" : ""}`}
                style={{ animationDelay: `-${(phase + index * 0.4).toFixed(1)}s` }}
              />
            ))
          )}
        </g>

        <g aria-hidden="true">
          <circle className="funnel-outlet-glow" cx="530" cy="635" r="36" fill="#D4AF37" />
          <path className="funnel-gold-stream" d="M530 635 C526 675 535 710 530 750 C528 770 530 792 530 820" fill="none" stroke="url(#funnel-gold)" strokeWidth="14" strokeLinecap="round" />
          <circle className="funnel-gold-halo" cx="530" cy="820" r="80" fill="#D4AF37" />
          <use href="#funnel-drop" className="funnel-drop funnel-drop-1" />
          <use href="#funnel-drop" className="funnel-drop funnel-drop-2" />
          <use href="#funnel-drop" className="funnel-drop funnel-drop-3" />
        </g>
      </svg>
      <div className="funnel-crm-card" aria-hidden="true">
        <span>{crmCopy.title}</span>
        <strong>{crmCopy.body}</strong>
        <ul>
          {crmCopy.fields.map((field) => <li key={field}>{field}</li>)}
        </ul>
      </div>
    </div>
  );
}
