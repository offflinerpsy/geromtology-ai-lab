# Cellular motion — approved approach

The Inquiry descriptions below document published version 7. Its current multi-form revision, distinct drift and stronger scroll parallax are specified in [inquiry-multi-cell-motion.md](inquiry-multi-cell-motion.md). The approved hero and its preservation hashes still apply.

The owner approved the live cellular hero on September 30, 2026. Its reference is published version 6, source commit `eb34df4161286afcb495d8b54d9e25363865fbe0`. Preserve its composition, typography, raster and rendering code when extending this visual language. This Inquiry update does not change those files.

## Reusable technique

Animate the detailed source texture rather than inventing replacement geometry. Use coherent fluid displacement and small membrane harmonics; derive illumination and depth from the existing material. Use integer time harmonics for a closed cycle. Ease pointer and scroll targets into the render loop rather than directly binding transforms to input. Keep visible HTML copy independent of the canvas. No spinning orbit, sphere, HUD, particle confetti or synthetic scientific labels.

The hero uses a twelve-second cycle and restrained pointer depth. Fields of Inquiry uses a separate eighteen-second cycle, local membrane motion, texture-derived interior light and scroll displacement that varies with material depth. These are conceptual cellular illustrations, not experimental observations or a biological simulation.

## Transparent Inquiry composition

`components/site/inquiry-cellular-art.tsx`, `lib/cellular-inquiry.ts` and `app/inquiry-animation.css` provide the isolated composition. WebGL uses an RGBA texture with premultiplied texture filtering/output. The artwork contains actual alpha; a graduated CSS mask softens its extension behind Research Programs. Contained rendering leaves room for displacement without a rectangular photographic frame. On phones the full silhouette fits above the program list, with lighter motion. The foreground text and native disclosure controls remain independent and usable.

WebGL-unavailable browsers use an alpha-preserving Canvas 2D texture mesh. Both renderers suspend when the artwork is offscreen, the tab is hidden, motion is paused or reduced motion is requested. The static transparent image remains the initial/failure/reduced-motion presentation. Renderer loading starts near the section. GPU/CPU resolution and frame rate are bounded, and observers/listeners/resources are released on navigation.

## Asset provenance

`public/images/cellular-inquiry-transparent.webp` is a background-extraction/recomposition edit of the retained `cellular-field.webp`, produced with one built-in imagegen request. Original output: 1536 × 1024 RGBA PNG, 55.1% fully transparent pixels. WebP conversion preserves alpha. The original field image is unchanged and still used on the other pages.

Prompt: Recompose the reference into one transparent, left-heavy branching cellular tissue ribbon, preserving silver-gray porous membranes, olive/chartreuse translucent interiors and fine biological microtexture. Dominant sculptural arc on the left; delicate connected strands into sparse right-side negative space. Photoreal conceptual microscopy; true alpha, no backdrop, text, diagrams, orbit, glow or panel.

## Preservation and rollback

The following hero files remain byte-identical to the approved version:

| File | SHA-256 |
| --- | --- |
| `components/site/home-hero-animated.tsx` | `7dc40b180ba464e46e08fa0a5bf1493202636ccb0e4a5a7475fca5e2d57fa480` |
| `lib/cellular-hero.ts` | `6b376b817eb4864eb5d16946d67387b93dfa22ddd1fda77faa99e37041204872` |
| `lib/cellular-hero-canvas.ts` | `b0c780bd0f4219fe46ba371d76fb1a53ccf826407ddf05f5e7470f2a7104cd72` |
| `app/hero-animation.css` | `4899aa721d25698187dc58aafabd682fb83e5f61a2d7edfdb2c6be93185d97ac` |
| `public/images/cellular-hero.webp` | `f2da51b45205eeccfb98492ff51bfd85443957ea821becec29d80a418f210164` |

To restore only the former Inquiry image, restore its section markup from the reference commit and remove the Inquiry component/import and `inquiry-animation.css` import. Keep `HomeHeroAnimated` and `hero-animation.css` active. The earlier original-hero archive is also retained unchanged.
