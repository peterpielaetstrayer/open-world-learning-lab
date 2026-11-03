/** Learner-facing data shapes for the initial Supabase-backed vertical slice.
 * Generated database types will replace these hand-authored shapes.
 */
export type MemberRole = "learner" | "facilitator";
export interface CourseMembership {
  course_id: string;
  user_id: string;
  member_role: MemberRole;
}
export interface CourseActivity {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  slug: string;
  instructions: string;
  is_published: boolean;
}
export interface LearnerDraft {
  id: string;
  activity_id: string;
  learner_id: string;
  response_text: string;
  updated_at: string;
}
export interface LearnerSubmission {
  id: string;
  activity_id: string;
  course_id: string;
  learner_id: string;
  response_text: string;
  submitted_at: string;
}
export interface RubricCriterion {
  id: string;
  activity_id: string;
  course_id: string;
  position: number;
  title: string;
  description: string;
  maximum_points: number;
}
export interface PublishedFeedback {
  id: string;
  submission_id: string;
  summary: string;
  published_at: string | null;
}
export interface CriterionScore {
  id: string;
  submission_id: string;
  criterion_id: string;
  awarded_points: number;
  criterion_note: string;
}
