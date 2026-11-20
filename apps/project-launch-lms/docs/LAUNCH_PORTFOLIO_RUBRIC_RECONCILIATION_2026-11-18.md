# Launch Portfolio — academic rubric and live LMS reconciliation

**November 18, 2026 · review-only design control · PR #15 · no database changes authorized**

## Evidence sources and authority

1. Peter's authored [LDT 560 Learning Activity 4.1 academic document](https://docs.google.com/document/d/10yuO1tn3BHsIXFpsZRRm-9Jq5YNbWTwZFzhVm4sy0bs/edit), the original four-criterion Launch Portfolio assignment and 5-column performance-level rubric. Read as native Google Docs text and table on November 18.
2. Read-only query against Supabase project `wjormscrikzocelbjxvc`, published Module 2 activity `launch-portfolio`, executed November 18; returned **three** rubric criteria at 10 points each, **zero** final submissions and **zero** rubric score rows for this activity.
3. Draft LMS source: `app/studio/page.tsx` (facilitator numeric score form, `step="0.01"`), `app/studio/rubric-editor.tsx` (cannot edit published rubrics), `app/studio/course-navigation.tsx` (sums live criterion maxima), and `app/studio/launch-portfolio-rubric.tsx` (new review-only transcription).

**Authority boundary:** The 60-point document is Peter's submitted academic design, not independently evidenced faculty approval of the custom LMS or a mandated production grade. Do not silently alter published grades, rubric rows, student records or Canvas assignments. Do not assume the academic instructor has signed off on the current proposed MLO crosswalk.

## Exact rubric reconciliation

| Position | Academic LA 4.1 design (15-point criterion) | Current published LMS (10-point criterion) | Decision |
| --- | --- | --- | --- |
| 1 | **Purpose and planning coherence**: purpose, at least three ordered milestones, and links among plan, constraints and intended evidence | **Feasible plan**: coherent steps, resources and constraints | Separate purpose/coherence from feasibility; preserve three-milestone requirement |
| 2 | **Resources, constraints, and feasibility**: meaningful constraint and response, safe bounded first action, checklist | **First-action evidence**: bounded attempt or obstacle and observed evidence | Published rubric collapses feasibility into C1; add distinct feasibility criterion in eventual approved migration |
| 3 | **First action and evidence interpretation**: inspectable actual attempt or credible documented obstacle, interpretation, at least one limit | **Evidence-informed next step**: feedback and experience shape next decision | Restore an explicit evidence-and-limitation criterion; a genuine documented barrier is legitimate evidence |
| 4 | **Feedback, revision, and next decision**: specific feedback plus evidence, justified change or retention, next step and uncertainty | **No fourth criterion** | Preserve the formative feedback → reasoning → next decision chain |
| **Total** | **4 × 15 = 60** | **3 × 10 = 30** | **Open conflict; do not assess against stale rubric** |

### Performance levels, also not yet implemented in actual grading UI

The academic document's rubric specifies four columns: **15 — Proficient, 10 — Developing, 5 — Beginning, 0 — Missing**, with separate behavioral descriptors for each criterion. The current facilitator interface uses a free numeric input with 0.01 increments; it does not present or enforce those four anchored performance levels. A 60-point total alone would not fix this discrepancy. Confirm with Dr. Evans whether only the four anchors are valid or whether intermediate points are permitted before implementing scoring controls.

The source-only `LaunchPortfolioRubricReview` component reproduces the academic four criteria and sixteen descriptions in a protected review route. `compareLaunchPortfolioRubric` is a pure, testable check of criterion count, order, titles, maxima and total. Neither is currently connected to published grading or used to calculate scores.

## Required learner evidence mapped to assessment

| Academic criterion | Learner-owned evidence from completed course experience | Specific validation question |
| --- | --- | --- |
| Purpose and planning coherence | Module 1 Direction Brief carried into Module 2; First Move Card purpose, three ordered milestones and evidence target | Does the learner connect each milestone to the problem and first test, rather than merely listing tasks? |
| Resources, constraints, and feasibility | First Move Card resource/permission/low-resource alternatives and first-action checklist | Is the action genuinely feasible and safe, including a plan for permission/constraint? |
| First action and evidence interpretation | Authentic action log **or** real obstacle account, dated/inspectable evidence and explicit limitation | Does the record distinguish observation from prediction and acknowledge what a single test cannot establish? |
| Feedback, revision, and next decision | Separate First Move Feedback & Revision Record, formative feedback, evidence interpretation, uncertainty and next checkpoint | Is retaining an existing plan supported by reasons, or is a meaningful revision explained, without fabricating received feedback? |

**Do not grade success, popularity, purchases, public sharing, AI use or external access.** A legitimate safe stop or realistic barrier is acceptable if it is documented and interpreted well.

## Additional discrepancy in published learner directions

The live published `launch-portfolio` instructions do mention an obstacle route, but also ask such a learner to describe **“the attempt, the obstacle”**. This can accidentally imply students must claim an attempted test even if safety or permission prevented it. Peter's academic LA 4.1 explicitly permits documentation of preparation, the genuine barrier and a realistic alternative **without a completed attempt**. The published instructions also omit an explicit requirement for at least three ordered milestones, a completed first-action checklist and an evidence limitation. Rewrite those instructions only in a reviewed, authorized publication pass.

## MLO/CLO alignment decision still open

The academic document proposes foundational **MLO 2.1** (identify plan components in a worked launch plan), **MLO 2.2** (apply a checklist to a supplied scenario), and **MLO 2.3** (interpret evidence and feedback in a worked example). The Launch Portfolio independently measures application to the learner's **own** direction (CLO 4–6). This is an intentional transfer but is not automatically direct assessment of the MLOs as currently worded. Dr. Evans's prior feedback requires a dated alignment crosswalk showing exactly how graded assessment connects to MLOs. Do not rewrite objectives or claim alignment approval from this review.

## Proposed gated rollout, not executed

1. **Academic acceptance:** verify Dr. Evans's exact graded-assignment alignment guidance and whether the 60-point rubric and discrete point bands are accepted.
2. **Freeze source scoring contract:** four named criteria, each 15 maximum, exact descriptors, confirmed allowed score values, evidence and limit expectations. Version the academic approved spec separately from the live database configuration.
3. **Data safety preflight:** recheck zero submissions and scores, existing rubric rows, publication state, RLS policies and any dependent grade views/functions immediately before approved migration; design rollback and avoid editing a graded rubric after learner submissions.
4. **Source/DB update after approval:** use an audited migration or approved draft rubric workflow; align activity instructions, rubric criteria, facilitator score controls, display totals and any exported feedback together. Preserve rubric/history if scores exist at that time.
5. **Role and accessibility acceptance:** real synthetic learner A/B and facilitator flow, rubric visibility, criteria/level selection, total 60 validation, score publishing, feedback, RLS privacy, keyboard/screen reader/mobile and review links. Use no minors or genuine learner grades.
6. **Faculty delivery gate:** confirm the custom platform or Canvas Lite arrangement, academic submission receipt and reviewer access before release.

## Source verification at this checkpoint

- `npm run test:formative`: synthetic unit/React tests (including pure rubric alignment check and the four-level review display).
- `npm run test:lesson`: original ten-screen Module 1 tests.
- `npm run lint`, `npm run typecheck`, and `npm run build` after source integration.

**Status:** READ and RECONCILED; 60-point reference CODED for protected preview; production rubric and assessment workflow **NOT UPDATED / NOT ROLE-TESTED**. No actual student data modified.
