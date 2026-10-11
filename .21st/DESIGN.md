# Konaverse design context

The v4 source of truth is src/styles/tokens.css. The global stylesheet also contains retired v3 values; do not use its sage palette or serif typography for v4 work.

Use Manrope, the monochrome neutral ramp, and semantic surface, text, focus, shadow and radius tokens. Light and dark surfaces are polarities of the same system. Existing components live in src/components/v4.

## Homepage entrance

On 10 October 2026 the user requested that the homepage hero entrance run only on the first homepage visit in each browsing session. Return visits through navigation, history, or refresh show the settled hero immediately. A fresh session enables the entrance again. Preserve the ongoing desktop headline walk, looping video, and scroll fold.

## Performance work

The user requested sequential local performance passes while preserving the existing visuals and motion. Ordinary page links retain the authored rise, tilt, scale, dim, seam and one-second curve. Their outgoing page is a frozen, bounded copy; incoming decorative and scroll work waits for landing. The navigation menu retains its separate choreography. Do not push these changes until the passes have been reviewed together.

The individual service templates retain their layout and scroll choreography. Their 132 breathing rays share one raster surface with the original SVG fallback; preserve the rounded ray geometry, individual durations, negative delays, ease-in-out breathing and 90-second rotation. Scroll drivers wake for input and finish their existing glide, with all active section positions read before transforms are written. Distant invitation resources and text splitting wait until nearby. Desktop and mobile Web Design geometry and settled transforms must match the saved baseline.

The reviewed passes and subsequent first-load pass were authorized for local commits on 10 October 2026. The first-load pass reduces the cursor catalog and prepares the original shaders asynchronously; its rendering and motion regressions passed. The user put further performance work on hold and will start a chat for another purpose. Do not resume it unless requested. No push or deployment is authorized. See docs/performance-handoff.md and docs/design/first-load/README.md for the committed scope, measurements and remaining cold-load costs. Physical-device/Safari review remains outstanding.

## Calendly booking

The user requested Calendly already loaded before opening Contact or a booking modal. One persistent iframe preloads on site entry and serves both views without changing its src, reparenting or restarting it. Preserve the original Contact card geometry, anchored modal dimensions and entrance/exit motion. The frame follows page/menu transforms and sleeps at rest. Selected dates remain across route returns and closes. A fresh session still needs the initial external download; subsequent SPA openings reuse the ready frame. Startup profiling must include this intentional preload and retain booking readiness.

## Hub content decision

On 9 October 2026 the user rejected the added overview panels, blog introduction and article excerpts and requested their removal. Preserve the original work, services and blog layouts, including the single-screen work gallery and services carousel. Do not reintroduce these additions.

## Mobile homepage services

The user selected image-led cards on 9 October 2026. Use distinct rounded cards with photos first, existing titles and descriptions, and expandable includes on mobile. Desktop services keep their sheets and row links. This choice applies to the homepage services section, not the services hub or projects.

## Mobile homepage projects

The user selected the open gallery on 9 October 2026 after exploring alternatives. All four projects share one vertical column with the same width and left edge. Keep the SELECTED WORK marquee, show each project name above its screenshot and its service below, and link the whole entry to the case study. Use a curtain reveal, settling image zoom and staggered text entrance once per project. Keep imagery uncropped at rest and fully visible with reduced motion or no JavaScript. Reuse WorkList's responsive markup, v4 tokens and GSAP motion helpers; desktop retains its hover list. This choice applies only to the homepage.

## Services artwork

The user subsequently requested restoring the six realistic service photographs. Share those originals between the homepage and services hub through src/lib/service-photos.ts. Preserve their colors, existing frames, mobile card interactions and hub carousel behavior.

## Homepage blog navigation

On 11 October 2026 the user requested circular previous/next arrows at the top right above the homepage blog cards. Advance one card per click and align each active card to the same left edge, fully clipping the preceding card. Include enough trailing space to align the final card too. Keep the existing card imagery, titles, details and server-rendered links. Use the services carousel's arrow shapes and circular-control proportions with v4 role tokens. Preserve native touch/trackpad scrolling, keyboard navigation, disabled end controls and immediate movement with reduced motion. On mobile the clipping edge aligns with the page inset.
