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
| 3 | Pale blue-gray gradient surfaces | `--surface` white, `--surface-raised` mist | The circle edge in the original reads as a gradient shift rather than a shadow. On Whiteout the tonal gap between white and mist is only ~9 levels, so **the circle edge will be nearly invisible** — it needs a hairline at the boundary, or the menu surface goes to mist while the page stays white. Needs testing; flagged as the main visual risk of the port. |
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

| Component | Status | The one move |
|---|---|---|
| **Burger** | drafted | Two rules, not three — three reads generic. On hover the short rule extends to meet the long one: the aperture implied before it opens. |
| **Aperture menu** | mechanics locked, styling open | §2 |
| **Button · primary** | default only | Currently ink fill → ice-deep fill. Functional, not yet interesting. |
| **Button · ghost** | default only | Currently wash fill + ice border. |
| **Arrow link** | not designed | The workhorse — it carries the three homepage destinations, so it has to be unmistakable. Highest priority after the menu. |
| **Project tile** | default only | Lift + `--lift-3`, cursor lens strengthens. Blocked on the tile-link decision (`REDESIGN.md` §2). |
| **Section header** | done | Heading + body, no eyebrow. The restraint *is* the design. |
| **Hairline rule** | done | Draws L→R on `--d-slow`. Carries every section break, since nothing else does. |
| **List row** | not designed | Constrained by the §8 decision: on the homepage services list the rows are **not** links, so they must not imply navigation — no per-row arrow chip, no row-wide cursor change. |
| **Cursor lens** | spec'd, unbuilt | 1.06, single cool fringe at 42%. Strengthens over hero and tiles, weakens over body copy. |
| **Form input** | not designed | `/contact` only — no form on the homepage. |
| **Footer** | not designed | Carries the full map; the only place every URL appears. |

**Accent budget.** Four or five appearances per page, total, across every component. Current
claims on it: the services hub link, the burger hover, the cursor lens fringe. That is
already three — every further use has to displace one of them.

---

## 4. Open

1. **The reveal reconciliation in §1** — needs a yes before components get built.
2. **The circle edge on white** (§2 change 3) — the main visual risk in the port.
3. Everything in `REDESIGN.md` §2.
