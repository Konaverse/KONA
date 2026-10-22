# Niche cluster plan: global English terms, 22 October 2026

Run with the claude-seo cluster workflow (`skills/seo-cluster`, SERP-overlap methodology) on the brief in `BRIEF.md`. Scope: the global, English, premium side (3D and immersive, scrollytelling, redesign, one-page, website cost and template versus custom, Next.js and headless as far as the existing posts reach). Cyprus "X cyprus" queries are out of scope; another agent collects those from the owner's browser.

Labels: **measured** = a number from a tool or a result set fetched in this run or recorded earlier; **observed** = seen on a page or in a result list, with the URL; **inferred** = my judgement. Nothing here was published, committed or changed. Only this file was written.

## 0. Method, and what the data can and cannot show

**What was collected (measured).**
- 51 keywords, one WebSearch each, plus 3 repeat searches to test stability: 54 searches. Every result set was stored and URL-normalised (scheme, `www.`, trailing slash, `/amp`, `.md`/`.txt` mirrors stripped; WordPress `?p=` shortlinks mapped to the article they duplicate when the same domain showed the same title). All 1,275 keyword pairs were compared, not only the within-group pairs, because the results were cached.
- **WebSearch returns US results from its own engine. It is not Google's ranked top 10.** Treat every overlap number from it as a US, non-Google measurement. None of it is a Cyprus result.
- Cross-check: the Google result lists already on file. 10 global queries from 4 September (`docs/keyword-research/serp-autopsy.md`, Google `gl=us`) and 3 global queries seen on Google from Cyprus on 13 October (`docs/seo-state-2026-10-13.md`). These were recorded mostly as domains, so that comparison is domain-level only.
- Demand: September Keyword Planner ranges, worldwide (`docs/keyword-research/keyword-planner-raw.md`), autocomplete feed counts (`suggest.md`, 1,311 suggestions, "feeds" = how many of the engine-by-locale feeds returned the term), and the two Semrush US lookups from 13 October (scrollytelling 720 a month, difficulty 40; immersive website design 50 a month, difficulty 18). No volume in this file is invented. "Below floor" means Keyword Planner returned no figure.

**What the overlap numbers look like (measured).** Of 1,275 pairs, 1,251 share 0 URLs, 15 share 1, 6 share 2 and 3 share 3. No pair reaches 4. The three repeat searches ("immersive website design", "scrollytelling website", "website redesign cost") returned identical lists, so the engine is stable within the session, but that says nothing about Google.

**Why the thresholds cannot be applied as written (observed, then inferred).** The engine matches the query's wording closely. "website redesign cost" returned nine pages, all with "redesign cost" or "redesign price" in the address; "how much does a website cost" returned nine pages titled exactly that; "how much does a 3d website cost" returned eight pages from one domain (svilenkovic.com) plus one from utsubo.com. The 7+ ("same post") and 4 to 6 ("same cluster") bands are therefore unreachable with this tool, and reading every 0 to 1 as "separate" would split topics Google groups. The Google records show the noise floor: the same query recorded on 4 September (US) and 13 October (from Cyprus) shared only 5 domains ("scrollytelling website") and 4 ("3d website design agency").

**How the calls were made.** In order: measured URL overlap from this run; domain overlap as the tiebreak (the methodology's step 4); the Google domain overlap where a record exists; then agreement of dominant page type and intent. Every cluster below says which of these it rests on. Groupings that rest only on page type and intent are labelled **inferred**.

**What the data cannot show.** Google rankings today, AI Overviews and People Also Ask today (WebSearch shows neither), any Cyprus result, exact volumes (Keyword Planner gave ranges), or whether any page will rank. "Not in our data" means unverified, not zero.

Navigational terms removed before clustering (from autocomplete): "immersive garden website", "immersive garden web design", "immersive reader website", "immersive translate website".

The plugin also specifies a `cluster-plan.json` and an HTML map. Per the brief and the coordinator, this run writes Markdown only.

## 1. The keyword set: intent, demand and SERP type

Pre-groups by intent, as the methodology asks. KP = Keyword Planner worldwide range, September. Page type is the dominant type in the 22 October WebSearch set (observed); the Google column is the 4 September US record or the 13 October Cyprus record where one exists (observed).

### Group 1: 3D and immersive, commercial

| Keyword | Intent | Demand | WebSearch set, 22 Oct (dominant type) | Google record |
|---|---|---|---|---|
| 3d website design agency | Commercial | KP below floor ("3d website agency" 10 to 100) | Directories and gigs: G2 "3D Web Design Services" category (3 pages), svilenkovic.com programmatic page, Dribbble service listing, Sortlist, a press release | 4 Sep: Noomo, Lusion, PeachWeb, Zajno homepages; Superside and Utsubo listicles; Dribbble, landing.love. 13 Oct (CY): Dribbble, Noomo, Awwwards, Lusion, PeachWeb, A1 Gallery |
| immersive website design agency | Commercial | KP n/a ("immersive web design" 100 to 1K) | Directory profiles: DesignRush, Webflow profiles (Noomo, Awescape), Contra, Dribbble services, digitalagencynetwork | 4 Sep: Noomo, Lusion, Immersive Garden, Active Theory; Superside listicle; Awwwards agencies |
| three.js agency | Commercial | KP below floor ("three js developer" 100 to 1K) | Utsubo "10 Best Three.js Agencies (2026)" first, then job posts and forum hiring threads | 4 Sep (on "3d website design agency"): the same Utsubo list |
| 3d website development | Commercial | KP 100 to 1K | Marketplace gigs: Dribbble services, Contra, Fiverr; an O'Reilly chapter | none |
| 3d animated website | Commercial | KP 1K to 10K | Marketplace gigs: Fiverr (2), Comeup, Contra, Dribbble; HubSpot explainer | none |

### Group 2: 3D cost

| Keyword | Intent | Demand | WebSearch set (dominant type) | Google record |
|---|---|---|---|---|
| how much does a 3d website cost | Transactional/informational | KP 10 to 100 | One freelancer's programmatic pages: svilenkovic.com 8 of 9 (cost, budget, pricing, estimate, RFP, hire); Utsubo premium cost guide | 4 Sep: Reddit r/webdev, Facebook, three.js forum, Fiverr, adrienagency.com, svilenkovic.com, 3dimerce |
| 3d website cost | Same | KP below floor | svilenkovic.com (2), three.js forum, site3d, Utsubo guide, Dribbble service searches, Wikipedia | none |
| how much does a premium website cost | Transactional/informational | KP n/a ("premium website design" 100 to 1K) | Utsubo guide first, then kolonell.com programmatic city pages (5), Elementor, a realtor plan | none |
| how much does a scrollytelling website cost | Transactional | not in data | svilenkovic.com (4 programmatic pages), an AI tool, a Shopify app and its pricing tracker | none |

### Group 3: scrollytelling

| Keyword | Intent | Demand | WebSearch set (dominant type) | Google record |
|---|---|---|---|---|
| scrollytelling | Informational | KP 1K to 10K; Semrush US 720, difficulty 40 | Explainers: imforza help, eLearning Industry, data.europa.eu guide, The Plus Addons, Flourish, Eager Eyes critique (2016), arXiv paper, Tableau extension | none for the bare term |
| what is scrollytelling | Informational | PAA (Sept) | Explainers: imforza, Maglr, acodez, Wix Studio, krishaweb, Elementor, data.europa.eu | none |
| scrollytelling website | Informational | KP 100 to 1K | Guides and example posts: UMW, Mockplus, Themeisle, neuroflash, Wix, kopfundstift | 4 Sep: Maglr, Flourish, scrollytelling.ai, Awwwards, Shorthand, Dribbble, Webflow, Wix, with an AI Overview. 13 Oct (CY): Awwwards, AI Overview from Vev, Metabole, Scrollytelling.ai, Shorthand, Flourish; Dribbble, Webflow, Maglr, Wix |
| scrollytelling examples | Informational (list) | KP 100 to 1K; autocomplete "scrollytelling website examples" 6 feeds | Tool-vendor listicles: Themeisle, Maglr (2), Shorthand, Storydoc, Really Good Designs, neuroflash | none |
| best scrollytelling websites | Commercial-informational (list) | KP 10 to 100; 6 feeds | Listicles: Really Good Designs, Maglr, Themeisle, Mockplus, krishaweb, Wix Studio | none |
| scroll animation website | Informational (how) | KP n/a ("website animation" 10K to 100K, broader) | Tutorials and tools: Medium (2), dev.to, a WordPress plugin, IONOS help (2), Fiverr, Halo Lab | none |

### Group 4: 3D inspiration and build

| Keyword | Intent | Demand | WebSearch set (dominant type) | Google record |
|---|---|---|---|---|
| best 3d websites | Commercial-informational (list) | KP 1K to 10K, Ahrefs KD 26 | **Unusable**: 5 of 9 are spam pages on hacked hosts (csr.hdsupply.com, narmare.lansforsakringar.se, test-cursos.tvc.mx, m.fightcancer.org), plus All3DP (3D printing), Seahawk, Webflow templates, Really Good Designs | 4 Sep: Awwwards, Dribbble, Reddit, landing.love, PeachWeb, refs.gallery, Vev listicle, YouTube, Mobbin. Use this record |
| 3d website examples | Informational (list) | KP 100 to 1K; "3d websites examples" 5 feeds | Listicles: Webflow, Seahawk, Framer, HTMLBurger, mycodelesswebsite (2), Really Good Designs, HubSpot | none |
| 3d website design | Informational/inspiration | KP 1K to 10K, KD 31 | Explainers and example posts: Ramotion, Webflow, Seahawk, Pixcap, Digital Pieces, TechBullion, SelfCAD | 4 Sep: Dribbble, Awwwards, 3dwebsites.design, Spline, Reddit, PeachWeb, landing.love, YouTube, lapa.ninja |
| immersive website design | Informational | KP 100 to 1K; Semrush US 50, difficulty 18 | Agency-blog explainers: element8, Bluetext, Matchbox, Clarity Ventures, Anglian Internet, codecapsule, Rocking Tech | 13 Oct (CY): Dribbble, YouTube roundups, Awwwards, Figma, Webflow, Behance, Metabole examples post |
| immersive website examples | Informational (list) | KP 10 to 100; 6 feeds | Mixed: Webflow interactive-site listicle, Wix VR listicles (2), student Notion pages, a Miramontes essay | none |
| three.js website examples | Informational (dev) | KP "three js website" 1K to 10K | Developer resources: three.js forum (2), uiCookies, Slider Revolution, an old textbook, realtimerendering, 2 spam PDFs | none |
| how to build a 3d website | Informational (how) | 4 feeds | Tutorials: dev.to, Udemy, Seahawk WordPress guide, a Spline Substack, O'Reilly | none |
| spline vs three.js | Commercial (compare) | not in data | Tool comparisons: svilenkovic.com (2), Needle, SaaSHub (2), Hack Design | none |
| blender model to three.js website | Informational (how) | not in data | Tutorials, mostly dated: Packt (JSON exporter), Medium, freeCodeCamp, marmelab (2015), OSArch forum | none |

### Group 5: website redesign

| Keyword | Intent | Demand | WebSearch set (dominant type) | Google record |
|---|---|---|---|---|
| website redesign services | Commercial | KP 10K to 100K, KD 19 | Service pages: Innowise, Purrweb, Skysoft, StableWP, Infidigit, OpenXcell, Passionates; Superside listicle | 4 Sep: Superside and Musemind listicles, service pages (Phenomenon, Digital Silk, 3 Plains, ScienceSoft), Brand Theory |
| website redesign agency | Commercial | KP 1K to 10K | Directory: DesignRush redesign lists (2), Passionates, Spinx | none |
| website redesign cost | Transactional/informational | autocomplete 2 feeds; "average cost of website redesign" 2; PAA "How much should a website redesign cost?" (Sept) | Dedicated agency cost guides, 9 of 9: Purrweb, Abstrakt, LowCode (2), ManyPixels, Space-O, Flatirons, 310 Creative, Lean Labs | none |
| redesign website without losing seo | Informational (how) | not in data | Agency how-tos: Playcode, element8 (2), WebSNP, Shakuro, Halo Lab, ProRankTracker, NinjaPromo, SeedProd | none |
| website migration seo checklist | Informational (checklist) | not in data | SEO-industry checklists: Seomator, SEO Works, Shopify, Search Engine Land, Techmagnate, Webflow, Seer, Measure Minds | none |
| website redesign checklist | Informational (checklist) | not in data | Project checklists: Digital Silk, PixelCrayons, Stanford, HostGator (2), Acquia, Visionary, MoreBusiness | none |
| how to plan a website redesign | Informational (how) | not in data | Process guides: LowCode, Webolutions, UX Planet, Culture Foundry, dev.co, Stevens & Tate, SmartBug | none |
| website redesign before and after examples | Informational (list) | not in data | Examples posts: LowCode, Tenet, HTMLBurger, Justinmind, Horton, Media Junction, eSEOspace | none |

### Group 6: one-page websites

| Keyword | Intent | Demand | WebSearch set (dominant type) | Google record |
|---|---|---|---|---|
| one page website design | Informational/inspiration | KP 1K to 10K, KD 20 | Explainers and galleries: GeeksforGeeks, IONOS (3 country copies), Graphics Fuel, Hongkiat, LoginPress, Webalive | 4 Sep: One Page Love, onepage.io, Awwwards, Canva, Dribbble, an examples listicle, Reddit, Avada |
| single page website | Informational | KP 1K to 10K | Explainers: GrowthRocks, Bird, Nettl, Shopify, CIRA, UX Planet | none |
| one page website examples | Informational (list) | 4 feeds | Listicles: Ceros, Webflow, Themeisle, LoginPress, GetResponse, Webdew, Webalive, Crazy Domains | none |
| one page website cost | Transactional | PAA "How much does it cost to design a one-page website?" (Sept) | No authority: UK Business Forums posts (3), a carrd page, small agencies (Mapletree, Grover, Joel Digitals), name.com guide, a Taiwanese price list | none |
| is a one page website enough | Informational (decision) | PAA-shaped; Sept research item 8 | Decision posts: Varenyaz, B12, Webself, Applet, name.com, Marketing Mentor, CIRA, GoDaddy, Bluchic | none |

### Group 7: website cost, template versus custom

| Keyword | Intent | Demand | WebSearch set (dominant type) | Google record |
|---|---|---|---|---|
| how much does a website cost | Informational/transactional | KP 1K to 10K | Builders and publishers: Startups.co.uk, Small Business Trends (2), Shopify (2), Expert Market (2), Wix, G2 | none (global) |
| website design cost | Same | KP 1K to 10K | Agency and vendor cost guides: ManyPixels, Nirmal, Elementor, Ramotion, Bellaworks, WebFX, Fiverr, Lean Labs, Monocubed | none |
| custom website cost | Same | KP 100 to 1K | Agency cost guides: Digitaleer, Wapiti, Digital Silk, Hubrunner, Varenyaz, Evontech | none |
| template vs custom website | Commercial (compare) | KP 10 to 100 (both word orders) | Small-agency comparison posts: Bluetone, Blacksmith, ICDSoft, Sproing, SmartSites, Spindogs, two Google Sites blogs | 4 Sep: gotechark, Reddit r/Wordpress, Medium, Muletown, kdesign, absolute-websites.com (Cyprus), Awesomic, with an AI Overview |
| why are custom websites so expensive | Informational | not in data | Agency opinion posts: Go Media (2 parts), iScripts, Maven, 1Path, Webolutions, Digitaleer, Big Sea | none |
| how much should i pay a web designer | Transactional | PAA (Sept) | Publishers and forums: O'Brien Media, a Google Business site, QuickSprout, UK Business Forums, Expert Market (2), WebsiteRating | none |
| web design agency pricing | Mixed | "website design agency pricing" 2 feeds | Partly written **for agencies pricing their own work**: Dribbble guide (3 copies), Seahawk "Website Design Pricing for Agencies" (3), Bookipi (an invoicing tool), White Label Agency | none |
| how long does it take to build a website | Informational | KP 1K to 10K | Builders and publishers: Fasthosts, Anything, Tech.co, GoDaddy (2), Expert Reviews (2), Ambrite, Xponent21 | none |

### Group 8: Next.js, headless, and two outside the seeds

| Keyword | Intent | Demand | WebSearch set (dominant type) |
|---|---|---|---|
| next.js vs webflow | Commercial (compare) | not in data (Webflow 1 autocomplete hit) | Vercel knowledge base (3 hosts), The Frontend Company, eSEOspace (2), StudioMeyer (3) |
| is next.js good for seo | Informational | KP "next js developer" 100 to 1K (proxy only) | Agency and developer blogs: merge.rocks, Prismic, dev.to (2), seo-day, ikius, Educative, Embrox, on-page.ai |
| what is a headless cms | Informational | not in data | Vendor glossaries: TechRadar, DeployHQ, a Contentstack partner (2 domains), DreamHost, Scaleflex, CloudCannon, Adobe community |
| headless cms disadvantages | Informational | not in data | Agency and vendor pros-and-cons: Portent, eight25, HTMLBurger, Numiko, Caisy, DEPT, dev.to |
| luxury website design | Commercial-informational | KP 1K to 10K | Agency guides and examples: Wix Studio (2), Mediaboom, HubSpot, KIJO (2), MadeByShape, WebFX |
| what makes a website look professional | Informational | 4 feeds | Tips posts: small blogs, Maple Hosting, Experte (2), HubSpot WordPress guide, Emulent |

## 2. The overlap evidence

### 2a. Every pair that shares at least one URL (measured, WebSearch, US, 22 Oct)

| Shared URLs | Shared domains | Pair | Shared pages |
|---:|---:|---|---|
| 3 | 4 | scrollytelling website / best scrollytelling websites | kopfundstift.de, Mockplus guide, Themeisle examples |
| 3 | 3 | scrollytelling examples / best scrollytelling websites | Maglr best examples, Really Good Designs, Themeisle examples |
| 3 | 2 | how much does a 3d website cost / 3d website cost | svilenkovic.com cost and budget pages, Utsubo premium cost guide |
| 2 | 3 | 3d website examples / best 3d websites | Really Good Designs 3D, Seahawk 3D examples |
| 2 | 3 | best scrollytelling websites / what is scrollytelling | krishaweb, Wix Studio |
| 2 | 2 | 3d website design / 3d website examples | Seahawk 3D examples, Webflow 3D guide |
| 2 | 2 | scrollytelling / what is scrollytelling | data.europa.eu guide, imforza help |
| 2 | 2 | scrollytelling website / scrollytelling examples | neuroflash, Themeisle examples |
| 2 | 2 | one page website design / one page website examples | LoginPress, Webalive |
| 1 | 3 | 3d website development / 3d animated website | Dribbble 3D animated website service |
| 1 | 2 | 3d website design / best 3d websites | Seahawk 3D examples |
| 1 | 1 | 3d website design agency / 3d website design | Digital Pieces |
| 1 | 1 | 3d website design agency / 3d website development | Dribbble service |
| 1 | 1 | 3d website design agency / 3d animated website | Dribbble service |
| 1 | 1 | immersive website design / immersive website examples | bluetext.com |
| 1 | 1 | 3d website examples / 3d animated website | HubSpot 3D websites |
| 1 | 1 | how much does a 3d website cost / how much does a premium website cost | Utsubo guide |
| 1 | 1 | 3d website cost / how much does a premium website cost | Utsubo guide |
| 1 | 1 | 3d website development / how to build a 3d website | O'Reilly chapter |
| 1 | 1 | scrollytelling website / how much does a scrollytelling website cost | Themeisle examples |
| 1 | 1 | scrollytelling examples / how much does a scrollytelling website cost | Themeisle examples |
| 1 | 1 | best scrollytelling websites / how much does a scrollytelling website cost | Themeisle examples |
| 1 | 1 | one page website cost / is a one page website enough | name.com guide |
| 1 | 1 | is a one page website enough / single page website | CIRA |

All other 1,251 pairs share 0 URLs. Pairs with 0 URLs but 2 domains: 3d website design agency / immersive website design agency (Dribbble, G2); 3d website design agency / 3d website cost (Dribbble, svilenkovic.com); immersive website design agency / 3d website development and / 3d animated website (Contra, Dribbble); 3d website cost / three.js agency (three.js forum, Utsubo); website redesign cost / website design cost (Lean Labs, ManyPixels, each with a separate page per topic); how to plan a website redesign / website redesign before and after examples (LowCode, UX Planet).

### 2b. Zero-overlap pairs that decide the merge calls (measured, WebSearch)

| Pair | URLs | Domains |
|---|---:|---:|
| how much does a website cost / web design agency pricing | 0 | 0 |
| website design cost / web design agency pricing | 0 | 0 |
| how much does a website cost / how much does a 3d website cost | 0 | 0 |
| template vs custom website / why are custom websites so expensive | 0 | 0 |
| custom website cost / why are custom websites so expensive | 0 | 1 (Digitaleer, two different pages) |
| template vs custom website / custom website cost | 0 | 0 |
| redesign website without losing seo / website migration seo checklist | 0 | 0 |
| redesign website without losing seo / how to plan a website redesign | 0 | 0 |
| website redesign checklist / how to plan a website redesign | 0 | 0 |
| website redesign cost / website redesign services | 0 | 1 (Purrweb, service page and blog post) |
| scrollytelling / scrollytelling website | 0 | 0 |
| scrollytelling examples / 3d website examples | 0 | 1 (Really Good Designs, two different pages) |
| best scrollytelling websites / best 3d websites | 0 | 1 (Really Good Designs) |
| immersive website design / 3d website design | 0 | 0 |
| immersive website design / immersive website design agency | 0 | 0 |
| one page website design / one page website cost | 0 | 0 |
| next.js vs webflow / is next.js good for seo | 0 | 0 |
| what is a headless cms / headless cms disadvantages | 0 | 0 |

### 2c. Google cross-check, domain level (measured from the 4 Sep and 13 Oct records)

"Excl. ubiquitous" removes Awwwards, Dribbble, Reddit and YouTube, which sit in most of these results (the methodology's anti-pattern 5).

| Pair | Shared domains | Excl. ubiquitous | Shared |
|---|---:|---:|---|
| scrollytelling website, 4 Sep US / 13 Oct CY (same query, noise floor) | 5 | 3 | Awwwards, Dribbble, Maglr, Webflow, Wix |
| 3d website design agency, 4 Sep US / 13 Oct CY (same query, noise floor) | 4 | 3 | Dribbble, Lusion, Noomo, PeachWeb |
| 3d website design / best 3d websites (4 Sep) | 6 | 2 | Awwwards (the same `/websites/3d` page in both), Dribbble, landing.love, PeachWeb, Reddit, YouTube |
| webgl website / best 3d websites (4 Sep) | 5 | 2 | Awwwards, landing.love, refs.gallery, Reddit, YouTube |
| immersive website design agency / 3d website design agency (4 Sep) | 3 | 3 | Noomo, Lusion, Superside |
| 3d website design / 3d website design agency (4 Sep) | 3 | 2 | Dribbble, landing.love, PeachWeb |
| immersive website design (13 Oct) / 3d website design (4 Sep) | 3 | 0 | Awwwards, Dribbble, YouTube |
| immersive website design (13 Oct) / 3d website design agency (13 Oct) | 2 | 0 | Awwwards, Dribbble |
| scrollytelling website (4 Sep) / best 3d websites (4 Sep) | 2 | 0 | Awwwards, Dribbble |
| how much does a 3d website cost / any other recorded query | 1 or less | 0 | Reddit only |

Reading (inferred): on Google, the two agency phrasings share as many non-ubiquitous domains (3) as one query shares with itself across two dates. The gallery terms ("3d website design", "best 3d websites", "webgl website") share galleries with each other. "immersive website design" sits with the gallery and explainer terms, not with the agency terms. Scrollytelling and the 3D gallery terms share only the ubiquitous domains.

## 3. Clusters and the hub-and-spoke map

Ten-month plan pieces are named by month from `docs/content-plan-2026-11-to-2027-08.md`. Draft slugs are the `slug` fields in `docs/blog-drafts/`. The plugin's limit of 2 to 5 clusters per pillar holds: the 3D pillar carries clusters 1 to 5; the studio-services side carries 6 to 9.

### Cluster 1: 3D and immersive studio (commercial)

- **Keywords:** 3d website design agency (primary), immersive website design agency, three.js agency. Vocabulary only, not targets: 3d website development, 3d animated website (marketplace gig SERPs).
- **Evidence:** WebSearch 0 URLs, 2 domains between the agency phrasings (measured); Google 4 Sep 3 non-ubiquitous domains (Noomo, Lusion, Superside), equal to the same-query noise floor (measured). Same page, two phrasings (inferred).
- **SERP type:** studio homepages, directory profiles (G2, DesignRush, Webflow, Contra, Dribbble services) and agency-written listicles (Superside, Utsubo). A studio service page is the right type; authority comes from the directories and lists.
- **Hub:** `/services/3d-websites` (live, **not indexed**: "URL is unknown to Google", audit 21 Oct).
- **Spokes:** `/blog/how-much-does-a-3d-website-cost` (draft, owner approved 14 Oct), `/blog/what-is-scrollytelling` (draft), the best-3D-websites flagship (February 2027), "Three ways to put 3D on a page" (April 2027). Proof page: `/work/lumiere-eclat` (a studio concept, labelled as one).
- **Missing:** the literal "3d website design agency" in the 3D page's first answer and one H2 (audit C7, still open); no live 3D post links in to the hub, so it has no blog support at all today (observed: the three live posts link to `/work/velricon`, `/work/los-santos-barbers`, `/work/lumiere-eclat` and `/services/web-development` only).

### Cluster 2: what a 3D website costs

- **Keywords:** how much does a 3d website cost (primary), 3d website cost (same post). Linked, not targeted: how much does a scrollytelling website cost, how much does a premium website cost.
- **Evidence:** 3 shared URLs, 2 domains (measured), both phrasings on the same head term and intent. The skip rule applies (methodology: long-tail variants of one head term are assumed same cluster). Same post (inferred from 3 URLs plus identical intent).
- **SERP type:** one freelancer's programmatic pages own the WebSearch set (svilenkovic.com, 8 of 9: https://svilenkovic.com/3d/3d-website-cost and siblings), plus Utsubo's guide (https://www.utsubo.com/blog/premium-website-cost-budget-guide). The 4 Sep Google record was Reddit, a forum, Fiverr and two small studio posts. No authority site in either. A first-hand cost post is the right type (observed fit).
- **Hub:** the draft `/blog/how-much-does-a-3d-website-cost`, feeding `/services/3d-websites`.
- **Spokes:** the scrollytelling draft's cost section (link out, see section 4); the live `/blog/website-cost-cyprus` 3D row (link out).
- **Missing:** nothing to write. The draft is blocked only on the owner's pre-publication pass and the hosting edit it lists.

### Cluster 3: scrollytelling

- **Keywords:** scrollytelling (primary), what is scrollytelling, scrollytelling website (same post). Secondary in the same post: scrollytelling examples, best scrollytelling websites. Excluded: scroll animation website (tutorial and plugin SERP, 0 URLs with every scrollytelling term).
- **Evidence:** scrollytelling / what is scrollytelling 2 URLs; scrollytelling website / best scrollytelling websites 3; scrollytelling examples / best 3; website / examples 2; best / what is 2 (measured). The head term and "scrollytelling website" share 0 URLs in this engine (measured), but "what is scrollytelling" links to both. Interlink band throughout, one topic by intent (inferred).
- **SERP type:** the head and "what is" terms are explainer SERPs (imforza, data.europa.eu, Maglr, Wix, Elementor); the "examples" and "best" terms are tool-vendor listicles of 9 to 12 examples (Maglr, Shorthand, Themeisle, Really Good Designs). The draft is an explainer with four examples, so it fits the head term, not the list terms.
- **Hub:** the draft `/blog/what-is-scrollytelling`, feeding `/services/3d-websites`.
- **Spokes:** `/work/lumiere-eclat`; the 3D cost post; later the May 2027 "Scroll-driven interaction without lag".
- **Missing:** a page shaped for "scrollytelling examples" (100 to 1K). The plan folds scroll examples into the 3D flagship, but the data does not support that: 0 shared URLs between the scrollytelling list terms and the 3D list terms, and only Awwwards and Dribbble shared on Google (measured). Better (inferred): grow the scrollytelling post's inspected-examples section over time (`docs/editorial/scrollytelling-inspection/` already holds Apple AirPods, Oryzo, Snow Fall and Lumière captures), rather than a second scrollytelling page.

### Cluster 4: 3D inspiration and examples

- **Keywords:** best 3d websites (primary, 1K to 10K), 3d website examples, 3d website design (1K to 10K), immersive website examples, immersive website design (the bare term). Weak fit: three.js website examples (developer-resource SERP).
- **Evidence:** 3d website examples / best 3d websites 2 URLs, 3 domains; 3d website design / 3d website examples 2 URLs; 3d website design / best 3d websites 1 URL (measured, WebSearch). Google 4 Sep: 3d website design / best 3d websites 6 shared domains, including the same Awwwards `/websites/3d` page (measured). "immersive website design" shares 1 URL with "immersive website examples" (measured) and only the ubiquitous gallery domains with the 3D gallery terms on Google. One flagship page (inferred from the Google record plus page type; this run's tool cannot reach the 7+ band).
- **SERP type:** galleries (Awwwards, Dribbble, landing.love, lapa.ninja, refs.gallery) and listicles (Vev, Webflow, Seahawk, Framer, HTMLBurger). The WebSearch set for "best 3d websites" is spam-polluted (section 1) and is not used.
- **Hub:** the February 2027 flagship, "The best 3D websites of 2027, ranked, with the technique and what each would cost to build". Not yet written.
- **Spokes:** `/blog/how-much-does-a-3d-website-cost` (the "what it would cost" column links to it), `/blog/what-is-scrollytelling`, `/work/lumiere-eclat`, Labs piece 1 once live.
- **Missing:** the flagship itself. Its primary should be "best 3d websites", with "3d website examples", "3d website design" and "immersive website design" as secondaries. That moves the bare "immersive website design" term off the service page (agrees with audit C7).

### Cluster 5: building 3D for the web (build records)

- **Keywords:** how to build a 3d website (PAA "How can I create a 3D website?"), spline vs three.js, blender model to three.js website.
- **Evidence:** 0 URLs between these three (measured); "how to build a 3d website" shares 1 URL with "3d website development" (an O'Reilly chapter). **No overlap evidence; the grouping is inferred** from shared subject and the owner's existing plan.
- **SERP type:** tutorials and courses (dev.to, Udemy, freeCodeCamp, Packt) and tool comparisons (svilenkovic.com, Needle, SaaSHub). Several Blender-to-three.js tutorials describe the retired JSON exporter (observed: Packt, marmelab 2015).
- **Hub:** April 2027 "Three ways to put 3D on a page: pre-rendered video, shader, live glTF, and what each costs" (the broadest of the set, and the one that answers the PAA).
- **Spokes:** "How we built Labs piece 1/2/3" (January, March, June 2027), "WebGL on phones: what we measured across four builds" (June 2027).
- **Missing:** none to add. See section 4 on the page-type mismatch for the making-ofs.

### Cluster 6: website redesign

- **Keywords:** website redesign services (service page), website redesign agency (directory SERP), redesign website without losing seo (live post), website migration seo checklist (live post, secondary), how to plan a website redesign and website redesign checklist (April 2027 piece), website redesign cost (gap, section 6).
- **Evidence:** every pair in this group shares 0 URLs (measured; two pairs share 1 domain). **No overlap evidence that any two belong on one page**, which supports separate pages by intent: service, SEO migration how-to, project-planning guide, cost guide (inferred).
- **SERP type:** service pages for the head term (US mid-size agencies, KD 19), a DesignRush directory for "agency", agency how-tos for the SEO angle, SEO-industry checklists (Search Engine Land, Seer) for migration, process guides for planning, and nine dedicated cost guides for cost.
- **Hub:** `/services/website-redesign` (live, indexed 20 Oct).
- **Spokes:** `/blog/redesign-website-without-losing-seo` (live), "How to plan a website redesign: our own redesign and a client migration" (April 2027), `/blog/website-cost-cyprus` (redesign row).
- **Missing:** a body link from the live migration post to the redesign service page (today the only service link is in the promo block outside the article, observed); the cost question (section 6).

### Cluster 7: one-page websites

- **Keywords:** one page website cost (service page primary, per audit C7), is a one page website enough (August 2027 piece), one page website examples (same piece, secondary). Head terms one page website design and single page website: explainer and gallery SERPs, not targeted by the service page.
- **Evidence:** design / examples 2 URLs; cost / enough 1; enough / single page 1; design / cost 0 (measured). Interlink band (inferred).
- **SERP type:** the cost SERP has no authority (forum posts and small studios, observed), which is the open door; the "enough" SERP is decision posts from builders and registrars.
- **Hub:** `/services/one-page-websites` (live, indexed 20 Oct).
- **Spokes:** "Is a one-page website enough?" (August 2027), `/work/los-santos-barbers`, `/work/city-arcade` (concept), the live cost post's one-page section.
- **Missing:** a body link from the live cost post to the one-page service page (none today, observed).

### Cluster 8: website cost, template versus custom

- **Keywords:** website cost cyprus (the live post's own term, out of this run's scope), template vs custom website (February 2027 rewrite), custom website cost and why are custom websites so expensive (secondary and section of that rewrite), how much should i pay a web designer (live post, secondary), how long does it take to build a website (January 2027 piece). Not winnable globally: how much does a website cost, website design cost (builder, publisher and US agency guides; inferred from type at DR in single digits of genuine links).
- **Evidence:** all pairs in this group share 0 URLs (measured). The grouping rests on intent and on shared Konaverse substance (the tier table), **not on overlap** (inferred).
- **Hub:** `/blog/website-cost-cyprus` (live).
- **Spokes:** "Template or custom website: what 1,200, 2,500 and 6,000 euro buy" (February 2027), "How long a website takes to build, with our real timelines" (January 2027), `/blog/how-much-does-a-3d-website-cost` (cross-cluster), `/services/web-design`.
- **Missing:** see section 3a on what to merge.

### Cluster 9: Next.js and headless

- **Keywords:** next.js vs webflow (live), is next.js good for seo (draft `nextjs-vs-react-seo`), what is a headless cms (January 2027 rewrite, re-angled to editing without code), headless cms disadvantages (fold).
- **Evidence:** 0 URLs, 0 domains between every pair (measured). Separate SERPs; grouped only because they feed one service (inferred).
- **SERP type:** vendor comparisons and knowledge bases (Vercel), developer blogs, vendor glossaries (Contentstack partner, DreamHost, Scaleflex, CloudCannon). The head term "what is a headless cms" is a vendor-glossary SERP; the planned re-angle to a first-hand Studio walkthrough is the right call.
- **Hub:** `/services/web-development` (live, indexed).
- **Spokes:** `/blog/nextjs-vs-webflow` (live), `/blog/nextjs-vs-react-seo` (draft, approved with additions), the January 2027 CMS piece.
- **Missing:** a link from the live Next.js vs. Webflow post's H2 "Is Next.js automatically faster or better for SEO?" to the React SEO post once live.

Outside the seeds, for completeness: "luxury website design" (1K to 10K) is an agency-guide-and-examples SERP (Wix Studio, KIJO, Mediaboom, HubSpot, observed). The luxury draft stays with `/services/web-design`, rewritten with visuals per the 13 October audit; the luxury-versus-premium draft folds into it. The three-second and speed drafts were not searched in this run.

### 3a. Draft and live-post coverage, at a glance

| Item | Status | Cluster | Call |
|---|---|---|---|
| /blog/website-cost-cyprus | live | 8 (hub) | Keep. Add body links (section 5) |
| /blog/redesign-website-without-losing-seo | live | 6 | Keep. Add the service link |
| /blog/nextjs-vs-webflow | live | 9 | Keep |
| how-much-does-a-3d-website-cost | draft, approved | 2 (hub) | Publish when the owner is ready |
| what-is-scrollytelling | draft | 3 (hub) | Publish when ready; shorten its cost section (section 4) |
| nextjs-vs-react-seo | draft, approved with additions | 9 | Publish after the view-source addition |
| web-design-agency-pricing | draft | 8 | **Merge** into the live cost post (section 4) |
| why-custom-websites-are-expensive | draft | 8 | Becomes the February template-versus-custom rewrite |
| what-is-a-headless-cms | draft | 9 | January rewrite, as planned |
| headless-cms-disadvantages | draft | 9 | Fold its operating table into the rewrite; no own page |
| how-to-make-a-website-look-luxury | draft | outside seeds | Rewrite with visuals |
| luxury-vs-premium-brand-positioning | draft | outside seeds | Fold into the luxury piece |
| three-second-rule, website-speed-conversion-rates | drafts | not searched | Merge as the 13 Oct audit says |
| can-chatgpt-create-a-website, is-ai-replacing-web-designers | drafts | none | Shelved (13 Oct audit); no niche keyword reaches them |

## 4. Cannibalisation, merge calls and page-type mismatches

No pair in this run reached 7 shared URLs, so no merge below rests on the "same post" band. Each rests on duplicated Konaverse content or an identical primary keyword, which is the plugin's other rule ("no two posts share the same primary keyword").

| # | Pages | Risk | Evidence | Call |
|---|---|---|---|---|
| 1 | Live cost post vs `web-design-agency-pricing` | **High, content duplication** | The draft opens with "Konaverse's starting website budgets", the same tier table the live post leads with (€1,200 / €2,500 / €1,800 / €1,800 / €2,500 / €6,000, observed on https://kona-verse.com/blog/website-cost-cyprus). The live post already has "What moves the price" and "How to compare two quotes"; the draft has "What moves a website above its starting price?" and "How to compare two agency proposals fairly". The SERPs do not overlap (0 URLs, 0 domains, measured), and "web design agency pricing" is partly a SERP for agencies pricing their own services (Seahawk "Website Design Pricing for Agencies", White Label Agency, observed) | **Merge.** Do not publish the slug. Fold the freelancer-versus-agency and "agree on what counts as complete" sections into the March 2027 cost refresh. The per-driver figures the draft lacks partly exist already on the web development page (extra page from €150, CMS from €500, second language from €500, bookings or payments €400 to €800, blog from €300, other integrations from €200; `src/lib/service-pages.ts`), observed |
| 2 | Live cost post vs `why-custom-websites-are-expensive` (February rewrite) | Medium | The live post's "What an €800 website leaves out" and its template-versus-custom table cover the same ground. SERPs: template vs custom / how much does a website cost 0 URLs; template vs custom / why are custom websites so expensive 0 URLs (measured) | **Keep separate**, primary "template vs custom website" (comparison type, matching its SERP). The rewrite must not reprint the tier table: link to the cost post for prices and carry what the cost post lacks, the hours per tier and one client site opened per tier. "why are custom websites so expensive" becomes a section, not a primary |
| 3 | Live cost post vs `how-much-does-a-3d-website-cost` | Low | 0 URLs, 0 domains between the two cost SERPs (measured); different page types | **Keep both.** Link the live post's 3D row to the 3D post |
| 4 | `what-is-scrollytelling` cost section vs `how-much-does-a-3d-website-cost` | Medium | The scrollytelling draft repeats the 6,000 euro, eight-to-twelve-week phase breakdown (two weeks concept, three to four art, three to four build, one launch), observed at line 95. The scrollytelling cost SERP is the same programmatic freelancer that owns the 3D cost SERP (svilenkovic.com, 4 of 9, measured) | **Trim:** keep the price and timeline in two sentences and link to the 3D cost post for the phases. One page per primary: the 3D post owns the cost question |
| 5 | Live cost post's H2 "Is a €1,200 one-page website enough?" vs the August 2027 "Is a one-page website enough?" | Medium, same question as a heading | Observed H2 on the live post. SERP for the question: decision posts (measured, 0 URLs with the cost terms) | When the August piece is written, cut the live section to two or three sentences and link to it; otherwise drop the August piece |
| 6 | Live migration post vs April 2027 "How to plan a website redesign" | Low | 0 URLs, 0 domains (measured); the live post covers URL migration only (observed: "General redesign project planning is not covered") | **Keep separate.** The April piece links to the migration post for the URL part and does not retell the 172-URL story |
| 7 | `what-is-a-headless-cms` vs `headless-cms-disadvantages` | Low by SERP, high by weight | 0 URLs, 0 domains (measured); both SERPs owned by vendors; neither term in our demand data | Keep the 13 Oct call: one CMS piece (January rewrite), the disadvantages table inside it |
| 8 | Live Next.js vs. Webflow H2 vs `nextjs-vs-react-seo` | Low | 0 URLs, 0 domains (measured); the live post's SEO section is one H2 | Keep both; link from that H2 |
| 9 | `/services/3d-websites` vs the February flagship, on "immersive website design" | Medium if both target it | The bare term is an explainer SERP here and a gallery SERP on Google from Cyprus (observed); 0 URLs with the agency phrasing (measured) | The service page takes "3d website design agency" and "immersive website design agency"; the flagship takes "immersive website design" as a secondary |

### 4a. Where the SERP type does not match the planned page

| Query | Planned page | SERP type (observed) | Page type that fits (inferred) |
|---|---|---|---|
| immersive website design | `/services/3d-websites` primary (keyword map v1) | Agency-blog explainers (WebSearch); galleries and an examples post (Google, 13 Oct, from Cyprus) | Examples flagship plus explainer; service page re-pointed to the agency phrasing (audit C7) |
| 3d website design | 3D page H1 | Explainers (WebSearch); galleries, a tool and Reddit (Google, 4 Sep) | The flagship list. Keep the words in the H1, do not expect the service page to rank |
| 3d website design agency | 3D service page | Studio homepages plus G2 and DesignRush directories and agency listicles | Service page is right; the missing layer is off-site: the G2 "3D Web Design Services" category (three pages in this set, https://g2.com/categories/3d-web-design-services) and a Dribbble Services listing (one Dribbble service page appears in three 3D sets). Owner's choice; listings, not link schemes |
| 3d website development, 3d animated website | none planned | Marketplace gigs (Fiverr, Contra, Dribbble services) | Not a page Konaverse should build. Vocabulary only |
| three.js agency | none | Utsubo's self-ranked list first (https://www.utsubo.com/blog/top-threejs-agencies), then job posts | Off-site only: being included in third-party lists. A Konaverse-ranked agency list is excluded by owner decision |
| scrollytelling examples, best scrollytelling websites | 3D flagship (plan) | Tool-vendor listicles, 9 to 12 examples | The scrollytelling post's examples section, grown over time; not the 3D flagship (0 shared URLs, section 2b) |
| what is a headless cms | January rewrite | Vendor glossaries | First-hand Studio walkthrough aimed at "update without code", as the plan already says. Do not chase the head term |
| how to build a 3d website, blender model to three.js website | Labs making-ofs (January to June 2027) | Tutorials and courses, several outdated | The making-ofs are records, not tutorials; expect citation and link value more than rankings. A current glTF pipeline record fills a gap the dated tutorials leave (inferred) |
| one page website design | `/services/one-page-websites` (keyword map v1) | Explainers, galleries and builders | Service page re-pointed to the cost question (audit C7); the August piece takes examples |
| website redesign agency | `/services/website-redesign` secondary | DesignRush directory pages | A DesignRush listing (already on the plan's citation list, §8) |
| how much does a website cost, website design cost | live cost post (global angle) | Builders, publishers and US agency cost guides | Not winnable globally at this authority. The Cyprus angle of the live post is the right one |
| web design agency pricing | the draft | Partly agency-facing (pricing your own services) | No buyer page here; merge (row 1 above) |
| how long does it take to build a website | January 2027 piece | Builder and publisher guides (GoDaddy, Tech.co, Expert Reviews) | The piece is still the right type (a data post), but its competition is builders; its value is the real durations, which no result in the set has |

## 5. Internal link matrix

Only links a reader would follow. "Planned" pages get the link when they go live. Existing links already in a draft are marked "in draft". Anchors are proposals for the owner; no em dashes.

| # | Source | Target | Suggested anchor | Reason |
|---|---|---|---|---|
| 1 | /services/3d-websites | /blog/how-much-does-a-3d-website-cost | what a 3D website costs, phase by phase | The page states "from €6,000"; the post is the breakdown behind it (hub to spoke) |
| 2 | /blog/how-much-does-a-3d-website-cost | /services/3d-websites | our 3D and immersive website service | In draft. Spoke to hub |
| 3 | /services/3d-websites | /blog/what-is-scrollytelling | scrollytelling, and how we build it | The page describes scroll-driven scenes but never names the format (audit C8) |
| 4 | /blog/what-is-scrollytelling | /services/3d-websites | 3D and immersive website service | In draft. Spoke to hub |
| 5 | /blog/what-is-scrollytelling | /blog/how-much-does-a-3d-website-cost | the full breakdown of what a 3D website costs | Replaces the repeated phase list (section 4, row 4) |
| 6 | /blog/how-much-does-a-3d-website-cost | /blog/what-is-scrollytelling | how a scroll-driven page works | Readers of the cost post meet "scenes wired to the scroll" and need the explainer |
| 7 | /blog/website-cost-cyprus | /blog/how-much-does-a-3d-website-cost | what goes into a 3D website's price | From the 3D row of the price table |
| 8 | /blog/how-much-does-a-3d-website-cost | /blog/website-cost-cyprus | what our other websites cost | From "The small version: a 3D hero on a normal site" |
| 9 | /blog/how-much-does-a-3d-website-cost | /work/lumiere-eclat | Lumière Éclat, our studio concept | In draft. The build behind the number |
| 10 | /blog/what-is-scrollytelling | /work/lumiere-eclat | Lumière Éclat | In draft. The worked example |
| 11 | Best 3D websites flagship (planned, Feb 2027) | /services/3d-websites | how we design and build 3D websites | Spoke to hub |
| 12 | /services/3d-websites | Best 3D websites flagship (planned) | the best 3D websites of 2027, and what each would cost | Hub to spoke; the page's buyers ask for examples |
| 13 | Best 3D websites flagship (planned) | /blog/how-much-does-a-3d-website-cost | how we priced each build | The flagship's "what it would cost" column needs its method |
| 14 | Best 3D websites flagship (planned) | /blog/what-is-scrollytelling | how scrollytelling works | For the scroll-driven entries |
| 15 | Three ways to put 3D on a page (planned, Apr 2027) | /blog/how-much-does-a-3d-website-cost | what each route costs | The April piece prices routes; the cost post is the full picture |
| 16 | How we built Labs piece 1 (planned, Jan 2027) | Three ways to put 3D on a page (planned) | the other two ways to put 3D on a page | Record to overview |
| 17 | /services/website-redesign | /blog/redesign-website-without-losing-seo | how we moved 172 URLs in a redesign | The page promises every old URL is redirected; the post shows the method |
| 18 | /blog/redesign-website-without-losing-seo | /services/website-redesign | website redesign service | Today only in the promo outside the article (observed). Spoke to hub, in the body |
| 19 | How to plan a website redesign (planned, Apr 2027) | /blog/redesign-website-without-losing-seo | the URL side of a redesign, step by step | Avoids retelling the migration |
| 20 | /blog/redesign-website-without-losing-seo | How to plan a website redesign (planned) | how to plan the rest of a redesign | Reverse of 19 |
| 21 | How to plan a website redesign (planned) | /services/website-redesign | website redesign, from €2,500 | Spoke to hub |
| 22 | /blog/website-cost-cyprus | /services/website-redesign | website redesign | From the redesign row; the post links no service page in its body today (observed) |
| 23 | /blog/website-cost-cyprus | /services/one-page-websites | one-page website design | From the H2 "Is a €1,200 one-page website enough?" |
| 24 | Is a one-page website enough? (planned, Aug 2027) | /services/one-page-websites | one-page websites, from €1,200 | Spoke to hub |
| 25 | Is a one-page website enough? (planned) | /work/los-santos-barbers | Los Santos Barbershop | The one-page client opened |
| 26 | /blog/website-cost-cyprus | Is a one-page website enough? (planned) | when one page is enough | Replaces the long section (section 4, row 5) |
| 27 | Template or custom website (planned, Feb 2027) | /blog/website-cost-cyprus | our prices and timelines in one table | Keeps the tier table in one place |
| 28 | /blog/website-cost-cyprus | Template or custom website (planned) | what a template and a custom build each buy | From the template-versus-custom table |
| 29 | Template or custom website (planned) | /services/web-design | custom web design | The service the comparison feeds |
| 30 | /services/web-design | Template or custom website (planned) | template or custom: what each tier buys | The page says "never a template"; readers ask why |
| 31 | How long a website takes to build (planned, Jan 2027) | /blog/website-cost-cyprus | prices and timelines by type of website | The cost table carries the timeline column |
| 32 | /blog/nextjs-vs-webflow | /blog/nextjs-vs-react-seo | Next.js vs. React for SEO | From the H2 "Is Next.js automatically faster or better for SEO?" |
| 33 | /blog/nextjs-vs-react-seo | /blog/nextjs-vs-webflow | Next.js vs. Webflow | The platform question readers ask next |
| 34 | /blog/nextjs-vs-react-seo | /services/web-development | custom web development | In draft. Spoke to hub |
| 35 | /services/web-development | /blog/nextjs-vs-react-seo | how a server-rendered page reads to search engines | The page's description promises server-rendered sites; the post shows view-source |
| 36 | Website speed and conversions (planned, Dec 2026) | /blog/nextjs-vs-react-seo | Next.js vs. React for SEO | Carries over the link the merged three-second draft already has |
| 37 | Editing a custom site without code (planned, Jan 2027) | /blog/nextjs-vs-webflow | Next.js vs. Webflow | In the current draft; keep in the rewrite |

Checks (inferred from the matrix): the 3D cost post receives 5 links (1, 6, 7, 13, 15), the scrollytelling post 3 (3, 6, 14), the migration post 3 (17, 19, plus the existing link from the cost post), the React SEO post 3 (32, 35, 36), template or custom 2 planned (28, 30) plus the existing pricing-draft link that dies with the merge, so it needs one more when written (the "How long" piece is the natural source). Every spoke links to its hub and every hub to its spokes once the planned pages exist. No orphans among live pages.

## 6. Topics the data supports that nothing covers yet

The substance rule from the content plan applies: a topic needs a real build, a Konaverse number, an inspection performed, or a founder decision.

| Topic | Demand evidence | SERP | Substance it would need | Call |
|---|---|---|---|---|
| What a website redesign costs, with our hours | Autocomplete "website redesign cost" 2 feeds and "average cost of website redesign" 2 (Sept); PAA "How much should a website redesign cost?" on the redesign services SERP (4 Sep); head "website redesign" KP 10K to 100K | Nine dedicated agency cost guides, US figures (measured); publishers who rank keep a separate redesign-cost page from their design-cost page (Lean Labs, ManyPixels, observed) | The redesign tier (from €2,500, four to eight weeks, observed in `service-pages.ts`) plus the owner's hours per tier, a November dependency in the content plan; the v4 redesign of kona-verse.com as the worked case; the migration record only in anonymised form | **Conditional.** Write only once the owner's redesign hours exist. The plan cut this as Article 23 because the cost post had no more than one row to offer; the hours change that. Feeds /services/website-redesign. If the hours never arrive, drop it |
| Scrollytelling examples, as a growing section | KP "scrollytelling examples" 100 to 1K; "best scrollytelling websites" 10 to 100; 6 autocomplete feeds each | Tool-vendor listicles (measured); 0 shared URLs with the 3D list terms | The inspection captures already in `docs/editorial/scrollytelling-inspection/` (Apple AirPods, Oryzo, Snow Fall, Lumière), extended one inspected site at a time | **Not a new page.** A scope change to the existing draft and the plan's assumption (cluster 3) |
| Marketplace and directory listings for the 3D terms | The 3D commercial SERPs carry G2, DesignRush, Contra and Dribbble Services pages (measured, section 1) | Directory | A real profile with real work, nothing else | **Off-site, owner's choice.** Recorded here because the data points at it; it is not content |
| How much a premium website costs | No KP figure for the phrase; "premium website design" 100 to 1K | Utsubo's guide and one studio's programmatic city pages (measured) | The tier table and the 3D pricing structure, which the two cost posts already carry | **Dropped.** No substance beyond the existing cost posts; it would cannibalise them |
| Website redesign before and after | Not in our data | Examples listicles (measured) | Before and after captures of at least three real redesigns, with client consent. Found only Velricon's case study (it describes "the old site", `src/lib/case-studies.ts`) and our own v4; the migration client cannot be shown | **Dropped** until before captures exist |
| Spline vs three.js on its own | Not in our data | One freelancer's programmatic pages and vendor comparisons (measured) | Already the subject of the April 2027 piece, which has the substance (the ice-cube loop, the hero shader, the Labs glTF pieces) | **Covered** by the April piece; give it "spline vs three.js" as a secondary |
| The 3D agency list | KP below floor | Utsubo's self-ranked list (measured) | Would require ranking competitors with Konaverse inside | **Dropped** by owner decision (no self-promotional "best agencies" list ranking Konaverse first) |

## 7. Validation against the plugin's checklist

| Check | Result |
|---|---|
| No two posts share a primary keyword | Holds after the merge in section 4, row 1, and the cost-section trim in row 4 |
| Every spoke links to its hub, and the hub to every spoke | Holds in the matrix once the planned links exist; today two live posts lack body links to their service pages (rows 18, 22, 23) |
| Every spoke has 3 or more incoming links planned | Holds for the drafts and live posts; the February template-versus-custom piece needs one more source when written |
| SERP overlap supports the groupings (4 or more to cluster peers) | **Does not hold, and cannot with this tool.** The maximum measured is 3. Clusters 1, 2, 3 and 4 rest on 2 to 3 shared URLs plus the Google domain record; clusters 5 to 9 rest on intent and substance only, labelled inferred |
| Word counts (pillar 2,500 to 4,000; spoke 1,200 to 1,800) | Not applied. The drafts run 1,585 to 2,008 words (13 Oct audit); the band is the plugin's convention, not evidence from these SERPs |
| Cluster size (2 to 5 clusters per pillar, 2 to 4 posts each) | Holds: the 3D pillar has 5 clusters; each service hub has 2 to 4 spokes |

## Sources

Result sets used in this file (observed, WebSearch, US, 22 October 2026), by domain: svilenkovic.com (https://svilenkovic.com/3d/3d-website-cost, https://www.svilenkovic.com/3d/scrollytelling-agency, https://www.svilenkovic.com/3d/three-js-vs-spline), Utsubo (https://www.utsubo.com/blog/premium-website-cost-budget-guide, https://www.utsubo.com/blog/top-threejs-agencies), G2 (https://g2.com/categories/3d-web-design-services), DesignRush (https://www.designrush.com/agency/website-design-development/website-redesign), Dribbble (https://dribbble.com/services/87686-3D-Animated-Website-Design-Development), Seahawk (https://seahawkmedia.com/design/3d-website-design-examples/, https://seahawkmedia.com/agency/website-design-pricing/), Webflow (https://webflow.com/blog/3d-design-website), Really Good Designs (https://reallygooddesigns.com/scrollytelling-website-examples/), Maglr (https://www.maglr.com/blog/best-scrollytelling-examples), Themeisle (https://themeisle.com/blog/scrollytelling-examples/), Shorthand (https://shorthand.com/the-craft/scrollytelling-examples/), imforza (https://help.imforza.com/knowledge/what-is-scrollytelling), data.europa.eu (https://data.europa.eu/apps/data-visualisation-guide/scrollytelling-introduction), element8 (https://www.element8.ae/blogs/immersive-website-design-uae-lessons), Bluetext (https://bluetext.com/blog/designing-a-truly-immersive-website-experience/), LowCode (https://www.lowcode.agency/blog/how-much-does-a-website-redesign-cost), Purrweb (https://www.purrweb.com/blog/website-redesign-cost/), Seer (https://www.seerinteractive.com/blog/website-migration-seo-checklist), Search Engine Land (https://searchengineland.com/site-migration-seo-checklist-dont-lose-traffic-286880), Shopify (https://www.shopify.com/blog/how-much-does-a-website-cost), Expert Market (https://www.expertmarket.com/web-design/how-much-does-a-website-cost), Digitaleer (https://www.digitaleer.com/custom-website-cost/), Blacksmith (https://blacksmith.agency/resources/web-design/custom-vs-template-websites/), name.com (https://www.name.com/blog/guide-to-one-page-websites-pros-cons-and-best-practices), Vercel (https://vercel.com/kb/guide/next-js-on-vercel-vs-webflow-cloud), Numiko (https://numiko.com/insights/pros-and-cons-of-headless-cms), KIJO (https://kijo.london/blog/luxury-website-design). Spam hosts in the "best 3d websites" set: https://csr.hdsupply.com/?p=22676, https://narmare.lansforsakringar.se/?p=1080317.

Konaverse pages read (observed, 22 October 2026): https://kona-verse.com/blog/website-cost-cyprus, https://kona-verse.com/blog/redesign-website-without-losing-seo, https://kona-verse.com/blog/nextjs-vs-webflow.

Records on file: `docs/keyword-research/keyword-planner-raw.md`, `docs/keyword-research/suggest.md`, `docs/keyword-research/serp-autopsy.md` (Google, 4 September), `docs/seo-state-2026-10-13.md` (Semrush US lookups, Google from Cyprus), `docs/seo-audit-2026-10-21/README.md` and `evidence/sxo.md`, `docs/editorial/drafts-audit-2026-10-13.md`, `docs/content-plan-2026-11-to-2027-08.md`, `src/lib/service-pages.ts`, `src/lib/case-studies.ts`, the drafts in `docs/blog-drafts/`.

Raw result sets and the overlap script for this run (local evidence, not part of the repository): the scratchpad folder `C:\Users\konst\AppData\Local\Temp\claude\C--Users-konst-Projects-KONA\fe0c35dc-6485-4ab0-8b55-2370403aa6a1\scratchpad\cluster\` (`serps1.json` to `serps9.json`, `normalised.json`) and `C:\Users\konst\AppData\Local\Temp\claude\C--Users-konst-Projects-KONA\fe0c35dc-6485-4ab0-8b55-2370403aa6a1\scratchpad\overlap2.py`.
