# Open World Learning Lab Website

Public website for [Open World Learning Lab](https://openworldlearninglab.com) — an independent early-stage education design lab developing place-based learning journeys, mentor systems, and intelligent tools.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Route structure

| Route | Description |
|-------|-------------|
| `/` | Homepage — thesis, current work, learning loop, guardrails, releases preview |
| `/work` | Current work index with status groupings |
| `/work/first-landing` | First Landing pilot sketch |
| `/work/locus` | LOCUS learning system prototype |
| `/work/open-world-saturdays` | Open World Saturdays early concept |
| `/work/open-world-tahoe` | Open World Tahoe origin study |
| `/releases` | Public releases index |
| `/releases/owll-at-a-glance` | Print-friendly OWLL brief |
| `/about` | About the lab |
| `/contact` | Contact and collaboration |
| `/manifesto` | Redirects to `/#thesis` |

## Content storage

Content is data-driven via TypeScript modules in `content/`:

- **`content/projects.ts`** — project cards, Tahoe zones, sample missions, development sequence
- **`content/releases.ts`** — release metadata (type, status, version, dates, links)
- **`content/statuses.ts`** — normalized status labels, badge styles, ordering
- **`content/shared.ts`** — site config, nav links, guardrails, learning loop, technology horizons

Page-specific long-form copy lives in route files under `app/work/` and `app/releases/`.

## Adding a new project

1. Add a project object to the `projects` array in `content/projects.ts`
2. Create a page at `app/work/[slug]/page.tsx` using `ProjectPageLayout`
3. Add metadata via `createPageMetadata()` in `lib/metadata.ts` pattern
4. Optionally link related releases in `content/releases.ts`
5. The homepage and `/work` index update automatically from the projects array

## Adding a new release

1. Add a release object to the `releases` array in `content/releases.ts`
2. For standalone pages, create `app/releases/[slug]/page.tsx`
3. Set `downloadHref` only when a real file exists in `public/`
4. The `/releases` index and homepage releases section update automatically

## Status labels

Statuses are defined in `content/statuses.ts`:

- `origin-study` → Origin Study
- `early-concept` → Early Concept
- `pilot-design` → Pilot Design
- `product-prototype` → Product Prototype
- `research-in-progress` → Research in Progress
- `published` → Published Brief

Each maps to a display label, short explanation, visual badge class, and sort order.

## Social metadata

Use `createPageMetadata()` from `lib/metadata.ts` on each route. Site-wide defaults are in `app/layout.tsx`. Set `metadataBase` to the production URL in `content/shared.ts`.

## Print styles

Print CSS lives in `app/globals.css` under `@media print`. The OWLL at a Glance brief (`/releases/owll-at-a-glance`) uses `.owll-brief`, `.brief-section`, and `.brief-heading` classes. Navigation and share controls use `print:hidden`.

Use the **Print / Save as PDF** button to trigger the browser print dialog.

## Sharing

`ShareActions` component provides copy link, native share (with clipboard fallback), and optional print. Used on project and release pages.

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
npm run start    # Start production server
npm run lint     # ESLint
npx tsc --noEmit # Type-check
```

## Deployment

Configured for standard Next.js deployment (e.g. Vercel). No database or environment variables required for static content.

## Contact

hello@openworldlearninglab.com
