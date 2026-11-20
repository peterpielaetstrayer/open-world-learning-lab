import { notFound } from "next/navigation";
import { EntryDiagnostic } from "../studio/entry-diagnostic";

export const dynamic = "force-dynamic";

export default function DiagnosticPreviewPage() {
  const localDevelopment = process.env.NODE_ENV === "development";
  const authenticatedVercelPreview = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview";
  if (!localDevelopment && !authenticatedVercelPreview) notFound();

  return <main id="main-content" className="page-wrap studio-container">
    <p className="eyebrow">Private instructional design preview · not enrolled</p>
    <h1>Before your first project</h1>
    <p className="lead">An ungraded entry diagnostic to help you notice what you bring to the lab. Your answers stay in this browser session unless you choose to copy them yourself.</p>
    <div className="preview-banner" role="note">
      This is a synthetic preview, not a student submission. It does not collect, save, grade or share responses with a facilitator. The authenticated course integration is pending instructional review.
    </div>
    <EntryDiagnostic />
  </main>;
}
