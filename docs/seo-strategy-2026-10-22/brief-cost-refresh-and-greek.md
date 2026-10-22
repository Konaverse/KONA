# Two content briefs: the cost post refresh and a Greek cost article, 22 October 2026

Written with the claude-seo `seo-content-brief` skill (improve mode for Brief 1, new page mode for Brief 2) and its `seo-hreflang` skill, under the rules in [`BRIEF.md`](BRIEF.md). These are briefs. They authorise no drafting beyond this file, no CMS edit, no code change, no commit and no publication.

Labels: **measured** = a count or figure from a SERP record or a page fetched today; **observed** = seen on a page or in a file, with its location; **inferred** = my judgement.

## Evidence used, and its limits

- **Cyprus SERPs:** [`serps-cyprus.json`](serps-cyprus.json), the owner's signed-in Chrome in Cyprus, 22 October about 02:50 to 03:15. One desktop sample per query, at night. The cost post's 3rd place is unconfirmed until a signed-out check (caveat in [`services-cyprus.md`](services-cyprus.md)). AI Overview citations are hostnames only, so which page on a cited domain was used is not known.
- **Competitor pages:** 17 price pages fetched with WebFetch on 22 October. 13 loaded with prices, 2 more without prices (devitus.com/el returned no article body; jcsl.com.cy states no prices), and mind-laboratory.com returned 403. WebFetch shows the rendered text only, so meta tags, JSON-LD dates and hreflang tags were not visible. Word counts are estimates. Two one-page offers were fetched separately (vitpgroup.com/landing, ultimateworkzcy.com).
- **Clutch:** https://clutch.co/cy/web-designers, "Ratings Updated: Oct 21, 2026", read 22 October. 34 firm profiles were read from about 200,000 of the page's 217,097 characters; the last part was not read.
- **Google documentation**, read 22 October: [multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) (updated 2025-12-10), [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) (updated 2026-09-21), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) (updated 2026-08-28).
- **Site and CMS:** the live post as captured by the audit (`docs/seo-audit-2026-10-21/evidence/technical/html/blog_website-cost-cyprus.html`), `src/lib/service-pages.ts`, `src/app/(v4)/blog/[slug]/page.tsx`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/sanity/queries.ts`, and the Studio schema and importer in `../studio-konaverse`.
- **WebSearch** was used once, to find the Cyprus Digital Upgrade scheme's official page. It was not used as a ranking signal.

---

# Brief 1: refresh of /blog/website-cost-cyprus

## Content Brief: website cost cyprus (improve existing page)

### Search Intent

Commercial investigation with a number attached: a Cyprus business owner wants to know what a website costs before asking for quotes. Google rewards blog guides and pricing pages. On the two English cost queries, 14 of 18 organic slots are blog posts and 4 are pricing pages; there is no local pack and no directory (measured, `services-cyprus.md` section 5). Both queries show an AI Overview that gives a price band by tier: "€450 to 6,000 upfront by tier" and "€200 to 6,000 by type" (observed, JSON gists). The reader is a non-technical owner comparing one quote with another. They need the market range first, then a reason to pay more or less than it.

**Existing page (observed):** H1 "How much does a website cost in Cyprus in 2026?", author Nabil Al Jbawi, published 3 October 2026, `dateModified` 2026-10-03, 1,076 words (schema `wordCount`), seven H2s with stable anchors (`#prices`, `#what-moves-the-price`, `#one-page-or-full-site`, `#cheap-websites`, `#seo-cost`, `#running-costs`, `#compare-quotes`). Position 3 on `website cost cyprus` and on `website design cyprus prices` (measured, signed-in caveat). It is not cited in either AI Overview.

**What is already strong (keep):** the answer-first opening field, the published price table with timelines, the honest "when a template is right" callout, the five comparison questions, the two real case-study links, and the yearly hosting line.

### Competitor Analysis

Real competitors from the organic top 9 of the two English cost queries, after removing Konaverse. No domain on the skill's exclusion list appears in these results. Scores are my judgement (inferred) from the extracted text: Depth, Formatting, SEO, UX, each out of 10. UX is scored from structure only, without viewing the page.

| # | URL (position) | Key H2 sections | Est. words | Score | Main gap |
|---|---|---|---|---|---|
| 1 | oncypruswebdesign.com/en/packages (1st on both; AI Overview cited) | "Packages & Prices"; packages as H4 | ~1,050 | 17/40 (4/4/4/5) | Own packages only (€600, €800, €1,000, before VAT, yearly renewals €250 to €325). No answer sentence, no market context, no H1 |
| 2 | solutioweb.com/how-much-does-a-website-cost-in-cyprus/ (2nd, 5th; cited) | Factors; cost by type; design and development; domain and hosting; add-ons; freelancer or agency; FAQ | ~750 | 24/40 (6/7/6/5) | Unsourced "estimated" ranges (basic €500 to €1,500, business €1,500 to €5,000). Published 11 March 2025, never updated |
| 3 | domainstar.me/website-cost-cyprus-2026/ (4th; not cited) | Average cost; breakdown; hidden costs; freelancer vs agency; by business type; WordPress; FAQ | ~1,250 | 24/40 (6/5/7/6) | Market tiers (€800 to €2,000, €2,000 to €5,000) with no source, and no statement of its own price. Published 30 April 2026 |
| 4 | macleedesigns.com.cy/blog/website-cost-cyprus (5th; cited) | Typical ranges; why quotes differ; what to include; when €1,800 to €2,500 is enough; mid-market €3,000 to €8,000; marketing budget; how to brief | ~800 | 23/40 (7/5/5/6) | The deepest market reasoning, but "the Cyprus market analysis we use for our own positioning" is unnamed. No date, no author, no table |
| 5 | aawebstudio.com/website-cost-cyprus/ (6th, 2nd; cited) | What affects cost; types and typical costs; what is included; freelancer or agency; our charges | ~300 | 17/40 (3/3/6/5) | Thin. Market claims (landing €200 to €600, business €300 to €1,500) and no price of its own |
| 6 | bypanik.tech/en/website-cost-cyprus/ (7th; cited) | Current prices; one-page; business; e-commerce; domain and SSL; maintenance; SEO; what changes the price; FAQ | ~1,000 | 26/40 (6/6/7/7) | Own prices only (€499 one page, €749 up to five pages, support €39 or €59 a month). Has a "Quick answer" block and "Reviewed and updated August 2026", plus a Greek twin |
| 7 | webseo.cy/how-much-does-website-design-cost-in-cyprus/ (7th on prices; cited) | Typical prices; why cost varies; template vs custom; our packages; is cheap worth it; choosing | ~750 | 21/40 (4/6/6/5) | Its own packages (€450 template starter, €800, €1,100 e-commerce) presented as "typical" Cyprus prices. No date |
| 8 | ludehq.com/blog/how-much-does-a-website-cost-in-cyprus (8th; cited) | Short answer; price tiers; what you pay for; red flags; recommendation | ~700 | 20/40 (4/4/6/6) | Short answer up top, but the figures conflict (€299 to €1,500, then €5,000+). No sources |

Also on the SERP: dm-labs.io (9th, not cited; ~1,050 words; its body never mentions Cyprus), cyprusdigitalagency.com (6th on prices, cited; ~950 words; package tiers €500 to €1,000 and €1,200 to €3,000; bilingual "usually adds 20%"), mind-laboratory.com (4th on prices, cited; 403, not read).

Competitor average: about 850 words across the 10 pages that loaded (estimated by the extraction). Kona-verse's 1,076 words is already above it.

**Across all ten (measured):**
- No page cites an external source for any price.
- Five show a publication date. One shows an update (BYPANIK, August 2026). Four show no date at all.
- One page states VAT treatment (Cyprus WebPages: "Prices do not include V.A.T.").
- Two give a direct numeric answer in the first lines (BYPANIK, LudeHQ).

### What the AI Overviews cite, and why this post is not cited

**What they cite (measured):**
- `website cost cyprus`: 10 hostnames. 6 are in the organic top 9 (solutioweb, macleedesigns, oncypruswebdesign, bypanik, aawebstudio, ludehq); 4 are not (foryoudigitalsolutions, webseo, bandziuk, clovo-solutions). The 3rd result (kona-verse.com) and the 4th (domainstar) are skipped, while the 5th to 8th are cited.
- `website design cyprus prices`: 10 hostnames. 6 are in the top 9; 4 are not (foryoudigitalsolutions, paphoswebsitedesign, elixirblend, bandziuk). The 3rd result (kona-verse.com) is again skipped.
- Six domains are cited in both: oncypruswebdesign, foryoudigitalsolutions, aawebstudio, solutioweb, webseo, bandziuk.

**Where the numbers in the overviews seem to come from (inferred):**
- The €450 floor matches WebSEO's €450 starter.
- The €200 floor matches AA Webstudio's landing range of €200 to €600.
- The €6,000 ceiling matches Maclee Designs' SME range of €2,500 to €6,000.
- The one-page overview's "€150 to €500" has no visible source: no page that loaded states €150. The €500 upper end matches VITP Group ("from €500") and the €497 and €499 offers.

**Why this post is not cited (inferred, with the evidence for each):**
1. **It answers a different question.** The overview composes a market band per tier. The post's opening says "A professionally designed website in Cyprus costs from €1,200 ... Those are our own starting prices", so an engine finds one studio's prices and no range to lift (observed; audit B7 and evidence M5).
2. **Rank is not the gate.** The overview takes the 5th to 8th results and skips the 3rd (measured, one sample). Format and agreement with other sources matter more than position here.
3. **The figures are outliers against the cited set.** €1,200 for one page is above every one-page figure the cited pages publish (€200 to €600). A summary built on consensus treats a single higher figure as noise (inferred).
4. **Authority, which a refresh cannot fix.** The cited domains have years of local links; Konaverse has few and 0 reviews (audit section A). Say this plainly to the owner. A refresh improves the odds; it does not promise a citation.
5. **A stale date signal.** `dateModified` is 2026-10-03 although the hosting sentence changed on 14 October, and the page shows no "Updated" line (audit B7). This is minor.

**What the data cannot show:** citations vary by session and by user, and this was one signed-in sample. Which page on bandziuk.com, clovo-solutions.com or foryoudigitalsolutions.com was cited is unknown.

### Content Gaps and Opportunities

- **Topic gap: a sourced market range.** No ranking page cites a source. A dated range, with each figure linked to the firm that publishes it, is the one thing the cited set lacks and the overview needs. Priority: high impact, high advantage, low effort (about 2 to 3 hours of research, audit `geo.md`).
- **Topic gap: an independent lens.** Clutch's Cyprus list gives self-reported hourly rates and minimum project sizes for 34 firms (measured below). No ranking page uses it.
- **Depth gap: what each extra costs.** Competitors list cost factors without prices (SolutioWeb gives wide ranges such as booking €500 to €3,000). Konaverse already publishes add-on prices on its service pages (observed, `service-pages.ts:261-264, 386-391, 533-537, 659-661, 784-788`). The post's "What moves the price" list has none.
- **Depth gap: why a higher price.** The post does not explain €1,200 against the €200 to €600 one-page band, or €2,500 against the €450 to €1,000 packages.
- **Depth gap: running costs.** Rivals quote monthly support (€39 to €500 a month) or yearly renewals. The post gives €300 or €600 a year, but omits the 3D figure (€400, or €700 with a CMS) and what the domain costs (at cost).
- **Quality gap: dates and VAT.** One rival states VAT and one shows an update date. Konaverse can do both: VAT once the owner answers, the update date by setting `updated`.
- **Questions the post does not answer (from PAA, observed in JSON):**
  - "How much does it cost monthly to own a website?" Answer in yearly terms (owner decision: never monthly).
  - "How much do web designers usually charge?" Use the Clutch hourly bands, plus Konaverse's own rate if the owner publishes it.
  - "How much is a 20 page website?" (September PAA, `keyword-research/serp-autopsy.md:36`) is answerable with the extra-page price once the owner confirms it.

### The market range to add

Proposed table for the new section. **Every figure must be re-read on the day of writing and dated with that day.** These are the figures as read on 22 October 2026 (measured from the pages listed).

| Type of website | What Cyprus studios publish | Who publishes it |
|---|---|---|
| One-page or landing page | about €200 to €600 | AA Webstudio, landing pages €200 to €600 (published 24 June 2026); own offers of €497 (UltimateWorkz), €499 (BYPANIK, updated August 2026) and from €500 (VITP Group) |
| Small website from a template or package | about €450 to €1,000 | WebSEO €450 (template, up to five pages) and €800; BYPANIK €749 (up to five pages); Cyprus WebPages €600 to €1,000 before VAT |
| Custom or professional business website | about €1,500 to €6,000 | Market ranges from SolutioWeb (€1,500 to €5,000, March 2025), DomainStar (€2,000 to €5,000, April 2026) and Maclee Designs (€2,500 to €6,000, undated) |
| Online shop | from about €1,000 to €15,000 and more | BYPANIK from €1,049; WebSEO from €1,100; DomainStar €5,000 to €15,000+ |
| Hosting and upkeep | €80 to €325 a year where sold yearly; €39 to €500 a month where support is sold monthly | DomainStar, Cyprus Digital Agency, Cyprus WebPages (yearly); BYPANIK, SolutioWeb, Maclee Designs (monthly) |

Notes for the writer:
- **Say what kind of figures these are.** Use one sentence: none of these pages cites a survey, and each figure is the firm's own price or its own estimate. We found no independent price survey for Cyprus (measured: 0 of 10).
- **Add the Clutch lens as one short paragraph** (measured, 34 profiles read, US dollars, self-reported in Clutch's fixed bands):
  - Minimum project size: 18 firms state $1,000+, 6 state $5,000+, 6 state $10,000 or more (one of them $50,000+), and 4 state none.
  - Average hourly rate: 16 state $50 to $99, 8 state $25 to $49, 1 states under $25, and 9 state none.
  - The point it makes (inferred): the firms on Clutch's Cyprus list, which ranks in every web design SERP, mostly sit at or above Konaverse's prices, while the price posts that rank for the cost query mostly sit below them.
- **No 3D row.** None of the extracted Cyprus price lists has a 3D or WebGL tier (observed from the extractions, not a full-text search). Say so and link the 3D cost post when it is live.
- **Name every source, and link it if the owner agrees** (owner input 7). Do not reprint the €150 figure: no page we read publishes it.
- **Do not judge rivals' quality in the article.** The voice guide rules out adversarial claims about competitors. Describe what each price includes, as the live post already does for the €800 offers.

### Winning Outline

**H1:** How much does a website cost in Cyprus in 2026? (keep; it is the question form of the primary keyword)
**URL Slug:** /blog/website-cost-cyprus (keep)
**Target Word Count:** about 1,800 to 1,950 words (competitor average about 850). The extra length is two tables and the price reasoning, not padding. Length is not a ranking target (voice guide).

**The first 30% (about 570 words) must hold the quotable answer.** The opening field (60 words), the market section (280) and the price table (170) total about 510 words, so all three sit inside it. Passage rules (inferred editorial choices; Google requires no special format):
- Each H2 opens with a self-contained sentence that names Cyprus, the year and the number, so the sentence still makes sense when lifted alone.
- Every table has a caption (the schema requires one).
- No section opens with "this" or "here".

**Opening answer** (Sanity `answer` field; replace it). About 60 words. FS target. Must contain the market range, the month of the reading, and Konaverse's three starting prices. Model wording, for the writer to adjust once the figures are re-read:

> Cyprus web studios that publish their prices quote, in October 2026, about €200 to €600 for a one-page site, €450 to €1,000 for a small template or package website and €1,500 to €6,000 for a custom business website. Our own starting prices are €1,200 for one page, €2,500 for a five-page website designed and built, and €6,000 for a 3D website.

Keyword: primary in the first sentence ("web studios ... Cyprus ... prices" plus the H1). Body: no further repetition.

**H2 1 (ADD): What websites cost in Cyprus in 2026** (~280 words). FS target: the market table.
- Format: one lead sentence with the range and the date, then the market table above with linked sources, then the "what these figures are" sentence and the Clutch paragraph.
- Keyword: use "website cost" or "website prices in Cyprus" in the H2. Body: mention "web design prices" once.

**H2 2 (KEEP, retitle): Our prices, in one table** (~170 words; keep the anchor `#prices`).
- Retitle because the market section now owns "Website prices in Cyprus". In the Studio, edit the existing heading block so its key stays.
- Keep the table and the €2,500 explanation.
- Link each row's type to its service page inside the table cell. Cells accept `[label](/path)`, which `rich()` renders (`page.tsx:119`).
- Add one line placing the tiers in the market: €1,200 and €2,500 sit above the package band and inside the custom band.
- Keyword: secondary "website design prices" in the caption. Body: none required.

**H2 3 (STRENGTHEN and MERGE): What moves the price, and by how much** (~300 words; keep `#what-moves-the-price`). FS target: the table.
- Turn the five bullets into a three-column table (Driver | What it adds | From).
- Use the add-on prices already published on the service pages (observed). Each must be confirmed current by the owner (owner input 1):

  | Driver | Published figure (source) |
  |---|---|
  | Extra page | from €150 designed (web design), from €150 built (web development), from €250 designed and built (redesign); on the €2,500 combined tier, see owner input 2 |
  | Copywriting | from €100 a page; from €200 for a one-page site |
  | CMS | from €500 |
  | Second language | from €500; from €300 on a one-page site |
  | Bookings or payments | €400 to €800; bookings on a one-page site from €300 |
  | Blog | from €300 |
  | Other integrations | from €200 each |
  | Content migration | from €30 a page beyond the first twenty |
  | Extra design round | €200 |
  | 3D | extra scene from €800; product modelling from €600 |

- Keep the migration sentence and its link to the redesign post.
- Merge in two sentences from the draft: that a fixed deadline and slow approvals move the timeline, and that "client supplies content" should name what you supply and when.
- If the owner confirms the extra-page price, answer "How much is a 20 page website?" in one worked line, labelled as an example.
- Keyword: secondary "website cost" in the body once.

**H2 4 (ADD, absorbs "Is a €1,200 one-page website enough?"): Why our one-page website starts at €1,200** (~280 words; keep `#one-page-or-full-site`). See the justification section below.
- H3 What €200 to €600 usually buys
- H3 When one page is enough (keep the Los Santos and Velricon paragraphs)
- Keyword: secondary "one page website cost" in the H2 or the first sentence. Link `/services/one-page-websites` (matrix row 23).

**H2 5 (KEEP, light edit): What an €800 website leaves out** (~180 words; keep `#cheap-websites`).
- Date the reference: the September 2026 ads quoted from €800.
- Keep the template-versus-custom table and "The honest version" callout.
- When the February template-or-custom piece is live, link it from the table (matrix row 28).

**H2 6 (KEEP, small addition): What SEO costs in Cyprus** (~130 words; keep `#seo-cost`).
- Keep €500 for the audit and from €300 a month with a three-month minimum.
- Add the published market figures as one sentence with sources (Maclee Designs: local SEO retainers "often start around EUR 600 per month"; SolutioWeb: SEO €300 to €2,000).
- Link `/services/seo`.

**H2 7 (STRENGTHEN): What you pay after launch** (~150 words; keep `#running-costs`).
- Open with a yearly figure. This answers the PAA "How much does it cost monthly to own a website?" without a monthly price (owner rule).
- Hosting: €300 a year, €400 for a 3D site, and a CMS adds €300 to either (`service-pages.ts:23-24`, `HOSTING` at `:1000`). The live post omits the 3D figures.
- Domain: at cost, in your name. Changes after launch: quoted.
- One sentence on how rivals sell upkeep (monthly support from €39, or yearly renewals of €250 to €325), with sources.

**H2 8 (MERGE from the draft): Freelancer or studio?** (~120 words).
- Keep the draft's balanced view: a capable freelancer fits a focused brief, and a team fits coordinated work.
- Answer "How much do web designers usually charge?" with the Clutch hourly bands and Konaverse's own rate if the owner publishes it (owner input 3).

**H2 9 (STRENGTHEN and MERGE): How to compare two quotes** (~200 words; keep `#compare-quotes`).
- Merge the live post's five questions with the draft's comparison table into one table of about eight rows (Question | Why it changes the price):
  1. Pages included, and the price of one more.
  2. Made for us, or a theme?
  3. Who owns the domain, hosting and code at launch?
  4. Designed for the phone?
  5. What happens to our current URLs?
  6. Who writes and enters the content?
  7. What can our team edit after launch, and what do changes cost?
  8. Before or after VAT, and which third-party fees are extra?
- Close with the draft's "agree on what counts as complete" in two sentences.

**Close** (~50 words): a concrete action (send two quotes through the table), then the existing service card to `/services/web-design`. Add "Until next time." only if the byline moves to Konstantinos; it is his sign-off (owner input 5).

### The one-page €1,200 justification against €150 to €500

The one-page SERP (`one page website cyprus`) opens with an AI Overview stating "€150 to €500". Three organic snippets lead with €497, €499 and €450 (measured, JSON).

**Our price sits well above that** (observed): €1,200 is 2.4 times the €500 most offers cluster at, and it is the highest one-page price on that SERP.

**What the low offers include, from their own pages (observed):**
- WebSEO calls its €450 starter "template-based".
- UltimateWorkz's €497 one-pager launches in 7 days and includes a logo, colours and fonts plus 100 business cards. It does not say whether the design is a template, or whether hosting and the domain are included.
- BYPANIK's €499 covers one page of up to five sections with basic local SEO.
- VITP Group's landing page is "from €500", for "advertising campaigns and promotions".
- Be fair in the copy. Some of these offers include more than a page (the branding and business cards), and for a campaign page they can be the right buy.

**What Konaverse's €1,200 buys (observed, `service-pages.ts:633` and the process at `:654-656`):**
- One page of six to eight sections, designed for the business at desktop and phone size, not templated.
- A 2-day brief that ends in the page outline and a quote.
- A week of design with one round of feedback.
- A week of build and launch with analytics and a contact route that works.
- Live in two to three weeks.
- The domain, hosting account and code in the client's name (the live post's own table).
- Hosting €300 a year after launch.

**The arithmetic that would make it concrete (owner input 3):**
- A code comment records "the studio's ~€50 hour (a €2,000 site in ~40 hours)" (`service-pages.ts:127-128`). That would put €1,200 at about 24 hours of work, and a €450 to €500 page at about 9 to 10 hours (inferred arithmetic).
- Publish this only if the owner confirms the rate and the hours. The €2,000 example in the comment predates the €2,500 price.

**Proposed FS sentence (40 to 60 words, to adjust):**

> A one-page website in Cyprus usually costs €450 to €500 when it starts from a template and launches in about a week. Ours starts at €1,200 because the page is designed for your business at desktop and phone size, built from scratch, and handed over with the domain, hosting account and code in your name.

Keep "When one page is enough" (Los Santos is one page, Velricon needed nine) as the H3 that tells the reader when the cheaper or the dearer option is right. When the August 2027 "Is a one-page website enough?" piece exists, cut that H3 to two sentences and link it (cluster file, row 5 and matrix row 26).

### What to merge from `web-design-agency-pricing`, and what to drop

The cluster file says merge and do not publish the slug (row 1, high duplication). The draft was never imported to Sanity (blog handoff), so there is no URL to redirect (inferred from the handoff's import list).

**Merge:**

| From the draft | Into |
|---|---|
| "What moves a website above its starting price?" H3s: page types, content and assets, CMS and languages, integrations, motion and 3D, migration and deadlines | H2 3, as table rows with the published add-on prices. The draft declined to give figures; the service pages now publish them |
| "How to compare two agency proposals fairly", the 7-row table | H2 9, merged with the live post's five questions into one table |
| "Should you hire a freelancer or an agency?" | H2 8, shortened to about 120 words |
| "Agree on what counts as complete" | Last two sentences of H2 9 |
| "VAT treatment and third-party charges" (one line) | A row in the H2 9 table |

**Drop:**

| From the draft | Why |
|---|---|
| "Konaverse's starting website budgets" and its tier table | It duplicates the live table, which is the cannibalisation the cluster file found |
| "Hosting and maintenance baseline is €40 per month, or €90 per month with a CMS" | Obsolete since 14 October: hosting is yearly, never monthly |
| The Vercel usage-billing paragraph | Konaverse hosting is a flat yearly fee, so the paragraph raises a worry the reader does not have |
| The W3C accessibility planning paragraph and "What a professional agency fee should cover" | Generic; no Konaverse number or decision behind them (substance rule) |
| Links to `/blog/headless-cms-disadvantages` and `/blog/why-custom-websites-are-expensive` | Neither URL is live. Add the February template-or-custom link when it is published |
| The draft's opening, title, meta and slug | The live post's H1, slug and URL stay |

Afterwards, mark Article 6 as merged in the planner and the writing handoff (AGENTS.md: update both after each completed article).

### Recommended Meta Tags

The root layout appends " | Konaverse" (`src/app/layout.tsx:77`). The Sanity `metaTitle` field holds only the part before the pipe. The current title renders at 74 characters (observed) and the description at about 210 (audit C6).

**Title**
Website Cost in Cyprus 2026: What Studios Charge | Konaverse  (60 characters rendered)
Alternative: Website Cost in Cyprus (2026): Prices Compared | Konaverse  (58)

**Meta Description**
What a website costs in Cyprus in 2026: the range local studios publish, our prices from €1,200 and what each extra adds. Compare before you sign.  (146 characters)

**Image alt text:** the cover's alt is "Graphic of a Modern UI Design Workspace " (observed, trailing space, no topic). Write an alt that describes the actual image. If the owner adds a chart of the market table (a real data graphic, optional), its alt carries the keyword, for example "Website cost in Cyprus, October 2026: published price ranges by type of website".

### Unique Angle and Information Gain

This would be the only page ranking for the Cyprus cost queries that puts a market range and a studio's own price list side by side, with each market figure linked to the firm that publishes it and dated to the day it was read. It would also be the only one to read Clutch's Cyprus list (34 firms' minimum project sizes and hourly bands), and the only one to price each driver (an extra page, a CMS, a second language, bookings, migration) from a real published list, not a range like "€500 to €3,000". It answers the question the AI Overview answers, the market range, and then the question no ranking page answers: why one studio sits above that range, in hours and inclusions, with the cases where the cheaper option is the right one.

### E-E-A-T Requirements

- **Byline:** a named author with a visible bio (exists). Keep Nabil Al Jbawi or move it to Konstantinos Kyprianou (owner input 5). The refresh's new sections are studio facts in the "we" voice the post already uses; do not attribute personal memories to either founder.
- **Source lines:** every market figure links to its source next to the claim, with the date it was read. The Clutch figures carry "ratings updated 21 October 2026, read [day]".
- **The template footer must change before publication.** `page.tsx:347-348` prints "Every number in this article is from our own projects or price list; where we do not have a figure, we say so." on every post. After the refresh that sentence is false, because the market figures belong to other firms. This is a small code change; it needs the owner's instruction. A per-post line, or "Our prices are from our price list; other firms' figures are linked to their source and dated", would fix it.
- **Visible update date:** set Sanity `updated` (Last meaningful edit) to the day the refreshed content is published. Do not backdate it to 14 October and do not use the drafting date. The template then shows "Updated [date]" beside the published date (`page.tsx:261-267`). It also writes `dateModified` and `og:modifiedTime`, and the sitemap `lastmod` follows (`sitemap.ts`, posts entry). This closes audit B7.
- **VAT:** state whether prices include VAT (owner input 4). One rival does; the reader needs it to compare quotes.
- **Price parity:** every Konaverse price in the post must equal `service-pages.ts` on the publish day. The `HOSTING` comment (`service-pages.ts:992-999`) lists the cost article among the places to change together; the local import copy in `src/lib/blog-posts.ts` is on that list too.
- **No invented outcomes:** keep the existing footnote style for anything unmeasured. Label the 20-page worked example as an example.

### Internal Linking Opportunities

The post is the cluster 8 hub (cluster file). It links out to its spokes and the service pages, and the service pages link back to it.

**Outbound, in the body:**

| Anchor | Target | Where | Source |
|---|---|---|---|
| one-page website design | /services/one-page-websites | H2 4 | matrix row 23 |
| website redesign | /services/website-redesign | redesign row of the price table | matrix row 22 |
| what goes into a 3D website's price | /blog/how-much-does-a-3d-website-cost | 3D row, once that post is published; until then /services/3d-websites | matrix row 7 |
| web design / web development | /services/web-design, /services/web-development | their rows in the price table | inferred |
| SEO in Cyprus | /services/seo | H2 6 | inferred |
| Chris N Clean | /work/chris-n-clean | the second-language row, as the bilingual build (`case-studies.ts:668`, "four services in two languages"); also add it to the `studies` field | inferred |
| Keep: how we redesign a site without losing its rankings | /blog/redesign-website-without-losing-seo | H2 3 | existing |
| Keep: Los Santos Barbershop, Velricon | /work/los-santos-barbers, /work/velricon | H3 When one page is enough | existing |

Planned links, added when those pages are live: matrix row 26 (the August one-page piece) and row 28 (the February template-or-custom piece).

**Inbound.** These are code changes on other pages, outside this brief, for the owner to schedule. Today only /services/web-design, the homepage and /blog link to the post (measured in the audit HTML).
- `/services/one-page-websites` → the post, anchor "what a one-page website costs in Cyprus".
- `/services/website-redesign` → the post, anchor "website prices in Cyprus".
- The 3D cost post → the post (matrix row 8, in draft).

### Publishing mechanics (for whoever enters it)

- **Edit the published document in the Studio.** `import-draft` skips existing slugs (`sanity-blog.md`). Edits create a draft of the published post; nothing changes on the site until Publish.
- **Edit existing heading blocks** to keep their keys, which are the anchors. New H2s get generated keys.
- **Tables:** captions are required. Cells take `[label](/path)` links.
- **Set `updated` on the publish day** (above).
- **After publishing:** request indexing in Search Console, and submit the URL with the IndexNow tool added in commit b148871.
- **Then** update the content planner and the writing handoff.
- **Timing (owner's call):** the ten-month plan schedules this refresh for March 2027 and waits for the owner's per-driver increments (`content-plan-2026-11-to-2027-08.md:83`). Those increments are already published on the service pages. The audit puts B7 in Phase 2. So the refresh can run whenever the owner answers the questions below.

### Owner inputs for Brief 1

1. **Add-on prices.** Are the add-on prices on the service pages current, and may the post restate them? The code comment says "the owner reviews each number" (`service-pages.ts:126-129`).
2. **Extra page on the €2,500 tier.** What does one extra page cost on the €2,500 designed-and-built tier: €250 (as on the redesign and 3D pages) or €150 plus €150? This decides the 20-page example.
3. **Hourly rate.** May the studio's rate (about €50 an hour in the code comment) and the hours behind the €1,200 page be published? If not, the justification uses scope and timeline only.
4. **VAT.** Are Konaverse prices before or after VAT? Is the studio VAT-registered?
5. **Byline.** Keep Nabil Al Jbawi, or move it to Konstantinos Kyprianou (who also signs "Until next time.")?
6. **Footer sentence.** Approve the change to the hardcoded footer sentence in `page.tsx:347-348` (code).
7. **Linking rivals.** Name and link competitors' price pages as sources, or name them without links? Naming is required for a sourced range. Linking lets readers check it.
8. **Clutch profile.** What do Konaverse's own Clutch fields say (minimum project size, hourly rate)? They should agree with the article (audit A4 already asks for a Clutch clean-up).
9. **Images.** A new alt text for the cover, and whether to add a chart of the market table.
10. **Timing.** Now (B7, Phase 2) or March 2027 (the plan).

---

# Brief 2: a Greek-language article on website cost in Cyprus

## Content Brief: κατασκευή ιστοσελίδας τιμές κύπρος (new page)

### Search Intent

The same commercial investigation as Brief 1, asked in Greek by a Cyprus business owner. On `κατασκευή ιστοσελίδας τιμές κύπρος` (measured, JSON):
- 9 results: 4 blog posts, 3 pricing pages and 2 service pages. All nine are in Greek.
- No local pack, no PAA, no ads (at night).
- An AI Overview: "EUR 450 to 1,000 for simple or business sites, more for e-shops", citing webseo.cy, teraburn.com and bypanik.tech.
- It shares 0 URLs with the English cost queries, so the English post cannot reach it (measured, `services-cyprus.md` 1c).

**Why a Greek article before a Greek service page (observed, `services-cyprus.md` section 3):** 3 of the 4 blog posts on this SERP are Greek versions of English cost posts by firms that also rank in English (webseo, solutioweb, bypanik; devitus is marked as a fourth). The cost post is the Konaverse page proven in English, and the price SERP is a blog SERP.

### Target queries

| Query | Role | Evidence |
|---|---|---|
| κατασκευή ιστοσελίδας τιμές κύπρος [website building prices Cyprus] | Primary | Measured SERP (JSON). Autocomplete with `hl=el&gl=cy` returned "…τιμεσ κυπροσ" on 3 October (`seo-plan-q4-2026.md:86`). Keyword Planner: no data |
| κόστος κατασκευής ιστοσελίδας κύπρος, κόστος ιστοσελίδας [cost of building a website] | Secondary | Unmeasured. Two ranking slugs use it (webseo `κόστος-σχεδιασμού-ιστοσελίδας-κύπρο`, solutioweb `…κόστ…`, observed) |
| πόσο κοστίζει μια ιστοσελίδα στην κύπρο [how much does a website cost in Cyprus] | Secondary, question form | Unmeasured. BYPANIK's Greek H1 (observed) |
| ιστοσελίδα μίας σελίδας τιμή [one-page website price] | Secondary | Unmeasured |
| δίγλωσση ιστοσελίδα, ιστοσελίδα στα ελληνικά και αγγλικά [bilingual website] | Secondary, the Greek-market angle | Unmeasured. The AI Overview for `web design nicosia` names bilingual Greek and English as a local requirement (observed, JSON gist) |
| σχεδιασμός ιστοσελίδων κύπρος, κατασκευή ιστοσελίδας κύπρος [web design / building Cyprus] | Interlink only, do not target | The service SERP: homepages and service pages (measured). It belongs to the future Greek service page |

Greek inflects (κατασκευή and κατασκευής, ιστοσελίδα and ιστοσελίδας and ιστοσελίδων, Κύπρος and Κύπρο), and searchers often type without accents ("κατασκευη ιστοσελιδασ κυπροσ" in autocomplete). Write correct, accented, naturally inflected Greek. Do not force exact-match strings (inferred). Volume is unmeasured for every Greek term; the only demand evidence is that the autocomplete exists.

### Competitor Analysis

The 9 results for the primary query. No excluded domains. Scores are my judgement (inferred), from the extracted text.

| # | URL (position) | Key H2 sections (gloss) | Est. words | Score | Main gap |
|---|---|---|---|---|---|
| 1 | webseo.cy/el/κόστος-σχεδιασμού-ιστοσελίδας-κύπρο/ (1st; AI Overview cited) | Τυπικές τιμές [typical prices]; γιατί διαφέρει [why it varies]; πρότυπο vs προσαρμοσμένος [template vs custom]; πακέτα WebSEO [packages]; αξίζει ο φθηνός; [is cheap worth it?] | ~800 | 21/40 (4/6/6/5) | Own packages (€450 template, €800, €1,100) called "typical prices", and "lower than usual market prices" with no data. No date, no VAT |
| 2 | oncypruswebdesign.com/el/packages (2nd) | Πακέτα & Τιμές [packages and prices] | ~1,000 | 17/40 (4/4/4/5) | Own packages before ΦΠΑ [VAT], yearly renewals, €75 per working hour. No answer sentence |
| 3 | devitus.com/el/blog/website-cost-cyprus (3rd) | Not readable: no article body was returned (inferred: rendered client-side) | n/a | not scored | Ranks 3rd although a fetch sees no body, which suggests Google renders it (inferred) |
| 4 | iwp.com.cy/web-development-cyprus-greece/ (4th, service page) | Not fetched | n/a | not scored | |
| 5 | jcsl.com.cy/kataskeyh-istoselidas-times-prosfora/ (5th) | Προσφορά [offer]; στα μέτρα σας [tailored]; σχέση ποιότητας και τιμής [value for money] | ~275 | 15/40 (2/3/5/5) | No prices at all. Review stars 4.9 (81) in its snippet. Mentions the state subsidy of up to 50% |
| 6 | foryoudigitalsolutions.com/el/services/web-design-cyprus/ (6th, service page) | Not fetched | n/a | not scored | |
| 7 | teraburn.com/pricing (7th; AI Overview cited) | Not fetched | n/a | not scored | |
| 8 | solutioweb.com/el/κατασκευή-ιστοσελίδων-στην-κύπρο-κόσ/ (8th) | Πόσο κοστίζει [how much]; πρότυπο ή custom; domain και φιλοξενία [hosting]; πρόσθετες υπηρεσίες [add-ons]; FAQ | ~800 | 21/40 (6/7/5/3) | A copy of the English estimates (March 2025). The page shows a broken contact-form error |
| 9 | bypanik.tech/el/website-cost-cyprus/ (9th; AI Overview cited) | Τρέχουσες τιμές [current prices]; μίας σελίδας [one page]; επαγγελματική [business]; ecommerce; domain, hosting, SSL; συντήρηση [maintenance]; τι SEO περιλαμβάνεται; FAQ | ~950 | 26/40 (6/6/7/7) | Own prices only (€499, €749, from €1,049, €39 or €59 a month). Has a direct answer and "Ελέγχθηκε και ενημερώθηκε τον Αύγουστο 2026" [checked and updated August 2026] |

Competitor average: about 765 words across the five readable Greek pages (estimated).

**Across the five readable pages (measured):**
- None cites a source.
- One states a check date (BYPANIK).
- One states VAT (Cyprus WebPages: "Οι τιμές δεν περιλαμβάνουν Φ.Π.Α." [prices exclude VAT]).
- Three have a visible switcher to an English twin (webseo, bypanik, solutioweb).

**Why they rank (inferred):**
- Each is a Greek page on a firm that ranks in English, and four of the five sit in an `/el/` folder.
- Each puts prices in Greek near the top.
- The field is thin: nobody explains a price, and nobody sources the market.

### Content Gaps and Opportunities

- **A sourced Greek market range.** Same gap as Brief 1, and the Greek overview's band (€450 to €1,000) leaves out everything above €1,000.
- **The bilingual site.** No Greek price page prices the second language. Cyprus Digital Agency (English) says bilingual "usually adds 20% to the total bill" (observed). Konaverse publishes "from €500, every page in two languages, each with its own address" (`service-pages.ts:388`), and has a bilingual build to show: Chris N Clean, "four services in two languages" (`case-studies.ts:668`, `:733`). This is the Greek article's own contribution.
- **The subsidy question.** JCSL mentions the state subsidy (observed). The official page for the 2025 call of the Σχέδιο Ψηφιακής Αναβάθμισης των Επιχειρήσεων [Digital Upgrade of Businesses scheme] states (measured, https://www.fundingprogrammesportal.gov.cy/call/sxedio-psifiakis-anavathmisis-ton-epixiriseon-2025/, read 22 October; no page date shown):
  - Grant: 50% of the eligible budget (70% in mountain and disadvantaged areas).
  - Budget: a minimum eligible budget of €5,000 per proposal, and a maximum grant of €50,000.
  - Status: submissions opened 20 May 2025, closed 21 May 2025, and the page is marked "Κλειστή" [closed].
  - Why it matters (inferred): a €1,200 or €2,500 website on its own would fall below the €5,000 minimum. That is a useful, honest answer to a question Greek buyers ask. It is conditional (owner input 6).
- **Why above €450 to €1,000.** The Greek justification must cover the five-page site too: €2,500 is 2.5 times the top of the Greek overview's band.
- **VAT and a check date.** As in Brief 1.

### Winning Outline (Greek headings, English glosses)

**H1:** Πόσο κοστίζει η κατασκευή ιστοσελίδας στην Κύπρο το 2026;
[How much does building a website cost in Cyprus in 2026?]
**URL Slug:** /el/blog/kataskevi-istoselidas-times-kypros (see URL pattern below)
**Target Word Count:** about 1,800 to 1,900 Greek words (competitor average about 765). The extra words are the bilingual section and the price reasoning.

Build it from the refreshed English post's facts, so the two versions agree when the hreflang pair goes live. Write it natively in Greek (who writes it is below). The structure follows Brief 1, plus one Greek-market section. The headings below are proposals for the Greek writer to adjust; the content notes are in English for that reason.

**Άμεση απάντηση** [direct answer], the Sanity `answer` field, 60 to 70 words. FS target.
- The market range in Greek with the month of the reading.
- Konaverse's three starting prices.
- One clause stating that a second language starts at €500.
- Primary keyword in its natural inflected form in the first sentence.

**H2 1: Τι χρεώνουν οι εταιρείες στην Κύπρο το 2026** [What firms in Cyprus charge in 2026] (~260 words). FS target: the table.
- The market table from Brief 1, in Greek.
- Link the Greek version of each source where one exists: webseo.cy/el, oncypruswebdesign.com/el/packages, bypanik.tech/el, solutioweb.com/el. Use the English pages for DomainStar, Maclee and AA Webstudio, which have no Greek twin (observed).
- The Clutch paragraph.

**H2 2: Οι τιμές μας, σε έναν πίνακα** [Our prices, in one table] (~170 words).
- The six tiers with timelines.
- Link each tier to its English service page. Say once that those pages are in English and that we work in Greek.

**H2 3: Τι ανεβάζει την τιμή, και πόσο** [What raises the price, and by how much] (~280 words). FS target: the driver table, as in Brief 1.

**H2 4: Γιατί οι τιμές μας είναι πάνω από τα πακέτα των 450 έως 1.000 €** [Why our prices sit above the €450 to €1,000 packages] (~250 words)
- H3 Ιστοσελίδα μίας σελίδας από 1.200 € [A one-page website from €1,200]
- H3 Ιστοσελίδα πέντε σελίδων από 2.500 € [A five-page website from €2,500]
- H3 Πότε αρκεί μία σελίδα [When one page is enough] (Los Santos, Velricon)
- Same evidence as Brief 1's justification. Fold in the "what a low price assumes" table from the English H2 5.

**H2 5: Ιστοσελίδα στα ελληνικά και στα αγγλικά: πόσο κοστίζει η δεύτερη γλώσσα** [A website in Greek and English: what the second language costs] (~250 words)
- From €500, or from €300 on a one-page site.
- Each language has its own address, explained in one plain sentence on why that matters for search (Google recommends separate URLs per language; see the documentation above).
- Who writes the second language (owner input 4).
- Chris N Clean as the bilingual example.
- Cyprus Digital Agency's 20% figure as the comparison. On €2,500, 20% is €500 (inferred arithmetic).
- Keyword: secondary "δίγλωσση ιστοσελίδα" [bilingual website] in the H2 or the first sentence.

**H2 6 (conditional): Υπάρχει επιδότηση για νέα ιστοσελίδα;** [Is there a subsidy for a new website?] (~120 words)
- Only with a primary source read on the writing day.
- If no call is open, write one honest paragraph on the 2025 terms (50%, €5,000 minimum eligible budget, closed in one day), or cut the section.

**H2 7: Τι πληρώνετε μετά την παράδοση** [What you pay after launch] (~140 words)
- €300 a year, €400 for a 3D site, and a CMS adds €300.
- The domain at cost. Changes quoted.
- Yearly, never monthly.

**H2 8: Πόσο κοστίζει το SEO στην Κύπρο** [What SEO costs in Cyprus] (~110 words)
- €500 audit; from €300 a month with a three-month minimum.
- Link `/services/seo`. Its English page already serves `seo κύπρος`, where 7 of 9 results are English pages (measured, `services-cyprus.md` section 2).

**H2 9: Πώς να συγκρίνετε δύο προσφορές** [How to compare two quotes] (~200 words)
- The eight questions from Brief 1, in Greek.
- Include the VAT question: Οι τιμές είναι με ή χωρίς ΦΠΑ; [Are the prices with or without VAT?]

**H2 10: Το επόμενο βήμα** [The next step] (~50 words)
- A concrete action.
- Link `/contact`. The page lists English and Greek (`contact/page.tsx:60`); say so in Greek.

### Konaverse prices and facts the article uses

All of these are observed in `src/lib/service-pages.ts` and the live post. Re-check them on the writing day.

| Fact | Value | Source |
|---|---|---|
| One-page website | from €1,200, 2 to 3 weeks | `service-pages.ts:625, 633` |
| Five-page website, designed and built | from €2,500, 4 to 8 weeks | `:204, :353` |
| Web design only / web development only | €1,800 each (4 to 6 weeks / 4 to 8 weeks) | `:204, :353` |
| Redesign | from €2,500, 4 to 8 weeks | `:757` |
| 3D website | from €6,000, 8 to 12 weeks | `:500` |
| SEO | audit €500; from €300 a month, three-month minimum | `:880` |
| Hosting | €300 a year; €400 for 3D; a CMS adds €300 | `:23-24`, `HOSTING` `:1000` |
| Domain; changes after launch | at cost, in your name; quoted | `RUNNING` |
| Add-ons | as in Brief 1, H2 3 (second language from €500, from €300 on a one-page site) | `:261-264, 386-391, 533-537, 659-661, 784-788` |
| Case studies | Los Santos Barbershop (one page, Nicosia); Velricon (nine pages); Chris N Clean (two languages, Nicosia, since 1992) | `case-studies.ts`, the live post |
| Languages | English and Greek | `contact/page.tsx:60, :79` |
| Base and phone | Nicosia, no street address; +357 96 273855 | `BRIEF.md` |

Format: Greek convention writes 1.200 € (thousands dot, symbol after); CLDR's Greek pattern is 1.200,00 €. Cyprus firms on this SERP write both "€450" and "450,00 €" (observed, webseo). The writer picks one form and uses it everywhere (owner input 5).

### Recommended Meta Tags

**Title**
Κατασκευή ιστοσελίδας: τιμές στην Κύπρο το 2026 | Konaverse  (59 characters rendered)
[Website building: prices in Cyprus in 2026]

**Meta Description**
Τιμές κατασκευής ιστοσελίδας στην Κύπρο το 2026: τι χρεώνουν οι εταιρείες, οι τιμές μας από 1.200 € και πόσο κοστίζει η δεύτερη γλώσσα.  (135 characters)
[Website building prices in Cyprus in 2026: what firms charge, our prices from €1,200 and what the second language costs.]

These are models for the Greek writer, who should rewrite them in their own words. Keep them under the same limits.

### Unique Angle and Information Gain

The only Greek page on this SERP that sources the market, dates its reading, states VAT, and explains why a studio charges more than the €450 to €1,000 packages. It also prices the thing every Cyprus business decides and no Greek price page prices: a site in Greek and English, with each language at its own address, from a studio that has built one (Chris N Clean). If a subsidy call is open when it is written, it would also be the only one to answer the subsidy question from the official call text.

### E-E-A-T Requirements

- **The byline is the person who wrote or line-edited every Greek sentence.** That person needs a Greek bio line. See "Who writes the Greek".
- **Sources:** the same linked, dated sources as Brief 1, preferring the Greek versions.
- **Dates:** set `updated` on the publish day. A "checked on" line, as BYPANIK has, is optional.
- **No machine translation without native review.** Google's spam policy lists "automated transformations like synonymizing, translating, or other obfuscation techniques" under scaled content abuse (spam policies, updated 2026-08-28). The plugin's QA reference treats unreviewed machine translation the same way.
- **The disclaimer footer** must be fixed (Brief 1) and translated.

### URL pattern

**Recommended (inferred): `https://kona-verse.com/el/blog/kataskevi-istoselidas-times-kypros`**
- **The `/el/` folder:**
  - All four Greek cost posts on this SERP use an `/el/` path (webseo, solutioweb, bypanik, devitus; observed).
  - Google lists a subdirectory as a standard structure for language versions (multi-regional doc).
  - It keeps every Greek URL behind one Search Console page filter, and gives the future Greek service page a home (`services-cyprus.md` gates it).
- **A Latin-letter slug:**
  - It stays readable when pasted into a message, where a Greek-letter slug becomes percent-encoded.
  - It carries the primary query in the transliteration Cypriots also type ("kataskevi istoselidas"; JCSL's slug is `kataskeyh-istoselidas-times`).
  - It is a distinct Sanity slug, so the Studio's slug uniqueness check needs no change.
- **Cost:** one new route (below).

**Alternatives:**
- `/blog/kataskevi-istoselidas-times-kypros`: no new route, but Greek and English posts share one path.
- `/el/blog/website-cost-cyprus`: the same slug as English, as BYPANIK and Devitus do. Simple to pair, but it needs a per-language slug uniqueness rule in the Studio.
- A Greek-letter slug (webseo, solutioweb): readable in the address bar, percent-encoded everywhere else.

The owner chooses (owner input 3, as `services-cyprus.md` already says for the Greek service page).

### Hreflang pair

Validated against the plugin's `seo-hreflang` checks and Google's localized-versions doc. Codes are ISO 639-1 language only: `en` and `el`. A region code adds nothing with one version per language; the Cyprus targeting is in the content (Cyprus, euros, local firms) (inferred). `x-default` points at the English post.

On **both** pages, in the `<head>`:

```html
<!-- English page: https://kona-verse.com/blog/website-cost-cyprus -->
<link rel="canonical" href="https://kona-verse.com/blog/website-cost-cyprus" />
<link rel="alternate" hreflang="en" href="https://kona-verse.com/blog/website-cost-cyprus" />
<link rel="alternate" hreflang="el" href="https://kona-verse.com/el/blog/kataskevi-istoselidas-times-kypros" />
<link rel="alternate" hreflang="x-default" href="https://kona-verse.com/blog/website-cost-cyprus" />

<!-- Greek page: https://kona-verse.com/el/blog/kataskevi-istoselidas-times-kypros -->
<link rel="canonical" href="https://kona-verse.com/el/blog/kataskevi-istoselidas-times-kypros" />
<link rel="alternate" hreflang="en" href="https://kona-verse.com/blog/website-cost-cyprus" />
<link rel="alternate" hreflang="el" href="https://kona-verse.com/el/blog/kataskevi-istoselidas-times-kypros" />
<link rel="alternate" hreflang="x-default" href="https://kona-verse.com/blog/website-cost-cyprus" />
```

**Checks:**
- **Self-reference:** each page lists itself.
- **Return tags:** each page lists the other. Google: "If two pages don't both point to each other, the tags will be ignored."
- **Canonicals:** each page's canonical is itself. Never point the Greek canonical at the English page.
- **URL form:** HTTPS on the apex with no trailing slash, matching the site's canonicals (the audit found single 308s for www and trailing slashes).
- **Indexability:** both pages return 200 and are indexable.
- **One method only:** HTML link tags via Next.js metadata, not in the sitemap as well. Google calls the three methods equivalent, with "no benefit in Search" to using more than one.
- **Next.js:** in `generateMetadata`, `alternates: { canonical, languages: { en, el, 'x-default' } }`. Confirm the `x-default` key against the installed Next 16 metadata types before relying on it.
- **Visible links between the two:** Google recommends "hyperlinks to other language versions of a page". Put a link in each article's meta row: "Διαβάστε το στα ελληνικά" on the English post and "Read it in English" on the Greek one. Never redirect automatically.
- **Language detection:** Google determines a page's language from its visible content: "We don't use any code-level language information such as lang attributes", and it does not use `hreflang` or `lang` to detect language (both docs). So `lang` below is for screen readers, browsers and other tools, and hreflang only pairs the two.

### What the site needs to publish one Greek article

Each item is observed in the code unless marked. All are code or schema changes that need the owner's instruction.

1. **Sanity schema** (`../studio-konaverse/schemaTypes/post.ts`). There is no language field today.
   - Add `language` (string, options `en` and `el`, initial `en`, required).
   - Add `translation` (reference to another post).
   - Then run `npm run typegen` and `npx sanity schemas deploy`, and `npm run deploy` for the Studio (`sanity-blog.md`).
   - In GROQ use `coalesce(language, "en")` so the three live posts need no backfill.
   - Type the slug by hand: `slug` sources from `title`, which would give Greek letters.
2. **Queries** (`src/sanity/queries.ts`).
   - Add `language` and `translation->{ "slug": slug.current, language }` to `POSTS_QUERY` and `POST_QUERY`.
   - Filter English surfaces to English posts: the /blog index, homepage cards, "More from the blog", the service-page backlinks Sanity feeds, and the RSS route. Otherwise a Greek title appears on English pages.
3. **Route.** With `/el/`, add `src/app/(v4)/el/blog/[slug]/page.tsx`, rendering the same article component, with `generateStaticParams` over Greek posts only. `/blog/[slug]` must `notFound()` for Greek posts and the new route for English ones, so one article never has two URLs.
4. **`lang`.**
   - `<html lang="en">` is hardcoded in the root layout (`src/app/layout.tsx:121`).
   - Recommended (inferred): `lang="el"` on the Greek post's `<article>`, because the nav, footer, cookie banner and closing Invitation stay English.
   - The plugin's machine-translation QA flags an `<html lang>` that does not match the body as High. Here that is a false positive: the chrome really is English.
   - Setting `<html lang="el">` would need a second root layout. Next.js reloads the full page when crossing root layouts, which would cut the authored page transitions the owner wants preserved (AGENTS.md). Revisit only if a Greek section grows.
5. **Metadata and schema** (`src/app/(v4)/blog/[slug]/page.tsx`).
   - `alternates.languages` as above, on both posts.
   - `inLanguage` from the post, not the hardcoded `'en'` (`:213`).
   - `openGraph.locale` `el_GR` for the Greek post (the default is `en_US`, `src/lib/site.ts:77`).
   - Optionally, `workTranslation` and `translationOfWork` on the pair (valid schema.org; no Google feature depends on them, inferred).
6. **Article strings.** The template hardcodes English, and each string needs a Greek equivalent keyed on the post's language:
   - Header and dates: "Published", "Updated", "minutes", "Reading time", the breadcrumb "Blog" and the contents label.
   - Closing blocks: "The service behind this article", "See …" (built as `See {label}`, `:307`), "Case studies in this article", "Written by", "More from the blog", and the disclaimer footer.
   - `longDate()` formats with `en-GB` (`src/lib/blog-posts.ts:452`); use `el-GR` for Greek posts.
   - Author role and bio come from the English `AUTHORS` (`blog-posts.ts:39-60`). Add a Greek role and bio for the Greek author.
   - Hide "More from the blog" on the Greek post, or mark it `lang="en"`.
7. **Font.** Manrope is loaded with `subsets: ['latin']` (`src/app/layout.tsx:20`). Google Fonts serves a Greek subset for Manrope (measured: the CSS API lists `/* greek */`). Check in a production build whether the Greek face is emitted; if not, Greek falls back to a system font. If `'greek'` is added, make sure it adds no preload, since performance work is on hold and the preload count was cut deliberately.
8. **Importer** (`../studio-konaverse/scripts/import-draft.mjs:78`).
   - `slugify` keeps only `a-z0-9`, so every Greek H2 key becomes an empty string: duplicate empty keys and broken contents anchors.
   - Before importing, add Greek transliteration or a fallback key, and read `language` and `translation_of` from the frontmatter. Alternatively, enter the article by hand in the Studio, which generates keys.
   - Set Greek `service_label` and `service_line` in the frontmatter (the defaults are English).
9. **Sitemap** (`src/app/sitemap.ts`). Posts map to `/blog/${slug}`; make the path follow the language. `lastModified` already follows `updated`. Add no hreflang here (one method).
10. **After publishing.**
    - Search Console URL Inspection for the Greek URL.
    - IndexNow for both URLs.
    - Watch Greek queries in Search Console with a page filter on `/el/`. There is no country-targeting setting to change (removed in 2022, per the hreflang skill).

**Order:**
1. Publish the refreshed English post.
2. Write the Greek post from it.
3. Ship the schema and template changes.
4. Publish the Greek post and add the `translation` reference on the English document in the same session.

Adding the reference does not change the English content, so it does not justify a new `updated` date (inferred).

### Who writes the Greek

Say this plainly to the owner. The site says the studio works in English and Greek (`contact/page.tsx:60`, `:79`; schema `availableLanguage`). But nothing on file shows a founder writing publishable Greek:
- All site copy is English.
- The three live posts are English.
- The thirteen drafts are English.
- The voice guide is calibrated on English samples only.

Whether Konstantinos Kyprianou, Andreas Kyriakou or anyone else writes Greek to a standard a client would read is an owner question. It is not an assumption this brief can make.

**Options, in order of preference (inferred):**
1. A founder who writes Greek fluently writes it from the refreshed English post's facts and signs it.
2. A founder drafts it and a native Greek editor line-edits it. The founder signs; the editor is credited if the owner wishes.
3. A machine or AI draft, rewritten sentence by sentence by a native-speaking founder who then signs it. This is acceptable only if that person truly rewrites it. Unreviewed output is the scaled-content-abuse case above.

**Whoever signs** must be able to take a Greek-speaking client's call about every number in it. They also decide the register; formal plural εσείς is the usual business form in Cyprus (inferred). Use standard Modern Greek, not dialect.

### Internal links

- **Outbound:** the six service pages, from the price table; `/work/chris-n-clean` and `/work/los-santos-barbers`; `/services/seo`; `/contact`.
- **The English twin** is linked via the meta-row language link.
- **Inbound:** the English post's language link. The Greek post's only internal inbound link is its twin, and it is in the sitemap. That is enough for discovery (inferred).
- **Later:** when the Greek web design page exists, the two link each other. The Greek page is the hub for `κατασκευή ιστοσελίδας κύπρος`; this article is its cost spoke.

### Owner inputs for Brief 2

1. **The writer.** Who writes the Greek, who reviews it, and whose name is on it?
2. **Timing.** Approve the code and schema work above (route, `language` and `translation` fields, template strings, importer fix, font check). Drafting authorises none of it.
3. **The URL scheme.** `/el/blog/kataskevi-istoselidas-times-kypros` (recommended), `/blog/kataskevi-istoselidas-times-kypros`, or the same slug under `/el/`.
4. **The second language.** Does "from €500" for a second language include writing or translating the Greek text, or only building it? Cyprus WebPages charges translation separately (€75 per 150 words, observed).
5. **VAT and format.** VAT (as in Brief 1), and the currency format (1.200 € or €1.200).
6. **The subsidy section.** Is a Digital Upgrade call open, and can Konaverse act as a supplier under it? Has any client used it? Without both, the section is one factual paragraph or is cut.
7. **Chris N Clean.** May Chris N Clean be named as the bilingual example? Its case-study facts are flagged as draft (audit B6, `case-studies.ts:23-25`).
8. **The Greek bio.** The Greek bio text for the author.

---

## What this data cannot show

- **Volume.** No SERP carries search volume. Keyword Planner returned no data for any Greek term, nor for `website cost cyprus` itself (`keyword-research/keyword-planner-raw.md:106, :272`).
- **Positions.** The cost post's 3rd place comes from one signed-in sample at night. Re-check signed out, by day, before quoting it.
- **Why the AI Overview chose its sources.** The citation reasons above are inferred from page content. The sources of the "€150" one-page figure and the four off-top-10 citations are unknown.
- **Unread pages.** mind-laboratory.com (403), devitus.com/el (no body), and iwp.com.cy, foryoudigitalsolutions.com and teraburn.com (not fetched) are unscored. Dates and hreflang were invisible to the fetch tool.
- **Clutch.** The 34 profiles are self-reported bands in US dollars, from most but not all of the page.
- **Outcome.** No brief can promise a citation, a ranking or a lead. The authority gap (audit section A) limits both pages whatever their content.
