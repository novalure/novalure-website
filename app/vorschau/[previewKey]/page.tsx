import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LudwigPreview } from "./preview";
import "./preview.css";

export const metadata: Metadata = {
  title: "Kontakt | Kanzlei Ludwig – Vorschau",
  description: "Gestaltungsvorschlag für das Kontaktformular der Kanzlei Ludwig.",
  robots: { index: false, follow: false, nocache: true }
};

export default async function Page({ params }: { params: Promise<{ previewKey: string }> }) {
  const { previewKey } = await params;
  const expectedKey = process.env.LUDWIG_PREVIEW_KEY;
  if (!expectedKey || previewKey !== expectedKey) notFound();
  return <LudwigPreview />;
}
