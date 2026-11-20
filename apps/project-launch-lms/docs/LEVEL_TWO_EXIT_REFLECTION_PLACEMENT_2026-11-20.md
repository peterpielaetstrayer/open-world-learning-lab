# Module 2 closing reflection — staged placement contract

**Date:** November 20, 2026  
**Status:** Source behavior checked; **not placed in live course**. Supabase connector returned `You do not have permission to perform this action` during read-only preflight. Do not bypass that access restriction or interpret this document as authorization to write.

## Purpose and assessment boundary

The Level 2 self-report/transfer closure must be a distinct **ungraded** activity after the learner's Launch Portfolio, rather than being embedded in or overwriting the First Move Studio response. It gathers self-reported confidence, disposition toward revision, realistic next-step intention and a new-context explanation. Those are different constructs from the Level 2 scenario quiz; none proves actual behavior or skill gain. It is deliberately optional to share with a facilitator until the learner chooses to save or submit it.

The `LevelTwoExitCheck` component is already in `app/studio/level-two-exit-check.tsx`, and the `LessonText` renderer recognizes the exact standalone shortcode `[[level-two-exit-check]]`. The component asks for four completed responses, allows review, and explicitly requires a further learner action to save or share through the regular LMS activity pathway. No automatic database saving occurs when the component is opened or reviewed.

## Proposed independent course activity (not published)

| Field | Intended value |
| --- | --- |
| Course | `project-launch-lab` |
| Module | `module_number = 2`, **Plan & Launch** |
| Slug | `your-next-move-reflection` |
| Title | `Your Next Move — Confidence, Evidence & Commitment` |
| Instructions | `[[level-two-exit-check]]` as an exact standalone line |
| Rubric criteria | **None**, so no score is assigned |
| Initial publication | `is_published = false` pending review |
| Sequencing | After graded `launch-portfolio`, even though reflection is ungraded |

The studio's `sortCourseActivities` helper keeps normal practice-before-graded-assignment order but places this special closing slug last within its module. This affects the module outline, previous/next navigation and dashboard ordering. It does not change Module 1 order or the grading hold on the existing Launch Portfolio.

## Future controlled placement procedure

1. **Restore legitimate project access** and run fresh read-only checks: exact course and module IDs, existing activity slugs and publication flags, any already-created closure activity, membership and submission counts, current RLS policy status. Confirm the feature branch shown to reviewers actually contains both `LevelTwoExitCheck` and the sorting helper.
2. Agree on final learner-facing title and explicit privacy notice: account-associated ungraded reflection; sharing with facilitator is final; saving draft is revisable. Confirm permitted academic presentation route with Dr. Evans or retain Canvas Lite as faculty-facing delivery.
3. Only after an authorized production-content change, insert **one** new activity against the verified Module 2 ID using the fields above, initially unpublished. Resolve an existing same-slug row by inspection and diff, never an uncontrolled overwrite. **Do not create rubric criteria, change the Launch Portfolio rubric, or alter existing drafts/submissions.**
4. Use an instructor account to preview the unpublished activity. Verify all four prompts, form labels, radio selection, safety/permission wording, confirmation handoff and separate Save draft/Share controls. Check it appears last in Module 2. Then run real consenting-adult learner A/B and facilitator-role tests, including reload persistence and denied cross-learner reads.
5. Only with evidence of role/privacy correctness, working reviewer access, and academic delivery approval should the activity become published. Retain a rollback path of setting this new activity back to unpublished, with no deletion of learner responses.

## Evidence required to declare closure ready

- `node --test app/studio/activity-order.test.cjs app/studio/level-two-exit-check.test.cjs` passes (synthetic sorting and component tests, **not** real persistence).
- `npm run lint`, `npm run typecheck`, `npm run build` pass for the exact candidate source.
- Instructor preview and two isolated learner identities pass against an authorized environment; the facilitator sees a shared reflection but not an unshared draft.
- The academic 60-point rubric versus live 30-point discrepancy remains separately gated. Do not imply the closing reflection fixes this or establishes approved alignment.

## Contingency for November 23 and November 30

Do not make submission of LA 5.1, Journal 5.1 or the full course dependent on a custom-LMS database release. Where the requested assignment can be submitted with Canvas Lite or another already accessible course view, preserve that deliverable first. A protected code preview is supplemental evidence, **not** a working instructor-accessible or learner-tested LMS.
