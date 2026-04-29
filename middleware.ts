import { NextRequest, NextResponse } from "next/server";

const germanCountryCodes = new Set(["AT", "DE", "CH", "LI"]);
const allowedPaths = new Set([
  "/en",
  "/en/developers",
  "/en/agents",
  "/en/playbooks",
  "/en/contact",
  "/en/legal/imprint",
  "/en/legal/privacy",
  "/en/legal/cookies",
  "/de",
  "/de/bautraeger",
  "/de/makler",
  "/de/playbooks",
  "/de/kontakt",
  "/de/rechtliches/impressum",
  "/de/rechtliches/datenschutz",
  "/de/rechtliches/cookies"
]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (request.nextUrl.pathname !== "/") {
    if ((pathname.startsWith("/en/") || pathname.startsWith("/de/")) && !allowedPaths.has(pathname)) {
      return new NextResponse("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }
    return NextResponse.next();
  }

  const country = request.geo?.country?.toUpperCase();
  const acceptLanguage = request.headers.get("accept-language") || "";
  const prefersGerman = country ? germanCountryCodes.has(country) : acceptLanguage.toLowerCase().includes("de");
  const url = request.nextUrl.clone();
  url.pathname = prefersGerman ? "/de" : "/en";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/en/:path*", "/de/:path*"]
};
