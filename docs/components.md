# Konaverse — Components

Working doc for the component pass. The token file sets the *values*; this sets the
*behaviour*. Nothing here is signed off until it's built and looked at.

**The register: calm but fascinating.** Those pull in opposite directions, and the resolution
is the whole point — *calm* is the resting state, *fascinating* is what happens when you
touch it. So: nothing moves on its own, nothing announces itself, nothing bounces. But
everything answers, and the answer is more considered than you expected. A component that
does nothing on hover is dead. A component that does three things is a toy.

**One move per component.** If a hover does more than one legible thing, cut until it does one.

---

## 1. The reveal — reconciling refraction and the mask rise

This is the first real conflict between the locked system and the reference, and it needs
settling before any component gets built, because nearly every component uses it.

**The token file says:** *"Nothing fades. Everything resolves from a displaced blurred
state, `--reveal-blur` 14px to 0 and `--reveal-shift` 18px to 0 over `--d-slow` on
`--e-glass`. This is the signature and it never varies."*

**The aperture does something else:** type rises out of a hard crop. A parent with
`overflow: hidden`, the child going `yPercent: 112 → 0` (title) or `120 → 0` (row labels)
on `power3.out`, staggered 70ms. No blur. That's the reveal you pointed at.

These are two different signatures, and "it never varies" can't survive both.

### Recommendation — combine them, don't alternate

They're the same idea at different amplitudes. A mask rise *is* `--reveal-shift` taken past
100% with a crop edge added. So make the crop edge the variable, not the signature:

| Context | Reveal | Why |
|---|---|---|
| **Single-line display type** — h1/display headlines, the menu title, list-row labels, link labels | Rises out of a mask (`yPercent 110 → 0`) **and** resolves from blur (`14px → 0`) simultaneously | The crop edge turns the blur into *coming into focus as it clears the edge*, which is sharper and more deliberate than a blur alone |
| **Everything else** — paragraphs, multi-line body, images, cards, tiles | Pure refraction: `--reveal-shift 18px` + blur, exactly as the token file specifies | No natural crop edge exists, and inventing one round a paragraph looks like a mistake |

The rule that keeps it honest: **the mask is only ever added where a real edge already
exists.** Never wrap a box in `overflow: hidden` just to get the effect.

This keeps *"nothing fades, everything resolves"* literally true everywhere, gives display
type extra crispness, and — the part that matters — means the aperture menu and the page
are speaking the same language rather than two.

**Technical notes.** Blur clips at the mask edge, which is the effect we want, not a bug.
Animating `filter: blur()` is genuinely expensive: `will-change: filter, transform` on
revealing elements, and keep simultaneous blurred elements in the single digits. A 4–6 row
stagger is fine; a 20-item list is not — cap the stagger at four steps as the choreography
already requires.

---

## 2. Aperture — what we take and what we change

Source: `magnificent_sections/src/sections/navigation/menu-overlays/aperture`. Built for a
dental clinic, so the content is all wrong and the mechanics are all right.

### Take verbatim

- **The circle is born in the button.** Button centre measured *at click time*, both
  keyframes authored as same-format `circle()` strings in `vmax` so GSAP can interpolate
  them and the end state survives a resize. This is the detail that makes it feel like the
  button opened rather than an overlay appeared.
- **One reversible timeline.** Close is `reverse()` at 1.6×, so content can never desync
  from the circle, and re-opening mid-close resumes the live timeline instead of rebuilding
  (which would snap half-faded content back to its start).
- **Content enters while the circle is still travelling** — first beat at 30% of the
  expansion. Waiting for the circle to finish would read as two events instead of one.
- **Hover on inner elements, GSAP on outer wraps.** The chip scale and the chip hover never
  write the same element. Cheap rule, prevents a whole class of fighting-transform bugs.
- **No-JS renders the menu open**; JS's first act is to close it. Genuinely good — the menu
  is content, so it degrades to a visible sitemap rather than nothing.
- **`inert` on the page beneath** while open, so focus can't fall behind the overlay.

### Change

| # | Aperture as-built | Whiteout | Why |
|---|---|---|---|
| 1 | Chips scale in on `back.out(1.6)` | `--e-settle` | **Direct violation of a locked rule** — the token file bans back and bounce curves: *"they break the register."* This is the one place the reference and the system flatly contradict. The overshoot is also the least calm thing in the component. |
| 2 | Circle on `power2.inOut`, 1.1s | `--e-drift`, `--d-cinema` (1400ms) | `--e-drift` is the system's symmetric curve and is near-identical in feel; `--d-cinema` is what page transitions get, and a full-screen menu is that scale of event. Use `--e-arc` instead if you want it more dramatic — it's the exoape curve, slower to commit and faster through the middle. |
| 3 | Pale blue-gray gradient surfaces | `--surface` white page, `--surface-raised` mist menu | **RESOLVED — tested, no ring needed.** The worry was that a ~9-level white↔mist gap would leave the circle edge invisible. Frozen mid-sweep in the browser, it reads clearly, and the reason is instructive: **the edge is legible because it cuts across content.** Type sliced by the arc makes the boundary unmistakable in a way tonal contrast alone never had to. It is subtle over genuinely empty regions, which is acceptable — and the fix, if a page ever needs it, is a hairline-ring layer, not a heavier surface. |
| 4 | 2×2 grid of four European offices | One location line, Cyprus | Architecture §7 wants the location line for local SEO. Four fake offices would be a lie and the grid would look empty with one. |
| 5 | Rows link to four clinic services | The site map | Contact stays outside the burger entirely per the locked nav rule. |
| 6 | Giant cropped `IVORY` wordmark, marquee drift | `KONAVERSE`, marquee **off** | The drift is ambient motion on a system whose rule is that nothing moves on its own. Keep the crop — it's a strong device — drop the loop. |
| 7 | Helvetica-family fallback chain | Manrope via `--font-sans` | One family. |
| 8 | Trigger is a `Menu` pill, `border-radius: 10px` | Burger mark, `--r-full` | Locked: burger. See §3. |

### Watch

The section is written as a **self-contained 100svh demo** that renders the page beneath as
`children`. For real site use the overlay has to lift out of that wrapper into the app
layout, keeping the trigger and overlay in one positioning context so the click-time
measurement still resolves against the right origin. Straightforward, but it isn't a
copy-paste.

---

## 3. The component list

Ten, per the design system. Status is honest — most of these have a *default*, not a design.

All built components live in `src/styles/tokens.css` under the `k-` namespace and are
demonstrated in `docs/design-system.html`, which now **links the real token file** rather
than carrying a copy of it — so the reference cannot drift from the code.

| Component | Status | The one move |
|---|---|---|
| **Reveal** | **built** | §1. `.k-reveal` everywhere, `.k-mask > .k-reveal` for single-line display type. `.k-stagger` with `--i` per child, four steps max. |
| **Burger** | **built** | Two rules, not three — three reads generic. On hover the short rule extends to meet the long one: the aperture implied before it opens. |
| **Button · primary** | **rebuilt** | Rest is still (see below). Hover: the fill grows up from the bottom rule while the label **rolls letter by letter** and a second label rolls up behind it — same direction, same curve, one motion. Approach: **proximity lean**. |
| **Button · ghost** | **rebuilt** | Same mechanics, filling in `--accent-wash`. |
| **Arrow link** | **rebuilt** | The arrow is **drawn, not swapped**. Shaft and head are separate paths on one SVG; on hover both swing to a new axis so an east arrow becomes a north-east one — a real change of shape from transforms and a dash offset, no morphing library, never leaves the compositor. The label shifts to `--text-accent` because a 2.52:1 hairline can't carry a hover state alone. |
| **Project tile** | **rebuilt** | **No frame, no rounded box, no shadow** — the media *is* the card, type sits under it on the page. Hover plays a screen recording; entrance is the stretch-and-recover (below). |
| **List row** | **built** | Rows are **not** links, so no arrow chip, no row-wide cursor, and **no hover state at all** — that's the design, not an omission. Anything answering the cursor implies it can be clicked. The whole affordance sits on the single arrow link below the list. |
| **Section header** | done | Heading + body, no eyebrow. The restraint *is* the design. |
| **Hairline rule** | **built** | `.k-rule`, plus `.k-rule-draw` which scales from the left on `--d-slow` — a break that arrives rather than sits there. |
| **Aperture menu** | **built** | §2. `src/components/v4/ApertureMenu.tsx`. Circle born in the burger, measured at click time; one reversible timeline, close at 1.6×. |
| **Fluid cursor** | **built** | A Navier-Stokes fluid sim in GLSL, ported from `giats-portfolio`. Density ramps white → `--ice` → `--ice-deep`; speed mixes `--graphite` through as smoke. Composites with `multiply` over white — the source blends with `difference` over black, which inverts to muddy orange on a light page. Native cursor never hidden. Frame cost unmeasured — checklist §3.5. **The refracting lens was removed in its favour.** |
| **Form input** | not designed | `/contact` only — no form on the homepage. |
| **Footer** | not designed | Carries the full map; the only place every URL appears. |

### The namespace

Component and layout classes are prefixed `k-`; **the CSS variables are not**, because those
are what Figma mirrors and that contract is unchanged. The prefix is what makes the token
file safe to import globally — the names it shipped with (`.grid`, `.section`, `.card`,
`.page`, `.btn`, `.grain`) collided with 27 existing usages across 13 files.

### Why the buttons have no perpetual animation

You asked whether a forever-running border line was oversaturated. **Yes — and it also
breaks two rules already locked.**

1. *"Nothing moves on its own."* It's why the aperture's marquee was switched off. A button
   that animates while nobody is looking at it contradicts the same rule.
2. **The accent budget.** A continuously animated accent border spends the budget
   permanently, and the system's own words are that if the accent "starts showing up on
   every hover state it stops being a signal." Always-on is worse than every-hover.
3. It is, bluntly, the most over-used device on the web right now — the animated gradient
   outline is *the* AI-startup landing-page tell. Reaching for it undercuts a studio whose
   pitch is that it doesn't build templates.

**What replaces it: proximity.** The button leans a few pixels toward an approaching cursor
before it is ever hovered — capped at 6px, eased toward the target so leaving glides rather
than cuts. It is alive *only when a human is near it*, which is exactly the calm-but-
fascinating register, and it is far rarer than an animated border. Disabled under
`prefers-reduced-motion` and on touch (`hover: none`), where it would be dead code.

### The card entrance: stretch without bounce

The brief was slime — pulled from a corner so it stretches, then folding back into a strong
rectangle. **The literal reading conflicts with a locked rule**: an elastic settle is a back
or bounce curve, and the token file bans those outright ("they break the register").

Resolved by moving the deformation rather than dropping it. The card arrives skewed and
squashed (`scaleX 0.82 / scaleY 1.16`, `skewY 4°`) and *recovers* through a second
overshoot-shaped tween that is itself eased with `--e-settle`. Squash-and-stretch **during
travel**, resolving without an elastic curve. The deformation was always the part doing the
work; the bounce at the end was never what made it read as fluid.

### Accent budget — four, and it is full

The design system's rule: *"the accent appears at most four or five times on any page. If it
starts showing up on every hover state it stops being a signal."*

Building the set nearly broke that. Ice ended up in the hover state of the button, ghost
button, card, list row, burger **and** arrow link — literally every interactive component,
which is the exact failure the rule names. Two were cut:

- **Card border warming** — the tile already lifts and eases its image. A third move on one
  component, spending accent the tile hasn't earned when the image is the loudest thing on
  the page anyway.
- **List row hairline warming** — removed entirely, since the rows aren't links (above).

**The four that remain, each earning it:** the arrow link's drawn rule (the primary
navigation affordance, carrying every destination) · the button's iris in `--ice-deep` (the
primary CTA) · the burger's hover (it is the entire nav) · the cursor lens fringe (the
signature, always present).

**The budget is now full.** Any new accent use has to displace one of these four, not join them.

---

## 4. Where the v4 code lives

- `src/styles/tokens.css` — tokens + every `k-` component.
- `src/lib/motion-v4.ts` — the four token easings registered as GSAP `CustomEase` curves,
  plus durations. **This is the one place a token is written twice**: GSAP cannot read a
  `cubic-bezier()` string and there is no way to read a CSS custom property at module scope.
  The usual shortcut — reaching for `power3.out` and friends — quietly puts JS-driven motion
  on a different curve from CSS-driven motion, which is how a site ends up feeling
  incoherent. If a curve changes in `tokens.css` it must change here too.
- `src/components/v4/ApertureMenu.tsx` — the nav.
- `src/app/design-system/page.tsx` — preview route, `noindex`, outside `app/(site)`.
- `src/app/(site)/layout.tsx` — the legacy chrome, moved out of the root layout so v4 routes
  render clean. Route groups don't appear in URLs, so every legacy path is unchanged.

## 5. Open

1. Everything in `REDESIGN.md` §2 — chiefly the 3D deferral.
2. The aperture's **content** is placeholder-ish: `Index` as the title, one location line.
   Worth a pass once real copy exists.
3. `.k-root` currently sits on the preview page's wrapper. It moves onto `<body>` when the
   legacy site goes, and this note can be deleted with it.
