# 3D website pricing structure: proposal from the Lumière Éclat numbers

Written: 14 October 2026, by Claude from the owner's answers of the same day. Status: ACCEPTED IN FULL by the owner on 14 October 2026 ("everything is okay"): the vocabulary, the 6,000 floor, every driver line, the mixed-language reading of Lumière and the yearly hosting. This file is now the studio's 3D pricing record; change it before changing any price on the site or in the article. Earlier status, kept for history: PARTLY ACCEPTED the same day. The owner confirmed 6,000 euro as the floor, set hosting by the year (300 standard, 400 for 3D, a CMS adds 300 to either; never state hosting monthly, no separate maintenance line), and asked for the timeline to be framed as eight to twelve weeks for a client with the reference build faster because there were no client approvals. The driver table below is still a proposal until the owner accepts or strikes each line. The [3D cost article draft](../blog-drafts/how-much-does-a-3d-website-cost.md) uses these figures and must not be published before the driver table is accepted.

## What the owner supplied on 14 October 2026

| Fact | Value | Source |
| --- | --- | --- |
| Concept and storyboard | 1 week, both founders | Owner |
| Modelling and materials | 4 days, Nabil in Blender | Owner |
| Lighting and animation passes | 1.5 weeks, Nabil in Blender | Owner |
| Scroll build | 2 weeks, Konstantinos | Owner |
| Device testing | 1 week, Konstantinos | Owner |
| Calendar span | "8 to 12 weeks was how much it took" | Owner |
| Clients who have paid for a 3D site | None. Lumière Éclat is the reference build | Owner |
| Live 3D hero on a 2,500 euro site | Not offered | Owner |
| 15,000 to 20,000 euro build | Everything: 3D, conversion optimisation, mobile optimisation, advanced SEO, advanced analytics, highly personalised CMS; 3 to 4 months | Owner |
| Hosting, all sites, set 14 October (second message) | By the year only: 300 euro for a standard site, 400 for a 3D site, a CMS adds 300 to either (600 and 700). No monthly figure, no separate maintenance line | Owner |
| Calendar framing, set 14 October (second message) | The owner does not know the exact calendar span. Frame it as: a client build is 8 to 12 weeks; the reference build was faster because there were no client meetings or approvals | Owner |
| Published price and timeline | From 6,000 euro, live in 8 to 12 weeks (`src/lib/service-pages.ts`) | Repository |

## The arithmetic, and what the owner decided about it

1. **The phases add up to about 6.3 weeks of work.** 1 + 0.8 + 1.5 + 2 + 1 = 6.3 sequential weeks. The owner does not know the exact calendar span and decided (14 October, second message) that the article frames it as: a client build is 8 to 12 weeks, the reference build was faster because there were no client meetings or approvals. The article does that and prints no sum, no hour count and no rate. The phase table stays, labelled as from memory rather than a timesheet.
2. **The implied rate is low, and the owner kept the floor.** Person-weeks: Nabil about 2.8, Konstantinos about 3.5; 250 to 290 hours; 20 to 24 euro an hour at 6,000. Cause and Effect, an Atlanta agency, publishes 75 to 150 dollars an hour for a Three.js specialist. The owner confirmed 6,000 as the floor on 14 October. The article no longer prints hours, so the rate is not derivable from it. The record stays here for the owner's own planning.
3. **Hosting was inconsistent and the owner reset it.** The old published figures were 40 euro a month and 90 with a CMS. On 14 October the owner moved hosting to the year: 300 for a standard site, 400 for a 3D site, a CMS adds 300 to either. Changed the same day in `src/lib/service-pages.ts` (HOSTING, RUNNING, `runningFor`), the service page template, the contact FAQ and the local copy of the cost article in `src/lib/blog-posts.ts`; all uncommitted. The live cost article in Sanity still says 40 and 90 a month and must be edited in the Studio by the owner.

## Vocabulary for pricing, defined from Lumière

The owner asked what a chapter or a scene is. These definitions are proposed so the quote, the service page and the article use one set of words.

| Word | Definition | Lumière Éclat has |
| --- | --- | --- |
| Object | The thing modelled in Blender and rendered in the browser | 1, the watch |
| Chapter | A stretch of the scroll with its own copy, where the object takes a new pose, scale or light. Some studios say scene; we say chapter | 5 |
| Page | A URL | 1 |
| Horizontal run | A chapter that scrolls sideways before handing back to the vertical page | 1, the collection |
| Interaction | Anything the visitor does besides scroll: drag to turn, pick a colour, choose a part | 0 |
| Fallback | Stills for reduced motion and for devices without WebGL, and the copy in the HTML before the scene loads | Yes, all three |

Note on language: Lumière's copy mixes French headings with English body by design. It is not a two-language site with a switch. The article says so; the owner should check that reading against the build.

## What 6,000 euro buys (proposed)

Exactly the Lumière scope:

- One page, one object, up to five chapters, one of which may run horizontally.
- The object modelled from scratch from photographs or drawings, at product scale and ordinary complexity: a watch, a bottle, a chair, a shoe. A car interior, a building or a landscape is a different brief.
- Materials, lighting and the animation passes.
- The scroll build: native scroll with Lenis, GSAP ScrollTrigger, Three.js through React Three Fiber in Next.js.
- The fallbacks, always: copy in the HTML first, resolution and frame caps per device, stills for reduced motion and for no WebGL. Never an add-on.
- Testing on real phones and laptops.
- One language. One revision round per phase: concept, art, build.
- Launch on Vercel with the client's domain.

Not included: hosting (400 euro a year for a 3D site, 700 with a CMS), a CMS, a second language, pages around the scene, copywriting beyond editing the client's copy to fit the chapters, photography, and any interaction beyond scroll.

## Price drivers (proposed)

Rule: each driver is the days it would add to Lumière's timesheet, at 200 euro a day (1,000 euro a working week), rounded. The rate carries a little more margin than the base because increments are where projects go wrong.

| Driver | Days added | Price | Timeline |
| --- | ---: | ---: | --- |
| A sixth or later chapter | 3 (1 art, 1.5 build, 0.5 test) | +600 euro each | +3 days each |
| A second object in the same scene | 10 (4 model, 3 light and materials, 2 build, 1 test) | from +2,000 euro | +2 weeks |
| A clean product file supplied (CAD, STEP, glTF) instead of modelling from scratch | minus 2 | minus 400 euro | minus 2 days |
| A heavy or dirty file (scan, dense CAD) | 0 to +2 of cleanup | 0 to +400 euro | We say which after seeing the file, before the quote |
| A second horizontal run | 2.5 | +500 euro | +3 days |
| Pages around the scene (about, collection, contact) in the same design system | the five-page tier | +2,500 euro | +2 to 3 weeks |
| A CMS (Sanity, as on the Konaverse blog) | 5 | +1,000 euro, and hosting becomes 700 a year | +1 week |
| A second language, translation supplied by the client | 3 (2 build, 1 fitting copy to chapters) | +600 euro | +3 days |
| Drag to turn the object | 2.5 | +500 euro | +3 days |
| Material or colour variants (strap, dial, finish) | 8 per set (3 art, 5 build) | from +2,000 euro | +2 weeks |
| A configurator with options and prices | this is the top tier | from 15,000 euro | 3 to 4 months |
| Phone and tablet coverage, fallbacks, reduced motion | 0 | included | included |

Open question for the owner: whether CMS setup is included in the standard 2,500 euro site. The hosting tiers suggest it is wired at hosting level. If it is included there, the 3D CMS line should say the same.

## Below 6,000 euro (proposed wording)

The studio does not sell a live WebGL object on a 2,500 euro site. Between the tiers there is the route the Konaverse homepage uses: an object modelled and rendered in Blender and shipped as a short video loop (`public/object/idle-clear.mp4`, in `HeroStage.tsx`). It costs art days, not a scroll build, and is quoted per object. No price is published for it until the owner sets one; the article says "quoted per object".

## The top (owner's words, lightly ordered)

15,000 to 20,000 euro, 3 to 4 months: the 3D story, the pages around it, a CMS built around the client's content model, conversion work, mobile optimisation, advanced SEO and analytics. Not yet transacted. The article says so.

## Decisions for the owner

Decided 14 October: the floor stays at 6,000; hosting is yearly at 300, 400 and plus 300 for a CMS; the timeline is framed as 8 to 12 weeks for a client, reference build faster.

Still open:

1. Accept the vocabulary (object, chapter, page, horizontal run, interaction, fallback).
2. Accept, change or strike each driver line. Any struck line is removed from the article before publication.
3. Confirm whether Lumière is a mixed-language page rather than a two-language site.
4. Decide whether the service page should carry the driver table too. The article links to the service page; the two must agree.
5. Edit the live cost article in the Sanity Studio so its hosting sentence matches the new yearly figures, then say so, and the local copy in `blog-posts.ts` can be committed with the rest.
