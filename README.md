# Open World Learning Lab Website

Public website for [Open World Learning Lab](https://openworldlearninglab.com) — an independent early-stage education design lab developing place-based learning journeys, mentor systems, and intelligent tools.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Art direction: The Living Field Atlas

The site uses a place-based editorial identity — field research, systems thinking, and cumulative knowledge — rather than generic startup or dashboard styling.

## Design tokens

CSS variables live in `app/globals.css`:

- **Palette:** `--color-field-paper`, `--color-water`, `--color-moss`, `--color-sediment`, etc.
- **Semantic:** `--color-page`, `--color-ink`, `--color-secondary`, `--color-border`, `--color-link`
- **Layout:** `--reading-width` (720px), `--wide-width` (1320px), `--section-y`

Project accent tokens: `content/project-themes.ts`

## Typography

Loaded via `next/font` in `app/layout.tsx`:

| Role | Font |
|------|------|
| Display / page titles | Newsreader (serif) |
| Body / UI | Inter (sans) |
| Metadata / captions | IBM Plex Mono |

Utility classes: `.text-display`, `.text-page-title`, `.text-section-title`, `.text-body`, `.text-metadata`

## Layout primitives

`components/layout/`:

- `PageShell`, `WideContainer`, `ReadingColumn`
- `EditorialSection`, `SplitSection`, `VisualSection`
- `MetadataRail`, `SectionDivider`

## Visual components

| Component | Purpose |
|-----------|---------|
| `VisualPlate` | Custom asset slot with code-native fallback |
| `FieldAtlasFrame` | Figure numbering, scale, coordinates |
| `ProjectMasthead` | Project dossier header |
| `StatusBadge` | Type · status metadata |
| `LearningLoopDiagram` | Seven-stage loop (single semantic source) |
| `LocusSystemSpine` | LOCUS system diagram |
| `FieldNoteSpecimen` | Illustrative field note |
| `TechnologyHorizons` | Today → Emerging → Future |
| `GuardrailIndex` | Editorial guardrail list |
| `ReleaseCover` | Release cover system |

## Visual manifest

`content/visual-assets.ts` — asset keys, paths, alt text, dimensions, `placeholder` | `final` status.

Asset documentation: `public/visuals/README.md`

### Activate a final custom visual

1. Add WebP to `public/visuals/<project>/`
2. Set `desktopSrc` / `mobileSrc` in `content/visual-assets.ts`
3. Set `status: "final"`
4. Verify desktop/mobile crop and alt text

Until activated, `VisualFallback` renders conceptual field plates (no broken images).

## Fallback visuals

Code-native SVG fallbacks in `components/visual/VisualFallback.tsx` — contour lines, routes, environmental layers. Public-safe until final art is added.

## Project accents

Add or edit themes in `content/project-themes.ts`. Map slugs in `slugToTheme`.

## Release covers

Use `ReleaseCover` with `releaseTypeToVariant()` for consistent compositions. See `components/ReleaseCover.tsx`.

## Route structure

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/work` | Current work index |
| `/work/first-landing` | First Landing pilot sketch |
| `/work/locus` | LOCUS prototype |
| `/work/open-world-saturdays` | Saturdays early concept |
| `/work/open-world-tahoe` | Tahoe origin study |
| `/releases` | Public releases |
| `/releases/owll-at-a-glance` | Print-friendly brief |
| `/about`, `/contact` | Lab info |

## Content storage

- `content/projects.ts` — projects, Tahoe zones, missions
- `content/releases.ts` — release metadata
- `content/statuses.ts` — status labels
- `content/shared.ts` — site config, guardrails, horizons
- `content/learning-loop.ts` — loop stage data model
- `content/visual-assets.ts` — visual manifest

## Print styles

`@media print` in `app/globals.css`. Nav, footer, and `[data-print-hide="true"]` hidden. Use **Print / Save as PDF** on project/release pages.

Test: `/releases/owll-at-a-glance`, project pages, field note specimen.

## Diagram testing

- Learning loop: `/#learning-loop` — desktop circle + mobile trail; one `sr-only` source list
- LOCUS: `/work/locus` — horizontal spine (desktop), vertical (mobile)
- Reduced motion: no essential hover-only information

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npx tsc --noEmit # Type-check
```

## Deployment

Standard Next.js (e.g. Vercel). No database or env vars required.

## Contact

hello@openworldlearninglab.com
