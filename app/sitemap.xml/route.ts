const SITE_URL = "https://www.novalure.eu";

const routes = [
  {
    loc: "/en",
    alternates: { en: "/en", de: "/de", default: "/en" },
    changefreq: "weekly",
    priority: "1.0"
  },
  {
    loc: "/de",
    alternates: { en: "/en", de: "/de", default: "/en" },
    changefreq: "weekly",
    priority: "1.0"
  },
  {
    loc: "/en/developers",
    alternates: { en: "/en/developers", de: "/de/bautraeger", default: "/en/developers" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/de/bautraeger",
    alternates: { en: "/en/developers", de: "/de/bautraeger", default: "/en/developers" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/en/agents",
    alternates: { en: "/en/agents", de: "/de/makler", default: "/en/agents" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/de/makler",
    alternates: { en: "/en/agents", de: "/de/makler", default: "/en/agents" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/en/playbooks",
    alternates: { en: "/en/playbooks", de: "/de/playbooks", default: "/en/playbooks" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/de/playbooks",
    alternates: { en: "/en/playbooks", de: "/de/playbooks", default: "/en/playbooks" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/en/contact",
    alternates: { en: "/en/contact", de: "/de/kontakt", default: "/en/contact" },
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    loc: "/de/kontakt",
    alternates: { en: "/en/contact", de: "/de/kontakt", default: "/en/contact" },
    changefreq: "monthly",
    priority: "0.7"
  }
];

function absolute(path: string) {
  return `${SITE_URL}${path}`;
}

export function GET() {
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${absolute(route.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
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
