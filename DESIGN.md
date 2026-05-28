# Konaverse — Homepage Design Specification
**Version 2.0 | Claude Code build reference**

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
| Display / Hero | Cormorant Garamond | 300 Light | Mixed case. Large scale. Negative tracking (-0.02em). Desktop hero: `clamp(56px, 7vw, 100px)`. Mobile hero: `clamp(22px, 6.5vw, 28px)`. |
| Section Headlines | Cormorant Garamond | 300–400 | Refined, editorial. Never uppercase forced unless in a cinematic section (e.g. Process). |
| Emphasis Display | Cormorant Garamond | 600 | Used sparingly: italic emphasis in CTA headlines (`Engineering *Authority.*`). |
| Body / Paragraphs | DM Sans | 300–400 | Generous line-height (1.7). Never dense. Body color on dark: `rgba(250,247,242,0.6–0.7)`. |
| UI Labels / Micro-copy | Geist Mono | 400 | Uppercase, letter-spacing: 0.15–0.18em. Small scale only (9–11px). |
| Navigation | DM Sans | 400–500 | Clean, no weight gimmicks. Nav links: `0.72rem`, uppercase, `tracking-[0.08em]`. |
| Buttons | DM Sans | 700 (Bold) | `text-xs`, `tracking-widest`, uppercase. |

**Font loading (via `next/font/google`):**
- Cormorant Garamond: weights `300, 400, 600`, styles `normal, italic`, CSS var `--font-cormorant`
- DM Sans: weights `300, 400, 500`, CSS var `--font-dm-sans`
- Geist Mono: weight `400`, CSS var `--font-geist-mono`

**Critical typography rules:**
- No eyebrow labels above section titles. Ever.
- No double-dash (—) decorative dividers used as a design pattern.
- No hero + subheadline + primary button stacked layout (the generic AI pattern).
- Font sizes should feel editorial, not form-driven. Hero text should feel physically large.
- Whitespace is a typographic decision — use it with intention.

### Color System

#### Primary Palette
| Token | Hex | Role |
|-------|-----|------|
| `--color-obsidian` | `#111111` | Primary dark background (Projects section, cards) |
| `--color-near-black` | `#0a0a0a` | Deepest dark — Hero, Services, html/body default |
| `--color-sage` | `#6b7f62` | Brand green accent — lines, hover states, scrollbar, buttons |
| `--color-warm-sand` | `#b6a492` | Secondary accent, light section warmth |
| `--color-pale-warm` | `#c8b4a0` | Light section supporting tone |
| `--color-soft-white` | `#faf7f2` | Primary light text on dark. Also Manifesto section bg |
| `--color-off-white` | `#ededea` | Body text on dark backgrounds, button default fill |

#### Extended Dark Palette (In Use)
| Hex | Where Used |
|-----|------------|
| `#050505` | Duality section, Process section, Footer bg |
| `#08080a` | Navbar glass bg, mobile nav backdrop, page transition stripes |
| `#f0ede8` | Display text on dark (stat numbers, footer tagline, nav hover). Slightly warmer than `--off-white` |
| `#2a2622` | Body text on light backgrounds (Studio paragraph) |

#### Extended Light Palette (In Use)
| Hex | Where Used |
|-----|------------|
| `#e6e3da` | Studio section background — calm beige (NOT `--soft-white`) |
| `#d8d5cc` | Portrait placeholder bg |
| `#4A5443` | Darkened sage for light backgrounds (nickname labels in Studio) |
| `#5C5449` | Darkened warm sand for light backgrounds (role labels in Studio) |

#### Opacity Conventions
| Pattern | Use |
|---------|-----|
| `rgba(250,247,242,0.6)` | Body text on dark — secondary |
| `rgba(250,247,242,0.35)` | Service number labels (e.g. `01 — Web Development`) |
| `rgba(255,255,255,0.4)` | Mono micro-copy on dark |
| `rgba(255,255,255,0.08)` | Divider borders on dark |
| `rgba(255,255,255,0.06)` | Glass fill |
| `rgba(255,255,255,0.07–0.10)` | Glass border |
| `rgba(107,127,98,0.3)` | Scrollbar thumb, selection bg |

### Grain & Texture
Every dark section carries a subtle film grain overlay (SVG `feTurbulence` fractalNoise, `baseFrequency: 0.9`, `numOctaves: 4`). Applied globally via the `.grain::after` pseudo-element on the page wrapper. Fixed position, full viewport, `z-index: 9999`, `opacity: 0.035`. This is what separates the surface from feeling plastic. Do not skip this.

### Glassmorphism
Glassmorphism is used in exactly two contexts:

1. **Navbar** (desktop + dropdowns): `backdrop-filter: blur(40px)`, `background: rgba(8,8,10,0.82)` when scrolled / `rgba(8,8,10,0.12)` at top, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 28–34px` (animates tighter on scroll). Dropdowns: `backdrop-filter: blur(50px)`, `background: rgba(10,10,14,0.88)`, `border-radius: 20px`.
2. **Decorative sheens**: Navbar and dropdown panels both carry a subtle top-left gradient sheen (`linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 50%)`).

## 03. Button System

### Primary — Editorial Pill
- Shape: `rounded-full`, padding `px-8 py-4`
- Default state: `bg-[--color-off-white]` (#ededea) text `--color-obsidian` (#111)
- Hover: Sage green (`--color-sage`) sweeps up from bottom via `translate-y` transform. Text turns white. Subtle shimmer sweep follows. Shadow: `0 10px 40px -10px rgba(107,127,98,0.55)`
- Arrow icon: NE-pointing arrow, 12×12, stroked
- Font: DM Sans, bold, xs, tracking-widest, uppercase
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`, 500ms

### Secondary — Text Link
- Inline flex, no background
- Color: `--color-off-white`, hover → white
- Underline: `--color-sage` scaleX reveal on hover, `origin-left`
- Arrow icon: same as primary, slides right on hover

## 04. Section Rhythm — Dark / Light Map
| # | Section | Component | Theme | Notes |
|---|---------|-----------|-------|-------|
| 1 | Hero | `HeroSection` | Dark (`#0a0a0a`) | Scrollytelling: 3 beats (entrance → expansion → statement). Pinned `+250%` scroll track. |
| 2 | Services | `ServicesSection` | Dark (`#0a0a0a`) | Two-discipline editorial layout with parallax images |
| 3 | Duality | `DualitySection` | Dark (`#050505`) | Full-viewport split: Web Dev left / Videography right. Convergent parallax. Sage divider line. |
| 4 | Manifesto | `ManifestoSection` | Light (`#faf7f2`) | Word-by-word opacity reveal on scroll. `300vh` scroll track. Page exhales here. |
| 5 | Process | `ProcessSection` | Dark (`#050505`) | 3-act crossfade (Strategy → Creation → Delivery) with parallax BG images and progress dots. `300vh` scroll track. |
| 6 | Projects | `ProjectsSection` | Dark (`#111111`) | Stacking parallax cards — giats.me mechanic. Canvas slides reveal next card. |
| 7 | Studio | `StudioSection` | Light (`#e6e3da`) | Calm beige. Two-person portraits with grayscale → color hover, bio reveal. |
| 8 | CTA | `HomeCTA` | Dark (`#111111`) | Clip-path expansion reveal. "Engineering *Authority.*" Button CTA. |
| — | Footer | `FooterSection` | Dark (`#050505`) | Full-viewport sticky reveal via parallax. Ambient sage glows. Architectural grid lines. |

**Transition rules:**
- Dark → Dark transitions (Services → Duality, Process → Projects) must be seamless — no visible section break. Use `marginTop: -1px` where needed.
- Light sections (Manifesto, Studio) should feel like a sudden breath of air after the dark intensity.
- CTA → Footer is handled by the footer's parallax reveal mechanic (footer slides up from behind the CTA).

## 05. Scroll & Animation System

### Smooth Scroll
Lenis via `@studio-freight/lenis` with `smoothWheel: true`, `lerp: 0.1`. Synced to GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. Disabled entirely when `prefers-reduced-motion: reduce`.

### Animation Libraries
- **GSAP** (with ScrollTrigger) — All scroll-driven animations, parallax, pinned sequences, entrance reveals
- **Framer Motion** — Navbar animations (state transitions, dropdowns, mobile menu), page transitions

### Global Animation Principles
- **Entrance animations:** Everything that enters uses either masked line reveals (text, via `.mask-parent` / `.mask-child`) or opacity + translateY (images/blocks). Nothing pops in — everything slides or unmasks.
- **Easing:** `power3.out` for entrances. `none` (linear) for scrubbed scroll animations. `power2.inOut` for hover transitions. Framer Motion equivalent: `[0.22, 1, 0.36, 1]`.
- **Duration:** Text reveals: `0.9–1.1s`. Block reveals: `0.7–0.9s`. Hover: `0.3s`. Never faster than `0.25s`.
- **Stagger:** `60–120ms` between sequential elements. Never more than `200ms` — it starts feeling slow.
- **Reduced motion:** All scroll-driven animations disabled, entrance animations reduced to simple opacity fade when `prefers-reduced-motion: reduce`.

### Page Transitions
10-stripe vertical shutter pattern (`#08080a`) that retracts via `scaleY: 1 → 0` with staggered delays (`0.02s` per stripe). Page content fades in underneath with `opacity: 0 → 1` + `y: 15 → 0`, `0.8s`, `delay: 0.2s`. Grain overlay included on the transition layer.

### What Is Never Animated
- Layout properties (`width`, `height`, `margin`, `padding`, `top`, `left`)
- Font size (use `scale` instead)
- Background color directly (use opacity overlays instead)
- Border width

### Performance
- `will-change: transform` on every element that will animate (set in CSS, also via `.gpu` utility class)
- `transform: translateZ(0)` to force GPU layer (`.gpu` utility class)
- All images lazy-loaded except hero (and first Process act image)
- Parallax intensity halved on touch/mobile devices
- `contain: paint` on stacking card containers to enable clip-based reveal

### Custom Cursor
A custom cursor replaces the default on desktop. Implemented via `CustomCursor` component.

## 06. Responsive Breakpoints
| Breakpoint | Width | Notes |
|------------|-------|-------|
| Extra Small | `< 480px` | Custom breakpoint `--breakpoint-xs: 480px` |
| Mobile | `< 768px` | Single column, reduced parallax, stacked portraits |
| Tablet | `768–1024px` | Hybrid — some two-column, reduced scale |
| Desktop | `> 1024px` | Full experience |
| Wide | `> 1440px` | Max-width containers, type scales up via `clamp()` |

**Mobile-specific rules:**
- Navigation: hamburger only, no persistent links. Full-screen overlay with ambient sage glows.
- Hero headline: `clamp(22px, 6.5vw, 28px)` (mobile) / `clamp(56px, 7vw, 100px)` (desktop)
- Services: text + image stack vertically
- Duality: panels stack vertically (top/bottom split)
- Process: identical crossfade mechanic, slightly reduced overlays
- Projects: cards at `50svh` (mobile) vs `100svh` (desktop), images at `83%` width centered
- Studio: portraits stacked full-width, stagger offset removed
- All touch targets minimum `44px`

## 07. Spacing Utilities
| Class | Effect |
|-------|--------|
| `.section-padding` | `py-24 md:py-32 lg:py-40` — vertical rhythm between sections |
| `.container-padding` | `px-6 md:px-12 lg:px-24` — horizontal grid alignment |
| `.mask-parent` | `overflow: hidden` — clip container for text reveal |
| `.mask-child` | `display: block; transform: translateY(100%)` — GSAP start state |
| `.gpu` | `will-change: transform; transform: translateZ(0)` — GPU acceleration |

## 08. What This Site Is Not
*Read this list before generating any component. If output resembles any of these, regenerate.*

- ❌ Generic card components with drop shadows and rounded corners (8px+)
- ❌ Eyebrow labels (small colored text above section titles)
- ❌ Double-dash (—) as a decorative UI pattern
- ❌ Hero section with headline + subheadline + primary button + secondary button
- ❌ Section titles that are centered with a colored underline accent
- ❌ Testimonial carousels
- ❌ Stats row with large numbers ("10+ years", "200+ projects")
- ❌ Gradient purple/blue color schemes
- ❌ Inter, Roboto, or system font stacks
- ❌ Glassmorphism on every card or section
- ❌ Animations that trigger on every mouse move
- ❌ Sections that all look the same (uniform spacing, uniform type scale)
- ❌ Generic process timelines with icon circles and connector lines

## 09. Reference Sites (Mood & Mechanic Inspiration)
**giats.me** — Stacking project card mechanic. Typographic restraint. Trust in whitespace.
- **Emotional register target:** Architecture firm meets editorial magazine. Cold precision, warm materials.
- **What to take:** The stacking mechanic, the typographic scale, the restraint.
- **What not to take:** The personal/portfolio warmth — Konaverse is a studio, not a person.
