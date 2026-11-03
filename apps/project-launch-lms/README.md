# Project Launch Lab — custom LMS foundation

**Stage:** pre-backend course-shell prototype; **not a completed LMS**, not a substitute for Canvas until accepted and independently tested.

A self-contained Next.js application under the OWLL monorepo, maintained on a feature branch. Future hosting can use a separate Vercel project with `apps/project-launch-lms` as its root directory. Neither the OWLL production site nor the existing Gauntlet repo is modified.

## Educational purpose

**Project Launch Lab: From Curiosity to Action** is a two-module introductory learning experience within the *proposed* Open World Studio Pathway, built for high-school learners. This application will eventually support:

- **Discover & Define:** identify curiosity, evaluate relevance/feasibility/scope, formulate a focused project direction.
- **Plan & Launch:** plan, critique, safely attempt an informative first action (or document a genuine obstacle), interpret evidence and decide on the next step.
- Distinct learner and facilitator experiences, with persistent draft/submission/review feedback rather than simulated gradebook records.
- The instructor's full 24-point LMS requirements checklist.

Current app: accessible learner-course shell plus a **non-persistent** interactive example. It is a UI/interaction foundation only. No real accounts, submissions, quiz grades, peer discussions or database storage exist yet.

## Local development

```bash
cd apps/project-launch-lms
npm install
npm run dev
```

Node.js 22+ is recommended. This is an isolated application package, not yet connected to Supabase or Vercel.

## Production gates

1. Instructor acceptance of a self-built LMS for the formal Capstone submission.
2. Dedicated Supabase organization/project and confirmed cost; never reuse unrelated project data.
3. Approved database/RLS schema; private role-aware accounts; server-side quiz scoring; protected media uploads; synthetic demo learner accounts.
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
- **Foundational database schema is now deployed:** eight RLS-protected `pll_*` tables; one draft course, two unpublished modules and two unpublished assignment placeholders. Two migrations applied (remote versions `20261103142336` and `20261103142420`); negative-access permission tests passed; zero security advisor findings. No Auth users, memberships, learner records, protected storage bucket, connected application credentials, successful production build or deployment. See [DB verification](docs/DB_VERIFICATION_2026-11-03.md).
- A separate recurring `Project Launch DB Watch` condition-watch automation checks project status and runs read-only SQL every eight hours; enabled Nov 3. This is an **unverified future schedule** until the first successful run and does **not guarantee** Supabase free-tier uptime.
- Official documentation: [free-project pausing](https://supabase.com/docs/guides/platform/free-project-pausing) — seven-day low-activity pause possible, even with some usage; paid plans are exempt. Vercel Hobby [Cron Jobs](https://vercel.com/docs/cron-jobs/usage-and-pricing) run no more than once daily; do not assume a daily Vercel Cron alone prevents Supabase pausing.
- Engineering gate: implement a server-side health-check path (actual low-cost SQL read, **never a public privileged endpoint**), reserve a secured daily Vercel Cron for production deployment if useful, add explicit failure notifications and verify from a separate session before Nov 27 reviewer access. Prefer independently monitor *status* and actual learner workflows, not solely a synthetic heartbeat.
- Never claim a robust availability SLA on Supabase Free. If uninterrupted external evaluation is essential, consider a bounded paid plan **only with new cost approval**; preserve a student-facing fallback/read-only route.
