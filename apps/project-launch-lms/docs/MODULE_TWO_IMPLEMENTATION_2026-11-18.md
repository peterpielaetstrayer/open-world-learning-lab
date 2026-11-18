# Module 2 — First Move Plan, authentic evidence, and feedback reflection

**November 18, 2026 · source implementation in protected LMS draft PR #15 · not published into live course**

## Instructional outcome

The Module 2 preview now makes the core *Plan & Launch* reasoning visible: a learner frames a feasible and safe first test, anticipates resources and constraints, considers authentic feedback, reports either an attempted action **or** an actual obstacle without fabricating success, and justifies a next step. This is a derivative implementation of the November 15 learner-experience storyboard; it does not change the instructor-approved learning design blueprint.

## Reviewable nine-step synthetic walkthrough

Protected `/module-two-preview` (local development or authenticated Vercel Preview, never Production):

1. **Welcome:** bridge from Module 1's optional Gauntlet, comparison and Direction Brief; safe first moves and learner agency.
2. **Learn:** a short five-concept mini-lesson on purpose, milestones, constraints, safe action, prediction versus evidence, and feedback.
3. **Observe:** an annotated Maya **school garden** worked example, matching the original LDT 560 Learning Activity 4.1. Students reflect before revealing why a sketch and permission check may be a better start than a full redesign. The model makes no false claim that Maya obtained permission or gathered evidence.
4. **Practice:** three ungraded checks on the garden constraint, safe bounded action, and prediction-versus-evidence distinction. All **nine answer choices** give targeted explanation and allow retry.
5. **Apply in First Move Studio:** the existing three-decision **rhythm-guide** scenario, with explanatory feedback and audio text alternative. It is now a distinct transfer application after the garden model, though its character is also named Maya pending editorial review.
6. **First Move Card:** ten prompts cover direction, purpose, safe action, learning question, **three ordered milestones and checkpoint**, resource/permission alternative, constraint/substitute, non-sensitive evidence, useful negative outcome, and facilitator question. Output is ungraded.
7. **Feedback:** four-part critique prompts; peer participation and agreement with a suggestion are optional. Post-final revision still needs an explicit activity/versioning design.
8. **Action or obstacle:** distinguish a true bounded attempt from a genuine barrier, evidence from assumption, and received from pending feedback. Both routes are legitimate.
9. **Portfolio & transfer:** proposed four-criterion 60-point assessment, explicit warning about the **unresolved 60-versus-30-point database rubric**, separate existing quiz/evaluation, and exit confidence as self-report, not competence evidence.

The walkthrough passes the evolving First Move Card's project direction into the evidence page within **this open preview session**; the forms remain mounted while tabs change. No Supabase read/write or authentication occurs on the preview route, and refreshing/leaving can discard text.

## Authenticated source markers and submission boundary

`LessonText` now recognizes:

- `[[first-move-card]]` → `FirstMoveCard`
- `[[first-move-evidence]]` → `FirstMoveEvidence`
- Existing `[[first-move-studio]]` continues to render Maya's scenario.
- `[[first-step-mini-lesson]]` → `FirstStepMiniLesson`
- `[[maya-garden-model]]` → `MayaGardenModel`
- `[[first-step-checks]]` → `FirstStepChecks`

These three new markers are **source-only, ungraded prerequisite instruction**. They do not satisfy LA 4.1 on their own. That activity requires a separate fresh Studio scenario, learner-produced card, facilitator feedback and a reasoned revision or retention. No published lesson or progress-tracking record was changed.

The new interactive forms can **prepare** a structured response in the authenticated course activity's ordinary ungraded response box. The backend only changes when the learner separately chooses **Save draft** or **Share with facilitator (final)**. Existing response text requires explicit overwrite confirmation. Form input limits keep the generated response within the existing 20,000-character transfer boundary, and the studio refuses larger transfers without truncation.

Learners can prepare an **incomplete working copy** from either long form, then deliberately save a course draft. It is labeled incomplete and does not claim a finished task. Important limitation: the graphical fields do not currently rehydrate from a saved text draft; the learner may continue editing the saved response itself, or use a private copy when resuming the form. Do not claim a complete cross-device interactive form-resume workflow for these two new components.

The source has **not** inserted these markers into any live Supabase activity. Published Module 2 `first-move-studio` exists, but the First Move Card and subsequent action/obstacle journal have not been issued as distinct course activities. In particular, reusing the same activity for a final First Move Card and a later revised evidence response would conflict with the current **immutable final submission** contract. Choose a separate follow-up activity/versioning rule with academic review before publication.

## Scenario and assessment mismatches retained, not silently repaired

- The original November 16 LDT 560 Learning Activity 4.1 explicitly uses Maya's **school garden** as the modeled example, followed by a **fresh** scenario for First Move Studio. The preview now follows that sequence and preserves the rhythm-guide widget for transfer. Because the widget also calls the music character Maya, the editorial name needs review before faculty-facing release.
- The academic storyboard describes the graded Launch Portfolio using **four criteria × 15 points = 60**. The currently published database rubric is **three × 10 = 30**. This preview displays the conflict prominently, does not apply or simulate scores, and changes no existing rubric or learner record.
- The ten-item quiz and Level 1 course evaluation are separate implemented components, not re-created or declared validated by this preview.
- Learner outcome wording, current Canvas submission receipts, instructor permission to use this custom LMS, media captions/transcripts and accessibility acceptance remain open gates.

## Verification checkpoint

- `npm run test:formative`: **24/24** synthetic React/DOM tests, including the plan/evidence branches, lesson-to-form markers, the garden example's honesty boundary, all **nine** corrective-choice explanations, revised sequencing, rhythm-guide back-navigation and in-page continuity.
- `npm run test:lesson`: **5/5** standalone Module 1 lesson checks.
- Local ESLint, TypeScript and Next production build passed; the build includes `/module-two-preview`.
- Runtime dependency audit: **0 high/critical vulnerabilities**.
- These tests use a stubbed Supabase client. Real three-identity Auth/RLS, account save/feedback, keyboard/screen-reader/mobile and faculty reviewer-session tests **have not** occurred. A route HTTP 200 from Vercel must not be represented as browser acceptance.

## Release boundary and next actions

Keep PR #15 draft/unmerged, public OWLL website untouched, and course records unchanged. Next: reconcile the academic MLO-to-rubric mapping and 60/30 rubric; choose the rhythm-guide transfer character, map the First Move Card and evidence journal into separate activities, and design post-feedback immutable-final revision semantics. Then run real synthetic A/B/facilitator Auth/RLS acceptance with a trusted server-only test environment and inspect every screen in a browser for mobile, keyboard, audio and reviewer access. Do not enroll real minors or claim the course complete.
