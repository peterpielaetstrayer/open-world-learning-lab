# Project Launch Lab — Academic Release QA and Acceptance Record
**As of:** Sunday, November 22, 2026 · **Scope:** USD LDT 560 two-module capstone · **State:** PRIVATE REVIEW / NO-GO FOR FINAL SUBMISSION

> This is the evidence-backed acceptance tracker, not a completed OLC Scorecard or an attestation that the course is ready. The November 22 review uses the **original two-page _Capstone LMS Course Requirements_ checklist** supplied by the student; the LDT 560 online-course blueprint and Content Curation Planning Grid; actual OWLL Supabase project `wjormscrikzocelbjxvc`; private LMS draft PR #15; and the November 19 authenticated Canvas course audit. Original faculty rubric and original academic artifacts are preserved. Do not use preview/demo pages as proof of enrolled-user operation.

## A. Scope and current release decision

- **Course:** Project Launch Lab: From Curiosity to Action; title from the original academic blueprint. Module 1 Discover & Define; Module 2 Plan & Launch.
- **Dedicated app:** `apps/project-launch-lms`, Next.js on Vercel `project-launch-lms`, draft PR #15; separate from the public OWLL website.
- **Live LMS database:** 1 course; 2 published modules; **18 total activity records, 4 published, 14 unpublished staging drafts**; M1 7 total (2 published/5 draft), M2 11 (2 published/9 draft); 10 quiz questions with explanations; 2 Auth users (1 facilitator and 1 learner membership); zero persisted learner submissions, drafts, grades, quiz attempts, surveys, discussion posts or progress.
- **Build assurance:** private branch GitHub Actions, synthetic learner/unit tests, lint, TypeScript, production build, Vercel READY; these do not prove external browser/learner access.
- **Faculty/reviewer access:** **NO-GO** as of this checkpoint: Vercel preview SSO enabled, real reviewer role and independent instructor link not proven. Do not disable protections or send test invitations without an access plan.
- **Grading:** published Direction Brief 3×10=30; published Launch Portfolio 3×10=30 conflicts with submitted academic design **4×15=60**. The UI holds final portfolio submissions; **server-side restrictive RLS policy `pll_launch_portfolio_submission_hold` was added on Nov22 and tested** so a direct API call cannot bypass the academic hold. No grades or existing records changed. Future approved rubric release needs a separate migration and test.
- **Nov23 academic gate:** LA5.1 Website URL submission + separate Journal5.1. Nov27 peer access. Nov30 full LMS + actual QA and peer review. Dec7 recorded presentation and final journal.

**Release principle:** **Source-authored ≠ staged in database ≠ published ≠ accessible ≠ authenticated-learner-tested ≠ instructor-accepted ≠ submitted.** Mark stages explicitly and retain dated evidence.

## B. Original faculty checklist crosswalk

Status: VERIFIED = direct live evidence of that specific requirement; STAGED = source or unpublished draft only; UNVERIFIED = not yet inspected in actual course; BLOCKED = cannot meet requirement yet; N/A = conditional. Completed source functionality may still be UNVERIFIED for academic delivery.

| # | Original course requirement | Verified evidence / current state | Status | Acceptance task |
| --- | --- | --- | --- | --- |
| C01 | Course title | Live course title matches blueprint's short title | VERIFIED | Visually check in signed-in home, keep long subtitle if desired |
| C02 | Course dates (if applicable) | No learner activity due dates set; USD Canvas deadlines are separate | UNVERIFIED | Add genuine instructional schedule or explicitly explain self-paced timing; do not invent a cohort |
| C03 | Prerequisites (if applicable) | Not established; course is introductory | UNVERIFIED | State that no formal prerequisites are required if academically intended |
| C04 | Instructor/facilitator bio and contact | Name/contact not independently verified in student course; do not invent email | BLOCKED | Insert real approved facilitator bio and working contact method, test as student |
| C05 | Instructor/facilitator welcome announcement, text | Learner-facing welcome copy authored privately, not posted as announcement | STAGED | Publish actual welcome announcement or approved visible equivalent |
| C06 | Course overview **video** | Original narration, transcript and storyboard scripted; no completed video/captions acceptance | BLOCKED | Reuse verified authentic original asset or record/edit/caption video; test playback and transcript |
| C07 | Description on home page | Live description exists (929 chars); design copy staged | VERIFIED/NEEDS VISUAL | Verify how it renders and links to modules |
| C08 | Course learning outcomes | Original six CLOs preserved in academic blueprint; current home display/wording not accepted | UNVERIFIED | Display exact original/approved CLOs with readable learning language; resolve faculty MLO critique explicitly |
| C09 | **Q&A forum** | `questions` channel/RLS/application coded | SOURCE-ONLY | Test create/read/reply, moderator access and community safety |
| C10 | **Peer-to-peer forum** | `peer-feedback` channel/RLS/application coded | SOURCE-ONLY | Test peer visibility and replies with distinct learner identities |
| C11 | At least two content modules, including LDT555 original | Two published modules in live DB, including Module1 | VERIFIED | Check contents visually |
| M1a | Module 1 introduction | Unpublished `module-one-introduction` draft with companion reading | STAGED | Publish after review; verify prerequisite order |
| M1b | M1 outcomes mapped to CLOs | Original MLOs and proposed rewrites both documented; faculty feedback remains open | BLOCKED | Confirm six foundational MLO wordings and direct scored-evidence crosswalk |
| M1c | M1 assigned reading(s) | Original reading `Three Lenses, One Decision` staged in intro | STAGED | Verify actual reading is clear, accessible, linked |
| M1d | At least one original multimedia instructional product in M1 | Ten-screen original interactive lesson source and Gauntlet external asset; faculty qualification/playback unverified | UNVERIFIED | Review as original multimedia with Dr. Evans or provide independently accepted finished product |
| M1e | M1 learner activity with intro/directions/due date | Gauntlet published and new diagnostic/comparison unpublished | PARTIAL | Confirm written instructions, real learner task, resources and applicable timing |
| M1f | M1 graded assignment with rubric and due date | Direction Brief published 30-pt rubric (3 criteria) | PARTIAL | Test accessible criterion anchors, direct MLO assessment, actual grade workflow, due date/instructions |
| M1g | M1 conclusion | Unpublished `module-one-conclusion` | STAGED | Verify transition to Module2 after graded work |
| M2a | Module 2 introduction | Unpublished `module-two-introduction` with original planning reading | STAGED | Publish after reading QA |
| M2b | M2 outcomes mapped to CLOs | Original/adjusted MLOs documented but approval/direct scored evidence unresolved | BLOCKED | Faculty review; do not change academic blueprint silently |
| M2c | M2 assigned reading(s) | `An Informative First Move` staged in introduction | STAGED | Check instructional clarity, text accessibility |
| M2d | Original multimedia instructional product in M2 | First Move Studio original interactive audio + accessible written description source; media acceptance unverified | UNVERIFIED | Test audio and full equivalent; confirm faculty checklist qualification |
| M2e | M2 learner activity with intro/directions/due date | First Move Studio published; First Move Card, revision and evidence drafts staged | PARTIAL | Verify complete interaction, feedback loop and genuine safety/barrier route |
| M2f | M2 graded assignment with rubric and due date | Published Launch Portfolio has **30-point conflicting rubric**, final submission safely gated in UI **and DB** | BLOCKED | Obtain faculty confirmation of 60-pt rubric, safely reconcile and verify graded workflow |
| M2g | M2 conclusion | Unpublished `module-two-conclusion` and ungraded exit reflection | STAGED | Publish/test conclusion and later exit reflection |
| A01 | One LMS-graded **10-question quiz** with feedback for correct/incorrect | Ten DB questions/choices/explanations; server-side grade RPC verified with rollback | BACKEND-PASS | Authenticated browser quiz, feedback accuracy, keyboard+mobile, receipt |
| A02 | Clearly identified summative assessment | Academic plan identifies Launch Portfolio | BLOCKED | Align/enable the approved M2 rubric; do not claim complete scoring before hold resolved |
| R01 | Course resources embedded in modules or resources navigation | Original companion readings staged, resources navigation coded | PARTIAL | Check actual links, template availability, licenses, accessibility |
| E01 | Level 1 course evaluation survey | Ten five-point ratings + optional question coded; actual DB insert/returning and aggregation verified in rollback | BACKEND-PASS | Signed-in learner receipt, correct privacy wording, instructor readback, mobile QA |
| E02 | LA5.1 Level 2 knowledge/skills/attitude evidence | Quiz + M1 authentic Direction Brief + ungraded Level2 exit check staged, as distinct evidence domains | PARTIAL | Live instructor view and saved/readback exit response; distinguish self-report vs performance |
| QA01 | OLC-adapted online course scorecard and improvement plan | **NOT completed**; this document is only the original requirements crosswalk and acceptance tracker | OPEN | Fill actual assigned template and score after manual course review, no invented ratings |
| QA02 | Course QA checklist/attestation | Automated source/DB evidence exists; no full real browser accessibility or learner acceptance | OPEN | Test signed-in identity A/B/facilitator, keyboard, screen reader, mobile, video captions, links and scorecard |
| AC01 | Faculty in Instructor role and peer Student access | Current app role names are `facilitator` and `learner`; equivalence/acceptance not approved | BLOCKED | Confirm role meaning with professor, independently test link and scope of access |

### Original two-page faculty checklist versus additional course requirements

The core original checklist itself does not specify a polished multi-level rubric, explicit discussion due dates, a specific narration length, or a faculty-approved custom LMS. Those are prudent quality/assignment-specific gates, not rewritten checklist facts. Keep academic expectations from Dr. Evans, LA4.1, LA5.1, Assignment6.1 and reviewer access distinct.

## C. Database and source evidence (November 22)

| Test | Type | Result | Limitation |
| --- | --- | --- | --- |
| Published/draft visibility | Postgres RLS simulated `authenticated` | Learner 4 published/0 draft; facilitator 18/14; nonmember 0 course/quiz/rubric records | Does not establish real user JWT/browser session |
| Formative draft→final→feedback | Rollback-only DB transaction | PASS, learner saw facilitator feedback; no graded scores added | Only one true learner membership; role switched transactionally |
| M1 Direction Brief grading | Rollback-only DB transaction | PASS three criterion scores 8+7+9=24/30, learner received review | Does not test complete UI or academic MLO validation |
| Server-graded 10-item quiz | Rollback-only DB transaction | PASS 10 explanations/score | Does not test browser, accessible radio controls or retry expectations |
| Level1 reaction survey | Rollback-only DB insert identical to client payload | PASS 10 ratings + comments + returned receipt timestamp | Does not test UI/mobile |
| Academic M2 final submission hold | Direct learner-simulated API-level insert before/after RLS migration | Before: wrongly accepted. After: permission denied by `pll_launch_portfolio_submission_hold`. Saved working draft and M1 final still allowed | Hold intentionally remains until faculty approval |
| DB residue | Independent post-rollback query | 0 learner drafts, finals, published feedback, scores, quiz attempts, surveys | No live learner/pilot outcome evidence |
| Private source CI | GitHub Actions | Prior 57/57 app tests and build green; recheck current head | Unit/synthetic ≠ browser acceptance |
| Security adviser | Supabase `security` adviser | Leaked-password protection disabled warning; RLS tables enabled | Enable protection before real cohort enrollment; 20 unused indexes INFO are not cleanup mandate |

The DB approval gate is tracked in source at `supabase/migrations/20261122182642_pll_launch_portfolio_server_submission_hold.sql`, linked to applied Supabase migration history version `20261122182642`. Releasing it requires a separately audited migration **after** reconciling the academic rubric; no direct SQL bypass in the interim.

## D. Real learner/facilitator acceptance script (P0)

Use **three consenting adult synthetic test identities** under approved access controls, not any real minor. Preserve test identity keys privately; do not paste passwords, JWTs or admin keys into chat or committed files. Record a QA checkmark and evidence URL/screenshot for each stage.

1. **External entry:** Open instructor-safe course link from fresh independent session; verify login/invite/setup and signed-out denial. Maintain privacy protection; never assume Vercel READY grants access.
2. **Learner A:** Open course Home → M1 intro/reading → diagnostic → 10-screen decision lesson → Gauntlet and text route → compare two directions. Test all nine corrective branches, state persistence, keyboard focus and mobile.
3. **Learner A formative:** Save, reload, share final comparison; prove saved artifact is immutable and cannot be overwritten via UI; check count and pending feedback.
4. **Facilitator:** Review learner A formative response and publish helpful text-only critique. Verify learner A can read it after reload and that it remains ungraded.
5. **Learner B privacy:** Sign into separate account, verify cannot read learner A's draft, final or feedback, even through direct URL and API. Confirm distinct course membership/permissions.
6. **Module 1 graded:** Learner A sees Direction Brief instructions and actual rubric, submits; facilitator publishes all three criterion scores, and learner reads complete rubric feedback and total.
7. **Module 2 prerequisites:** Open mini-lesson, Maya *garden* model, all 3 guided checks + explanation branches, then Ari *rhythm-guide* transfer scenario; validate audio alternate text and focus.
8. **Module 2 project:** Create card → save/share → facilitator critique → separate documented reasoned revision/retention → genuine attempt or real barrier. All events survive reload.
9. **Summative gate:** Confirm M2 portfolio final submission is **blocked** server-side until approved 60-point rubric. Do not counterfeit a completed assignment.
10. **Knowledge quiz:** Learner A completes all ten questions; receives item-specific correct/incorrect explanations and recorded grade. Attempt should not leak answer key beforehand.
11. **Evaluation:** Learner A submits 10 ratings, optional text; sees a submitted receipt; facilitator sees aggregate results; other learners cannot see private response.
12. **Accessibility:** Full keyboard-only walkthrough; contrast/WAVE of actual rendered course; skip navigation, headings, form labels, errors/status; narrow-screen 320px/375px; screen-reader spot checks; captions/transcripts, media accessibility, tested external Gauntlet route.
13. **Reviewer roles:** Provide Dr. Evans an accepted Instructor-level access path, peer Student-only path, verify both independently and confirm final links accepted by faculty.

**P0 completion condition:** all tested, unresolved severity-1/2 issues fixed, course checklist crosswalk complete, and faculty receives authentic reviewer access. A student-facing release is not approved by database role simulations alone.

## E. Immediate academic decision and fallback

**LA5.1 due November 23:** actual accessible LMS rubric + Level2 quiz/skill/attitude package + Level1 10–15-item reaction survey, submitted as a Website URL in USD Canvas. The source-backed custom package is strong, but its new exit check remains unpublished and no independent faculty-safe URL is certified. If external access cannot be confirmed, use a **previously established but independently verified Canvas Lite** course with these three actual assessment objects. Do not treat a code preview or staged document as an LMS submission. Journal5.1 remains a separate first-person review/Canvas submission.

**Nov27–30:** original course checklist, OLC-adapted scorecard, improvement plan and QA checklist; faculty and peer role acceptance; capture USD submission receipts.

**Deferrals after capstone:** generic OWLL/LOCUS features, wider course authoring, multi-tenant platform, wider mentor networks, analytics and public release. Avoid conflating generalized platform completion with a two-module capstone.

## F. QA sign-off register (to fill only after tests)

| Area | Reviewer | Actual evidence | Decision |
| --- | --- | --- | --- |
| Academic outcome/rubric approval | Dr. Evans / course designer | Not yet documented | OPEN |
| Module1 learner flow | Independent adult test learner | Not yet run | OPEN |
| Module2 learner flow | Independent adult test learner | Not yet run | OPEN |
| Learner-to-learner data privacy | Adult learner A and learner B | Not yet run | OPEN |
| Facilitator submission/grading | Facilitator test account | DB simulated only | OPEN |
| Faculty link / equivalent Instructor access | Dr. Evans | Not yet verified | OPEN |
| Original multimedia and full accessibility | Course designer/tester | Source only | OPEN |
| OLC Scorecard and improvement plan | Course designer | Not yet scored | OPEN |
| Assignment6.1 LMS delivery and Canvas receipt | Student | Not submitted | OPEN |

**Status on November 22:** safe to continue private course authoring and testing; **not** safe to attest complete course or submit protected draft URL as a finished instructor-accessible LMS.


## G. November 22 verified quiz continuity correction

The original ten-item project-scenario quiz included rhythm-guide questions 1, 6 and 8 that still named **Maya**, even though the revised planned Module 2 worked model uses **Maya** for a garden and the rhythm-guide transfer scenario is now **Ari**. With **zero** learner quiz attempts, the live quiz text was changed through reviewed, precondition-guarded data migrations **20261122183218**, **20261122183235** and **20261122183316**, mirrored in the private source. These updates change **character-name/pronoun consistency only**; no question count, option order, correct answer, score, rubric or existing attempt was changed.

**Verified final SQL readback:** 10 quiz questions; 0 inappropriate Maya/she/her case references; all 3 affected rhythm cases retain expected answer index 2; no persisted quiz attempts, drafts, submissions, rubric grades or feedback; 14 staged activities still unpublished. A rollback-only regrade still yielded one 10-explanation quiz receipt and score 3/10 for the fixed test answer array; rolled back. The graded quiz remains subject to actual browser and accessibility acceptance testing.

## H. November 22 continuation — published Ari continuity and academic delivery gate

**New live read-only inspection:** Module 1 has seven activities (two published, five unpublished); Module 2 has eleven (two published, nine unpublished). Every activity due-date field remains null. The published Project Direction Brief has three ten-point criteria with short descriptions (30 points); the published Launch Portfolio still has three ten-point criteria (30 points), conflicting with the academic four fifteen-point criteria (60 points). The separate Level 2 exit reflection remains unpublished. Ten quiz items are present, with zero final learner submissions or course evaluations. This does not establish an instructor-accessible LMS.

**Verified non-scoring correction:** The published First Move Studio directions said “Work through Maya’s three decisions” even though the rhythm-guide widget and corrected quiz use Ari, with Maya reserved for the school-garden model. A guarded migration, 20261122190739_pll_align_live_first_move_studio_ari, changed only the opening sentence to “Work through Ari’s three decisions.” Preflight showed zero drafts and finals for that activity; post-change readback confirmed the corrected text, unchanged published status and zero learner work. Source mirror: supabase/migrations/20261122190739_pll_align_live_first_move_studio_ari.sql, draft PR #15 commit 24229deaf9adf947c76b18bdd9fbd6f9e017608b. No scoring, quiz answer, rubric, enrollment, draft activity publication or portfolio hold changed.

**Editorial acceptance to resolve in reviewed release:** The published Launch Portfolio directions still imply a completed attempt even when a genuine safety/permission barrier prevents the action; the authored academic assignment explicitly permits an honest obstacle route. Resolve during approved rubric/instruction release, not by changing grading expectations silently. Confirm whether the Direction Brief's three short 10-point criterion descriptions meet Dr. Evans's rubric expectation or whether anchored performance levels must be made visible; do not invent unapproved scoring bands.

**Academic access and submission:** The separate Process Journal 5.1 Google Doc is substantively drafted but still requires Peter's personal approval and an actual Canvas receipt. The linked OLC design scorecard and QA checklist template Google Docs returned 403 via the connected Google identity; this does not establish absence. The instructor-safe URL, adult learner A/B and facilitator browser test, actual quiz/survey receipts and Canvas Lite fallback access remain unverified. LA5.1 is NO-GO for claiming full actual LMS delivery until its three required assessment objects are accessible and usable by Dr. Evans.

**No other release:** No real faculty/student invitations, account changes, site publication, grading migration, course rubric mutation or Canvas submission occurred in this continuation.

## I. November 22 LA 5.1 Module 4 rubric alignment correction

Re-opened the native submitted [Learning Activity 4.1](https://docs.google.com/document/d/10yuO1tn3BHsIXFpsZRRm-9Jq5YNbWTwZFzhVm4sy0bs/edit) including its actual rubric table, not merely the rubric summary. LA 4.1's **graded Module 4 assignment is the Launch Portfolio**, with **four criteria ×15 points (60 total)** and four behavior-anchored levels (**15/10/5/0**). Its six learner directions explicitly accept an honest permission/safety/resource obstacle and require three milestones, a checklist, evidence limitation and feedback-informed next move. LA 5.1 Part 1 asks for the rubric attached to graded work **authored in Module 4**. Therefore the currently published **30-point Module 1 Direction Brief** remains useful *supporting Level 2 applied-skill evidence* but cannot safely be claimed as a direct replacement for the LA 4.1 Launch Portfolio rubric. This clarifies and supersedes earlier shorthand making the Brief the primary LA5.1 Part1 candidate.

A verified, self-contained [private LA5.1 instructor setup / Canvas Lite fallback packet](https://docs.google.com/document/d/166NEhBNpEVLU25iWDCrNWjzDf2_NXeukfD4FhyeK0VA/edit) now includes all four original academic rubric criteria and levels; six directions; the exact ten configured scenario questions with instructor-only answers and feedback explanations; Level2 applied-performance and four ungraded confidence/disposition/intention/transfer prompts; and the original ten-question Level1 survey with privacy disclosure. Google Docs readback confirmed all source sections, ten quiz questions, ten survey statements and four rubric criteria. **Private preparation only**: the document itself is not an LMS, does not prove a Canvas Lite course exists, and must not be shown whole to learners because it contains the answer key. The protected custom LMS's discrepant published 30-point Portfolio rubric and server-side hold remain unchanged. No faculty signoff, user submissions, instructor access, account invitations, rubric migration, or published exit activity was established.

Decision for Nov23: use the academic **60-point LA4.1 rubric as primary LA5.1 Part1 source** in an independently verified LMS route, not a stale 30-point Portfolio and not the Brief alone. Faculty confirmation on anchored score bands and MLO direct evidence remains open.

## J. November 22 next completion sprint — correct learner-facing stale rubric and CLO visibility

**Protected source changes (no learner-data edits):** The authenticated course's Assignments list, module outline and active assessment page previously exposed the **obsolete 30-point Launch Portfolio rubric** despite an enforced final-submission hold. The private draft branch now identifies this assignment as **on hold**, suppresses the conflicting live 30-point criteria instead of presenting them as valid grading expectations, preserves draft saving and the disabled final-submission control, and leaves the unrelated Direction Brief's rubric visible. A React synthetic regression test now asserts these distinct states.

**Checklist C08 resolved at source level:** The course home now displays all **six original, unchanged CLOs** from the academic blueprint, with honest language distinguishing learning aims from learner achievement and permitting a genuine first-action barrier without fabricating an attempt. The existing synthetic dashboard test asserts all six visible outcomes. This closes the *source-display implementation* gap, not independent signed-in browser/a11y acceptance.

**Source commit and CI:** GitHub private PR #15 head `271faae73bb4a528bef8b63d9f7423830982d3c1` passed **Project Launch LMS — CI** and **OWLL website checks**. LMS job steps for locked installation, high/critical dependency audit, lint, fail-closed admin check, TypeScript, instructional/assessment regression tests, synthetic accessibility/contrast tests and production build all reported success. Matching Vercel preview deployment `dpl_64fh7V4QDS8zB7qH7eh9JdL6UuSe` reported READY. Vercel's authorized server-side fetch returned HTTP 200 for current `/`, `/studio`, `/courses`, `/studio-preview`, `/module-one-preview`, and `/module-two-preview`, but these only verify server-rendered page delivery, not post-hydration behavior, user sign-in, saving, security or academic reviewer access.

**Role account preflight:** Read-only aggregate Supabase Auth/membership check confirmed exactly **one learner and one facilitator** membership; each existing account is email-confirmed and has previously signed in. This is **not** three-role QA: no independent second learner, no current browser session in this pass, and no Dr. Evans enrollment. Do not expose email addresses or manipulate account credentials to manufacture acceptance.

**Release remains NO-GO:** Vercel project remains `live:false` and preview deployment requires Vercel SSO; no permanent faculty-accessible URL, approved academic 60-point rubric release, real independent reviewer role, course overview video, 14 staged activity publication, or November23 Canvas receipt has been established. Supabase Security Advisor reported a warning that leaked-password protection is disabled; review [Supabase's password protection guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) before authorizing a wider external learner rollout. No security settings were changed here.
