# Project Launch Lab — custom LMS foundation

**Stage:** database-backed source implementation with a successfully built, Vercel-authentication-protected staging preview; real Auth-user end-to-end tests and instructor acceptance remain pending. **Not a completed LMS** or an authorized replacement for Canvas Lite yet.

A self-contained Next.js application under the OWLL monorepo, maintained on a feature branch. A dedicated `project-launch-lms` Vercel project now builds this app separately from the OWLL website, on the draft PR feature branch. Neither the OWLL production site nor the existing Gauntlet repo is modified.

## Educational purpose

**Project Launch Lab: Turning Curiosity Into a Meaningful Project in the AI Age** is a two-module introductory learning experience within the *proposed* Open World Studio Pathway, built for high-school learners. This application will eventually support:

- **Discover & Define:** identify curiosity, evaluate relevance/feasibility/scope, formulate a focused project direction.
- **Plan & Launch:** plan, critique, safely attempt an informative first action (or document a genuine obstacle), interpret evidence and decide on the next step.
- Distinct learner and facilitator experiences, with persistent draft/submission/review feedback rather than simulated gradebook records.
- The instructor's full 24-point LMS requirements checklist.

Current source includes a course shell, ten-screen standalone instructional lesson prototype, Supabase-backed login, draft and final submission interfaces, facilitator feedback with optional rubric scores, forums, graded quiz, Level 1 course evaluation, and editing tools. **These capabilities have different verification levels and do not yet constitute a complete course.** The ten-screen lesson preview retains work in browser state and permits a text export; it does not yet persist its ten individual responses to the learner account. The separate authenticated studio can save and submit written responses for both graded and ungraded activities.

## Local development

```bash
cd apps/project-launch-lms
npm ci
npm run dev
```

Node.js 22+ is recommended. Configure the public Supabase URL/publishable key from `.env.example` **locally** or in protected Vercel project settings. All learner data access must pass Supabase Auth and RLS. No service-role key in the browser or Git history. Standalone app TypeScript and build checks passed in GitHub CI. Vercel staging successfully built commit `37c5055` on November 3; its preview is protected by Vercel authentication. This does not constitute a browser-level login or learner-role test.

## Production gates

1. Instructor acceptance of a self-built LMS for the formal Capstone submission (**not verified**).
2. Dedicated Supabase project created under OWLL at quoted $0/month (**done**).
3. Baseline database/RLS, atomic rubric migration, and formative (ungraded) written-feedback migration (**done**); real multi-account Auth/RLS role tests and protected media uploads (**pending**).
4. End-to-end vertical slice: learner authenticates → submits a project judgment → facilitator reviews and scores against a rubric → learner reads feedback; verified isolation across accounts.
5. Verify existing discussion, graded quiz and Level 1 evaluation against actual course/rubric requirements. Finish original multimedia, complete module lessons, orientation, accessible student-view testing, and reviewer login.
6. Reconfirm the actual remaining LDT 560 Canvas assignment deadlines and instructor expectations before treating Nov 27/30 planning dates as authoritative. Keep Canvas Lite fallback available if instructor acceptance or functional/security testing fails.

Source-of-truth design crosswalk: Peter OS draft PR #6 / `LMS_Course_Requirements_Crosswalk_2026-11-02.md`.

See [Architecture](docs/ARCHITECTURE.md) and [Supabase data model](docs/DATA_MODEL.md).

**Quality standard:** Every piece of the course should have a clear reason to exist, contribute to something learners actually do, and work reliably for its intended audience.


## Dedicated Supabase project — November 3, 2026

- Supabase organization: **OWLL** (Free). Project: **project-launch-lab**; ref: `wjormscrikzocelbjxvc`; region: `us-east-1`.
- Direct provider quote before creation: **$0/month**. Project creation returned `ACTIVE_HEALTHY`; a separate read-only SQL query succeeded; security and performance advisors returned no findings on the **empty initial database**.
- [Project dashboard](https://supabase.com/dashboard/project/wjormscrikzocelbjxvc). Do **not** put secret/service-role keys into Git or browser bundles.
- **Verified database schema:** nine RLS-protected `pll_*` tables (including criterion scores); one draft course, two unpublished modules, two unpublished assignments and six draft rubric criteria. Three migrations applied (`20261103142336`, `20261103142420`, `20261103145717`). Anonymous/nonmember SQL role denials and unauthorized review denial passed; Supabase security advisor found zero findings. **No Auth users, memberships, learner submissions or actual grading**; the only verified Vercel deployment is a protected staging preview, not a public course release. CI app build and typecheck passed. See [DB verification](docs/DB_VERIFICATION_2026-11-03.md) and the [Auth role-testing runbook](docs/AUTH_AND_ROLE_TEST_RUNBOOK.md).
- A separate recurring `Project Launch DB Watch` condition-watch automation checks project status and runs read-only SQL every eight hours; enabled Nov 3. This is an **unverified future schedule** until the first successful run and does **not guarantee** Supabase free-tier uptime.
- Official documentation: [free-project pausing](https://supabase.com/docs/guides/platform/free-project-pausing) — seven-day low-activity pause possible, even with some usage; paid plans are exempt. Vercel Hobby [Cron Jobs](https://vercel.com/docs/cron-jobs/usage-and-pricing) run no more than once daily; do not assume a daily Vercel Cron alone prevents Supabase pausing.
- Engineering gate: implement a server-side health-check path (actual low-cost SQL read, **never a public privileged endpoint**), reserve a secured daily Vercel Cron for production deployment if useful, add explicit failure notifications and verify from a separate session before Nov 27 reviewer access. Prefer independently monitor *status* and actual learner workflows, not solely a synthetic heartbeat.
- Never claim a robust availability SLA on Supabase Free. If uninterrupted external evaluation is essential, consider a bounded paid plan **only with new cost approval**; preserve a student-facing fallback/read-only route.

## Development continuation — November 3

- Invited-user session callback, token-hash invite confirmation, authenticated password setup, and session-aware browser clients are committed in this draft branch. The invitation path requires explicit Auth email-template and redirect URL configuration before it can operate.
- The guarded synthetic-role harness `scripts/smoke-roles.mjs` creates a pair of synthetic learners plus a facilitator through official Auth-admin APIs, then validates cross-user record isolation, draft persistence, immutable final submission and facilitator feedback. **It has not run** because it requires an admin-only credential that is not exposed by the connected project tools. It must not be confused with completed role tests. The test restores publication flags and deletes synthetic accounts where possible.
- **Reproducible and audited runtime:** a committed app-specific `package-lock.json` pins the dependency tree. A high/critical runtime audit identified critical Next.js 16.3.8 advisories, so the isolated LMS was patched to **Next.js 16.4.4** with matching ESLint configuration and regenerated lockfile. The GitHub pipeline now uses `npm ci`, runs `npm audit --omit=dev --audit-level=high`, checks both guarded admin scripts fail closed, and passes lint, TypeScript and Next.js build. This audit has **no high/critical findings at the latest check**, but is not a complete application security review. The original OWLL public-site CI and Gauntlet remain separate.
- **Open engineering gaps:** provider invitation email template/redirect and invitation-only settings; 3-account E2E; reviewer workflow; two complete modules, original media, discussion forums, ten-item LMS-graded quiz and Level 1 survey. Vercel preview has been built with both preview-scoped `NEXT_PUBLIC_SUPABASE_*` variables configured, but their runtime correctness and browser-level Auth have not yet been verified. See the canonical Peter OS handoff for academic priorities.

## Verified incremental update — November 18, 2026

- The separate Vercel `project-launch-lms` **preview** serves the ten-screen standalone lesson at `/lesson-preview`; the route is disabled in production and access remains protected by Vercel authentication. This is a demonstration of the instructional prototype, not account-persistent work or proof of a complete LMS.
- The actual Supabase database now contains **13 RLS-enabled `pll_*` tables**, **2 Auth users with 2 memberships**, and **4 published activities across 2 published modules**; at the time of review, it contained **0 drafts, 0 submissions and 0 reviews**. Earlier sections in this README document the historical November 3 state, not today's state. Account identities and real-world suitability are not assumed from the counts.
- Ungraded `gauntlet-practice` and `first-move-studio` can now use the same authenticated draft/final submission experience as rubric-based assignments. Facilitators can publish text-only formative feedback by calling `pll_publish_formative_feedback`. The SQL migration `20261118185236_pll_formative_feedback.sql` was applied to the actual Supabase project, and its function execution grants were verified (authenticated only, not anonymous). Graded reviews retain their full-rubric requirement. New simulated-client React tests cover learner draft/final, ungraded facilitator feedback and scored facilitator review with `npm run test:formative`.
- **Verification boundaries:** these React tests stub the Supabase client; they do not exercise a real authenticated multi-user browser session or RLS. The ten-screen lesson responses still need account persistence and a deliberate relationship to the course assignments. An observed course-design mismatch remains: the currently published Module 2 `launch-portfolio` has **three 10-point criteria**, whereas the academic storyboard calls for **four 15-point criteria**. Resolve that with the authoritative assignment before changing a live rubric.
- Supabase's advisor reported no new database security issue after the migration, but the pre-existing Auth warning for leaked-password protection remains. The application is still a protected preview, not a learner-ready release; production, invitations and instructor-facing claims require separate acceptance.

### Learner-owned interactive progress (November 18 continuation)

- A separate `pll_lesson_progress` table now stores explicitly saved ten-screen interactive-lesson state as versioned JSON, keyed by the course, published activity, learner identity and lesson identifier. RLS and column-scoped grants limit reads/changes to the enrolled learner. Facilitators cannot read the private working state; final submissions and grades stay in their own tables. Applied migrations: `20261118190044_pll_lesson_progress.sql` and `20261118190321_pll_lesson_progress_fk_index.sql`.
- When `[[project-direction-lesson]]` is rendered **inside the signed-in learner studio**, the component loads saved state and shows an explicit **Save my lesson work** action with unsaved/saved status. A future-version state fails closed without overwriting. This is manual save, **not autosave**. The existing protected `/lesson-preview` remains synthetic and non-persistent.
- Two additional React/stub-client tests cover save → remount → restore and a deliberate incompatible-version refusal, bringing `npm run test:formative` to **6/6 tests**. Post-migration database readback confirmed RLS on, no anonymous select grant, three owner policies, zero progress rows. The missing composite foreign-key index advisory was resolved; unused-index informational notices are expected on empty test tables.
- **Not yet done:** the actual published Module 1 activity does not presently include the `[[project-direction-lesson]]` marker. Integration into course content is an explicit editorial/publishing step after reviewing the instructional sequence and testing with real synthetic Auth sessions. Neither these code tests nor the route HTTP 200 constitute a verified signed-in, cross-account save/reload walkthrough.

### Learner dashboard and feedback discovery (November 18 continuation)

- The authenticated studio home now presents an explicit two-module learner journey, an accessible start/continue action, a four-step account of drafting, safe attempts and facilitator review, and a clear agency/privacy note. Its progress counts represent actual final responses and published facilitator reviews, **not proficiency, lesson-view completion, or saved interactive-lesson progress**. Facilitators do not see misleading learner-specific progress counts.
- The learner's **Feedback** area lists ungraded practice alongside scored assignments, including published formative comments. The **Assignments** area remains limited to rubric-scored tasks; ungraded activities are not labeled as zero-point graded assignments.
- Eight simulated React/client interaction tests cover graded and formative work, private interactive save/restore, the new dashboard and ungraded feedback discovery. The five independent lesson-prototype tests also pass. Local lint, typecheck, Next production build and high-severity runtime audit pass. These tests are not substitutes for real Auth/RLS, keyboard/mobile and reviewer-flow acceptance.
- The protected standalone `/lesson-preview` is still available for instructional inspection. Browser-based visual QA from an external cloud browser stopped at Vercel SSO; the reviewer may need authenticated access to inspect it. The new dashboard is part of `/studio` for an enrolled learner/facilitator and is **not** a public demo or synthetic visual preview.
