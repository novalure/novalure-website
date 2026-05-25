const fallbackSiteUrl = "https://www.novalure.eu";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\s+/g, "").trim();
  return (configuredUrl || fallbackSiteUrl).replace(/\/+$/, "");
}
