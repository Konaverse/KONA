# SXO evidence: search experience, 21 October 2026

Scope: SERP backwards analysis for every row of the keyword map (docs/seo-plan-q4-2026.md §6), page-type match, and
persona scoring of the target pages for two personas: a Cyprus SME owner choosing a web designer, and a brand or
marketing lead abroad looking for an immersive studio. This is the **SXO Gap Score**, separate from any SEO health score.

Status labels: NEW, STILL OPEN, REGRESSED, CONFIRMED FIXED. The coordinator stopped data gathering early; everything
below is from evidence already collected. No keyword row was left unanalysed, but the depth of the SERP sample varies and
is stated per row.

## Method and evidence base

- Pages fetched 21 Oct 2026 with `render_page.py --mode auto --json` (all pages SSR, `is_spa: false`, so raw and rendered
  DOM are the same) and parsed with `parse_html.py`: /services, /services/web-design, /services/3d-websites,
  /services/website-redesign, /services/one-page-websites, /services/seo, /blog. Visible-text outlines were built from the
  fetched HTML.
- SERPs: WebSearch on 21 Oct 2026 for all eight keywords. **WebSearch is US-based and returns a result set, not Google's
  ranked page; it cannot reproduce a Cyprus SERP, the local pack or ads.** For the Cyprus rows the ranked order comes from
  the 13 Oct observations seen from Cyprus (docs/seo-state-2026-10-13.md) and the 4 Sep autopsy (docs/keyword-research/
  serp-autopsy.md, gl=cy). Each row says which source carries it.
- Page types use the claude-seo SXO taxonomy (Landing, Blog Post, Product, Hybrid, Service, Comparison, Local, Tool),
  with "gallery" (inspiration showcase) and "directory" (Clutch-type list) noted as sub-labels of Comparison.

## What the target pages are (all six service pages share one template)

| URL | Title | H1 (visible) | Words | Price and time in the first answer |
|---|---|---|---:|---|
| /services/web-design | Web Design in Cyprus \| Konaverse | Web design in Cyprus | 1,104 | from €1,800 design, €2,500 designed and built, 4 to 6 weeks |
| /services/3d-websites | 3D and Immersive Website Design \| Konaverse | 3D websites / Immersive website design, for brands anywhere | 1,005 | from €6,000, 8 to 12 weeks, "60 fps on a mid-range phone" |
| /services/website-redesign | Website Redesign Services \| Konaverse | Website redesign / For sites the business has outgrown | 945 | from €2,500, 4 to 8 weeks, "0 lost" old URLs |
| /services/one-page-websites | One-page Website Design \| Konaverse | One-page websites / Landing pages and single-page sites, designed and built | 902 | from €1,200, 2 to 3 weeks |
| /services/seo | SEO Services in Cyprus \| Konaverse | SEO / Search and AI visibility for Cyprus businesses | 873 | audit €500, from €300 a month, 3-month minimum |
| /services | Web Design and Development Services \| Konaverse | Services / Web design, development and 3D websites, from Cyprus | 199 | none |

Template order on every service page: H1 + "The short answer" (price, time, one fact) → "What it is / When it is the wrong
choice" → four problem cards answered with a named project → "Recent ... work" (linked to /work/[slug]) → "What you get"
(six deliverables) → "Add-ons and running costs" (priced) → "How it goes" (steps with weeks, "You give / You get") →
"Make yours the site they remember." (Book a call + brief router) → sister service + "From the blog" link where one exists.

Classification: all six are **Service Pages** (process + case studies + consultation CTA). /services is a **service
index** (six cards, 199 words, no prices, no proof, no CTA inside the main content; footer off).

Observed on every service page and the hub:
- No named person in visible copy. Konstantinos Kyprianou, Nabil Al Jbawi and Andreas Kyriakou exist only in the JSON-LD
  `founder` / `Person` nodes.
- The phone +357 96 273855 appears once per page, inside the JSON-LD only. No visible number and no `tel:` link.
- No visible "founded 2021", team size, or Lakatameia / Nicosia studio location (the Clutch profile states all three).
- No reviews or ratings anywhere (correct: GBP and Clutch hold 0 reviews and no Review schema is allowed).
- Work cards link to case studies; two of the projects shown are labelled "(fictional)" (City Arcade, Lumière Éclat).

## Keyword rows: SERP backwards analysis

### 1. "web design cyprus" → /services/web-design

SERP source: 13 Oct from Cyprus (ranked), 4 Sep gl=cy (ranked), 21 Oct WebSearch (unranked set).
- 13 Oct: four ads, Clutch, **local pack** (Absolute 48 reviews, Mojo 34, Limdez 12), Web Theoria, UntitledPros, a
  freelancer, GOOiZ, DesignRush, Absolute, Limdez, Mojo, The Manifest; Reddit r/cyprus in discussions.
- 4 Sep: cypruswebdesigners, Web Theoria, Clutch, natasalagou (freelancer), oncypruswebdesign, Absolute, UCLan course,
  Sortlist, QoboWEB. PAA: "How much does it cost to design a website in Cyprus?", "How much should a full website design
  cost?". Ads anchor on price ("from €800").
- 21 Oct set: webtheoria.com/cyprus-web-design (service page), nxdpro.com "Web Design in Nicosia" and its web-design
  service page, clutch.co/cy/web-designers and /agencies/design (directory), onelittleweb "Top 28 Website Design Agencies
  in Cyprus (2026)" (listicle), two techbullion/passionates articles.

Consensus: of the 13 Oct organic results, about 6 of 10 are agency service or home pages and about 4 of 10 are
directories (Clutch, DesignRush, The Manifest, Sortlist). The local pack sits above all of it.
Page type match: **ALIGNED** (service page vs agency service pages).
What the ranking pages carry that ours lacks: years in business ("since 2008", "since 2003"), a street or city, a phone in
the header, review counts in the pack and on Clutch. What ours carries that theirs mostly do not: a price and timeline in
the first sentence, a priced add-on list, a weekly process, named Cyprus clients linked to case studies.
Reading: the page is the right type and answers the PAA cost question better than the 4 Sep set. The gap is entity trust
(reviews, local pack, links), which is off-page and recorded in seo-state-2026-10-13.md. STILL OPEN at the entity level.

### 2. "web design agency cyprus" → /services

SERP source: 13 Oct "best web design agency cyprus" from Cyprus (ranked); 21 Oct WebSearch (unranked set).
- 13 Oct: Clutch, local pack (avocadots 51, Absolute 48, Mojo 34), Web Theoria, Sortlist, Mojo, DesignRush, The Manifest,
  Absolute, Avocadots, TechBehemoths.
- 21 Oct set: Web Theoria About page and homepage, RevenueBase "web design agencies, Cyprus" (183 firms, "data refreshed
  September 2026"), Clutch profile + Cyprus design list, DesignRush profile, Mailchimp experts directory, passionates.

Consensus: directories and lists about 55 to 60 percent; agency homepages or About pages about 40 percent. The agency pages
that rank lead with entity facts (founded year, location, number of sites built).
Page type match: **HIGH mismatch.** /services is a 199-word index of six cards with no studio facts, no prices, no work,
no people and no CTA in the main content. It is neither the comparison page the SERP mostly rewards nor the
entity-rich agency page that also ranks.
Plan check: plan §6 asked for the H1 "Web design, development and 3D website services"; the live H1 is
"Services / Web design, development and 3D websites, from Cyprus". Close enough on topic; the word "agency" appears
nowhere on the page. STILL OPEN.

### 3. "immersive website design" → /services/3d-websites

SERP source: 13 Oct from Cyprus (ranked); 21 Oct WebSearch (unranked set).
- 13 Oct: Dribbble, YouTube roundups, Awwwards, Figma, Webflow, Behance, Metabole Studio's examples post.
- 21 Oct set: agency blog explainers (element8 "immersive website design UAE lessons", Bluetext "designing a truly
  immersive website experience", Matchbox Design Group, Anglian Internet news, Rockingtech "Flash to WebGL"), Code Capsule
  tag and post, one service sub-page (clarity-ventures "Immersive Web Design Elements").

Consensus: inspiration galleries and explainer posts, about 85 to 90 percent; agency service pages about 10 percent.
Page type match: **HIGH mismatch.** The keyword research (4 Sep) chose this term because "immersive website design
agency" returned an agency SERP; the bare term the map now targets does not. A service page cannot displace Dribbble,
Awwwards and explainer posts here.
What the ranking explainers contain that the 3D page lacks: a definition, examples with names, the technologies in plain
words (WebGL appears on our page only in the meta description; "Three.js" and "scrollytelling" do not appear in visible
copy), and performance or accessibility caveats. NEW (the map's assumption is contradicted by the 13 Oct observation).

### 4. "3d website design agency" → /services/3d-websites

SERP source: 13 Oct from Cyprus (ranked), 4 Sep gl=us (ranked), 21 Oct WebSearch (unranked set).
- 13 Oct: Dribbble, Noomo, Awwwards, Lusion, PeachWeb, A1 Gallery; Greek ads; no Cyprus studio.
- 4 Sep: Noomo, Lusion, PeachWeb, Dribbble, thedigitalpanda, Superside "12 Best 3D Design Services" (listicle), Utsubo
  "10 Best Three.js Agencies (2026): Pricing, Strengths" (listicle by a studio), Zajno, landing.love. AI Overview present.
- 21 Oct set: G2 "3D Web Design Services" category (three pages), svilenkovic.com "design agency 3d website" (price
  ranges $3,500 to $15,000), Dribbble services, Sortlist London 3D design, Digital Pieces explainer, a Zero Negative press
  release.

Consensus: studio homepages about 35 percent, directories and ranked lists about 35 percent, galleries about 30 percent.
Page type match: **MEDIUM mismatch.** Studios rank with homepages carried by awards and reels; the service page is an
acceptable type, but the exact phrase is missing.
Plan check: plan §6 asked for "3d website design agency" literal in the first 100 words and in an H2. Visible copy has
0 occurrences; no H2 carries it (H2s: "Make the screen a place", "What a 3D site fixes", "Recent 3D and motion work",
"What you get", "Add-ons and running costs", "How it goes"). STILL OPEN.
What we have that the ranking studios do not: a published starting price (€6,000) and timeline (8 to 12 weeks), which is
exactly what the Utsubo list and svilenkovic page get cited for.

### 5. "website redesign cyprus" → /services/website-redesign

SERP source: 21 Oct WebSearch only (unranked set); plan §6 note from 2 Oct gl=cy ("no dedicated redesign page in the CY
top 10"). No Cyprus-localised ranked view for this exact query exists in the record.
- 21 Oct set: redesign case studies and portfolio entries (Fidelity "Elpis Medical Centre: Website Redesign", Enigma
  Global "Website Redesign for Multibuild Ltd", Web Theoria portfolio "WePrint", Contra "Option Estates"), news
  (Cyprus Mail gov.cy revamp, Cyprus Mail banking association relaunch, CBN "Lawyers in Cyprus" relaunch, EY press
  release), Action PR (UCLan rebuild), a student project.

Consensus: case-study / portfolio pages about 50 percent, news about 40 percent, zero dedicated redesign service pages.
Page type match: **MEDIUM mismatch.** The SERP rewards named Cyprus redesign case studies. Our closest asset is the Velricon
case study, not the service page.
On-page: "Cyprus" is absent from the title ("Website Redesign Services | Konaverse"), the H1 and the description; the
page targets the global head term the plan parked for "later". The only Cyprus mention is the card label
"Financial advisory, Cyprus". NEW.
Claim to verify: the card "Nobody finds us unless they already know our name" says Velricon's "each new service page now
owns its own term". That reads as a ranking outcome. If Search Console does not show it, reword to describe the work done,
not a result (owner rule: no invented SEO outcomes). NEW.

### 6. "one page website design" → /services/one-page-websites

SERP source: 4 Sep gl=us (ranked); 21 Oct WebSearch (unranked set).
- 4 Sep: onepagelove (gallery), onepage.io (builder), Awwwards single-page (gallery), Canva builder, Dribbble,
  "51 one page website examples", Reddit, Avada explainer. PAA: "How much does it cost to design a one-page website?",
  "What does a 1 page website look like?".
- 21 Oct set: GeeksforGeeks, IONOS Digital Guide (four regional copies), Graphicsfuel, Hongkiat inspiration, LoginPress
  "One Page Website Examples (2026)", Webalive "15 Examples".

Consensus: examples / inspiration about 60 percent, explainers and builders about 40 percent, zero agency service pages.
Page type match: **HIGH mismatch** for the head term. The 4 Sep autopsy already said "target the cost PAA, not this head
term"; the map row still names the head term. STILL OPEN (known since 4 Sep).
What the page does well for the PAA: "It costs from €1,200 and is live in two to three weeks" in the first answer, which
answers "How much does it cost to design a one-page website?" directly.

### 7. "seo cyprus" → /services/seo

SERP source: 4 Sep gl=cy (ranked); 21 Oct WebSearch (unranked set).
- 4 Sep: seocyprus.com (exact-match domain), hscoms /seo, Clutch SEO firms, a freelancer, zingzee "Rank on Google & AI
  Search", LinkedIn jobs, opensolutions, onlinesolutions /seo-cyprus, Sortlist, DLK /seo. Local pack present. PAA: "How much
  does an SEO expert cost?".
- 21 Oct set: Web Theoria SEO agency page (two URLs), Sortlist agency profile, EU HRDA SEO training, Ranktracker guide,
  Growth.Talent jobs, LinkedIn article, CMSWire press release, an Academia profile.

Consensus: agency SEO service pages about 50 percent, directories about 20 percent, intent noise (jobs, training) about
30 percent.
Page type match: **ALIGNED.**
What ours has: price for the PAA (audit €500, from €300 a month, three-month minimum), an AI-search problem card ("ChatGPT
and Perplexity never mention us"), a monthly deliverable list. Plan §6 asked for "an AI-search section": CONFIRMED FIXED
as a problem card.
What ours lacks: any measured outcome. "Recent search work" lists Velricon, HEIMAT and Los Santos by method only, which is
honest; nothing replaces outcomes yet, and the studio's own site has no non-brand rankings to point to.

### 8. "scrollytelling" → /services/3d-websites and the blog

SERP source: 13 Oct "scrollytelling website" from Cyprus (ranked); 21 Oct WebSearch "scrollytelling" (unranked set).
- 13 Oct: Awwwards, an AI Overview built from Vev, Metabole, Scrollytelling.ai, Shorthand and Flourish, then Dribbble,
  Webflow, Maglr, Wix.
- 21 Oct set: imforza help "What is scrollytelling?", eLearning Industry, data.europa.eu data-visualisation guide,
  The Plus Addons blog, Flourish "no-code scrollytelling", Eager Eyes "The scrollytelling scourge" (critique), an arXiv
  study (454 participants), Tableau extension.

Consensus: informational explainers and guides about 70 percent, tools and tool listicles about 30 percent. Zero service
pages.
Page type match: **CRITICAL mismatch.** No live page of the right type exists. /blog lists three posts (Next.js vs
Webflow, redesign without losing SEO, website cost Cyprus); the scrollytelling article exists only as a local draft
(docs/blog-drafts/what-is-scrollytelling.md). The 3D page uses "scroll-driven scenes" and never the word
"scrollytelling", and has no "From the blog" link because no 3D post is live. STILL OPEN (blog plan item since 4 Sep).

## User stories (from SERP signals)

1. As a **Cyprus SME owner**, I want to know what a custom site costs before I call anyone, because ads anchor me at
   "from €800", but I'm blocked by **price sensitivity** and quotes I can't compare. *(PAA "How much does it cost to design a
   website in Cyprus?"; Absolute ad "from €800", 4 Sep)* Stage: consideration. Our pages answer this in the first paragraph.
2. As a **Cyprus SME owner**, I want to pick a firm other people have used, because I can't judge design quality myself,
   but I'm blocked by a **trust gap**: the firms in front of me show 12 to 51 reviews and this one shows none.
   *(Local pack review counts and Clutch first, 13 Oct)* Stage: decision.
3. As a **buyer comparing agencies**, I want a short list with years, size, location and price, because there are 183 firms,
   but I'm blocked by **comparison fatigue**. *(RevenueBase "183 web design agencies", OneLittleWeb "Top 28", Clutch,
   DesignRush, 13 and 21 Oct)* Stage: consideration.
4. As a **brand or marketing lead abroad**, I want to see live immersive work and know the studio can ship it fast on a
   phone, because I've seen 3D sites stutter, but I'm blocked by a **trust gap** against award-led studios.
   *(Noomo, Lusion, Awwwards on "3d website design agency"; Utsubo list "Pricing, Strengths", 4 Sep and 13 Oct)* Stage:
   decision.
5. As a **marketer researching the format**, I want to understand what scrollytelling or an immersive site is and see
   examples, because I'm briefing a project, but I'm blocked by an **information gap** that only tool vendors answer.
   *(AI Overview from Vev, Shorthand, Flourish; PAA "What is a scrollytelling website?", 13 Oct and 4 Sep)* Stage: awareness.

## Persona scoring

The coordinator specified two personas; the claude-seo method normally derives four to seven. A third, SERP-derived
persona (the format researcher, story 5) is scored only for the scrollytelling row, where neither buyer persona applies.

**Cyprus SME owner**: owner or manager of a 5 to 50 person Cyprus business; goal: shortlist and contact a designer;
emotional state: evaluating carefully, price-anchored by ads; key questions: what will it cost all-in, who has used you,
who will I deal with, can I just call you. Evidence: PAA cost cluster, ads, local pack, Reddit r/cyprus threads.

**Brand / marketing lead abroad**: in-house brand or marketing lead at a product, hospitality or tech brand outside Cyprus;
goal: find an immersive studio and brief it; emotional state: evaluating carefully against award-winning studios; key
questions: show me live work like mine, what does it cost and how long, who builds it, how do we work across a distance.
Evidence: studio homepages + Awwwards on "3d website design agency", listicles citing pricing and strengths.

Scores: Relevance / Clarity / Trust / Action, 25 each.

| Page | Persona | R | C | T | A | Total | Rating |
|---|---|---:|---:|---:|---:|---:|---|
| /services/web-design | SME owner | 22 | 22 | 11 | 18 | 73 | Good |
| /services/web-design | Lead abroad | 12 | 21 | 11 | 16 | 60 | Good (low) |
| /services/3d-websites | Lead abroad | 19 | 21 | 9 | 16 | 65 | Good (low) |
| /services/3d-websites | SME owner | 11 | 20 | 9 | 16 | 56 | Needs work |
| /services/website-redesign | SME owner | 20 | 22 | 12 | 18 | 72 | Good |
| /services/website-redesign | Lead abroad | 15 | 21 | 11 | 16 | 63 | Good (low) |
| /services/one-page-websites | SME owner | 22 | 22 | 12 | 18 | 74 | Good |
| /services/one-page-websites | Lead abroad | 12 | 21 | 11 | 16 | 60 | Good (low) |
| /services/seo | SME owner | 21 | 21 | 9 | 17 | 68 | Good |
| /services/seo | Lead abroad | 8 | 20 | 9 | 15 | 52 | Needs work |
| /services | SME owner | 15 | 11 | 5 | 9 | 40 | Needs work |
| /services | Lead abroad | 12 | 11 | 5 | 9 | 37 | Critical |
| 3D page + /blog for "scrollytelling" | Format researcher | 6 | 5 | 8 | 8 | 27 | Critical |

Evidence behind the scores:
- **Relevance.** Web design, redesign, one-page and SEO pages speak to Cyprus businesses by name ("It is for Cyprus
  businesses that have outgrown the template"); the 3D page says "for brands anywhere" and names product, hospitality and
  technology brands. The 3D page's €6,000 floor and object-led framing make it a poor fit for most SMEs (correctly).
- **Clarity.** Strong everywhere on the service template: price, time and one fact sit in the first answer and the fact
  strip, add-ons are priced, the process has weeks per step. The hub scores 11 because it shows no price or timeline and
  each card must be opened. The scrollytelling row scores 5 because the word does not appear on any live page.
- **Trust.** The systemic weakness. What exists: named, linked Cyprus clients (Velricon, Chris N Clean, HEIMAT, Los
  Santos), first-hand detail (121 rendered frames, 73-frame phone cut), the redesign post about moving 172 URLs. What is
  missing: any third-party review (GBP 0, Clutch 0), any named person on the page, years in business, studio location,
  awards. On the 3D page one of two showcased projects is a studio concept labelled "(fictional)", against competitors
  whose SERP presence is award-driven. The "60 fps on a mid-range phone" fact has no device or method beside it.
- **Action.** Two CTAs at the top (Start a project, Book a call), a brief router at the bottom, Calendly preloaded. Not
  scored higher because the phone number is not visible on any service page (it exists only in JSON-LD), and SME owners in
  Cyprus are the persona most likely to call. For the lead abroad, nothing says how remote work runs (time zone, language,
  currency, calls). The hub has no CTA in its main content and its footer is off.

### Weakest persona first

1. **Lead abroad on /services (37)** and **SME owner on /services (40).** Top issue: the hub answers none of "who are you,
   what does it cost, what have you made". Fix: inside the existing carousel cards, add the "from" price and time already
   published on each service page (Web design from €1,800, 4 to 6 weeks; 3D from €6,000, 8 to 12 weeks; and so on), and
   add one designed studio-facts band (founded 2021, the three founders by name, Lakatameia, Nicosia, English and Greek)
   plus a "Book a call" button. Facts must match Clutch and GBP exactly.
2. **Format researcher on "scrollytelling" (27).** Top issue: no live page of the right type. Fix: the owner publishes
   the drafted scrollytelling article when ready (drafting does not authorise publication), then the 3D page's sister/blog
   slot links to it. Separately, the 3D page's "What it is" block can name the technique once in plain words, for example:
   "Scroll-driven storytelling, often called scrollytelling: the page moves the story as you read."
3. **Lead abroad on /services/seo (52)** is expected (Cyprus service) and not a priority.
4. **SME owner on /services/3d-websites (56)** is expected (wrong-fit buyer); the page's "When it is the wrong choice"
   already routes them away, which is good practice.

### Systemic issues (lowest dimension across personas)

- **Trust** is the lowest dimension on every page (5 to 12 of 25). Most of it is off-page (reviews, links), but two
  on-page gaps are fixable now: no named people, no visible studio facts.
- **Action** loses points on every page for the missing visible phone and, for the lead abroad, the missing "how we work
  remotely" line.

## Findings

| # | Severity | Status | Finding | Evidence | URL | Fix (in the designed-section format) |
|---|---|---|---|---|---|---|
| 1 | Critical | STILL OPEN | "scrollytelling" has no live page of the matching type | SERP 13 Oct: Awwwards + AIO from Vev, Metabole, Scrollytelling.ai, Shorthand, Flourish; 21 Oct set is explainers and guides. /blog has 3 posts, none on the topic; 3D page has 0 occurrences of the word | /blog, /services/3d-websites | Owner publishes the drafted article when ready; then link it from the 3D page's "From the blog" slot. One plain-words mention of the term in "What it is" |
| 2 | High | NEW | "immersive website design" is an inspiration/explainer SERP, not the agency SERP the map assumed | 13 Oct: Dribbble, YouTube, Awwwards, Figma, Webflow, Behance, Metabole examples post; 21 Oct: about 8 of 9 results are explainer posts. The 4 Sep agency SERP was for "immersive website design agency" | /services/3d-websites | Re-point the 3D page's primary to the agency phrasing ("immersive website design agency" / "3d website design agency") and serve the bare term with an explainer or examples post (blog plan items 3 and 4) |
| 3 | High | STILL OPEN | Hub is a 199-word index with no prices, proof, people or in-content CTA, against a directory-and-entity SERP | 13 Oct "best web design agency cyprus": Clutch, local pack, Web Theoria, Sortlist, Mojo, DesignRush, Manifest, Absolute, Avocadots, TechBehemoths; 21 Oct: RevenueBase (183 firms), Web Theoria About page. Hub H1 "Services / Web design, development and 3D websites, from Cyprus"; "agency" appears 0 times | /services | "From" price and time on each carousel card; one studio-facts band (founded 2021, founders named, Lakatameia, Nicosia); a Book a call button; one plain sentence calling Konaverse a web design studio (or agency) in Cyprus |
| 4 | High | NEW | No named person and no visible phone on any service page or the hub | Founder names and +357 96 273855 appear only in JSON-LD; no `tel:` link; personas ask "who will I deal with" and Cyprus SMEs call | all six service pages, /services | In the closing "Make yours the site they remember." section, add the person who takes the call (name, role, portrait already in /people) and a visible tap-to-call link beside Book a call |
| 5 | Medium | STILL OPEN | "3d website design agency" literal missing from first 100 words and every H2 | Plan §6 requirement; visible copy 0 occurrences; H2 list above. SERP (4 Sep, 13 Oct): Noomo, Lusion, PeachWeb, Zajno, Utsubo and Superside lists | /services/3d-websites | Work the phrase into the first answer and the "Recent 3D and motion work" H2 (for example "3D website design agency work: recent projects"), without stuffing |
| 6 | Medium | NEW | 3D page trust is thin for the global persona: one of two showcased projects is fictional; no stack, awards or measurement method | Cards: "Lumière Éclat, Haute horlogerie (fictional)", "Chris N Clean". Fact strip "On a mid-range phone 60 fps" with no device. Competitors rank on awards (Awwwards, Lusion, Noomo) | /services/3d-websites | Name the device and tool behind the 60 fps figure only if measured; name the stack once in "What you get" (WebGL, Three.js, Blender) as the Utsubo list does; keep the fictional label (honest) and add the next real 3D project when it exists |
| 7 | Medium | NEW | Redesign page targets the global head term, not the mapped "website redesign cyprus" | Title "Website Redesign Services \| Konaverse"; H1 without Cyprus; only Cyprus mention is a card label. 21 Oct SERP set: Cyprus redesign case studies and news, no service pages | /services/website-redesign, /work/velricon | Add "in Cyprus" to the H1 modifier line or the description, and make sure the Velricon case study names itself a redesign in its title or H1 (not checked in this pass) |
| 8 | Medium | NEW | Possible unverified SEO outcome claim | Redesign card: Velricon "each new service page now owns its own term" | /services/website-redesign | Confirm in Velricon's Search Console; if not shown, describe the work ("each service now has its own page, written for its own search") rather than a result |
| 9 | Medium | STILL OPEN | "one page website design" head term is an inspiration/builder SERP | 4 Sep: onepagelove, onepage.io, Awwwards, Canva, Dribbble; 21 Oct: IONOS, Hongkiat, LoginPress, Webalive examples | /services/one-page-websites | Re-point the map row to the cost/PAA and Cyprus phrasing the page already answers ("from €1,200 ... two to three weeks"); leave the head term to a future examples post |
| 10 | Low | CONFIRMED FIXED | SEO page carries an AI-search section and price | Card "ChatGPT and Perplexity never mention us"; audit €500, from €300 a month | /services/seo | None |
| 11 | Low | CONFIRMED FIXED | Service pages answer the cost PAA in the first paragraph | All five service pages state price and time in "The short answer" | five service pages | None |
| 12 | Info | STILL OPEN | Cyprus head terms are decided by the local pack and reviews, not page type | 13 Oct local packs hold 12 to 51 reviews; Konaverse GBP and Clutch 0 | /services/web-design, /services/seo | Off-page, already in seo-state-2026-10-13.md |

## SXO Gap Score: 61 / 100

| Dimension | Score | Evidence |
|---|---:|---|
| Page type | 7 / 15 | Aligned on 2 rows (web design cyprus, seo cyprus); medium on 2 (3d agency, redesign cyprus); high on 3 (immersive website design, agency cyprus hub, one page website design); critical on 1 (scrollytelling) |
| Content depth | 11 / 15 | Service pages 873 to 1,104 words, answer-first, priced add-ons, weekly process, first-hand project detail; hub 199 words; no live 3D or scrollytelling article |
| UX signals | 10 / 15 | Price and time above the fold, anchor nav (Brief to Start), two CTAs, brief router; hub has no CTA in content; phone not visible anywhere |
| Schema | 13 / 15 | Organization + ProfessionalService, three Person nodes, WebSite, Service, BreadcrumbList on service pages (detail belongs to the schema audit) |
| Media | 10 / 15 | Real project imagery and renders, 27 images on the web design page; visual quality not assessed in this pass |
| Authority | 3 / 15 | 0 reviews on GBP and Clutch, no awards, no visible people or studio facts, real link profile in single digits, two fictional concepts among showcased work |
| Freshness | 7 / 10 | Prices and hosting updated in October; blog posts dated 3 and 10 October 2026; no visible dates on service pages (normal for the type) |

## Limitations

- WebSearch cannot localise to Cyprus and does not return Google's ranked order, the local pack, ads, AI Overviews or PAA.
  Cyprus rows rely on the 13 Oct and 4 Sep observations; percentages are approximate.
- The coordinator stopped gathering early: the Velricon, Chris N Clean and Lumière Éclat case studies, /about, /contact
  and /services/web-development were not fetched, so whether the case studies close the trust gaps above is unverified.
- No screenshots were taken; above-the-fold claims come from the DOM order and the fact strip, not a visual render.
  Media quality and motion were not judged.
- CTA accessible names were not tested; the visible-text extraction shows letter-split spans inside the buttons, which
  may be aria-hidden. The accessibility audit should confirm.
- Indexing status of the service pages was not rechecked here; on 14 Oct they were "Discovered, currently not indexed".
  None of the on-page fixes above matter for ranking until they are crawled.
- Persona scores are expert judgement against the claude-seo rubric, not user testing.

Cross-skill pointers: E-E-A-T and named-author depth → `/seo content`; schema detail → `/seo schema`; local pack and GBP →
`/seo local`; hub thinness → `/seo page`. A PDF can be generated with `/seo google report`.

## Sources (21 Oct WebSearch)

- [Web Theoria, Cyprus web design](https://webtheoria.com/cyprus-web-design/)
- [NXDPRO, Web Design in Nicosia](https://www.nxdpro.com/en/web-design-nicosia)
- [Clutch, Cyprus web designers](https://clutch.co/cy/web-designers.md)
- [Clutch, Cyprus design agencies](https://clutch.co/cy/agencies/design.md)
- [OneLittleWeb, website design agencies in Cyprus](https://onelittleweb.com/top-agencies/website-design-agencies-in-cyprus/)
- [RevenueBase, web design agencies in Cyprus](https://revenuebase.ai/companies/web-design-agencies/cyprus)
- [DesignRush, Web Theoria profile](https://www.designrush.com/agency/profile/web-theoria-ltd)
- [element8, immersive website design](https://www.element8.ae/blogs/immersive-website-design-uae-lessons)
- [Bluetext, designing a truly immersive website experience](https://bluetext.com/blog/designing-a-truly-immersive-website-experience/)
- [Clarity Ventures, immersive web design elements](https://www.clarity-ventures.com/services/web-design/immersive-elements)
- [G2, 3D web design services](https://g2.com/categories/3d-web-design-services)
- [Svilenkovic, design agency 3D website](https://www.svilenkovic.com/3d/design-agency-3d-website)
- [Fidelity, Elpis Medical Centre redesign](https://www.fidelity.com.cy/?p=63229)
- [Enigma Global, Multibuild redesign](https://www.enigmaglobal.com/project/website-redesign-for-multibuild-ltd/)
- [Cyprus Mail, banking association relaunch](https://cyprus-mail.com/2026/08/20/cyprus-banking-association-launches-revamped-digital-platform)
- [IONOS, one-page design](https://www.ionos.co.uk/digitalguide/websites/web-design/web-design-trends-one-page-design/)
- [Hongkiat, single-page web design](https://www.hongkiat.com/blog/single-page-web-design)
- [Web Theoria, SEO agency](https://webtheoria.com/seo-agency/)
- [Sortlist, SEO Agency Cyprus](https://www.sortlist.co.uk/agency/seo-agency-cyprus)
- [data.europa.eu, scrollytelling introduction](https://data.europa.eu/apps/data-visualisation-guide/scrollytelling-introduction)
- [Flourish, no-code scrollytelling](https://flourish.studio/blog/no-code-scrollytelling/)
- [Eager Eyes, the scrollytelling scourge](https://eagereyes.org/blog/2016/the-scrollytelling-scourge)
