import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "./relaunch.css";
import "./v2.css";

const siteUrl = getSiteUrl();
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "NovaLure",
  creator: "NovaLure",
  publisher: "NovaLure",
  title: {
    default: "NovaLure",
    template: "%s"
  },
  description: "Project marketing, follow-up and prepared handover for real estate teams that turn enquiries into qualified conversations.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    type: "website",
    siteName: "NovaLure",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "NovaLure turns real estate enquiries into qualified conversations" }]
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const requestedLanguage = requestHeaders.get("x-novalure-document-language");
  const documentLanguage = requestedLanguage === "de-DE" || requestedLanguage === "es-ES" ? requestedLanguage : "en-GB";

  return (
    <html lang={documentLanguage} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
