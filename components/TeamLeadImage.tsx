"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type ImageState = "photo" | "fallback";

export function TeamLeadImage({ locale }: { locale: Locale }) {
  const [imageState, setImageState] = useState<ImageState>("photo");
  const alt = locale === "de" ? "Franz Romih, Teamleitung bei NovaLure" : locale === "es" ? "Franz Romih, responsable de equipo de NovaLure" : "Franz Romih, Team Lead at NovaLure";

  return (
    <div className={`team-lead-media ${imageState === "fallback" ? "is-fallback" : ""}`}>
      {/*
        TODO: Echtes Foto von Franz Romih ergänzen.
        Pfad:     /public/team/franz-romih.jpg
        Spec:     quadratisch, mindestens 800x800px, JPG/WebP, optimiert.
        Fallback: /public/team/franz-romih-placeholder.jpg
        Letzter Fallback: Initialen-Kachel "FR".
      */}
      <Image
        src={imageState === "photo" ? "/team/franz-romih.jpg" : "/team/franz-romih-placeholder.jpg"}
        alt={alt}
        width={320}
        height={320}
        className="team-lead-image"
        priority={false}
        onError={() => setImageState("fallback")}
      />
      <span className="team-lead-initials" aria-hidden="true">FR</span>
    </div>
  );
}
