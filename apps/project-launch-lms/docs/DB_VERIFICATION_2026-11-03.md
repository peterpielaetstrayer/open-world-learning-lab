# Project Launch Lab — Supabase schema verification

**Verified November 3, 2026.** Project `wjormscrikzocelbjxvc` in the OWLL Free organization (`us-east-1`). The connection and migration checks below were run against the actual dedicated Supabase project, not a local simulation.

## Remote state

- Migrations applied successfully via Supabase migration tool and recorded under **`20261103142336_pll_foundation`** and **`20261103142420_pll_fk_indexes`**. Source files under `supabase/migrations/` use matching remote timestamp prefixes.
- Tables present: `pll_courses`, `pll_memberships`, `pll_modules`, `pll_activities`, `pll_rubric_criteria`, `pll_drafts`, `pll_submissions`, `pll_feedback`.
- All eight tables have RLS enabled. **No anonymous table grants**. Authenticated grants are narrowed by table/column and guarded by ownership or role RLS policies.
- Privilege functions `private.pll_is_member` and `private.pll_has_role` explicitly check `auth.uid()`, use a fixed empty `search_path`, and are not exposed in the `public` schema. Only `authenticated` may execute them.
- Seeded: one draft course, two **unpublished** learner-facing modules, two **unpublished** assignment placeholders.
- **No Auth accounts, course memberships, submitted learner work, grades, storage buckets or public deployment.** Student views should not be expected to display the course until enrolled and content published.

## Tests actually executed

1. Remote `get_project` reported `ACTIVE_HEALTHY`; Postgres read query returned version 17.11 and current timestamp.
2. Remote schema inventory found all eight tables with `rls_enabled = true`.
3. **Simulated nonmember (authenticated SQL role, synthetic JWT user ID):** under `BEGIN ... ROLLBACK`, course/activities/submissions queries returned zero rows, `private.pll_is_member` returned false, and an attempted submission `INSERT` was denied by RLS/permissions; no test data was retained.
4. **Simulated anonymous SQL role:** under `BEGIN ... ROLLBACK`, table read and protected helper function call were denied by database permissions.
5. Supabase security advisor: **zero findings** after migrations.
6. Supabase performance advisor: originally reported six unindexed foreign keys; the second migration added six covering indexes and eliminated those findings. Remaining **INFO / unused index** notices are expected with an essentially empty database and are not evidence of an optimization success under load.
7. GitHub migration source SHA/content was fetched back and verified against the authored SQL.

**What is *not* verified:** Supabase Auth's real cookie/session flow, real student and facilitator RLS with two actual separate users, final grading, invitation flow, account revocation, member role administration, compiled Next.js build, database-backed UI, upload security, provider failover, actual accessibility or reviewer access.

## Mandatory next tests before making this an official LMS

- Create **synthetic invite-only** learner A, learner B and facilitator accounts through **supported Supabase Auth admin APIs**, not by direct SQL writes into `auth.users`.
- Populate course memberships only from a trusted server/admin context; verify one user cannot read or mutate another learner's drafts, final submissions or feedback.
- Implement a working SSR session and learner-authenticated server/client Supabase calls. Never expose secret/service-role keys in client bundles.
- Facilitate one full flow: learner creates editable draft → submits final immutable response → facilitator sees submission and publishes criterion-level rubric evaluation/feedback → learner sees their own published feedback. The first schema has rubric *criteria*, but **criterion-level scored records still need to be added** (the current `pll_feedback` supports a summary and 0–100 percentage only).
- Add a trusted facilitator enrollment/management workflow, quiz item secrecy and server-side auto-grading, separate peer/Q&A forums, course-evaluation survey, storage policy, and audit logs.
- Test all 24 original instructor checklist requirements and instructor/peer roles by November 27 (verify the live Canvas dates and custom LMS acceptance).
- Treat the separate every-8-hours database monitor as useful risk reduction, **not** as a contractual no-pause guarantee on Supabase Free. Check live status before review sessions.

## Replay/migration hygiene

The migration filenames **match the remote Supabase migration versions**. Do not rerun migrations against this project, edit an already-applied migration, or use the older temporary `0001`/`0002` filenames. New changes should use subsequent new migrations and verify against the migration history before release. The migration SQL is remote source of truth; do not assume creating a Git file by itself changes the database.

Reference: [Supabase project dashboard](https://supabase.com/dashboard/project/wjormscrikzocelbjxvc), [draft PR #15](https://github.com/peterpielaetstrayer/open-world-learning-lab/pull/15).
