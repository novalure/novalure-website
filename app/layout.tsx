import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.novalure.eu";

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
      <body>{children}</body>
    </html>
  );
}
