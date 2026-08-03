import { NextRequest, NextResponse } from "next/server";

import { geolocation } from "@vercel/functions";

const germanCountryCodes = new Set(["AT", "DE", "CH"]);

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
  "/de/rechtliches/cookies"
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
  "/de/immobilien-crm-handover": "/de/systembeispiel"
};

function goneDocument(locale: "de" | "en") {
  const de = locale === "de";
  const title = de ? "Diese Seite ist nicht mehr verfügbar." : "This page is no longer available.";
  const body = de
    ? "Der aufgerufene Link ist veraltet. Auf der Startseite finden Sie die aktuellen Inhalte und nächsten Schritte."
    : "The link you opened is outdated. Visit the homepage for the current content and next steps.";
  const cta = de ? "Zur Startseite" : "Back to home";

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
            <h1 style="margin:0;font-family:Georgia,serif;font-size:clamp(34px,7vw,52px);font-weight:400;line-height:1.08">${title}</h1>
            <p style="max-width:560px;margin:20px 0 0;color:#4a5570;line-height:1.7">${body}</p>
            <a href="/${locale}" style="display:inline-flex;min-height:48px;align-items:center;margin-top:28px;padding:0 22px;color:#0e1b33;border-radius:9px;background:#c7a55b;font-size:15px;font-weight:700;text-decoration:none">${cta}</a>
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
    if ((pathname.startsWith("/en/") || pathname.startsWith("/de/")) && !allowedPaths.has(pathname)) {
      const locale = pathname.startsWith("/de/") ? "de" : "en";
      return new NextResponse(goneDocument(locale), {
        status: 410,
        headers: {
          "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex, nofollow"
        }
      });
    }
    return NextResponse.next();
  }

  const country = geolocation(request)?.country?.toUpperCase();
  const prefersGerman = country ? germanCountryCodes.has(country) : false;
  const url = request.nextUrl.clone();
  url.pathname = prefersGerman ? "/de" : "/en";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/en/:path*", "/de/:path*"]
};
