# Service pages against the Cyprus results pages, 22 October 2026

Question: should Konaverse merge, keep or add service pages, judged by what Google shows searchers in Cyprus?

Data: 22 queries the brief asked for, plus 2 more (`website hosting cyprus`, `κατασκευή eshop κύπρος`), read from the owner's Chrome in Cyprus on 22 October 2026, about 02:50 to 03:15 local time. Raw records: [`serps-cyprus.json`](serps-cyprus.json). Overlap is computed on normalised organic URLs (protocol, `www.`, trailing slash and query string removed), using the thresholds in the claude-seo cluster methodology: **7 to 10 shared = one page, 4 to 6 = same cluster, 2 to 3 = interlink, 0 to 1 = separate**.

Labels: **measured** = a count from the SERPs above or a tool number already on file; **observed** = seen on a page, with the URL in the JSON; **inferred** = my judgement.

Caveats that apply to everything below:

- The owner is signed in. `pws=0` reduces personalisation but does not remove it. The two places Konaverse appears (the cost post at 3rd) need confirming from a signed-out session before anyone quotes them as positions.
- The run was at night. Nearly every firm in the local packs showed "Closed". Ads are scheduled and budget-capped, so the near absence of ads (3 of 24 queries) says nothing about how advertised these terms are by day. On 13 October, by day, `web design cyprus` carried four ads.
- One desktop sample per query. SERPs move daily. **No SERP carries search volume**; volume figures below come from the September Keyword Planner pull and the 13 October Semrush lookups.

---

## Decisions at a glance

| Page | Decision | One-line reason |
|---|---|---|
| /services/web-design | **Keep**, and make it the only Konaverse URL for the four head variants | 6 to 7 shared URLs among `web design / website design / web design agency / web design company cyprus` |
| /services/web-development | **Keep** (indexed). Merge only on the trigger below | 4 shared with `web design cyprus`: same cluster, below the merge line |
| /services/website-redesign | **Keep** (indexed) | 5 shared with web design, but redesign-specific questions and pages exist |
| /services/seo | **Keep** | 0 shared with any web design query; also serves the Greek `seo κύπρος` |
| /services/one-page-websites | **Keep** (indexed) | 0 to 1 shared with web design; 2 with the cost queries |
| /services/3d-websites | **Keep**, with no Cyprus target | `3d website cyprus` is 3D printing and heritage, no web studio |
| /services hub | **Keep as a hub**, drop `web design agency cyprus` as its target | that query is the web design SERP (6 to 7 shared) |
| Greek web design page | **Add one**, after /services/web-design is indexed | Greek and English SERPs share 0 URLs; every Greek result is a Greek page |
| Greek mirrors of the other five | **Do not add** | No Greek SERP for them, or English already ranks (SEO) |
| E-commerce page | **Do not add** | Separate SERP, but Konaverse sells no e-shops and has no e-shop build |
| Maintenance / hosting page | **Do not add** | Separate SERP aimed at maintaining other people's WordPress sites, and at hosting companies |

---

## 1. SERP overlap

### 1a. The six service queries (shared top-10 URLs, measured)

| | web design cyprus | web development cyprus | website redesign cyprus | seo cyprus | one page website cyprus | 3d website cyprus |
|---|---:|---:|---:|---:|---:|---:|
| **web design cyprus** | 10 | 4 | 5 | 0 | 1 | 0 |
| **web development cyprus** | 4 | 10 | 3 | 0 | 0 | 0 |
| **website redesign cyprus** | 5 | 3 | 10 | 0 | 0 | 0 |
| **seo cyprus** | 0 | 0 | 0 | 10 | 0 | 0 |
| **one page website cyprus** | 1 | 0 | 0 | 0 | 9 | 0 |
| **3d website cyprus** | 0 | 0 | 0 | 0 | 0 | 9 |

Reading (inferred from the thresholds): web design, web development and redesign form one cluster; none of the three pairs reaches the 7 that would make them one page. SEO, one-page and 3D are separate clusters.

### 1b. Variants and supporting queries (measured)

| Pair | Shared | Threshold reading | The shared URLs |
|---|---:|---|---|
| web design cyprus / website design cyprus | 7 | one page | cypruswebdesigners.com, natasalagou.com, clutch.co/cy/web-designers, oncypruswebdesign.com/en, themanifest.com/cy/web-design/agencies, qoboweb.com, webtheoria.com |
| website design cyprus / web design agency cyprus | 7 | one page | webtheoria, natasalagou, cypruswebdesigners, Clutch, qoboweb, Sortlist, The Manifest |
| website design cyprus / web design company cyprus | 7 | one page | |
| web design cyprus / web design agency cyprus | 6 | same cluster | |
| web design agency cyprus / web design company cyprus | 6 | same cluster | |
| web design cyprus / web design company cyprus | 5 | same cluster | |
| web design company cyprus / web development cyprus | 5 | same cluster | webtheoria, natasalagou, cypruswebdesigners, dlkcyprus, themanifest.com/cy/web-development/companies |
| web design cyprus / web development cyprus | 4 | same cluster | cypruswebdesigners, natasalagou, qoboweb, webtheoria |
| web design cyprus / website redesign cyprus | 5 | same cluster | cypruswebdesigners, bridgestudios.com.cy/services/web-design, paphoswebsitedesign.com/web-design-cyprus, qoboweb, webtheoria |
| seo cyprus / seo services cyprus | 5 | same cluster | Clutch SEO, adonisanastasiou.com, bridgestudios SEO page, Sortlist SEO, dlkcyprus.com/seo |
| seo cyprus / seo κύπρος | 5 | same cluster | seocyprus.com, Clutch SEO, bridgestudios SEO page, LinkedIn SEO jobs, dlkcyprus.com/seo |
| website cost cyprus / website design cyprus prices | 4 | same cluster | oncypruswebdesign.com/en/packages, solutioweb.com cost post, **kona-verse.com/blog/website-cost-cyprus**, aawebstudio.com cost post |
| one page website cyprus / either cost query | 2 | interlink | oncypruswebdesign.com/en/packages, aawebstudio.com cost post |
| web design cyprus / either cost query | 0 | separate | |

Sensitivity (measured): if the four directory domains are removed before scoring (Clutch, Sortlist, The Manifest, cypruswebdesigners.com), the head variants fall to 3 or 4 shared, web design / web development to 3, web design / redesign to 4. No decision below changes; the variants stay one cluster and still belong on one URL.

### 1c. Candidate pages against the existing ones (measured)

| Candidate query | Most shared with any existing service query | Reading |
|---|---:|---|
| ecommerce website cyprus | 0 (every query) | separate SERP |
| κατασκευή eshop κύπρος | 0 with `ecommerce website cyprus`; 2 with `κατασκευή ιστοσελίδας κύπρος` | separate from the English e-commerce SERP |
| website maintenance cyprus | 0 (every query) | separate SERP |
| website hosting cyprus | 1 (web design, redesign; both via paphoswebsitedesign.com/web-design-cyprus) | separate SERP |
| κατασκευή ιστοσελίδας κύπρος | 0 with every English query (2 shared domains with `web design cyprus`) | separate SERP |
| σχεδιασμός ιστοσελίδων κύπρος | 0 with every English query; **5** with `κατασκευή ιστοσελίδας κύπρος` | the two Greek head terms are one cluster |
| κατασκευή ιστοσελίδας τιμές κύπρος | 0 with both English cost queries | separate SERP |
| seo κύπρος | 5 with `seo cyprus` | same cluster as the English SEO page |
| web design nicosia | 1 with `web design cyprus` | separate SERP |
| web design limassol | 2 with `web design cyprus` | separate SERP (interlink at most) |
| κατασκευή ιστοσελίδων λευκωσία | 3 with `κατασκευή ιστοσελίδας κύπρος`, 0 with English | interlink with the Greek head term |

One fact explains the Greek zeros (observed): the same firms rank in both languages, but Google serves their Greek URLs to Greek queries. Web Theoria ranks `webtheoria.com/` in English and `webtheoria.com/el/` in Greek; oncypruswebdesign.com ranks `/en/` in English and `/` in Greek. A language version is a different result.

---

## 2. Decision table

### Existing service pages

**/services/web-design** (not indexed). **Keep.**
- Evidence (measured): `web design cyprus`, `website design cyprus`, `web design agency cyprus` and `web design company cyprus` share 5 to 7 URLs pairwise, three pairs at 7. Keyword Planner gives three of them the same range and the same bids (100 to 1K, €2.20 to €5.12), which suggests Google groups them (inferred). Semrush: `web design cyprus` 590 a month (13 October).
- Action (inferred): one Konaverse URL owns all four variants. Today the plan points two URLs at this SERP (/services/web-design and the /services hub). Section 5 sets out the open choice between this page and the homepage as that one URL.
- Do not point `web design cyprus prices` at this page, as plan line 84 does. It shares 0 URLs with `web design cyprus`, and the cost post already ranks for it (section 5).
- Still blocked by indexing, not by the SERP. The audit's lever (an external link to this URL) stands.

**/services/web-development** (indexed). **Keep. No merge now.**
- Evidence (measured): 4 shared with `web design cyprus`, 4 with `website design cyprus` and `web design agency cyprus`, 5 with `web design company cyprus`. Same cluster, never 7. Its SERP has an intent the design SERP lacks: LinkedIn jobs (6th), CyprusWork jobs (10th), and an AI Overview that ends by asking whether the reader wants to hire or find a job. Semrush 20 a month against 590 for design (13 October).
- Why keep (inferred): it is one of only three indexed service pages, and it has its own substance (the Next.js stack, CMS, integrations, Core Web Vitals targets, four build answers from TDK, Chris N Clean and HEIMAT). Redirecting an indexed URL into an unindexed one on a 4-URL overlap is a bet on a threshold the data does not meet.
- Merge trigger (inferred): after 90 days of Search Console data, if both pages take impressions for the same web design queries and swap positions, merge.
  - **308** `/services/web-development` → `/services/web-design`.
  - **Content that moves:**
    - the stack paragraph (Next.js, server-rendered, Vercel);
    - the six deliverables (technical plan, staging site, CMS you can edit, tested on real devices, forms that land, a codebase you own);
    - the four build answers (TDK editor, Chris N Clean forms, HEIMAT pre-rendered HTML, phone-measured frame counts);
    - the build price and timeline (€1,800, four to eight weeks);
    - the "keep your Shopify or WordPress site if it works" note.
  - **Also update:** internal links, the sitemap, the Service node and `hasOfferCatalog`.

**/services/website-redesign** (indexed). **Keep.**
- Evidence (measured): 5 shared with `web design cyprus`. Google fills `website redesign cyprus` mostly with web design pages because few redesign pages exist. Only three results in its top 10 are about redesign: Sortlist's redesign category (4th), DomainStar's redesign guide (5th), Bevisible's redesign SEO checklist (10th). Its People Also Ask asks "How much does it cost to have a website redesigned?" and "How do I redesign my website?". The AI Overview lists "SEO & URL preservation" with 301 redirects as a step (observed), the subject of the page and of /blog/redesign-website-without-losing-seo.
- Action (inferred): keep it as a spoke of the web design cluster, link both ways with /services/web-design and the redesign post, and add "Cyprus" to its title and H1 (audit C7).

**/services/seo** (not indexed). **Keep.**
- Evidence (measured): 0 shared with every web design, development, redesign, one-page and 3D query. `seo cyprus` and `seo services cyprus` share 5, so one page serves both. `seo κύπρος` shares 5 with `seo cyprus`, and 7 of its 9 results are English pages shown with "translate this page" (observed), so the English page can serve the Greek query. Service pages take 4 to 6 of 10; exact-match domains hold 1st and 2nd for `seo cyprus`.

**/services/one-page-websites** (indexed). **Keep.**
- Evidence (measured): 1 shared with `web design cyprus`, 2 with each cost query; interlink with the cost post. The SERP is about price. The AI Overview opens with "a one-page website in Cyprus typically costs between €150 and €500". Three organic snippets lead with a price: €497 (ultimateworkzcy.com), €499 (bypanik.tech), €450 (webseo.cy, as a price rich result).
- Note (observed): Konaverse's one-page price, from €1,200 (`service-pages.ts:625`), is above every one-page price shown on this SERP. The page has to say why within its first lines (inferred). Audit C7 already re-points it to the price question.

**/services/3d-websites** (not indexed). **Keep, no Cyprus target.**
- Evidence (measured): `3d website cyprus` shares 0 URLs with anything. Its results are two 3D printing shops, a digital heritage site, an architectural renderer, a Visit Cyprus diving page, and three directory listings for a Paphos firm named "3D Web Solutions". No 3D web studio appears, and no local pack.
- Reading (inferred): there is no local search for this service. The page's target stays the international niche term (13 October record, audit C7: "3d website design agency").

**/services hub** (indexed). **Keep as the hub; stop aiming it at `web design agency cyprus`.**
- Evidence (measured): `web design agency cyprus` shares 7 with `website design cyprus` and 6 with `web design cyprus`. Its top 10 is 6 firm homepages and 4 directories, with no hub page and no service page. Aiming the hub there makes it compete with /services/web-design for one SERP (inferred).

### Candidates

**Greek web design page** (`κατασκευή ιστοσελίδας κύπρος` + `σχεδιασμός ιστοσελίδων κύπρος`). **Add one page, gated.**
- Evidence (measured):
  - It shares 0 URLs with every English query.
  - Across the four Greek web design queries with a Cyprus or Nicosia modifier, plus the Greek e-shop query, 48 of 48 results are Greek-language pages. (`seo κύπρος` is the exception, below.)
  - The two Greek head terms share 5, so one page covers both.
  - Directories are nearly absent: one cyprusatlas listing at 10th on one query, against 3 to 4 directory slots on every English head variant.
- Why one page and not two (inferred): Greek uses κατασκευή for design and build alike, so one Greek page stands for web design and web development together.
- Gates (inferred):
  - Add it after /services/web-design is indexed and has an external link.
  - Write it in Greek by hand, not machine-translated.
  - Pair it with the English page by hreflang.
  - The owner chooses the URL scheme.
- Before the service page, the cheapest Greek test is a Greek version of the cost post (section 3).

**Greek mirrors of the other five service pages.** **Do not add.**
- SEO: the English page already ranks for the Greek query.
- Redesign, one-page and 3D: no Greek query was tested and there is no Greek demand evidence for them.
- Web development: covered by the one Greek page above.
- Full reasoning under the quality gates in section 4.

**E-commerce page.** **Do not add.**
- For: `ecommerce website cyprus` shares 0 with every existing query, so only its own page would rank. The shape suits a service page: 4 of 9 results are agency e-commerce pages (avocadots, Absolute Websites, Bevisible, Ruxbo), and 7 of 10 on the Greek `κατασκευή eshop κύπρος`. Keyword Planner: 10 to 100 for both `ecommerce website cyprus` and `eshop development cyprus`.
- Against (observed): Konaverse does not sell e-shops. The web development page tells readers to keep a Shopify or WordPress site that works (`service-pages.ts:374`), and /work has no e-shop. A page needs a real build to show (substance rule).
- Revisit if the owner starts selling e-shops and has one shipped. Note that the English SERP is also consumer-mixed: an Appscrip "top 5 e-commerce websites in Cyprus" list and a BrandNav data report rank, and the PAA asks "What is the best online shopping platform in Cyprus?".

**Website maintenance / hosting page.** **Do not add.**
- For (measured): `website maintenance cyprus` shares 0 with everything. Its top 10 is 6 service pages and 4 blog posts with no directory. Its local pack is weak (WebSEO 2 reviews, Wizzweb 10, and a photographer with 120).
- Against, on intent (observed):
  - The ranking pages sell care for sites someone else built, mostly WordPress: Ruxbo ("WordPress support"), WebSEO ("WordPress websites"), LemonHub ("all major CMS platforms").
  - Keyword Planner shows no data for the term.
  - `website hosting cyprus` is a hosting-company SERP: 5 of 10 are hosts, with NetShop ISP showing €7.99 to €34.99 as a price rich result, plus a HostAdvice list.
- Against, on the offer (observed): Konaverse hosting covers only its own builds, at €300 or €400 a year plus €300 with a CMS. The owner has recorded that the studio loses money on hosting and maintenance (`service-pages.ts:992-999`).
- Action: keep the running costs where they are, on each service page and in the cost post.

---

## 3. The Greek side

**SERPs give no volume.**
- Keyword Planner (September) returned no data for `κατασκευή ιστοσελίδας`, `κατασκευή ιστοσελίδων κύπρος` and `σχεδιασμός ιστοσελίδων` (`docs/keyword-research/keyword-planner-raw.md:121-123`).
- On 3 October, Google autocomplete with `hl=el&gl=cy` returned Cyprus Greek completions such as "κατασκευη ιστοσελιδασ κυπροσ" and "…τιμεσ κυπροσ" (`seo-plan-q4-2026.md` line 86).
- That is the only demand evidence on file: enough to say the searches exist, not how many there are.

What the shape of the results shows:

- **Ads (measured, at night):** none on any of the seven Greek queries. On the English `web development cyprus`, 4 of the 6 ads were in Greek, from firms in Greece (digius.gr, qbrains.gr, nextdigital.gr, pheraspis.gr). Firms in Greece pay to reach Cyprus searchers; this is the one sign of commercial value on the Greek side (inferred).
- **Local pack (measured):** on 3 of the 7 Greek queries (`κατασκευή ιστοσελίδας κύπρος`, `σχεδιασμός ιστοσελίδων κύπρος`, `κατασκευή eshop κύπρος`), with the same firms as the English packs. None on the Nicosia, price, SEO or bare Greek queries.
- **Who ranks (observed):**
  - Cypriot agencies on Greek URLs: JCSL, OnCyprus, Web Theoria `/el/`, WebSEO `/el/`, ProteaSoft `/el/`, LOOP, Nerwx `/el/`, websolutions.cy.
  - Firms based in Greece with Cyprus pages in Greek: firstidea.gr, acronweb.gr, aboutsite.gr, makemyweb.gr.
- **The bare term** `κατασκευή ιστοσελίδων`, even with `gl=cy`, is a Greece query (observed). Four of its 7 organic results are Greek (.gr) firms; it shows a YouTube tutorial pack and an AI Overview citing Webnode. Its related searches are Athens, Thessaloniki, free and WordPress. The Cyprus modifier is what makes the Greek query Cypriot.
- **English pages on Greek queries (measured):** none for the web design terms. All results on `κατασκευή ιστοσελίδας κύπρος`, `σχεδιασμός ιστοσελίδων κύπρος`, `κατασκευή ιστοσελίδων λευκωσία`, `κατασκευή ιστοσελίδας τιμές κύπρος` and `κατασκευή eshop κύπρος` are Greek. The exception is SEO: 7 of 9 results for `seo κύπρος` are English. Konaverse's English pages cannot reach the Greek web design SERPs; its SEO page can.
- **The price query (observed):** 4 of the 9 results for `κατασκευή ιστοσελίδας τιμές κύπρος` are Greek versions of English cost posts (webseo.cy/el, devitus.com/el, solutioweb.com/el, bypanik.tech/el). Konaverse's English cost post, 3rd in English (signed-in caveat), is absent. Competitors already turn their English cost posts into Greek ones, and those Greek versions rank.

Reading (inferred): Greek-language demand for web design in Cyprus is real but unmeasured. It is contested by the same firms Konaverse meets in English, plus Greek firms, and it has fewer directories in the way. The lowest-risk first Greek page is the cost post, already proven in English and on a blog-type SERP. Then comes the one Greek service page from section 2. Both go one at a time, after owner review; drafting authorises nothing.

---

## 4. Programmatic evaluation (claude-seo quality gates)

Plugin gates:
- 100+ pages without review: warning.
- 500+ pages without justification: hard stop.
- Less than 40% unique content: thin (hard stop below 30%).
- Fewer than 300 words: review.
- The standalone value test: would the page be worth publishing if no similar page existed?
- The penalty-risk patterns: city-name swaps, "best X for [industry]" without industry value, more than 60% boilerplate.

| Gate | Greek mirrors (6) | Industry pages (barbers, cleaning, construction, finance consultancy) | City pages (Nicosia, Limassol, …) |
|---|---|---|---|
| Page count | Pass (6) | Pass (4) | Pass at 2 to 4 |
| Data behind each page | Pass for web design (a Greek SERP exists); fail for redesign, one-page and 3D (no Greek SERP evidence); unneeded for SEO (English ranks) | Weak: 1 real build each for barbers, cleaning and finance; 2 for construction (HEIMAT, TDK) | Nicosia: 4 of 5 client builds are Nicosia firms (Los Santos, Chris N Clean, HEIMAT, TDK, from `case-studies.ts`). Other cities: none |
| Unique content ≥ 40% | Not the real test: a translation is unique text. The risk is unreviewed machine translation (scaled content abuse) | Likely fail: the only unique material would be the case study already at /work/[slug], so each page would duplicate or cannibalise it | Nicosia could pass with its own projects; Limassol, Larnaca and Paphos would be city-name swaps (the first penalty pattern) |
| Standalone value | Web design page passes; the other five fail | Fails for three of four; construction is closest | Nicosia could pass; the others fail |
| SERP evidence | Measured (section 3) | **None collected in this run.** The September autocomplete has one relevant line, "real estate website design cyprus". | Measured (below) |
| Verdict | **One page, not six** | **Do not build.** Before reconsidering construction, run its SERP (e.g. "website for construction company cyprus" and the Greek equivalent). Until then the case studies carry the industry proof. | **Banned by owner decision.** Data reported below |

**What the city SERPs show (measured unless marked):**

- **`web design nicosia`**
  - Shares 1 URL with `web design cyprus`, so the Cyprus page will not carry it (inferred).
  - Google set the location to "Lefkosa" and re-centred the local pack: Mojo Design 34 reviews, JCSL 59, avocadots 51.
  - Organic: 4 directories with Nicosia pages (Sortlist, RevenueBase, TechBehemoths, cypruswebdesigners), 4 homepages of Nicosia firms, one Nicosia landing page (BLEND, 5th), one service page.
  - The AI Overview cites devitus.com and loopdigitalmarketing.com through their "Web Design in Nicosia" pages.
  - Keyword Planner: 10 to 100.
- **`κατασκευή ιστοσελίδων λευκωσία`**
  - No local pack.
  - 3 of 9 results are Nicosia city pages: acronweb.gr (a firm in Greece offering remote work), pasiasdigital.com, nxdpro.com. The AI Overview cites two of them.
- **`web design limassol`**
  - Location set to Limassol. The local pack is a different set of firms with 48 to 64 reviews (A.A Webstudio 61, Absolute Websites 48, Online Solutions 64), plus 2 sponsored places.
  - 1st and 2nd are exact-match domains (limassolwebdesign.com, website-design-limassol.com); 4 directories follow.
  - The AI Overview cites bypanik.tech's "Web Design Limassol" page.
  - Keyword Planner: 10 to 100 in one pass, 100 to 1K in the other.

**Where the data argues against the decision (stated plainly; the decision stays with the owner):**
- The blanket ban costs something in one place: **Nicosia**.
  - The city query is a separate SERP the Cyprus page cannot reach.
  - City pages rank there in both languages and are cited in AI Overviews.
  - Konaverse is based in Nicosia, and four of its five real client builds are Nicosia businesses.
  - One Nicosia page built on those projects would not be a doorway by the plugin's own test: it has unique content and would stand alone (inferred).
- What a page cannot fix: the local pack, which takes the clicks, runs on the Business Profile (proximity, reviews, category), and the volume is 10 to 100 a month.
- For Limassol, Larnaca and Paphos the data supports the ban. There is no local work to show, exact-match domains hold the top, and the packs hold 48 to 64 reviews.

---

## 5. What the SERPs say about page type

Counts are from my page-type classification of each result (observed), totalled across queries (measured).

| Query group | Firm homepages | Directories | Service pages | Blog / guides | Pricing pages |
|---|---:|---:|---:|---:|---:|
| Head variants: web design, website design, web design agency, web design company cyprus (40 slots) | 23 | 15 | 2 | 0 | 0 |
| web development cyprus (10) | 4 | 4 | 0 | 0 | 0 (plus 2 job boards) |
| website redesign cyprus (10) | 3 | 2 | 3 | 2 | 0 |
| seo cyprus + seo services cyprus (20) | 3 | 6 | 10 | 0 | 0 (plus 1 job board) |
| one page website cyprus (9) | 2 | 0 | 3 | 3 | 1 |
| website cost + website design cyprus prices (18) | 0 | 0 | 0 | 14 | 4 |
| website maintenance cyprus (10) | 0 | 0 | 6 | 4 | 0 |
| Greek head terms, two queries (20) | 9 | 1 | 9 | 0 | 0 (plus 1 city page) |

**Where Cyprus money queries reward a directory or a firm, not a service page.**
- On the four head variants, Google answers "who are the firms": 23 homepages and 15 directory slots. Service pages hold 2 of 40 slots, both on `web design cyprus` (bridgestudios.com.cy/services/web-design 6th, paphoswebsitedesign.com/web-design-cyprus 7th).
- The four directories are close to fixed, each in the top 10 of all five web design and development SERPs: Clutch, The Manifest, cypruswebdesigners.com, and Sortlist (in three of the five).
- The AI Overviews draw on the same pool. Across all 24 queries, the most-cited domains are webtheoria.com (9 overviews), qoboweb.com, clutch.co and jcsl.com.cy (6 each), and Sortlist (5).
- Konaverse appears in no AI Overview and no local pack on any of the 24 queries. Its only organic appearances are the cost post on the two English price queries (measured).

**What that means for /services/web-design (inferred).**
- A service page can rank on this SERP, but as the minority type. To compete with firm homepages it has to read like one as well as like a service: who the studio is, where (Nicosia), since when, the people, the work, the price, and reviews once they exist.
- On the same SERP, the directory slots are the realistic way in: three or four of ten places that no page on kona-verse.com can take. This adds weight to the off-site items already in the plan (Clutch reviews, Sortlist, cypruswebdesigners.com, which plan section 8 notes is paid). The SERP does not change those owner decisions.

**What it means for /services (inferred).**
- The hub is neither a firm homepage nor a directory, and the query planned for it is the web design SERP.
- Keep it as the navigation hub that sends "web design in Cyprus" to one URL, and drop its competing target (section 2).

**An open choice for the owner (inferred, with the evidence).**
- Firm homepages take 23 of 40 head-term slots.
- Konaverse's homepage is where its external links point; none point at a service page (audit A3).
- Its title, "Konaverse: Build the website that will make you stand out", names neither web design nor Cyprus (`src/app/(v4)/page.tsx:28`); its description does say "web studio in Nicosia, Cyprus".
- The SERP evidence leans towards the homepage as the URL most likely to rank for `web design cyprus`. /services/web-design would then own the service questions: process, deliverables and the €1,800 / €2,500 prices.
- The other path is the current plan: /services/web-design owns the head cluster and gets the external links (the audit's Business Profile recommendation).
- Either path works if only one URL is aimed at the cluster. Aiming both splits the signal. This affects the title, the Business Profile link target and audit A3, so it is the owner's decision.

**Price queries reward blog guides and pricing pages, which supports the no-/pricing decision.**
- `website cost cyprus`: 8 blogs and 1 pricing page.
- `website design cyprus prices`: 6 blogs and 3 pricing pages.
- The Greek price query: 4 blogs, 3 pricing pages and 2 service pages.
- Konaverse's cost post is 3rd on both English queries (measured, signed-in caveat) and is not cited in either AI Overview.
- Point `web design cyprus prices` at the cost post alone, not at /services/web-design (0 shared with the head term). Link the post from the web design, one-page and redesign pages.

**SEO, maintenance and e-commerce reward service pages.**
- Service pages take 10 of 20 SEO slots, 6 of 10 for maintenance and 4 of 9 for e-commerce.
- For /services/seo, the page type is right, and the obstacle is indexing and authority, not the format.

**A side observation on the local pack** (measured, then inferred).
- WebSEO appears in 12 of the 15 local packs. Its Business Profile is named "Web Design Cyprus – Custom Website Design & SEO Services | WebSEO" and has 2 reviews.
- A photographer (LilKangooMedia, 120 reviews) appears in 4 packs: web design, website design, SEO and maintenance.
- So pack membership here is not driven by review count alone. That revises the 13 October reading that nothing moves below ten reviews.
- The keyword-stuffed name is against Business Profile guidelines and is not a model; plan section 8 keeps the profile name "Konaverse".

---

## What this data cannot show

- **Search volume.** None of these SERPs carries it. The Greek and maintenance volumes are unmeasured; Keyword Planner returned nothing for them.
- **Positions.** The run was signed in, so the cost post's 3rd place needs a signed-out check.
- **Daytime ads,** and therefore advertiser competition by day.
- **Industry demand.** No industry query was fetched (barbers, cleaning, construction, finance consultancy). The industry verdict rests on the quality gates, not on SERP evidence.
- **Mobile layout.** Desktop only.
- **The 3D niche from Cyprus today.** `immersive website design` and `3d website design agency` were not re-run; the 13 October record stands for them.
- **Ranking movement.** One sample per query. Re-run the same 24 queries in four to six weeks, by day and signed out, before acting on any merge.
