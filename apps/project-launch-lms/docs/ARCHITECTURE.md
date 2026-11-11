# Technical architecture — draft decision record

**Status:** staged foundation; no Supabase project provisioned or schema deployed. Formal LMS authorization and security gates remain open.

## Principle

For Project Launch Lab to be more effective **for this learning experience**, the system must integrate learner ownership, carefully sequenced lessons, meaningful evidence, timely feedback, and complete instructor/reviewer functionality. We are not reproducing Canvas's general-purpose feature set.

## Stack

- **Next.js 16 / React 19 / TypeScript**: learner and facilitator interface, server-side route handlers and controlled transactions.
- **Dedicated Supabase Postgres + Auth + private Storage** (to be provisioned after cost/organization selection): identities, persistence, permissions and secure learner file evidence.
- **Vercel**: isolated application deployment with preview/production gates; no deploy is authorized by merely creating this branch.
- **Course content**: editable versioned curriculum stored as code/Markdown until a real content-management need is established; do not create an admin page editor prematurely.
- **Synthetic student accounts only** during Capstone development; no live high-school minors' information without safeguarding, consent, privacy review and legal/organizational approval.

## User roles

- **Learner**: reads assigned course content; writes own draft and final submissions; reads only own rubric feedback and quiz attempts; joins permitted course discussions.
- **Facilitator/instructor**: evaluates authorized learner submissions and rubric criteria; posts announcements; manages permitted course content and forum moderation.
- **Peer reviewer**: separate seeded student-role account, consistent with Capstone's peer-as-student requirement. Should never obtain instructor grading data merely because they have a review link.
- **Administrator**: provisioned server-side, not self-assigned through user-editable metadata.

Do not use editable JWT user metadata for authorization, and never expose service-role credentials in client bundles. Supabase RLS and database grants protect records independent of front-end route guards.

## Logical data model

Course, module, lesson, reading/resource, activity, rubric, rubric criterion, enrollment, draft, submitted artifact, criterion grade, feedback, discussion topic/post, quiz/question/choice/attempt, survey/response. Actual schema, keys, storage and policies will be reviewed before any DDL. [Data model](DATA_MODEL.md).

## Non-negotiable transactional paths

1. Sign in by instructor-issued invite, then access only course(s) enrolled.
2. Save/update only own drafts; submit an immutable or versioned final attempt; log submission timestamp.
3. Facilitator reviews submitted work with visible criteria, publishes feedback; learner sees only own feedback.
4. Quiz scoring computes on the server, never sends hidden answers to the browser before scoring; store attempt and explanatory correct/incorrect feedback.
5. Forums permit learners to read approved course postings and post; facilitator can moderate; no anonymous read of minors' data.
6. Course evaluation is distinct from Level 2 performance grading; avoid leaking identity-linked survey responses unnecessarily.
7. Student-view test and instructor-view test in separate sessions; verify RLS denies cross-account access.

## Accessibility, performance, and operations

- Semantic HTML, keyboard-only traversal, focus indication, 4.5:1 normal text, 3:1 large/non-text, accessible errors, transcript/captions, contrast-tested states, narrow viewport testing and reduced-motion support.
- Private attachments require authorization and short-lived signed access; no public learner uploads.
- Every API mutation validates inputs, authorization and status at the server boundary. Rate limit sign-in, discussions and quiz attempts.
- Record failures and useful QA events without copying student submissions into logs.
- Synthetic fixtures, schema migrations, RLS test harness, end-to-end role tests, and backup/restore plan.
- Separate Vercel preview from production; require preview tests before promotion; no real student use as part of Capstone proof.

## Engineering checkpoints

- **Gate 0 (this commit):** source-reusable learning studio UI + bounded sample practice; no hidden live-data claims.
- **Gate 1:** instructor acceptance and dedicated backend project selected, costs agreed, schema/RLS verified.
- **Gate 2:** vertical slice working end to end across two roles, multiple accounts and a nontrivial rubric; database audit with no critical advisors.
- **Gate 3:** all 24 LMS checklist rows demonstrated; two original media products + separate course overview video; course-wide 10-item LMS-graded quiz and Level 1 survey.
- **Gate 4:** third-party reviewer reaches the course, completes a learner task, sees expected feedback, no elevated access; actual cross-browser/keyboard/mobile QA and course rubric readback.

If Gate 2 cannot be met by the planned early go/no-go, use Canvas Lite as compliance fallback and keep the custom studio as linked course experience. No course grading is entrusted to UI-only simulations.
