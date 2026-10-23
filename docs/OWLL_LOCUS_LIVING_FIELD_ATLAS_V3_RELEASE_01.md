# Living Field Atlas v3 | Release 01

**Draft design implementation · October 23, 2026**  
**Owner:** OWLL founder review pending  
**Scope:** public site experience and evidence presentation only

## Purpose

Turn the OWLL website from predominantly explanatory editorial content into a public learning experience, while maintaining the project’s actual prototype maturity and the existing design identity.

This release is intentionally separate from the Open World Tahoe v2.1 draft PR #6. Do not merge or cherry-pick Tahoe code into this branch without a separate review.

## Product and research relationship

- **OWLL:** the independent learning research, educational design, and public experimentation initiative. No school enrollment, accredited school, or validated intervention is claimed.
- **Learning journeys:** educational experiences and studies. They can exist without LOCUS.
- **LOCUS learner app:** a bounded, mobile-first adult field-test vertical slice. It does not equal a finished learning platform.
- **Journey Studio:** separate creator/facilitator prototypes; cross-app manifest delivery remains under acceptance review.
- **LOCUS Core:** an alternative reference prototype, not the production backend of the current learner app.
- **Learning Environments:** research concept, not an operating installation service.

## What Release 01 changes

| Area | Change | Visitor value | Truth safeguard |
|---|---|---|---|
| Homepage | Interactive World Questions Atlas with three everyday contexts | Experience how observation becomes inquiry | Explicit conceptual-example notice |
| /start | Optional five-stage private field notebook with text export | Actually do a complete introductory inquiry | In-tab-only; no server, auto-save, account, or outcome claim |
| /work | Prominent start-learning entry | Find a useful activity without product knowledge | Does not imply program enrollment |
| /work/locus | Working/developing/unproven status distinctions and adult prototype link | Understand and inspect the real prototype | Browser-local data, youth/outcome limitations |
| /work/first-landing | Three-stage explanation of origin design / Studio / learner app | Understand why related artifacts have different scopes | Clearly separates design, implementation, evaluation |
| Projects summary | Narrower, verifiable LOCUS description | Prevent stale project-index claims | Matches current merged learner implementation |

## Visual language / reusable grammar

**Existing identity preserved:** Newsreader / Inter / IBM Plex Mono, field-paper and forest palette, annotated field research, meaningful typography hierarchy, quiet editorial spacing.

**New pattern:** *Inquiry Plate* = contextual scene -> noticed phenomenon -> meaningful question -> possible test -> possible artifact -> link to a free real activity.

Every future atlas or page-specific visual must:
1. Reveal a meaningful piece of knowledge or invite an investigative action.
2. Remain usable without animation, hover, pointer precision or a visual illustration.
3. Distinguish conceptual diagrams from geographically or scientifically precise data.
4. Label imagined activity as illustrative, not a documented learner outcome.
5. Avoid requesting personal data unless protections and purpose are explicitly reviewed.

## Claims and provenance register

| Claim | Evidence/source | Stage | Do not imply |
|---|---|---|---|
| Account-free inquiry at /start | OWLL /start page | Public learning activity | Validated program effectiveness |
| Field-note download | FieldInquiryNotebook.tsx | This draft implementation | Cloud persistence or private account |
| LOCUS v0.1.1: capture, evidence, articulation, reflection, return, JSON export | LOCUS learner repo README on main | Founder adult field test | Full learner Atlas, live AI, longitudinal outcome evidence |
| First Landing six-week arc | OWLL /work/first-landing | Origin / curriculum design | Delivered cohort or participant results |
| Water Writes the Landscape eight-stop journey | Journey Studio repo and OWLL project description | Technical / creator prototype | Authorized or evaluated field pilot |
| Creator-to-learner portable handoff | Open draft PRs in LOCUS learner and Journey Studio | Under test | Seamless production integration |
| Tahoe cinematic zones | OWLL draft PR #6 | Design preview | Live production feature |

Source repositories:
- https://github.com/peterpielaetstrayer/open-world-learning-lab
- https://github.com/peterpielaetstrayer/locus
- https://github.com/peterpielaetstrayer/locus-journey-studio
- https://github.com/peterpielaetstrayer/locus-core

## Acceptance tests before merge

**Automated:** repository lint; TypeScript no-emit; Next.js build. Exact commit must match preview.

**Interactive atlas:** each button selects one scene, content changes meaningfully, pressed state is explicit, keyboard and focus are visible, live region changes are announced sensibly, no arrow-key-only requirement. Scientific scenes are thought prompts, not experiments with measured results.

**Notebook:** blank export is disabled; partial notes export reliably as plain text; multiline notes survive text export; clear erases inputs; reload does not restore data; no input data transmitted; fields and buttons function with a keyboard and screen reader.

**Responsive:** 320, 375/390, 768, 1280/1440px, 200% zoom, no clipping or horizontal overflow. Confirm the dark atlas is legible at all relevant sizes and reduced-motion setting.

**External proof:** verify the current LOCUS field-test link is accessible before releasing this PR. If it is unavailable, retain a source-only route to the documented implementation rather than presenting a broken demo CTA.

**Content:** cold visitor can identify OWLL's mission, perform a genuine low-cost activity, differentiate First Landing's three development stages and understand what LOCUS does today.

**Release control:** do not merge this draft until visual QA and founder editorial review. Passing CI alone does not equal browser QA.

## Next implementation sequence

1. Complete and review mobile/desktop visual gallery for this PR; repair issues.
2. Create a genuine First Landing example showing observation -> alternative explanation -> evidence -> delayed return; label fictional sample inputs when relevant.
3. Develop a LOCUS screenshot/proof treatment sourced from the *actual* field-test interface, not an imagined application.
4. Reconcile the Tahoe branch's atlas controls with this shared interaction grammar, but do not force its cinematic style onto every page.
5. Update Learning Environments imagery, then research/release taxonomy and public evidence records.
6. Run comprehension and accessibility tests; only then consider production promotion.

## Explicitly deferred

Navigation restructuring; new unsupported programs/services; analytics trackers; personal data collection; full LOCUS integration; youth enrollment; manufacturing room installations; any evidence claims about improved learning outcomes; production release.

**Decision gate:** review the next Vercel preview against this ledger and the original 2026-10-11 OWLL brand architecture before accepting the design.