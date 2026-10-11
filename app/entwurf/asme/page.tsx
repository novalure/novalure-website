import type { Metadata } from "next";
import AsmePreview from "./AsmePreview";
import "./asme.css";

export const metadata: Metadata = {
  title: "Asme — Entwurf",
  description: "Designentwurf nach dem Asme-Recreation-Prompt.",
  applicationName: "Asme",
  creator: "Asme",
  publisher: "Asme",
  icons: { icon: [{ url: "/entwurf/asme/icon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "Asme — Entwurf",
    description: "Designentwurf nach dem Asme-Recreation-Prompt.",
    siteName: "Asme",
    images: []
  },
  twitter: { card: "summary" },
  robots: { index: false, follow: false }
};

export default function AsmeDraftPage() {
  return <AsmePreview />;
}
