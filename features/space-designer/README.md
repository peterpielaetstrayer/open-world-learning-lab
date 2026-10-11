# OWLL Space Designer v0.1

Status: **research prototype**, not a production AI application, design service, or quote generator.

Branch: feature/space-designer-v0

## Routes

- /learning-environments — exploratory, noindex concept page. Does not advertise an active commercial service.
- /lab/space-designer — noindex interactive prototype using rule-based design templates.

## What works

1. Learner assessment (audience, project name, interests, obstacles).
2. Room assessment (user-entered width and length, existing equipment, lighting, constraints).
3. Optional local-only room photo preview (image object URL; max 10 MB; no upload).
4. Intent, technology, and budget preferences.
5. Three alternative learning environment concepts with zone diagrams, features, and tradeoffs.
6. A concept-specific, sample budget allocation and a downloadable Markdown blueprint.
7. Browser Print / Save as PDF from the final step.
8. Responsive layout using existing Living Field Atlas design tokens.

## Important boundaries

- No AI model calls, backend endpoints, database, authentication, or analytics.
- No room-photo storage or uploads. The photo is not analyzed or exported.
- No third-party images, product catalog, prices, or verified installer estimates.
- Zone diagrams are illustrative, *not to scale*. Room dimensions are user-provided and unverified.
- Budget allocations are examples inside a budget band, *not quotations*.
- No user input is persisted. Reloading the page clears the exploration.
- Pages are marked \`noindex\` and aren't added to the main navigation.
- No payment or ordering capability, and no claims of improved learning outcomes.

## Development and verification

From repository root:

\`\`\`bash
npm ci
npm run lint
npx tsc --noEmit
npm run build
npm run dev
\`\`\`

Visit /lab/space-designer and manually test:

- Select each audience, each learning goal, technology mode, and budget band.
- Verify alternate concepts and budget allocations respond to input.
- Add decimal room dimensions, then clear them; area should appear only for valid positive measurements.
- Select an image, replace it, and remove it. Verify no network photo upload occurs.
- Test a nonimage file and an image >10 MB; verify an error message.
- Move backward and forward through stages and switch design concepts.
- Download the .md blueprint, verify values and caution notes, and print/save as PDF.
- Review narrow mobile view, reduced motion, keyboard controls, and print preview.
- Verify no product pricing, spatial accuracy, or AI claims are made.

## Proposed next increments

1. Usability testing with Peter OS Learning Headquarters / Pilot 001.
2. Accurate geometry capture and data schema after validating the questions.
3. Real AI support behind a secured backend, with clear provenance and controlled cost.
4. Confirmed catalog/pricing and privacy/storage policies before accepting client inputs.
5. Human review workflow for quotes, product fit, electrical/mounting constraints, and installations.

Keep this module independent from the site's static editorial pages so it can migrate to a separate deployment if pilot evidence supports it.
