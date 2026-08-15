# Pre-design checklist

Everything that has to land **before section design starts**. Section design means
building sections 2–9 of the homepage against `homepage-choreography.md`; the point of
this list is that none of it should be discovered halfway through that.

Status as of the last commit: buttons, arrow links, cards, reveal, aperture menu and Lenis
are **built**; the cursor and the page transition are **not started**.

Each item says what *done* looks like, so it can be checked rather than argued about.

---

## 0. The two hard blockers

**B1 · No video or poster assets.** The project card is wired for both and has neither, so
its main move — the screen recording on hover — has never run against real material. This
also leaves the page in breach of its own argument, that client work supplies the only
colour. *Done when:* three recordings + three posters exist at the spec in §4.

**B2 · Only one v4 page exists** (`/design-system`). A page transition needs two routes to
move between, so §5 cannot start, let alone be judged. *Done when:* a second v4 route
exists — even a stub — that the transition can run against.

Neither is a design decision. Both are inputs.

---

## 1. Buttons

Built: proximity lean at rest, fill growing from the bottom rule, per-letter label roll,
ghost variant, `sr-only` real string, reduced-motion and touch guards on the JS.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| 1.1 | **Touch behaviour of the hover state** | The fill and roll are `:hover`-driven. On touch, `:hover` *sticks after tap* — the button stays filled with the wrong label showing until something else is tapped. The JS proximity is already guarded; the CSS is not. | Hover rules sit inside `@media (hover: hover)`, and touch gets a defined `:active` state instead. Verified on a real device or emulation. |
| 1.2 | **The second label is desktop-only** | It never appears without hover, so anything it says is invisible to every touch user. | A written rule: `hoverLabel` may only ever restate, never inform. Applied when the real CTA copy is chosen. |
| 1.3 | **Size variants** | Only one size exists. A hero CTA and a footer link cannot be the same size, and inventing sizes mid-section-build is how a system drifts. | At minimum a default and a large, both defined in `tokens.css`. |
| 1.4 | **Disabled + submitting states** | `/contact` posts to the Resend route. A form button with no pending state will get double-submitted. | Both states defined, with the roll suppressed while pending. |
| 1.5 | **Proximity vs the cursor** | Both track the mouse. Two things reacting to the same movement can read as noise rather than one response. | Judged side by side once the cursor exists (§3). |
| 1.6 | **Real CTA copy** | Placeholder pairs (“Start a project” / “Let’s talk”) are stand-ins. | Final pairs chosen for every CTA on the site. |

---

## 2. Arrow links

Built: shaft and head as separate paths, both swinging to a new axis on hover so east
becomes north-east; label shifts to `--text-accent`.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| 2.1 | **↗ already means "external link"** | This is a real semantic clash, not a nitpick: a north-east arrow is the web's near-universal sign for *opens elsewhere*. Every one of these links is **internal**. Either the convention gets deliberately overridden, or the hover target shape changes. | Decided. If kept, external links need a genuinely different marker. |
| 2.2 | **Inline-in-paragraph variant** | The current one is a standalone block. Body copy will need an inline version and its underline will collide with the drawn rule. | An inline variant exists, or a rule saying arrow links never appear inline. |
| 2.3 | **On `--surface-raised`** | The ice rule is 2.52:1 on white and lower on mist. Alternating sections are part of the system. | Checked on mist; adjusted or ruled out. |

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
| 3.6 | **Intensity and solver tuning** | Raised once for visibility: `intensity` 30 (prop), `dpr [0.5, 1]`, `densityDissipation` 0.982, `radius` 0.19, `dyeRes` 512, and a `pow(0.70)` on the density curve to lift the thin outer wisps. `curl` and `pressure` are still the source project's, tuned against a **dark** page. | Judged in motion on white; the fastest levers are `intensity` (prop) and `densityDissipation`. |
| 3.7 | **Fluid vs proximity buttons** (was 1.5) | Both answer the same pointer movement. | Judged in a foreground tab. |
| 3.8 | **WebGL context cost on every page** | One context per page load, plus float framebuffers. Fine on a desktop; worth knowing on low-end hardware. | Checked, and a kill-switch decided if needed. |
| 3.9 | **"Good, but we can improve it"** | Signed off as the direction, not as finished. Nothing specific named yet, so the candidates are: dye that persists too long or not long enough, the graphite/smoke balance, splat radius, whether the trail should respond to *what* it is over (the `data-lens` hint API was written for the lens and is now unused), and whether it should fade near body copy the way the choreography asks the lens to. | A specific note on what to change. |

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

## 5. Exoape page transition — not started

Spec (`homepage-choreography.md`, global behaviour): the outgoing view tilts away on a
circular path while the next rises from beneath and passes through a lens on the overlap,
`--d-cinema` on `--e-arc`.

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| 5.1 | **A second v4 route** (= blocker B2) | — | Exists. |
| 5.2 | **Mechanism: View Transitions API vs manual** | Determines whether this is ~40 lines or a full overlay-and-router-events harness, and whether it degrades or breaks in Safari. | Chosen, with the fallback path named. |
| 5.3 | **Scroll position on navigation** | Lenis owns scrolling. Without explicit handling the new page arrives at the old scroll offset, mid-transition. | Reset defined and verified both ways through a navigation. |
| 5.4 | **The legacy shutter must not apply** | `app/(site)/template.tsx` runs a ten-stripe dark shutter. It is scoped to the legacy group today, but it is the thing v4 is replacing and the two must never both run. | Confirmed isolated, and removed with the legacy site. |
| 5.5 | **Reduced motion** | A full-viewport tilt is a strong vestibular trigger. | Collapses to an instant cut. |

---

## 6. Cross-cutting

| # | Item | Why it blocks | Done when |
|---|---|---|---|
| 6.1 | **`.k-root` and the `<noscript>` fallback live on one page only** | Both are currently inside `app/design-system/page.tsx`. Every new v4 route will silently lack them — and without the noscript rule, a JS failure renders the page **completely blank**, since every `.k-reveal` starts at `opacity: 0`. | Both moved to the root layout, or a shared v4 layout. |
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

1. **Unblock the inputs** — record the three videos (B1), stub a second v4 route (B2).
2. **Cursor** (§3), because it is the last unbuilt component and §1.5 depends on it.
3. **Cards** (§4) once assets exist — including finally watching the entrance play.
4. **Page transition** (§5), which needs B2 and is the largest single unknown.
5. **The audits** (§6.3, §6.4) as one pass over everything, not per-component.
6. Then section design starts.

Items 2 and 3 are independent and can run in either order. Item 4 is the one most likely to
overrun, so it should not be last.
