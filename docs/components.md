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
| **Arrow link** | **rebuilt** | **At rest it is a line**, claiming nothing about the destination. On hover the head **grows out of the shaft's own tip** — scaling from the vertex, which for straight barbs is the same picture as drawing each one outward — and the whole arrow **steps forward along its own axis**. **East for internal, north-east only for external** (see below). Touch shows the resolved arrow permanently. The label shifts to `--text-accent`: shape plus colour beats shape alone at 16px. |
| **Project tile** | **rebuilt** | **No frame, no rounded box, no shadow** — the media *is* the card, type sits under it on the page. Hover plays a screen recording; entrance is the stretch-and-recover (below). |
| **List row** | **built** | Rows are **not** links, so no arrow chip, no row-wide cursor, and **no hover state at all** — that's the design, not an omission. Anything answering the cursor implies it can be clicked. The whole affordance sits on the single arrow link below the list. |
| **Section header** | done | Heading + body, no eyebrow. The restraint *is* the design. |
| **Hairline rule** | **built** | `.k-rule`, plus `.k-rule-draw` which scales from the left on `--d-slow` — a break that arrives rather than sits there. |
| **Aperture menu** | **built · mobile only** | §2. `src/components/v4/ApertureMenu.tsx`. Circle born in the burger, measured at click time; one reversible timeline, close at 1.6×. **Below 57.5rem only since 2026-08-16** — its overlay closed back over the page transition and made it unwatchable. See the amendment in `homepage-choreography.md`. |
| **Horizontal nav** | **built** | Desktop navigation, in the same component. Brand left, five links plus Contact right, `--text-muted` resolving to `--text`; the current page says so with `aria-current` and full ink, no underline or dot. Exact CSS complement of the burger: one is displayed at every width. |
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

**The proximity lean that replaced it has since been cut too.** It leaned a few pixels toward
an approaching cursor, which sounds alive and tested badly: it moved *because a cursor was
near*, information the person moving the cursor already had, and it answered the same pointer
movement as the fluid — two things reacting to one input read as noise, not as one response.

### What the button does instead: the edge answers where you arrived

Three properties separate a premium hover from a cheap one, and they are worth naming because
they decide every future component too:

- **Precision over amplitude.** Premium is not *small*, it is *exact*. Defined start, defined
  end, no overshoot — which `--e-settle` already gives us.
- **Causality.** The motion is caused by *you specifically* and carries something about your
  input. A generic animation plays identically every time; a premium one is a response. This
  is the largest lever and the cheapest to get wrong.
- **One gesture, not three.** The old button ran a proximity lean, a `scaleY` fill and a
  letter roll simultaneously. Any one of those is defensible. Together they are the reason it
  read cheap — more than any single one of them was.

**Beat 1 — the line.** Where the pointer crosses the edge, two heads leave that exact point in
opposite directions, travel the perimeter and meet at the far side. The button's own hairline
is the *track*; the ice line is drawn over it, so an existing edge lights up rather than a
border materialising out of nothing. Keyboard focus has no entry point, so it draws from
bottom centre.

Two implementation notes that carry the feel:

- **Constant speed, not constant duration.** Duration is derived from the perimeter
  (`P / 1.0px per ms`, clamped to 280–640ms), so a wide CTA's line does not travel faster than
  a narrow one's. Nobody notices this consciously; everybody feels it. JS publishes the result
  as `--k-btn-draw` and the CSS reads it.
- **Both heads come from one number.** The drawn arc is always centred on the entry offset
  with half-width `L/2`, so growing `L` from 0 to the perimeter grows it symmetrically in both
  directions — no second path, no drift between the halves. The dash pattern always totals
  exactly the perimeter so it tiles the closed path seamlessly; the naive `L, P` with a
  negative offset looks simpler and silently clips wherever the dash wraps past the path start.

Leaving reverses the same tween, at the same speed, back to the entry point. Re-entering a
partly drawn line deliberately does *not* re-anchor — that would make it jump.

**The fill does not change.** An inversion beat (ink → white on hover) was built and then cut:
the primary is now an **ice-deep fill inside a white border**, and it stays that way. So the
drawn line plus the label roll is the entire gesture.

**The white border is the gap, not decoration.** This is the whole reason the primary reads the
way it does. On a white page a white border *is* page, so at rest you see a plain ice-deep
pill and the border is invisible by design. Its job starts on hover: the line is drawn
**outside the border box**, so that band of white is what holds the line off the fill and lets
both stay readable. An earlier pass drew the line *on* the border and covered it, which is
exactly what this replaces — the line comes out of the border rather than replacing it.

Consequences worth knowing:

- **The SVG is larger than the button and hangs outside it**, 8px on every side. It is
  `pointer-events: none`, so it cannot block clicks, but an ancestor with `overflow: hidden`
  will clip the line.
- **Centre it, do not pin it.** The obvious placement is a negative `top`/`left` paying back the
  border width and the pad — absolute positioning resolves against the *padding* box, so both
  have to be repaid. That was the first version and it was wrong in a specific way: it put the
  whole of any measurement error at the **bottom**, so the white band read visibly thinner
  there than at the top. `top/left: 50%` with `translate(-50%, -50%)` is symmetric by
  construction — it needs to know neither the border width nor the pad, and any residual error
  splits evenly. Measuring the border box **fractionally** rather than rounding removes most of
  the error in the first place.
- **The line is `--ice-deep`** (6.1:1 on the page) rather than `--ice` (2.52:1). With no colour
  change behind it, the line is now the only hover feedback besides the roll, so it carries the
  state alone and is stroked at 2px rather than a hairline.
- **The focus ring needs `outline-offset: 6px`**, up from the global 3px, or it lands on top of
  the drawn line.

**The roll is a label swap again.** It was briefly load-bearing — under inversion, two pinned
label lines were what stopped a single element crossfading through the moment it matched its
own background. With the fill static that constraint is gone and both lines are simply the
button's own colour. It runs on `--d-base` and lands *before* the line does; the line closing
after it is what seals the state.

Two things the per-letter split gets wrong if you build it the obvious way, both found on the
first real look at it:

- **A space must be an NBSP.** Each letter is its own `inline-block`, so a span holding only a
  normal space has that space as both the leading *and* the trailing white space of its own
  line box — which CSS removes. It collapses to zero width and every word runs together.
- **The lines must be centred, not flex-start.** The invisible sizer holds the width of
  whichever label is *longer*, so left-aligning leaves the shorter one hanging off to the left.
  The rest label is usually the longer one, which is why this shows up as "the hover label is
  off-centre" rather than as both being wrong.

**The rule that follows: `hoverLabel` may only ever restate, never inform.** The second label
appears on hover and focus only, so it does not exist for touch users at all. It can say the
same thing in different words; it may never carry information the first label does not.

### The arrow link: ↗ was saying the wrong thing

The old arrow morphed east into **north-east** on hover. That is a real semantic clash, not a
nitpick — ↗ is the web's near-universal sign for *opens elsewhere*, and every link using this
component is **internal**. The choice was to override the convention deliberately or to change
the shape. Overriding a convention that strong buys nothing, so:

| | resolves to | means |
|---|---|---|
| internal (default) | **→** east | forward, next, still here |
| `external` | **↗** north-east | leaves the site |

**At rest it is a line** — not an arrow, not a chevron. A plain horizontal stroke claims
nothing about the destination, which is what lets the hover carry real information: the icon
stays neutral until you are about to act on it, then tells you what kind of destination this is
at exactly the moment that matters. The rest state earns its place instead of just being the
before-picture.

Mechanically the head **grows out of the shaft's own tip**. Scaling from the vertex is
geometrically identical to drawing each barb outward along its length — for a straight segment
leaving the origin they are the same picture — so it is one property and it stays on the
compositor.

**The arrow also steps forward as it resolves**, and forward means *along its own axis*. The
group's transform is composed `rotate()` then `translate()`, and because transform functions
carry the coordinate frame along, one distance (`--k-arrow-step`, 3 user units in a 16 viewBox)
gives east travel to internal arrows and north-east travel to external ones. The arrow always
advances the way it points. Growing a head and advancing are one statement — *it goes that
way* — not two competing ones, which is what keeps this inside the one-gesture rule the button
section argues for.

Two details that are easy to get wrong:

- **`vector-effect: non-scaling-stroke`** on the head, or the stroke weight scales with the
  geometry and the barbs fade in thin instead of growing at full weight.
- **`stroke-linecap: butt`** on the head. A zero-length subpath with *round* caps renders as a
  dot, so a `scale(0)` head would leave a permanent blob at the arrow tip. The join keeps its
  own `round`.
- **The `-ext` rules must come after the plain ones.** An external link matches both
  `.k-arrow-link:hover` and `.k-arrow-link-ext:hover` at equal specificity, so source order is
  the only thing deciding which transform wins. Move them and external links lose their swing.

**Touch gets the resolved arrow permanently.** The line-at-rest is a pointer-device refinement,
so the CSS is written with the arrow as the *default* and `scale(0)` applied only inside
`@media (hover: hover)`. A touch user who never sees a hover would otherwise be left with an
icon that never resolves into anything meaningful — the same rule as the button's second label:
a hover state may restate, it may not be the only place meaning lives.

The one risk this introduces: the distinction is only worth something if call sites actually
pass `external`. A missed one is now *worse* than the old blanket ↗, because the marker means
something. Logged as checklist 2.4.

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
navigation affordance, carrying every destination) · the primary button (the CTA) · the
burger's hover (it is the entire nav) · the fluid cursor (the signature, always present).

**The button's entry got more expensive and needs watching.** It used to be an ink pill that
showed accent only on hover. It is now an **`--ice-deep` fill at rest**, which is a permanent,
large, saturated use rather than a transient one — plus the drawn line in the same value on
hover. That is a legitimate spend for a primary CTA and there are rarely more than two on a
page, but it is no longer free, and it is the reason the ghost variant must stay accent-less.
If a page ends up with several primaries, this is the first thing to look at.

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
