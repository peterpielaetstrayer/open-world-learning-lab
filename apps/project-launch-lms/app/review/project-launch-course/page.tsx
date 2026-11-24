import { notFound } from "next/navigation";
import { facultyReviewEnabled } from "@/lib/faculty-review";
import { ReviewStudio } from "./review-studio";
import "./review.css";

export const dynamic = "force-dynamic";

export default function ProjectLaunchFacultyReviewPage() {
  if (!facultyReviewEnabled()) notFound();
  return <ReviewStudio />;
}
