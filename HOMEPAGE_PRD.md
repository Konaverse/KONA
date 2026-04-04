# Konaverse Homepage — Product Requirements Document

**Project:** Konaverse Agency Homepage
**Stack:** Next.js, GSAP, Lenis, ScrollTrigger, SplitText
**Skill:** `/scrollytelling` — read and internalize this skill before writing a single line of code. It defines the philosophy, the technical constraints, and the creative mindset. The code patterns inside it are primitives to builwd *from*, not templates to copy.

---

## What We Are Building

This is not a website. It is a directed cinematic experience that happens to live in a browser.

Konaverse is a digital agency based in Cyprus. The brand identity is dark cinematic noir — obsidian backgrounds, a single neon green accent (`#00ff88`), Monument Extended for display type, Geist Sans for body. The homepage must communicate one thing above all else: **this agency operates at a level most people haven't seen before.**

The user should finish scrolling this page feeling like they just watched a short film. Not like they browsed a portfolio.

Every section transition, every text reveal, every background shift is a narrative decision. Scroll is the story. The user's finger is the playback head.

---

## Brand Parameters

```
Background:     #080808
Accent:         #00ff88 (one element per section maximum — never two)
Display font:   Monument Extended
Body font:      Geist Sans / Geist Mono
Tone:           Dark, precise, cinematic, confident — never loud, never playful
Character:      The Architect (obsidian humanoid, glowing emerald cracks) — present in CTA
```

---

## Emotional Arc

```
Intrigue → Recognition → Trust → Desire → Action
```

The user arrives curious. They leave convinced.

---

## The One Cinematic Moment

The xray reveal in the hero. A laptop's polished black exterior dissolves under scroll control to expose its internal wiring — lightning, color-bleeding circuits, raw electricity. This is the visual thesis of the entire page: **Konaverse shows you what's underneath.**

Everything else on the page is in service of earning that moment and following through on its promise.

---

## Full Scroll Map

### BEAT 1 — The Arrival
**Section:** Hero Entry
**Archetype:** The Companion
**Assets needed:** Entry video (laptop corner drifting into frame, settling)

Page loads to pure black. No UI chrome, no navigation visible yet. The entry video plays automatically — a close-up of a laptop's bottom-left corner, tilted, drifting into the viewport from darkness. It settles. Holds.

Once the video ends and the frame is still, text materializes on the left half of the screen. Large, stacked, Monument Extended. One word in `#00ff88`. The right half is the laptop — floating in black space, tilted, cinematic.

No scroll prompt. No arrows. The page simply exists and waits.

**Claude's initiative zone:** How the text arrives matters enormously. Don't default to a simple fade. Consider: does it assemble from characters? Does it arrive word by word with weight? Does the `#00ff88` word arrive last, like a reveal? Make a decision and commit to it. The arrival of this text is the user's first impression of the brand voice.

---

### BEAT 2 — The Reveal
**Section:** Hero Scroll Zone
**Archetype:** The Anchor + The Transform
**Assets needed:** Scrub video (laptop exterior → xray interior transition, Google Flow start/end frames)

The user begins scrolling. The page pins itself. The viewport is now a film editing suite — the user's scroll position controls the video's playback frame by frame.

The laptop transforms. The polished black exterior dissolves. Internal wiring emerges. Circuit colors bleed in from the edges. Lightning crawls across the internals. By full scroll progress: the laptop is fully exposed, electric, alive.

Text on the left reacts in parallax — different words at different speeds, creating depth layers. The `#00ff88` element has a subtle relationship with scroll progress — it might intensify, pulse, or shift slightly as the xray deepens.

At 100% progress the pin releases.

**Claude's initiative zone:** The text on the left during the scrub zone is a creative decision. It could be a single large statement that stays static while the visual transforms around it — the contrast of stillness and transformation. It could be multiple statements that fade in/out at different scroll percentages. It could be a single word that changes as the video progresses. Think about what relationship the text has with the transformation happening on the right. Make it intentional.

---

### BEAT 3 — Who We Serve
**Section:** Client Archetypes
**Archetype:** The Chronicle + The Drift
**Assets needed:** Three atmospheric background images or video loops (one per archetype) — cinematic, wide, not literal. Think mood, not subject matter.

Clean break from the hero. Full viewport section.

Three client archetypes scroll through — *Builders. Brands. Visionaries.* Each archetype has its own full-viewport background image that reacts differently to scroll:
- **Builders** — slow zoom in. Intensity, pressure, focus.
- **Brands** — lateral slide. Momentum, forward motion.
- **Visionaries** — slow zoom out. Revelation, scale, ambition.

The background transitions between archetypes are not cuts — they are dissolves driven by scroll progress. The text is pinned and rewrites itself per archetype. Large typographic label. Supporting copy reveals line by line beneath it. A dark gradient on the lower third keeps text readable at all times.

**Claude's initiative zone:** The background images are atmospheric — Claude should think carefully about what each movement communicates and make sure the parallax speed and easing of each one reinforces the emotional quality of that archetype. Also: how does the text *change* between archetypes? Does the old text exit before the new one enters? Do they overlap? Is there a beat of pure background between them? Design the transition, not just the states.

---

### BEAT 4 — Services
**Section:** Service Cards
**Archetype:** The Hijack + The Takeover
**Assets needed:** One cinematic image per service — not literal, metaphorical. Film stills, not stock. See asset brief below.

Vertical scroll converts to horizontal travel. Five service cards. But each card is an experience, not a panel.

**The arc per service — three acts:**

*Act 1 — Approach:* Full viewport, dark. A small service image enters from the right edge of the viewport — like a polaroid floating in darkness. It travels toward center as scroll progresses.

*Act 2 — Lock:* Image reaches center. Still small. User keeps scrolling. The image begins blooming outward from its center point — expanding to consume the full viewport. This is the moment.

*Act 3 — Inhabit:* Image is now full viewport. Service name, one-line descriptor appear over it. The next service's small image is already peeking in from behind — layered depth, not a flat conveyor. Then the current image releases and the cycle begins again.

**Services:**
- Web Development
- Web Applications
- Videography
- Digital Advertising
- Social Media Management

**Claude's initiative zone:** The mechanical description above is the minimum. The question is: what does each service *feel* like to inhabit? Web Development might feel precise and architectural — the image is sharp, the text arrives with geometric precision. Videography might feel cinematic and warm — the image blooms slower, the text fades in like a title card. Social Media might feel alive and kinetic. Let the personality of each service inform how its card behaves, not just what it shows. Differentiate the micro-interactions per card if it serves the experience.

---

### BEAT 5 — Projects
**Section:** Featured Work
**Archetype:** The Chronicle
**Assets needed:** Project visuals — stills or short looping videos (3–4 projects)

Full viewport, pinned. Left side: large project number in Monument Extended, stacked project title beneath it, one-line descriptor that reveals itself. Right side: project visual — a still or subtle loop.

As scroll progresses through the pin zone, the project increments. Number counts up. Title rewrites itself with a transition. Visual crossfades. A `#00ff88` line draws itself beneath the active project title — like an underline being written in real time.

**Claude's initiative zone:** The counter and title transition is a design decision. Does the old title exit upward while the new one enters from below? Does it glitch-transition — a brief moment of corrupted text before resolving? Does the number animate with a fast count-up or does it cut cleanly? The `#00ff88` underline drawing itself is a detail — but details like this are what people remember. Make it feel like it's being signed, not rendered.

---

### BEAT 6 — The Philosophy
**Section:** Manifesto
**Archetype:** The Reveal
**Assets needed:** None. Pure typography.

One full black screen. No images. No decorative elements.

A single statement assembles itself as the user scrolls slowly through it. Word by word. Each word arrives with weight and intention. The `#00ff88` accent lands on the most important word — not the last word necessarily, the *right* word.

This is the breathing room. The inhale before the CTA. After the visual intensity of what came before, the contrast of pure black and pure text is the most powerful thing on the page.

**Claude's initiative zone:** Choose the statement. It should be 6–10 words. It should sound like something The Architect would say — precise, confident, slightly unsettling in how accurate it is. It should make an agency principal reading it feel seen. Propose 3 options and implement the strongest one. Also: the word-by-word assembly mechanic has many variations — consider whether words arrive from below (the standard), whether they arrive with a brief blur that sharpens, whether they arrive at slightly irregular intervals to feel spoken rather than rendered.

---

### BEAT 7 — CTA
**Section:** The Landing
**Archetype:** The Takeover
**Assets needed:** The Architect character asset (obsidian humanoid, glowing emerald cracks) — subtle, not dominant

A panel rises from below — deep dark, faint noise grain texture. The Architect is present here, positioned compositionally so it feels like a presence in the room, not a mascot on a page.

Large headline. Two primary actions: **Start a Project** and **See Our Work** — styled differently so there's a clear primary and secondary. Contact details minimal beneath. No footer noise.

The page ends in the same darkness it began. The world doesn't change. The user has traveled through it and arrived somewhere.

**Claude's initiative zone:** The Architect's presence here should feel earned. It appeared in the brand video, it's been implied throughout the page, and now it reveals itself. Think about how it enters this section — does it already exist when the panel rises, or does it materialize as the user scrolls into the section? The CTA buttons should not look like standard buttons. They should feel like the rest of the page — dark, intentional, with hover states that feel alive. The `#00ff88` belongs on the primary action.

---

## Technical Constraints

- **No Three.js, no WebGL, no canvas** — pure DOM, GSAP, Lenis, CSS transforms
- **Register all GSAP plugins once** in `utils/gsap.ts` — never inline
- **`useLayoutEffect` only** for all GSAP animations in React
- **Always `ctx.revert()`** in cleanup — no exceptions
- **Only animate** `transform` and `opacity` — never layout properties
- **Lenis must sync** with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
- **`will-change: transform`** on every animated element — set in CSS
- **Mobile:** reduce parallax intensity by 50%, respect `prefers-reduced-motion`
- **Video files** must be re-encoded with ffmpeg before use: `ffmpeg -i input.mp4 -vcodec libx264 -crf 18 -preset slow -g 1 -an output.mp4`

---

## Asset Brief for Google Flow

Generate these before starting each section. Brief per asset:

**Hero Entry Video (Beat 1)**
Start frame: Pure black
End frame: Close-up of laptop bottom-left corner, tilted ~15°, floating in dark space. Left half of frame is deep black (text zone). The laptop surface is obsidian — dark aluminum, subtle reflections. Cinematic, not product-photography.

**Hero Scrub Video (Beat 2)**
Start frame: Same laptop corner, settled, exterior view. Dark, minimal.
End frame: Same laptop angle but xray — internal wiring visible, circuit traces glowing in multiple colors, lightning arcing between components, electric blue and emerald green dominant. The transformation should feel like looking through the surface into another world.

**Who We Serve Backgrounds (Beat 3) — 3 images**
- Builders: Wide shot, brutalist architecture or industrial space, dramatic directional lighting, monochromatic with one warm light source. Night or near-dark.
- Brands: Urban environment, motion blur, neon reflections on wet surfaces. Movement implied even in stillness.
- Visionaries: Aerial or extreme wide shot — vast scale, tiny human element or none at all. The feeling of seeing the whole board.

**Service Images (Beat 4) — 5 images, metaphorical not literal**
- Web Development: Architectural blueprint lit from beneath in cold green light. Grid lines, precision, depth.
- Web Applications: A control room or cockpit at night — screens glowing, systems alive, no operator visible.
- Videography: A single strip of film held up to a light source. The frames are dark silhouettes but backlit with warmth.
- Digital Advertising: A city billboard at 3am, lit but empty. The space before the message arrives.
- Social Media: A crowded intersection shot from directly above. People as nodes in a network.

**Projects (Beat 5)**
Actual project visuals from Konaverse's portfolio — GL Metal Works, Efstathiou Construction, Desy Interiors, Pelasgos Homes. Pull the strongest visual from each.

**The Architect (Beat 7)**
Obsidian humanoid figure, glowing emerald green cracks along the surface. Dark background. Compositionally positioned left or right of center. The presence should feel architectural, not aggressive — like something that was always there.

---

## How to Work

Build section by section. Each section will be handed to you with its assets ready. Read the full PRD before starting any section so you understand where each piece sits in the larger narrative.

When you see a **Claude's initiative zone**, that is an explicit invitation to make creative decisions, propose alternatives, and push the interaction further than what's described. The PRD is a director's brief, not a specification document. You have a vision to serve and latitude to serve it well.

The `/scrollytelling` skill is your technical and philosophical foundation. Read it before you start. When in doubt about an interaction, return to the skill's core question: *what does this moment make the user feel?*
