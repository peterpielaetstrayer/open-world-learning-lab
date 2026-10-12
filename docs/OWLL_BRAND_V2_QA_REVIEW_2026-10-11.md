---
title: OWLL Brand v2 — Editorial and QA Review
date: 2026-10-11
status: source-verified / rendered-review-outstanding
related_pull_request: https://github.com/peterpielaetstrayer/open-world-learning-lab/pull/2
---

# OWLL Website Brand v2: Review & Release Gate

## Scope, method, and honest limits
**Source verified:** reviewed existing production homepage and several public routes using available web text, compared the draft PR's exact GitHub source against `main`, inspected deployment metadata and GitHub CI, inspected visual design tokens and source-level layout/accessibility patterns. 
**Not verified:** Browser-rendered screenshots or viewport-by-viewport layout of the actual Vercel preview; the preview URL was inaccessible to the available browser-fetching route, and local container network resolution was unavailable. A READY Vercel deployment and passing CI do **not** establish visual, assistive technology, real-device, or user comprehension quality.

## Source-based design observations
1. The existing Living Field Atlas identity is distinctive and should survive this cycle: paper, ink, deep field, water, moss; Newsreader/Inter/Plex; field journal and cartographic motifs.
2. The original site foregrounded place-based student learning and technology more than lifelong educational sovereignty and family/adult agency. Draft copy now states the broader purpose, preserves honest early-stage maturity and explains that parents are learners, too.
3. Homepage audience inclusion initially appeared *after* a long learning-loop diagram and research/process section. In the review branch it now appears directly after the human-purpose statement, **before** deeper method explanation. This reduces the path to audience recognition; its rendered effectiveness remains untested.
4. Current main CTAs point to approach and existing projects, not unpublished downloads, registrations or commercial services. The downloadable Educational Sovereignty resources remain outside public website until editorial/source/accessibility review.
5. First Landing describes the original six-week learning concept and clarifies the newer eight-stop `Water Writes the Landscape` Journey Studio prototype. No implemented route is described as an authorized field study or validated learner outcome.
6. The July 2026 public `OWLL at a Glance` brief is retained as a **dated historical snapshot**, clearly marked rather than silently rewritten as the revised brand.
7. Learning Environments remains an early research concept, not an installation offer; language concerning a personal learning-space case study was softened from a scheduled-sounding pilot to a *proposed* starting point.

## Contrast checks (computed from source tokens, not screenshots)
- Field paper `#F2EFE6` and original metadata `#6B756F`: approximately 4.15:1, below WCAG normal-text 4.5:1 target. Draft token `#59655E`: approximately 5.30:1 on field paper, 4.67:1 on soft paper `#E7E1D4`.
- Footer: `#F2EFE6` with alpha .50 over `#102620` yields approximately 4.47:1, borderline below target. Draft alpha .65 yields approximately 6.63:1.
- These are limited solid-color token calculations; not a complete audit. Text over graphics, other translucency, focus, hover, non-text UI indicators, image labels, and actual CSS stacking remain to be inspected.

## Review-only refinements in this PR
- Broader homepage hero, purpose, adult/family/community audience inclusion, equity principle, About page, footer and metadata.
- More public-readable navigation labels (`Approach`, `Principles`) while retaining existing routes.
- Homepage reading order revised: **human promise → purpose → whom this includes → learning mechanism → lab activities → actual projects**.
- Context and transparency around the historical July 2026 brief and First Landing prototype evolution.
- Small metadata/footer contrast improvements without abandoning palette.

## Release/readiness matrix
| Gate | Current evidence | Status |
| --- | --- | --- |
| GitHub lint/type/build | Required website checks pass on draft head once run completes | Verify latest commit |
| Vercel preview deploy | Deployment metadata shows READY for preview commits | Verify latest commit |
| Main branch/production protected | PR remains draft/unmerged and preview target is non-production | Must recheck before approval |
| Source and claims check | In-scope edits checked against existing OWLL project state | Pass provisionally |
| Visual mobile/desktop | No browser screenshot inspection on actual preview | **Open** |
| Keyboard / screen reader / zoom | No device or assistive technology test | **Open** |
| All routes and anchor flows | Static source cross-check only; rendered click-through missing | **Open** |
| Contrast across whole site | Two source tokens checked and improved; no full scan | **Open** |
| Dependency advisories | An earlier workflow install reported 15 npm audit advisories; severity/affected packages not triaged here | **Open, separate security task** |
| Visitor comprehension | No external adult/parent/educator cold read | **Open** |
| Founder editorial approval | No final acceptance recorded | **Open** |

### Minimal manual review protocol
Open the Vercel draft preview and compare to production:
1. Desktop (1280px+): opening screen, grid rhythm, headlines, reading line lengths, image crop, cards, visual brand distinctiveness, no premature service claims.
2. Mobile (320/375/390px) and tablet (768px): check first-screen text wraps, no horizontal page overflow, hero image, nav drawer, 4 audience cards, loop diagram affordance, CTA touch targets, footer legal text. Inspect at 200% text zoom.
3. Keyboard only: Tab order, focus appearance, opening/closing mobile navigation with Escape, reachable anchors, any visual-expansion dialogs and focus return.
4. Screen reader: heading outline, image alternative text, redundant mobile/desktop image announcements, labels, real navigation, helpful project status.
5. Contrast, reduced motion, load performance, no console errors or broken internal links. Capture screenshots, classify each finding as blocking/nonblocking.
6. Cold-reader exercise: show the homepage for ~15 seconds; ask “What is OWLL?”, “Who is it for?”, “What can I actually use today?”, “What is experimental?”, “How could I engage?”, “Why trust it?” Do not prompt respondents toward desired answers. Note misunderstandings.

### Suggested approval criteria
- No blocking accessibility or functional regressions.
- People understand OWLL includes adult/family education and that LOCUS is a prototype.
- No implied active learning kits, enrollment, installation sales, validated efficacy, or institutional sponsorship.
- The visual character remains Living Field Atlas, not generic SaaS, faux academia or premium-only branding.
- Public status and research claims are source-checked.
- Founder approves final copy, imagery and scope. Merge/promotion is a **separate** decision.

**Decision:** **HOLD DRAFT** until rendered/functional/accessibility review and founder editorial signoff. Automated build readiness is not release approval.
