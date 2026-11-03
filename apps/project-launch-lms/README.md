# Project Launch Lab — custom LMS foundation

**Stage:** database-backed source implementation with a successfully built, Vercel-authentication-protected staging preview; real Auth-user end-to-end tests and instructor acceptance remain pending. **Not a completed LMS** or an authorized replacement for Canvas Lite yet.

A self-contained Next.js application under the OWLL monorepo, maintained on a feature branch. A dedicated `project-launch-lms` Vercel project now builds this app separately from the OWLL website, on the draft PR feature branch. Neither the OWLL production site nor the existing Gauntlet repo is modified.

## Educational purpose

**Project Launch Lab: From Curiosity to Action** is a two-module introductory learning experience within the *proposed* Open World Studio Pathway, built for high-school learners. This application will eventually support:

- **Discover & Define:** identify curiosity, evaluate relevance/feasibility/scope, formulate a focused project direction.
- **Plan & Launch:** plan, critique, safely attempt an informative first action (or document a genuine obstacle), interpret evidence and decide on the next step.
- Distinct learner and facilitator experiences, with persistent draft/submission/review feedback rather than simulated gradebook records.
- The instructor's full 24-point LMS requirements checklist.

Current source includes course-shell and non-persistent decision example **plus real Supabase-backed login, saved draft, immutable submission, criterion scoring and facilitator feedback UIs**. The corresponding data schema is deployed, but there are **no Auth users or course memberships**, so these are unverified integration pathways. Peer forums, quiz and survey are not built.

## Local development

```bash
cd apps/project-launch-lms
npm ci
npm run dev
```

Node.js 22+ is recommended. Configure the public Supabase URL/publishable key from `.env.example` **locally** or in protected Vercel project settings. All learner data access must pass Supabase Auth and RLS. No service-role key in the browser or Git history. Standalone app TypeScript and build checks passed in GitHub CI. Vercel staging successfully built commit `37c5055` on November 3; its preview is protected by Vercel authentication. This does not constitute a browser-level login or learner-role test.

## Production gates

1. Instructor acceptance of a self-built LMS for the formal Capstone submission (**pending**).
2. Dedicated Supabase project created under OWLL at quoted $0/month (**done**).
3. Baseline database/RLS and atomic rubric migration (**done**); real synthetic Auth-account role isolation, server-side quiz scoring and protected media uploads (**pending**).
4. End-to-end vertical slice: learner authenticates → submits a project judgment → facilitator reviews and scores against a rubric → learner reads feedback; verified isolation across accounts.
5. Distinct functioning forums, graded 10-question quiz with right/wrong explanations, module-specific assignments, Level 1 survey, original multimedia, welcome and orientation, accessible student-view testing, reviewer login.
6. Decision by Nov 6–7 if feasible; fallback to Canvas Lite course administration if instructor or security/function tests fail. Full course Nov 30; reviewer/instructor access Nov 27 (check live Canvas).

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
- **Reproducible builds:** a committed app-specific `package-lock.json` pins the verified tree; LMS GitHub Actions now uses `npm ci --no-audit --no-fund`, and tests both admin scripts fail closed without approval. The separate OWLL public-site CI and original Gauntlet remain isolated. A targeted security/dependency audit is still pending.
- **Open engineering gaps:** provider invitation email template/redirect and invitation-only settings; 3-account E2E; reviewer workflow; two complete modules, original media, discussion forums, ten-item LMS-graded quiz and Level 1 survey. Vercel preview has been built with both preview-scoped `NEXT_PUBLIC_SUPABASE_*` variables configured, but their runtime correctness and browser-level Auth have not yet been verified. See the canonical Peter OS handoff for academic priorities.
