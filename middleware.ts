import { NextRequest, NextResponse } from "next/server";

import { geolocation } from "@vercel/functions";

const germanCountryCodes = new Set(["AT", "DE", "CH"]);
const spanishCountryCodes = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GQ", "GT",
  "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE"
]);
const localeCookieName = "novalure_locale";

const allowedPaths = new Set([
  "/en",
  "/en/developers",
  "/en/agents",
  "/en/playbooks",
  "/en/contact",
  "/en/system-example",
  "/en/playbooks/thank-you",
  "/en/contact/thank-you",
  "/en/legal/imprint",
  "/en/legal/privacy",
  "/en/legal/cookies",
  "/de",
  "/de/bautraeger",
  "/de/makler",
  "/de/playbooks",
  "/de/kontakt",
  "/de/systembeispiel",
  "/de/playbooks/danke",
  "/de/kontakt/danke",
  "/de/rechtliches/impressum",
  "/de/rechtliches/datenschutz",
  "/de/rechtliches/cookies",
  "/es",
  "/es/promotores",
  "/es/agencias-inmobiliarias",
  "/es/playbooks",
  "/es/analisis-del-proyecto",
  "/es/ejemplo-del-sistema",
  "/es/playbooks/gracias",
  "/es/analisis-del-proyecto/gracias",
  "/es/aviso-legal",
  "/es/privacidad",
  "/es/cookies"
]);

const redirects: Record<string, string> = {
  "/en/audit": "/en/contact#audit-form",
  "/de/audit": "/de/kontakt#audit-form",
  "/de/pipeline-audit": "/de/kontakt#audit-form",
  "/en/playbook": "/en/playbooks",
  "/de/playbook": "/de/playbooks",
  "/en/imprint": "/en/legal/imprint",
  "/en/privacy": "/en/legal/privacy",
  "/en/cookies": "/en/legal/cookies",
  "/en/terms": "/en/contact#audit-form",
  "/en/real-estate-crm-handover": "/en/system-example",
  "/de/impressum": "/de/rechtliches/impressum",
  "/de/datenschutz": "/de/rechtliches/datenschutz",
  "/de/cookies": "/de/rechtliches/cookies",
  "/de/immobilien-crm-handover": "/de/systembeispiel",
  "/es/playbook": "/es/playbooks",
  "/es/contacto": "/es/analisis-del-proyecto#audit-form",
  "/es/sistema": "/es/ejemplo-del-sistema",
  "/es/proceso": "/es#proceso"
};

export function selectLocale({
  cookieLocale,
  country,
  acceptLanguage
}: {
  cookieLocale?: string;
  country?: string;
  acceptLanguage?: string;
}): "de" | "en" | "es" {
  if (cookieLocale === "de" || cookieLocale === "en" || cookieLocale === "es") return cookieLocale;

  const countryCode = country?.toUpperCase();
  if (countryCode && spanishCountryCodes.has(countryCode)) return "es";
  if (countryCode && germanCountryCodes.has(countryCode)) return "de";

  const browserLocale = (acceptLanguage || "")
    .toLowerCase()
    .split(",")
    .map((entry) => entry.trim().split(";")[0])
    .find((entry) => entry.startsWith("es") || entry.startsWith("de") || entry.startsWith("en"));

  return browserLocale?.startsWith("es") ? "es" : browserLocale?.startsWith("de") ? "de" : "en";
}

function goneDocument(locale: "de" | "en" | "es") {
  const copy = {
    de: {
      title: "Diese Seite ist nicht mehr verfügbar.",
      body: "Der aufgerufene Link ist veraltet. Auf der Startseite finden Sie die aktuellen Inhalte und nächsten Schritte.",
      cta: "Zur Startseite"
    },
    en: {
      title: "This page is no longer available.",
      body: "The link you opened is outdated. Visit the homepage for the current content and next steps.",
      cta: "Back to home"
    },
    es: {
      title: "Esta página ya no está disponible.",
      body: "El enlace que ha abierto está desactualizado. En la página de inicio encontrará los contenidos y próximos pasos actuales.",
      cta: "Volver al inicio"
    }
  }[locale];

  return `<!doctype html>
    <html lang="${locale}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>410 | NovaLure</title>
      </head>
      <body style="box-sizing:border-box;margin:0;min-height:100vh;color:#0e1b33;background:#fdfcfa;font-family:Arial,sans-serif">
        <header style="display:flex;min-height:72px;align-items:center;padding:0 max(20px,4vw);border-bottom:1px solid rgba(14,27,51,.09)"><strong style="font-size:19px;letter-spacing:.16em">NOVALURE</strong></header>
        <main style="display:grid;min-height:calc(100vh - 72px);place-items:center;padding:40px 20px;background:radial-gradient(circle at 8% 0%,rgba(199,165,91,.16),transparent 30%),radial-gradient(circle at 92% 22%,rgba(14,27,51,.07),transparent 34%),#fdfcfa">
          <section style="box-sizing:border-box;width:min(680px,100%);padding:clamp(28px,5vw,52px);border:1px solid rgba(14,27,51,.1);border-radius:18px;background:#fff;box-shadow:0 24px 70px rgba(14,27,51,.12)">
            <span style="display:grid;width:58px;height:58px;place-items:center;margin-bottom:26px;border-radius:50%;background:#c7a55b;font-size:13px;font-weight:800">410</span>
            <p style="margin:0 0 16px;color:#8f6f2e;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">NovaLure</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:clamp(34px,7vw,52px);font-weight:400;line-height:1.08">${copy.title}</h1>
            <p style="max-width:560px;margin:20px 0 0;color:#4a5570;line-height:1.7">${copy.body}</p>
            <a href="/${locale}" style="display:inline-flex;min-height:48px;align-items:center;margin-top:28px;padding:0 22px;color:#0e1b33;border-radius:9px;background:#c7a55b;font-size:15px;font-weight:700;text-decoration:none">${copy.cta}</a>
          </section>
        </main>
      </body>
    </html>`;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (redirects[pathname]) {
    const url = request.nextUrl.clone();
    const [targetPath, hash] = redirects[pathname].split("#");
    url.pathname = targetPath;
    url.hash = hash ? `#${hash}` : "";
    return NextResponse.redirect(url, 301);
  }

  if (request.nextUrl.pathname !== "/") {
    if ((pathname.startsWith("/en/") || pathname.startsWith("/de/") || pathname.startsWith("/es/")) && !allowedPaths.has(pathname)) {
      const locale = pathname.startsWith("/de/") ? "de" : pathname.startsWith("/es/") ? "es" : "en";
      return new NextResponse(goneDocument(locale), {
        status: 410,
        headers: {
          "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex, nofollow"
        }
      });
    }
    const requestHeaders = new Headers(request.headers);
    const routeLocale = pathname === "/de" || pathname.startsWith("/de/")
      ? "de-DE"
      : pathname === "/es" || pathname.startsWith("/es/")
        ? "es-ES"
        : "en-GB";
    requestHeaders.set("x-novalure-document-language", routeLocale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const country = geolocation(request)?.country?.toUpperCase();
  const locale = selectLocale({
    cookieLocale,
    country,
    acceptLanguage: request.headers.get("accept-language") || ""
  });
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;

  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Cookie, Accept-Language, X-Vercel-IP-Country");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/", "/en/:path*", "/de/:path*", "/es/:path*"]
};
