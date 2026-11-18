# Project Launch Lab · Module 1 Lesson 1 · Interaction Slice S01–S04

**Status:** implemented and build-checked on the **draft** `feat/project-launch-lms-foundation-2026-11-03` branch. This is a synthetic, local-state instructional prototype, **not** a published, authenticated learner course. Do not infer actual student effectiveness from design review.

**Date:** 2026-11-18

**Historical checkpoint:** this record captures the first S01–S04 delivery before the S05–S10 continuation. For current whole-lesson code status and evidence, read `MODULE1_LESSON1_TEN_SCREEN_IMPLEMENTATION_2026-11-18.md` alongside this file. Do not interpret this four-screen snapshot as the present upper bound of the source.

## Source and authority

- PeterOS `20_Projects/LDT560_M1_Lesson_01_Learner_Copy_v0.2.md` is the text manuscript being transformed.
- PeterOS `20_Projects/LDT560_M1_Lesson_01_Interaction_Storyboard_v0.1.md` is the design/acceptance reference.
- These four screens constitute only the *first vertical slice*, not all of Lesson 1, Module 1, Module 2, or the LDT 560 capstone.
- Approved academic outcomes and original submitted materials remain untouched. Revised outcomes, if any, still require faculty review; this UI is not evidence of formal approval.

## Implementation map

| Screen | Learner action | Instructional role | Evidence available today |
| --- | --- | --- | --- |
| S01 · Notice | Write interests and wonderings or use optional prompts | Reduce starting friction, normalize incomplete ideas | Local editable response only; no saved submission |
| S02 · Explore | Read relevance, feasibility, and scope example cards | Establish lenses for project selection | Screen can be inspected; no mastery claim |
| S03 · Consider | Draft a direction; mark four questions *considered* | Guided self-check, including learning potential as reflection | Ungraded local state; boxes are not scored or gated |
| S04 · Decide | Choose a first move for Tessa, optionally explain, reveal option-specific feedback | Transfer and feedback using a constrained worked case | Local choice and explanation only; no LMS grade |

## Technical integration

- Component: `apps/project-launch-lms/app/studio/project-direction-lesson.tsx`
- Theme and responsive styles: `apps/project-launch-lms/app/globals.css`
- Text-lesson embed: a paragraph containing only `[[project-direction-lesson]]`, parsed in `app/studio/lesson-text.tsx`
- Facilitator instructions: `app/studio/lesson-editor.tsx` offers the marker. **No lesson is automatically inserted/published.**
- Development-only test route: `/lesson-preview`, 404 in non-development environments.

## Quality gates before learner release

1. Verify lint, TypeScript, build, rendering, keyboard navigation, responsive layouts, contrast, accessible feedback and focus, and all three Tessa branches. Record proof rather than inferring it from compilation.
2. Resolve any dependency security advisory before release.
3. Replace temporary local-only exercise state with appropriately authorized save/resume if the curriculum requires it; verify real Supabase invitations, actual accounts, RLS cross-learner isolation, assignment submissions and rubric feedback end-to-end.
4. Complete remaining lesson screens, Module 1/Module 2 alignment, accessibility evidence, live learner pilot (only with suitable permissions), and faculty rubric/submission checks.
5. Preserve draft GitHub PR status; **do not merge, deploy publicly, or enroll real learners without explicit authorization.**

## Verification record · 2026-11-18

- `npm run lint`: **passed**.
- `npm run typecheck`: **passed**.
- `npm run build`: **passed** on the patched Next.js `16.4.5` runtime. The earlier build on `16.4.4` compiled but was deliberately stopped by a Next.js security advisory; the dependency was updated to the vendor's patch version.
- Synthetic HTTP preview smoke: `/lesson-preview` returned **200** in development and contained the opening screen; the same route returned **404** and no lesson content under `next start` production mode.
- **Not verified:** actual browser interactions, keyboard navigation, focus changes, responsive visual appearance, screen-reader behavior, per-branch feedback rendering, account-level save/resume or Supabase RLS. Local Chromium automated browser launch failed because the execution environment denied the browser's socket operation. These remain real QA gates, not assumed successes.

## Instructional review questions

For each subsequent screen: Does it elicit the intended thinking or behavior? What evidence would demonstrate that? What unnecessary complexity, inaccessible interaction, misleading feedback, or accidental claim of completion should be removed? Would a conventional Rise lesson serve the objective equally well with less maintenance? Keep custom interaction only when it substantively improves the learner task.
