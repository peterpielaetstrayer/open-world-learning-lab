# OWLL Connected Visitor Inquiry Path / Release Candidate

**Date:** October 23, 2026
**Base:** First Landing Water Fingerprints feature PR #9, itself stacked on Living Field Atlas v3 PR #7.
**Scope:** public navigation and learning journey; no LOCUS learner-product changes.

## Visitor pathway

- Homepage interactive atlas now uses **context-aware next actions**: selecting shoreline goes to the new illustrated First Landing exercise; selecting kitchen or shadow goes to the ten-minute real-world activity. No data/selection is sent between pages.
- A new **Three distinct experiences** editorial path gives visitors choices: their own inquiry, the illustrated coastal encounter, or the separate adult LOCUS field-test case study.
- The Current Work page has two true free inquiry entry points rather than only the generic notebook.
- The general field guide invites optional exploration of the coastal illustrative exercise and LOCUS case study.
- The completed coastal activity provides links to a LOCUS explanation and to the separate, functioning adult field-test application, with a **prominent explicit non-transfer disclosure**.
- Cross-navigation does not imply that the OWLL browser exercise, the separate LOCUS adult application, or Journey Studio use a common backend or data model. No retention claims or learner outcomes beyond what code demonstrably does.

## Product boundaries

- The illustration is a conceptual scenario, not measured evidence at First Landing.
- The OWLL coastal exercise keeps state only in the open tab; text download is optional and user-initiated.
- LOCUS v0.1.1 operates in a separate application, storing local learner evidence. Starting LOCUS opens a fresh session, not an import of OWLL notes.
- There is no single sign-on, cloud sync, shared learner record, production youth infrastructure, or established educational effectiveness.
- The paths are **choices**, not a multi-step course or mandatory progression.
- LOCUS product-proof case-study refinement in sibling PR #11 is compatible but separate. Avoid merging unrelated branches solely to combine previews.

## QA gates

- [ ] TypeScript, lint and Next.js production build on final SHA
- [ ] Responsive screenshots and axe (390px, 768px, 1440px)
- [ ] Browser test changes atlas selection and CTA, reaches illustrated First Landing, verifies visible non-transfer disclosure, navigates to LOCUS project and validates external destination
- [ ] Live Vercel preview READY at exact SHA
- [ ] Founder review, keyboard/screen reader, 320px and 200% zoom before production release

## Next product evidence

Complete the genuine adult LOCUS field-test and delayed retrieval task under https://github.com/peterpielaetstrayer/locus/issues/13. Do not increase product maturity labels because website navigation looks polished.
