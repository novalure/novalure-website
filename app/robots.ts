import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/novalure-logo-email.png"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
