# Launch plan — the one-page launch of v4

Written 2026-08-25 from the user's brief. The homepage is DONE (sign-off
2026-08-24); what follows is everything between "done" and "live". Five
items, ordered by what unblocks what. `docs/homepage-choreography.md` stays
the binding spec for the sections themselves; this doc is the runway.

Branch: `redesign/v4`. Judge motion on prod builds only
(`node node_modules/next/dist/bin/next build && ... start` — the npm shim is
broken in the agent shell).

---

## The order, and why

| # | Item | Why here | Launch-gate? |
|---|------|----------|--------------|
| 1 | **One-page wiring** — anchors, redirects, link removal, sitemap, hide protos | Smallest, unblocks launch outright, and it takes the nav→transition conflict OFF the launch path (every menu click becomes an in-page scroll, no route change) | yes |
| 2 | **Proportional desktop scaling** ("the digital picture") | Touches every unit in ~4,200 lines of CSS plus JS px constants. Done BEFORE the mobile pass so mobile re-touches final desktop rules, not rules about to change. Scoped to the desktop branch (≥ 57.5rem) so it cannot disturb mobile | yes — ultrawide is the user's stated failure |
| 3 | **Mobile + tablet, perfect and smoother** | Most visitors; measurement-heavy; needs the user's real phone for touch feel (headless can't feel it, and the automation tab is throttled to 0fps) | yes |
| 4 | **Projects — real data + video loops** | Images are already in (2026-08-25); the loops and the years/copy are gated on the user's assets and confirmation. Runs in PARALLEL with 2–3: user gathers, we wire | yes (data), video can trail |
| 5 | **Open aperture + exoape transition** | Only bites once a second route exists. Design is decided (below) so it is build work, not research | no — post-launch, before the first inner page ships |

---

## 1 · One-page wiring — DONE 2026-08-25

Built as specified below, with two things learned on the way:
- **Config redirects run BEFORE `public/` and match case-insensitively.** A bare
  `/work/:path*` swallowed `public/work/tzankatian.webp`, and `/about/:path*`
  would swallow `public/About/KonaLogoNoBg.png`. The sub-path pattern is
  `/:path([^.]+)*` — any segment with a dot falls through to the file.
- In-page scroll lives in `SmoothScroll.tsx` as ONE delegated handler
  (`lenis.scrollTo`, 1.4s), so the menu, nav, footer and buttons all get it;
  a link to the page itself eases to the top. Verified headless: every anchor
  lands at `top: 0`. Constants in `src/lib/site.ts` (`CALENDLY_URL` is a
  placeholder until the user supplies the real link).

**Goal:** `/` is the whole site. Nothing on it leaves the page except the
three live project sites, socials, mailto, and legal.

- **Section ids** on the existing sections: `#studio` (§2 claim), `#services`
  (§4), `#work` (§5), `#contact` (§9 invitation). `#pricing` and `#journal`
  have no section → those menu rows are DROPPED for launch (not linked to
  nothing).
- **Aperture menu** items → anchors. Click = close the aperture, then
  `lenis.scrollTo(target)` — Lenis owns the scroll, `window.scrollTo` fights
  it. Pinned sections (§5 page-turn) have a real top, so the anchor lands on
  the pin's start, which is the right frame.
- **Nav Contact + Invitation Button + HeroPortrait CTA** → `#contact`.
  DECISION for the user: the legacy `/contact` form (Resend, `api/contact`)
  still works but wears the OLD dark chrome next to the new homepage. Recommend
  redirecting it too and letting §9's mailto + socials carry leads until the
  v4 contact page exists. If a form is non-negotiable for launch, we keep
  `/contact` live and it is the ONE legacy page that survives.
- **Remove:** `ServiceCards` `/services#slug` links (cards become non-links;
  keep hover), the `hm-workfoot` "All projects" band (and its CSS), §5's
  `href` stays (live sites, external). Footer link list → the same anchors;
  legal links stay.
- **Redirects** in `next.config.ts` `redirects()`, ALL `permanent: false`
  (307 — a 308 gets cached by browsers and crawlers and the real pages would
  inherit it): `/services`, `/projects`, `/work`, `/work/:path*`, `/about`,
  `/pricing`, `/blog`, `/blog/:path*`, and (pending the decision) `/contact`
  → `/`. Config redirects run before the filesystem, so the legacy `(site)`
  pages need no edits. Proto routes (`/design-system`, `/hero-object`,
  `/object-scrub`, `/proto-*`) → `/` in production only (`NODE_ENV` gate)
  so they stay usable in dev.
- **SEO** (`konaverse-seo-master-plan.md` D5 binds): `sitemap.ts` → `/` +
  legal only; `V4_ROUTES` in `PageTransition.tsx` trimmed to `/`; view-source
  + JS-off acceptance on `/` (anchors must work without JS — they do, they
  are plain `href="#id"`).

## 2 · Proportional desktop scaling — "the digital picture"

**The user's rule:** on any desktop, the page is the SAME picture; a bigger
monitor shows it bigger. No caps, no max-widths, nothing "closing to the
centre" past a point.

**Mechanism:** one root rule, scoped to the desktop branch:

```
@media (min-width: 57.5rem) { html { font-size: calc(16 * 100vw / 1534); } }
```

(1534 = the user's laptop, the reference frame the page was designed on.)
Then everything that is "the picture" is expressed in `rem`, and the whole
page scales with the viewport width — 16px at 1534, 35.9px at 3440, 13.4px
at 1280. Media queries in `rem` are NOT affected (they resolve against the
initial 16px, by spec), so the 57.5rem breakpoint holds.

**The work is the unit audit** — this is where the days go:
- `clamp()` type + spacing tokens (`--t-*`, `--page-pad`, `--section-y`) →
  plain `rem`; the caps are the bug.
- `max-width`s / `--measure` → `rem` (they then scale) — no `ch`/`px` walls.
- 214 raw `px` values across `home.css` + `tokens.css`: hairlines (1px
  rules, 1px inset catches) STAY px — a 2.2px hairline at 3440 reads wrong;
  everything else → `rem`. Borders/radii: `--r-lg: 24px` → rem (a 24px
  radius on a 2× card is a different shape).
- `vw`/`vh` values: `vw` is already proportional (keep); `svh`-based sizes
  (80 in home.css) are the aspect-ratio trap — see below.
- JS px constants in `src/components/v4/*.tsx` (54 hits — nav free zone
  160px, `REVEAL.shift`, parallax px/vh, hero comp `em` boxes, matrix3d
  corner reach, aperture `vmax`): each becomes `× rootFontSize/16` or a
  `vw`/`vh` fraction. The WebGL canvases (peel, fluid, aurora) render at
  device px and are untouched.
- `.au` and footer sizing live in tokens.css (route-scoped CSS 2×2'd the
  canvas) — same audit, same file.

**The one thing the rule cannot give you, said now:** the picture is
identical only when the ASPECT RATIO matches. 1534×864 is 16:9; a 3440×1440
ultrawide is 21:9 — scaled by width, it shows ~25% LESS height relative to
the type. Every `100svh` section (hero pin, §3, §5 sheets, footer 120svh)
therefore has less headroom for bigger content. Decision: `vw` is the master
unit for everything that IS the picture; `vh` is kept ONLY for "fill the
screen" pins. Then audit every section at 3440×1440 AND 2560×1440 for
overflow/clipping inside the pins, and give the ones that clip a `vw`-based
minimum height (the page gets a little longer on 21:9, nothing crops).

**Assets at 3440:** §5's captures are 1440×1000@2x = 2880 wide → 1.19×
upscale at 3440, soft text in the screenshots. Recapture at 1720@2x (3440)
before launch — the recipe is the `tools/shot.js` sibling. Bosra plate is
3736 wide (fine); hero portrait to check.

**Assumption (flag):** pure proportionality all the way down the desktop
range. At 1024 wide (tablet landscape) root = 10.7px → 11px body. If that
reads too small in practice, a floor is ONE line
(`max(12px, calc(...))`) — the user's call after seeing it.

**Proof:** `tools/shot.js` at 1280 / 1534 / 1920 / 2560 / 3440, same scroll
offset expressed in `vh`; the five stills should overlay as one picture at
five sizes.

## 3 · Mobile + tablet — perfect, and smoother

Below 57.5rem the page is a different composition (no peel, no paper
entrance, one-column scatter in §3), so this is a section-by-section walk at
three widths — **390 (phone), 768 (tablet portrait), 1024 (tablet landscape,
which currently falls in the DESKTOP branch — decide whether it should)** —
against the choreography doc, then the same walk on the user's real phone.

Per section: composition/crop, type measure and line counts (§3's collision
check re-runs — its mobile gaps are the ONLY lever), tap targets, the video
loops (`playsInline muted`, gated to the visible layer — 1 video free, 6 =
33ms), the fluid cursor OFF on touch, the aperture origin on the burger at
mobile scale, `svh` (not `vh`) everywhere the URL bar moves.

**Smoothness:** Lenis is `{ lerp: 0.1, smoothWheel: true }` — it does NOT
smooth touch by default (native touch scroll is the right baseline on iOS;
`syncTouch` is the option to TEST, not assume). The real levers are frame
cost: what paints per frame on mobile (grain layer, scrub work, pinned
sections' transforms) — measure with the Chrome trace on a device, prod
build, same method that took §4 from 33ms to 16.7ms. Reduced motion path
verified once.

**Verification:** headless stills for layout; the browser-automation tab is
throttled to 0fps so motion is judged on the user's device or via
`tools/record-transition.js`.

## 4 · Projects — real data + video loops

- The three captures are IN (`public/work/tzankatian|lossantos|lumiere.webp`,
  2026-08-25). Recapture at 3440 per §2.
- **From the user:** years for Tzankatian (2025?) and Los Santos (2024?) —
  provisional in `page.tsx`; the one-line description per project; the
  per-project VIDEO LOOP for the mini stacked window (short, muted, ≤ 5s,
  ideally the user's own screen recording of each site — or we record them
  with `tools/record-transition.js` and encode).
- **Wire:** `SheetProject` gains `video?: string`; the mini window plays ONLY
  the visible sheet's loop (the §4 measurement is the law); poster = the
  image. `/work` is redirected for launch, so only the three featured matter.

## 5 · Open aperture + exoape transition (post-launch)

**The problem:** the aperture (`ApertureMenu`) sits at z50 above BOTH pages
and its close animation (clip-path reverse at 1.6×, plus blur filters on
every row) runs concurrently with the 1s page move. Two heavy animations,
one on top of the other, one of them painting over the page it triggered.

**The design — the open menu becomes part of the outgoing page:**
1. On a menu-row click, the menu does NOT close. `PageTransition.go()` sees
   the aperture is open and clones the overlay INTO the ghost (the ghost
   already clones the view; the overlay is its sibling, so it is appended
   to the ghost explicitly), flattened to a still exactly like the
   `.k-reveal`s: `clip-path: none`, filters `none`, final-state opacity.
   The clone is inside the ghost's fixed, viewport-sized clip window, so
   `position: fixed` resolves against the transformed ghost — correct.
2. The LIVE overlay is hard-reset in the same tick: timeline killed,
   `visibility: hidden`, `openRef=false`, burger `aria-expanded=false`, no
   animation. Nothing is on top of the pages any more.
3. The incoming page arrives OVER the ghost-with-menu, which drifts up-left
   and dims as one flat picture — the menu leaves WITH the page it was on,
   which is what exoape does (Vue keeps both pages mounted; we fake it with
   the ghost, so the menu just needs to be in the ghost).
4. Lenis is already stopped for the transition; the menu's own scroll lock
   must not double-stop or double-start it.

Frame cost drops because the menu's close never runs at all — the ghost is
one flat layer. Verify with `tools/record-transition.js`
(`MSYS_NO_PATHCONV=1`).

---

## Decisions (user, 2026-08-25)

1. `/contact` REDIRECTS to `/` like the rest. The footer gets a **Contact link that opens
   Calendly** — interested visitors book a meeting directly. (The Calendly URL is one
   constant, `CALENDLY_URL`; the invitation's button uses the same link.)
2. Tablet landscape (1024) takes the scaled desktop branch as-is. Accepted.
3. Project years / one-liners / loops: handled when we get to step 4, not before.
4. Pricing and Journal rows are DROPPED for launch (menu and footer).
