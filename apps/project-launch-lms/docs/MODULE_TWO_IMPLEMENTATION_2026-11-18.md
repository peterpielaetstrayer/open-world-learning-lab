# Module 2 — First Move Plan, authentic evidence, and feedback reflection

**November 18, 2026 · source implementation in protected LMS draft PR #15 · not published into live course**

## Instructional outcome

The Module 2 preview now makes the core *Plan & Launch* reasoning visible: a learner frames a feasible and safe first test, anticipates resources and constraints, considers authentic feedback, reports either an attempted action **or** an actual obstacle without fabricating success, and justifies a next step. This is a derivative implementation of the November 15 learner-experience storyboard; it does not change the instructor-approved learning design blueprint.

## Reviewable six-step synthetic walkthrough

Protected `/module-two-preview` (local development or authenticated Vercel Preview, never Production):

1. **Welcome:** purposeful first move, safe alternatives and learner agency.
2. **Learn from Maya:** reuse the original three-decision rhythm-guide/recording scenario with explanatory choices and written audio description. The learner's selections and revealed feedback now remain available when navigating back and forth. Do not claim this is yet an accessible-media acceptance result.
3. **First Move Card:** ten exact storyboard-based fields: direction, purpose, safe first action, learning question, checkpoint, resources/permissions/low-resource alternative, constraint/substitute, non-sensitive evidence, potentially useful negative outcome, and facilitator question. A partially worked Maya example is available as optional support. A filled card reveals a non-scored self-check and structured, copyable output.
4. **Feedback:** four-part critique prompts; neither peer participation nor agreement with facilitator advice is mandatory. Keep in mind that final course submissions are currently immutable; a post-final revision needs a follow-up activity/versioning design.
5. **Action or obstacle:** explicit learner-selected route. Attempt records actual action, observation, difference from prediction, limitations and non-sensitive evidence. Obstacle records what genuinely blocked the attempt, why the learner did not force it, what that revealed about conditions, a safe alternative, and what remains untested. Both routes have equal legitimacy. The record distinguishes real feedback from a pending question, and allows a reasoned revision or retention only when feedback is actually reported.
6. **Portfolio & transfer:** proposed rubric/storyboard evidence, explicit warning about the **unresolved 60-vs-30-point live rubric mismatch**, existing separate quiz/evaluation, and exit confidence as self-report rather than proof of ability.

The walkthrough passes the evolving First Move Card's project direction into the evidence page within **this open preview session**; the forms remain mounted while tabs change. No Supabase read/write or authentication occurs on the preview route, and refreshing/leaving can discard text.

## Authenticated source markers and submission boundary

`LessonText` now recognizes:

- `[[first-move-card]]` → `FirstMoveCard`
- `[[first-move-evidence]]` → `FirstMoveEvidence`
- Existing `[[first-move-studio]]` continues to render Maya's scenario.

The new interactive forms can **prepare** a structured response in the authenticated course activity's ordinary ungraded response box. The backend only changes when the learner separately chooses **Save draft** or **Share with facilitator (final)**. Existing response text requires explicit overwrite confirmation. Form input limits keep the generated response within the existing 20,000-character transfer boundary, and the studio refuses larger transfers without truncation.

Learners can prepare an **incomplete working copy** from either long form, then deliberately save a course draft. It is labeled incomplete and does not claim a finished task. Important limitation: the graphical fields do not currently rehydrate from a saved text draft; the learner may continue editing the saved response itself, or use a private copy when resuming the form. Do not claim a complete cross-device interactive form-resume workflow for these two new components.

The source has **not** inserted these markers into any live Supabase activity. Published Module 2 `first-move-studio` exists, but the First Move Card and subsequent action/obstacle journal have not been issued as distinct course activities. In particular, reusing the same activity for a final First Move Card and a later revised evidence response would conflict with the current **immutable final submission** contract. Choose a separate follow-up activity/versioning rule with academic review before publication.

## Scenario and assessment mismatches retained, not silently repaired

- The instructional draft's Maya worked example has historically alternated between a garden scenario and the actual coded rhythm-guide scenario. This preview uses the existing music interaction; confirm one authoritative worked example and explain the transfer role of any second scenario before faculty review.
- The academic storyboard describes the graded Launch Portfolio using **four criteria × 15 points = 60**. The currently published database rubric is **three × 10 = 30**. This preview displays the conflict prominently, does not apply or simulate scores, and changes no existing rubric or learner record.
- The ten-item quiz and Level 1 course evaluation are separate implemented components, not re-created or declared validated by this preview.
- Learner outcome wording, current Canvas submission receipts, instructor permission to use this custom LMS, media captions/transcripts and accessibility acceptance remain open gates.

## Verification checkpoint

- `npm run test:formative`: **19/19** synthetic React/DOM tests, including prepared-but-unsaved M2 plan, incomplete draft preservation, actual attempt/feedback-revision branch, real obstacle with pending feedback and no invented attempt, Maya back-navigation state, and in-page Module 2 continuity.
- `npm run test:lesson`: **5/5** standalone Module 1 lesson checks.
- Local ESLint, TypeScript and Next production build passed; the build includes `/module-two-preview`.
- Runtime dependency audit: **0 high/critical vulnerabilities**.
- These tests use a stubbed Supabase client. Real three-identity Auth/RLS, account save/feedback, keyboard/screen-reader/mobile and faculty reviewer-session tests **have not** occurred. A route HTTP 200 from Vercel must not be represented as browser acceptance.

## Release boundary and next actions

Keep PR #15 draft/unmerged, public OWLL website untouched, and course records unchanged. Next: verify how the proposed First Move Card and follow-up journal map to available M2 activities and academic rubric; choose immutable-final revision semantics; run actual synthetic A/B/facilitator Auth/RLS acceptance when a trusted server-only test environment is available; inspect all screens in a real browser, including mobile/keyboard/audio. Do not enroll real minors or claim the course complete.
