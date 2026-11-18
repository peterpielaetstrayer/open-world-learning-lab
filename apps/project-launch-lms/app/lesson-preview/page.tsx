import { notFound } from "next/navigation";
import { ProjectDirectionLesson } from "../studio/project-direction-lesson";

export const dynamic = "force-dynamic";

export default function LessonPreviewPage() {
  // This route is a synthetic design preview only. It must not be served on staging/production.
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main id="main-content" className="page-wrap direction-preview-page">
      <p className="eyebrow">Development preview · synthetic learner</p>
      <h1>Project Launch Lab</h1>
      <p className="direction-preview-lead">Module 1, Lesson 1 · ten-screen interactive working prototype. Nothing entered here is submitted or stored on the server.</p>
      <ProjectDirectionLesson />
    </main>
  );
}
