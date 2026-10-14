# Research note: What is scrollytelling? (Article 13)

Research and inspections: 13 October 2026. Draft: [what-is-scrollytelling.md](../blog-drafts/what-is-scrollytelling.md). Planner Article 13 (Week 7, Tuesday). First article written under the [ten-month plan's](../content-plan-2026-11-to-2027-08.md) real-substance rule.

## Purpose and reader

A business owner who has seen a site "that moves when you scroll" and wants to know what it is called, how it is made, what it costs and whether it suits their business. The article defines the term, separates four techniques people confuse, shows three sites actually opened plus Konaverse's own piece, names the stack, states the published price and timeline, and ends with four checks the reader can run on any studio.

Neighbouring articles keep their own ground: Article 14 (now the February 2027 flagship) ranks ten 3D sites; Article 15 covers lag and fatigue with device measurements; the three-ways-to-do-3D piece (April 2027) compares video, shader and live glTF. This article does not rank sites and does not measure frame rates.

## Demand

| Source | Finding |
| --- | --- |
| Semrush Keyword Overview, US database, 13 October 2026 | "scrollytelling" 720 searches a month, difficulty 40, informational intent |
| Keyword Planner, September 2026 (`keyword-research/keyword-planner-raw.md`) | scrollytelling 1K to 10K worldwide; scrollytelling website 100 to 1K; scrollytelling examples 100 to 1K; best scrollytelling websites 10 to 100 |
| Autocomplete, September 2026 | scrollytelling websites and scrollytelling website examples each returned by 6 feeds |
| PAA, live Google from Cyprus, 13 October 2026 | "What is a scrollytelling website?", "What are the top 10 websites that use scrollytelling?", "What are some examples of scrollytelling techniques?" |
| Planner targets | "What are scroll-driven animations?", "What is it called when a website moves when you scroll?" |

Result page for "scrollytelling website", seen from Cyprus on 13 October: Awwwards, an AI Overview assembled from Vev, Metabole Studio, Scrollytelling.ai, Shorthand and Flourish, then Dribbble, Webflow, Scrollytelling.ai, Maglr, Flourish, Wix. Tool vendors and galleries. No agency page that names its stack, price and timeline on one page.

## Planner hook correction

The planner hook says scroll-driven design "transforms passive readers into active participants". No source supports a measured engagement change from scrollytelling, and the draft makes no such claim. It says what the scroll does mechanically and leaves outcomes unclaimed.

## Inspections, 13 October 2026

All four sites were opened in Chrome through the browser automation extension on the owner's machine. That tab throttles animation frames and lost its WebGL context during the session (console: `THREE.WebGLRenderer: Context Lost` on Lumière Éclat; Oryzo's scene faded to white after about 3,000 px). The screenshots in `scrollytelling-inspection/` record what rendered. The draft describes only what was observed or what the repository records. Before publication the owner should open the three external sites on a normal browser and phone so the article's first-person statements are true of a real visit.

### Snow Fall, The New York Times

- URL: nytimes.com/projects/2012/snow-fall/index.html. Loaded without a paywall; original interactive feature still served.
- Published 20 December 2012 by John Branch; 2013 Pulitzer Prize for Feature Writing and a Peabody Award; the industry took the verb "to snowfall" from it (Wikipedia, "Snow Fall", read 13 October 2026; the Pulitzer site returned 403 to the fetch tool, so the prize is cited from Wikipedia).
- Observed: a text column in a serif face with a section navigation at the top (Tunnel Creek, To the Peak, Descent Begins, Blur of White, Discovery, Word Spreads, Map, The Group); a full-width panoramic mountain video with a replay control arriving between paragraphs; inline photographs and video links marked with a camera icon beside the sentence they illustrate. Six video elements, no canvas, page about 10,000 px tall.
- Screenshots: snowfall-01-title.jpg, snowfall-02-text-column.jpg, snowfall-03-panorama-video.jpg, snowfall-04-inline-media.jpg.

### AirPods Pro 3 product page, Apple

- URL: apple.com/airpods-pro/. Country-selection banner for Greece at the top.
- Observed: hero image; a "Get the highlights" pinned gallery with playback controls; sections that stayed blank in the throttled tab where videos load; a paragraph whose words darken from grey to black as the reader scrolls (scroll-driven text emphasis). DOM counts: 0 canvas, 16 video elements, 102 images, 17 elements carrying Apple's scroll-group data attributes, page about 29,000 px tall.
- Reading: Apple drives video playback and text emphasis from the scroll without a 3D engine on this page.
- Screenshots: apple-airpods-01-hero.jpg, apple-airpods-02-highlights-gallery.jpg, apple-airpods-03-scroll-text-fill.jpg.

### Oryzo, by Lusion

- URL: oryzo.ai. Footer text: "THIS ENTIRE SITE IS A FICTIONAL CREATIVE PROJECT BY LUSION. ORYZO DOESN'T EXIST." Credit on page: "Designed by Lusion, the award-winning design studio."
- Observed: a calibration-mark loader; a photographic cutting-mat scene with the cork coaster; the ORYZO title; then a dark chapter where the coaster stays pinned in the centre of the screen while the scroll tilts and turns it and the copy "Isn't just a coaster" arrives beside it; a "Powered by AI, ORYZO-1" chapter further down. Six canvas elements, one with a WebGL context; built with Astro (script path `/_astro/`); page 44,806 px tall, about 64 screens at this viewport.
- Screenshots: oryzo-01 to oryzo-08. The last one records the faded state after the context was lost, not the site's behaviour.

### Lumière Éclat, Konaverse studio concept

- Live at watchweb.vercel.app; case study at /work/lumiere-eclat; record in `src/lib/case-studies.ts`.
- Repository facts used in the draft: a fictional Geneva watchmaker; one watch; five chapters (the measure of light; weight and the absence of it; the collection, which runs horizontally; the atelier; the end); Next.js with a WebGL scene; one scroll driver owning object pose, light, chapter transitions and the horizontal run; copy server-rendered and readable before the scene; compressed model; resolution and frame cap per device; stills for reduced motion and for devices without WebGL; copy in French and English; no cursor tricks and no autoplay.
- Observed in the throttled tab: the opening chapter with its headline "Time, held, in a single point of light", the grid guides and the large LUMIÈRE marquee; the dark page background (rgb 6, 8, 15) confirmed by computed style; one canvas with a live WebGL context before it was lost; Lenis class on the root; 1,932 characters of text in the DOM. Later chapters did not render in this tab. Screenshot lumiere-01-hero-automation-tab.jpg.

## Technical sources

| Claim in the draft | Source and boundary |
| --- | --- |
| CSS scroll-driven animations animate property values along a scroll-based timeline instead of the time-based document timeline; `animation-timeline` with `scroll()` and `view()` | [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations), page dated 5 October 2026. MDN marks `animation-timeline` as limited availability, not Baseline, because it does not work in some widely used browsers. The per-browser table was not retrievable through the fetch tool; the draft states "limited availability" only. |
| GSAP ScrollTrigger links an animation's progress to the scrollbar ("scrub") and can hold an element on screen for part of the scroll ("pin") | [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| GSAP and all its plugins are free, including for commercial use, since version 3.13 on 29 April 2025; GSAP is a Webflow product | [GSAP 3.13 release post](https://gsap.com/blog/3-13/) |
| Lenis is a lightweight smooth-scroll library under the MIT licence that wraps the browser's own scroll so sticky positioning, anchors and accessibility keep working | [Lenis README](https://github.com/darkroomengineering/lenis) |
| Google Search does not interact with a page; content must load when it is visible in the viewport without user action | [Google: lazy-loading guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading), last updated 10 December 2025 |
| WCAG 2.3.3 Animation from Interactions (Level AAA): motion triggered by interaction, with parallax scrolling named as an example, must be switchable off unless essential; `prefers-reduced-motion` is a sufficient technique | [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) |
| Konaverse's stack | `package.json` on 13 October 2026: Next.js 16, Lenis 1.0, GSAP 3.13, Three.js r181, React Three Fiber 9. Ninety-one source files handle reduced motion. |
| Konaverse's price and timeline for a 3D site | `src/lib/service-pages.ts`: from 6,000 euro; live in eight to twelve weeks; concept 2 weeks, art 3 to 4, build 3 to 4, launch 1. Custom motion is included in every site (owner, 3 October 2026), so scroll-driven motion on a standard five-page site sits inside design and development from 2,500 euro. |

Not read: the Pulitzer Prize site (403). Not retrievable: the MDN compatibility table. No visitor behaviour, engagement or revenue claim is made; none was researched because none is needed for the article's purpose.

## Hypotheticals and first person

No hypothetical businesses. Every example is a named site that was opened. First-person statements describe opening sites, reading pages and the studio's own build, all of which the owner can repeat before publication. No client conversation is invented.

## Publication considerations

- Images: the article needs the screenshots in `scrollytelling-inspection/`, cropped, with credit lines (The New York Times, Apple, Lusion) and the Lumière stills from `/work/lumiere-eclat/`. Third-party screenshots for commentary with credit are standard editorial practice; the owner decides whether to embed or link the New York Times frame.
- Owner pass: open the three external sites on a laptop and a phone; scroll Lumière on a physical device; confirm the service page still says 6,000 euro and eight to twelve weeks on the day of publication.
- Metadata: title and description in the frontmatter; one H1; BlogPosting data from the CMS; related service 3d-websites; no case study field needed since Lumière is linked in the body.
- Internal links: /work/lumiere-eclat, /services/3d-websites, and the live demo. Forward links to the February flagship and the April three-ways piece wait until those exist.
