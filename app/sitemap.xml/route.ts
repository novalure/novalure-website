import { allPageKeys, locales, routeMap } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";
const indexablePageKeys = allPageKeys.filter((key) => !["imprint", "privacy", "cookies"].includes(key));

export const dynamic = "force-static";

export function GET() {
  const now = new Date().toISOString();
  const entries = indexablePageKeys.flatMap((key) =>
    locales.map((locale) => {
      const priority = key === "home" ? "1.0" : "0.7";
      const frequency = key === "home" ? "weekly" : "monthly";

      return [
        "<url>",
        `<loc>${escapeXml(`${siteUrl}${routeMap[key][locale]}`)}</loc>`,
        `<xhtml:link rel="alternate" hreflang="en-US" href="${escapeXml(`${siteUrl}${routeMap[key].en}`)}" />`,
        `<xhtml:link rel="alternate" hreflang="de-DE" href="${escapeXml(`${siteUrl}${routeMap[key].de}`)}" />`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${siteUrl}${routeMap[key].en}`)}" />`,
        `<lastmod>${now}</lastmod>`,
        `<changefreq>${frequency}</changefreq>`,
        `<priority>${priority}</priority>`,
        "</url>"
      ].join("");
    })
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>"
  ].join("");

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400"
    }
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
