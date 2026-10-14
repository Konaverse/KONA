# Research note: How much does a 3D website cost? (ten-month plan, November 2026, piece 2)

Research and owner interview: 14 October 2026. Draft: [how-much-does-a-3d-website-cost.md](../blog-drafts/how-much-does-a-3d-website-cost.md). Pricing basis: [3d-pricing-structure-2026-10-14.md](3d-pricing-structure-2026-10-14.md), a PROPOSAL the owner has not yet accepted. The draft is blocked until that file is accepted and the four confirmations in its frontmatter are given.

## Purpose and reader

A buyer who has seen a 3D site, searched for the price, and found Reddit, Fiverr and two small posts. The article gives Konaverse's published price with the phases behind the reference build, defines the units a quote is written in, lists what moves the price with euro and weeks, answers the small version (the People Also Ask box asks whether 1,000 dollars is a good price for a website), states the top of the range, the yearly cost, and the market band re-verified the same day.

Neighbouring pieces keep their ground: the scrollytelling article defines the technique and inspects sites; the February flagship ranks 3D sites; the April piece compares video, shader and live glTF; the template-versus-custom rewrite covers the 1,200 and 2,500 tiers in depth. This article does not define scrollytelling and does not rank anyone.

## Demand

| Source | Finding |
| --- | --- |
| Keyword Planner, September 2026 (`keyword-research/keyword-planner-raw.md`) | how much does a 3d website cost: 10 to 100 a month worldwide, competition low; 3d website cost: no range |
| Semrush, US database, 13 October 2026 | how much does a 3d website cost: no data |
| Ahrefs connector, 14 October 2026 | Every Keywords Explorer call returned "Insufficient plan". No figures |
| Semrush connector, 14 October 2026 | Returned no_api_units: the account has no API units. No figures |
| Autocomplete, September 2026 | how much does a 3d website cost; 3d website cost; 3d website cost in india |
| PAA, September SERP autopsy | How much does it cost to design a 3D website? Is $1000 a good price for a website? Is $1500 a good price for a website? |
| SERP flags, September | AI Overview, PAA, videos, discussions |

The connectors do not replace the browser lookups. Both are plan-limited. Volume stays the September range. The article prints no volume, so nothing in copy depends on it.

## The owner's figures, 14 October 2026

Recorded verbatim in the pricing proposal. Summary: concept and storyboard 1 week (both founders); modelling and materials 4 days (Nabil, Blender); lighting and animation 1.5 weeks (Nabil); scroll build 2 weeks (Konstantinos); device testing 1 week (Konstantinos). No client has paid for a 3D site. No live 3D hero on a 2,500 euro site. 15,000 to 20,000 euro build includes everything and takes 3 to 4 months. Second message, same day: the owner does not know the exact calendar span; the article frames a client build as 8 to 12 weeks and the reference build as faster because there were no client meetings or approvals. Floor confirmed at 6,000. Hosting reset to yearly: 300 for a standard site, 400 for a 3D site, a CMS adds 300 to either; never monthly, no separate maintenance line.

Arithmetic kept out of the draft on the owner's instruction: the phases sum to 6.3 working weeks, roughly 250 to 290 hours, which is 20 to 24 euro an hour at the floor. The draft prints the phase table labelled "from memory, not a timesheet" and no sum, hour count or rate. The record is in the pricing proposal.

## Every price driver is an estimate

The driver table's euro and day figures are derived, not billed: days each addition would add to the Lumière build at about 1,000 euro a working week. The draft marks each derived row "(estimate)" in the price column. Only three rows are published figures: the five-page tier at 2,500 euro, the configurator pointing at the 15,000 euro top tier, and the hosting change to 700 a year. If the owner strikes a row in the proposal, strike it in the draft.

## Repository facts used

| Claim | Source |
| --- | --- |
| From 6,000 euro, live in eight to twelve weeks; concept 2, art 3 to 4, build 3 to 4, launch 1 | `src/lib/service-pages.ts` |
| Lumière: studio concept, one scroll, five chapters, the collection runs horizontally, copy in French and English, compressed model, resolution and frame cap per device, stills for reduced motion and no WebGL, copy in the HTML first | `src/lib/case-studies.ts` |
| The Konaverse homepage object is a pre-rendered Blender loop shipped as video | `src/components/v4/HeroStage.tsx` renders `/object/idle-clear.mp4` with a poster |
| Stack: Next.js, Lenis, GSAP ScrollTrigger, Three.js, React Three Fiber | `package.json`, 13 October 2026 |
| One-page 1,200; five pages 2,500 | Owner, confirmed 3 October 2026; published on service pages |
| Hosting by the year: 300 standard, 400 for 3D, a CMS adds 300 | Owner, 14 October 2026; changed the same day in `src/lib/service-pages.ts` (HOSTING, `runningFor`), the contact FAQ and `src/lib/blog-posts.ts`, uncommitted. The live Sanity cost article still carries 40 and 90 a month until the owner edits it in the Studio |

Reading of "bilingual": the case study's deliverables list says "Bilingual copy, French and English" and the design copy says the maison's copy is written "in French and English". The captions on the page mix French headings ("Poids et Lumière") with English body. The draft treats this as a mixed-language page, not a two-language site with a switch, and prices a second language as a driver. Owner to confirm.

## External sources, re-read 14 October 2026

| Source | What it says | Boundary |
| --- | --- | --- |
| [Cause and Effect, "How Much Does 3D Website Design Cost for a Small Business?"](https://causeandeffectsp.com/blog/3d-website-design-cost), Christopher Drake Griffith, 3 March 2026 | Basic 3D enhancement 5,000 to 25,000 dollars, 4 to 8 weeks; custom 3D model 2,000 to 5,000; Three.js specialist 75 to 150 dollars an hour; maintenance 15 to 20 percent of the build a year | Atlanta agency; ROI claims on the page are not used |
| [Utsubo, "Premium Website Cost Guide 2026"](https://www.utsubo.com/blog/premium-website-cost-budget-guide), Jocelyn Lecamus, 12 February 2026 | Standard 20,000 to 50,000 dollars with a 3D or WebGL hero moment, 8 to 12 weeks; Premium 50,000 to 100,000 with 3D throughout, 14 to 20 weeks; Flagship 100,000 to 200,000, 5 to 9 months | Currency shown as dollars, not stated |
| [D. Svilenković, "3D Website Cost: What Actually Drives It"](https://svilenkovic.com/3d/3d-website-cost) and ["3D Website Pricing"](https://svilenkovic.com/3d/3d-website-pricing) | Drivers: scene complexity, whether assets exist, interactions, CMS or commerce, content volume, device and accessibility, deadline. Tiers: hero upgrade; multi-scene (3 to 5 chapter scrollytelling); configurator; custom. No prices on either page on 14 October | In September the SERP autopsy and Perplexity cited this site for 1,500 to 2,500 (hero) and 3,500 to 8,000 (multi-scene); the search snippet on 14 October still carried those figures while the live pages did not. The draft says exactly that |
| adrienagency.com post on 3D website cost (Three.js or Spline) | Cited in September as the second small agency post in the AI Overview | Returned 404 on 14 October and did not appear in search. Not cited in the draft |
| [GSAP 3.13 release](https://gsap.com/blog/3-13/) | GSAP and plugins free for commercial use since 29 April 2025 | As in the scrollytelling note |
| Lenis and Three.js licences | MIT | Lenis README; three.js LICENSE on GitHub |
| Blender | Free, GPL | blender.org |
| Perplexity, September autopsy (`keyword-research/ai-engine-autopsy.md`) | "scroll-driven landing / multi-scene 3D site" band 3,500 to 15,000 dollars, assembled from Svilenković and small studios | The draft calls this "the band the AI answer engines repeat"; it is a September reading |

Currency: 6,000 euro stated as "about 7,000 dollars". At the 14 October 2026 rate this is approximately right; refresh the figure on the day of publication.

## Hypotheticals and first person

No hypothetical businesses. First person covers: re-reading sources on 14 October (Claude did the reading; the owner should open the three pages before publication so the sentence is true of a visit), writing the Lumière code, the pricing rule. The draft says the phase durations are "from memory, not a timesheet", which is what the owner told us.

## Publication considerations

- Blocked until the pricing proposal is accepted; see the frontmatter.
- Images: the Lumière stills from `/work/lumiere-eclat/`; the phase table could be a designed graphic; no third-party screenshots are needed.
- The service page and the article must state the same price on the day of publication. If the owner raises the floor, both change together.
- Internal links: /work/lumiere-eclat, /services/3d-websites, the live demo. A forward link to the template-versus-custom rewrite waits until it exists.
- Mechanics at draft time: one H1, nine H2, three tables, zero em dashes (checked with `tools/dashes.js`), meta title 56 characters, description 155 characters, about 2,500 words including three tables.
