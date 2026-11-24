# Entry Diagnostic — instructional implementation checkpoint

**Date:** 2026-11-18  
**Status:** Authored and coded for private review. Not inserted into the published Supabase course, not account-tested, and not a Canvas submission.  
**Design source:** The five-question Orientation O2 sequence in `LEARNER_EXPERIENCE_STORYBOARD_2026-11-15.md`. Preserve the original faculty-approved Learning Design Blueprint and the downstream 30- and 60-point assessment requirements.

## Learner purpose and decision

This diagnostic is a *starting-point conversation*, not a placement test, score or claim of competency. It asks for two curiosities, a previous multi-step experience, a constrained comparison of broad and bounded directions, one tiny potential first action, and a 1–5 current confidence rating. The explanatory feedback names who/what a test serves, what may be tried safely, and resources or permissions; it explains that a genuine barrier is useful feasibility evidence and that confidence change is self-report.

No purchases, public posts, travel, contact with strangers, AI tool or sensitive personal disclosures are required. Alternative safe topics are permitted. The confidence scale is explicitly ungraded.

## Implementation behavior

1. The `[[entry-diagnostic]]` marker renders `EntryDiagnostic` from `LessonText`. All four reflection fields and the confidence choice must have entries before explanatory feedback appears; concise answers are acceptable.
2. In a published, authenticated *ungraded* course activity, the learner chooses **Use these answers in my course response**. That prepares a structured text response in the existing activity text box. It **does not** write anything to the database.
3. The learner explicitly chooses **Save draft** (private, editable) or **Share with facilitator (final)** (immutable, enrolled facilitator review) using the existing ungraded submission workflow. A confirmation protects a preexisting response from accidental replacement.
4. In protected `/diagnostic-preview`, no course identity is used. The learner may select/copy the text summary after receiving feedback, but no course record is created or sent to Supabase.
5. Input changes reset the visible feedback review state so the learner can reconsider responses rather than mistake stale feedback for an updated analysis.

The diagnostic produces a useful entry baseline and preliminary coaching question. It does not infer a correct answer, assign a score, calculate learning gains, or fabricate facilitator review. A facilitator sees only a final shared response through the current submission workflow, not unsaved local answers or private drafts.

## QA boundary and integration gate

- **Coded:** React component, `LessonText` marker, studio response preparation and guarded Vercel design-preview route. No database schema or published activity changes.
- **Synthetic test:** JSDOM/stub-Supabase flow renders all prompts, requires five answers, shows explanatory feedback, prepares the parent response, verifies no invisible write, and persists only after an explicit `Save draft` click. This is not a real Auth/RLS end-to-end test.
- **Pending:** Decide an exact course location for the ungraded diagnostic (e.g. orientation before Module 1), provide an intentional published course activity with the marker, validate student/facilitator access and feedback, confirm entry/exit confidence treatment and transcript/accessibility equivalents, test keyboard/phone/screen reader, and confirm faculty review of the lesson sequence.
- **No-go:** Do not insert this marker into existing graded Direction Brief or Launch Portfolio, automatically create course records on load, silently collect confidence data, or count completion as a demonstrated skill.

The protected `/diagnostic-preview` is intended for editorial/design feedback before the live authenticated activity is changed.
