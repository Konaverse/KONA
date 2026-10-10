# Homepage startup performance pass

Reviewed local pass, 2026-10-10, included in the consolidated performance commit. Nothing has been pushed or deployed. See [the current handoff](../../performance-handoff.md) for completion status and the next pass. Generated PNG evidence remains local; reports and JSON records are committed.

## Changes

- The fluid cursor waits for the hero headline and copy to finish before scheduling its download and WebGL setup. Other routes retain their idle mount timing.
- The peel uploads on new video-frame callbacks rather than on every advance of the playback clock. Browsers without the callback use decoded-frame counts, with a clock fallback.
- Flat peel states use two triangles instead of 25,200. The full ordered mesh, shaders, resolution, crop, corner sequence, and fold geometry remain in use throughout the flight.
- The peel stops measuring when the opening settles or the claim leaves the screen. Scroll, resize, visibility, and navigation events wake it. Video callbacks and GPU resources are cleaned up on unmount.
- Homepage text wipes, service sheets, work previews/gallery, and invitation WebGL setup prepare near the viewport. Preparation also waits for the hero to settle unless the user scrolls or focuses into a section. This prevents temporary early font/video layout from triggering offscreen initialization.
- Initialized service/work tickers stop far from the viewport and during navigation or a hidden tab. The claim performs one measurement per scroll update rather than polling at rest.
- If fallback hero content has already appeared, a late video cannot introduce a fullscreen cover or shift the page by adding a runway.

No visual CSS, footage, mesh flight, easing, or authored animation durations changed in this pass. All section content is still server-rendered. The BlockReveal polymorphic tag now uses JSX to resolve a React ref-lint false positive; its rendered element and content are unchanged.

## Evidence

`before/` records the completed shared-effects build. `final/` records the final homepage build, measured separately from the interaction checks. `after/` is an exploratory run made alongside interaction checks and is excluded from timing comparisons.

| Measurement | Before | Final |
| --- | ---: | ---: |
| Tracked desktop resting section reads, typical second | 300 | 0 |
| Cold desktop video texture uploads during opening | 79 | 39 |
| Warm desktop video texture uploads during opening | 107 | 47 |
| Cold mobile video texture uploads during opening | 112 | 47 |
| Offscreen invitation WebGL contexts at startup | 1 | 0 |
| Duplicate uploads for the same video callback | Not instrumented | 0 |
| Premature lower-section text wipe lines, final cold mobile | — | 0 |

The tracked reads are `.hm-claim`, `.hm-heropin`, `.svs-list`, and `.wl-marq`. This does not claim the entire page is static: the video and the authored headline walk remain animated. Playback-quality frame counts can differ from video callback presentation timing; callback media timestamps are the reliable final upload check.

Hero word/pill rectangles match the baseline exactly at both tested widths. Service-sheet transform matrices also match exactly. `check-final/results.json` compares a flat quad with the original dense mesh using the same uniforms and texture: maximum channel difference is 1/255, affecting 0.065% of channels on desktop and 0.046% on mobile.

## Verification

- Production Next.js build and TypeScript passed.
- Targeted ESLint: zero errors; two existing image-element warnings in HeroTitle and ServiceSheets.
- 21st deterministic review of six affected components: zero findings.
- `check-before/` and `check-final/`: desktop/mobile hero, fold, reverse fold, mobile native landing handoff, text wipes, service tilt/disclosure, moving marquee, project preview/gallery entrance, invitation ripple, and return to the resting DOM video passed.
- `check-fallbacks/`: the final build's no WebGL, blocked video, late video, absent video-frame callbacks, reduced motion, no JavaScript, and scrolling before the entrance completed passed. `check-after/` also retains the earlier complete interaction/fallback run.
- All four final startup modes passed: desktop cold/warm, desktop with 4× CPU throttling, and cold mobile. Assertions cover cursor setup ordering when its context has initialized, no late cover, deferred lower effects, no duplicate callback-frame uploads, sleeping section drivers, and visible hero copy.

Run the local checks with a production preview:

```powershell
node tools/profile-shared-effects.cjs homepage-final http://127.0.0.1:3007
node tools/profile-shared-effects.cjs homepage-check-final http://127.0.0.1:3007
node tools/profile-shared-effects.cjs homepage-check-fallbacks http://127.0.0.1:3007
```

The harness uses headless Chrome with software-capable WebGL flags. Timing results are diagnostic and vary between runs. Cold desktop still shows frame delays, and 4× CPU loading still has a substantial initial JavaScript/hydration stall. This pass removes measured redundant work and fixes sequencing; it does not establish smoothness on every physical device or resolve the remaining page-transition/services-template work. Throttled runs wait beyond the initial ten-second sample for the entrance to complete, so their aggregate long-task totals are not directly comparable with the original shorter baseline window.
