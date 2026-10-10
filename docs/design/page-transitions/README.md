# Ordinary page-link transitions

Reviewed local performance pass, 10 October 2026, included in the consolidated performance commit. Nothing has been pushed or deployed. See [the current handoff](../../performance-handoff.md) for completion status and the next pass. Generated PNG evidence remains local; reports and JSON records are committed.

The authored move retains its one-second duration, `EASE.arc`, 2.2-degree tilt,
31% outgoing rise, 5% sideways drift, scale changes, progressive dim and seam.
The navigation menu continues to own its separate aperture transition.

## Changes

- The outgoing still retains the visible band and a viewport of extra content
  on either side. Distant semantic sections keep their exact layout boxes and
  sibling positions, with their children omitted from the still.
- CSS animation properties are sampled at their current state. The still has
  no running animations, transitions or per-element `will-change` hints.
- Videos become canvas frames with their original crop and grade, avoiding
  duplicate video decoders. A real wrapper preserves rounded film crops.
- The active homepage fold refreshes its framebuffer synchronously for capture.
  Its fixed canvas and the service page's fixed decoration/bar are positioned
  at their captured coordinates inside the outgoing sheet.
- Service scroll drivers pause while either navigation mechanism owns the
  screen. Layout classes remain in place. Drift measurements refresh on resume.
- Hidden invitation WebGL, homepage fold setup for top landings, and deferred
  homepage section setup wait until the ordinary transition has finished.
- Homepage fallback clocks start after landing on a fresh homepage navigation;
  direct loads retain their existing entrance timing. The desktop headline walk
  also pauses during navigation.
- Rapid subsequent internal clicks cannot interrupt a pending destination.
  History interruptions cancel the current timeline and remove the still.
- Section links use the incoming page's anchor, measured without its parked
  transform. Homepage hash links wait for the fold runway or its no-video/GL
  fallback, and Lenis refreshes its new-route scroll limit before landing.

## Evidence

`before/` contains the production-browser baseline following the shared-effects,
homepage startup, and once-per-session entrance passes. `after/` is an
intermediate measurement, before the final homepage setup scheduling and
navigation corrections. `final/` contains the final desktop/mobile production
comparison; `final-cpu/` contains the focused four-times CPU run.

| Transition | Outgoing elements, before → final | Running CSS animations, before → final | Video elements, before → final | WebGL setup during slide, before → final |
| --- | ---: | ---: | ---: | ---: |
| Desktop home → service | 679 → 305 | 6 → 0 | 3 → 0 | 1 → 0 |
| Mobile home → service | 704 → 134 | 3 → 0 | 3 → 0 | 1 → 0 |
| Service → home | 1084 → 519 | 136–137 → 0 | 0 → 0 | 1 → 0 |

Service geometry reads during the desktop runs fell from 145 to 37 entering
the service and from 116 to 15 leaving it. The final counts include snapshot
and one-time setup reads; the continuous service tickers are suspended.
These work counts are more useful than a single fluctuating frame-time sample.

`check-snapshots/` contains an initial alignment check. `check-final/` contains
the final desktop/mobile still comparisons at the hero, active fold, services
list, service hero and service poster. `check-navigation/` exercises rapid
clicks, history interruption, section landing, separate menu navigation and
reduced motion. `check-media/` documents the focused rounded video crop check.

Run one browser process at a time:

```powershell
node tools/profile-page-transitions.cjs final http://127.0.0.1:3007
node tools/profile-page-transitions.cjs check-final http://127.0.0.1:3007
node tools/profile-page-transitions.cjs check-navigation http://127.0.0.1:3007
node tools/profile-shared-effects.cjs homepage-session http://127.0.0.1:3007
```

The screenshot checks pause ongoing motion and video before comparing the live
page and its still. They measure visible element alignment and retained page
height, inspect decoded pixels, and check the mobile crop's rounded corner.
Minor raster differences are expected when text enters a transformed layer and
video frames pass through a canvas; this is not a claim of pixel-identical text
antialiasing.

All ten final desktop/mobile comparisons passed. Visible element positions and
sizes differed by at most 0.016 CSS pixels; the retained sheet's total height
differed by less than 0.08 CSS pixels. The active fold remains visible, and the
mobile film's rounded crop passed its corner check. Rapid clicks, interrupted
history navigation, hash landings, reduced motion and the separate menu move
passed on both widths. The homepage session regression also passed, including
fresh sessions, navigation/history/reload returns and blocked storage.

The production build and TypeScript passed. Targeted ESLint has no errors;
existing image-element warnings remain. The 21st review has no errors or
warnings, with three existing informational SVG color suggestions in
HeroPortrait left unchanged.

## Limits

These checks use headless Chrome with software-capable WebGL. LayerTree does not
report usable layer counts in this environment. The clone timing hook measures
the root clone operation, which is deep in the baseline and shallow in the new
snapshot builder; it must not be used to claim a snapshot-build speedup.

The samples include first-use route code, style/layout work and browser warm-up.
Absolute frame times fluctuate, particularly with four-times CPU throttling.
The measurements establish reduced duplicate work and verify choreography and
navigation; they do not prove a consistent 60 FPS on physical devices. The
service template's own steady-state scroll and paint cost was the next pass at
this measurement point and has since been addressed; see the current handoff.

The focused throttled run completed both destinations without runtime errors
or mid-slide WebGL setup, but still had multi-second main-thread stalls. An
earlier combined stress run reported one browser error before its error details
were persisted; it did not repeat in the focused run. That observation is not
evidence that every slow-device failure has been resolved.
