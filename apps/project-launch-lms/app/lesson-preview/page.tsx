import { notFound } from "next/navigation";
import { ProjectDirectionLesson } from "../studio/project-direction-lesson";

export const dynamic = "force-dynamic";

export default function LessonPreviewPage() {
  // The synthetic lesson can be reviewed locally or behind the LMS Vercel project's
  // authenticated Preview deployments. Never expose it on Production (even if the
  // public OWLL website and the LMS happen to share a Git repository).
  const localDevelopment = process.env.NODE_ENV === "development";
  const authenticatedVercelPreview = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview";
  if (!localDevelopment && !authenticatedVercelPreview) notFound();

  return (
    <main id="main-content" className="page-wrap direction-preview-page">
      <p className="eyebrow">Private design preview · synthetic learner</p>
      <h1>Project Launch Lab</h1>
      <p className="direction-preview-lead">Module 1, Lesson 1 · ten-screen interactive working prototype. Nothing entered here is submitted or stored on the server.</p>
      <ProjectDirectionLesson />
    </main>
  );
}
