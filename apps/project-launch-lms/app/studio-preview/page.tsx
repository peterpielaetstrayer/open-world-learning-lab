import { notFound } from "next/navigation";
import { SyntheticStudio } from "./synthetic-studio";

export const dynamic = "force-dynamic";

export default function StudioPreviewPage() {
  // Never expose sample course records on a production deployment. Design
  // review occurs only in local development or Vercel-authenticated previews.
  const localDevelopment = process.env.NODE_ENV === "development";
  const authenticatedVercelPreview = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview";
  if (!localDevelopment && !authenticatedVercelPreview) notFound();

  return <SyntheticStudio />;
}
