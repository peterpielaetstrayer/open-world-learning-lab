import { notFound } from "next/navigation";
import { ModuleOneWalkthrough } from "./walkthrough";

export const dynamic = "force-dynamic";

export default function ModuleOnePreviewPage() {
  const localDevelopment = process.env.NODE_ENV === "development";
  const authenticatedVercelPreview = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview";
  if (!localDevelopment && !authenticatedVercelPreview) notFound();
  return <ModuleOneWalkthrough />;
}
