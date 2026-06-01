const SITE_URL = "https://www.novalure.eu";

const routes = [
  "/en",
  "/de",
  "/en/developers",
  "/de/bautraeger",
  "/en/agents",
  "/de/makler",
  "/en/playbooks",
  "/de/playbooks",
  "/en/contact",
  "/de/kontakt",
  "/en/system-example",
  "/de/systembeispiel"
];

function absolute(path: string) {
  return `${SITE_URL}${path}`;
}

export function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${absolute(route)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600"
    }
  });
}
