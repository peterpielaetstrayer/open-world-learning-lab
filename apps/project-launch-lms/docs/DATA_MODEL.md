# Supabase data model and security plan — not yet deployed

**Status: design only.** Before implementing, inspect latest Supabase Auth/SSR and RLS docs, review proposed schema, configure a **dedicated** project, create official migration files, run RLS tests and security advisors.

## Core entities

| Entity | Main fields | Security rule / intent |
|---|---|---|
| `courses` | id, slug, title, visibility | Published course titles may be public; unpublished content private |
| `modules` / `lessons` | id, course_id, order, learning outcomes | Learners see only assigned/published content |
| `course_memberships` | course_id, user_id, role, enrolled_at | Role assignment is *admin/server-only*; learners read only own membership |
| `activities` | lesson_id, kind, due_at, rubric_id | Published details visible to course members |
| `drafts` | activity_id, learner_id, body_json, updated_at | Learner can update only their own drafts; instructor only as explicitly permitted |
| `submissions` | activity_id, learner_id, revision, submitted_at, body_json | Final evidence remains immutable/versioned, no student modification of grade fields |
| `rubrics` / `rubric_criteria` | assignment_id, criterion, level descriptions, weights | Visible to learners before submission; versions frozen for graded work |
| `criterion_grades` / `feedback` | submission_id, criterion_id, score, evaluator_id, published_at | Only authorized facilitator writes; learner sees own *published* feedback |
| `discussion_topics` / `discussion_posts` | course_id, author_id, reply_to, state | Course members only; moderation and audit trail |
| `quiz_items_private` | quiz_id, prompt, choices, answer, explanation | **Not in client Data API**: answer keys server-access only |
| `quiz_attempts` | quiz_id, learner_id, answers, score, graded_at | Server scores; learner own results; instructor authorized grade view |
| `survey_questions` / `survey_responses` | course_id, question, responses | Level 1 reaction distinct from rubric grades; minimize identity retention |
| `storage_assets` | course_id, owner_id, path, media_type | Upload/download restricted by role and ownership; private bucket |

## RLS and grants

- Every table in an exposed schema uses **RLS plus explicit least-privilege GRANTs**. `TO authenticated` alone never grants access to another student's records. Check `auth.uid()` and course membership.
- A member may read only their own `course_memberships` row; instructor access to learner work relies on their own separately assigned `facilitator` membership, avoiding recursive membership policies.
- No client-side insert or update of roles, scores, rubric outcome grades or answer keys.
- Learners' drafts and submissions have an immutable `learner_id` that is checked on insert/update; submission finalization is versioned and authorized on server.
- Use `WITH CHECK` on updates to prevent ID re-assignment and scope changes. Keep published feedback separate from private drafts.
- Never trust `user_metadata`, browser route, a query parameter, or unverified JWT-derived role for grade-write authorization.
- Database views use `security_invoker` when exposed; avoid `SECURITY DEFINER` except reviewed private functions with explicit grants and validation.
- Avoid permissive Storage bucket policies, client-side service role, and unaudited RPC functions.

## Lifecycle / policies

Invite-only demo accounts; course membership granted by trusted admin action; separate reviewer/student and facilitator profiles. No public account creation while exploring with minors. Restricted uploads and purging/test-data plan. Check accessible/exportable learner evidence, recovery from partial submission failures, grade audit events, date/timezone handling and instructor-facing evaluation.

## Required tests before real learner use

1. Learner A cannot read or change Learner B's draft, submission, grades, quiz attempts or private files.
2. Student/peer role cannot read unpublished assessments, answer keys, other students' grades or facilitator-only notes.
3. Unauthenticated visitors cannot access course data API or private buckets.
4. Only permitted instructor can publish rubric feedback and adjust scores, with audit log.
5. Access expires on unenrollment/revocation; verify session/token effects.
6. Quiz grading is tamper-resistant, reproducible and provides explanatory correct/incorrect feedback as required.
7. All forum writes are attributable, moderated and tested against abuse/unsafe input.
8. Surveys do not accidentally expose identities or sensitive free-text responses to peers.
9. Security and performance advisors reviewed after database changes, no critical findings.
10. Verify course content has a real backup and export path.

Use synthetic data until consent/privacy compliance for any youth participants has been reviewed. Full school-scale FERPA/COPPA/safeguarding considerations are outside the Capstone demonstration and cannot be assumed resolved.
