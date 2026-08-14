# KONA — Redesign v4 · Working Brief

**Branch:** `redesign/v4` · **Base:** `website-2.0` @ `8c33777`
**Status:** 🟡 Awaiting design references — codebase prepped, no visual decisions made yet.

Scope agreed: **full site, from scratch, brand-new direction.** DESIGN.md v3.1 (dark
futuristic tech-minimalism, earthy-green `#6B7F62`, extreme scroll transitions) is
**retired** — preserved in git history on `website-2.0`. Nothing in v3.1 is a constraint
on v4 unless you say so.

---

## 1. What I need from you

Drop references into `references/` (see that folder's README for the specifics). The
things that actually unblock building, roughly in order of how much they change:

| # | Question | Why it blocks |
|---|----------|---------------|
| 1 | **Reference sites / screenshots** | The whole visual direction. Everything below is downstream. |
| 2 | **Light, dark, or both?** | Decides the token architecture and every component's base styling. v3.1 was dark-dominant; that is not assumed anymore. |
| 3 | **Accent colour + palette** | Green is gone unless you re-pick it. |
| 4 | **Typeface direction** | v3.1 banned serifs. That ban is lifted — if you want editorial serif, say so. |
| 5 | **Motion appetite** | Heavy scroll choreography (pins, iris, canvas scrub) vs. restrained fade/slide. Drives which libraries survive §3. |
| 6 | **Copy: keep or rewrite?** | Existing headline/body copy across 6 pages. If it's being rewritten, I build to placeholder and swap later. |
| 7 | **Route list** | Current: `/ /about /services /projects /pricing /contact` + legal. Adding/removing pages changes nav, sitemap, JSON-LD. |

For each reference, what's most useful is *what specifically* you like about it —
"the type scale", "how the nav collapses", "that transition at 40% scroll". A URL alone
leaves me guessing which of the fifty things on the page you meant.

---

## 2. Locked — do not break

These survive any redesign. They are business logic, compliance, or SEO, not styling.

| Asset | Path | Note |
|-------|------|------|
| Contact form API | `src/app/api/contact/route.ts` | Resend → `info@kona-verse.com`. Needs `RESEND_API_KEY`. Email HTML template is styled to v3.1 green — restyle when the palette lands. |
| SEO metadata | `src/app/layout.tsx` | OG/Twitter cards, canonical, `metadataBase` = `https://kona-verse.com`. |
| Structured data | `src/components/JsonLd.tsx` + layout | Organization + WebSite schema. Founder names/roles live here. |
| Sitemap / robots / manifest | `src/app/{sitemap,robots,manifest}.ts` | Update the route list if pages change. |
| Analytics + consent | `GoogleAnalytics.tsx`, `CookieConsent.tsx` | GA `G-2PEZX44FP9`, GDPR consent gating. Restyle freely, don't remove the consent logic. |
| Legal pages | `/privacy`, `/terms`, `/cookies` | Content is legal text — restyle, don't rewrite. |
| Brand facts | — | Domain `kona-verse.com`, contact `info@kona-verse.com`, founders Konstantinos (Technical Architect) & Nabil (Creative Director). |

**Assets:** `public/` is ~248 MB. `public/About/` is 306 files — mostly the ~298-frame
droplet sequence feeding the v3.1 canvas-scrub scene. If v4 drops that mechanic, that's
~26 MB of dead weight to prune. Flagging, not touching, until the direction is known.

---

## 3. Stack — kept as-is

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 (`@theme`) ·
Framer Motion 12 · GSAP + ScrollTrigger · Lenis · Three.js / R3F + postprocessing · Spline · Resend.

R3F, postprocessing, Spline and GSAP are only worth their bundle weight if v4 actually
uses them. Once the motion appetite (§1.5) is known I'll prune whatever's unused.

---

## 4. Done on this branch

**Dead-code sweep — 31 files removed, 0 behaviour change.** Every one was unreferenced;
the build produced the same 17 routes before and after (`exit 0` both times). All
recoverable from git history.

- 20 orphaned sections/components — the `Beat*` set, `ServicesBento`, `ServicesCarousel`,
  `TestimonialsSection`, `DualitySection`, `ProcessSection`, `PhilosophySection`,
  `KeyElements`, `HomeCTA`, `StudioSection`, `Card`, `SectionNumber`, `SiteHeader`
- 5 duplicate shadow-copies — bare `ProjectsSection`/`ServicesSection` (the `homepage/`
  ones are live), `navigation/Navbar` + `MenuOverlay`, `layout/NavOverlay`
- 6 hooks/utilities orphaned by the above — `useParallax`, `usePinSequence`,
  `useTextReveal`, `useScrollReveal`, `ArchiveLabel`, `ScrollReveal`

Kept `src/lib/motion.ts` (unreferenced but direction-agnostic easing tokens) and
`src/utils/gsap.ts`.

### Still standing (the v4 teardown list)

25 component files remain. These render the current site and come down section by section
as v4 replaces them — *not* before, so `main` stays deployable throughout:

`HeroSection` · `HeroV2` (imported but unused) · `AboutSection` · `CinemaScene` ·
`ServicesSection` · `ServicesVault` · `ManifestoSection` · `ProjectsSection` ·
`parallax-stacking-projects` · `InterludeSection` (commented out) · `CTASection` ·
`FooterSection` · `Navbar` · `CustomCursor` · `SmoothScroll` · `TextOpacity` ·
`PageWrapper` · `PageHeader` · `StickyPageWrapper` · `TransitionLink` · `button` ·
`team-member-card` · `JsonLd` · `CookieConsent` · `GoogleAnalytics`

**`src/app/globals.css` is 973 lines and roughly 85% section-specific CSS** bound to the
components above (`.cinema-*`, `.interlude-*`, `.orbit-*`, `.cta-*`, `.footer-*`,
`.about-*`, `.services-*`, `.proj-*`, `.hero-*`). It gets rebuilt from a new token set
rather than edited. The reset, Lenis glue, `.grain`, `.gpu` and the reduced-motion block
are the only parts likely to carry over.

---

## 5. Working agreements

- **Uncommitted WIP carried over:** a `Navbar.tsx` change adding explicit `initial={}`
  values to the scroll-responsive nav (prevents a first-paint flash). Untouched by the sweep.
- **Mobile:** the old rule was "mobile is close to final, scope changes to desktop via
  `md:`/`lg:`". A from-scratch rebuild retires that — both breakpoints are in play now.
- **Verification:** `npm run build` must stay `exit 0` with all 17 routes before any commit.
- **Deployability:** `main` is untouched. This branch keeps the site rendering at every
  commit; sections swap one at a time rather than a big-bang breakage.
