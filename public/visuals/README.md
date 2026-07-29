# OWLL Visual Assets — Living Field Atlas

Custom visuals for the Open World Learning Lab site. Production PNG masters live in this directory; optimized derivatives may be added later without removing originals.

## Current assets

| Key | File | Dimensions | Embedded text | Status |
|-----|------|------------|---------------|--------|
| `homepage-learning-landscape` | `owll/homepage-learning-landscape.png` | 1536 × 1024 | No | **final** |
| `first-landing-coastal-systems` | `first-landing/coastal-systems-field-plate.png` | 1536 × 1024 | Yes | **final** |
| `locus-system-spine` | `locus/locus-system-spine.png` | 1536 × 1024 | Yes | **final** |
| `saturdays-journey` | `open-world-saturdays/reengagement-journey.png` | — | — | placeholder |
| `tahoe-origin-atlas` | `open-world-tahoe/four-zones-origin-atlas.png` | — | — | placeholder |

Manifest: `content/visual-assets.ts`  
Component: `components/visual/VisualPlate.tsx`

## Activation

Set `desktopSrc`, optional `mobileSrc`, and `status: "final"` in the manifest. Missing files never break the build — `VisualFallback` renders until assets exist.

```ts
"homepage-learning-landscape": {
  desktopSrc: "/visuals/owll/homepage-learning-landscape.png",
  status: "final",
  containsEmbeddedText: false,
}
```

## Handling embedded-text plates

First Landing and LOCUS plates include detailed typography inside the artwork.

- Use `variant="infographic"` and `object-contain` — never crop on project pages.
- Do **not** overlay duplicate week labels, layer names, or explanatory copy.
- Provide concise `alt`, a figure caption, and structured HTML nearby.
- Enable the **Expand visual** control (`VisualExpandDialog`) for readable inspection on small screens.
- Homepage previews use `variant="project-preview"` with `previewFocalPosition` to emphasize coastline/environment, not tiny embedded text.

## Homepage hero overlays

The homepage landscape supports up to five **HTML** overlay labels (Place, Field Notes, Inquiry, Creation, Return). Labels are decorative, hidden on small screens, and the hero must remain understandable without them.

## Mobile variants

Add optional `mobileSrc` and `mobileFocalPosition` in the manifest. `VisualPlate` serves mobile sources through `<picture>` when present.

## Replacing a visual

1. Export the revised PNG at the same or documented dimensions.
2. Replace the file at the path above (keep the filename stable when possible).
3. Update `width`, `height`, focal positions, and `alt` in `content/visual-assets.ts` if needed.
4. Run `npm run build` and visually inspect desktop, mobile, print, and Open Graph output.

## Alt text guidance

- Describe purpose and learning concept, not every embedded label.
- Note when a plate is conceptual rather than navigational.
- Keep hero alt to one or two sentences.

## Sharpness testing

1. View project pages at 375px and 1280px widths.
2. Open **Expand visual** and confirm infographic text is readable.
3. Check homepage hero at 2× device pixel ratio.
4. Avoid lossy recompression that blurs embedded type; prefer original PNG when in doubt.

## Future slots

When ready, add:

- `open-world-saturdays/reengagement-journey.png`
- `open-world-tahoe/four-zones-origin-atlas.png`

Until then, code-native fallbacks remain intentional.
