# Pre-design checklist

Everything that has to land **before section design starts**. Section design means
building sections 2–9 of the homepage against `homepage-choreography.md`; the point of
this list is that none of it should be discovered halfway through that.

Status as of the last commit: buttons (interaction **rebuilt** — see §1), arrow links, cards,
reveal, aperture menu, Lenis, the fluid cursor and **the page transition** are all **built**.
What remains unbuilt is the form input and the footer (§6), and what remains *unjudged* is
anything that has only ever been watched in a throttled tab — the card entrance (4.2) and now
the arc itself (5.6).

**Cards are parked, not cancelled** (decided 2026-08-16): B1 needs real recordings, so the
work went to the transition instead. Everything in §4 resumes the moment assets land.

Each item says what *done* looks like, so it can be checked rather than argued about.

---

## 0. The two hard blockers

**B1 · No video or poster assets.** The project card is wired for both and has neither, so
its main move — the screen recording on hover — has never run against real material. This
also leaves the page in breach of its own argument, that client work supplies the only
colour. *Done when:* three recordings + three posters exist at the spec in §4.

~~**B2 · Only one v4 page exists**~~ **CLEARED 2026-08-16.** `/work` exists at
`app/(v4)/work/` — a stub, but a real route rather than a throwaway, since `/work` is one of
the seven URLs the homepage is specified to link to. It is `noindex` until it holds real work,
and its cards carry no media because that is still B1.

Neither is a design decision. Both are inputs.

---

## 1. Buttons — interaction REBUILT

The proximity lean and the `scaleY` fill are **gone**. Rejected as "not subtle, not premium",
and the diagnosis was that the button ran three simultaneous ideas — lean, fill, roll — of
which the loudest carried no information.

Built now: **the drawn edge** — two heads leave the point where the pointer crossed the border,
travel in opposite directions and meet at the far side, at constant speed derived from the
perimeter — plus the per-letter roll, retained. Rationale and mechanics in `components.md`.

**Rest state is an `--ice-deep` fill inside a 3px white border, and the fill does not change on
hover.** An inversion beat was built and cut. The white border is the *gap*: it reads as page
on white, so at rest the button is a plain ice-deep pill, and on hover the line is drawn
**outside** the border box so that band of white holds it off the fill. The line is `--ice-deep`
at 2px, since with no colour change behind it, it carries the hover state alone.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| ~~1.1~~ | ~~**Touch behaviour of the hover state**~~ | **Done, and now mostly moot.** The roll's `:hover` rules sit inside `@media (hover: hover)` and `:focus-visible` is written separately outside it, so keyboard users on touch devices keep the state. With the fill no longer changing there is nothing left that *could* stick: touch gets the `:active` press and no draw. | ✅ Still worth one pass on a real device alongside 6.3. |
| ~~1.2~~ | ~~**The second label is desktop-only**~~ | **Done.** The rule is written in `components.md`: `hoverLabel` may only ever restate, never inform. (It was briefly *load-bearing* too, under the inversion that has since been cut — with a static fill the roll is a plain label swap again.) | ✅ Rule written. Applies when 1.6 is chosen. |
| 1.3 | **Size variants** | Only one size exists. A hero CTA and a footer link cannot be the same size, and inventing sizes mid-section-build is how a system drifts. | At minimum a default and a large, both defined in `tokens.css`. Note the draw is already size-independent — constant speed means a larger button just takes proportionally longer. |
| 1.4 | **Disabled + submitting states** | `/contact` posts to the Resend route. A form button with no pending state will get double-submitted. | Both states defined, with the roll **and the draw** suppressed while pending. |
| ~~1.5~~ | ~~**Proximity vs the cursor**~~ | **Closed by deletion.** The lean is gone, so nothing but the fluid answers raw pointer movement. The button now answers a *crossing*, which is a different event. | ✅ |
| 1.6 | **Real CTA copy** | Placeholder pairs (“Start a project” / “Let’s talk”) are stand-ins. | Final pairs chosen for every CTA on the site. |
| 1.7 | **The draw's speed and weight** | First real look produced four fixes: the line was **pinned by its top-left**, so measurement error pooled at the bottom and the white band read thinner there (now centred, and measured fractionally); the per-letter split **collapsed every space** to zero width; the label lines were **flex-start against a longer sizer**, so the shorter one sat off-centre; and the draw was **too fast** (`SPEED` 1.0 → 0.62, ~440ms → ~710ms, with the roll decoupled onto `--d-base` so it no longer drags along with it). The levers are `SPEED` (duration), `LINE_W` (weight) and `PAD` in `Button.tsx`, plus `--k-btn-bw` in `tokens.css` for how much white sits between fill and line. | Re-watched after these. |
| 1.8 | **The line hangs outside the button box** | The SVG extends 8px past the border box on every side. It is `pointer-events: none` so it cannot block clicks, but any ancestor with `overflow: hidden` will clip the line, and tightly packed buttons could have their lines meet. | Checked once buttons appear in real sections, not just the gallery. |

---

## 2. Arrow links

**Rebuilt.** At rest it is a **plain line** — not an arrow, not a chevron — claiming nothing
about where the link goes. On hover the head grows out of the shaft's own tip, and *which*
arrow it becomes is the point: **east for internal, north-east only for external** (an
`external` prop). Label still shifts to `--text-accent`.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| ~~2.1~~ | ~~**↗ already means "external link"**~~ | **Decided: respect the convention, don't override it.** ↗ now appears only on links that genuinely leave the site; internal links resolve to →, which means forward/next/still here. This also gives the rest state a job — the icon stays neutral until you are about to act on it, then tells you what kind of destination it is at the moment that matters. Touch shows the resolved arrow permanently, since there is no hover and a bare line would never resolve into anything meaningful. | ✅ External marker exists and is genuinely different. |
| 2.2 | **Inline-in-paragraph variant** | The current one is a standalone block. Body copy will need an inline version and its underline will collide with the drawn rule. | An inline variant exists, or a rule saying arrow links never appear inline. |
| 2.3 | **On `--surface-raised`** | The ice rule is 2.52:1 on white and lower on mist. Alternating sections are part of the system. The icon itself is `currentColor`, so it is unaffected — this is only about the drawn rule. | Checked on mist; adjusted or ruled out. |
| 2.4 | **`external` has to actually get used** | The prop controls the marker only; target and rel stay the caller's business. It is worth nothing if call sites forget it, and a missed one is worse than the old blanket ↗ because the distinction now carries meaning. | Every off-site link in the real pages passes `external`. |

---

## 3. Cursor — fluid BUILT, working, open for improvement

`src/components/v4/FluidCursor.tsx` + `src/components/v4/fluid/`. Signed off as the right
direction — *"the cursor is good but we can improve it."*

**3.1 Scope — decided: the fluid, and only the fluid.** Ported from `giats-portfolio`
(`src/components/v4/fluid/` + `FluidCursor.tsx`), a full Navier-Stokes solver in GLSL.
**The refracting lens has been removed** — component and CSS both, recoverable from git
history. Two pointer-followers was one too many, and the lens turned out to be actively
harmful: its `backdrop-filter` layer sat at `z-60`, directly above the fluid at `z-55`, and
re-rasterised the backdrop over it. Removing it is what made the fluid visible at all.
**3.2 Native cursor — decided: never hidden.** The fluid augments it. Hiding the system
cursor costs text-selection affordance and is a real accessibility regression for a purely
decorative gain.
**3.3 Touch + reduced motion — done.** The component bails before creating a WebGL context.
**3.4 Palette — done.** Three brand colours, not one. Density ramps white → `--ice` →
`--ice-deep` for depth; speed mixes `--graphite` through it for smoke. The neutral is what
stops a single blue ramp reading as a gradient sticker.

| # | Still open | Why it matters | Done when |
|---|---|---|---|
| 3.5 | **Frame budget, unmeasured** | A fluid sim ping-ponging float framebuffers every frame, plus a full-viewport `multiply` composite. Never measured — every test ran in a throttled background tab at 0fps. | Watched at speed in a foreground tab, on the work section with three cards playing. |
| 3.6 | **Intensity and solver tuning** | Raised once for visibility, then **retuned for persistence**: `intensity` 30 → **55**, `densityDissipation` 0.982 → **0.95**, plus a new **`uFade` floor (0.08)** on the density curve. `dpr [0.5, 1]`, `radius` 0.19, `dyeRes` 512 and the `pow(0.70)` wisp lift are unchanged. `curl` and `pressure` are still the source project's, tuned against a **dark** page. All three knobs are now props on `FluidCursor` (`intensity` / `fade` / `decay`), so tuning no longer means editing the shader. | Judged in motion on white. |
| ~~3.7~~ | ~~**Fluid vs proximity buttons**~~ (was 1.5) | **Closed by deletion.** The proximity lean is gone (§1), so the fluid is the only thing answering raw pointer movement. The button's draw answers a *crossing* instead, which is a distinct event and does not compete. | ✅ |
| 3.8 | **WebGL context cost on every page** | One context per page load, plus float framebuffers. Fine on a desktop; worth knowing on low-end hardware. | Checked, and a kill-switch decided if needed. |
| 3.9 | **"Good, but we can improve it"** | **The first specific note came in: the trail stayed visible far too long, and explicitly *not* that it was too strong.** Fixed in 3.6 — the diagnosis was that presence and persistence were the same knob, since every lever for a stronger trail also made it last longer. The `uFade` floor is what separates them. Still open, and now the candidates are narrower: the graphite/smoke balance, splat radius, whether the trail should respond to *what* it is over (the `data-lens` hint API was written for the lens and is now unused), and whether it should fade near body copy the way the choreography asks the lens to. | The next specific note. |

---

## 4. Cards

Built: frameless redesign, poster→video cross-fade on hover, video mounted only on first
hover, stretch-and-recover entrance.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| 4.1 | **Assets** (= blocker B1) | — | Three recordings: **muted, no audio track, 8–12s seamless loop, 1600px wide, MP4 (h.264) + WebM, target ≤2MB each**, plus a poster still per card as WebP at the same dimensions. |
| 4.2 | **The entrance has never been seen play** | Every test so far ran in a throttled background tab where Chrome delivers zero frames, so GSAP froze the timeline mid-tween. The animation is *built and verified as wiring*, but its actual feel is unjudged. | Watched in a real foreground tab, at speed, and either signed off or retimed. |
| 4.3 | **Mobile has no hover, so the video never plays** | On phones the card is a static poster — the main move is simply absent for what will be most traffic. | Decided: autoplay on intersection, tap-to-play, or poster-only by design. |
| 4.4 | **`onFocus` plays the video** | Keyboard tabbing through the work section will start three videos in sequence. May be right, may be startling. | Confirmed by keyboard walkthrough. |
| 4.5 | **Aspect ratio** | Currently 16:10. Website screenshots are usually taller. | Confirmed against the real recordings. |
| 4.6 | **Poster loading vs LCP** | Architecture §7 names Core Web Vitals as the live risk. Posters are the heaviest thing above the fold on the work section. | Posters lazy below the fold, eager only if one is the LCP element. |
| 4.7 | **2-up or 3-up** | Open question from `homepage-choreography.md` §5 — depends on how strong the images are, which cannot be judged without 4.1. | Chosen once real assets exist. |

---

## 5. Exoape page transition — BUILT

`src/components/v4/PageTransition.tsx`, mounted once in `app/(v4)/layout.tsx`; styles under
`k-pt` in `tokens.css`.

**Built twice.** The first attempt raised a blank white sheet in place of the incoming page,
on the claim that two live route trees needed the View Transitions API. It was rejected on
sight and the claim was wrong: a blank sheet has no outgoing page to tilt and nothing to
darken, so it cannot express the move at all. `homepage-choreography.md` has the withdrawal.

**The second attempt was measured, not designed.** `page transition.mp4` was decomposed
frame by frame — the incoming page's top edge tracked per column by max-gradient with a
robust line fit, the outgoing page's drift recovered by ZNCC patch matching, its darkening
read as a luminance ratio. Everything below is that measurement:

| | spec said | measured, and now built |
|---|---|---|
| duration | `--d-cinema` 1.4s | measured ~0.68s → **1s, user-tuned** (`--d-page`) |
| easing | `--e-arc` | measured `--e-page` → **`--e-arc`, user-chosen** — the spec's original call, restored by feel (see the fourth pass below) |
| **layering** | not stated | **incoming rides OVER the outgoing and buries it** |
| incoming | "rises from beneath" | full viewport, tilt **+2.2° → 0**, left top corner high |
| outgoing | "tilts away on a circular path" | up **~31%**, left **~5%**, rotating to **−2.2°** |
| the lens | "distorts as it leaves" | **a darkening, not a lens** — to ~0.42 luminance on their dark pages; scaled to **0.18 black** on Whiteout, because 50% black on a white page reads as concrete (judged on film, below). Reached **progressively on the motion's own curve**: fully visible at first frame, darkest as the page is buried |
| — | — | measured ~130ms lead → **no lead, user-chosen**: both sheets and the dim sit at position 0 of one timeline, one locked system |
| — | — | **both sheets breathe** (user-added): outgoing swells to 1.05 as it is buried, incoming arrives at 1.06 and settles to 1 |

`--e-arc` deserves its own line: fitted against the measured rise it is the **worst** of the
four easing tokens (rms 0.43 vs 0.02 for the fit). It is symmetric ease-in-out; the reference
is a brief ease-in into a long ease-out. `--e-page` was added rather than bending a token.

**Mechanism: a clone.** The App Router mounts one route tree, so the outgoing page is captured
with `cloneNode` into a fixed, viewport-sized clip window offset by the scroll position — the
"ghost" — and animated away while the real incoming page rises behind it. The ghost is
`inert` + `aria-hidden` (there are briefly two copies of every link) and is created on click,
removed on completion; nothing is mounted at rest. Only `.k-pt__view` is cloned, never the
chrome: the aperture menu, grain and fluid are its siblings and stay put, which is what the
reference does too.

**Third pass: watched, then fixed.** The 0fps-tab trap (5.6) was circumvented by recording the
move in **headless Chrome, where rAF runs** — `tools/record-transition.js` dumps a timestamped
frame sequence via CDP screencast, at real speed or slowed through the dev-only `window.__gsap`
handle. Watching found four defects the structural checks could not:

1. **The view was transparent.** The white lives on `.k-root`, which does not move, so the
   dimmed ghost showed *through* the incoming page for the whole ride — both pages
   superimposed in a grey wash. `.is-moving` now carries `background: var(--surface)`,
   plus a `::before` gradient ahead of its top edge: two white pages sliding over each
   other have no visible seam without a cast shadow.
2. **The ghost was parented to `body`,** outside `.k-root`, so the clone re-resolved against
   the legacy site's cascade and every heading went near-white mid-move. It now mounts
   inside `.k-root`, beside the view.
3. **The clip window moved instead of the page.** Sliding the viewport-sized ghost up exposed
   bare background under its bottom edge. Now the window is fixed and the full-height
   clone slides *inside* it, so the outgoing page's below-the-fold content rises into view
   — with `.is-in` forced on the clone's reveals so that content is not invisible.
4. **Parking ignored scroll.** `y: vh` only clears the fold at the top of the page; clicked
   1400px deep it left the old view on screen, covering the ghost, showing an unrevealed
   region as a blank page. Now `y: vh + scrollY`.

**Fourth pass: the feel, user-directed — and signed off ("it's absolutely perfect").** The
measurement reproduced exoape's timing; watched at speed it read as lag, not gesture. The
user called the changes and each outranks the measurement: **1s** on **`--e-arc`** (slow in,
fast middle, soft landing — the curve the choreography doc named before the measurement
overrode it; `--e-page` is kept in `motion-v4.ts` for the record), **no lead** (lockstep),
**progressive dim** on the same curve, **zoom both ways** (`OUT_SCALE` 1.05 / `IN_SCALE`
1.06→1), and the seam shadow fading in with the motion via a CSS variable
(`--k-pt-seam`) instead of popping at click. Two support fixes rode along: the clone's
reveal styles are **flattened inline** (a revealed element computes `filter: blur(0px)`,
which is still one compositing layer each — hundreds on a static picture), and **v4 hides
the native scrollbar** (`html:has(.k-root)`) — a classic Windows scrollbar takes layout
width, so its appearance mid-move shifted the whole page sideways ~17px. Gotcha for the
recording harness: the rAF backstop runs on wall-clock time, so it must divide by
`gsap.globalTimeline.timeScale()` or it jump-cuts slow-motion recordings mid-move.

**Navigation is intercepted by one delegated `click` listener on `document`**, not by a link
component. Every v4 component already renders a plain `<a href>`, so Button, ArrowLink and the
aperture menu all got the transition without a single call site changing. The listener is on
`document` rather than the wrapper specifically because the aperture menu — the primary
navigation — renders as a *sibling* of `PageTransition` in the layout, so its clicks never
bubble through the wrapper.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| ~~5.1~~ | ~~**A second v4 route**~~ (= B2) | — | ✅ `/work`. |
| ~~5.2~~ | ~~**View Transitions API vs manual**~~ | **Decided: manual, on GSAP — but the reason changed.** The first pass rejected VT on the grounds that it gives only coarse control over the overlap; that reasoning stands, but it was used to justify *not showing the outgoing page at all*, which was the actual mistake. Cloning gives full control over both layers with no experimental flag (VT is still behind `experimental.viewTransition` in Next 16 and wants React's experimental channel), and keeps JS and CSS motion on one curve via `CustomEase`. **Fallback path named:** reduced motion cuts instantly; with JS off nothing is intercepted, so every link is a plain anchor navigation. There is no state in which a link stops working. | ✅ |
| ~~5.3~~ | ~~**Scroll position on navigation**~~ | **Done.** `SmoothScroll` now exports `getLenis()` — a module-scoped handle on the live instance — and the transition calls `lenis.scrollTo(0, { immediate: true, force: true })` while the riser still covers the viewport, so the jump is never seen. Falls back to `window.scrollTo` because Lenis is *null* under reduced motion, where it is never constructed. | ✅ Verify by scrolling deep before navigating. |
| ~~5.4~~ | ~~**The legacy shutter must not apply**~~ | **Confirmed isolated.** The shutter is `app/(site)/template.tsx`, scoped to the `(site)` route group; v4 routes live in `(v4)`, so it cannot reach them. Belt and braces: links resolving *outside* `V4_ROUTES` are not intercepted at all, so v4 never animates into a legacy page. | ✅ Removed with the legacy site. |
| ~~5.5~~ | ~~**Reduced motion**~~ | **Done.** Checked in JS, not CSS — `tokens.css` collapses `--d-cinema` to 1ms but GSAP reads `DUR.cinema` from `motion-v4.ts`, which it does *not* collapse. So `go()` tests `prefers-reduced-motion` and calls `router.push` directly; the riser never mounts. | ✅ |
| ~~5.6~~ | ~~**Never watched at speed**~~ | **Watched — in headless Chrome, where rAF runs.** `tools/record-transition.js` films the move as a timestamped frame sequence (CDP screencast; slow-motion via `window.__gsap`). Both directions, from the top and from 1400px deep. The four defects it caught are logged above; what remains on screen matches the reference beat for beat. **The agent's *visible* tabs are still 0fps — this harness is the standing way around that for all motion work.** | ✅ Human pass on a real machine is still worth one sitting; the levers remain `TILT`, `OUT_RISE`, `OUT_DRIFT`, `OUT_DIM`, `DUR.page`, `EASE.page`. |
| ~~5.9~~ | ~~**The stagger is emergent, not authored**~~ | **Decided and done: hold everything until commit.** One timeline starts when the route commits — ghost at 0, view at +130ms — so the lead is a designed number at any network speed. The cost is a still frame between click and commit; the reference itself holds ~0.3s there (exoape also waits for the next page before anything moves), so this is fidelity, not a compromise. Prefetch-on-intent keeps the hold short in production. | ✅ |
| 5.10 | **View Transitions API — the real answer, deferred** | Exoape gets two live pages for free because Vue Router keeps both mounted; React's App Router does not, hence the clone. VT is the browser-native equivalent: it snapshots both pages, composites them on the **GPU**, and its default paint order is already new-above-old — the exact layering this move needs, with no clone, no scroll-offset arithmetic, no duplicate DOM, and no rasterisation cost for a full page copy. That GPU compositing is most of where "smooth" comes from. | Revisited when `viewTransition` leaves `experimental` in Next, or sooner if the clone shows jank on a real machine. The animation values port across unchanged — they are `@keyframes` on `::view-transition-old(root)` / `-new(root)` instead of GSAP tweens. |
| ~~5.8~~ | ~~**The reveal and the entrance overlap**~~ | **Judged on film: the overlap is the payoff, keep it.** Because the view is parked below the fold (transformed, and IO measures the *transformed* box), nothing above the fold intersects at mount. The hero's reveal fires mid-ride as it crosses into the viewport and finishes ~0.4s *after* the sheet lands — text still resolving from blur into a settled page, which is exactly the reference's layered entrance (its hero lines are still rising at frame 78 of 108). No observer-holding needed; the parking offset produces the choreography by construction. | ✅ |
| 5.7 | **`V4_ROUTES` is a hand-maintained list** | The interceptor only animates paths in that array. A new v4 route missing from it still works, it just navigates without the arc — a silent, easy-to-miss degradation. | Revisited when the legacy site goes and *every* route is v4, at which point the list can invert to a deny-list or disappear. |

---

## 6. Cross-cutting

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| ~~6.1~~ | ~~**`.k-root` and the `<noscript>` fallback live on one page only**~~ | **Done.** Both now live in **`app/(v4)/layout.tsx`**, along with the grain, the aperture menu, Lenis, the fluid cursor and the page transition — so a new v4 route is a `page.tsx` and nothing else. `(v4)` is a route group, so no URL changed: `/design-system` is still `/design-system`. Not the *root* layout, deliberately — that is shared with the legacy site, and `.k-root` on `body` would repaint it white. | ✅ Moves to `<body>` when legacy goes. |
| 6.2 | **The legacy cookie banner renders over v4 pages** | It is global in the root layout and still v3.1 dark. It covers the bottom-right of every v4 page. | Restyled to Whiteout, keeping the consent logic intact. |
| 6.3 | **Touch audit across every hover-only state** | 1.1 is the known case; card hover and arrow hover have the same shape of problem. | One pass over every `:hover` rule in `tokens.css`, each either guarded or deliberately left. |
| 6.4 | **Focus-visible audit** | The global ring is `2px solid var(--focus-ring)` at `3px` offset. It has not been checked against the pill button, the card, or the aperture rows. | Walked with a keyboard, every interactive element legible. |
| 6.5 | **Reduced motion — already largely handled** | The `:root` override collapses `--d-base/quick/slow/cinema` to 1ms and zeroes the reveal blur and shift, so every CSS transition using those tokens is covered without per-component blocks. **`--d-instant` is deliberately excluded** — colour is not motion. | No action; recorded so nobody "fixes" it later. |
| 6.6 | **Real copy** | Every string in the components is placeholder. | Final copy for nav, CTAs, service names, project captions. |

---

## 7. Still deferred, and not on this list

**All 3D** — the object, and homepage sections 1 and 6. Blocked on the prior question of how
Blender output actually reaches a browser (baked frames vs glTF vs video: three pipelines,
three budgets, and the choice reaches back into modelling). Sections 2, 3, 4, 5, 7, 8, 9 and
the footer do not touch 3D and are designable without it.

---

## 8. Suggested order

~~1. Unblock the inputs.~~ B2 cleared; **B1 is the only input still outstanding.**
~~2. Cursor.~~ ~~4. Page transition.~~ Both built.

What is left, in order:

1. **One foreground-tab sitting** — the single highest-value hour on this list. The arc
   (5.6), the card entrance (4.2) and the fluid's frame budget (3.5) are *all* blocked on the
   same thing: nothing has ever been watched at speed, because every test tab throttles to
   0fps. Three unknowns, one session, no code required to start.
2. **Record the three videos** (B1) — the last true input, and the only one that needs the
   camera rather than the keyboard.
3. **Cards** (§4) the moment those land.
4. **The audits** (§6.3 touch, §6.4 focus-visible) as one pass over everything, not
   per-component — and now including the transition's intercepted links.
5. **Form input and footer** (§6), the last two unbuilt components.
6. Then section design starts.

Item 1 gates the sign-off on three separate pieces of work, so it should not wait for item 2.
