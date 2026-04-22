# Konaverse — Homepage Design Specification
**Version 1.1 | Claude Code build reference**

## 01. Project Identity
- **Studio name:** Konaverse
- **Tagline:** Creative Studio, Limitless Possibilities
- **Positioning:** Premium two-person digital agency. Web development and videography. Calm authority — not agency hype.
- **Target clients:** High-ticket service businesses, real estate, hospitality, startups, e-commerce across Cyprus, Greece, and Europe.
- **Emotional register:** The feeling of walking into a high-end architecture firm. Quiet confidence. Everything is considered. Nothing is accidental.

## 02. Brand Tokens

### Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Hero | Cormorant Garamond | 300 Light | Mixed case. Large scale. Slight negative tracking (-0.02em). |
| Section Headlines | Cormorant Garamond | 300–400 | Refined, editorial. Never uppercase forced. |
| Body / Paragraphs | DM Sans | 300–400 | Generous line-height (1.7). Never dense. |
| UI Labels / Micro-copy | Geist Mono | 400 | Uppercase, letter-spacing: 0.15em. Small scale only. |
| Navigation | DM Sans | 400 | Clean, no weight gimmicks. |

**Critical typography rules:**
- No eyebrow labels above section titles. Ever.
- No double-dash (—) decorative dividers used as a design pattern.
- No hero + subheadline + button stacked layout (the generic AI pattern).
- Font sizes should feel editorial, not form-driven. Hero text should feel physically large.
- Whitespace is a typographic decision — use it with intention.

### Color System
| Token | Hex | Role |
|-------|-----|------|
| `--obsidian` | `#111111` | Primary dark background |
| `--near-black` | `#0a0a0a` | Deepest dark, hero backdrop |
| `--sage` | `#6b7f62` | Brand green, used as accent only |
| `--warm-sand` | `#b6a492` | Secondary accent, light section warmth |
| `--pale-warm` | `#c8b4a0` | Light section supporting tone |
| `--soft-white` | `#faf7f2` | Light section background |
| `--off-white` | `#ededea` | Body text on dark backgrounds |
| `--glass-white` | `rgba(255,255,255,0.06)` | Glassmorphism fill |
| `--glass-border` | `rgba(255,255,255,0.10)` | Glassmorphism border |

### Grain & Texture
Every dark section carries a subtle film grain overlay (`SVG feTurbulence` or CSS noise). Opacity 0.03–0.05. This is what separates the surface from feeling plastic. Do not skip this.

### Glassmorphism — One Rule
Glassmorphism is used in exactly one place: the floating navigation metadata chip or the project card metadata overlay. `backdrop-filter: blur(12px)`, `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.10)`. It is not a repeating pattern. It appears once, and that appearance feels earned.

## 03. Section Rhythm — Dark / Light Map
| # | Section | Theme | Notes |
|---|---------|-------|-------|
| 1 | Hero | Dark (`--near-black`) | Opening frame |
| 2 | Services | Dark → transitions to light | The Takeover Sequence |
| 3 | Projects | Dark (`--obsidian`) | Stacking parallax cards |
| 4 | Studio / About | Light (`--soft-white`) | Page exhales here |
| 5 | CTA / Footer | Dark (`--near-black`) | Closes the arc |

*Note: The transition between dark Services and dark Projects should be seamless — no visible section break. The light Studio section should feel like a sudden breath of air after the intensity of the scroll experience above it.*

## 10. Scroll & Animation System
**Smooth Scroll**
Lenis with `smooth: 1.2`, `lerp: 0.1`. Synced to GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.

**Global animation principles:**
- **Entrance animations:** Everything that enters uses either masked line reveals (text) or opacity + translateY (images/blocks). Nothing pops in — everything slides or unmasks.
- **Easing:** `power3.out` for entrances. `none` (linear) for scrubbed scroll animations. `power2.inOut` for hover transitions.
- **Duration:** Text reveals: `0.9–1.1s`. Block reveals: `0.7–0.9s`. Hover: `0.3s`. Never faster than `0.25s`.
- **Stagger:** `60–120ms` between sequential elements. Never more than `200ms` — it starts feeling slow.
- **Reduced motion:** All scroll-driven animations disabled, entrance animations reduced to simple opacity fade when `prefers-reduced-motion: reduce`.

**What is never animated:**
- Layout properties (`width`, `height`, `margin`, `padding`, `top`, `left`)
- Font size (use `scale` instead)
- Background color directly (use opacity overlays instead)
- Border width

**Performance:**
- `will-change: transform` on every element that will animate (set in CSS)
- `transform: translateZ(0)` to force GPU layer
- All images lazy-loaded except hero
- Parallax intensity halved on touch devices

## 11. Responsive Breakpoints
| Breakpoint | Width | Notes |
|------------|-------|-------|
| Mobile | `< 768px` | Single column, reduced parallax, stacked portraits |
| Tablet | `768–1024px` | Hybrid — some two-column, reduced scale |
| Desktop | `> 1024px` | Full experience |
| Wide | `> 1440px` | Max-width containers, type scales up via `clamp()` |

**Mobile-specific rules:**
- Navigation: hamburger only, no persistent links
- Hero headline: `clamp(36px, 10vw, 52px)`
- Services: chapters stack vertically, wipe becomes vertical
- Projects: cards at 95vw, rounded corners, reduced parallax
- Studio: portraits stacked full-width
- All touch targets minimum `44px`

## 12. What This Site Is Not
*Read this list before generating any component. If output resembles any of these, regenerate.*

- ❌ Generic card components with drop shadows and rounded corners (8px+)
- ❌ Eyebrow labels (small colored text above section titles)
- ❌ Double-dash (—) as a decorative UI pattern
- ❌ Hero section with headline + subheadline + primary button + secondary button
- ❌ Section titles that are centered with a colored underline accent
- ❌ Testimonial carousels
- ❌ "Our Process" steps with numbered icons
- ❌ Stats row with large numbers ("10+ years", "200+ projects")
- ❌ Gradient purple/blue color schemes
- ❌ Inter, Roboto, or system font stacks
- ❌ Glassmorphism on every card or section
- ❌ Animations that trigger on every mouse move
- ❌ Sections that all look the same (uniform spacing, uniform type scale)

## 13. Reference Sites (Mood & Mechanic Inspiration)
**giats.me** — Stacking project card mechanic. Typographic restraint. Trust in whitespace.
- **Emotional register target:** Architecture firm meets editorial magazine. Cold precision, warm materials.
- **What to take:** The stacking mechanic, the typographic scale, the restraint.
- **What not to take:** The personal/portfolio warmth — Konaverse is a studio, not a person.
