# KONA — Website Design Specification
**Version 3.1 | Futuristic Tech Minimalism + Cinematic Scroll | Claude Code build reference**

> **What this document is:** the single source of truth for how the KONA (Konaverse) site looks, feels, and *moves*. Read section **00** before building anything — the wow factor is the product. Everything else serves it.

> **Direction shift from v2.0:** The editorial/newspaper aesthetic (Cormorant Garamond serif, sage/sand earthy palette, dual web-dev + videography positioning) is **retired**. v3.x is futuristic, minimal, mysterious, and *kinetic*: dark-dominant with deliberate light interludes, lightweight Inter typography, an earthy-green (`#6B7F62`) accent, and **extreme section-to-section transitions** as the signature. Web development is the *only* service. The previous spec is preserved in git history.

---

## 00. The Experience Thesis — *the wow factor*

KONA is a web development studio. The site itself is the portfolio. A visitor should finish the homepage thinking **"how did they do that?"** — and want to hire the people who can.

Three non-negotiables drive every decision:

1. **Every section boundary is an EVENT.** We do not stack sections that simply scroll past one another. Each transition is choreographed — a section pins while the next one *takes over the screen* with intent (tilts in, irises open, drops down, flies through). If a boundary is "just scrolling," it's not finished.
2. **Motion is the brand.** Scroll-driven reveals, parallax depth, perspective tilts, clip-path wipes, hover micro-interactions. Restrained and slow, never frantic — but always alive. Static = wrong.
3. **Whitespace is luxury.** Oversized type used as graphic. Huge breathing room. Few elements, each placed deliberately. Emptiness signals confidence; clutter signals a template.

The emotional register: **a forward-looking technology lab, not a magazine.** Mysterious, cinematic, premium. Quiet authority expressed through darkness, depth, glow, and impeccable motion — never through hype or density.

**Contrast is a tool.** The site is dark-dominant, but light sections (About, Manifesto) are dropped in as *interludes* — and the transitions weaponize that dark↔light flip for drama. A glowing-green iris opening from a held dark frame onto… no; onto a held frame and revealing a bright panel sliding in — that jolt is the point.

When in doubt: **bigger type, more space, slower motion, bolder transition.**

---

## 01. Project Identity
- **Studio name:** KONA (Konaverse)
- **Positioning:** Web development studio. Single discipline. **Videography is removed entirely** — no dual-discipline framing, no "Duality" section, no videography projects or references anywhere.
- **Target clients:** High-ticket service businesses, startups, and brands that want a modern, technological web presence across Cyprus, Greece, and Europe.
- **One-liner:** "A web development studio building fast, refined, future-facing products for brands that refuse the ordinary."
- **Mood references:** NUORBIT (dark, glowing ring portal, silhouette mystery), NeoVision (clean light tech-product clarity), Kinetic Studio (oversized type-as-graphic, motion-blur imagery, staggered cards). See **§12**.

---

## 02. Brand Tokens

### Typography — *no serifs, ever; lightweight always*
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Hero wordmark | **Inter** | 400–500 | Oversized as a graphic element (the NUORBIT/kinétic treatment). Negative tracking (−0.02 to −0.03em). Hero wordmark sized in pure `vw` so it bleeds off the viewport edges. |
| Section Headlines | **Inter** | 300–400 | Clean, light, neutral. Sentence case or sparing uppercase. Large. |
| Gradient Emphasis | **Inter** | 500 | Key headline word(s) only, filled with the earthy-green accent gradient (`background-clip: text`). Used sparingly. |
| Body / Paragraphs | **DM Sans** | 300–400 | Light. Generous line-height (1.6–1.7). |
| UI Labels / Micro-copy / Tags | **Geist Mono** | 400 | Uppercase, letter-spacing `0.14–0.2em`, small scale (9–12px). The HUD/tech texture. |
| Buttons | **DM Sans** | 600–700 | `text-xs`, `tracking-widest`, uppercase. |

**Font loading (`next/font/google`):** Inter `--font-inter` (300–700) · DM Sans `--font-dm-sans` (300–500) · Geist Mono `--font-geist-mono` (400). Cormorant is still loaded only because the legacy `FooterSection` references it; do **not** use it in new work.

**Typography rules:**
- **No serif fonts.** Display is lightweight Inter — favor 300–500. Airy, never heavy.
- Oversized headline type is a *design element*, not just text. Let it bleed, overlap, or dominate.
- Gradient fill is reserved for emphasis words only; never gradient a whole paragraph.
- No eyebrow labels above *section titles* (small in-card tags/labels are fine — see Services/About cards).
- Whitespace is a typographic decision — use it with intention.

### Color System — dark-dominant with light interludes
**Earthy green `#6B7F62` is the brand main color.** It is the *only* accent — used for gradient emphasis, glows, rings, hover states, arrows, and active states. No teal, blue, or purple.

#### Dark palette (default surface)
| Token | Hex | Role |
|-------|-----|------|
| `--color-bg` | `#0B0B10` | Deep space black — primary dark surface |
| `--color-bg-deep` | `#050510` | Deepest dark — footer, page-transition stripes |
| `--color-surface` | `#0E0E12` / `#111119` | Card / elevated dark surface |
| `--color-ink` / `--color-text` | `#F8FAFC` | Primary text on dark |
| `--color-muted` | `#94A3B8` | Secondary text on dark |
| `--color-line` / `--color-border` | `#1E293B` | Dividers, hairlines |
| `--color-accent-from` | `#8BA27C` | Lighter sage — gradient start |
| `--color-accent-to` | `#6B7F62` | Earthy green — gradient end, glow (**brand main**) |

**Accent gradient:** `linear-gradient(120deg, #8BA27C 0%, #6B7F62 100%)`. Glow via `text-shadow` / radial gradients / soft box-shadow — **never** arcade-neon strobe.

#### Light interlude palette (used in About, Manifesto)
| Hex | Role |
|-----|------|
| `#F4F3EE` | About panel background — warm near-white |
| `#FAF7F2` | Manifesto panel background |
| `#E7E5DF` | Light card background |
| `#161616` | Primary text on light |
| `#BDBCB6` / `#9A9A94` | Muted/secondary text on light |

Light sections are **deliberate, occasional interludes** — a breath and a contrast spike, not a default. Most of the site is dark. The dark↔light flip is exploited by the transitions (§04).

#### Opacity conventions (on dark)
`rgba(248,250,252,0.6)` secondary text · `rgba(255,255,255,0.08)` dividers · `rgba(255,255,255,0.05)` glass fill · `rgba(255,255,255,0.08–0.12)` glass border · `rgba(107,127,98,0.3)` accent glow / scrollbar / selection.

### Grain & Texture
Every dark surface carries a subtle film-grain overlay (SVG `feTurbulence` fractalNoise, `baseFrequency 0.9`, `numOctaves 4`) via the global `.grain::after` pseudo-element — fixed, full viewport, `z-index: 9999`, `opacity 0.035`. It separates the surface from feeling plastic. Do not skip it.

### Atmospheric Imagery
Blurred, atmospheric, mysterious — motion blur, glowing halos/rings, silhouettes, depth-of-field, green/teal tones with warm core glows. Technological and cinematic, never documentary/editorial. Treat images as **ambient light sources behind type**, or as framed "work" cards. Imagery lives in `public/Hero/` (atmospheric) and `public/Projects/` (real work screenshots).

### Glassmorphism
Used sparingly: the navbar/dropdowns (`backdrop-filter: blur(40–50px)`, dark translucent fill, `border 1px rgba(255,255,255,0.08)`, large radius that tightens on scroll) and small glass tags/buttons over imagery. Never on every card.

---

## 03. Button System

### Primary — Glow Pill (`.hero-cta`)
- `rounded-full`, default `bg-[--color-ink]` with dark text.
- Hover: earthy-green gradient sweeps **up** from the bottom (`::before` `translateY 100%→0`), text stays dark, soft green glow `0 10px 40px -10px rgba(107,127,98,0.55)`.
- Trailing NE arrow that nudges on hover. DM Sans 600–700, xs, tracking-widest, uppercase. Easing `cubic-bezier(0.22,1,0.36,1)`, 500ms.

### Secondary — Text Link
Inline, no background. Earthy-green gradient underline reveals via `scaleX` from `origin-left` on hover; arrow slides right.

### Circular Icon Button
Solid earthy-green disc with dark stroked arrow + green glow (e.g. the active Services row). 34–44px.

---

## 04. Motion & Transition System — *the signature*

This is the heart of v3.x. Section transitions are not afterthoughts; they are designed, named, reusable mechanics. **Build new sections to plug into this system.**

### Foundations (the plumbing)
- **Smooth scroll:** Lenis (`@studio-freight/lenis`, `smoothWheel`, `lerp 0.1`) drives **native window scroll** (no transform wrapper — so `position: sticky` and `useScroll` both work). Synced to GSAP via `lenis.on('scroll', ScrollTrigger.update)`. Disabled under `prefers-reduced-motion`.
- **Libraries:** **Framer Motion** (`useScroll` / `useTransform` / `useMotionTemplate`) for per-section scroll choreography; **GSAP + ScrollTrigger** for scrub timelines & split-text; **Three.js / R3F + postprocessing** for atmospheric hero elements, used judiciously.
- **The sticky stack:** sections that get covered are pinned with `position: sticky` and **stay pinned**; the next section scrolls *over* them. Stack them inside a shared `position: relative` scene so each pin has its scroll runway.
- **The z-index ladder:** each successive section sits one rung higher so it paints over the pinned one beneath. Current ladder: Hero `0` → About `10` → Services `20` → Manifesto `30` → (next `40`, …). **Increment by 10 per section.**
- **Always gate motion** behind `prefers-reduced-motion`: tilts, irises, and pins collapse to a plain stacked/opaque fallback.

### The choreography patterns (as built — reuse these)

**A. Pinned scroll-over + perspective tilt** — *Hero → About, Services → Manifesto*
The previous section is pinned; the incoming section rises over it on a 3D tilt that straightens as it closes in. The "amaze" default for most boundaries.
- Incoming panel: opaque background, rounded top corners (`28px`), soft top shadow.
- `transformPerspective: 1400`, `transformOrigin: 50% 0%`, `rotateX: 12 → 0`, `scale: 0.96 → 1`.
- Driven by `useScroll({ target, offset: ["start end", "start start"] })` — tilted when entering at viewport bottom, flat when its top reaches viewport top.

**B. Pinned last-frame (bottom-pin a tall section)** — *About*
For sections taller than the viewport that must hold their **final** screen before the next transition. Use top-anchored sticky with a **negative** top offset = `min(0, viewportHeight − sectionHeight)`, measured in JS (`ResizeObserver` + resize) since height is content-driven. The section scrolls through naturally, then its last 100vh locks for the following reveal. (Plain `sticky; bottom: 0` does **not** do this on scroll-down — don't use it.)

**C. Vault-door iris** — *About → Services*
The incoming section is revealed through an expanding circle over the *held* previous frame, with a glowing green ring on the edge.
- Incoming section in a pinned stage (`sticky; top:0; height:100svh; overflow:hidden`), clipped by `useMotionTemplate\`circle(${radius} at 50% 50%)\`` with `radius: 0vmax → 75vmax`.
- A runway spacer (~`130vh`) gives the iris its solo scroll *before* the next section rises; the iris completes (~26% of the track) then holds open.
- Glowing ring: a centered round div, `width/height: 0vmax → 150vmax`, green border + glow, opacity fades out as the iris finishes.
- Reveals the pinned previous section behind it (outside the circle is transparent). Magic factor: very high; cost: low.

### The transition catalog (palette to pull from)
Beyond what's built, these are sanctioned "crazy" boundaries. Don't repeat the same one twice in a row.
- **Vault-door iris** *(built)* — expanding clip-path circle + glowing ring.
- **Curtain drop** — next section starts `translateY(-100%)` and falls to cover, overshooting ~6% and settling with a spring; outgoing section darkens/recedes beneath. (Your "comes from above" idea.)
- **Depth tunnel (R3F)** — sections on different Z-planes; scrolling flies the camera forward, current section blurs past (DoF/bloom) as the next resolves from a point. The showstopper — reserve for a hero moment.
- **Stacking parallax cards** — giats.me mechanic for Projects: cards stack and slide, each revealing the next.
- **Word-by-word scrub reveal** *(built, Manifesto)* — split-text words scatter in from random Z/opacity on scroll scrub.
- **Scroll-scrubbed frame sequence** *(built, About cinema)* — a video (`public/About/droplet video.mp4`) extracted to a JPG frame sequence with **motion-compensated interpolation** (`ffmpeg minterpolate fps=60 mi_mode=mci`, scaled to 1280w → `public/About/frames/droplet/`, ~298 frames). A pinned `sticky` stage (~`500vh` track) paints the current frame full-bleed onto a `<canvas>` (object-fit cover, DPR-aware, opaque ctx) while the eyebrow → headline → copy → stat numbers fade in sequentially over the top. **Three smoothness layers so slow scroll never looks frame-by-frame:** (1) interpolated source frames close real motion gaps; (2) a `requestAnimationFrame` **lerp loop** eases the shown position toward the scroll target (`SMOOTH ≈ 0.16`) for a cinematic settle; (3) **sub-frame cross-blend** — frame ⌊p⌋ drawn opaque, frame ⌈p⌉ on top at `globalAlpha = frac(p)`. Frames preloaded as `Image()`; the loop is paused via `IntersectionObserver` when off-screen. Reduced motion **and phones (`≤860px`)** fall back to a single static frame with all copy shown (no multi-MB preload).
- **Orbital clock carousel** *(built, Services Stage B)* — a large dial whose centre sits off the left edge (most of it bleeds out left); 4 cards are fixed to the rim at 3/12/9/6 o'clock. Scroll spins the dial **clockwise** (`φ: 0 → 270°`) so each card swings through the **3 o'clock dock** (rim's rightmost point = centre-left of the viewport) one at a time; the docked card is the only one in view, and a two-tone headline top-right cross-fades to match it. Cards fade/shrink/blur by angular distance from the dock; a faint rotating tick-mark rim sells the spin. All offsets in `vh` so the dial stays a true circle. Pinned `sticky` stage over a tall runway.

### Entrance & easing baseline
- Nothing pops in. Elements enter via masked line reveals (`.mask-parent`/`.mask-child`) or opacity + `translateY` + slight blur.
- Easing: entrances `power3.out` / Framer `[0.16,1,0.3,1]` or `[0.22,1,0.36,1]`; scrubbed scroll = linear; hover `power2.inOut`.
- Durations: text reveals `0.9–1.4s`; blocks `0.7–0.9s`; hover `0.3–0.5s`; never faster than `0.25s`. Stagger `60–120ms`, never > `200ms`.
- Glow pulses: slow `2–4s`, low amplitude.

### Never animate
Layout props (`width/height/margin/padding/top/left`), `font-size` (use `scale`), border width. Use `transform`/`opacity`/`clip-path` only.

### Page transitions
10-stripe vertical shutter (`#050510`) retracting via `scaleY 1→0` (staggered `0.02s`/stripe); content fades up underneath (`opacity 0→1`, `y 15→0`, `0.8s`, `delay 0.2s`). Grain on the transition layer.

### Performance
`will-change: transform` + `.gpu` on animating elements; lazy-load all images except the hero; halve parallax on touch; `contain: paint` on stacking containers; cap R3F/bloom on mobile and fall back to a static glow image.

### Custom cursor
A custom cursor replaces the default on desktop (`CustomCursor`); interactive elements carry `data-cursor` hints (`link`, `card`).

---

## 05. Section Rhythm — As-Built + Planned

Theme column shows the surface; Transition shows how the section *arrives*. Dark/light alternation is intentional drama.

| # | Section | Component(s) | Theme | Arrival transition |
|---|---------|--------------|-------|--------------------|
| 1 | **Hero** | `HeroV2` | Dark, full-bleed image | Pinned (sticky) base layer. Oversized `KONAVERSE` wordmark bleeds off all edges; headline top-left with green gradient word; glow-pill CTA; minimal HUD. |
| 2 | **About** | `AboutSection` + `CinemaScene` | **Light** `#F4F3EE` → dark cinema | **Stage 1 (editorial):** **Pattern A** tilts in over the pinned Hero — sparkle eyebrow, big dark/muted headline with inline image "pills", caption, 4 vertically-staggered cards. **Stage 2 (cinema):** **Scroll-scrubbed frame sequence** (§04) — a pinned `~500vh` dark stage canvas-scrubs the droplet frames full-bleed while the copy + stat numbers fade in sequentially; its held last frame is what Services tilts over. |
| 3 | **Services** | `ServicesSection` in `ServicesVault` | Dark `#0A0A0A` | Two stages. **Stage A** (`ServicesSection`) — **Pattern A** tilts in over About's held frame, holds: left "services that we provide" + slow-spinning badge; right 01–04 accordion (active = white, underlined, tag pills, green arrow). **Stage B** (`ClockStage`) — **Orbital clock carousel** (§04): pinned dial spins the 4 services through the 3 o'clock dock as a two-tone headline cross-fades top-right. |
| 4 | **Manifesto** | `ManifestoSection` | **Light** `#FAF7F2` | **Pattern A** — tilts in over the pinned Services. Word-by-word scrub reveal (split-text scatter-in). |
| 5 | **Projects** | *(planned)* | Dark | Stacking parallax cards (giats.me mechanic). Real web work from `public/Projects/`. |
| 6 | **Social Proof** | *(planned)* | Dark | Restrained — logos or one strong statement. No testimonial carousel. |
| 7 | **CTA** | *(planned)* | Dark | Clip-path expansion reveal; gradient-emphasis headline; glow-pill CTA. |
| — | **Footer** | `FooterSection` *(legacy — restyle pending)* | Dark `#050510` | Parallax reveal; ambient earthy-green glows. |

**Choreography rule of thumb:** alternate dark↔light where it heightens a transition; never run the same arrival mechanic on two consecutive boundaries.

---

## 06. Hover & Micro-interactions
Interactivity must feel *alive but stable* — never janky layout shifts.
- **Cards:** lift on hover (`translateY(-6px)`) + deepen shadow; image cards may brighten slightly. Stable — no scale that reflows neighbors.
- **Accordion (Services):** hover/tap activates a row — color animates muted-gray → white, underline + tag pills + green arrow reveal (`AnimatePresence`, height/opacity).
- **Links/buttons:** color/gradient/underline transitions (150–500ms), never instant, never > 500ms.
- **Cursor:** custom cursor reacts to `data-cursor` targets.
- Respect `prefers-reduced-motion` — keep hover *states* (color) but drop motion.

## 07. Whitespace & Layout Principles
- Oversized type as graphic; let it bleed off edges (the Hero wordmark) or run full-bleed.
- Generous negative space; offset compositions (headline blocks pushed right, content at the edges, center left to breathe — see Hero & About).
- Staggered / asymmetric arrangements over rigid grids (the About card wave).
- `.container-padding` for horizontal rhythm; sections are commonly `100svh` stages or tall scroll tracks.

---

## 08. Responsive
| Breakpoint | Width | Notes |
|------------|-------|-------|
| XS | `< 480px` | `--breakpoint-xs` |
| Mobile | `< 768px` | Single column; reduced/disabled parallax; side card-stacks hidden |
| Tablet | `768–1024px` | Hybrid |
| Desktop | `> 1024px` | Full experience |
| Wide | `> 1440px` | Max-width containers; type scales via `clamp()` |

> **Mobile is close to final and was tuned against the prior build.** Scope desktop-only visual/transition changes via `md:` / `lg:` (or JS width checks) where the two diverge, and re-verify mobile before committing. Heavy scroll choreography (tilts, iris) is desktop-first; on mobile, degrade gracefully.

## 09. Spacing Utilities
`.section-padding` (`py-24 md:py-32 lg:py-40`) · `.container-padding` (`px-6 md:px-12 lg:px-24`) · `.mask-parent` (`overflow:hidden`) · `.mask-child` (`translateY(100%)` GSAP start) · `.gpu` (`will-change:transform; translateZ(0)`). Transition-specific helpers: `.hero-pin`, `.about-pin`, `.hero-cta`.

---

## 10. What This Site Is Not
*Read before generating any component. If output resembles any of these, regenerate.*

- ❌ A static page where sections merely scroll past each other — **every boundary must be a designed transition.**
- ❌ Any serif font; heavy/bold display weights; default system font stacks. (Display = lightweight Inter 300–500.)
- ❌ Editorial / newspaper / magazine layouts.
- ❌ Any videography service, project, or reference.
- ❌ Teal / blue / purple / rainbow accents (accent is earthy green `#6B7F62` only).
- ❌ Arcade-neon cyberpunk strobe (glow is subtle and slow).
- ❌ Generic drop-shadow cards; eyebrow labels above section titles; centered titles with underline accents.
- ❌ Testimonial carousels; "10+ years / 200+ projects" stat rows.
- ❌ Glassmorphism on every card/section; animations on every mouse-move.
- ❌ Cramped, template-y density — when unsure, add whitespace and scale up the type.
- ❌ Light backgrounds used as the *default* — light is an occasional interlude, dark dominates.

## 11. References (mood & mechanic)
- **`image*.png` / NUORBIT** — dark, glowing ring portal, silhouette mystery, oversized display type → the **Hero**.
- **NeoVision** — clean light tech-product clarity, type confidence and spacing → light-interlude discipline.
- **Kinetic Studio (`image.png`)** — oversized type-as-graphic, motion-blur imagery, minimal nav → the Hero wordmark feel.
- **`about.png` (Kinetic about)** — sparkle eyebrow, dark/muted headline with inline image pills, vertically-staggered card wave → the **About** section (rebuilt, green accent, KONA copy).
- **`services.png`** — left label + circular "since" badge, right numbered accordion with active highlight, tags, circular arrow → the **Services** section (rebuilt, green accent, web-dev services).
- **giats.me** — stacking project-card mechanic → planned **Projects**.

*Take the mechanics and composition; never the orange accent, the SMM/agency copy, or any clutter. Repurpose everything to KONA: dark + earthy-green, web development, lightweight Inter, and a bigger transition.*
