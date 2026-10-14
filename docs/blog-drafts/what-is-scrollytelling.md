---
status: draft
drafted: 2026-10-13
research_checked: 2026-10-13
planner_article: 13
author: Konstantinos Kyprianou
author_key: konstantinos
slug: what-is-scrollytelling
meta_title: "What Is Scrollytelling? Scroll-Driven Websites Explained"
meta_description: "Scrollytelling is a page whose story moves with your scroll. Four real sites, the stack we use, what a scroll-driven 3D site costs, and four checks to run."
excerpt: "A scrollytelling page uses your scroll position to drive what appears, moves or changes. Here is how it is built, what it costs, and how to tell good from gimmick."
topic: Immersive websites
target_queries:
  - "What are scroll-driven animations?"
  - "What is it called when a website moves when you scroll?"
  - "scrollytelling"
  - "scrollytelling website"
service_slug: 3d-websites
editorial_reference: ../editorial/konstantinos-voice-and-search.md
research_reference: ../editorial/what-is-scrollytelling-research.md
images_reference: ../editorial/scrollytelling-inspection/
---

# What Is Scrollytelling? How Scroll-Driven Websites Work, What They Cost, and When They Are Worth It

*By Konstantinos Kyprianou*

Scrollytelling is a web page whose story advances as you scroll. Your scroll position, not a clock and not a click, decides what appears, what moves and what changes. The technique underneath it is called scroll-driven animation. Scrollytelling is what you get when a page is written around that technique: a beginning, a middle and an end, paced by the reader's hand.

If you have ever asked "what is it called when a website moves when you scroll", this is the answer. The rest of this article is about what it actually looks like, how we build it, what it costs, and how to tell a good one from a gimmick before you pay for it.

## Where the name comes from

On 20 December 2012 The New York Times published Snow Fall, John Branch's account of an avalanche at Tunnel Creek. I opened it again this week. It still loads, and it still works the way it did: a long column of serif text, a section menu across the top, and media that arrives exactly where the sentence needs it. A full-width mountain panorama slides in between two paragraphs. A camera icon sits beside the words "makes skiers giggle in glee" and opens the clip. The text stays in charge. The pictures and video serve it.

The piece won the 2013 Pulitzer Prize for Feature Writing and gave the industry a verb, "to snowfall". The word scrollytelling arrived later, a blend of scrolling and storytelling, and it is now the term galleries and tool vendors use. Snow Fall is still the clearest example of the idea: the page is a story, and scrolling is how you read it.

## Four things people mean when they say "it moves when you scroll"

Most of the confusion in briefs comes from four different techniques sharing one description. They are not the same, they do not cost the same, and only one of them is scrollytelling.

| What you see | What it is called | What drives it | Reversible? |
| --- | --- | --- | --- |
| A block fades or slides in once, as it enters the screen | Scroll-triggered reveal | A one-time trigger when the element becomes visible | No. It plays once and stays |
| Background and foreground move at different speeds | Parallax | Layers offset by a fraction of the scroll distance | Yes, but there is no story, only depth |
| An object turns, a chart draws, a word fills, in step with your scroll, and scrolling back undoes it | Scroll-scrubbed animation | The animation's progress is tied directly to scroll position | Yes. Scroll is the playhead |
| A whole page built as chapters on top of scroll-scrubbed animation | Scrollytelling | The same mechanism, with editorial structure around it | Yes |

A page full of fade-in reveals is not scrollytelling. It is a normal page with entrances. Parallax on its own is decoration. Scrollytelling starts when the scroll is the playhead and the page has something to say in that order.

## Three sites I opened this week, and what each one does

I looked at three pages on 13 October 2026, plus our own. I describe only what rendered on my screen.

**Snow Fall, The New York Times.** Six video elements, no 3D engine, about ten screens tall. Media appears as the reader reaches it. The craft is editorial, not technical: every clip is placed where the text earns it. This is the version of scrollytelling most businesses should study first, because it proves the story matters more than the engine.

**AirPods Pro 3, Apple.** No canvas element at all. Sixteen videos, a hundred images, and seventeen sections carrying Apple's scroll-group attributes. A pinned gallery with its own playback controls. A paragraph whose words darken from grey to black as you scroll past them. Apple drives video and emphasis from the scroll without any live 3D on this page. That is worth knowing if you assumed "scroll-driven" means "WebGL and expensive".

**Oryzo, by Lusion.** A cork coaster that does not exist, sold with a straight face by a studio that says so in its footer. One object sits pinned in the centre of the screen. As you scroll, the world around it goes dark, the copy arrives beside it, and the coaster tilts and turns under your hand. The page is about 44,800 pixels tall, roughly 64 screens, with six canvases and one WebGL context behind them. This is the scroll-scrubbed 3D version, and it is the kind of page we are asked about most.

A note on method: I inspected these in a browser tab that throttles animation and lost its graphics context partway through Oryzo, so my screenshots stop where the rendering stopped. Open each site yourself. That is the whole point of the technique: it has to be felt.

## What we built to answer the question ourselves

Every conversation about a 3D website ends at the same place. The client wants to see one. Not a showreel, a page they can scroll on their own laptop. We did not have one, so we built [Lumière Éclat](/work/lumiere-eclat), a watch for a maison that does not exist.

One watch. Five chapters. The page is dark and the watch is the only lit thing on it. Chapter one measures light. Chapter two is about weight and the absence of it. Chapter three, the collection, turns the scroll sideways and runs horizontally before handing back to the vertical page. Then the atelier. Then the end, or the beginning again. Each chapter changes the watch's angle, its scale and its light, and the reader drives all of it. Nothing autoplays. No cursor tricks. The object answers the scroll and nothing else, because the moment a page performs for its own sake the product stops being the point.

Three decisions in that build matter for anyone commissioning this kind of page:

1. **The copy is in the HTML and paints first.** The 3D scene loads behind it and takes over when it is ready. A reader, or a search engine, gets the words before the spectacle.
2. **The scene is capped to what the device can draw.** Lower resolution and fewer frames on a phone. On a device without WebGL the scene does not draw at all and the page still reads.
3. **Reduced motion gets the chapters as stills.** The story survives with the animation off.

You can scroll it at [watchweb.vercel.app](https://watchweb.vercel.app).

## How a scroll-driven page is built

There are three layers, and you can ask any studio which ones it uses.

**The scroll itself.** We keep the browser's native scroll and smooth it with [Lenis](https://github.com/darkroomengineering/lenis), an MIT-licensed library that wraps the native scroll rather than replacing it, so anchors, sticky elements and keyboard scrolling keep working. Sites that hijack the scroll wheel and replay it on their own timing are the ones that make people feel sick.

**The link between scroll and motion.** We use [GSAP's ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Two of its ideas explain most of what you see on these pages. Scrub ties an animation's progress directly to the scrollbar, so the scroll is the playhead. Pin holds an element on screen for part of the scroll while the content around it keeps moving, which is how Oryzo's coaster and Lumière's watch stay centred while the chapters change. GSAP and all its plugins have been free, including for commercial work, since version 3.13 in April 2025, when it became a Webflow product.

**The thing that moves.** For Apple-style pages it is video and typography. For Oryzo and Lumière it is a real-time 3D object rendered with WebGL. We use Three.js through React Three Fiber inside Next.js. The browser is also growing a native route: [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) let a stylesheet animate properties along a scroll timeline with no JavaScript. MDN still marks the feature as limited availability, meaning it does not yet work in some widely used browsers, so for client work we treat it as an enhancement, not the foundation.

That is our stack in one sentence: Next.js, Lenis, GSAP ScrollTrigger, and Three.js when the page needs a live object.

## What it costs and how long it takes

Two honest numbers, both published on our service pages.

A scroll-driven story on an ordinary site, with video, type and reveals doing the work the way Apple's page does, is part of how we design every site. Custom motion is included in our design and development work, which starts at 2,500 euro for a standard site of five main pages. You do not pay extra for the scroll to mean something.

A 3D scroll-driven site, where a rendered object carries the page the way Lumière's watch does, starts at 6,000 euro and goes live in eight to twelve weeks: two weeks of concept, where we storyboard every scene of the scroll with the object in it; three to four weeks of art, rendering stills for approval and then the animation passes; three to four weeks of build, wiring every scene to the scroll and measuring it on real devices; and a week to launch with a fallback that reads fully with no JavaScript at all. The number moves with the number of scenes, whether a product file exists or we model from scratch, and how many devices the scene has to hold up on. I will put the drivers in writing before you sign anything.

## Where scrollytelling goes wrong

I have four objections to most scroll-driven pages I see, and they are the four things we check in our own work.

**The content is hidden until you scroll.** Google's own guidance says plainly that Google Search does not interact with your page, and that content must load whenever it is visible in the viewport without user action. If your service description only exists after a scroll-triggered fetch, it does not exist to a crawler. The words go in the HTML. The motion decorates them.

**The motion cannot be turned off.** WCAG's criterion on animation from interactions names parallax scrolling as a textbook example of motion that must be switchable off unless it is essential. The operating system has a reduce-motion setting for this. A page that ignores it is choosing to make some visitors ill. Lumière serves stills when that setting is on, and so does every site we ship.

**It is heavy on the phone that most of your visitors hold.** A 3D scene that runs at sixty frames on a studio laptop and ten frames on a mid-range Android is not finished. Resolution caps, frame caps and a no-WebGL path are part of the build, not an add-on.

**The scroll is hijacked.** If scrolling three notches moves the page one chapter on the site's schedule rather than yours, the technique has taken the reader's hand away. Keep native scroll. Let people leave.

## When it is worth it, and when it is not

Scrollytelling earns its cost when a business has one thing to explain in order: a product with a mechanism, a place with a route through it, a process with stages, a story with a turn in it. A watch. A coaster, if you are Lusion and the joke is the point. A property development seen from approach to door. A piece of equipment that opens.

It is the wrong tool for a forty-page site, for content that changes every week, or for a business whose visitor arrives knowing what they want and needing a phone number. Those sites should load fast, read instantly and get out of the way. Putting a scroll story in front of a booking is how you lose the booking.

## Four checks to run on any studio before you commission one

1. **Ask for a page they built with the technique, and scroll it yourself, on your phone.** Not a video of it. If they cannot send you a link, the portfolio is a promise. Ours is Lumière Éclat.
2. **Turn on reduce motion in your phone's accessibility settings and load the page again.** It should still tell the story.
3. **View the page source and search for a sentence from the first chapter.** If the words are there, the content exists without the scroll. If they are not, ask why.
4. **Ask them to name the stack and the price drivers in one sentence each.** A studio that has done this work can. Ours: Next.js, Lenis, GSAP ScrollTrigger and Three.js; the price moves with scenes, modelling and device coverage.

If you want to see how we answer those four questions ourselves, start with the [3D and immersive website service](/services/3d-websites), then scroll the watch.

Until next time.
