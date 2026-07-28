# OWLL Visual Assets

Custom atmospheric visuals for **The Living Field Atlas** art direction. Production assets live in this directory; masters may be kept outside the repository.

## Workflow

1. Create the visual following the spec below.
2. Export as **WebP** or **AVIF** (WebP preferred for compatibility).
3. Compress for web (target &lt; 200 KB for hero plates, &lt; 120 KB for mobile variants).
4. Place files at the paths listed below.
5. Update `content/visual-assets.ts` — set `desktopSrc` / `mobileSrc` and `status: "final"`.
6. Add accurate `alt` text in the manifest (not embedded in the image).
7. Test desktop and mobile cropping; verify print appearance.

**Do not embed essential labels in images.** Overlay labels (Place, Field Notes, etc.) remain in HTML via `VisualPlate`.

Missing files do not break the build — code-native fallbacks render until assets are activated.

---

## Homepage Signature Plate

| Field | Value |
|-------|-------|
| **Desktop file** | `owll/homepage-learning-landscape.webp` |
| **Mobile file** | `owll/homepage-learning-landscape-mobile.webp` |
| **Desktop dimensions** | 1600 × 900 px |
| **Mobile dimensions** | 800 × 1000 px |
| **Aspect ratio** | 16:9 desktop · 4:5 mobile crop |
| **Negative space** | Upper-left third for headline adjacency on desktop |
| **Focal point** | 60% 40% desktop · 50% 35% mobile |
| **HTML overlay labels** | Place, Field Notes, Inquiry, Mentorship, Creation, Return |
| **Alt intent** | Conceptual field atlas of an open learning landscape |

**Manifest key:** `homepage-learning-landscape`

---

## First Landing Coastal Systems Plate

| Field | Value |
|-------|-------|
| **Desktop file** | `first-landing/coastal-systems-field-plate.webp` |
| **Mobile file** | `first-landing/coastal-systems-field-plate-mobile.webp` |
| **Desktop dimensions** | 1400 × 875 px |
| **Mobile dimensions** | 800 × 900 px |
| **Aspect ratio** | 16:10 |
| **Focal point** | 55% 50% desktop · 50% 40% mobile |
| **Alt intent** | Coastal systems field plate for Virginia Beach journey |

**Manifest key:** `first-landing-coastal`

---

## LOCUS Environmental Backdrop

| Field | Value |
|-------|-------|
| **File** | `locus/locus-environmental-backdrop.webp` |
| **Dimensions** | 1400 × 700 px |
| **Aspect ratio** | 2:1 |
| **Alt intent** | Layered environmental backdrop suggesting system depth |

**Manifest key:** `locus-backdrop`

---

## Open World Saturdays Journey

| Field | Value |
|-------|-------|
| **Desktop file** | `open-world-saturdays/reengagement-journey.webp` |
| **Mobile file** | `open-world-saturdays/reengagement-journey-mobile.webp` |
| **Desktop dimensions** | 1400 × 875 px |
| **Mobile dimensions** | 800 × 900 px |
| **Alt intent** | Reengagement journey from arrival through practice |

**Manifest key:** `saturdays-journey`

---

## Open World Tahoe Origin Atlas

| Field | Value |
|-------|-------|
| **Desktop file** | `open-world-tahoe/four-zones-origin-atlas.webp` |
| **Mobile file** | `open-world-tahoe/four-zones-origin-atlas-mobile.webp` |
| **Desktop dimensions** | 1600 × 900 px |
| **Mobile dimensions** | 800 × 1000 px |
| **Alt intent** | Four-zone origin atlas — lake, mountain, trail, campfire |

**Manifest key:** `tahoe-origin-atlas`

---

## Activation example

```ts
// content/visual-assets.ts
"homepage-learning-landscape": {
  desktopSrc: "/visuals/owll/homepage-learning-landscape.webp",
  mobileSrc: "/visuals/owll/homepage-learning-landscape-mobile.webp",
  status: "final",
  // alt, dimensions unchanged
}
```

## Mobile image selection

`VisualPlate` uses `<picture>` with a `(max-width: 767px)` source when `mobileSrc` is set. Otherwise the desktop image is used with `mobileFocalPosition`.

## Print

Verify figures retain contrast without decorative textures. Captions stay in HTML.
