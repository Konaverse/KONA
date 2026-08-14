# KONA — Redesign v4 · Working Brief

**Branch:** `redesign/v4` · **Base:** `website-2.0` @ `8c33777`
**Status:** 🟢 **Direction locked — Whiteout.** Building against the specs in `docs/`.

Scope: **full site, from scratch.** The v3.1 direction (dark, earthy-green `#6B7F62`,
extreme scroll transitions) is **retired** — preserved in git history on `website-2.0`.

---

## 1. The locked spec — four documents

These are canonical. Nothing gets built that contradicts them; if something needs to
change, it changes in the document first.

| Document | Path | Authority over |
|---|---|---|
| **Design tokens** | `src/styles/tokens.css` | **The single source of truth for values.** Colour, type, space, grid, motion, the refraction signature, grain, elevation. Figma variables mirror these names exactly, one direction only: CSS first, then pushed to Figma. |
| **Design system** | `docs/design-system.html` | The rendered reference — swatches, type scale, the four easing curves (clickable), the reveal, the component set. |
| **Site architecture** | `docs/site-architecture.md` | URL map, service/problem/case-study clusters, internal linking, SEO, build order. |
| **Homepage choreography** | `docs/homepage-choreography.md` | The nine sections, their job, entrance, handoff, and where 3D is present. |

### The direction in one paragraph

**Whiteout.** White surface, one cool accent (`--ice #7FA8C9`) used four or five times a
page and never on text. Manrope alone, six sizes, the personality coming from the 200→600
weight jump. No labels, no eyebrows, no section numbers — a break is space plus a hairline.
The signature is **refraction, not fade**: type resolves from a displaced blurred state
(14px blur, 18px shift, 900ms on `--e-glass`), and a cursor lens magnifies at 1.06. A 3D
object appears in exactly two of nine sections, which is what makes it read as deliberate.

**One idea per viewport.** Four elements on a screen reads as expensive; seven reads as busy.

---

## 2. Decisions

### Locked

- **Nav is a burger**, with Contact always visible outside it, opening as an **aperture** —
  one clip-path circle grown from the button's own centre. No horizontal nav anywhere in
  this system. The design system's `Work · Studio · Contact` bar has been removed and
  replaced with the burger + persistent Contact. Reference implementation in §10.
- **Outbound links follow architecture §8** — services hub, work hub, contact, and nothing
  else. The choreography has been rewritten to comply: section 3 states problems as text
  and links nowhere (seven blog links *was* the "twenty places" problem), section 4 lists
  services as text with one link to `/services`, section 4's row hover moves to that hub
  link. Two exceptions are flagged inline for a decision — see below.
- **Sections 3 and 4 stay separate.** Different search intent, and merging puts two ideas
  in one viewport.

### Deferred — everything 3D

**The object, sections 1 and 6, and the frame pipeline are all on hold**, blocked on a
prior question: *how Blender output actually reaches a browser.* Baked frame sequence vs.
glTF with real-time lighting vs. rendered video are three different production pipelines
with three different budgets, and the choice reaches back into modelling and lighting — so
it can't be settled from the design side. The numbers in choreography §6 (120 frames,
4–8MB, 250–300vh) are placeholders, not commitments.

**Sections 2, 3, 4, 5, 7, 8, 9 and the footer are fully designable now** and touch no 3D.

### Both link exceptions — decided, §8 amended

**Project tiles are links** to their own case studies, and **section 8 links to `/pricing`.**
Architecture §8 has been amended in place (with the original wording preserved in a note) so
the two documents can't contradict each other again.

The homepage now links down to **seven URLs**: services hub, work hub, three featured case
studies, pricing, contact. What stays excluded matters more than the count — individual
service pages (the hub fans those out) and blog posts (reached from the service pages). The
rule was never about the number; it's about not skipping a hub that exists to do the fanning.

Tiles are links and section 4's service rows are not, which is deliberate rather than
inconsistent: a tile is an image and self-evidently clickable, while the rows are text in a
list that ends with a single hub link.

---

## 3. Changes made to the authored spec

Three, each measured in-browser before changing, each reverted by editing one line.
Originals are preserved inline in `src/styles/tokens.css`.

**1 · Grain was colour noise, not grain.** `feTurbulence` writes independent R/G/B
channels, so the filter as authored produced full-spectrum speckle — measured **mean chroma
36/255, peak 147/255** — over every pixel, on a system whose whole discipline is one cool
accent used four or five times a page. Added `<feColorMatrix type="saturate" values="0"/>`.
Measured chroma after: **exactly 0.**

**2 · `--grain-opacity: 0.42` → `0.14`.** At 0.42 the effective coverage is 0.105, so
`#FFFFFF` composites to **`#F8F8F8`** — a 7.3-level grey cast across every white surface,
on a direction named Whiteout. Rendered side by side against true white, the page read
grey. 0.14 keeps the texture and gives the white back. *Surface separation was not the
problem:* the white-vs-mist gap only moves 9.35 → 8.35 at full strength, so alternating
sections were never at risk.

**3 · `--graphite: #6E767C` → `#687076`.** The original is 4.62:1 on white (AA, as the file
claims) but **4.26:1 on `--mist` — below AA for body text.** Since `--surface-raised` *is*
mist, muted copy on every alternating section was failing. `#687076` is the smallest
darkening that clears 4.5 on both surfaces (5.04 / 4.65) and is visually indistinguishable.

Also resolved: the token file's header said *"Manrope + JetBrains Mono (utility)"* while §3
of the same file said *"One family only. No mono, no second face."* Settled on one family,
matching the design system, which loads only Manrope.

Everything else in all four documents is untouched. The other contrast claims verified
accurate and slightly conservative (ink 17.96:1 vs 16.5 claimed, ice-deep 6.73:1 vs 6.1).

---

## 4. Known collision — the token component layer is not globally imported yet

`src/styles/tokens.css` defines generic class names — `.grid`, `.section`, `.card`,
`.page`, `.content`, `.btn`, `.grain`. **27 places across 13 files already use those bare
names**, mostly Tailwind's own `grid` utility, and `app/page.tsx` uses `className="grain"`
on a layout wrapper that the token file would turn into `position: fixed; inset: 0`.

So the file is locked in as the source of truth but is **not yet imported globally** — that
would break the current site on contact. Same reason there's no Tailwind `@theme` bridge
yet: the legacy `@theme` block already binds `--color-surface` and `--color-ink` to v3.1
values, so a bridge today would collide rather than help.

**Decision needed when the first v4 markup lands:** either namespace the token classes
(`k-section`, `k-card`) or treat `tokens.css` as variables-only and build components with
Tailwind utilities. The variables layer has no collisions and is safe either way.

Manrope **is** wired (`app/layout.tsx`), and `--font-sans` now resolves through
`var(--font-manrope)` with the bare `"Manrope"` kept as fallback so the same token file
still works standalone in `docs/design-system.html`.

---

## 5. Locked — do not break

Business logic, compliance and SEO. Survives any redesign.

| Asset | Path | Note |
|-------|------|------|
| Contact form API | `src/app/api/contact/route.ts` | Resend → `info@kona-verse.com`. Needs `RESEND_API_KEY`. Email template still styled v3.1 green — restyle to Whiteout. |
| SEO metadata | `src/app/layout.tsx` | OG/Twitter, canonical, `metadataBase` = `https://kona-verse.com`. |
| Structured data | `src/components/JsonLd.tsx` | Organization + WebSite. Architecture §7 wants Service, BreadcrumbList, Article and FAQPage added. |
| Sitemap / robots / manifest | `src/app/{sitemap,robots,manifest}.ts` | **Needs rewriting** — architecture §1 adds `/blog`, `/services/*` children and `/projects/[slug]`. |
| Analytics + consent | `GoogleAnalytics.tsx`, `CookieConsent.tsx` | GA `G-2PEZX44FP9`. Restyle freely, keep the consent gating. |
| Legal pages | `/privacy`, `/terms`, `/cookies` | Restyle, don't rewrite the text. |
| Brand facts | — | `kona-verse.com`, `info@kona-verse.com`, Konstantinos (Technical Architect) & Nabil (Creative Director), Cyprus, projects from €2,000. |

---

## 6. Carried forward from the v3.1 build

**The frame-sequence lesson.** Choreography §6 specifies **120 frames over 250–300vh** of
pinned scroll — roughly one frame per 2.5vh. The v3.1 build ran a comparable scene at
**~298 frames and still needed three separate smoothing layers** to stop it looking
frame-by-frame: motion-compensated interpolation (`ffmpeg minterpolate mi_mode=mci`), a
`requestAnimationFrame` lerp easing toward the scroll target, and sub-frame cross-blending
between adjacent frames. That's documented in the retired spec and it was hard-won.

At 120 frames this will step visibly on slow scroll. Either raise the count or budget for
the same three smoothing layers — worth deciding before Blender time gets spent, since it
changes what gets exported.

Architecture §7 independently flags the matching risk: scrubbed sequences wreck LCP unless
first paint is a lightweight still and the sequence loads after. Both point the same way.

---

## 7. Done on this branch

- **Dead-code sweep — 31 unreferenced files removed**, build verified identical before and
  after (17 routes, `exit 0`). Detail in commit `002b090`.
- **Specs locked in** — moved to `docs/`, tokens to `src/styles/tokens.css`, tracked in git.
- **Three measured corrections** applied to the token file (§3).
- **Manrope wired** into `app/layout.tsx` at weights 200/400/500/600.

### Still standing (the teardown list)

25 components render the current site and come down section by section as v4 replaces them,
so `main` stays deployable throughout. `src/app/globals.css` is 973 lines, ~85% of it bound
to those components; it gets rebuilt from the token set rather than edited.

---

## 8. Build order

From architecture §9 — do not build everything before launch.

**Launch:** `/`, `/services` + 3D-websites + web-design, `/projects` + two case studies,
`/about`, `/contact`, three legal pages.
**Within a month:** remaining service pages and case studies, `/pricing`.
**Ongoing:** `/blog`, one strong post at a time.

The spec's own next steps: key art (the hero drawn three ways inside the system), one
Blender test object under the single-ice rig at final quality, and a code spike of the
refraction reveal + exoape transition in GSAP and Lenis.

---

## 9. Working agreements

- **Verification:** `npm run build` stays `exit 0` with all routes before any commit.
- **Deployability:** `main` untouched; sections swap one at a time.
- **Uncommitted WIP:** a `Navbar.tsx` change adding explicit `initial={}` values to the
  scroll-responsive nav. Legacy component — will not survive v4, harmless meanwhile.
- **Mobile:** the old "desktop-only, gate with `md:`/`lg:`" rule is retired. Both
  breakpoints are in play. Architecture sets 12 columns desktop, 4 below 768px.
