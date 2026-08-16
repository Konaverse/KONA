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

**Scroll.** Smooth scroll with light inertia. Deceleration, never a hard stop.

**Section rhythm.** `--section-y` on every break, held exactly. With no labels announcing sections, uneven spacing reads as a mistake rather than a variation.

**Reveal.** Nothing fades. Everything resolves from a displaced blurred state, `--reveal-blur` 14px to 0 and `--reveal-shift` 18px to 0 over `--d-slow` on `--e-glass`. This is the signature and it never varies.

**Stagger.** Multiple elements in one section stagger 80ms apart. Headline first, supporting text second, everything else third. Never more than four stagger steps in one section.

**Trigger point.** Reveals fire when the element is 15% into the viewport, not at the edge. Firing at the edge means the animation is over before it is properly visible.

**Cursor lens.** Present site-wide at `--lens-scale` 1.06. Strengthens over the hero and project tiles, weakens over body copy where it would hurt reading.

**Progress indicator.** A miniature of the 3D object, near the burger, rotating in proportion to scroll position. Where you are in the page is expressed as where the object has turned to. This carries the wayfinding that the removed labels used to provide, so it is functional rather than ornamental.

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

**SEO.** The `h1` lives here, as real DOM text, containing the primary term. Never inside the canvas.

**Entrance.** No entrance. It is already there on load. The object holds a slow idle rotation, one full turn in roughly 40 seconds, slow enough that you are not certain it is moving.

**Handoff.** On scroll the object drifts up and back, losing scale and gaining blur, while the headline layers separate slightly at different rates. The hero does not slide away, it recedes.

**3D.** Present. Primary.

---

## Section 2 — The claim

**Job.** The only place on the page where you speak completely plainly.

**On screen.** One large statement in `h1` or `display`, using the 200 to 600 weight jump for emphasis on two or three words. One paragraph beneath at `body`, capped at 68 characters per line. Nothing else on the screen at all.

Content: what Konaverse does and who for. This is where "we build a story through a website" earns its place, and where the positioning gets stated once and never repeated.

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

**On screen.** Three projects, generously spaced, one per viewport or two side by side with a large offset. Each: image, project name at `h3`, one line describing the work. No categories, no filters, no tags.

**Links — DECIDED. Each tile is a link to its own case study**, plus one link to `/projects`. Four links out of this section.

An image with a project name under it reads as a link whether or not it is one, so unlinked tiles would have been a promise the page breaks — and this is the section that actually sells. Architecture §8 is amended to allow it (see that document), and the flow still closes: each case study links back to the service page that produced it, so authority circulates rather than leaking. It also fixes something §3 of the architecture complains about directly — the case studies are the strongest asset already owned and are *currently doing nothing*. A homepage link is the cheapest way to change that.

**Why the tiles are links and the service rows are not.** Not an inconsistency. Tiles are images, and an image is self-evidently clickable. Section 4's rows are text in a list that ends with a single hub link, and the hub is what fans out to six service pages — bypassing it would spray the homepage across the whole service cluster. Different mechanics, different answer.

**Client work supplies the only colour on this page.** That is why the palette has no real accent, and it is a genuine argument in a portfolio rather than a limitation.

**Entrance.** Image reveals from the refraction state. Text 80ms behind it. Project images are the heaviest assets above the fold-line of most sessions, so these lazy load with a low-quality placeholder in mist.

**Hover.** Tile lifts on `--lift-3`. The cursor lens strengthens over the image.

**Handoff.** The last project holds, then the whole section darkens very slightly toward mist as section 6 pins. That tonal shift is the only warning that something is about to happen.

**3D.** Absent. Deliberately. The work has to stand on its own or it is not proof.

---

## Section 6 — The demonstration

**Job.** Prove the capability instead of describing it. This section justifies the top tier without a price being mentioned.

**On screen.** The object returns and **pins**. Scroll scrubs its rotation and its material state, from opaque to transparent, or frosted to clear. Two or three short lines of text appear and dissolve at fixed points in the scrub, positioned around the object, never overlapping it.

**Length.** Roughly 250 to 300 viewport-height percent of pinned scroll. Shorter and it feels like a gimmick. Longer and people leave.

**Entrance.** The section pins at the top of the viewport and the scrub begins immediately. There is no separate entrance animation, because the scrub is the animation.

**Technical.** Baked Blender frame sequence, 120 frames, WebP, roughly 4 to 8MB at 1600px. This is the single heaviest thing on the site and there is exactly one of them. First paint is a still, sequence preloads during section 5.

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
- **Outbound links follow architecture §8** — services hub, work hub, contact. Sections 3, 4, 5 and 8 rewritten above; two exceptions flagged inline for a decision.
- **Sections 3 and 4 stay separate.** They catch different search intent, and merging them would put two ideas in one viewport.

## Deferred

- **Everything 3D — the object, sections 1 and 6, the frame pipeline.** Blocked on a prior question that has not been answered yet: *how Blender output actually reaches a browser.* Baked frame sequence, glTF with real-time lighting, or a rendered video are three different production pipelines with three different budgets, and the choice reaches back into the modelling and lighting setup — so it cannot be decided from the design side alone.

  Until that conversation happens, **sections 1 and 6 are not designable**, and the numbers in §6 (120 frames, 4–8MB, 250–300vh) are placeholders, not commitments. See `REDESIGN.md` §6 for the frame-count evidence carried over from the v3.1 build, which is relevant input to that conversation.

  Everything else on this page — sections 2, 3, 4, 5, 7, 8, 9 and the footer — is fully designable now and does not touch 3D.

## Still open

1. **Two projects side by side or one per viewport** in section 5. Depends on how strong the project images are.
2. **Does the pinned demonstration come before or after the work.** Currently after, so proof precedes demonstration. The reverse is defensible if you want to lead with capability. *(Downstream of the 3D conversation — section 6 is the pinned one.)*
3. **The two link exceptions** flagged in sections 5 and 8: clickable project tiles, and a `/pricing` link.
