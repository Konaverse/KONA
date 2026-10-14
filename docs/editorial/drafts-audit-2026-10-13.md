# Draft audit: the twelve blog drafts against the data and the brand

Audited: 13 October 2026. Audited by Claude at the owner's request, after the owner agreed the brand sentence below. This is a recommendation; the owner decides.

**Brand sentence (agreed 13 October 2026):** Konaverse is an immersive web studio in Cyprus. Local SEO keeps the pipeline alive and builds the review base. The niche terms, the showcase and the citations build the premium side.

## What was checked

- All twelve Markdown drafts in `docs/blog-drafts/`, read in full.
- Mechanics: one H1, em dashes, word count, meta title and description lengths, internal links.
- Demand: each draft's target queries against the September 2026 data in `docs/keyword-research/` (Keyword Planner ranges for 112 terms, 1,311 autocomplete suggestions, the People Also Ask bank from the SERP autopsy). A query absent from that data is marked "not in our data", which means unverified, not zero. The owner has Ahrefs and Semrush open; the unverified sets can be checked there.
- Fit to the brand sentence and to the service each draft feeds.
- Overlap with the three live posts and with each other.
- Four spot checks of sources and claims (Lumière Éclat is a studio concept per `src/lib/case-studies.ts`; the OpenAI Sites, ILO and Miele URLs resolve).

Mechanics passed on every draft: one H1, zero em dashes, titles 46 to 55 characters, descriptions 150 to 158 characters, 1,585 to 2,008 words.

## The finding that matters most

The drafts are careful, sourced and honest. Their problem is not quality. It is that most of them answer questions our own data did not find, in a form that shows nothing of the studio's work.

- Seven of the twelve target sets do not appear anywhere in the September data: headless CMS (two drafts), ChatGPT, AI replacing designers, the three-second rule, speed and conversion, luxury versus premium.
- The queries the data did find open, with an AI Overview built from thin sources, are mostly unwritten: how much a 3D website costs, scrollytelling, the best 3D websites, template versus custom, how long a website takes, the best agencies in Cyprus.
- No draft contains an image, a screenshot, a demo or a measurement from a Konaverse project. The September AI-engine autopsy found agencies were quoted only when a sentence carried stack, price and timeline. Twelve text-only explainers give an engine nothing to quote.
- Read in sequence, the twelve share one skeleton: opening answer, hypothetical scenario, "I want", numbered checklist, service link, "Until next time". Four cite the same W3C evaluation page; three cite the same Google page-experience page. Individually fine, as a series it reads templated.

## Verdicts

| # | Draft | Demand in our data | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Next.js vs. Webflow | Webflow: 1 autocomplete hit, no Planner range | Published 10 Oct | Done. Keep. |
| 2 | What is a headless CMS? | Not in our data | Rewrite | Head term owned by CMS vendors. Rebuild it around the real Sanity setup we just shipped: the Studio, the fields, draft preview, the 60-second refresh, with screenshots. That is a page with stack and timeline, and the only version an engine would quote. |
| 3 | Next.js vs. React for SEO | "next.js" 17 autocomplete hits; "next.js developer" 100 to 1K worldwide | Publish, trimmed | The strongest technical draft. Add one real example: view-source of a Konaverse service page showing the content in the HTML. Remove the double blank line before the rendering section. |
| 4 | Headless CMS disadvantages | Not in our data | Shelve | Two headless articles in a studio with one CMS install is over-weighted. Move its first-year operating table into the rewritten Article 2. |
| 5 | Why custom websites are expensive | "custom website cost" 100 to 1K worldwide; "template vs custom website" 10 to 100 with an open SERP and AI Overview | Rewrite | The data-backed query is template versus custom, which the research listed as winnable. The draft is the vaguest of the twelve: a shoe analogy and a hypothetical 1,000 versus 2,500. Rebuild as what 1,200, 2,500 and 6,000 euro actually buy at Konaverse, with hours and scope. |
| 6 | Web design agency pricing | "how much does a website cost" 1K to 10K worldwide; cost questions in nearly every PAA box | Do not publish as is | It repeats the price table of the live cost article, which would cannibalise it. The owner asked on 3 October for a pricing-drivers piece: what moves a project from one tier to the next. This draft explicitly declines to give per-driver figures. It becomes that piece once the owner supplies real increments; until then fold its proposal-comparison table into the live cost article. |
| 7 | Can ChatGPT create a website? | Not in our data | Shelve | SERP owned by OpenAI and tool blogs. The reader is a do-it-yourself buyer with no budget, the opposite of the brand sentence. Reusable as a LinkedIn post. |
| 8 | Is AI replacing web designers? | Not in our data | Shelve | The audience is designers worried about work, not buyers. Feeds no service. |
| 9 | The three-second rule | Not in our data | Merge into 10 | Correct and honest, but a Core Web Vitals explainer web.dev already publishes. Keep its metrics table. |
| 10 | Website speed and conversion rates | Not in our data; "is a 2.5% conversion rate good" is a PAA answer worth keeping | Publish after merge, with our numbers | The Vodafone, Trendyol and Deloitte evidence is well bounded and the measurement method is original. Add the Konaverse performance passes as the worked example: the shared-effects, homepage and first-load reports have real before and after figures. That makes it the one performance piece, and a citable one. |
| 11 | How to make a website look luxury | "luxury website design" 1K to 10K worldwide, 10 to 100 Cyprus; "premium website design" 100 to 1K; "premium" 30 autocomplete hits | Rewrite with visuals, high priority | The one draft that is both data-backed and on brand, and it has no pictures. Seven design choices about imagery, space and motion need seven illustrated examples: Konaverse work, Lumière Éclat, and inspected sites with credit. Publish once concept piece one exists so the article can show it. |
| 12 | Luxury vs. premium positioning | Not in our data | Shelve | Well written, but the reader is a brand strategist and the SERP is consultancies. Its brief template can become a section of Article 11. |

Summary: 1 published, 2 publish (3 and 10 after their additions), 3 rewrite (2, 5, 11), 1 held for owner input (6), 5 shelve (4, 7, 8, 9 into 10, 12).

## What should be written instead, from the data

These were the open doors in September. Each has a Planner range or an open SERP recorded in `docs/keyword-research.md`, and each gives the studio something to show.

1. **How much a 3D website costs.** 10 to 100 worldwide, PAA on the 3D design query, AI Overview built from two small posts. Our price is from 6,000 euro with a timeline. Nobody in the top ten answers it.
2. **What scrollytelling is, what it costs, and sites that do it well.** "scrollytelling" 1K to 10K, "scrollytelling website" 100 to 1K, "best scrollytelling websites" 10 to 100. This is planner Article 13 and the next in line; it must name the stack and show Lumière Éclat and the concept pieces.
3. **The best 3D websites, ranked, and what they cost to build.** The flagship from the research, refreshed yearly. Three inspected sites minimum, with screenshots and credit. Lusion's work belongs here.
4. **Template or custom website.** The rewrite of Article 5.
5. **How long a website takes to build.** 1K to 10K worldwide, objection handling, low competition.
6. **The best web design agencies in Cyprus, including competitors.** Two Cyprus agencies published this and were cited by Perplexity for it.
7. **The pricing-drivers piece.** Blocked on the owner's per-driver figures.

## Verification notes

- Lumière Éclat is a studio concept, not a client. The live Next.js vs. Webflow article says so correctly. It is also, already, concept piece one.
- The OpenAI Sites documentation, the ILO article and the Miele philosophy page all returned 200 on 13 October 2026. Content was not re-read for this audit.
- "Not in our data" is a limit of the September collection, not a measured zero. The owner can confirm or overturn any of these in Ahrefs Keywords Explorer; the seven unverified sets are listed above.

## Decisions for the owner

1. Accept the shelve list, or name any of the five to keep.
2. Supply the per-driver price increments for Article 6, or accept folding it into the live cost article.
3. Confirm the writing order: scrollytelling, 3D cost, best 3D websites, template versus custom, then the rewrites of 11, 2 and 5.
4. Decide whether Article 3 and the merged 10 go into the CMS now, after their additions, as the next two publications.
