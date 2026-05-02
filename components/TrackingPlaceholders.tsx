"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  external: boolean;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

function loadGoogleAnalytics() {
  if (!gaMeasurementId || gaMeasurementId === "G-XXXXXXXXXX") return;

  try {
    const disableKey = `ga-disable-${gaMeasurementId}`;
    window[disableKey as keyof Window] = false as never;

    if (!document.querySelector(`script[data-novalure-ga="${gaMeasurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      script.dataset.novalureGa = gaMeasurementId;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, {
      send_page_view: false,
      anonymize_ip: true
    });
  } catch {
    // Tracking must never block the website render.
  }
}

function disableGoogleAnalytics() {
  if (!gaMeasurementId || gaMeasurementId === "G-XXXXXXXXXX") return;
  try {
    const disableKey = `ga-disable-${gaMeasurementId}`;
    window[disableKey as keyof Window] = true as never;
  } catch {
    // Ignore browser privacy restrictions.
  }
}

function sendPageView(path: string) {
  if (!gaMeasurementId || gaMeasurementId === "G-XXXXXXXXXX" || !window.gtag) return;

  try {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title
    });
  } catch {
    // Ignore analytics delivery failures.
  }
}

export function TrackingPlaceholders() {
  const pathname = usePathname();
  const analyticsAllowed = useRef(false);
  const lastPageView = useRef<string | null>(null);

  useEffect(() => {
    function readSavedConsent() {
      try {
        const saved = window.localStorage.getItem("novalure-cookie-consent");
        const parsed = saved ? JSON.parse(saved) as Partial<ConsentState> : null;
        if (!parsed || typeof parsed !== "object") return null;
        return {
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          external: Boolean(parsed.external)
        };
      } catch {
        return null;
      }
    }

    function activate(event: Event) {
      try {
        const detail = (event as CustomEvent<Partial<ConsentState>>).detail;
        const consent: ConsentState = {
          analytics: Boolean(detail?.analytics),
          marketing: Boolean(detail?.marketing),
          external: Boolean(detail?.external)
        };
        analyticsAllowed.current = consent.analytics;

        if (consent.analytics) {
          loadGoogleAnalytics();
          sendPageView(`${window.location.pathname}${window.location.search}`);
        } else {
          disableGoogleAnalytics();
        }

        if (consent.analytics || consent.marketing) {
          window.dispatchEvent(new CustomEvent("novalure:tracking-ready", {
            detail: {
              analytics: consent.analytics,
              marketing: consent.marketing,
              external: consent.external,
              ga: consent.analytics ? gaMeasurementId || "GA4 placeholder missing" : null,
              gtm: consent.analytics || consent.marketing ? process.env.NEXT_PUBLIC_GTM_ID || "GTM placeholder missing" : null,
              hotjar: consent.analytics ? "Hotjar placeholder configured through GTM or direct script" : null,
              meta: consent.marketing ? process.env.NEXT_PUBLIC_META_PIXEL_ID || "Meta Pixel placeholder missing" : null,
              linkedin: consent.marketing ? process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "LinkedIn placeholder missing" : null,
              hubspot: consent.marketing ? process.env.NEXT_PUBLIC_HUBSPOT_TRACKING_CODE_ID || "HubSpot tracking placeholder missing" : null
            }
          }));
        }
      } catch {
        analyticsAllowed.current = false;
      }
    }

    window.addEventListener("novalure:consent", activate);
    const savedConsent = readSavedConsent();
    if (savedConsent) {
      activate(new CustomEvent("novalure:consent", { detail: savedConsent }));
    }
    return () => window.removeEventListener("novalure:consent", activate);
  }, []);

  useEffect(() => {
    if (!analyticsAllowed.current) return;
    const page = `${pathname}${window.location.search}`;
    if (lastPageView.current === page) return;
    lastPageView.current = page;
    sendPageView(page);
  }, [pathname]);

  return null;
}
