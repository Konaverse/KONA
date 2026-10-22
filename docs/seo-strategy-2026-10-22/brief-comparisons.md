# Two comparison briefs, 22 October 2026

Part of the 22 October strategy run (`BRIEF.md`). Written with the claude-seo content-brief workflow (`skills/seo-content-brief`, its page-type templates and keyword-placement rules), adapted to the owner's decisions: BlogPosting schema only (no FAQPage, no HowTo), no FAQ block, one service link per article, no em dashes in proposed copy, the substance rule from `docs/content-plan-2026-11-to-2027-08.md`. These are briefs. They authorize no drafting, no CMS entry, no commit.

**Labels.** **M** measured (a number I read today from a file, a tool, an HTTP response or a page source, or a figure already recorded in a repo report, cited). **O** observed (seen on a page or in a result list, URL or path given). **I** inferred (my judgement).

**Search data.** WebSearch returns US results from its own engine. It is not Google's ranked list and it is not a Cyprus result. These two SERPs are global English, so US results are a fair read of who writes on the topic, not of who ranks in Cyprus. Eight searches were run for this file; the rest of the result sets were reused from the cluster agent's cached run today (`scratchpad/cluster/serps*.json`) and the Google records of 4 September (`docs/keyword-research/serp-autopsy.md`). Demand comes only from `docs/keyword-research.md` and `docs/keyword-research/` (September Keyword Planner ranges, autocomplete feed counts, the People Also Ask bank). No volume here is invented. Provenance names (Keyword Planner, curl, ffprobe) are kept because this run's rules require every number to be traceable.

**Two corrections found while briefing, for the owner first.**

1. **The ice-cube Blender loop is not on the live homepage.** The live homepage hero is variant B (`HeroPortrait` + `HeroPeel`), which plays `/home/hero-loop.mp4` inside a WebGL peel (O, `src/app/(v4)/page.tsx:3-4, 91-97`; M, the live homepage HTML references `hero-loop.mp4` and not `idle-clear.mp4`, curl 22 Oct). The ice cube (`HeroStage`, `public/object/idle-clear.mp4`) is parked at `/hero-object`, which production redirects to `/` (O, `next.config.ts:64-72, 111-112`; M, `https://kona-verse.com/hero-object` returns 307 to `/`). The approved 3D cost draft says the opposite: "There is a middle route, and it is the one on our own homepage. The object there was modelled and rendered in Blender and shipped as a short video loop" (O, `docs/blog-drafts/how-much-does-a-3d-website-cost.md:125`). That sentence needs the owner's correction before the 3D cost post is published, and Brief 2 below is written to the corrected facts.
2. **Two internal rates disagree.** The add-on prices were "PROPOSED 2026-10-03 from the studio's ~€50 hour (a €2,000 site in ~40 hours)" (O, `src/lib/service-pages.ts:126-129`). The approved 3D driver table prices additions "at about a thousand euro a working week" (O, `how-much-does-a-3d-website-cost.md:94`), which is about €25 an hour at 40 hours (I, arithmetic). Brief 1 prints hours next to prices; the owner has to reconcile the two before either number appears beside the other.

---

# Brief 1

## Content Brief: template vs custom website

Working title (task): *Template, builder or custom: what €1,200, €2,500 and €6,000 buy in Cyprus.* A rebuild of the shelved draft `docs/blog-drafts/why-custom-websites-are-expensive.md`. Feeds `/services/web-design`. Content plan slot: February 2027 (O, content plan line 74).

### Search Intent

Commercial investigation: a buyer comparing a website builder or a bought theme with hiring a studio, before spending. On Google (US, 4 September) the SERP carried an AI Overview, People Also Ask and Videos above small-agency blog posts (M, `serp-autopsy.md:190-195`). The format rewarded is a comparison post; no result in either record leads with a table of real prices (O, below). Reader: a small-business owner or marketing lead, in Cyprus or abroad, low technical knowledge, already aware of Wix, Squarespace and WordPress themes.

**Demand evidence (our files only).**

| Query | Cyprus | Worldwide | Source |
|---|---|---|---|
| template vs custom website | 10 to 100 | 10 to 100 | M, `keyword-planner-raw.md:77, 214` |
| custom website vs template | 10 to 100 | 10 to 100 | M, lines 37, 151 |
| custom website cost | 0 to 10 | 100 to 1K | M, lines 35, 149 |
| custom web design | 10 to 100 | 1K to 10K | M, lines 34, 148 (the service page's term, not this post's) |
| Ahrefs KD, template vs custom website (US) | | no data (below floor) | M, line 269 |
| Autocomplete variants | about 30, 1 to 2 feeds each: "template based website vs custom website", "custom website design vs template", "what is a website template", "website templates builder comparison", "website template paid vs free" | | M, `suggest.md:494-1324` (e.g. 515, 876, 1171, 1173, 1185) |
| People Also Ask on adjacent SERPs | "How much should I pay for a website?", "How much should a full website design cost?", "Is $1000 a good price for a website?" | | O, `keyword-research.md` §3 |

Not in our data: "why are custom websites so expensive", "wix vs custom website", "squarespace vs custom website". They become sections or vocabulary, not primaries (I).

### Competitor Analysis

WebSearch US, 22 October, "template vs custom website" (cached cluster run) and "custom website vs template" (this run). Scores are my judgement (I): Depth, Formatting, SEO, UX, each out of 10. Filtered out: two `sites.google.com` pages (content platform, low authority), Pixpa (a website-builder vendor's blog).

| # | URL | Key H2 sections | Est. words | Score | Main gap |
|---|---|---|---|---|---|
| 1 | https://blacksmith.agency/resources/web-design/custom-vs-template-websites/ (updated 28 Apr 2026) | Custom website; advantages (scalable, unique, SEO, security); cons (time, expense, finding a team); template; advantages; cons; which should you pick | ~2,300 (M, fetched) | 5/5/7/6 = 23/40 | No price for custom, no hours, no table, no real site shown. Template "less than $50"; custom "at least 6 weeks" (O) |
| 2 | https://www.icdsoft.com/blog/template-vs-custom-made-website/ (4 Aug 2022, no update) | Using a template (advantages, disadvantages); using a custom-made website; which one; ICDSoft plug | ~2,300 (M) | 5/5/5/5 = 20/40 | Four years old; a hosting vendor; cost figures only in an illegible image; template screenshots, no built sites (O) |
| 3 | https://www.smartsites.com/blog/custom-vs-template-website-design-which-is-best-for-you/ (9 Jun 2025) | Understanding custom; the power of templates; performance; budget and timeline; what we recommend | ~650 (M) | 3/4/6/6 = 19/40 | No prices, no hours, no examples (O) |
| 4 | https://www.bluetonemedia.com/Blog/262508/Templates-vs-Custom-Built-Websites | First in the cached set | 404 when fetched 22 Oct (M) | not scored | |
| 5 | sproing.ca, spindogs.co.uk, marginmedia.com.au, yeeply.com, shakuro.com | Small-agency posts | not fetched | not scored | |

Google record (US, 4 September): gotechark, Reddit r/Wordpress, Medium, muletowndigital, kdesign, **absolute-websites.com (a Cyprus agency)**, awesomic, under an AI Overview (M, `serp-autopsy.md:190-195`). Competitor average of the three fetched: ~1,750 words (M, mean of 2,300, 2,300, 650).

### Content Gaps and Opportunities

- **Topic gap: real prices for the custom side.** None of the three fetched posts names a price for a custom build (O). Konaverse publishes three.
- **Topic gap: the hours inside a price.** No result says how many hours of skilled work a template or a custom site contains (O). This is the owner's November input (content plan line 36).
- **Depth gap: what each tier includes, line by line.** Competitors argue in pros and cons lists; none shows a scope (O). `service-pages.ts` holds the process steps, deliverables and add-ons for each tier (O, lines 230-265, 380-391, 526-537, 653-661).
- **Quality gap: real sites.** No fetched post opens a built site (O). Konaverse has one per tier: Los Santos Barbershop (one page), HEIMAT, Chris N Clean, Velricon or TDK (five pages and up), Lumière Éclat (3D, a studio concept) (O, `src/lib/case-studies.ts`).
- **Quality gap: running cost over time, dated.** No result compares a builder's yearly plan with a studio's yearly hosting over several years (O). Konaverse hosting is yearly: €300, €600 with a CMS, €400 for 3D (O, `service-pages.ts:1000-1035`).
- **Gap the old draft had and must not repeat:** a shoe analogy and a hypothetical €1,000 against €2,500 (O, draft lines 28-34, 96). The audit called it "the vaguest of the twelve" (O, `drafts-audit-2026-10-13.md:35`).
- Gap priority (Impact x Advantage / Effort, I): hours per tier and the tier table score highest (high impact, unique to us, low effort once the owner answers); the three-year running-cost chart is next; a speed inspection of a builder page against a Konaverse page is optional (medium impact, needs a fair method).

### How it differs from the live cost post (so the two do not compete)

The live post `/blog/website-cost-cyprus` (title "Website Cost in Cyprus (2026): Real Prices and What Moves Them", M, live HTML) already carries: the six-row price table, "What moves the price", "Is a €1,200 one-page website enough?", "What an €800 website leaves out" with a five-row template-build versus custom-build table (design source, ownership, phone, search readability, old URLs), "The honest version" note, SEO cost, running costs, and five questions to compare quotes (O, live H2s and `src/lib/blog-posts.ts:130-231`).

| | Live cost post | This piece |
|---|---|---|
| Primary query | website cost cyprus | template vs custom website |
| SERP | Cyprus blog-and-pricing-page SERP; the post appears 3rd (signed-in caveat) (M, `services-cyprus.md` §5) | Global small-agency comparison SERP |
| Overlap measured | | 0 shared URLs between "template vs custom website" and "how much does a website cost" (M, `cluster-niche.md` §2b) |
| Job | "What does a website cost?" | "Which route, and what is inside each price?" |
| Prices | The full price list | The three tier prices only as labels; the list itself stays in the cost post, linked |

**Do not reprint:** the six-row price table; the "What moves the price" list; the five rows of the €800 table; "The honest version" note wording (the web design page uses the same sentence too, O, `service-pages.ts:225`); the five quote questions; the SEO paragraph; the running-costs paragraph. **Do not answer** "is one page enough": link to the cost post's section, and later to the August piece (cluster row 5).

**Title tag decision (I):** keep "Cyprus" out of the title tag. The cost post owns Cyprus plus price; this query has the same 10 to 100 range in Cyprus and worldwide, so the global wording costs nothing. The H1 keeps "a Cyprus studio" as identity.

### Winning Outline

**H1:** Template, builder or custom website: what €1,200, €2,500 and €6,000 buy at a Cyprus studio
**URL Slug:** /blog/template-vs-custom-website (new slug; the old `why-custom-websites-are-expensive` was never published, confirm it is not in Sanity before reusing nothing of it)
**Target Word Count:** ~1,900 words plus two tables and five images (competitor avg: ~1,750). A planning estimate, not a target: Google states no preferred length (voice guide).

**Opening answer** (55 to 65 words, FS target, the CMS "Opening answer" field). Primary keyword in the first sentence. Proposed, to be finished with the owner's hours:
> The template vs custom website choice comes down to what the site has to carry. A website builder or a bought theme is the right buy when the site is secondary and the budget is a few hundred euro. A custom site earns its price when the brand or the sales depend on it. Here is what our three tiers include, and the hours inside each.

**H2 1. The three routes, side by side** (~250 words + Table 1). FS target: the table. Heading carries secondary "website builder vs custom website". Body: primary keyword once.
- One paragraph on what each route is. Then Table 1 (rows below). Then two sentences pointing to the cost post for the full price list.

**H2 2. What a template or builder site really is** (~200 words). Secondary "website template" in the heading.
- Salvage the one strong passage of the old draft: a template has already made the structure, type, components and visitor path, so you buy decisions someone else made for someone else (draft lines 36-50). Keep it in prose; drop the hypothetical consultancy.
- The founder's real answer to owner-briefs question 2: has Konaverse delivered or declined a template site, and what he says to a client arriving with a Wix or WordPress template (owner input). Without it, cut the paragraph; do not write a generic one.
- Vendor facts (plan prices, export limits) only from Wix's and Squarespace's own pricing and help pages, in euro, read from Cyprus, dated "as of" the publish day.

**H2 3. What €1,200 buys: one page, section by section** (~250 words + Image V2). Heading: "one page website" vocabulary, no primary.
- Scope from `service-pages.ts:633-661`: six to eight sections in a fixed order (what, for whom, proof, price, contact); brief in 2 days; design in 1 week with one round of feedback; build and launch in 1 week; designed at desktop and phone size; analytics connected. Add-ons named only as the things that push it up (bookings from €300, a second language from €300, copywriting from €200).
- Los Santos Barbershop opened: one page, seven sections, the booking button in every section, prices stated (O, `case-studies.ts:94-274`). Link `/work/los-santos-barbers`.
- Hours (owner input), labelled "from timesheets" or "from memory".
- Whether Los Santos paid today's list price is the owner's call to print; otherwise "this is what it would be at today's prices" (owner input).

**H2 4. What €2,500 buys: five pages, designed and built** (~300 words + Image V4). Heading: "custom website" vocabulary.
- Scope from `service-pages.ts:204-265, 353-391`: a written brief; two homepage directions presented live; every page at desktop and phone size with the motion specified; a named design system; the build on Next.js, server-rendered, with a staging site; one week of content and QA on real devices; launch in 2 days. Design alone €1,800, build alone €1,800, together from €2,500, four to eight weeks.
- One site opened (owner picks): HEIMAT (project pages with floor plans), Chris N Clean (four pages, a quote form on each, a 121-frame scroll film), Velricon (nine pages, so beyond five), or TDK (a Sanity CMS the client edits, which is the CMS add-on in practice) (O, `case-studies.ts`).
- Hours (owner input).

**H2 5. What €6,000 buys: one object, one scroll** (~180 words). Short on purpose.
- One paragraph from the 3D cost post: one page, one object, up to five chapters, eight to twelve weeks; no client has paid for a 3D site yet; Lumière Éclat is a studio concept (O, 3D cost draft lines 38, 46). Link `/blog/how-much-does-a-3d-website-cost` for the phases. Do not reprint its phase table.

**H2 6. Where the hours go** (~150 words + Image V3). Only if the owner's hours exist; otherwise cut the section and the "hour by hour" phrase from the meta description.
- One stacked bar per tier: brief, design, build, content, testing, launch. Under it, one sentence on the rate, after the owner reconciles €50 an hour against €1,000 a week (correction 2 above).

**H2 7. Why custom websites cost more** (~200 words). Secondary "why are custom websites so expensive" as the H2 wording or close to it.
- The answer is the hours chart above, plus the decisions a template made in advance. No shoe analogy. No W3C or page-experience citations (four drafts already used them; audit line 25).

**H2 8. Three years of running costs** (~150 words + Table or Image V5).
- Konaverse: €300 a year, €600 with a CMS, €400 for 3D (O). Builder: the annual plan from the vendor's page, dated. The builder figure includes hosting and the editor; the Konaverse figure does not include changes, which are quoted (O, `service-pages.ts:1018-1029`). Say so in the caption so the comparison is fair.
- Labelled an illustration over three years, not a quote.

**H2 9. When we tell people to use a template** (~150 words).
- The owner's real instance or threshold (owner-briefs question 8: a budget under X, a site replaced within a year, a one-week deadline). The web design page's "page online by Friday" line is already published twice; this section needs the specific case, not the slogan.

**Close** (~100 words). A different action from the series skeleton (audit line 25): ask any studio, Konaverse included, for the hours behind its price and the site that shows the tier. One link to `/services/web-design`. "Until next time."

No FAQ section and no FAQPage schema (owner decision, 2 October; FAQ rich results retired). The People Also Ask questions are answered inside H2 1, 3 and 4.

**Table 1: the three routes** (four columns; check the blog table on a phone):

| Row | Website builder plan | Bought theme (for example WordPress) | Custom, at Konaverse |
|---|---|---|---|
| Cost to launch | Plan price, from the vendor's page in euro, dated; plus your own hours | Theme licence plus hosting plus set-up, each sourced | From €1,200, €2,500 or €6,000 by tier; link the cost post for the rest |
| Cost each year after launch | Annual plan, sourced | Hosting plus plugin renewals, sourced or "varies" | €300 a year; €600 with a CMS; €400 for 3D |
| Who decides the design | The template's author, adjusted by you | The theme's author, adjusted by whoever sets it up | Drawn for you: two directions shown live, every page at two sizes |
| Skilled hours inside the price | Yours, unpaid and uncounted | Varies | The owner's hours per tier (November input) |
| What you change yourself after launch | Anything the editor allows | Anything the admin and plugins allow | What the CMS exposes (TDK edits its own projects and units); other changes quoted |
| What you can take with you | From the vendor's export documentation only | The files and database, sourced | One line plus a link to the cost post's ownership row; do not repeat it |
| Right for | Owner input (question 8) | Owner input | A business whose brand or sales depend on the site |

Optional row, only if run as a real inspection: "What one page sends to a phone", measured on the same day with the same tool for one vendor template demo and Los Santos, method printed. Otherwise leave it out.

**Table 2: the three tiers** (replaces nothing in the cost post; it describes contents, not prices):

| Row | One page, from €1,200 | Five pages, from €2,500 | 3D, from €6,000 |
|---|---|---|---|
| What it is | One long page, six to eight sections | Five main pages, designed and built | One scroll, one object, up to five chapters |
| Timeline | Two to three weeks | Four to eight weeks | Eight to twelve weeks |
| Decision points you sign off | The outline, one design round | The brief, two directions, the designs, the staging site | The storyboard, the rendered stills, the build |
| Hours | Owner input | Owner input | Lumière's phases, from memory, linked to the 3D cost post |
| What pushes you to the next tier | A second audience or a second thing to sell | An object or a scene that moves with the scroll | |
| Hosting a year | €300 | €300, or €600 with a CMS | €400, or €700 with a CMS |
| A site you can open | Los Santos Barbershop | Owner's pick (HEIMAT, Chris N Clean, Velricon or TDK) | Lumière Éclat, a studio concept |

Sources for Table 2: `service-pages.ts` lines cited above; 3D hosting with a CMS from the 3D cost draft line 104 (O).

**Keyword placement.** Primary "template vs custom website": title tag, opening answer first sentence, slug, meta description, H2 1 body once, alt text of Image V1. Secondary (5 to 8): custom website vs template, website builder vs custom website, website template, custom website cost, why are custom websites so expensive, custom web design, one page website. Semantic: theme, Wix, Squarespace, WordPress, design system, CMS, hosting, staging site, ownership, timeline, hours, scope, five-page website, 3D website. Each once or twice where natural; no density target.

### Visuals (designed sections, not a text wall)

The blog renders paragraphs, H2/H3, lists, tables, a stats row, a callout and images (O, `src/lib/blog-posts.ts:66-77`; `studio-konaverse/schemaTypes/post.ts`). No chart or video block exists, so charts ship as images.

| # | Visual | Block | Source and status |
|---|---|---|---|
| V1 | Three real sites side by side, captioned with tier, timeline and link | image | Captures exist under `public/work/los-santos-barbers/`, `public/work/<five-page pick>/`, `public/work/lumiere-eclat/` (O). Alt: "Template vs custom website: three Konaverse sites at 1,200, 2,500 and 6,000 euro" |
| V2 | Los Santos on a phone with its seven sections labelled: what €1,200 buys | image | New annotated capture; design time (owner) |
| V3 | Hours per tier as stacked bars | image, or a stats row as fallback | Only with the owner's hours |
| V4 | The two homepage directions, the step a template skips | image | `public/work/velricon/02.webp`, `public/work/heimat-group/03.webp` already used for this on the web design page (O, `service-pages.ts:322`) |
| V5 | Three-year running cost, builder plan against Konaverse hosting | table or image | Builder figure dated on publish day |
| Stats | "€1,200, 2 to 3 weeks, 1 page" / "€2,500, 4 to 8 weeks, 5 pages" / "€6,000, 8 to 12 weeks, 1 scroll" | stats | From `service-pages.ts` |
| Callout | "No client has paid for a 3D site yet; Lumière is our own concept." and "Hours marked from memory are not a timesheet." | note | Honesty lines from the 3D cost draft (O, line 38, 65) |

### Recommended Meta Tags

**Title** (the site appends " | Konaverse", O, `src/app/layout.tsx:77`)
`metaTitle`: Template vs Custom Website: What Each Tier Buys
Rendered: "Template vs Custom Website: What Each Tier Buys | Konaverse" (59 characters, M)

**Meta Description** (140 characters, M; no brand, no quotes)
Template vs custom website: what a €1,200, €2,500 and €6,000 site includes at a Cyprus studio, hour by hour. Compare them before you choose.

If the hours do not arrive, drop "hour by hour" and the description falls to 127 characters; add "line by line" instead (I).

### Unique Angle and Information Gain

No ranking page for this query prices the custom side, counts the hours inside a price, or opens a built site (O, the three fetched posts). This piece does all three from the studio's own records: the hours per tier from the owner, the scope of each tier as published in `service-pages.ts`, one live client site per tier with its sections annotated, and yearly running costs set against a builder's dated plan. The one judgement only the founders can give is when they send someone to a template, from a real case. Without the hours, the piece still has the scopes and the sites, but it loses the one number no competitor has; it should wait for November rather than ship without it (I).

### E-E-A-T Requirements

- Author: Konstantinos Kyprianou, with the biography in `src/lib/site.ts`. "I" for judgement, "we" for studio facts.
- Hours labelled by source: "from timesheets" or "from memory".
- Vendor prices and export rules only from the vendors' own pages, in euro, read from Cyprus, each with an "as of" date and URL.
- Every tier tied to a site a reader can open; Lumière Éclat and City Arcade labelled studio concepts everywhere.
- No client results, no invented quotes, no competitor named as worse. Do not name Cyprus studios at all in this piece (I).
- Real publication date and a visible "last updated" date when prices or hours change.

### Internal Linking Opportunities

Spoke of the cost hub `/blog/website-cost-cyprus` (cluster 8) and of the service hub `/services/web-design`.

Out:
1. `/services/web-design`, anchor "custom web design in Cyprus" (the one service link; cluster row 29).
2. `/blog/website-cost-cyprus`, anchor "our prices and timelines in one table" (cluster row 27); and its `#one-page-or-full-site` section, anchor "whether one page is enough".
3. `/work/los-santos-barbers`, anchor "Los Santos Barbershop".
4. `/work/<five-page pick>`, anchor the client's name.
5. `/blog/how-much-does-a-3d-website-cost` (once live), anchor "what goes into the €6,000"; `/work/lumiere-eclat`, anchor "Lumière Éclat, our studio concept".
6. `/blog/nextjs-vs-webflow`, anchor "if the builder you are weighing is Webflow" (the live builder comparison).

In (it needs three; cluster file §5 checks):
1. `/blog/website-cost-cyprus`, from the €800 table, anchor "what a template and a custom build each buy" (cluster row 28).
2. `/services/web-design`, from the "When it is the wrong choice" beat, anchor "template or custom: what each tier buys" (cluster row 30).
3. "How long a website takes to build" (January 2027), anchor "the hours inside each tier".
4. `/blog/how-much-does-a-3d-website-cost`, from its short-answer table, anchor "what the two smaller tiers buy".

### Owner inputs Brief 1 needs

1. Hours per tier (one page, five pages; confirm the 3D phases), from timesheets or marked from memory (November dependency).
2. Reconcile €50 an hour (add-on note) with about €1,000 a working week (3D driver table) before hours sit beside prices.
3. One site per tier, and whether each client paid the current list price or should be described "at today's prices".
4. The template answer: a real case of delivering or declining a template site, and what you tell a Wix or WordPress client (owner-briefs questions 2 and 8).
5. Confirm ownership (domain, hosting account, code, design files) is the same at every tier (question 7).
6. Wix and Squarespace prices read in euro from Cyprus on the publish day (owner's browser).
7. Design time for the annotated Los Santos capture (V2) and the hours chart (V3).

---

# Brief 2

## Content Brief: how to build a 3d website

Working title (task): *Video, shader or live 3D: three ways to put 3D on a website.* Feeds `/services/3d-websites`. Content plan slot: April 2027, waiting on the Labs glTF pieces (O, content plan line 89). It can run earlier with Lumière Éclat as the live-3D case once the phone measurements below exist (I); the owner decides.

### Search Intent

Informational with commercial weight: a founder, marketing lead or designer deciding how 3D should reach a page before hiring or building. The literal how-to queries return tutorials and courses (dev.to, Udemy, Seahawk's WordPress guide, a Spline Substack, an O'Reilly Papervision3D chapter) (O, cached WebSearch US, "how to build a 3d website"); the comparison query returns tool comparisons (M, cluster file group 4). On Google (US, 4 September) "How can I create a 3D website?" sat in People Also Ask on the "3d website design" inspiration SERP (M, `serp-autopsy.md:89`). The format that fits: a decision guide with a measured comparison table, not a tutorial (I). Do not add HowTo schema (owner decision).

**Demand evidence (our files only).** There is no measured head term for "video vs shader vs live 3D". The case rests on a cluster of long-tail signals (I).

| Query | Evidence | Source |
|---|---|---|
| how to build a 3d website | 4 autocomplete feeds; not in Keyword Planner | M, `suggest.md:194` |
| How can I create a 3D website? | People Also Ask, Google US, 4 Sep | O, `serp-autopsy.md:89` |
| how to make a 3d website | 2 feeds | M, `suggest.md:568` |
| three js website | 1K to 10K worldwide | M, `keyword-planner-raw.md:217` |
| 3d website builder | 1K to 10K worldwide; 6 feeds | M, line 132; `suggest.md:158` |
| 3d web design | 1K to 10K worldwide | M, line 129 |
| webgl website | 100 to 1K worldwide (end-user PAA, "how do I enable WebGL") | M, line 239; `serp-autopsy.md:119-125` |
| spline website design | 10 to 100 worldwide | M, line 213 |
| 3d website video / 3d web video | 2 feeds each | M, `suggest.md:441, 284` |
| 3d website with blender / using blender / three js | 2 feeds each | M, `suggest.md:445, 436, 429` |
| 3d website wix / framer | 2 feeds each | M, `suggest.md:452, 334` |
| spline vs three.js; pre-rendered vs real-time 3d | not in our data; a SERP exists | O, cluster file group 4; this run |

**Primary choice (I):** "how to build a 3d website" has the strongest signal in our data (4 feeds plus the PAA wording) and the article answers the first decision of that question. The Keyword Planner terms with volume ("three js website", "3d website builder") are developer and builder intent; they are secondaries.

### Competitor Analysis

WebSearch US, 22 October. Filtered out: SaaSHub (aggregator), dev.to (content platform), the Udemy course page, a spam subdomain (`nps-tissueconverting.valmet.com`). Scores are my judgement (I).

| # | URL | Key H2 sections | Est. words | Score | Main gap |
|---|---|---|---|---|---|
| 1 | https://svilenkovic.com/3d/spline-vs-three-js (no date; one of a programmatic page family) | When option B wins; my default choice; migration effort; quick summary; FAQ | ~500 (M, fetched) | 2/3/6/4 = 15/40 | No table, no numbers, no builds; video and frame sequences never mentioned (O) |
| 2 | https://cloud.needle.tools/compare/needle-vs-threejs-vs-spline (vendor page) | A 36-row feature matrix: engine size, loading, runtime performance, LODs, XR | ~3,000 incl. navigation (M) | 6/7/6/6 = 25/40 | The vendor ranks itself; every size is qualitative ("Small", "Medium/Large"); no pre-rendered route; no device data (O) |
| 3 | https://seahawkmedia.com/wordpress/create-3d-website/ | WordPress how-to | not fetched | not scored | |
| 4 | Pre-rendered vs real-time explainers: rebusfarm, garagefarm, power.xyz, dopple, 3d.irpr.agency, svilenkovic real-time-3d-website | Render-farm and 3D-commerce vendor posts | not fetched | not scored | The result summary found "no independent performance tests comparing page load, bandwidth, or frame rates" (O, search summary, this run) |
| 5 | Scroll image-sequence tutorials: setproduct, CSS-Tricks, GSAP forum | How to scrub frames on a canvas | not fetched | not scored | "None of these sources compares total bytes for an equivalent image sequence versus an equivalent video" (O, search summary) |

The links file's search for "spline vs three.js vs video for 3D website" found the same pattern: needle.tools, svilenkovic.com, SaaSHub, studiomeyer; "None compares video" (O, `links-and-competitors.md:146`). Competitor average of the two fetched real pages: not meaningful (500 and a 3,000-word matrix page).

### Content Gaps and Opportunities

- **Topic gap: the pre-rendered route.** No current result compares video or frame sequences with live 3D (O). Konaverse has shipped both forms.
- **Depth gap: numbers.** No result gives a file size, a triangle count or a frame cost for any route (O). Konaverse has them (Konaverse substance, below).
- **Quality gap: the same object in two forms.** The ice cube exists as a video loop and as a scroll frame sequence at the same 640 px (M). No result shows that.
- **Quality gap: honesty about where it was measured.** The repo's reports separate headless Chrome from physical devices (O, `docs/performance-handoff.md:316-317`). No competitor states a test condition.
- **Gap we must not fill by guessing:** phone frame rates. None is measured for any Konaverse route (O). See "What must be measured".

### Konaverse substance, measured

All sizes in bytes. "Raw" is the file as stored; "compressed" is what curl received with brotli or gzip requested. Measurements dated 22 October 2026 unless a report is cited.

**Route 1a: pre-rendered video**
- Ice-cube loop, `public/object/idle-clear.mp4`: H.264, 640 x 640, 60 fps, 300 frames, 5.00 s, 930,275 bytes, 1.49 Mbps (M, ffprobe). Rendered in Blender Cycles on CPU: the source is 120 PNG frames at 640 px, 49,312,622 bytes, in `blender/renders/idle-clear/` (M; local only, renders are gitignored). The page file is 1.9% of its render source (M, arithmetic). Still served (M, 200, 930,275 bytes) but used by no live page (correction 1).
- Homepage hero loop, `public/home/hero-loop.mp4`: H.264, 1672 x 940, 25 fps, 71 frames, 2.84 s, 1,167,911 bytes, 3.29 Mbps (M, ffprobe); re-encoded on 26 August from 3.87 MB by dropping a silent audio track and the bitrate (O, commit 6d36111). Its origin is not recorded (O, `docs/launch-plan.md:179-183`): owner input.

**Route 1b: pre-rendered frames bound to the scroll**
- Ice-cube scrub test, `public/object/scrub-test/`: 120 WebP frames, 640 x 640, 1,380,266 bytes (M); source 120 PNG, 44,560,439 bytes (M). Same object and size as the loop, **different animation** (a frost-to-clear arc, not the idle spin), so it is not a like-for-like file comparison (O). The scrub was cut from the homepage by founder decision: "the object is not what makes the page feel premium" (O, `docs/homepage-choreography.md:21`).
- Chris N Clean, https://www.chrisnclean.com (a client site): desktop 121 JPEG frames at 1920 x 1074, 15,576,405 bytes; phones 73 JPEG frames at 1076 x 1928, 2,465,987 bytes (M, curl of every frame). Its script requests every frame on mount (O, the site's JS: a loop creating one image per frame). The case study says why frames and not video: "a video plays at its own speed and the visitor watches" (O, `case-studies.ts:766`).
- Decoded size, arithmetic only: 640 x 640 x 4 bytes x 120 = 196.6 MB for the ice-cube scrub; 1920 x 1074 x 4 x 121 = 998.0 MB for the Chris N Clean desktop film if every frame were decoded at once; 1076 x 1928 x 4 x 73 = 605.8 MB for its phone film (I, arithmetic; a browser does not necessarily hold all frames decoded, so this is an upper bound, not a measurement).

**Route 2: drawn in code (shaders)**
- The homepage peel: the hero video becomes a texture on a 140 x 90 mesh, 25,200 triangles while it folds, two triangles at rest (M, `docs/design/homepage-startup/README.md:9`; handoff line 74). Video texture uploads during the opening after the pass: 39 cold desktop, 47 warm desktop, 47 cold mobile (M, README lines 24-26). Recorded shader status-query time, cold: 22.4 to 1.6 ms desktop, 74.9 to 5.6 ms mobile (M, `docs/design/first-load/README.md:90-91`; queries over 1 ms only, not total compile time).
- The fluid cursor: its delayed chunk is 849,494 bytes uncompressed (from 1,066,572) (M, first-load README line 79); zero draws at rest (from 671 a second) (M, `docs/design/shared-effects/README.md:31-32`); never loaded on touch or with reduced motion (O).
- All of the above: headless Chrome with software WebGL; "timings are diagnostic" and do not establish smoothness on a device (O, homepage-startup README line 52).

**Route 3: a real model rendered live (WebGL)**
- Lumière Éclat, https://watchweb.vercel.app (a studio concept): `/models/watch.glb` 865,300 bytes raw, 506,165 compressed; Draco mesh compression and KHR_materials_transmission; 298 meshes, 36,755 vertices, 46,353 triangles, 9 materials, 1 texture (M, curl and a read of the glTF header). Page JavaScript: 11 chunks, 1,599,650 bytes raw, 477,963 compressed, framework included (M). HTML 5,909 and CSS 5,847 compressed (M). Draco decoder files served at `/draco/`: 60,562 and 11,800 bytes compressed; the bundle also carries a gstatic decoder path, so which one loads is unconfirmed (M, O). Seven campaign images and any environment map: not measured (O, no environment file found in the chunks).
- Reading (I): the 3D-specific transfer of the live watch (model plus decoder, about 0.58 MB compressed) is smaller than either hero video; the Three.js share of the 478 KB of script is not yet split out. Bytes do not separate the routes; what the device does each frame does.

**Spline (not built by us, sourced)**
- Pricing (USD, observed 22 Oct on https://spline.design/pricing): Free exports carry a watermark; Hobby, $15 a seat a month or $12 yearly, removes it; Pro, $30 or $25 yearly, adds "Download Code Export"; "Self-Hosted Export" is Enterprise only, custom priced. The pricing page and some resellers disagree on plan names; use the vendor page on the publish day.
- Runtime: `@splinetool/runtime` 1.12.67, `runtime.js` 2,042,955 bytes on disk, with optional modules such as `physics.js` 1,988,993 bytes (M, the package installed in this repo). This is the npm file, not a page transfer.
- Embeds: a viewer link in Webflow and Wix, a React package, a vanilla runtime (O, docs.spline.design pages in this run's results; re-read before quoting).
- Note for the owner (O): `package.json` lists `@splinetool/react-spline` but no source file imports it. The article can still say "we have not shipped Spline".

**Founder decisions that can be printed after the owner confirms the wording**
- The studio's own object is pre-rendered, never live, for realism (path tracing) and because the fluid cursor already owns the page's WebGL budget (O, studio session notes, 17 August; not in a repo doc yet).
- On Lumière, particles, reflections and a cursor that moves the object were tried and cut (O, `case-studies.ts:400`).
- Prices: a rendered object inside a standard site is "quoted per object, art days on top of the tier"; a scroll-driven 3D site is from €6,000 (O, 3D cost draft lines 45-46). No price exists for a shader-led hero: owner input.

### Winning Outline

**H1:** How to build a 3D website: video, shader or live 3D, measured on our own builds
**URL Slug:** /blog/how-to-build-a-3d-website
**Target Word Count:** ~2,100 words plus two tables and six images (no meaningful competitor average: one 500-word page and one feature matrix). A planning estimate, not a target.

**Opening answer** (55 to 60 words, FS target). Proposed:
> There are three ways to build a 3D website. Render the object in advance and ship it as video or frames, draw it in code with a shader, or send a real 3D model that the browser renders live. Only the live model lets a visitor turn it. We have shipped all three; here are the file sizes.

**H2 1. The three routes in one table** (~200 words + Table A and Table B). FS target: Table A. Heading: "ways to put 3D on a website". Body: primary once.

**H2 2. Render it first, ship it as video** (~300 words + Image V1, V2). Secondary "3d website video", "3d website with blender".
- The ice cube: Blender, 120 frames, 49.3 MB of PNG, a 0.93 MB loop. The homepage loop inside the peel (1.17 MB), with its origin stated (owner input).
- What video cannot do: change the camera or answer the cursor. Every change is a new render (render times from the session notes, re-checked first).

**H3. The same render as frames you scroll** (~300 words + Image V3).
- Why frames: the scroll drives them, forwards and backwards (Chris N Clean's own reasoning).
- The cost: 15.6 MB on desktop and 2.5 MB on phones for Chris N Clean; 1.38 MB for the ice-cube scrub; the decoded-size arithmetic, labelled as arithmetic. Print the Chris N Clean figure only after the owner decides (owner input 4).

**H2 3. Draw it in code: shaders** (~300 words + Image V4). Secondary "webgl website".
- The peel: the video on a 25,200-triangle mesh that folds, then two triangles. The cursor: an 849 KB chunk that draws nothing at rest and never loads on touch.
- What shaders are for: light, pattern, distortion, the page's surface. Not a product with a material (I).
- The cost on load: compile waits the first-load pass removed, headless numbers only.

**H2 4. Send a real model: live 3D with WebGL** (~300 words + Image V5). Secondaries "three js website", "3d website three js".
- Lumière Éclat, labelled a concept: 46,353 triangles, 0.51 MB compressed model, the scroll turning the light rig. What it allows that the others cannot.
- The fallbacks: stills for reduced motion and for devices without WebGL (O, `case-studies.ts:409, 421`).
- Phone frame rates: printed only after the device session. The 3D service page's "60 fps" is a target, not a measurement (O, `service-pages.ts:506`); say so.

**H2 5. Where Spline fits (we have not shipped it)** (~200 words). Secondary "spline vs three.js", "spline website design".
- The sourced row: editor, embeds, pricing as of the publish day, runtime file size on disk. One sentence on when a designer-led team would choose it (I, labelled opinion).

**H2 6. What each route costs at Konaverse** (~150 words). One paragraph and a link to `/blog/how-much-does-a-3d-website-cost`. No phase table.

**H2 7. How to choose** (~200 words + Image V6, a small decision path).
- The questions that decide it: must the visitor turn the object; does the brand have an object at all (the service page's own "wrong choice" line, O, `service-pages.ts:521`); must it work with no WebGL; how often will it change.

**Close** (~100 words). Action: ask any studio which of the three routes it is quoting and the file size of the asset it will ship. One link to `/services/3d-websites`. "Until next time."

No FAQ block, no HowTo or FAQPage schema.

**Table A: the decision table** (columns: Video or frames | Shader | Live 3D | Spline, not built by us)

| Row | Pre-rendered (video or frames) | Shader (code-drawn) | Live 3D (WebGL model) | Spline (sourced, not built by us) |
|---|---|---|---|---|
| Our build you can open | Chris N Clean scroll film; the ice-cube loop shown in the article | The kona-verse.com homepage peel and cursor | Lumière Éclat, a concept | None |
| Weight of the 3D asset | 0.93 MB loop; 1.17 MB hero loop; 15.6 MB desktop frames (Chris N Clean) | The peel reuses the hero video; cursor chunk 849 KB uncompressed | 0.51 MB model compressed, plus decoder | Runtime file 2.04 MB on disk (npm, not a page transfer) |
| What the device does each frame | Decodes and shows a frame | Runs the shader over every pixel | Renders the model, lights and materials | Renders its scene through its runtime |
| Can the visitor change the view | No (frames follow the scroll only) | Reacts to input, but draws no product | Yes | Yes, per the editor's events |
| No WebGL or reduced motion | Video plays; frames need a still | Needs a fallback | Needs stills (Lumière has them) | Per vendor documentation |
| What a change costs | A new render and encode | A code change | A code change, or a new model export | An editor change by a designer |
| Cost at Konaverse | Quoted per object on top of a tier | Owner input | From €6,000 for a scroll-driven site | Not offered |
| When to use it | Realism matters and the view is fixed | The surface, not the subject, should move | The product must turn, or the visitor must explore | A designer owns the scene and the budget allows the runtime |

**Table B: phones and test conditions** (fill only after measuring; until then the column says "not measured"): device, browser, route, median frame time, worst frame, time to first 3D frame, transfer on a cold load.

**Keyword placement.** Primary "how to build a 3d website": title tag, opening answer, slug, meta description, H2 1 body, alt text of V1. Secondary: how to make a 3d website, three js website, 3d website video, spline vs three.js, webgl website, 3d website with blender, pre-rendered vs real-time 3d, 3d website builder (Spline section only). Semantic: Blender, render, frame sequence, H.264, WebP, shader, WebGL, glTF, Draco, triangles, texture, reduced motion, fallback, scroll-driven, mid-range phone.

### Visuals

Same block limits as Brief 1: image, table, stats, callout. A video block does not exist in the Sanity schema (O); embedding the loops needs a schema and renderer change, which is separate development work for the owner to authorize.

| # | Visual | Block | Source and status |
|---|---|---|---|
| V1 | One frame of each route side by side (ice cube, the peel mid-fold, the watch), each captioned with its file size | image | Captures to make; Lumière stills exist in `public/work/lumiere-eclat/` (O). Alt: "How to build a 3D website: video, shader and live 3D frames from our builds" |
| V2 | From render to page: 120 PNG (49.3 MB) to a 0.93 MB loop, and 120 PNG (44.6 MB) to 1.38 MB of WebP | image (infographic) | Numbers measured above |
| V3 | One bar chart of asset weights on a common scale, with what each bar includes | image | Numbers measured above; Table B adds phone data later |
| V4 | The peel's 140 x 90 grid drawn over the hero | image | New diagram |
| V5 | The watch in wireframe: 46,353 triangles | image | Render from `watch.glb` (studio task) |
| V6 | A four-question decision path | image | New diagram |
| Video, optional | The ice-cube loop and the Lumière reel (`/work/lumiere-eclat/reel.mp4` exists, O) | needs a video block | Owner decision |
| Callout | "How we measured": tool, date, compressed or raw, headless or device | note | Required (E-E-A-T) |

### Recommended Meta Tags

**Title**
`metaTitle`: How to Build a 3D Website: Three Ways, Measured
Rendered: "How to Build a 3D Website: Three Ways, Measured | Konaverse" (59 characters, M)

**Meta Description** (143 characters, M)
How to build a 3D website three ways: video, shader or live WebGL, with file sizes measured on our own builds and when to use each. Start here.

### Unique Angle and Information Gain

No ranking page compares a pre-rendered route with live 3D, and none prints a measured number for any route (O). This piece is the only one that can show one object, the ice cube, rendered once and delivered two ways at the same resolution; a live client site's frame film weighed frame by frame; a shader that folds a video across a 25,200-triangle mesh and rests at two; and a real-time watch model counted to the triangle, all measured on builds a reader can open or watch in the article. Its sharpest finding is counter-intuitive and measured: on our builds the live model transfers less than either hero video, and the frame film transfers the most, so the choice turns on what the device must do per frame and what the visitor must be able to change, not on bytes (I, from the measurements). It also says plainly what was not measured on a phone.

### E-E-A-T Requirements

- Author: Konstantinos Kyprianou (the scroll build and device testing are his, per the 3D cost draft's phase table, O, lines 59-63).
- A "How we measured" callout: tool, date, compressed or raw, headless Chrome or named device.
- Lumière Éclat and its maison labelled fictional and a studio concept wherever they appear.
- Spline marked "not built by us", every fact sourced to the vendor's page with an "as of" date.
- Credit for the ice-cube render stated accurately (owner input 3).
- No frame rate, battery or thermal claim without a device measurement; the June 2027 "WebGL on phones" piece owns battery and thermal.

### Internal Linking Opportunities

Spoke of the 3D pillar (cluster 5 hub, per `cluster-niche.md` §3) and of `/services/3d-websites`.

Out:
1. `/services/3d-websites`, anchor "3D and immersive website design" (the one service link).
2. `/work/lumiere-eclat`, anchor "Lumière Éclat, our studio concept".
3. `/work/chris-n-clean`, anchor "the Chris N Clean scroll film".
4. `/blog/how-much-does-a-3d-website-cost` (once live), anchor "what each route costs, phase by phase" (cluster row 15).
5. `/blog/what-is-scrollytelling` (once live), anchor "how a scroll-driven page works".

In:
1. `/services/3d-websites`, from the answer's second paragraph ("rendered offline and delivered as light video"), anchor "three ways to put 3D on a page".
2. `/blog/how-much-does-a-3d-website-cost`, from "The small version: a 3D hero on a normal site", anchor "video, shader or live 3D" (that section needs the correction anyway).
3. Labs piece 1 making-of (January 2027), anchor "the other two ways to put 3D on a page" (cluster row 16).
4. The best 3D websites flagship (February 2027), from its technique column, anchor "how each technique works".

**Neighbours to keep apart (I):** the 3D cost post owns price (one paragraph here); the scrollytelling post owns the definition (none here); the May piece owns input lag; the June piece owns battery and thermal; the Labs making-ofs are build records, this is the overview.

### What must be measured before writing

1. **Phone frame times** for the homepage peel opening, the Chris N Clean film and the Lumière scroll, on two named physical phones (an iPhone in Safari and a mid-range Android in Chrome), with OS and browser versions. Physical-device and Safari review is still outstanding (O, AGENTS.md). Combine with the December Labs device session if possible.
2. **Cold network traces** in a real browser for the three pages: total transfer, what loads before the first 3D frame, which Draco decoder loads, the environment map source, the Lumière campaign images.
3. **The Three.js share of Lumière's 478 KB of script**, with a bundle analyser on its repository (location unknown: owner input).
4. **Time to first 3D frame**, cold, desktop and phone, for the peel and for Lumière.
5. **Render times for the ice cube**: the 17 August session-note figures move into a repo record, or one frame is re-timed.
6. **Decoded memory on a phone** for the two frame sequences, or print only the arithmetic, labelled.
7. **A Spline test** with the same object, only if the owner wants a measured fourth column; otherwise the row stays sourced.

### Owner inputs Brief 2 needs

1. What `/home/hero-loop.mp4` is and who made it. If it is not a Konaverse render, the article cannot call it ours.
2. Correct the 3D cost draft's line 125 before that post publishes (correction 1).
3. How the ice-cube render is credited.
4. Whether to print Chris N Clean's 15.6 MB desktop figure as measured, or have the client's repository re-encoded first (a separate decision about a client site; this run changed nothing).
5. A price, or "quoted", for a shader-led hero.
6. Where Lumière's repository lives, for the bundle split.
7. A phone test session (measurement 1).
8. Whether to add a video block to the blog schema for embedded loops (development work, separate authorization).
9. Spline: sourced row only, or a real test.
10. Timing: keep April 2027, or pull forward once the phone numbers exist.

---

## Sources

Fetched or searched 22 October 2026 (WebSearch is US):
- https://blacksmith.agency/resources/web-design/custom-vs-template-websites/
- https://www.icdsoft.com/blog/template-vs-custom-made-website/
- https://www.smartsites.com/blog/custom-vs-template-website-design-which-is-best-for-you/
- https://www.bluetonemedia.com/Blog/262508/Templates-vs-Custom-Built-Websites (404)
- https://svilenkovic.com/3d/spline-vs-three-js
- https://cloud.needle.tools/compare/needle-vs-threejs-vs-spline
- https://spline.design/pricing
- Search result lists: "custom website vs template"; "pre-rendered video vs real-time 3D on a website performance"; "how to add 3D to a website video, WebGL or Spline"; "Spline pricing plans export remove logo self-host code export"; "@splinetool/runtime bundle size performance mobile" (no Spline result); "scroll image sequence vs video canvas apple airpods technique file size"; "absolute-websites.com template vs custom website" (no result from that domain)
- Cached cluster result sets (WebSearch US, 22 Oct): "template vs custom website", "custom website cost", "why are custom websites so expensive", "spline vs three.js", "blender model to three.js website", "how to build a 3d website"

Measured with curl and ffprobe, 22 October 2026: https://kona-verse.com/ (HTML), https://kona-verse.com/hero-object (307), https://kona-verse.com/object/idle-clear.mp4; https://watchweb.vercel.app/ (HTML, 11 script chunks, CSS, `/models/watch.glb`, `/draco/` files); https://www.chrisnclean.com/ (HTML, scripts, `/frames-v2/001.jpg` to `121.jpg`, `/frames-mobile/001.jpg` to `073.jpg`); local files `public/object/idle-clear.mp4`, `public/object/scrub-test/`, `public/home/hero-loop.mp4`, `blender/renders/idle-clear/`, `blender/renders/scrub/`, `node_modules/@splinetool/runtime/build/`. Downloads went to the session scratchpad, not the repository.

Internal: `BRIEF.md`; `links-and-competitors.md` (Part 2); `cluster-niche.md` (§2b, §3, §4, §5); `services-cyprus.md` (§5); `docs/keyword-research.md`; `docs/keyword-research/keyword-planner-raw.md`, `suggest.md`, `serp-autopsy.md`; `docs/content-plan-2026-11-to-2027-08.md`; `docs/blog-writing-handoff.md`; `docs/editorial/konstantinos-voice-and-search.md`; `docs/editorial/drafts-audit-2026-10-13.md`; `docs/editorial/owner-briefs-2026-10-14.md`; `docs/blog-drafts/why-custom-websites-are-expensive.md`; `docs/blog-drafts/how-much-does-a-3d-website-cost.md`; `docs/homepage-choreography.md`; `docs/launch-plan.md`; `docs/performance-handoff.md`; `docs/design/first-load/README.md`, `homepage-startup/README.md`, `shared-effects/README.md`; `src/lib/service-pages.ts`, `src/lib/case-studies.ts`, `src/lib/blog-posts.ts`; `src/app/(v4)/page.tsx`, `src/app/(v4)/hero-object/page.tsx`, `src/app/layout.tsx`; `next.config.ts`; `package.json`; `../studio-konaverse/schemaTypes/post.ts`; plugin `skills/seo-content-brief/SKILL.md` and `references/`.

## Limits

- No Google SERP was fetched today for either primary. The Google records are from 4 September (US); the WebSearch sets are US and not Google's ranking.
- Demand is ranges and feed counts. Neither primary has a Keyword Planner figure above the floor except "template vs custom website" (10 to 100).
- Every byte figure above is a file or transfer measurement. None is a page-load time, and none was taken on a phone.
- The 17 August render and frame-gap figures come from the studio's session notes, not from a repo report; they are not printed as measured until re-checked.
- Competitor scores are judgement on three fetched pages per brief at most.
