# First Landing: Water Fingerprints | Flagship interaction 01

**Date:** October 23, 2026  
**State:** proposed public demo; review before merging  
**Parent design:** Living Field Atlas v3 foundation PR #7  
**This work:** a stacked, isolated draft PR against `design/living-field-atlas-v3-foundation`

## What this prototype makes real

1. **Attend / notice.** Select a shoreline feature in a labeled *illustrative composite*; write or think about an observable clue before explaining it.
2. **Interpret.** Consider several possible causes, choose a tentative leading explanation, record an alternative, and register confidence.
3. **Check evidence.** Read a deliberately cautious evidence interpretation. Revise a judgment and identify what still cannot be inferred.
4. **Retrieve.** Before looking back at earlier notes, reconstruct a provisional explanation from memory. Reveal the record only by explicit action.
5. **Carry forward.** Download a plain-text inquiry record (not a cloud account, learner record, or LOCUS export).

## Relationship to real projects

- OWLL First Landing six-week plan: *design*, not a delivered program.
- Water Writes the Landscape eight-stop Journey Studio: *technical curriculum/authoring prototype*, not a validated field pilot.
- LOCUS v0.1.1 adult application: *separate working field-test implementation*. This website inquiry is **not connected** to LOCUS or Journey Studio.
- Outcome evidence: none implied. The scene is synthesized, not a real geographic location, measured photograph, official map, validated ecosystem model, or documentary record.

## Source grounding and environmental caution

Virginia DCR documents the real First Landing shoreline, maritime forests, dunes and wetlands:
- https://www.dcr.virginia.gov/state-parks/first-landing
- https://www.dcr.virginia.gov/state-parks/blog/5-ways-to-experience-first-landing-state-park

The three educational clue patterns (debris strands, sand ripples, and dune grasses) are **stylized hypothetical examples**. More than one mechanism can explain these patterns, including wind, water, vegetation, human activity and storms. No field observations, tide measurements, weather data, or measurements are provided. DCR neither produced nor endorsed this illustration.

## Data and inclusion

- No log-in, API calls, telemetry, browser storage, or personal data submission in this React component.
- Typed inputs exist only as client-side component state until page reload/navigation. Download is user-initiated.
- All three clue buttons have visible state and descriptive labels; the illustration has redundant textual clue descriptions.
- Four stages have accessible navigation. Choice of answer is not scored as correct; learner reasoning, alternatives, uncertainty and evidence remain central.
- The exercise can be completed indoors. Visitors do not need transport, park admission, special equipment, or physical access.
- No instructions to disturb dunes or sensitive coastal habitat.

## Release gates

Automated:
- [ ] ESLint, TypeScript and Next production build on exact final SHA.
- [ ] Render at 390, 768, 1440; check overflow, axe serious/critical, image failures, heading count.
- [ ] Browser interaction suite selects a new clue, captures a multiline observation, selects a claim, investigates, recalls without notes, reveals notes, downloads record, reloads and verifies absence of persistence.
- [ ] Vercel preview READY on matching SHA.

Human:
- [ ] Visual desktop/mobile review including illustration cropping and marker placement.
- [ ] Test at 320px and at 200% text zoom; check line lengths and navigation.
- [ ] Keyboard-only and screen-reader evaluation of clue selection, steps, stage transitions, evidence text, and note reveal.
- [ ] Science/editorial review of causal possibilities; check official external links.
- [ ] Visitor comprehension: identify *conceptual visual*, *observed clue*, *tentative explanation*, *what could test it*, and *what LOCUS does not do yet*.

### Known limitation

The immediate reconstruction step illustrates retrieval **mechanics**, not delayed recall after days or weeks. No durable learning assessment has been conducted. Any eventual pilot would need participant consent and safeguarding review.

## Next design extension

A reviewable design-system component for evidence plates (photo/source/observation, hypotheses, counterevidence, next test) can be extracted once First Landing and Tahoe both validate the pattern. Avoid code consolidation before there are two genuine implementations to compare.
