"use client";

import { useEffect } from "react";

export function TrackingPlaceholders() {
  useEffect(() => {
    function activate(event: Event) {
      const consent = (event as CustomEvent<string>).detail;
      if (consent !== "all") return;
      window.dispatchEvent(new CustomEvent("novalure:tracking-ready", {
        detail: {
          gtm: process.env.NEXT_PUBLIC_GTM_ID || "GTM placeholder missing",
          ga: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "GA4 placeholder missing",
          meta: process.env.NEXT_PUBLIC_META_PIXEL_ID || "Meta Pixel placeholder missing",
          linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "LinkedIn placeholder missing",
          hubspot: process.env.NEXT_PUBLIC_HUBSPOT_TRACKING_CODE_ID || "HubSpot tracking placeholder missing"
        }
      }));
    }

    window.addEventListener("novalure:consent", activate);
    return () => window.removeEventListener("novalure:consent", activate);
  }, []);

  return null;
}
