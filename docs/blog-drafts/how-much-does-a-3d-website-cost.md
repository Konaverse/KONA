---
status: draft, approved by the owner 14 October 2026 (pricing proposal accepted in full); awaiting the owner's pre-publication pass and the Sanity hosting edit
drafted: 2026-10-14
research_checked: 2026-10-14
approved: 2026-10-14
planner_article: ten-month plan, November 2026, piece 2
author: Konstantinos Kyprianou
author_key: konstantinos
slug: how-much-does-a-3d-website-cost
meta_title: "How Much Does a 3D Website Cost? Our Real Numbers (2026)"
meta_description: "A 3D website costs from 6,000 euro at Konaverse. The build behind that number, phase by phase, what it includes, what moves the price, and the market band."
excerpt: "Our 3D websites start at 6,000 euro. This is the build behind that number, phase by phase, what the price includes, what moves it, and what the rest of the market charges."
topic: Immersive websites
target_queries:
  - "how much does a 3d website cost"
  - "3d website cost"
  - "How much does it cost to design a 3D website?"
  - "Is $1000 a good price for a website?"
service_slug: 3d-websites
editorial_reference: ../editorial/konstantinos-voice-and-search.md
research_reference: ../editorial/how-much-does-a-3d-website-cost-research.md
pricing_reference: ../editorial/3d-pricing-structure-2026-10-14.md
before_publication:
  - The live Sanity cost article still says hosting is 40 or 90 euro a month; edit it in the Studio first so the two posts agree
  - The yearly hosting change in src must be committed and live before or with this article, or the service page contradicts it
  - Owner opens Lumière on a phone and the three cited pages (Cause and Effect, Utsubo, Svilenković) so the first-person sentences are true of a visit
  - Refresh the euro to dollar conversion on the day
---

# How Much Does a 3D Website Cost? What 6,000 Euro Actually Buys

*By Konstantinos Kyprianou*

A scroll-driven 3D website costs from 6,000 euro at Konaverse and goes live in eight to twelve weeks. Worldwide, the posts that answer this question put a multi-scene 3D site anywhere between 3,500 and 15,000 dollars, and the top agencies start at 20,000. Those are the numbers. The rest of this article is what they are made of.

I can give you something most of those posts cannot: the build. We made [Lumière Éclat](/work/lumiere-eclat), a scroll-driven site for a watch that does not exist, as our reference for this kind of work. So instead of a range, you get that build, phase by phase, who did what and for how long, and then the list of things that would have made it cost more.

One thing first, because it matters to how you read the rest. No client has paid us for a 3D website yet. The 6,000 is a list price we have quoted, not a figure we have invoiced. Lumière is the reference build, made with our own time. Every number below is either from that build or marked as an estimate.

## The short answer, in four lines

| What you are buying | Price | Time |
| --- | --- | --- |
| A standard site of five pages, with custom motion included, no live 3D | 2,500 euro | Published tier |
| A rendered object inside a standard site, shipped as video, not live 3D | Quoted per object | Art days on top of the tier |
| A scroll-driven 3D site: one page, one object, up to five chapters | From 6,000 euro | 8 to 12 weeks |
| The full build: 3D story, the pages around it, CMS, conversion, SEO and analytics | 15,000 to 20,000 euro | 3 to 4 months |

Hosting is separate and priced by the year: 400 euro for a 3D site, 700 with a content management system. There are no licences on top. The tools we build with are free or open source, which I come back to below.

## Where the 6,000 comes from: the build behind Lumière Éclat

Lumière Éclat is one page. One watch, present in every chapter, turning and catching light as you scroll. Five chapters, one of which runs sideways. Dark background, the watch the only lit thing on it. You can scroll it at [watchweb.vercel.app](https://watchweb.vercel.app).

Here is what it took. Nabil, our creative director, did everything in Blender. I wrote the code.

| Phase | Who | Time |
| --- | --- | --- |
| Concept and storyboard: every chapter sketched with the watch in it | Both of us | 1 week |
| Modelling and materials: the watch from scratch, steel, glass, dial | Nabil | 4 days |
| Lighting and animation passes | Nabil | 1.5 weeks |
| The scroll build: wiring every chapter to the scroll, the horizontal run, the fallbacks | Konstantinos | 2 weeks |
| Device testing on real phones and laptops | Konstantinos | 1 week |

Those are the phases, and they are the same phases a client gets. The durations are from memory, not a timesheet, so read them as the shape of the work rather than an invoice. A client build runs eight to twelve weeks. Lumière ran faster than that, and the reason is worth knowing because it is where the time in a real project goes: nobody had to approve anything. There were no meetings, no storyboard sign-off, no stills sent out for a decision, no revision round. We did what we wanted. On a client project each phase ends with you, and you deserve the time to look: the storyboard before the modelling starts, the stills before the animation, the build before the launch. That is the difference between the two numbers, not padding.

Six thousand euro is the floor, and it is the floor for exactly the scope in the next section. Anything you add moves it, and I list what each addition costs further down.

## What the 6,000 buys, line by line

Most pricing pages fail at the boundary. They say "from" and never say what the "from" contains. So, the vocabulary first, because a quote is only as clear as its words:

- **An object** is the thing we model and render: the watch.
- **A chapter** is a stretch of the scroll with its own copy, where the object takes a new pose, scale or light. Some studios say scene. Lumière has five.
- **A horizontal run** is a chapter that scrolls sideways before handing back to the page. Lumière has one.
- **An interaction** is anything you do besides scroll: drag to turn, choose a colour, pick a part. Lumière has none, on purpose.
- **A fallback** is what a visitor gets when the scene cannot or should not draw: the copy in the HTML before anything loads, stills for people who turn on reduced motion, stills for a device with no WebGL.

The 6,000 euro site is Lumière's scope:

1. One page, one object, up to five chapters, one of which may run horizontally.
2. The object modelled from scratch, from your photographs or drawings, at product scale and ordinary complexity: a watch, a bottle, a chair, a shoe. A car interior or a building is a different conversation.
3. Materials, lighting and the animation passes.
4. The scroll build on our stack: native scroll smoothed with Lenis, GSAP ScrollTrigger for the link between scroll and motion, Three.js through React Three Fiber inside Next.js.
5. Every fallback, always. Resolution and frame caps per device, stills for reduced motion, stills for no WebGL, and the words in the HTML first. We do not sell these as add-ons, because a 3D site without them is not finished.
6. Testing on real phones and laptops, not a simulator.
7. One language. One round of revisions per phase.
8. Launch on your domain.

Not in the number: hosting, a content management system, a second language, the ordinary pages around the scene, copywriting beyond fitting your copy to the chapters, photography, and any interaction beyond scrolling. Each of those has a price below, so you can build your own figure before you talk to anyone.

## What moves the price

The rule we use is simple. Each addition is the number of days it would have added to the Lumière build, at about a thousand euro a working week. The rows marked estimate are days we have not yet billed; they are our best reading of that build, not a record.

| Addition | What it does to the price | What it does to the timeline |
| --- | --- | --- |
| A sixth or later chapter | Plus 600 euro each (estimate) | Plus three days each |
| A second object in the same scene | From plus 2,000 euro (estimate) | Plus two weeks, most of it art |
| You supply a clean product file: CAD, STEP or glTF | Minus 400 euro (estimate) | Minus two days of modelling |
| You supply a heavy or messy file: a scan, dense CAD | Zero to plus 400 euro for cleanup (estimate) | We tell you which after we open the file, before the quote |
| A second horizontal run | Plus 500 euro (estimate) | Plus three days |
| The ordinary pages around the scene: about, collection, contact | Plus 2,500 euro, our five-page tier | Plus two to three weeks |
| A content management system | Plus 1,000 euro (estimate), and hosting becomes 700 a year | Plus one week |
| A second language, with the translation supplied | Plus 600 euro (estimate) | Plus three days |
| Drag to turn the object | Plus 500 euro (estimate) | Plus three days |
| Material or colour variants: strap, dial, finish | From plus 2,000 euro per set (estimate) | Plus two weeks |
| A configurator with options and prices | This is the top tier, from 15,000 euro | Three to four months |
| Phones, tablets, reduced motion, no WebGL | Included | Included |

Two of those rows deserve a sentence each.

The second object is the one people underestimate. A watch and its box is not one model, it is two, and the second has to sit in the same light rig and answer the same scroll. Most of the added two weeks is Nabil's, not mine.

The supplied file is the one people overestimate. A clean CAD export saves about two days. A scan or a CAD file with a few million polygons saves nothing, because it has to be rebuilt to something a phone can draw. If you have a file, send it before you ask for a price, and we will say which kind it is.

## The small version: a 3D hero on a normal site

The question Google puts under this one is "is 1,000 dollars a good price for a website". So let me answer the small version properly.

For a template site, yes, a thousand can be a fair price. Our own one-page site is 1,200 euro and our five-page site with custom design and development is 2,500, and both include custom motion: scroll-driven reveals, type that fills as you read, transitions between pages. You do not pay extra for the page to move.

What they do not include is a live 3D object. We do not put WebGL on a 2,500 euro site, because the fallbacks, the device testing and the art are where the cost of 3D actually lives, and cutting them to fit the price gives you a slow page with a spinning thing on it.

There is a middle route, and it is the one on our own homepage. The object there was modelled and rendered in Blender and shipped as a short video loop. It reads as 3D, costs nothing at runtime beyond a video, and needs no WebGL at all. That is art days on top of a standard site, and we quote it per object. If what you want is one beautiful rendered thing on an otherwise ordinary site, ask for that, not for a 3D website.

## The top of the range

A 15,000 to 20,000 euro build, in our view, is everything: the 3D story, the pages around it, a content management system shaped to how your team actually publishes, conversion work on the pages that sell, mobile optimisation treated as its own pass rather than a checkbox, and the SEO and analytics set up to measure whether any of it worked. Three to four months. We have not built one for a client. I would rather tell you that than invent a case study.

Above that, the market exists but we are not in it. Utsubo, a Three.js studio, publishes a flagship tier of 100,000 to 200,000 dollars for full 3D worlds and game-like experiences. That is a different industry with a different team size.

## What it costs to keep running

We price hosting by the year, not the month. A standard site is 300 euro a year. A 3D site is 400, because the scene and its fallbacks are heavier to serve and to keep healthy. A content management system adds 300 a year to either, so a 3D site with a CMS is 700. That covers keeping the site online, updated, backed up and monitored. The domain stays in your name and is billed to you by the registrar.

There is nothing else. Blender is free. Three.js and Lenis are open source under the MIT licence. GSAP and all its plugins have been free for commercial use since April 2025. There is no render farm, because the object renders in your visitor's browser, and no asset licence, because we model the object rather than buy it. If a studio quotes you a monthly software cost for a 3D site, ask what the software is.

## What the rest of the market charges

I re-read the sources this week, on 14 October 2026, because price posts rot.

- **Cause and Effect, Atlanta**, 3 March 2026: a basic 3D enhancement to an existing site at 5,000 to 25,000 dollars over four to eight weeks; a custom 3D model at 2,000 to 5,000 dollars; a Three.js specialist at 75 to 150 dollars an hour; and annual maintenance at 15 to 20 percent of the build.
- **Utsubo**, 12 February 2026: a standard site with one 3D moment at 20,000 to 50,000 dollars in eight to twelve weeks; 3D throughout at 50,000 to 100,000 over fourteen to twenty weeks; the flagship tier above that.
- **D. Svilenković**, a freelancer whose tier page Google's AI Overview quoted in September with a hero upgrade at 1,500 to 2,500 dollars and a multi-scene site at 3,500 to 8,000. On 14 October the same pages carry no prices at all. Every tier is now "priced from a written brief". Draw your own conclusion about published ranges.
- The rest of the first page is a Reddit thread, a Three.js forum thread and Fiverr.

Put our figure in that picture. Six thousand euro is about 7,000 dollars. It sits in the lower half of the 3,500 to 15,000 band that the AI answer engines repeat for a scroll-driven site, and at a third of Utsubo's entry point. That is not because we cut the fallbacks or the testing. It is because we are three people in Cyprus with no office in London, and the phases above are the whole of what you are paying for. I would rather show you those than claim the gap is craft.

## Four questions to ask any studio before you sign

1. **Ask for the build behind their "from" price.** If they cannot name a page they made at that price and say roughly how long each phase took, the number is a guess.
2. **Ask what a chapter is and what a second object costs.** A studio that has done this has a definition and an increment. A studio that has not will say "it depends".
3. **Ask what a visitor on a phone without WebGL sees.** The answer should be "the whole story, as stills". If the answer is "a loading spinner" or silence, the fallbacks are not in the price.
4. **Ask for the yearly cost after launch, in one number.** Ours is 400 euro for a 3D site, 700 with a CMS. If theirs is a percentage of the build, as one agency above publishes, or a monthly maintenance plan, get it as one figure for the year before you compare.

If you want to see the reference build before you ask us anything, scroll the watch, then read the [3D and immersive website service page](/services/3d-websites). The price there and the price here are the same number, on purpose.

Until next time.
