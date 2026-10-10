# Shared effects performance pass — 10 October 2026

Reviewed local pass, included in the consolidated performance commit. Nothing has been pushed or deployed. See [the current handoff](../../performance-handoff.md) for completion status and the next pass. Generated PNG evidence remains local; reports and JSON records are committed.

The visual settings, shaders, fluid resolution, solver order, decay, blend mode,
grain coverage formula, image lift curve, footer reveal and hover weights remain
the same. This pass changes when those effects run:

- Fluid renders on demand. Pointer motion wakes it; a conservative bound on dye
  magnitude lets it sleep only after the shader would paint no visible trail.
- Menu freeze, ordinary link transitions and document visibility share pause
  handling. Suspended input is discarded instead of producing a stale trail on
  return. Overlapping menu and transition pauses remain paused until both end.
- Grain and image lift wake on relevant changes and rest after settling. The
  live page is measured independently of outgoing navigation clones.
- Footer motion rests offscreen. On desktop, pointer and scroll input wake its
  reveal and address weights; touch retains its moving light pools when visible.
  Letter geometry is collected before changing any letter's weight.
- The navbar's footer detection updates on scroll, resize and navigation state
  changes, without continuously polling the footer or changing menu choreography.
- The shared CTA field stops its ticker offscreen and when its click ripple ends.

## Runtime evidence

Production builds in headless Chrome at 1440 × 900. WebGL runs through software
rendering in this environment; draw counts establish unnecessary work removed,
not a promised frame-rate improvement on a particular user's GPU.

| One-second sample on `/privacy` | Before | After |
| --- | ---: | ---: |
| Fluid draw calls before pointer input | 671 | 0 |
| Fluid draw calls after the trail settles | 660 | 0 |
| Shared dark-surface geometry reads after settling | 240 | 0 |

Pointer movement still draws the fluid and wakes it again after suspension.
The cursor makes zero draw calls during menu and transition pauses, overlapping
pauses, and simulated hidden-document state. It does not mount on touch or with
reduced motion. The real menu opens/closes, the footer address responds to hover,
and a real link transition emits the pause/resume sequence. No page runtime
errors were recorded. The privacy page's resting before/after screenshots are
pixel-identical. Active trail, footer and homepage captures were inspected.

Production build and TypeScript checks pass. Targeted ESLint reports no errors
and six existing warnings in footer/menu code. The deterministic 21st review
reports no findings for the six reviewed shared-effect components.

Artifacts: `before/metrics.json`, `after/metrics.json`, and PNGs in both folders.
Run `node tools/profile-shared-effects.cjs check http://127.0.0.1:3007` against a
local production server to repeat the browser assertions.

At this measurement point, the next passes were homepage startup coordination,
ordinary transition capture/render cost, and the service page template. Those
passes are now complete; see the handoff for the current next lever. Safari and
physical-device smoothness still require review; this pass used local Chrome.
