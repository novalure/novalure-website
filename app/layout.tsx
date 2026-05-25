import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const googleAnalyticsId = "G-0LV11ZNV38";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "NovaLure",
  creator: "NovaLure",
  publisher: "NovaLure",
  title: {
    default: "NovaLure",
    template: "%s"
  },
  description: "PropTech Sales System for real estate developers and agents.",
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
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "NovaLure CRM-ready real estate lead systems" }]
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied'
});
gtag('config', '${googleAnalyticsId}', { send_page_view: false });
            `.trim()
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
