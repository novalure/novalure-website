import type { MetadataRoute } from "next";
import { allPageKeys, locales, routeMap } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";
const indexablePageKeys = allPageKeys.filter((key) => !["imprint", "privacy", "cookies"].includes(key));

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePageKeys.flatMap((key) =>
    locales.map((locale) => ({
      url: `${siteUrl}${routeMap[key][locale]}`,
      lastModified: new Date(),
      changeFrequency: key === "home" ? "weekly" : "monthly",
      priority: key === "home" ? 1 : 0.7,
      alternates: {
        languages: {
          "en-US": `${siteUrl}${routeMap[key].en}`,
          "de-DE": `${siteUrl}${routeMap[key].de}`,
          "x-default": `${siteUrl}${routeMap[key].en}`
        }
      }
    }))
  );
}
