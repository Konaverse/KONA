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

**Nav.** Burger, with contact remaining visible outside it. Someone who wants to hire you should never have to open a menu to find out how.

**Page transitions.** The exoape arc. Outgoing view tilts away on a circular path while the next rises from beneath, and passes through a lens on the overlap so it distorts as it leaves. `--d-cinema` on `--e-arc`.

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

Each links to the matching post in the problem cluster. **This is the section that feeds AI search**, because it states questions plainly and answers them plainly.

**Entrance.** Staggered, 80ms apart, top to bottom. Each item reveals as it crosses the trigger point rather than all together, so the section builds as you move through it.

**Handoff.** Vertical space alone. No rule here. Alternating the break treatment between space and hairline is what stops the rhythm becoming mechanical.

**3D.** Absent.

---

## Section 4 — What we do

**Job.** The service cluster. Route commercial intent into the service pages.

**On screen.** Four to six services as a list, not a card grid. Each row: service name at `h3`, one line of `body`, an arrow link. Hairline between rows.

A list beats cards here for two reasons. Cards are the most template-like pattern in existence, and a list holds more services without the page getting taller.

**Entrance.** Rows reveal in sequence, 60ms apart, faster than section 3 because there are more of them and a slow stagger would feel like waiting.

**Hover.** The row lifts slightly on `--e-settle`, and the hairline beneath it brightens toward ice. This is one of the few places the accent appears.

**Handoff.** The last hairline extends full bleed to both edges of the viewport, which visually opens the page out just before the work section.

**3D.** Absent.

---

## Section 5 — Selected work

**Job.** Proof. This is the section that actually sells.

**On screen.** Three projects, generously spaced, one per viewport or two side by side with a large offset. Each: image, project name at `h3`, one line describing the work. No categories, no filters, no tags.

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

**On screen.** Three tiers as ranges, not a feature comparison table. Name, starting figure, one line on what it suits. Link to `/pricing` for the full picture.

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

## Open questions

1. **What is the object.** Everything in sections 1 and 6 depends on it and it is still undecided. It should bend light, and it should not be recognisable as anything from daily life.
2. **Two projects side by side or one per viewport** in section 5. Depends on how strong the project images are.
3. **Whether sections 3 and 4 are separate.** They could merge into one "problems and services" section if the page runs long. My view is keep them separate: they catch different search intent.
4. **Does the pinned section come before or after the work.** Currently after, so proof precedes demonstration. The reverse is defensible if you want to lead with capability.
