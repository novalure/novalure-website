import { notFound } from "next/navigation";
import StudioClient from "./StudioClient";

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "your_sanity_project_id" || projectId === "replace-me") {
    notFound();
  }

  return <StudioClient />;
}
