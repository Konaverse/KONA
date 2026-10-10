# Persistent Calendly preload

Reviewed local implementation, included in the consolidated performance commit. Nothing has been pushed or deployed. See [the current handoff](../../performance-handoff.md) for completion status and the next pass. Generated PNG and exploratory debug evidence remains local; reports and baseline/final validation JSON are committed.

The previous modal downloaded Calendly's widget script only after the first
click, then created a new iframe. Contact rendered its own iframe on every
route visit. The baseline measured 4.913 seconds on desktop and 5.323 seconds
on mobile from clicking the modal trigger to `calendly.event_type_viewed`.

The shared v4 layout now starts one eager iframe in server HTML. It preconnects
to Calendly and its asset origin, renders the frame behind the opaque site
until ready, then parks it offscreen. A fully hidden/offscreen frame did not
finish initialization in the browser check, so downloading the URL alone was
insufficient. Pixel comparisons verified the warm-up cannot paint over the site.

Contact renders a slot with its original geometry; the persistent frame follows
that slot, including the page/menu transforms and outgoing transition ghost.
The anchored modal uses that same iframe and its existing entrance/exit motion.
The frame is never reparented, recreated, or given a new src during navigation.
Selected dates survive navigation and closes. Position updates respond to input,
resize and navigation motion; they do not run an idle ticker.

Readiness checks validate both the sender window and Calendly origin. A small
server-rendered listener remembers a ready event that arrives before React
hydrates. The event is documented in [Calendly's parent-window events](https://developer.calendly.com/api-docs/overview/embedding/notifying-the-parent-window).
Contact retains its direct iframe with JavaScript disabled. Slow/blocked embeds
retain an external booking link. Cookie-policy wording now describes preloading
on site entry rather than loading only on Contact.

## Validation

- Production Next.js build and TypeScript passed (43 routes). One intermediate
  build hit a transient Turbopack Google-font resolver error; the unchanged
  build command passed on retry.
- ESLint passed for the affected components, helper, layout and policy.
- 21st review reported zero findings on both calendar components.
- `final/results.json`: desktop/mobile calendar ready before the modal click;
  one Calendly document request through initial opening, Contact entry, menu
  open/close, route departure/return and reduced-motion navigation. The original
  iframe node and contentWindow persisted. Selecting a day displayed available
  times; that selection survived route returns. No runtime errors.
- Contact-frame geometry matched its slot exactly at rest and after scrolling.
  Settled scaled-menu alignment differed by less than 0.016 pixels. Idle slot
  geometry reads were zero over the 1.1-second sample on both viewports.
- `cold/results.json`: direct desktop/mobile Contact entry loaded correctly and
  remembered the early readiness event; blocked-frame and no-JavaScript markup
  fallbacks passed. No runtime errors.
- `reopen/results.json`: two modal opens/closes from Contact on each viewport
  preserved the ready frame and correct modal width, with only one initial
  Calendly document request.
- Existing `profile-page-transitions.cjs check-navigation` checks passed on
  desktop/mobile: rapid links, interrupted history, hash landing, separate menu
  choreography and reduced motion.

Commands, with the final production preview at `http://127.0.0.1:3008`:

```powershell
node tools/check-calendly.cjs final http://127.0.0.1:3008
node tools/check-calendly.cjs cold http://127.0.0.1:3008
node tools/check-calendly.cjs reopen http://127.0.0.1:3008
node tools/profile-page-transitions.cjs check-navigation http://127.0.0.1:3008
```

## Scope and timing limit

This moves Calendly's one-time network and initialization work to site entry;
it does not remove Calendly's own scripts, availability requests or startup cost.
The initial response varied substantially across local runs, so these checks
establish reuse and readiness rather than a guaranteed cold-load duration.
Entering Contact directly in a fresh tab, reloading the site, or opening a
booking before the initial preload finishes can still show a wait. Subsequent
SPA Contact visits and modal openings reuse the ready calendar. No booking was
submitted during validation. Remaining site cold-start profiling should include
this new, intentional Calendly preload.
