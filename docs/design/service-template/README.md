# Individual service template performance

Reviewed local pass, included in the consolidated performance commit. Nothing has been pushed or deployed. See [the current handoff](../../performance-handoff.md) for completion status and the next pass. Generated PNG evidence remains local; reports and JSON records are committed. Web Design was measured first; the same components serve all six individual services. Parked components such as RunBrief, RunPlan and ServiceStage are not part of this pass.

## What changed

- ServiceRays draws the original 132 hairlines together. Coordinates, length ranges, negative offsets and durations use the exact rounded values from the original SVG. CSS still rotates the picture over 90 seconds. The raster reproduces CSS `ease-in-out` and alternate breathing. Static SVG is available during hydration, without JavaScript and with reduced motion; an animated SVG fallback handles unavailable 2D rendering.
- Rays sleep outside the viewport, under either navigation mechanism and in hidden tabs. Snapshot capture refreshes the picture synchronously before the outgoing sheet is copied.
- A shared service scroll scheduler reads all active section rectangles before writing classes/transforms. It wakes on scroll, resize, visibility and navigation resume, and runs until each original glide settles. It removes idle ticker callbacks. Sections with entrances alone use their existing observers and need no geometry ticker.
- Answer word/card offsets are measured together on resize. More-section drift transforms are cleared together before measurement. Pointer masks use the latest pointer once per frame, with reads ahead of writes. The light wakes when its aim changes; the run bar retains its original delayed arrival and chapter states.
- Invitation WebGL setup and service BlockReveal splitting wait until half a viewport ahead, and until ordinary navigation has landed. Content, metadata, headings, schema and chapter links remain server-rendered.
- Fact images retain their sources and responsive siblings, with a desktop size hint matching the three-column layout. Desktop now selects the 800px sibling rather than the full original at DPR 1.
- The background word measures its local box, excluding navigation transforms. Its border-box padding is counted once; final direct-entry typography matches the baseline exactly.

## Measurements

Production Next.js, local Chrome, 1440×900 desktop and 390×844 mobile, DPR 1. Consent declined and random values fixed. Every resting interval lasts approximately 1.1 seconds. The probes count geometry calls and Chrome Performance metrics; headless ANGLE uses software rendering, so these are relative local measurements, not a hardware FPS guarantee.

| Hero at rest | Before | Final |
| --- | ---: | ---: |
| Desktop section geometry calls | 804 | 0 |
| Mobile section geometry calls | 737 | 0 |
| Desktop main-thread task duration | 240 ms | 79 ms |
| Mobile main-thread task duration | 246 ms | 77 ms |
| Desktop style recalculation duration | 63 ms | 15 ms |
| Mobile style recalculation duration | 63 ms | 10 ms |
| Active CSS animations, desktop | 137 | 5 |
| Active CSS animations, mobile | 136 | 4 |

All six resting landmarks in both final desktop/mobile profiles have zero section geometry reads. The original per-frame calls included distant sections and three individual card-position queries.

Cold desktop template initialization was 558 ms before and 448 ms in the final sample; mobile was 351 ms before and 420 ms final. Those timings vary between fresh contexts. The isolated final CPU×4 run reached template initialization at 1.56 seconds versus 3.54 seconds before, with 1,894 ms of cold long tasks versus 3,735 ms before. It still recorded a later 626 ms long-task total during the first resting window. Cold long tasks therefore remain; neither uniform cold-load improvement nor uninterrupted 60 FPS is claimed. The combined `final/cpu4` sample overlapped the start of a separate correctness run and is not used as a timing comparison. Use `final-cpu` for the isolated stress measurement.

## Visual evidence and checks

- Before/final Web Design comparisons at hero, answer, fit, poster, process and contact: desktop and mobile page height, scroll position, every recorded rectangle, font size and settled transform match exactly. The initial intermediate word-fit mismatch was corrected before the final build.
- Original SVG versus raster at 0, 1.7, 12 and 45.678 seconds on desktop, mobile and Retina: all 12 comparisons pass. Shape and timing agree; SVG/canvas antialiasing differs. The largest mean channel difference in the final parity run is 0.106 out of 255; fewer than 0.21% of channels differ by over 10. Retina edge tolerance is explicit in the checker, rather than assuming pixel-identical rasterization.
- Production build passes with TypeScript and all 43 routes. Targeted ESLint has zero errors and nine existing plain-image warnings. 21st review reports zero errors/warnings for the ten affected UI components.
- Six-template desktop/mobile/reduced-motion checks cover rendered landmarks, headings, schema and chapter targets. Web Design also checks ray activity, real menu pause/resume, offscreen sleep, all three fact arrivals and resets, and the desktop run-bar link. A no-JavaScript check covers the SVG and finished content.
- All 18 desktop/mobile/reduced-motion template cases and the no-JavaScript case pass with no runtime errors. Both desktop/mobile interaction cases pass.
- All ten ordinary page-transition snapshot cases pass, including the new ray canvas. The mobile outgoing hero is pixel-identical in this sample; desktop mean channel difference is 0.057 out of 255. Desktop/mobile navigation checks also pass: rapid links, history interruption, section landing, separate menu choreography and reduced-motion cuts. Evidence is in `../page-transitions/check-service-regression` and `../page-transitions/check-navigation`.

Run commands from the repository root:

```text
node tools/profile-service-template.cjs before
node tools/profile-service-template.cjs final
node tools/profile-service-template.cjs final-cpu
node tools/profile-service-template.cjs check
node tools/check-service-rays.cjs
node tools/profile-page-transitions.cjs check-service-regression
node tools/profile-page-transitions.cjs check-navigation
```

Evidence directories: `before`, `after` (intermediate), `final`, `final-cpu`, `check`, and `ray-parity`. Exact desktop/mobile geometry comparisons are saved in `geometry-parity.json`. Keep the authored composition, motion constants and fallbacks when iterating further.
