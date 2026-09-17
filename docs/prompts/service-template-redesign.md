# Prompt — redesign the service page template (`/services/[slug]`)

Paste everything below the line into the other agent, opened in this repo (`C:\Users\konst\Projects\KONA`, branch `redesign/v4`).

---

You are redesigning the **service page template** of konaverse — a two-to-three person web studio in Cyprus whose own site is its portfolio. One template renders six pages (`/services/web-design`, `web-development`, `3d-websites`, `one-page-websites`, `website-redesign`, `seo`). Work as a senior web designer who also writes the code: taste first, then engineering that keeps the taste at 60 fps.

## The job in one paragraph

Throw away the current template's design and build a new one that reads as a **story told by scroll**: a visitor arrives knowing the service's name and leaves understanding what it is, whether it is for them, how it runs, and what to do next — and every one of those beats is carried by motion that the scroll drives, not by decoration beside the text. The page must feel **agentic** (the interface seems to think and act: it assembles, measures, decides, responds), **gradient-designed** (light that moves, never a flat ground), and **scroll-motion rich**, while being designed **around the content that already exists**. The current template has a "everything connects to everything" concept; the owner's verdict is that it is poorly driven, poorly implemented and poorly designed. Do not rescue it. Keep its content and its SEO skeleton, nothing else.

## Read these first (in this order)

1. `src/lib/service-pages.ts` — THE CONTENT. Types `ServicePage`, `Fact`, `PlateBeat`, `ProcessStep`, and six instances. This is what you design around: `word` + `modifier` (the h1), `tagline`, `answer` (two paragraphs — the direct answer), `facts` (three numbers: price, timeline, one more), `plate.headline` + two `beats` ("What it is" / "When it is the wrong choice") + `close`, `process` (steps with `give` / `get` / `time` / `weeks`), `invite`, optional `sister`.
2. `src/app/(v4)/services/[slug]/page.tsx` — the current template. Its header comment holds the **fixed content order** and what is locked.
3. `src/app/(v4)/services/page.tsx`, `src/components/v4/HubAgent.tsx`, `src/components/v4/HubBench.tsx` and the `.ha-*` / `.hb-*` / `.hv-*` blocks at the end of `src/app/(v4)/services/hub.css` — the **services hub, rebuilt and approved this week**. This is the design language the service pages must belong to. Film it (see Verification) before you design anything.
4. `src/components/v4/AboutTimeline.tsx` — the house pattern for a scroll-driven section done right (one rect per frame, offsets not rects, eased follow).
5. `src/styles/tokens.css` (colour ramp `--n-0…--n-11`, `--ink`, type weights, radii, easings, durations) and `src/lib/motion-v4.ts` (`gsap`, `EASE`, `DUR`, `rem()`).
6. `docs/site-architecture.md` §2 and §2a, and `konaverse-seo-master-plan.md` D5 — why the content order and server rendering are not negotiable.

## What is fixed — do not redesign these away

- **The content order**, because crawlers and language models read top-down: (1) one `<h1>` = display word + modifier line; (2) the direct answer in the first hundred words, with the three facts repeated for the eye; (3) what it is / when it is the wrong choice; (4) the process; (5) two CTAs — **Contact** and **Book** (Calendly); (6) the up-link to `/services` and the single link to the sister page. No proof section, no "what changes the price" section — both were cut by the owner.
- **Every word server-rendered in the raw HTML.** Motion is an enhancement layered on a layout that already reads correctly. No copy injected by JavaScript, no text that exists only inside a canvas or an animation. View-source and JS-disabled must both show the whole page.
- **One template, six instances, data-driven.** No per-page components. If a scene needs to differ per service, it differs by data (a `scene` key, a number, a word), and it must degrade to a sensible default for a service that does not define it.
- **The copy is placeholder but the slots are real.** Design for the slots' real shapes: a two-word h1 and a three-word one, a 9-word tagline and a 5-word one, three process steps and five.
- `INDEXABLE = false`, the JSON-LD, `generateStaticParams`, the metadata — leave them working.

## What is yours to reinvent

Everything visual and every interaction: the hero, how the answer and the facts are staged, how the two beats are told, how the process is shown, how the CTA lands, the grounds, the transitions between chapters, hover behaviour, the page's rhythm and length. You may retire `ServiceStage.tsx`, `ServiceProcess.tsx` and `src/app/(v4)/services/service.css` (park them unimported, the repo's convention — do not delete history the owner may want back). `ServiceCards.tsx` and `services-data.tsx` belong to the **homepage** — leave them alone.

## The direction

**Agentic.** The hub's hero established the idea: an agent's cursor ("Kona") takes a brief and *builds the page in front of you* — skeletons resolve into type, guides draw, cards measure things. The service page is the next chapter of that story: **the brief has been accepted, and now the work happens as you scroll.** The scroll is the agent's clock. Things should appear to be *computed*: numbers count to their value, a schedule lays itself out from the `weeks` data, a verdict ("this is for you" / "this is the wrong choice") resolves like a decision, states tick from pending to done. Use the familiar furniture of tools people already know — cursors, selection boxes, guides, chips, progress, prompts, plans, diffs — drawn in code. Never fake intelligence with gibberish; every readout on screen must be a true fact from the page's data.

**Gradient-designed.** The owner's standing rule: *a background is never one flat colour, and it never stops moving.* Build the grounds from light: slow mesh/field gradients made from the **neutral ramp only** (`--n-0` … `--n-11`) — paper that breathes, soft black washes, a bright core that drifts, a vignette that follows the chapter. The site is black-and-white tech noir on a light theme; a hue is not yours to introduce — if you believe one tint earns its place, show it as an option and let the owner choose. Gradients should *do* something: mark the chapter you are in, pool under the active element, sweep as a section hands over to the next. Prefer CSS gradients and one small shader or canvas at most; benchmark anything WebGL.

**Scroll-motion rich, as storytelling.** Motion carries meaning or it goes. Give the page chapters with different scroll mechanics so it never feels like one trick repeated: a pinned scene that builds, a free-flowing passage, a horizontal or circular movement, a scrubbed line or path, a number that runs, a handover where one element becomes the next. A good test for every animation: *if I removed it, would the visitor understand less?*

A suggested arc — improve on it, do not just execute it:
1. **The brief is accepted** — the h1 assembles; the tagline is the agent's one-line reading of the job.
2. **The answer, computed** — the direct answer reads as prose while the three facts are *derived* beside it (price, weeks, the third number), each settling as its sentence passes.
3. **The verdict** — "what it is" against "when it is the wrong choice" staged as a genuine decision the page helps the visitor make, not two cards side by side.
4. **The plan** — the process built from its own data: steps placed on a week ruler from `weeks`, `give` and `get` as an exchange between client and studio, progress that follows the scroll.
5. **The handover** — the two CTAs as the story's last beat; then the quiet links out.

## How to work: references first, then build natively

Three component libraries are wired into this repo as a **reference library and parts bin**, not as a dependency list. The owner's words: "creative design and animations… smooth like butter and innovative", and also "I don't want something too heavy".

- **21st.dev** — CLI installed and logged in (`21st`, run from **PowerShell**; npm/npx are broken in Git Bash here). `21st search "<query>" --type c --limit 8 --json` returns name, description and a **`videoUrl`** — searching and watching previews is free and unlimited. Pulling code (`21st get <id>`) is limited to **2 per day** on this account: spend it only on something you will genuinely adapt. `21st generate` is **not enabled** — do not call it. Skills `21st-cli-use`, `21st-ui-explore`, `21st-ui-build` are installed.
- **Skiper UI** — `components.json` registers `@skiper-ui`. Any component's source is readable without installing: `curl https://skiper-ui.com/registry/skiperNN.json`. Worth reading for scroll work: 16/17/34 (sticky cards), 19 and 89 (SVG path drawn by scroll), 28 (perspective text), 30 (parallax columns), 31 (items fanned by distance from centre), 66 (clip/mask shapes).
- **Watermelon UI** — `https://registry.watermelon.sh/registry.json` lists ~780 items; mostly micro-interactions (disclosures, morphing bars, chips, inline actions) — good for the agentic furniture, not for page structure.

Process:
1. **Sweep widely before you draw.** Run 15–25 searches across the brief's vocabulary (scroll storytelling, sticky reveal, pinned scene, timeline/gantt, number ticker, comparison/diff, decision, agent plan, mesh gradient, gradient background, path draw, text reveal, progress, handoff/morph). Download the preview videos, tile frames with ffmpeg, and *look at them*. Keep a short list of what you took from where.
2. **Synthesize, never copy.** The result must be original and unmistakably this studio's. A reference supplies a mechanism, not a layout.
3. **Port ideas into the house pattern** (below). Do not drop a framer-motion/ScrollTrigger component into the page; do not add dependencies without asking.
4. **Present before you build big.** Give the owner a one-page concept: the chapter list, what moves in each and why, the references behind it, and what the no-JS page looks like. They decide quickly and often — a concept killed on paper costs minutes, one killed after the build costs a day. Then build chapter by chapter, filming each.

## Engineering rules of this codebase

- **Drivers:** `gsap.ticker` + **one `getBoundingClientRect` per frame**; positions of moved elements come from **offsets**, never from a transformed element's rect. No scroll listeners, no ScrollTrigger. One paused timeline or one pure `write(progress)` function per scrubbed scene.
- **Scrubs glide.** Progress eases toward the scroll's target with a short time constant (≈0.12–0.4 s, frame-rate independent via the ticker's `deltaTime`); fast flights get a top speed. Raw scroll-to-progress mapping was rejected twice as "too abrupt".
- **Write only** transform, opacity, clip-path, dash offsets and custom properties per frame. Re-fit by width/height only for a handful of absolutely-positioned elements. Variable Manrope is loaded: `font-variation-settings: 'wght' var(--w)` can be tweened.
- **The picture rule:** the desktop page is one scaling picture — root font-size tracks the viewport (reference 1534 wide), every composition length in **rem**, hairlines in **px**, `svh` only for pins and runways, no max-widths. `rem()` from `motion-v4` is a *scale*: px = `n * 16 * rem()`. The owner's real viewport is **1536 × 730** — short; design for it.
- **Fallbacks are part of the design:** hidden states are parked in CSS and lifted by a `<noscript>` rule in the page and by an `is-still` class for `prefers-reduced-motion`. Phones (< 57.5rem) get a real layout, usually without pins; where nothing can hover, the scroll does the hovering.
- **Scrub rules learned the hard way:** elements that keep their line move in lockstep; two things showing the same item at once read as a duplicate, not as one object in transit — sequence them; a per-letter mask must be a `clip-path` with open sides, never `overflow: hidden` (it crops glyph flanks).
- **Assets:** no picture-per-service exists and good ones are hard to find — **draw it in code** (SVG, CSS, canvas). Never upscale 3D past native resolution. `public/` paths are case-sensitive on Vercel (`public/About/…`).
- **Code style:** match the files you read — dense explanatory header comments recording *what the owner asked for and why*, named constants with a one-line reason each, class prefix per section. TypeScript and ESLint must pass (`node node_modules/typescript/bin/tsc --noEmit -p .`).

## Verification — you cannot trust the browser tab

The automation tab is throttled to 0 fps: `requestAnimationFrame` never fires there, so motion cannot be judged in it. **Film everything in headless Chrome** with `puppeteer-core` (installed; Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`), viewport **1536 × 730**, real `page.mouse.wheel` events (Lenis listens to wheel). `tools/record-transition.js` shows the pattern. Take **settled stills** for layout (screenshots taken mid-wheel tear into doubled frames — that is a capture artifact, not a bug) and frame sequences for motion; tile them into contact sheets and review them yourself before showing the owner. Check all six slugs, not one. The dev server is `node node_modules/next/dist/bin/next dev -p 3000`; `.env.local` already opens `/services` locally.

## What the owner responds to

- Approved this week: the hub hero that *builds itself* under an agent's cursor with a real, working prompt; a bento of **scenes drawn in code** that play on hover; a vertical timeline where one drawn line opens each picture as it reaches it.
- Rejected: austere or static compositions ("very disappointed"); subtle effects (build for presence, then dial back); revealing all six services in a hero; anything depending on stock-like photos per service; abrupt scroll-linked motion; repeating another page's devices — the About page's grid hero, thread, iris and word flights are taken, and so is the hub's build-pass. Carry the *language* across, not the same scenes.
- They judge by seeing. Show film, not descriptions. They often cannot say what they want until they see what they do not.

## Deliver

1. The concept page (chapters, mechanics, references, fallbacks) — wait for a yes.
2. The new template, built chapter by chapter, each filmed at 1536 × 730 and on a phone width, across all six services.
3. Old components parked unimported; page header comment rewritten to describe the new template in the repo's voice; types and lint clean.
4. **Do not commit or push** unless asked. Flag every piece of placeholder copy you wrote.
