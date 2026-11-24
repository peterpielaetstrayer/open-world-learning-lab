# Module 1 instructional sequence — implementation checkpoint

**November 18, 2026 · Draft PR #15 · review-only, not live course publication**

Peter reviewed the diagnostic direction positively and requested functionality-first development, reserving UI/style polish for a later pass. This checkpoint connects the approved storyboard into one inspectable, synthetic learning sequence without changing any existing published activity, learner record, grading rubric, or OWLL production site.

## Five-part protected learner preview

`/module-one-preview` (local development or authenticated Vercel **Preview** only):

1. **Welcome:** two-module promise and agency/privacy boundaries.
2. **Starting point:** the five-question, ungraded entry diagnostic with explanatory feedback (`EntryDiagnostic`).
3. **Learn the lenses:** original ten-screen lesson on relevance, feasibility and scope, three practice scenarios, nine feedback branches, draft export (`ProjectDirectionLesson`). It already covers the worked-example screens; no redundant mini-lesson was added.
4. **Gauntlet → compare ideas:** the source now includes `GauntletBridge` before `DirectionComparison`, linking the independently verified original public Gauntlet URL in a new tab, explaining how to return to the course, and offering a text-only equivalent (park-story outreach vs an appropriately permission-bounded paper plan). The learner may add one optional insight from either experience to the comparison card; they do **not** need to play or report a game score. `DirectionComparison` examines two learner-selected directions using relevance, feasibility and scope; a tradeoff for each; a tentative selection; what evidence could change it; and a question for facilitator feedback.
5. **Direction Brief:** proposed, separately graded 30-point performance task, three criteria (10 each), and bridge to Module 2. The preview does not accept or grade a Direction Brief.

Step switches keep earlier entered text mounted **within the current page session**. No database writes or identity are associated with this preview; learners must deliberately copy/export their drafts if they wish to retain them. Navigating away/reloading may lose entered data.

## Authenticated integration: source wired, publication not performed

The studio `LessonText` interpreter now recognizes three independent markers:

- `[[entry-diagnostic]]` — ungraded orientation with response preparation.
- `[[project-direction-lesson]]` — ten-screen lesson with manually saved, private `pll_lesson_progress` in an authenticated learner activity; now also offers deliberate transfer of the Project Direction Draft into the activity response field.
- `[[direction-comparison]]` — ungraded comparison card. Learner explicitly selects **Use this comparison in my course response**; the existing activity Save draft / Share with facilitator (final) actions are the only backend writers.
- `[[gauntlet-bridge]]` — verified Gauntlet launch/return instructions, non-grade boundaries and low-bandwidth text scenario; independent of the companion comparison marker.

If a course response already has text, preparing another card requires an overwrite confirmation. Declining leaves the response unchanged. No implicit save, grade, submission or facilitator disclosure occurs. Prepared text longer than 20,000 characters is refused without truncation; the new comparison form caps field lengths to fit within that limit. After sharing a final response, preparation is disabled.

**Read-only source reconciliation (Nov 18):** the published Module 1 `gauntlet-practice` activity already contains `https://project-launch-gauntlet.vercel.app/`, tells learners to open the game in a new tab and compare their own directions on return, and remains published. The Gauntlet site's HTML returned provider HTTP **200** and the authentic private source repository confirms a five-case, ~6–10-minute, no-account/no-personal-data simulation; this does **not** establish keyboard, screen-reader or game-flow browser acceptance. The preview's new bridge and optional insight are **not** in that published activity. The database still has no entry diagnostic activity; publication/ordering needs approval. No activity status flags or real accounts were changed here.

## Design decisions and remaining academic gates

- Preserve a low-bandwidth, text-only completion route. The Project Launch Gauntlet is an optional extension, not a dependency.
- The comparison's explanatory paragraph is **process feedback**, not an AI quality judgment or an automated score. Facilitator feedback is available only after an explicit share through the authenticated, ungraded response flow.
- Keep the separate 30-point Direction Brief rubric and the learner's ability to revise decisions; don't collapse lesson draft and summative submission into one automatic event.
- Resolve the actual course insertion order with the academic blueprint, published activity records, and instructor expectations. A plausible sequence is orientation diagnostic → taught lesson → two-direction formative comparison → graded Direction Brief, but **not yet published**.
- Resolve the **Module 2 Launch Portfolio** rubric disagreement (live 3×10 vs storyboard 4×15) from the authoritative assignment before changing scores or course records.
- Actual three-account Supabase Auth/RLS, learner/facilitator handoff, responsive mobile, keyboard/screen-reader, media alternatives, and professor-facing access tests remain unverified. Do not describe this as a completed LMS or replacement for Canvas.

## Verification

- `npm run test:formative`: **13/13** synthetic React/DOM tests; new tests for lesson-draft preparation, comparison draft transfer/overwrite refusal, and cross-step persistence within the protected Module 1 review.
- `npm run test:lesson`: **5/5** independent ten-screen scenario/feedback tests.
- ESLint, TypeScript and Next production build passed locally; Next routes include `/module-one-preview`.
- All DOM tests stub Supabase; they do not prove RLS or real authenticated browser behavior. Vercel/visual acceptance must be recorded independently of route build success.

## Release boundary

Changes stay in the draft LMS branch of `peterpielaetstrayer/open-world-learning-lab`, under `apps/project-launch-lms`, deployed only to its dedicated protected Vercel **Preview**. Do not merge PR #15, alter the public OWLL website, enroll real students, invite a professor or present the academic course as completed based solely on this checkpoint.
