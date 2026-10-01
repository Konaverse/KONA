# Image prompts — services hub, service objects, toolset

Written 2026-10-01 for backlog items 5, 6c and 7b (set A rewritten twice the same day: now six varied realistic scenes; set B rewritten: floating tech with cables). There are 18 images in three sets. Generate them, drop them in `incoming/` at the repo root with the file names given below, and I'll grade, trim, convert to webp and wire them in.

## The house look (applies to every prompt)

The site is black-and-white tech noir: paper-white pages, black type, monochrome pictures. Objects (sets B and C) are one dark object, rich surface detail, studio-lit, cut out. Every prompt below already includes this look, so paste each one as it is.

- **Monochrome.** Black, white and greys, with at most a faint cool blue-grey in the shadows. No colour accents.
- **Objects are DARK.** On the service pages the giant tagline is drawn in a difference blend over the object. Letters crossing a mid-grey object turn mid-grey and vanish. Black or near-black materials (matte black, black chrome, smoked glass, obsidian) keep the cut readable.
- **No readable text, no logos, no brand marks** anywhere in a picture. Sets B and C carry no UI at all. Set A shows screens and interfaces, but their contents are always soft abstract blocks and lines, never legible words.
- **Cut-outs (sets B and C):** ask for a *transparent background*. ChatGPT / gpt-image can do this directly. If your tool can't, ask for a *plain flat white seamless background, no shadow on the ground*, and I'll cut it out. Keep the whole object in frame with some margin, and don't crop any edge.
- **Size:** the largest the tool gives. 2048 px on the long side is the minimum.

---

## A. Services hub cards: six realistic scenes (item 5)

*Third version, 2026-10-01. The first (objects in empty halls) was too AI and too abstract. The second (a person at a screen with a glass panel above it, six times) all looked the same.*

These replace the films and the object stand-ins in the carousel on /services. **Landscape 16:10.** Each card is one full-bleed picture.

**The idea:** each card is a real, believable photograph, as if we'd hired a photographer and then handed the shots to a retoucher, who adds ONE impossible thing per picture. The six are deliberately different: different places (desk, studio, street, workshop, city), different camera angles (overhead, close-up, wide, high), different light (lamp, strobes, morning sun, blue hour), and a different kind of edit each time. Only two of the six even show a screen.

**What holds the series together:**
- **The grade:** near-monochrome, desaturated and cool, deep blacks, soft highlights, fine film grain. If a result comes back in full colour, add *"desaturated, almost black and white"*.
- **The photography:** a full-frame camera, real light, real textures, candid people who never look at the camera. Hands are where AI gives itself away: regenerate any picture with wrong fingers.
- **The edit:** exactly one per picture, done in the photograph's own light and shadow, so it reads as retouched and not as CGI. No neon, no hologram glow.

There is no shared tail this time: each prompt carries its own camera and light. Every prompt still ends with *near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10*.

**A1 — Web Design** · *overhead, desk, paper becoming a layout* → `incoming/hub-web-design.png`
> Top-down photograph looking straight down onto a large worktable in a design studio. Two pairs of hands arrange cut-out paper pieces of a website on the table (rectangles for images, strips for headlines, small buttons) beside tracing paper, a steel ruler, pencils, a coffee cup and fabric swatches. The retouched element: some of the paper pieces have lifted off the table and hover a few centimetres above it, snapping into a clean page grid in mid-air, each casting a soft real shadow on the wood below. Soft window daylight from one side, overhead flat-lay, 35mm, everything sharp, near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10.

**A2 — Web Development** · *close side profile, night, the layout above the laptop* → `incoming/hub-web-development.png`
> Close side-profile photograph of a web developer at night, shot from desk height. The face is lit only by the laptop, and lines of code reflect faintly in their glasses. Hands are mid-typing, with slight motion blur on the fingers. The retouched element: just above the laptop lid, a thin pane of frosted glass floats in the air showing the website being built in pale abstract blocks, half of the blocks crisp and half still dissolving into place, its edge catching the screen light. Dark room, a desk lamp off, shallow depth of field at f/1.8, 50mm, near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10.

**A3 — 3D Websites** · *product studio, strobes, half object half mesh* → `incoming/hub-3d-websites.png`
> Photograph inside a product photography studio: a luxury wristwatch stands on a slowly turning white turntable under large softboxes and a strobe, a seamless backdrop curving behind it, and a 3D artist's hands adjusting a light stand at the edge of the frame. The retouched element: the watch splits down the middle. Its left half is the real polished object, and its right half continues as a precise 3D wireframe mesh of the same watch, fine white lines in the same lighting, as if the object were half photographed and half modelled. Crisp studio strobe light, 85mm, near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10.

**A4 — One-page Websites** · *outdoors, morning, the site down the shopfront* → `incoming/hub-one-page-websites.png`
> Street photograph on a quiet morning in an old Mediterranean town: the owner of a small corner café pulls up the metal shutter of the shopfront, and a cyclist passes, blurred. Low morning sun rakes across the stone and casts long shadows. The retouched element: the café's one-page website hangs down the building's façade like a tall printed banner, one long scroll from the hero at the top to a single button at the bottom near the door, laid out in pale abstract blocks, catching the same sunlight and shadows as the wall. Wide shot from across the street, 35mm, near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10.

**A5 — Website Redesign** · *workshop wall, peeling away the old site* → `incoming/hub-website-redesign.png`
> Photograph in a raw workshop with a concrete wall. A designer in an apron, seen from behind, peels a huge sheet of printed paper off the wall by one corner, like stripping old wallpaper. The old sheet is a cluttered, outdated website with crowded boxes and banners, curling as it comes away. The retouched element: underneath the peeled corner, the wall reveals the new clean website layout, as if it had always been there, in calm pale blocks with generous white space. Strong raking light from a high window, dust in the air, wide shot, 35mm, near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10.

**A6 — SEO** · *high angle, city at blue hour, one result lit* → `incoming/hub-seo.png`
> High-angle photograph over a busy city street at blue hour. Dozens of people walk below, many looking down at their phones, the small screens glowing in the dusk, and shopfronts line both sides. The retouched element: above one particular shop, a single clean glass card floats like a sign, softly lit, the top search result for that street, while every other shopfront stays dark and ordinary. A few people below look up toward it. Long-lens compression from a rooftop, 135mm, light rain sheen on the pavement, near-monochrome desaturated cool grade, fine film grain, realistic, no legible text, no logos, 16:10.

**If a result looks too AI:**
- The edit glows like a hologram: add *"subtle, physical, lit by the scene's own light, no glow"*.
- Skin looks waxy, or the light is too perfect: add *"candid, imperfect, natural skin texture"*.
- The place looks staged or stock: add *"lived-in, worn, real clutter, nothing posed"*.
- Text appears anywhere: add *"no letters anywhere, only abstract shapes"*.

---

## B. Service page objects: six floating tech cut-outs (item 6c)

*Rewritten 2026-10-01. The first version (shears, gears, a bowl, a compass) was the wrong family. The direction now: agentic and technological, real hardware floating in space with cables looping around it as the artistic element, and no background.*

These go in the service-page section where the big tagline is cut by the object (THE POSTER). **Square or portrait, transparent background.**

**The family, shared by all six:**
- **The object:** one real piece of technology, matte black or dark graphite, floating weightless at a dynamic angle (tilted, slightly rotating, never sitting flat on anything).
- **The cables:** smooth cables in white and light grey, some braided, some plain, curling around and through the object in long graceful loops, like a sculpture in the air. They're the art. Some connect to the object's ports and some just float. Keep them clean: no tangles, no clutter.
- **One small accent per object:** a few loose parts drifting off (keycaps, screws, a connector) or a faint glass shard. It should feel engineered and alive, not decorated.
- **Whole, never cropped.** These objects FLOAT on the page and drift as you scroll, so every edge shows. The object and all of its cables sit fully inside the frame with empty space on every side, every cable ends somewhere you can see (a connector, or a clean tip), and nothing touches or runs off an edge. If a result is cropped, regenerate with *"zoomed out, the entire object in frame with a wide margin"*.
- **Light:** a dark studio. Soft key light from the upper left, a crisp rim light that outlines the black object, the cables catching the highlights.
- **It must stay DARK.** The tagline is drawn in a difference blend over the object: where letters cross the black body they turn light, and where they cross the white cables they turn dark. That's fine, it gives the cut texture. A mid-grey body would make the letters vanish, so keep the hardware near-black. If it comes back grey, add *"darker, near-black matte material"*.

Shared tail (already included in each prompt): *floating weightless in mid-air at a dynamic angle, smooth white and light-grey cables curling around it in long graceful sculptural loops, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.*

**B1 — Web Design** · *a piece of a laptop* → `incoming/obj-web-design.png`
> A corner piece of a matte black aluminium laptop base, cleanly sliced off along one diagonal cut as if by a precision blade: the piece carries a few keys of the keyboard and a slice of the glass trackpad, and the polished cut face shows the thin layers inside (the aluminium shell, a sliver of circuit board, the battery's edge). The whole piece is visible as one finished sculptural fragment. Floating weightless in mid-air at a dynamic angle, smooth white and light-grey cables curling around it in long graceful sculptural loops, one cable plugged into its side port, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.

**B2 — Web Development** · *the keyboard and its cables* → `incoming/obj-web-development.png`
> A compact mechanical keyboard in matte black with black keycaps that carry no legends, tilted steeply toward the camera. A handful of keycaps have lifted off and drift above it, revealing the switches beneath. A braided white coiled cable runs from its port and loops around the keyboard in a long spiral, with thinner grey cables arcing around it. Floating weightless in mid-air at a dynamic angle, smooth white and light-grey cables curling around it in long graceful sculptural loops, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.

**B3 — 3D Websites** · *the silk, wired* → `incoming/obj-3d-websites.png`
> A sheet of heavy black silk frozen in mid-air, twisting and folding over itself into a sculptural form with deep glossy highlights along the folds. Thin white and light-grey cables thread through the folds and wrap around the silk, as if the fabric were wired into a machine. A couple of small metal connectors hang from the cable ends. Floating weightless at a dynamic angle, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.

**B4 — One-page Websites** · *a phone and one long cable* → `incoming/obj-one-page-websites.png`
> A modern smartphone in matte black, screen dark and glossy, standing almost upright and slightly turned. One single long white cable runs out of its charging port and unspools in a long, flowing ribbon that rises and loops above it and ends in a small connector floating free: one line, unbroken, like a single page scrolling, all of it within the frame. Floating weightless in mid-air at a dynamic angle, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.

**B5 — Website Redesign** · *a screen, taken apart* → `incoming/obj-website-redesign.png`
> An exploded view of a thin black computer monitor floating in mid-air, its layers pulled apart and spaced evenly front to back: the dark glass front, the panel, the circuit board and the black back shell, each tilted slightly. White and light-grey cables still connect the layers and loop between them, a few tiny screws floating in the gaps. Rebuilding something piece by piece. Floating weightless at a dynamic angle, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.

**B6 — SEO** · *the microphone, asked* → `incoming/obj-seo.png`
> A studio condenser microphone in matte black with a fine metal mesh head, tilted as if leaning toward someone speaking. Its white cable drops from the base and curls back up around the body in a long loop, with thinner grey cables arcing around it like sound. Being the answer when they ask. Floating weightless in mid-air at a dynamic angle, studio product photograph, soft key light from upper left with a crisp rim light, high detail, isolated on a transparent background, the whole object and every cable fully inside the frame with a generous empty margin on all sides, every cable end visible, nothing touching the edges, no text, no logos, no brand marks.

---

## C. About toolset: six cut-outs (item 7b)

These go in the bento on /about, one per tool. Each object overhangs its card. Per the brief they are *mostly relevant, nothing abstract*: real objects that a person who knows the tool would connect to it, with no logos. They're the same family as set B (black, studio-lit, cut out) so the site keeps one voice. The grid sets the format: the Blender card is tall, Next.js and Figma are wide, and the rest are squares. Frame each object for its card's shape.

Shared tail (already included in each prompt): *studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.*

**C1 — Blender** (tall card) · *3D modelling, lighting, rendering* → `incoming/tool-blender.png`
> The classic Utah teapot, the famous 3D computer-graphics test object, made as a real object in glossy black glazed ceramic, standing upright, seen from a slight low angle, perfect smooth curves. Studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.

**C2 — Next.js** (wide card) · *the frame every site is built in, server-rendered* → `incoming/tool-nextjs.png`
> A slim rack-mount server unit in matte black metal, its front panel a fine grid of ventilation holes with a row of tiny status lights, angled at three-quarters, a long horizontal composition. Studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.

**C3 — Three.js** (square card) · *WebGL, shaders, the objects that answer the cursor* → `incoming/tool-threejs.png`
> A modern graphics card in matte black with a dark chrome shroud and twin cooling fans, no branding, seen from a three-quarter angle with the fans facing the camera. Studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.

**C4 — GSAP** (square card) · *every entrance, roll and scrub runs on one clock* → `incoming/tool-gsap.png`
> A classic pyramid-shaped mechanical metronome in matte black lacquer, its dark chrome pendulum caught mid-swing to one side, seen from a slight three-quarter angle. Studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.

**C5 — Figma** (wide card) · *where the picture is decided before a line of code* → `incoming/tool-figma.png`
> A long, freshly sharpened black graphite pencil lying diagonally, with a few curled wood shavings beside its tip, a long horizontal composition. Studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.

**C6 — After Effects** (square card) · *the motion is drawn before it is coded; the loops and the reels* → `incoming/tool-after-effects.png`
> A vintage 16mm cine film camera in black crinkle-finish metal, with a lens turret and a loaded film reel on top, seen from a three-quarter angle. Studio product photograph, single object isolated on a transparent background, monochrome, matte black and dark chrome materials, soft key light from upper left with a crisp rim light, high detail, no text, no logos, no brand marks.

---

## Handing them over

- Put everything in `incoming/` with the names above. Several takes per prompt are fine: add `-2` or `-3` to the name and I'll pick or show you.
- Don't upscale, crop or retouch. I'll grade each set to the site's noir, trim to the object, export webp and set it in place.
- If an object reads mid-grey instead of black, regenerate with *"darker, near-black material"* added. Mid-grey objects are the ones the tagline cut can't show.
