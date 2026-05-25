import { NextRequest, NextResponse } from "next/server";

const germanCountryCodes = new Set(["AT", "DE", "CH"]);

const allowedPaths = new Set([
  "/en",
  "/en/developers",
  "/en/agents",
  "/en/playbooks",
  "/en/contact",
  "/en/real-estate-crm-handover",
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
  "/de/immobilien-crm-handover",
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
  "/de/impressum": "/de/rechtliches/impressum",
  "/de/datenschutz": "/de/rechtliches/datenschutz",
  "/de/cookies": "/de/rechtliches/cookies"
};

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
      return new NextResponse("Gone", {
        status: 410,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-robots-tag": "noindex, nofollow"
        }
      });
    }
    return NextResponse.next();
  }

  const country = request.geo?.country?.toUpperCase();
  const prefersGerman = country ? germanCountryCodes.has(country) : false;
  const url = request.nextUrl.clone();
  url.pathname = prefersGerman ? "/de" : "/en";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/en/:path*", "/de/:path*"]
};
