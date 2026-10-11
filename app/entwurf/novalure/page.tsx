import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import DraftHome from "./DraftHome";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-novalure-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NovaLure — Startseitenentwurf",
  description: "Entwurf für die NovaLure Startseite: Projektvermarktung mit Vertriebsstruktur.",
  robots: { index: false, follow: false },
};

export default function NovalureDraftPage() {
  return <div className={instrumentSerif.variable}><DraftHome /></div>;
}
