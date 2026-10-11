# Performance handoff — 10 October 2026

Delivery update, 11 October 2026: the owner authorized pushing `main`, including
both reviewed performance commits, the sharing image, homepage blog carousel
and editorial records. Earlier local-only statements below describe the
10 October handoff. Check the remote tracking state for Git delivery; hosting
deployment has not been verified. Performance work remains on hold.

## Current state and user preferences

The user reviewed the service-photo restoration, shared-effects pass, homepage
startup pass, once-per-session homepage entrance, ordinary page-link transitions,
individual service template and persistent Calendly preload. They then requested
a local commit and a memory update before opening a fresh chat. These changes
form the local commit `Improve motion performance and preload shared booking calendar`.
As of 10 October, nothing had been pushed or deployed. Find the commit by this
subject in `git log`.

The subsequent first-load pass is now implemented locally on top of `d1e258f`.
Its production checks passed. The user then authorized the local commit
`Reduce first-load cursor payload and shader waits` and a memory update, and put
further performance work on hold. Nothing had been pushed or deployed at that
handoff. Find the new commit by this subject in `git log`; it contains the application changes,
tools, report, controlled JSON records and regression results, without raw
profiling captures or unrelated files. Physical-device/Safari review remains
outstanding and should not be recorded as completed.
See [the first-load report](design/first-load/README.md).

The user will start another chat for another purpose. Do not automatically resume
performance work; follow the new request. The remaining levers below are saved
for an explicitly requested future performance pass.

The user wants smooth motion while retaining the site's current appearance.
Proceed one pass at a time and review locally. Push the reviewed work together
only when explicitly authorized. Do not redesign sections, change animation
curves or reduce effect quality just to improve a score.

The active site is Next.js App Router v4: `src/app/(v4)`,
`src/components/v4`, `src/styles/tokens.css`. The latest successful production
build used Next.js 16.1.6 and generated 43 routes. `.21st/DESIGN.md` and
`.21st/design.json` record the design decisions. The older v3 palette and retired
service components are not the source of truth.

## Completed work

### Realistic service photographs

Restored all six original, already tracked WebP service photographs on the
homepage and services hub, shared through `src/lib/service-photos.ts`. Removed
the graphics registry. Crops, frames, color, mobile card disclosures and carousel
behavior stay as reviewed. Untracked PNG graphics are reference assets, not
dependencies of this implementation.

### Shared effects

`src/lib/shared-effects.ts` composes menu freeze (`k:freeze`), ordinary transition
(`k:transition`) and document visibility, including overlapping pauses. The fluid
cursor draws on pointer input and until the visible trail decays, then sleeps;
it discards input while paused. It remains absent on touch and with reduced
motion. Grain, plate lift, footer and CTA drivers rest when settled or offscreen,
with geometry collected before writes. Navbar footer detection responds to
events instead of continuously polling. Live-page queries exclude transition
ghosts. Shaders, solver, resolution, blend mode and authored motion remain.

On `/privacy`, one-second samples fell from 671 fluid draws before input and 660
after settling to zero; shared dark-surface reads fell from 240 to zero. Resting
before/after captures were pixel-identical. See
[the shared-effects report](design/shared-effects/README.md).

### Homepage startup

The peel uploads decoded video frames rather than every playback-clock change.
Flat states use two triangles; the original 140×90 mesh and shader remain during
the fold. Tickers sleep at settled states and resources clean up on unmount.
Homepage section text, sheets, work/gallery and invitation resources prepare
near the viewport, after the hero settles unless the user scrolls or focuses
there. The cursor's dynamic WebGL setup waits for hero readiness and idle time.
A late video cannot introduce a fullscreen cover or extra runway after fallback
content has appeared.

Tracked resting section reads fell from 300 per second to zero. Video uploads
fell approximately 79→39 cold desktop, 107→47 warm desktop and 112→47 cold mobile;
duplicate callback-frame uploads were zero. Offscreen invitation WebGL contexts
at startup fell from one to zero. Hero geometry matched; flat/dense mesh comparison
had at most 1/255 channel difference. Original visible motion remains. See
[the homepage report](design/homepage-startup/README.md).

### Homepage entrance once per session

`src/lib/homepage-effects.ts` shares one entrance decision per mounted homepage
between the three hero drivers. `sessionStorage` key
`konaverse_home_entrance_seen` remembers the first homepage visit per tab session;
a WeakMap prevents conflicting decisions and an in-memory fallback handles
blocked storage. Starting on another route does not consume the entrance.
Leaving during the entrance does consume it. Navigation, history and refresh
return to the settled hero; a fresh session plays again. The ongoing headline
walk, video loop and scroll fold remain. See
[the session report](design/homepage-session/README.md).

### Ordinary page-link transitions

`src/lib/page-snapshot.ts` freezes the outgoing visible band with a viewport of
extra content above and below. Distant sections keep their exact boxes without
their children. Videos become still canvases, CSS animation state is sampled,
and the outgoing sheet has no running animation, video decoder or extra
`will-change`. Fixed hero/service decoration and rounded video crops retain
their captured geometry. Expensive incoming effects wait for landing.

The authored one-second `EASE.arc`, 2.2° tilt, 31% rise, 5% drift, scales, dim and
seam are preserved. The menu retains its separate choreography. Rapid clicks,
history interruption, cleanup and hash landings were corrected, including Lenis
scroll-limit refresh and homepage fold-runway readiness.

Outgoing element counts fell 52–81% in tested routes. CSS animations, video
elements and WebGL setup during the slide all fell to zero. Ten desktop/mobile
snapshot checks matched within 0.016 CSS px; retained sheet height differed by
less than 0.08 px. See [the transition report](design/page-transitions/README.md).

### Individual service template

The active route is `src/app/(v4)/services/[slug]/page.tsx`. Its active components
include RunGround, RunHero, RunAnswer, RunMore, ServicePoster, RunTrack, RunLight
and Invitation. RunBrief, RunFit, RunPlan, RunHandover, ServiceStage and
ServiceProcess are parked; do not optimize those as if they were active.

`ServiceRays.tsx` and `src/lib/service-rays.ts` draw the same 132 rounded
hairlines on one full-DPR 2D canvas. Individual lengths, negative delays,
2.6–6 second durations, CSS ease-in-out alternate breathing and 90-second rotation
are retained. SSR/no-JS/reduced-motion have a static SVG; unavailable 2D rendering
has an animated SVG fallback. Rays sleep offscreen and during navigation.

`src/lib/page-motion.ts` batches active section reads before writes, wakes on
input/resize/visibility/navigation and runs until each original glide settles.
Answer/More measurements and pointer masks are batched. Distant invitation
WebGL and text splitting wait until near. Responsive fact-image selection uses
existing 800px siblings at desktop DPR 1. Hero font/layout matches the baseline;
an intermediate double-counted padding issue was corrected before review.

Hero resting section reads fell 804→0 desktop and 737→0 mobile; approximately
1.1-second main-thread task duration fell 240→79 ms and 246→77 ms. Active CSS
animations fell 137→5 and 136→4. All 12 desktop/mobile geometry comparisons
matched exactly. All 18 six-template desktop/mobile/reduced-motion cases,
no-JS content and interaction cases passed. Twelve ray parity comparisons
including Retina passed, with explicit SVG/canvas antialiasing tolerance;
the largest mean channel difference was 0.106/255. See
[the service report](design/service-template/README.md).

### Persistent Calendly preload

The v4 layout server-renders one eager iframe and preconnects Calendly origins.
`CalendlyPopover.tsx` retains it across all SPA routes, with parked, inline and
popover modes. It first renders at its real size behind the opaque site until
ready, then parks offscreen. Fully hidden/offscreen preloading did not finish
initialization in the browser check. The warm-up was verified not to alter the
visible page. Do not replace this with a hidden frame or URL prefetch without
verifying Calendly actually becomes ready.

Contact provides its original slot; `src/lib/calendly.ts` places the same fixed
frame using fractional box dimensions and composed ancestor transforms. It
follows scrolling, menu scaling and the outgoing ghost without reparenting,
changing `src` or creating another frame. Modal dimensions and original GSAP
entrance/exit remain. Positioning sleeps at rest; motion following only runs
while a transition/menu is moving. The shared component sits after `.k-shift`
in the layout to preserve its stacking with the Contact sheet and menu dim.

Readiness validates the Calendly origin and sender window. A tiny server-HTML
listener stores early ready events in `window.__konaverseCalendlyReady` before
React hydration. External fallback links bypass the booking interceptor.
Blocked/slow loads offer a direct booking link; no-JS Contact retains iframe
markup and an external link. Cookie-policy copy now describes site-entry
preloading. Calendly itself still requires JavaScript.

Desktop/mobile checks found the frame ready before modal clicks, one Calendly
document navigation per tab through opens, Contact visits, menu motion and
route returns, and the same iframe node/contentWindow throughout. Selecting a
date showed available times and persisted across returns. Contact alignment
was exact at rest/scroll; settled menu alignment differed by less than 0.016 px.
Idle slot geometry reads were zero. Cold direct-entry, blocked loading, no-JS
markup, and repeated modal opens from Contact passed. No booking was submitted.

This moves Calendly's initial download and startup to site entry. A fresh direct
Contact load, full reload or a click before preload completes can still wait.
It does not make external network/availability responses instantaneous. The
remaining cold-load investigation must include this intentional preload and
preserve the ready, reusable booking experience. See
[the Calendly report](design/calendly/README.md).

## First-load pass (local commit)

Production traces attributed specific startup waits to the hero's synchronous
shader checks and Three's first-use shader diagnostics. React Three Fiber's
standard Canvas also registered the full Three catalog in the delayed cursor
bundle. These costs contributed to stalls; they did not explain every cold-load
task. Calendly and its child-frame work were measured separately from the page
renderer and its site-entry preload remains intact.

`HeroPeel.tsx` submits the original shaders and polls parallel-compiler completion
before link checks. Navigation/fallback cancels pending work and prevents late
cover or runway installation. `HeroPortrait.tsx` allows a submitted compiler its
2,600 ms fallback duration; unavailable WebGL and late video retain their original
fallback. No animation curves, shader source, video/mesh quality or fold behavior
changed.

`FluidCanvas.tsx` uses the same React Three Fiber renderer with an explicit
three-element catalog and viewport resize events. `fluid/Fluid.tsx` imports the
specific buffer hook and prepares the original solver/composer programs before
accepting input, one program per task, with cancellable parallel polling and
the existing diagnostics retained. Solver, resolution, blending and authored
motion remain. Demand rendering, composed pauses and zero idle draws still pass.

The cursor chunk fell 1,066,572→849,494 uncompressed bytes (20.4%); measured desktop
Next-script transfer fell about 10%. All six desktop cases eliminated recorded
first-stroke shader queries exceeding 1 ms. The deterministic cursor comparison
matched every RGBA channel exactly and retained all 11 compiled shader-source
hashes. Forced compiler delays, navigation cancellation and cursor resize passed.
No-parallel-extension fallback passed. All ten isolated cold/warm/CPU×4 runs had
no runtime errors and booking ready before interaction.

Whole-page cold-load totals were mixed. Do not report a uniform startup speedup
or a physical-device smoothness improvement from these samples. Script
evaluation, hydration/layout, context/extension initialization, analytics and
third-party work remain. The report separates these limits from the smaller
payload and removed compiler waits.

## Verification and local evidence

The first-load pass's production build and TypeScript passed all 43 routes;
targeted ESLint passed its four application files with no warnings or errors.
Production-browser checks covered shared effects and overlapping pauses,
homepage entrance/fold/sections/fallbacks, first-session/history/refresh behavior,
ordinary navigation/menu/hash/reduced motion and persistent Calendly selection.
No-JavaScript content passed. Calendly retained one ready iframe and zero idle
slot reads. No booking was submitted. Two unchanged navigation reruns passed
after an initial runtime error whose detail was not captured; persistent stack
logging was added, and the original cause remains unknown. See the first-load
report for exact records and reproduction commands.

For the previously reviewed commit, the production build and TypeScript passed
all 43 routes. A transient
Turbopack Google-font resolver error disappeared on an unchanged retry; no font
change was made. Targeted ESLint had no errors; pre-existing plain-image warnings
remain in earlier components. The final Calendly files had no lint warnings.
21st component reviews passed. Final desktop/mobile navigation regressions
covered rapid links, history interruptions, hashes, menu navigation and reduced
motion with no runtime errors. Documentation-only handoff changes do not alter
the tested application.

The reviewed reports and JSON records, including the first-load report, tools,
controlled JSON records and regression results, are included in local commits. Raw gzip
traces, CPU profiles, pixel buffers and PNGs are local evidence; do not include
them in a future performance commit. The earlier generated PNG captures (about 224 MB)
and exploratory Calendly debug captures remain local and can be reproduced with
the tools. JSON records can mention these local screenshot paths; they are not
required application assets. Phase README status/next-pass statements describe
their original measurement point; this handoff records the current completion
state. Earlier numeric baselines predate the Calendly preload and should not be
treated as the current cold-start baseline.

At the 10 October handoff, artwork, ZIPs, blog drafts/planner, public reference
assets, SEO exports and `.claude/settings.local.json` were left uncommitted.
The 11 October delivery includes the relevant blog drafts and editorial records
in a separate commit. Unrelated assets, captures, exports and local settings
remain outside that scope; do not stage everything or clean the tree wholesale.

At handoff, the final production preview was at `http://127.0.0.1:3008`; its
process may not survive into a new chat. To recreate it:

```powershell
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3008
```

Run only relevant browser checks, one browser process at a time. The tools use
`puppeteer-core` and locally installed Chrome; browser launches may need the
environment's execution approval. Example commands against the production server:

```powershell
node tools/profile-shared-effects.cjs check http://127.0.0.1:3008
node tools/profile-shared-effects.cjs homepage-final http://127.0.0.1:3008
node tools/profile-shared-effects.cjs homepage-check-final http://127.0.0.1:3008
node tools/profile-shared-effects.cjs homepage-check-fallbacks http://127.0.0.1:3008
node tools/profile-shared-effects.cjs homepage-session http://127.0.0.1:3008
node tools/profile-page-transitions.cjs check-navigation http://127.0.0.1:3008
node tools/profile-page-transitions.cjs check-service-regression http://127.0.0.1:3008
node tools/profile-service-template.cjs check http://127.0.0.1:3008
node tools/check-service-rays.cjs http://127.0.0.1:3008
node tools/check-calendly.cjs final http://127.0.0.1:3008
node tools/check-calendly.cjs cold http://127.0.0.1:3008
node tools/check-calendly.cjs reopen http://127.0.0.1:3008
```

Some labels have special assertion modes; consult the tool before choosing a
new output label. A `before` label records whichever build the server runs, not
an automatic historical checkout. Avoid overwriting historical evidence when
capturing a new baseline.

## Saved next lever — performance work on hold

The user requested holding off on further performance work. Resume only when
explicitly requested, with any additional visual/device review then needed.
The controlled baseline is `first-load/before`, taken from `d1e258f` with Calendly
already preloading. `first-load/after` is the locally committed first-load pass. The exploratory
`first-load/baseline` used a shared browser shader cache and a different trace
boundary; it also overlapped late CPU checks, so exclude it from timing claims.
Earlier phase numbers predate the current booking preload and cannot establish
the remaining first-load costs. Use fresh evidence labels for further runs.

If continuing startup work, attribute the remaining script evaluation,
hydration/layout and context/extension setup in the current production build.
Site analytics and Calendly contribute external work; preserve the intentional
booking preload and its ready, reused iframe. Repeat isolated cold/warm desktop,
mobile and CPU×4 cases sequentially; main-page trace tasks and descendant-frame
Long Tasks API entries must not be conflated. Do not change authored motion,
quality or readiness to chase a score.

Chrome software-WebGL timings are diagnostic, not proof of 60 FPS. Safari and
physical desktop/mobile review remain necessary. After the shared startup work,
continue page by page through About (`/about`),
Work (`/work`) and case studies (`/work/[slug]`), then the remaining routes.
Preserve the completed behavior and run the relevant regressions at each step.
