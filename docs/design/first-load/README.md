# First-load startup pass — 10 October 2026

This local pass starts from the accepted `d1e258f` build, including the persistent
Calendly preload. It preserves the v4 design and motion. The user authorized the
local commit `Reduce first-load cursor payload and shader waits` and put further
performance work on hold on 10 October 2026. Nothing has been pushed or deployed.
Physical-device/Safari review remains outstanding; this does not block the
authorized local commit. Do not resume profiling unless the user requests it.

## Attribution and change

Production traces separate the page renderer from Calendly and its child frames.
They record script evaluation, main-thread compilation, hydration callbacks,
style/layout/paint, WebGL context creation and shader queries. CPU samples locate
Three's `WebGLProgram.onFirstUse` diagnostics and the full Three catalog registered
by React Three Fiber's standard `Canvas`. The hero peel also synchronously checked
shader compile/link status. These are specific startup costs, not the explanation
for every cold-load stall.

`HeroPeel` now submits its original shaders and polls
`KHR_parallel_shader_compile` completion before checking link status. The shader,
video uploads, ordered mesh, flat-state mesh and entrance/fold drivers are
unchanged. The portrait extends its fallback timer to 2,600 ms when a valid shader
has been submitted, matching the headline's fallback duration; unavailable WebGL
and late video keep their original fallback.
An abort on navigation or fallback stops polling and releases pending shaders.
Completed late work cannot install the fullscreen cover or scroll runway.

`FluidCanvas` uses React Three Fiber's `createRoot` with only `Group`, `Mesh` and
`PlaneGeometry` registered. The same renderer, linear output, flat tone mapping,
DPR range, composer and fluid solver remain. It tracks fixed-viewport size using
resize events instead of the standard canvas's scroll measurement. The buffer
hook imports its specific Drei module. This removes unused catalog code from the
delayed desktop chunk. Touch and reduced motion still do not load the cursor.

The cursor prepares one original solver program per task, polls completion and
finishes Three's existing diagnostics/uniform lookup before accepting input.
The final composer program is prepared too. Drawing remains demand-driven and
paused during menu, ordinary transition and hidden-tab states. Shader quality,
resolution, palette, intensity, decay, fade, blending and solver order remain.
Resize/unmount cancellation stops polling before disposed material state is read.
Browsers without the parallel extension retain the renderer's synchronous path
with task boundaries between programs.

Calendly markup, site-entry start, readiness validation, single iframe and
persistent selection are unchanged. Its preload is included in all timings.
Site analytics are also retained. Their script evaluation and initial layout and
hydration remain costs to investigate, especially with CPU throttling.

## Method and evidence

`before/` and `after/` hold the controlled measurements. Each mode launches a
fresh Chrome process and isolated browsing context. Cold modes disable and clear
HTTP cache; warm modes prime that mode's assets, then reload. Warm homepage
measurements reset only the entrance session flag to exercise the same authored
opening. Desktop, mobile and CPU×4 cases run sequentially. No build, lint or other
browser profile runs alongside them. Cold means fresh browser/HTTP storage;
operating-system and driver caches cannot be guaranteed cold.

The startup trace covers the first 13 seconds of document time. Booking readiness
is also awaited before the subsequent pointer interaction. The Long Tasks API
can include descendant-frame tasks; `compare-first-load.cjs` derives page-renderer
task duration from trace process/thread IDs instead of treating that API total
as application-only work. Trace phase durations are nested and must not be added
together. Streamed/background parsing is not fully represented by main-thread
`v8.compile` events. WebGL query records include calls exceeding 1 ms only.

The earlier `baseline/` directory is exploratory local evidence. Its shared
browser shader cache, load-event measurement boundary and overlapping late CPU
checks exclude it from the controlled timing comparison. It was used to locate
the blocking calls, not to claim a before/after speedup.

Compressed raw traces, CPU profiles, RGBA buffers and PNG screenshots are local
evidence, not application dependencies or intended commit contents. The tools
and compact JSON summaries reproduce the records.

## Results

The delayed cursor chunk fell from 1,066,572 to 849,494 uncompressed bytes
(20.4%). Homepage desktop Next-script transfer fell from 572,356 to 514,939 bytes
(10.0%, including response overhead); service desktop fell from 562,325 to
504,668 bytes. Mobile keeps the cursor absent and its script transfer essentially
unchanged.

The following sums include recorded shader status/log calls exceeding 1 ms.
They describe the observed queries, not total GPU compilation time.

| Case | Hero query time before → after | Cursor startup query time before → after | First-stroke query time before → after |
| --- | ---: | ---: | ---: |
| Home desktop cold | 22.4 → 1.6 ms | 62.6 → 33.2 ms | 54.1 → 0 ms |
| Home mobile cold | 74.9 → 5.6 ms | absent | absent |
| Home CPU×4 | 49.8 → 1.6 ms | 28.8 → 4.3 ms | 69.7 → 0 ms |
| Service desktop cold | absent | 77.0 → 15.9 ms | 44.2 → 0 ms |
| Service CPU×4 | absent | 33.5 → 0 ms | 60.0 → 0 ms |

All six desktop cases had no recorded first-stroke shader query exceeding 1 ms
after the change. Every measured pointer interaction rendered and returned to
zero idle cursor draws. All ten final runs had no runtime errors and Calendly
ready before interaction; homepage entrances completed, and mobile had no cursor
context. No booking was submitted.

Overall cold-load totals are mixed and are not a uniform speedup claim. In these
single samples, page-renderer long-task sums were 239 → 356 ms for cold desktop
Home, 1,178 → 1,450 ms for cold desktop Service, 6,713 → 6,231 ms for Home CPU×4
and 6,463 → 5,164 ms for Service CPU×4. Mobile Service also varied substantially
despite essentially unchanged startup code. Main-thread script evaluation,
hydration/layout, context/extension initialization, analytics and third-party
content remain. The reliable conclusions are the smaller payload, removed
compiler waits and preserved rendering; repeated/device measurements are needed
for any broader responsiveness claim.

The deterministic 1440×900 cursor comparison matched every RGBA channel exactly,
with identical resting PNG bytes and the same 11 distinct compiled shader-source
hashes. Forced late compilation and leaving while compiling released both
pending shaders and the pending program without late cover/runway changes.
The no-parallel-extension hero path passed. Resizing during cursor preparation
ignored early pointer input, cancelled obsolete work and resumed at the exact
1280×800 drawing-buffer dimensions without runtime errors.

## Behavior verification

The production build and TypeScript passed all 43 routes. Targeted ESLint passed
the four changed application files with no warnings or errors. The following
production-browser regressions passed sequentially:

- Shared effects: cursor wake/decay/idle, overlapping menu/transition/visibility
  pauses, real navigation, navbar/footer interactions, touch and reduced motion.
  Paused and settled cursor draws remained zero.
- Homepage: desktop/mobile entrance, reversible fold, native mobile handoff,
  section reveals, realistic service-photo fans/disclosures, project interactions
  and invitation ripple. No-WebGL, blocked/late video, unavailable video-frame
  callbacks, early scroll, reduced motion and no-JavaScript content passed.
- Session behavior: first visit, client return, history, refresh, fresh tab
  session, leaving during entrance and blocked storage. The ongoing headline
  walk remains on same-session returns.
- Navigation: rapid links, interrupted history, hashes, separate menu
  choreography and reduced motion on desktop/mobile. An initial run reported one
  runtime error without preserving its detail. The tool now stores error stacks;
  two unchanged reruns passed with no runtime errors. Its original cause is
  unknown and should not be attributed to external code without evidence.
- Calendly: ready before clicks on desktop/mobile, one iframe document navigation,
  identical node/contentWindow through route returns and modal opens, selected
  date and available times retained. Contact placement matched at rest and
  scroll; maximum menu-placement difference was 0.016 CSS px. Idle slot reads
  stayed zero. No booking was submitted.

Compact records are in `after/`, `../shared-effects/first-load/`,
`../homepage-startup/check-first-load/`, `../homepage-session/first-load/`,
`../page-transitions/first-load-navigation/`,
`../page-transitions/first-load-navigation-repeat/` and
`../calendly/first-load/`. The initial failed navigation run did not produce a
result record. The final deterministic cursor and cancellation checks are in
`after/parity.json`, `after/interruptions.json` and
`after/cursor-resize.json`.

## Reproduce

Run the accepted baseline in a separate checkout for `before`; the labels record
the supplied server and do not automatically switch builds. Run the candidate
for `after`. Do not replace the saved baseline with candidate output.

```powershell
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3008
node tools/profile-first-load.cjs before http://127.0.0.1:3008 all
node tools/check-first-load.cjs before http://127.0.0.1:3008
# After building and starting the candidate:
node tools/profile-first-load.cjs after http://127.0.0.1:3008 all
node tools/check-first-load.cjs after http://127.0.0.1:3008
node tools/compare-first-load.cjs before after
# Behavior regressions; retain separate output directories:
node tools/profile-shared-effects.cjs first-load http://127.0.0.1:3008
node tools/profile-shared-effects.cjs homepage-check-first-load http://127.0.0.1:3008
node tools/profile-shared-effects.cjs homepage-session http://127.0.0.1:3008 first-load
node tools/profile-page-transitions.cjs check-navigation http://127.0.0.1:3008 first-load-navigation
node tools/check-calendly.cjs first-load http://127.0.0.1:3008
```

A single mode can replace `all`, for example `home-cpu4` or
`service-desktop-cold`. `all` resumes missing JSON records. Use a fresh label for
a new run. Browser execution and the production server may require the local
environment's execution/network approval.

Headless Chrome uses software WebGL here. These traces establish work attribution
and rendering parity; they do not establish physical-device smoothness. Safari
and physical desktop/mobile review remain necessary.
