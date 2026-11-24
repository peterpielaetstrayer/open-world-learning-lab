# Project Launch Lab — Module 1 Lesson 1 · Ten-Screen Custom Interaction

**Status:** S01–S10 **CODED / AUTOMATED SYNTHETIC-DOM INTERACTION TESTS PASSED / BUILD PASSED**. Not published as a course activity. Real browser accessibility, authenticated response persistence, cross-account isolation and learner effectiveness remain **UNVERIFIED**.

**Date:** 2026-11-18 · **Branch:** `feat/project-launch-lms-foundation-2026-11-03` (draft PR #15)

## Source hierarchy and safeguards

1. PeterOS private `20_Projects/LDT560_M1_Lesson_01_Learner_Copy_v0.2.md` — student-facing manuscript.
2. PeterOS private `20_Projects/LDT560_M1_Lesson_01_Interaction_Storyboard_v0.1.md` — designer interaction/feedback specification.
3. Previous technical checkpoint: `MODULE1_LESSON1_INTERACTION_SLICE_2026-11-18.md` (S01–S04 only).
4. This file documents actual source behavior and tests; none of these records overrides the original six CLOs, submitted academic work or pending faculty review of proposed MLOs.

## Learner flow in source

| Step | Interaction | Formative purpose | Actual storage / assessment |
| --- | --- | --- | --- |
| S01 Notice | Two interest and curiosity prompts, optional fallback examples | Reduce blank-page barrier | Local React state, ungraded |
| S02 Explore | Relevance, feasibility, scope cards with examples and cautions | Explicit concept teaching | No response recorded |
| S03 Consider | Provisional direction and four-prompt Project Direction Check | Guided application; fourth prompt is reflective extension, not fourth lens | Local state, self-marked “considered,” no grade |
| S04 Decide | Tessa chooses A/B/C, optionally explains, then reveals branch-specific reasoning and four-lens annotation | Worked contrast and post-choice feedback | Local state, no score; success is not presumed |
| S05 Practice A | Drawing-guide purpose, feasibility and scope responses; post-response model | Near-transfer with three prompts | Local state and model, no keyword scoring |
| S06 Practice B | School recycling situation: constraints, permissions and narrower investigation; post-response model | Intermediate transfer, safety/permission reasoning | Local state, no property-change instruction |
| S07 Practice C | Snack comparison with one combined three-lens response and post-response model | Farther transfer with less scaffolding | Local state, no cooking/purchase or sensitive disclosures |
| S08 Check | Three ungraded multiple-choice items with all nine specific feedback branches, retry and concept return | Concept discrimination, corrective feedback | Local state; never affects rubric score |
| S09 My draft | Direction, meaning, practical first action, focus and learning hope; editable copy and downloadable `.txt` | Learner-owned provisional artifact and manual continuity fallback | Local only; download action requires user browser check |
| S10 Next moves | Explicit transition to Gauntlet, facilitator comparison and separately graded 30-point Direction Brief | Transfer and accurate expectation setting | No completion grade or automatic activity transition |

All ten sections are reachable via section navigation or previous/next controls. In-page navigation retains entries and revealed feedback; a reload does **not** retain them. The component explains this before writing and offers a text fallback in S09. The check is available within S05–S09 using an expandable section. There is no generative-AI grader or automated open-response judgment.

## Implementation files

- `apps/project-launch-lms/app/studio/project-direction-lesson.tsx` — all ten screens, local state, feedback rules, draft export.
- `apps/project-launch-lms/app/globals.css` — themed responsive layout, focus-visible fallback inherited from app.
- `apps/project-launch-lms/app/studio/lesson-text.tsx` — embed marker `[[project-direction-lesson]]`.
- `apps/project-launch-lms/app/studio/lesson-editor.tsx` — facilitator guidance on the marker.
- `apps/project-launch-lms/app/lesson-preview/page.tsx` — synthetic preview only while `NODE_ENV=development`; production route returns 404.
- `apps/project-launch-lms/app/studio/project-direction-lesson.test.cjs` — interaction tests with Testing Library and jsdom; `npm run test:lesson`.

## November 18 verification

- `npm run test:lesson`: **5 passed, 0 failed**. Exercised local retention across sections, three Tessa feedback paths, all three practice reveal/revision states, all nine S08 branches and retries, and the S09/S10 copy/bridge claims.
- `npm run lint`: **passed**.
- `npm run typecheck`: **passed**.
- `npm run build`: **passed** on Next.js **16.4.5**.
- Previous build checkpoint independently observed dev-only `/lesson-preview` returns HTTP 200 and production returns HTTP 404; the route restriction did not change in this continuation.
- No real browser screenshot, visual reflow/contrast, keyboard-only navigation, screen-reader announcement, downloadable file result or cross-account Auth/RLS test was obtained in this continuation. Chromium automated browser launch previously failed due to an environment socket-permission restriction.

## QA gaps and next release gates

1. Inspect the ten-screen flow in a permitted browser on desktop/mobile, using keyboard only and a screen reader sample. Check focus after step changes, ARIA announcements, readable contrasts, 200% zoom/reflow, all radio/checkbox/text inputs, button disabled states, horizontal section navigation and actual `.txt` download.
2. Conduct Peter’s instructional QA against the v0.2 script and storyboard, including appropriateness of Tessa/art, recycling, food examples for high-school learners; verify duration and cognitive load with representative learners when approved.
3. Connect a *private authenticated* learner-owned draft/response only after role-based save/reopen, cross-learner negative access, facilitator feedback and error pathways are tested using synthetic accounts. The UI must not falsely imply that the current local draft persists.
4. Complete the Gauntlet bridge, ungraded comparison with substantive facilitator feedback, and rubric-verified 30-point Direction Brief separately from this lesson.
5. Resolve academic CLO/proposed-MLO crosswalk, faculty delivery platform acceptance, actual Canvas deadlines/receipts and remaining Module 2 requirements.

**No-go:** no public merge, student enrollment, grade claim, real minor data, or final Canvas submission based solely on these automated tests. The draft branch remains the engineering owner; PeterOS handoff/matrix are canonical for cross-chat continuity.
