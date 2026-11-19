# Project Launch Lab — acceptance checkpoint 1: learner journey and role-testing preflight

**Date:** November 18, 2026  
**Status:** partial acceptance only; draft PR #15, protected review preview, no course publication.  
**Story under test:** an invited learner opens a two-module course, receives instruction and corrective practice, carries a self-chosen direction into a safe first plan, deliberately saves/shares work, receives facilitator feedback, records a real attempt or honest obstacle, submits a graded portfolio, sees authorized rubric feedback, and knows a defensible next step. A different learner must not see that work.

## Evidence and status by boundary

| Boundary | Evidence from this pass | Verdict |
| --- | --- | --- |
| Next production build and protected review source | `npm run build` passed; the two review routes are produced in the route manifest. Earlier private Vercel deployment for commit `8c00107` reached READY and returned provider-authenticated HTTP 200 with the academic rubric text. | **Build/HTTP verified, not a browser walkthrough.** |
| Live browser → private preview | Independent cloud Chrome navigation to `/module-one-preview` was redirected to Vercel's **Log in to Vercel** page. No sign-in was attempted, protection was not disabled or circumvented. | **Blocked at SSO**; manual preview acceptance remains open. |
| Local headless browser | Existing `/usr/bin/chromium` failed to start under Playwright: `socket() failed: Operation not permitted`; a separate cloud browser cannot connect to this shell's `127.0.0.1` server. | **Environment limitation**, not evidence that the LMS page itself crashes. |
| Module 1/2 instructional sequence and accessibility semantics | New `npm run test:a11y:synthetic` runs `axe-core` WCAG 2 A/AA + 2.1 A/AA semantic rules on **all five Module 1 and nine Module 2 steps**. Asserts one current step and focus on each new heading; tests that the in-session First Move Card survives tab navigation. | **3/3 tests pass; 0 detected semantic violations** in this synthetic DOM. Color contrast, screenshots, real keyboard focus order, browser/media and screen-reader behavior **not verified**. |
| Existing learner interaction logic | `npm run test:formative` (30/30) and `npm run test:lesson` (5/5) pass with stubbed course data. All lesson quiz/decision options, pending feedback, revision/retention, genuine obstacle and separate immutable follow-up logic are covered by synthetic component tests. | **Source interaction verified**, not real account persistence. |
| Actual database and publication baseline | Read-only dedicated Supabase `project-launch-lab` check returned `ACTIVE_HEALTHY`; 1 course, 2 published modules, 4 published activities, **0** final submissions, **0** rubric scores and 2 memberships at the query time. No rows were altered. | **Observed live state**, not a full synthetic walkthrough. |
| Structural privacy controls | Read-only catalog query identified **14/14** public `pll_*` tables with RLS enabled and no `public`-role policies in the 14-table policy summary. Important owner-based predicates appear on drafts, submissions, lesson progress, scores and membership reads. | **Structural preflight positive**, but an actual A/B/facilitator JWT test is still required; policy presence is not proof of denial behavior. |
| Supabase Auth posture | Supabase security advisor reported a **warning: leaked-password protection disabled**; health advisor reported no notices. Local runner has no `SUPABASE_SERVICE_ROLE_KEY`, publishable URL/key, or explicit `PLL_ALLOW_SYNTHETIC_ROLE_TEST` opt-in. | **Do not invite participants yet.** Review [password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) and actual invitation controls before authorized test. |
| Learner → database → facilitator → feedback | Source includes membership lookup, RLS-scoped data queries, draft insert/update, immutable final insert, rubric or formative RPC publishing and authorized learner feedback display. No real three-identity test run because privileged staging credentials and correct Auth redirect/email protection setup remain unavailable. | **Code path inspected; end-to-end behavior unverified.** |
| Academic scoring contract | Author-authored academic LA 4.1 proposes four × 15-point criteria (60) with anchors 15/10/5/0, but published LMS `launch-portfolio` has three × 10 (30) and free numeric scoring. Proposed foundational MLOs do not yet have literal scored evidence. | **Stop/go conflict open.** See [rubric reconciliation](LAUNCH_PORTFOLIO_RUBRIC_RECONCILIATION_2026-11-18.md) and [MLO crosswalk](OUTCOME_TO_GRADED_EVIDENCE_CROSSWALK_2026-11-18.md). |

## Specific QA improvements committed in this checkpoint

1. Add an independent, reproducible semantic accessibility/step-navigation test in `scripts/preview-accessibility.test.cjs`, invoked through `npm run test:a11y:synthetic`.
2. Test all 14 preview steps, expected H2 focus after step changes, singular `aria-current="step"`, and preservation of in-session First Move Card content across tab changes.
3. Pin `axe-core` to an exact dev-dependency version and update the app's lockfile to keep the test reproducible.
4. Keep this test distinct from actual browser audits; axe running in jsdom cannot detect contrast, visual overlap, actual keyboard order, speech output, or browser-only interaction faults.

## Acceptance scenarios still requiring real identities and devices

1. **Invitation/Auth setup:** verify exact branch-stable redirect origins, actual invitation template, signup-disabled configuration, expiration/failure states and Vercel reviewer access. Use consenting adults only; never paste secret keys or tokens into issue reports.
2. **Learner A:** open published M1 practice and Direction Brief; save, reload, submit immutable final; receive formative and scored feedback; progress to M2 actions. Check real course copy and separated formative follow-up activity publication before attempting a full journey.
3. **Learner B:** fail to select/read/alter A's drafts, submissions, feedback, rubric or lesson progress; fail to submit as A; fail to publish scores.
4. **Facilitator C:** see assigned submissions; publish no-score formative notes, then complete rubric criteria with narrative feedback; incomplete/wrong-role review must fail; A sees only published own feedback.
5. **Data cleanup:** verify synthetic Auth users and related rows removed after exercise; re-check count baselines, published flags and advisors; never run the destructive cleanup without exact synthetic identifiers and separate approval.
6. **Manual accessibility:** 390px/768px/desktop views, headings and focus, full keyboard route, visible labels/status, skip link, charts/media transcript, colors and any screen reader. Capture screenshots/defects without private learner information.
7. **Faculty gate:** resolve direct graded MLO evidence, exact score values and totals, barrier-versus-attempt CLO5 accommodation, actual Canvas LA 4.1 submission receipt and permission to present this custom LMS as a review route.

## Verification commands and boundary of claims

```bash
cd apps/project-launch-lms
npm run test:a11y:synthetic
npm run test:formative
npm run test:lesson
npm run lint
npm run typecheck
npm run build
```

**Observed:** 3/3 new a11y/step tests, 30/30 formative, 5/5 lesson, lint, TypeScript and production build passed. The new script uses a test-only native-anchor stand-in for Next Link to avoid unrelated asynchronous prefetch effects; it makes **no** claims about actual navigation or authenticated persistence.

**No release:** keep PR #15 draft/unmerged, the public OWLL website unchanged and live Supabase content/rubric unchanged. Do not create test accounts or send invitations simply to close a report line. The next full acceptance pass begins **only after** the protected browser and explicitly authorized synthetic Auth environment can actually be used.

## Checkpoint 2 addendum — private source safeguard for an unresolved academic rubric

**Date:** November 18–19, 2026. **Scope:** draft LMS client only; no Supabase schema/data changes, no new users, no public release.

The signed-in course previously allowed ordinary `launch-portfolio` final submission and facilitator score publishing using whichever criteria the LMS happened to contain. That is not an acceptable test assumption while the authored academic rubric (4 × 15 = 60 with explicit performance anchors) differs from the currently published LMS rubric (3 × 10 = 30), and faculty authorization of the assessment contract is unverified.

- **Learner:** The Launch Portfolio final-submission button now stays disabled with a clear explanation. Learners may still save draft responses. Other graded activities, including Direction Brief, are unaffected.
- **Facilitator:** The Launch Portfolio score-publishing button stays disabled with a warning that reports the configured total. This hold persists even if the criteria happen to match the academic draft; matching numbers are not evidence of faculty signoff. Other rubric-scored and ungraded reviews remain operational.
- **Defense-in-depth:** The action handlers also refuse a Launch Portfolio final submission or scored review if invoked through the component while the hold is active. This **does not** enforce a database-wide freeze: direct RPC/API requests could bypass a client-only guard. Before any real learners or grades, release controls must also be implemented in an authoritative server/database path after explicit approval.
- **Test coverage:** Two isolated role-UI tests exercise the current 30-point mismatch and saved-draft behavior; a third confirms the 60-point copy remains held pending faculty acceptance. All tests use synthetic in-memory clients; they do not prove RLS, real Auth, or true persistence.

**Release decision:** no change. Remove the hold only after a faculty-approved scoring contract, exact source/database rubric reconciliation, authoritative write-path enforcement, verified role tests, and a separate release decision. Do not misrepresent this source UI guard as protection of the current Supabase backend.
