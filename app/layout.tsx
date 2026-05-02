import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";
const googleAnalyticsId = "G-0LV11ZNV38";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Novalure",
  creator: "Novalure",
  publisher: "Novalure",
  title: {
    default: "Novalure",
    template: "%s"
  },
  description: "PropTech Sales System for real estate developers and agents.",
  openGraph: {
    type: "website",
    siteName: "Novalure",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "Novalure property marketing systems" }]
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

gtag('config', '${googleAnalyticsId}');
            `.trim()
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
