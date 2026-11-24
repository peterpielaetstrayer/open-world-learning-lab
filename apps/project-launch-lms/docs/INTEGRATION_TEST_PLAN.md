# Project Launch Lab — Auth + feedback integration test plan

**November 3, 2026 — draft PR #15.** This plan is not evidence that the steps below are complete.

## Implemented and verified

- Dedicated OWLL Supabase project `wjormscrikzocelbjxvc`, free tier, region us-east-1, active/healthy at last check.
- Real migrations in remote history:
  - `20261103142336_pll_foundation` — 8 RLS-enabled course/member/activity/draft/submission/feedback tables.
  - `20261103142420_pll_fk_indexes` — covering FK indexes.
  - `20261103145717_pll_rubric_reviews` — `pll_rubric_scores`, published-review trigger and `pll_publish_review` transactional RPC.
- All nine tables have RLS, and the security advisor returned zero findings after the third migration. Test SQL simulated a nonmember and confirmed unauthorized review RPC was denied.
- Three criteria were seeded for each **unpublished draft** assignment; they are *provisional learner-assessment rubrics*, not professor-approved final assessment text.
- GitHub source contains a learner/facilitator `/studio` interface, `/login`, public-only Supabase browser client, and a CI build/typecheck workflow.
- **No real Auth accounts, enrolled users, browser/instructor tests, deployed app or published modules** yet. No real minor learner data.

## Current stack and secret boundary

Next.js 16.3.8 + React 19.2.4; Supabase JS 2.118.0 and SSR 0.12.7 pinned as direct deps; Vercel planned. All browser calls go through a publishable key and Supabase RLS, **never** a service-role/secret key. `lib/supabase-browser.ts` instantiates `createBrowserClient`; no SSR server auth is implemented yet. There is no client route that provisions a new course membership.

Use `.env.example` to configure only:
```
NEXT_PUBLIC_SUPABASE_URL=https://wjormscrikzocelbjxvc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<public key set in environment, never paste to source>
```
Never put secret keys or actual learner passwords in GitHub, ChatGPT, exported logs, or screenshots.

## Before opening a reviewer preview

1. **CI:** GitHub Actions TypeScript and Next build pass; package-lock reviewed and committed; dependency advisories reviewed. The workflow creates an artifact for the lockfile but does not commit one automatically.
2. **Auth configuration:** In the Supabase dashboard, explicitly **disable public signups** unless there is a designed, permission-reviewed invitation path. Merely omitting a sign-up button does not prevent direct API sign-up. Configure allowed redirects for the eventual preview/prod domains and use email/password with **admin-invited** accounts. Tool access in this chat cannot administer Auth users or signup settings; no claim these are set.
3. **Synthetic accounts:** Provision at least learner A, learner B, facilitator C using supported Auth admin APIs/dashboard. For assigned peer testing, create a distinct enrolled **learner** account later.
4. **Course provisioning:** From a trusted administrator context, insert `pll_memberships` for A/B as learner and C as facilitator, never from the browser. Publish only the reviewed module/activity needed for testing after confirming instructions and content.
5. **Frontend configuration:** Connect the isolated application to a preview Vercel project, set the public URL/key as environment variables, confirm host and preview route. No production release until acceptance.
6. **Unit and browser evidence:** Test with separate browser profiles/sessions, including a clean guest profile. Record screenshots and expected results; do not use any minors' accounts.

## End-to-end acceptance test matrix

| Scenario | Expected observation |
| --- | --- |
| Anonymous opens `/studio` | Prompt to sign in; no course content, submissions or grades |
| New Auth user with no membership | Enrollment pending, unable to self-enroll |
| Learner A sees published activity | Only assigned/published content and rubric |
| Learner A saves draft, refreshes page | Draft is persisted and recoverable |
| Learner A submits final work | `pll_submissions` created once; submission cannot be changed by learner |
| Learner A attempts Learner B's draft/submission by REST ID | Denied/no row under RLS |
| Learner A tries to call review RPC or write facilitator grade | Denied by RLS/function authorization |
| Facilitator C opens submission | Receives the correct work and complete rubric |
| Facilitator enters incomplete or over-maximum criterion score | Review remains unpublished; error appears |
| Facilitator publishes all scores and summary | Transaction succeeds atomically; scores linked to correct learner & activity |
| Learner A refreshes | Sees only their own published summary and criterion scores |
| Learner B refreshes | Cannot see Learner A's work, score, or feedback |
| Facilitator tries cross-course grading | Denied by membership; no data leaked |
| Reviewer learner role | Cannot access instructor data; can navigate required course content |
| Keyboard-only and mobile | Visible focus, every input reachable/labeled, no horizontal overflow |
| Auth/session expired | Reauthentication needed; no private content shown in public view |
| Supabase paused/unavailable | Helpful error, no false claim that data saved or feedback published |

## Known design gaps and risks

- Browser auth is a **source-level implementation awaiting a running build**, not a verified login. Database role checks passed for simulated nonmember but not two real logged-in users.
- Password sign-in will work only after actual Auth users can set credentials and the dashboard controls are configured.
- Non-persistent demonstration decision exercise on course homepage remains separate from graded activities. Needs an explicit learner-output/feedback bridge.
- Draft/submit path currently handles a **single final attempt per activity**, and drafts remain after final submission; this is intentional until revision/versioning semantics are decided.
- The rubric scoring RPC provides atomic updates and publication checks but currently does not create a **historical grade audit/version**. Re-evaluation can update an existing review; add version history before real youth use.
- No invitation admin UI, authentication recovery, extra enrollment UX, discussion forums, ten-item LMS quiz, Level 1 survey, private upload flow, full accessibility audit, production monitoring, or actual course multimedia yet.
- Supabase Free inactivity pausing risk remains; the existing 8-hour monitoring automation does not guarantee uptime. Verify live state before Dr. Evans and peer access (target November 27).
- Real learner data from minors is out of scope without consent, privacy, protection and operational review.
- Module 3 Nov 9 formal ID portfolio, content grid, and peer review take priority over nonessential LMS polish.

## Engineering gate

Do **not** merge or deploy publicly just because the CI build is green. Minimum proof requires A/B/C isolation and complete learner→facilitator→learner feedback with real Supabase Auth sessions and correct instructor rubric behavior.
