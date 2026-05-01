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

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function loadGoogleAnalytics() {
  if (!gaMeasurementId || gaMeasurementId === "G-XXXXXXXXXX") return;

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
  window.gtag = window.gtag || function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId, {
    send_page_view: false,
    anonymize_ip: true
  });
}

function disableGoogleAnalytics() {
  if (!gaMeasurementId || gaMeasurementId === "G-XXXXXXXXXX") return;
  const disableKey = `ga-disable-${gaMeasurementId}`;
  window[disableKey as keyof Window] = true as never;
}

function sendPageView(path: string) {
  if (!gaMeasurementId || gaMeasurementId === "G-XXXXXXXXXX" || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
  });
}

export function TrackingPlaceholders() {
  const pathname = usePathname();
  const analyticsAllowed = useRef(false);
  const lastPageView = useRef<string | null>(null);

  useEffect(() => {
    function activate(event: Event) {
      const consent = (event as CustomEvent<ConsentState>).detail;
      analyticsAllowed.current = Boolean(consent.analytics);

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
    }

    window.addEventListener("novalure:consent", activate);
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
