"use client";

import { useEffect } from "react";

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  external: boolean;
};

export function TrackingPlaceholders() {
  useEffect(() => {
    function activate(event: Event) {
      const consent = (event as CustomEvent<ConsentState>).detail;
      if (!consent.analytics && !consent.marketing) return;
      window.dispatchEvent(new CustomEvent("novalure:tracking-ready", {
        detail: {
          analytics: consent.analytics,
          marketing: consent.marketing,
          external: consent.external,
          gtm: consent.analytics || consent.marketing ? process.env.NEXT_PUBLIC_GTM_ID || "GTM placeholder missing" : null,
          ga: consent.analytics ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "GA4 placeholder missing" : null,
          hotjar: consent.analytics ? "Hotjar placeholder configured through GTM or direct script" : null,
          meta: consent.marketing ? process.env.NEXT_PUBLIC_META_PIXEL_ID || "Meta Pixel placeholder missing" : null,
          linkedin: consent.marketing ? process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "LinkedIn placeholder missing" : null,
          hubspot: consent.marketing ? process.env.NEXT_PUBLIC_HUBSPOT_TRACKING_CODE_ID || "HubSpot tracking placeholder missing" : null
        }
      }));
    }

    window.addEventListener("novalure:consent", activate);
    return () => window.removeEventListener("novalure:consent", activate);
  }, []);

  return null;
}
