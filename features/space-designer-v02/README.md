# OWLL Space Designer Studio v0.2

**Status:** private experimental prototype. Built on branch \`feature/space-designer-v02\`, preserving v0.1 at \`/lab/space-designer\`.

**New route:** \`/lab/space-designer/studio\`

## Implemented

- A spatial, responsive design workspace instead of a five-step questionnaire.
- An actual room photo can be selected, resized in the browser, and displayed without uploading.
- Learner goals, obstacles, room dimensions, light, things to keep, room constraints, preferences, and budget bands influence two guided learning-environment directions.
- Two concept cards with distinct purposes, zones, design rationales, and tradeoffs.
- A revision input modifies guided recommendations. When AI analysis is enabled, re-running it considers revisions.
- Rule-based concept diagram when no image is uploaded.
- Downloadable design brief in Markdown, print view, and explicit uncertainty notes.
- API status endpoint, optional multimodal analysis endpoint (image + text), and optional room photo edit endpoint.
- Vercel private-preview gating in server-side configuration. No payments, analytics, image storage, or user accounts.

## AI mode is OFF unless enabled explicitly

Set these **server-side** environment variables for the Preview environment only:

- \`OPENAI_API_KEY\`: use a scoped server credential (never commit or paste it into a chat).
- \`OWLL_AI_ANALYSIS_ENABLED=true\` to enable model-based room and learning analysis.
- \`OWLL_AI_RENDERING_ENABLED=true\` to enable photo-based image editing/generation, *after* confirming usage limits and provider budgets.
- Optional \`OWLL_TEXT_MODEL\` (default \`gpt-4.1-mini\`).
- Optional \`OWLL_IMAGE_MODEL\` (default \`gpt-image-1.5\`).

The UI queries \`/api/space-designer-v02/status\` to show which features are truly available. No mock output is passed off as real AI.

**Important:** The server-side checks allow the paid AI endpoints only when \`VERCEL_ENV=preview\` (or in local \`NODE_ENV=development\`). Merging the feature alone should not expose these endpoints in production. Deployments to the normal OWLL production domain remain out of scope.

## Privacy and cost guardrails

- Photos and answers stay in memory in the current browser tab unless an AI button is pressed.
- Each AI call requires a separate checked consent box; changing the photo resets consent.
- Photos are resized to fit within 1400px and encoded as compressed JPEG in the browser.
- No photo or session is persisted in the OWLL app.
- The AI provider receives photo/answers only for requested analysis/rendering; provider-side processing/retention is governed by its policies.
- The analysis endpoint requests non-stored Responses API output (\`store:false\`).
- Image rendering requires an actual photo, displays real provider output only, and explicitly labels results *illustrative*.
- API key stays on the server, requests are same-origin, inputs capped, paid routes are opt-in.
- Best-effort server-instance throttling is **not** a sufficient spending cap. Configure provider project limits and Vercel Authentication before enabling paid features.
- One browser session's UI caps image renders at three; serverless replicas can bypass in-memory limits. For any public release, implement durable per-user authorization and quota management.

## Manual validation

1. Run \`npm ci && npm run lint && npx tsc --noEmit && npm run build\`.
2. Test mobile and desktop, keyboard interaction, and reduced-motion settings.
3. Upload an actual JPG/PNG room image. Verify local-only preview before consent and before clicking any AI button.
4. Enter two room dimensions; verify area calculation and revised concepts.
5. Test both directions, revision input, and blueprint download/print. Verify there is no false AI claim.
6. Without env vars, verify AI buttons are disabled and no API charges occur.
7. Once preview-only API credentials have been configured, try a non-sensitive room photo, accept explicit consent, invoke analysis, verify the server returned two concepts and uncertainty lists.
8. With image rendering explicitly enabled and a budget cap, generate one photo edit, compare original and concept, and validate architecture preservation limitations.
9. Check preview authentication, logs and costs; never treat generated image proportions as measurements.
10. Confirm no changes on \`main\` and no production-domain deployment.

## Next gates

- Human review for spatial accuracy and a dimensionally correct plan.
- User research on the quality of AI follow-up questions and whether the designs materially differ.
- Evidence of useful blueprints before building a product catalog or paid offer.
- Professional equipment compatibility, accessibility, child safety, electrical, and installation validations.

Not a contractor quote, building plan, educational guarantee, or sale offer.
