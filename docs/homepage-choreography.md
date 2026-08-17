# Konaverse — Homepage Structure and Choreography

Version 1. A draft to argue with, not a decision.
System: Whiteout, single ice, Manrope only, no labels, refraction signature.

---

## How to read this

Every section has five parts:

- **Job** — the one thing this section exists to do
- **On screen** — the elements, and nothing more than that
- **Entrance** — what happens as it comes into view
- **Handoff** — how it becomes the next section
- **3D** — present or absent, and never in between

**The rule that keeps the page coherent:** one idea per viewport. The page is long. That is fine. What kills the premium reading is density per screen, not length.

**The object appears in two sections out of nine.** Sections 1 and 6. Everywhere else it is absent. That ratio is what makes it feel deliberate rather than decorative.

---

## Global behaviour

These apply everywhere and are decided once.

**Rendering — LOCKED (SEO plan D5, 2026-08-17).** Every page ships SSR/SSG with all meaningful
text, headings, links and JSON-LD in the raw HTML response. No major AI crawler except
Google's Gemini executes JavaScript — a client-rendered page can rank on Google and be
invisible to ChatGPT, Claude and Perplexity. **Acceptance test per page: view-source shows
all copy, and the page reads fully with JavaScript disabled.** Consequences for this page:
the reveal system may hide with CSS but never withhold from the DOM (it doesn't — and the
`<noscript>` fallback in the (v4) layout is now load-bearing for revenue, not politeness);
the page-turn's static fallback is the crawler's version of section 5; motion, WebGL and
scroll sequences are an enhancement layer on top of real HTML, never the content itself.
Every fact below marked [SEO] traces to `konaverse-seo-master-plan.md` — a plan, not gospel;
it updates after Phase 0 research.

**Scroll.** Smooth scroll with light inertia. Deceleration, never a hard stop.

**Section rhythm.** `--section-y` on every break, held exactly. With no labels announcing sections, uneven spacing reads as a mistake rather than a variation.

**Reveal.** Nothing fades. Everything resolves from a displaced blurred state, `--reveal-blur` 14px to 0 and `--reveal-shift` 18px to 0 over `--d-slow` on `--e-glass`. This is the signature and it never varies.

**Stagger.** Multiple elements in one section stagger 80ms apart. Headline first, supporting text second, everything else third. Never more than four stagger steps in one section.

**Trigger point.** Reveals fire when the element is 15% into the viewport, not at the edge. Firing at the edge means the animation is over before it is properly visible.

**Cursor.** ~~The lens.~~ **The fluid** (amended 2026-08-17 — the refracting lens was built and removed; two pointer-followers was one too many, and its backdrop-filter layer re-rasterised the fluid out of existence). The WebGL fluid trail is site-wide and augments the native cursor, never replaces it. Whether it should calm over body copy, the way this line once asked of the lens, is checklist 3.9's open question.

**Progress indicator.** **The ring** — the object's counter-rotating band (see *The object*, below) — near the burger, turned in proportion to scroll position. Where you are in the page is expressed as where the ring has turned to. This carries the wayfinding that the removed labels used to provide, so it is functional rather than ornamental. Under the pre-rendered pipeline it is a small scrubbed frame sequence, not a live model — one of the cheapest renders in the set.

**Nav. LOCKED.** Burger, with contact remaining visible outside it. Someone who wants to hire you should never have to open a menu to find out how. There is no horizontal nav in this system — the design system's earlier `Work · Studio · Contact` bar is removed. The menu opens as an **aperture**: one clip-path circle grown from the button's own centre, measured at click time, panel contents rising while the circle is still travelling, close reversing the same timeline faster so the menu is swallowed back into the button.

> **UNLOCKED 2026-08-16 — desktop is a horizontal nav after all.** Not a change of taste; the burger and the page transition turned out to be incompatible. Reaching any link through the aperture means **opening a full-screen overlay first**, and that overlay then closes back over the transition it just triggered. The nav sits at `z-index: 50`, above both pages, so it paints over the exact thing it launched — the transition was unwatchable. Choosing between them, the transition wins.
>
> The reference site this transition is modelled on has a horizontal nav, and that is not a coincidence: a nav you click *through* an overlay cannot show you a page transition.
>
> **What survives:** the aperture and the burger still own navigation **below 57.5rem**, where five items plus Contact do not fit across a phone. The two are exact complements in CSS — one is displayed at every width, never both, never neither. Contact remains outside the set, now by spacing rather than by being the only thing not buried. The aperture is additionally `display: none` on desktop, because without JS it renders OPEN by design and must not cover a desktop page that already has a working nav.
>
> **What this costs:** the aperture is the most elaborate component in the system and it now only ever appears on phones. That is a real loss and it is the price of the transition being visible at all.

**Outbound links. LOCKED.** The homepage links down to **seven URLs and no others**: the services hub, the work hub, the three featured case studies, pricing, and contact. The footer carries the full map and is the only place every URL appears.

**What stays excluded, and why it matters more than the count.** Individual service pages — `/services` is what fans out to those six, and bypassing the hub would spray the homepage across the whole cluster. Blog posts — seven problem-cluster links was the original excess, and those are reached from the service pages instead. The discipline was never about the number; it is about not skipping a hub that exists to do the fanning.

The consequences, section by section below: **section 3 states problems as text and links nowhere**, **section 4 lists services as text with one link to the hub**, **section 5's tiles each link to their case study**, and **section 8 links to pricing**. Sections 3 and 4 still do their SEO job either way — plainly-stated problems in real DOM text are what language models cite, and that works whether or not the words sit inside an anchor.

**Page transitions.** The exoape arc. Outgoing view tilts away on a circular path while the next rises from beneath, and passes through a lens on the overlap so it distorts as it leaves. `--d-cinema` on `--e-arc`.

> **Rewritten 2026-08-16 from the reference recording.** An earlier amendment on this line claimed *"the next rises from beneath"* could not be built without the View Transitions API, and substituted a blank white sheet rising in place of the real page. **That was wrong and is withdrawn.** The clause was literal, it is buildable, and the substitute was rejected on sight — a blank sheet has no outgoing page to tilt and nothing to darken, so it cannot express the move at all.
>
> The paragraph above is also wrong on its own numbers. Every figure below was **measured** off `page transition.mp4` (1918×900, 30fps) — the incoming page's top edge tracked per frame and per column by max-gradient with a robust line fit, the outgoing page's drift recovered by ZNCC patch matching, its darkening read as a luminance ratio:
>
> | | spec said | measured |
> |---|---|---|
> | duration | `--d-cinema` (1.4s) | **~0.68s** |
> | easing | `--e-arc` | **`--e-page`** — `cubic-bezier(0.304, 0.635, 0, 0.835)` |
> | **layering** | not stated | **incoming rides OVER the outgoing** — see below |
> | incoming | "rises from beneath" ✓ | rises a full viewport, tilt **+2.2° → 0**, left top corner high |
> | outgoing | "tilts away on a circular path" ✓ | drifts **up ~31%, left ~5%**, rotating to **−2.2°** |
> | the lens | "passes through a lens … distorts" | **not a lens — a darkening.** Luminance falls to ~0.42, i.e. ~55% black |
> | — | — | outgoing **leads** the incoming by ~100ms |
>
> `--e-arc` is worth calling out: fitted against the measured rise it is the **worst** of the four easing tokens (rms 0.43, against 0.02 for the fitted curve). It is symmetric ease-in-out; the reference is a brief ease-in into a very long ease-out tail. `--e-page` was added to `tokens.css` and `motion-v4.ts` rather than bending an existing token to a shape it is not.
>
> **The layering is the move, and it is not in the original sentence.** *"Tilts away … while the next rises from beneath"* reads as the old page getting out of the way to reveal the new one. It is the opposite: **the incoming page slides up and over the outgoing one and buries it.** The outgoing page never clears the viewport — it drifts about a third of a screen and is covered. Frame 57 proves it: the outgoing heading has reached y≈165, putting that page's own bottom edge near y≈630, while the seam between the two pages sits at y≈272. The outgoing page still occupies 272→630 and none of it is visible.
>
> Two builds were wrong because of this. The first raised a blank sheet; the second showed the real page but put the *outgoing* one on top, so the incoming was hidden behind a slab that drifted 20% of a screen and then vanished. That reads as a dissolve, not a page turn.
>
> Mechanism: the App Router only ever mounts one route tree, so the outgoing page is captured as a `cloneNode` inside a fixed, viewport-sized clip window offset by the scroll position, sitting *under* the live incoming page. The fixed chrome — aperture menu, grain, fluid — is not cloned and does not travel, which is what the reference does too.
>
> **Why this is a clone at all:** exoape is Nuxt/Vue, where Vue Router's `<Transition>` keeps the leaving and entering page components *both mounted* during a transition. Two real pages on screen is native there. React's App Router unmounts the old route the moment the new one commits. The browser-native equivalent is the View Transitions API — it snapshots both pages, composites them on the GPU, and its default paint order is already new-above-old. That is the better long-term answer; see checklist §5.10.

**Reduced motion.** Every reveal becomes instant. The scrubbed section becomes a single still. Non-negotiable.

---

## Section 1 — Arrival

**Job.** Make someone feel something before they read anything, and say what you do in one line.

**On screen.**
- The object, floating, centre, lit by one cool rim
- Headline, top left, mixed weights, **partially occluded by the object**
- One supporting line and one button, bottom left
- Nothing else

Cut from the first sketch: the stacked cards top right, which fight the burger and belong further down. The bottom-right text block, which is a third focal point too many. Keep the giant low-opacity text only if it is the wordmark, never if it is the `h1`.

Four elements. On white, that reads as expensive. Seven reads as busy.

**The occlusion is the whole trick.** Text passing behind the object and other text in front of it is the one move that proves the object exists in space rather than being pasted on. Production consequence: the render exports **with alpha**, as WebP, and the type sits in two DOM layers, one behind and one in front. This reaches back into the Blender setup, so it is decided here.

**SEO.** The `h1` lives here, as real DOM text, containing the primary term. Never inside the canvas. [SEO, expanded 2026-08-17:] the pre-rendered pipeline makes this section CWV-safe by construction — the LCP element is the headline or the object's poster frame (a real image, painting before any JS), and the object's box is **reserved at its calculable envelope** (explicit dimensions / aspect-ratio) so nothing shifts when media arrives. LCP < 2.5s, CLS < 0.1 are the thresholds, measured on field data.

**Entrance.** No entrance. It is already there on load. The object holds a constant idle rotation, one full turn per **5 seconds** (amended twice: 40s and a 20s retry read too slow, 2026-08-17; then the user picked 5s over 10s off the worn-ring previews the same evening — visible life outranks stealth), the ring counter-spinning about its own axis while its plane holds the decided attitude. The speed is an encode-time choice: the loop renders 120 frames per turn regardless, and the playback rate fed to the 60fps interpolation sets the period.

**Handoff.** On scroll the object drifts up and back, losing scale and gaining blur, while the headline layers separate slightly at different rates. The hero does not slide away, it recedes.

**3D.** Present. Primary.

---

## Section 2 — The claim

**Job.** The only place on the page where you speak completely plainly.

**On screen.** One large statement in `h1` or `display`, using the 200 to 600 weight jump for emphasis on two or three words. One paragraph beneath at `body`, capped at 68 characters per line. Nothing else on the screen at all.

Content: what Konaverse does and who for. This is where "we build a story through a website" earns its place, and where the positioning gets stated once and never repeated.

[SEO, 2026-08-17:] this section carries the **direct-answer duty** for the whole homepage — 44.2% of AI citations come from the first 30% of a page, so the claim plus its paragraph must work as a liftable, self-contained statement of what Konaverse is, does, and for whom. Written for a human first; extractable by construction, not by keyword-stuffing.

**Entrance.** Headline resolves first, one continuous block rather than word by word. Paragraph follows 80ms later. Deliberately restrained: the emptiness around it is the effect.

**Handoff.** A hairline rule enters from the left over `--d-slow`, drawing across the full content width. This is the section break with no label attached, and it is the only decorative element the page allows itself.

**3D.** Absent.

---

## Section 3 — What we solve

**Job.** Catch the visitor who has a symptom rather than a solution, and carry the problem cluster.

**On screen.** Three or four problem statements, stacked vertically, each one line of `h2` with two lines of `body` beneath. Written as the client would say it, not as you would categorise it. "Your site looks like everyone else's." "Visitors leave before they understand what you do."

~~Each links to the matching post in the problem cluster.~~ **Superseded — no links here.** Seven problem posts linked from the homepage was the actual "twenty places" that architecture §8 rules out, and it leaked authority straight past the services hub. The problems are stated as **plain text only**.

**This is still the section that feeds AI search**, because it states questions plainly and answers them plainly — and that works on the strength of the DOM text, not on the anchors. The problem cluster is reached from the footer map and from the service pages, which is where §8 wants that traffic routed.

**Entrance.** Staggered, 80ms apart, top to bottom. Each item reveals as it crosses the trigger point rather than all together, so the section builds as you move through it.

**Handoff.** Vertical space alone. No rule here. Alternating the break treatment between space and hairline is what stops the rhythm becoming mechanical.

**3D.** Absent.

---

## Section 4 — What we do

**Job.** The service cluster. Route commercial intent into the service pages.

**On screen.** Four to six services as a list, not a card grid. Each row: service name at `h3`, one line of `body`. Hairline between rows. **One arrow link at the end of the list, to `/services`** — the rows themselves are not individually linked.

~~Each row: an arrow link.~~ **Superseded.** Per-row links would send the homepage to six service pages and bypass the hub, which is exactly the flow architecture §8 forbids. The hub is what fans out. The rows still name every service in real DOM text, so nothing is lost for search — only the anchors move.

A list beats cards here for two reasons. Cards are the most template-like pattern in existence, and a list holds more services without the page getting taller.

**Design consequence, and it is a real one.** A list of services where the rows are not clickable will read as broken unless the single hub link is unmistakable. Whatever the rows do on hover, they must not imply navigation they do not provide — no arrow chip per row, no row-wide cursor change. The hub link at the foot of the list carries the whole affordance and should be weighted accordingly.

**Entrance.** Rows reveal in sequence, 60ms apart, faster than section 3 because there are more of them and a slow stagger would feel like waiting.

**Hover.** ~~The row lifts slightly and the hairline brightens toward ice.~~ **Reassigned to the hub link.** A lift-and-brighten on a row that cannot be clicked is a promise the page does not keep. The rows get no hover state at all; the accent moment moves to the single `/services` link, where the hairline beneath it draws toward ice on `--e-settle`. That is still one of the four or five places the accent appears on the page.

**Handoff.** The last hairline extends full bleed to both edges of the viewport, which visually opens the page out just before the work section.

**3D.** Absent.

---

## Section 5 — Selected work

**Job.** Proof. This is the section that actually sells.

**Mechanic — DECIDED (2026-08-17): the page-turn, scrubbed.** The section is pinned for
`(N−1) × 120vh` and scroll drives the page transition's own grammar: each project is a
full-bleed sheet; the next rises tilted +2.2° behind a seam shadow and buries the current
one, which lifts 31%, drifts 5% left, swells to 1.05 and dims to 0.18 progressively —
identical numbers to `PageTransition.tsx`, mapped linearly to scroll (the hand supplies the
easing; Lenis supplies the smoothing). **No dwell — user call, 2026-08-17:** the first cut
held each sheet still for 40% of its segment and it read as a pin; now the turns run
back-to-back as one continuous motion, each sheet whole on screen for exactly the instant
between arriving and being buried. Sheets are **bled 6% past every viewport edge** so the
tilt, drift and swell never expose bare ground, which also keeps a waiting sheet's tilted
corner below the fold until its turn. **The mini window** (added 2026-08-17, "keep the
sheets AND the giats mechanic"): a pinned window right-of-centre whose image layers never
move — each layer is clip-path'd per tick to the region below the incoming sheet's REAL
top edge (same math, tilt included), so the only thing that ever happens inside it is the
edge wiping through, exactly the stationary-image/moving-clip trick the giats stack is
built on. When no edge is crossing, the window is still; its outgoing layer takes the same
0.18 dim on the same clock. Scrub-only, hidden under 900px and in the static fallback.
Clicking a sheet hands off into the real transition mid-language —
the section teaches the navigation. This supersedes the earlier "one per viewport or two
side by side" and replaces the ported giats stacking-parallax outright: that was someone
else's move, and the user asked for a continuous mechanic of our own. Built as
`src/components/v4/ProjectSheets.tsx`; at rest (no JS, reduced motion) it degrades to a
plain vertical sequence of full-height projects.

**On screen.** Three projects, one full-bleed sheet each. Each: image, project name at
display scale (amended from `h3` — a full-bleed sheet with a timid caption reads as
apology), one line describing the work, year. No categories, no filters, no tags.

**Links — DECIDED. Each tile is a link to its own case study**, plus one link to `/projects`. Four links out of this section.

An image with a project name under it reads as a link whether or not it is one, so unlinked tiles would have been a promise the page breaks — and this is the section that actually sells. Architecture §8 is amended to allow it (see that document), and the flow still closes: each case study links back to the service page that produced it, so authority circulates rather than leaking. It also fixes something §3 of the architecture complains about directly — the case studies are the strongest asset already owned and are *currently doing nothing*. A homepage link is the cheapest way to change that.

**Why the tiles are links and the service rows are not.** Not an inconsistency. Tiles are images, and an image is self-evidently clickable. Section 4's rows are text in a list that ends with a single hub link, and the hub is what fans out to six service pages — bypassing it would spray the homepage across the whole service cluster. Different mechanics, different answer.

**Client work supplies the only colour on this page.** That is why the palette has no real accent, and it is a genuine argument in a portfolio rather than a limitation.

**Entrance.** Image reveals from the refraction state. Text 80ms behind it. Project images are the heaviest assets above the fold-line of most sessions, so these lazy load with a low-quality placeholder in mist.

**Hover.** ~~Tile lifts on `--lift-3`. The cursor lens strengthens over the image.~~ The
lens is gone and a full-bleed sheet has nowhere to lift to. The hover is the arrow-link's
language: a hairline draws toward ice under the project name (amended 2026-08-17).

**Handoff.** The last sheet holds through its dwell, then the pin releases and the page
scrolls on. The earlier mist-darkening handoff belongs to section 6's design pass.

**3D.** Absent. Deliberately. The work has to stand on its own or it is not proof.

---

## Section 6 — The demonstration

**Job.** Prove the capability instead of describing it. This section justifies the top tier without a price being mentioned.

**On screen.** The object returns and **pins**. Scroll scrubs its rotation and its material state, from opaque to transparent, or frosted to clear. Two or three short lines of text appear and dissolve at fixed points in the scrub, positioned around the object, never overlapping it.

[SEO, 2026-08-17:] those lines are **real DOM text, present in the raw HTML**, shown stacked and static in the no-JS / reduced-motion fallback alongside the single still. The scrub choreographs when they're *seen*; it never decides whether they *exist*.

**Length.** Roughly 250 to 300 viewport-height percent of pinned scroll. Shorter and it feels like a gimmick. Longer and people leave.

**Entrance.** The section pins at the top of the viewport and the scrub begins immediately. There is no separate entrance animation, because the scrub is the animation.

**Technical.** Baked Blender frame sequence, 120 frames, WebP. **MEASURED (2026-08-17, delivery validation): ~4.2MB at 1600px q82**, extrapolated from an every-12th-frame render — frost frames cost ~29KB, the jewel's prism fire 50–60KB, the dissolve's final frame 4.6KB of almost-nothing. A full 640px validation set (all 120 frames, 1.54MB) scrubs cleanly under real wheel events on `/object-scrub`; the mechanic is `ObjectScrub.tsx`, the frames come from `blender/blockout.py --scrub`. This is the single heaviest thing on the site and there is exactly one of them. First paint is a still, sequence preloads during section 5.

**Handoff.** The object dissolves into white on the final frames. Pin releases. This is the one place a fade is allowed, because it is an overexposure, which is the direction's own logic.

**3D.** Present. Primary. This is the payoff for the whole page.

---

## Section 7 — How we work

**Job.** Reduce the perceived risk of spending four thousand euro with a small studio.

**On screen.** Three or four steps, horizontal on desktop, stacked on mobile. Each: a short title at `h3` and two lines at `body`. Honest about timelines.

**Entrance.** Steps reveal left to right, 100ms apart, so the sequence itself reads as a process.

**Handoff.** Vertical space.

**3D.** Absent.

---

## Section 8 — What it costs

**Job.** Answer the question before it is asked, and qualify the wrong leads out.

**On screen.** Three tiers as ranges, not a feature comparison table. Name, starting figure, one line on what it suits. **One link to `/pricing` — DECIDED**, for the full picture.

[SEO, 2026-08-17:] the figures are **real numbers in real DOM text** — "from €4,000" is citable by an AI engine; "contact us for pricing" is invisible to one. Cited pages carry more discrete facts than uncited ones, and this section plus section 2 are the homepage's two fact-carriers.

Pricing is one of the two things people already ask on WhatsApp (architecture §5), so routing them to the footer for it was a real cost for no real gain. One deliberate line, using the arrow link.

**Do not build a three-column table with ticks and crosses.** That is SaaS furniture. It will look wrong in Whiteout and cheap for the tier you are selling. Three lines of text with generous space between them will read as more confident and more expensive.

**Entrance.** Standard reveal, staggered.

**Handoff.** A hairline, then the largest block of vertical space on the page. The emptiness before the closing section is doing work.

**3D.** Absent.

---

## Section 9 — The invitation

**Job.** Make contact feel like the obvious next move rather than a form.

**On screen.** One line at `display` size. One button. An email address as real text. Nothing else. No form on the homepage, forms belong on `/contact`.

**Entrance.** The line resolves slowly, at the very slow end of `--d-slow`. This is the last thing anyone reads and it can afford to take its time.

**3D.** Absent.

---

## Footer

Full site map, quiet, at `small`. Every URL appears here and only here. Legal links, the location line for local SEO, social. Hairline above it and nothing else decorative.

---

## Decided

- **Nav is a horizontal bar on desktop, the burger/aperture below 57.5rem.** Contact always outside the set. **Amended 2026-08-16** — the aperture's full-screen overlay closed back over the page transition and made it unwatchable. Reasoning under *Global behaviour · Nav*.
- **Outbound links follow architecture §8** — services hub, work hub, contact. Sections 3, 4, 5 and 8 rewritten above; the two exceptions flagged inline (clickable project tiles, the `/pricing` link) are **both decided in favour** and folded into their sections.
- **Sections 3 and 4 stay separate.** They catch different search intent, and merging them would put two ideas in one viewport.
- **Section 5 is the page-turn**, superseding the earlier one-per-viewport / two-up question. Built as `ProjectSheets.tsx`; the section carries the decision inline.

## The object — DECIDED 2026-08-17

The prior question this document deferred on — *how Blender output actually reaches a
browser* — is answered, and the object itself is chosen. Both were user decisions in one
sitting; detail lives in the pre-design checklist and memory.

**Pipeline: Blender (Cycles), delivered pre-rendered. Never a live Three.js scene.**
Realism is the requirement, realism comes from path tracing, and a browser cannot path-trace
— every real-time attempt read as plastic. Two delivery forms: a **video loop** for ambient
presence (same spec family as the project-card videos) and a **scroll-scrubbed frame
sequence** where the object must answer scroll (§6). Whiteout makes this cheap: render on
pure white and it composites invisibly — no alpha-video codecs — with **alpha WebP** stills
or sequences where the occlusion trick needs a true silhouette. The scene's rim light is
`--ice`, which the token file already names "object tint". The §6 numbers are now
MEASURED (2026-08-17, delivery validation): 120 frames at 1600px is ~4.2MB WebP —
inside the 4–8MB envelope. 250–300vh is the one §6 number still unfelt at full scale.

**The object: a frosted ice cube inside a counter-rotating ring.** The user's concept, and
it earns its place three ways:

- **A calculable envelope.** The ring sweeps a fixed annulus and the cube tumbles inside a
  known sphere, so section 1 can be laid out against an honest bounding circle before the
  final render exists.
- **Frost is load-bearing, not aesthetic.** Baked renders cannot refract live DOM text, so a
  clear object behind the headline would break the illusion; a frosted one *occludes*, which
  baked alpha does perfectly. The hero's occlusion trick survives the pipeline because of
  the material.
- **The material is the story.** §6's scrub — frosted resolving to clear — becomes the page's
  argument: something opaque made legible. The cube gets an **authored interior — DECIDED
  2026-08-17: a suspended precision lattice (the ring's material inside the ice) with sparse
  trapped air around it** — so clarity *reveals* something; an empty cube going clear ends
  with nothing. Structure carries the argument, the air carries the realism; the bubbles get
  dialed finer in the material pass so the frame stays the subject.

The risk is named: cube + ring are 3D's hello-world primitives. What keeps this out of that
bucket is render craft (micro-bevels, imperfect frost, real dispersion) and the interior.
**First Blender session is a blockout, not modelling**: rough frost material, one HDRI, a
dozen proportion studies — ring thickness, cube-to-ring ratio, axis tilts. Proportions
decide whether it reads as an instrument or a logo.

**Blockout session 1 decided (2026-08-17), off two contact sheets:** cube-to-ring ratio
**1.35** (ring major radius / cube tumble-sphere radius; 1.15 read as an accessory stuck on
the cube, 1.60 as an orbit logo), band thickness 4.5% of ring radius (2% vanishes at
progress-indicator size, 8% reads as jewelry), hero attitude v1 = ring tipped 60° from
horizontal, swung −25° off the camera axis, cube corner-forward (three faces reading; the
band crossed behind the cube's top corner and in front at the bottom),
interior = the combo above (contact-sheet-3).

**Re-decided (user, 2026-08-17 evening, off the ringpose sheet — `rp_t072_p100`):** band
thickness up to **7.2%**, hero attitude v2 = **ring dead face-on to the camera** (euler
74°, 0°, 28° against the default cam az 28 / el 16), cube corner-forward unchanged. The
face-on badge read was bracketed on the sheet deliberately and the user chose the badge;
the v1 interlock (band crossing in front/behind the cube) is retired with it. Consequence:
face-on, the counter-spin has no crossing band or edge glint to read from, so the satin
gains **machining wear** (`satin_worn` in blockout.py) — rotationally asymmetric marks in
object space that travel with the metal and make the spin visible; the idle also runs at
constant angular velocity (the keyframe-ease bug is fixed — see `linear_keys`). Rig and
studies: `blender/blockout.py`, renders in `blender/renders/blockout/`, reference still
`hero-ref.png` (frosted, §1) and `clear-ref.png` (clear, §6's far end). **The clear state
renders as dark glass** — transmission rays see the HDRI, not the page white. First flagged
as an artifact, then **kept as design (user, 2026-08-17: "generally I love the clear")**:
the reveal's payoff is a dark jewel, the page's one dark moment on all that white, before
the final handoff frames overexpose to white. Feeding white to transmission rays is
reserved for those dissolve frames only — never "fix" the clear state to whiteness.

**Sections 1 and 6 are designed against test renders, never against a placeholder box** —
the hero's layout hangs off the real silhouette. Everything else on this page — sections 2,
3, 4, 5, 7, 8, 9 and the footer — is designable now and does not touch 3D.

## Still open

1. **Does the pinned demonstration come before or after the work.** Currently after, so proof precedes demonstration. The reverse is defensible if you want to lead with capability.
