# Konaverse SEO Master Plan

Living document. **Version 2.3, 4 Sep 2026.** Updated from the Technical SEO & AI Search research report (Aug 2026). All claims below marked [verified] trace to that report's primary sources (Google Search Central docs, OpenAI/Anthropic/Perplexity crawler docs, large-scale citation studies).
Companion to `konaverse-site-architecture.md`. That doc says what pages exist. This doc says how they win, in what order, and how we measure it.

Rule for this doc: every item is either a decision, a research task, or an action. Nothing vague. When we learn something from real data, it gets logged in the changelog at the bottom and the plan gets edited, not appended.

---

## 1. Decisions

### Locked (argue in changelog if you want to reverse)

**D1. Two markets, two keyword strategies, one site.**
- **Cyprus, commercial intent.** "web design Cyprus", "website cost Cyprus", "web development Cyprus". Feeds the €1,000 to €2,000 tier. Winnable in months because local competition is weak at content and technical SEO.
- **Global, niche only.** 3D, immersive, scrollytelling, WebGL. Feeds the €4,000+ tier. Winnable because almost nobody targets these terms properly, and you can out-demonstrate everyone since the page itself is the proof.
- **Never global generic.** You will not rank worldwide for "web design". Any hour spent there is wasted.

**D2. "Premium" is positioning, not a keyword.**
Buyers do not search "premium web design" in meaningful volume. Premium is how the site feels and reads. The keywords are the concrete things: 3D website, website redesign, one page website, web design Cyprus.

**D3. AI search is a first-class target, and it is mostly still SEO.**
[verified] Google's official Generative AI optimization guide (May 2026) states that optimizing for generative AI search "is optimizing for the search experience, and thus still SEO", and explicitly says to ignore llms.txt, content chunking, AI-specific rewriting, inauthentic mentions, and over-focusing on structured data. So: no separate dark art, no snake-oil GEO tactics. What IS different for AI: rendering requirements (D5), off-site citations (Phase 3), and per-engine indexes (Phase 4).

**D4. Content beats volume.** Four excellent pages beat twenty adequate ones. Nothing thin ships, ever.

**D5. NEW: The site ships server-rendered, full stop.**
[verified] No major AI crawler except Google's Gemini executes JavaScript. GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot fetch JS files but never run them (confirmed across 500M+ logged fetches, reconfirmed through mid-2026). A client-rendered WebGL site can rank on Google and still be completely invisible to ChatGPT, Claude and Perplexity. Therefore: every page is SSR or SSG in Next.js, with all meaningful text, headings, links and JSON-LD present in the raw HTML response. WebGL and scroll sequences are an enhancement layer on top of real HTML content, never the content itself. **Acceptance test for every page: view-source shows all copy, and the page reads fully with JavaScript disabled.** This is the single highest-leverage technical decision in the whole plan.

**D6. NEW: AI visibility for "best agency" queries is won off-site.**
[verified] 84% of AI citations come from earned third-party sources, not the brand's own domain (Muck Rack, 25M+ links). Listicles are the top-cited format (63% of citations in one 400M-citation study; ranked Top-N lists dominate). Reddit is the most-cited domain overall; LinkedIn leads for professional queries; directories carry "best agency in X" answers. Consequence: getting Konaverse INTO third-party ranked lists, directories and communities is a bigger AI lever than anything on kona-verse.com itself. Phase 3 is upgraded accordingly.

### Open (decide by end of Phase 0)

- **O1.** Exact primary keyword per page, confirmed by research, not guessed.
- **O2.** Does /services/seo ship? Only if SEO becomes a real deliverable you sell.
- **O3.** Real name and domain for the watch 3D project so the flagship case study does not sit on a vercel.app URL.
- ~~**O4.** Training bots~~ **DECIDED 17 Aug 2026: allow all training bots** (GPTBot, ClaudeBot, Google-Extended). Rationale: little proprietary IP to protect, training presence may aid brand familiarity inside models, and blocking them would not have affected live search citation anyway. Moved to D7 below.

**D7. Training bots allowed.** robots.txt allows GPTBot, ClaudeBot and does not emit a Google-Extended block. The robots.txt table in Phase 1.2 is now fully resolved: every bot listed is allowed.

---

## 2. The phases

| Phase | Name | Gate to start | Rough window |
|---|---|---|---|
| 0 | Research and setup | now | 1 to 2 weeks |
| 1 | Technical foundation | redesign pages exist | launch week |
| 2 | Content engine | Phase 1 live | continuous |
| 3 | Authority, entity and citations | first pages indexed | continuous |
| 4 | AI search reality check | runs inside 1 to 3 | continuous |
| 5 | Measure and iterate | 4 weeks of data | monthly ritual |

---

## Phase 0 — Research and setup (start now, before the redesign ships)

### Accounts and infrastructure
- [x] Google Search Console: sc-domain:kona-verse.com is verified and has data since 2026-02-21 (73 clicks / 253 impressions in 16 months, all brand) — `docs/keyword-research/gsc-2026-09-04.md`
- [x] **Generative AI performance report** is live on the property: 12 impressions since 2026-06-30 (/ ×10, /pricing ×4). **Check for it** in GSC (launched June 2026, rolling out gradually). Shows AI Overviews / AI Mode impressions per page, country, device. Impressions only for now, no clicks or queries. [verified]
- [ ] Bing Webmaster Tools: verify, submit sitemap, import from GSC. Bing's index feeds Copilot and much of ChatGPT Search. [verified]
- [ ] **Bing Places for Business** alongside Google Business Profile. NEW: Bing local matters because of Copilot. [verified]
- [ ] Google Business Profile: claim, categorize as Website Designer, fill every field, real photos, service area. Highest-leverage single action for "Cyprus" queries, in both Google local AND AI answers.
- [ ] GA4 (or equivalent) with **AI-referral segments**: filter referrers chatgpt.com, perplexity.ai, copilot/bing, gemini. This is the click side that GSC's AI report doesn't show yet. [verified]
- [x] Google Keyword Planner access (free via the ads account). — used 2026-09-04; account 502-774-5339 has a payment-method warning and no live campaign, so volumes are RANGES
- [x] Ahrefs Webmaster Tools (free tier). — kona-verse verified (on the www host — re-verify on apex); Keywords Explorer is paywalled, the free KD checker was used instead

### Keyword research (unchanged method, still the core Phase 0 job)
1. **Seed list** from the architecture doc plus WhatsApp history ("can I see samples", "what's your pricing" are keywords: "web design portfolio", "website cost Cyprus").
2. **Expand with autocomplete** and People Also Ask, in Google AND Bing.
3. **Volume and difficulty** via Keyword Planner. Tiny Cyprus volumes (10 to 100/month) are fine; tiny volume plus buying intent plus weak competition is the game.
4. **SERP autopsy** per keyword: who ranks top 5, agencies or aggregators, could you out-write them? If aggregators own the SERP, the strategy is getting ON the aggregator. [verified this matters double: AI Overviews cite from the top 20 organic results 97% of the time, so the aggregators ranking there are also the AI's sources.]
5. **AI engine autopsy**: ask ChatGPT, Perplexity, Gemini and Claude the buyer prompts, record who gets cited and from where. Expect directories, listicles, Reddit. Those sources are your Phase 3 target list.
6. **Output:** keyword map updated from guesses to data, one primary keyword per page.

- [x] Seed list built (2026-09-04: 50 seeds, `tools/kw-suggest.js`)
- [x] Autocomplete + PAA expansion (Google and Bing) — 1,311 suggestions in `docs/keyword-research/suggest.md`
- [x] Volumes pulled — 112 terms, Cyprus + worldwide, `docs/keyword-research/keyword-planner-raw.md`
- [x] SERP autopsy done — 16 queries, `docs/keyword-research/serp-autopsy.md`
- [~] AI engine autopsy — Perplexity done for all 10 prompts (Konaverse 0/10; `docs/keyword-research/ai-engine-autopsy.md`); ChatGPT, Gemini, Claude NOT run (browser-bridge domain permissions) — run by hand
- [x] Keyword map updated (§3 below, v1 data)

### Competitor file
- [x] Cyprus agencies ranking for local terms — named in `docs/keyword-research.md` §4 (content depth: thin except Absolute Websites; GBP review counts still to pull).
- [x] Global studios ranking for 3D/immersive terms — Noomo, Lusion, Immersive Garden, Active Theory, Zajno, Utsubo (`docs/keyword-research.md` §4); their money pages are their HOMEPAGES, ranking on brand + Awwwards.
- [x] Which agencies appear in AI answers, via which sources — `docs/keyword-research/ai-engine-autopsy.md` summary; Phase 3 list in `docs/keyword-research.md` §5.

---

## 3. Keyword map (v1 DATA — 4 Sep 2026; full research in `docs/keyword-research.md`)

Volumes are Keyword Planner RANGES (CY = Cyprus, WW = worldwide; no active campaign → no exact numbers). KD is the
Ahrefs free checker. Every page has ONE primary; secondaries live on the same page.

### Bucket A: Cyprus commercial (feeds €1,000 to €2,000 tier)
| Keyword | Page | Vol CY / WW | KD | Status |
|---|---|---|---|---|
| web design cyprus | /services/web-design | 100–1K / 1K–10K | 57 (aggregators) | DATA |
| website design cyprus · web design nicosia/limassol/larnaca/paphos | secondary on web-design | 100–1K · 10–100 each | — | DATA |
| web development cyprus | /services/web-development | 100–1K / 1K–10K | 49 | DATA |
| web developer cyprus · web development company cyprus | secondary on web-development | 10–100 | — | DATA |
| web design agency cyprus (+ web agency cyprus, web design company cyprus) | /services | 10–100 (company: 100–1K) | — | DATA |
| web design cyprus prices · website prices cyprus | /pricing | below floor (autocomplete-confirmed) | — | DATA |
| website cost cyprus | BLOG post #2, links to /pricing | below floor; SERP has AI Overview + 6 agency posts | — | DATA |
| seo cyprus | /services/seo (O2 still open) | 100–1K | — | DATA |
| eshop development cyprus (NOT "eshop cyprus" = consumers) | backlog | 10–100 | — | DATA |
| Greek terms (κατασκευή ιστοσελίδων κύπρος …) | none | no data at all | — | English-only confirmed |

### Bucket B: Global niche (feeds €4,000+ tier)
| Keyword | Page | Vol WW | KD | Status |
|---|---|---|---|---|
| **immersive website design** | /services/3d-websites PRIMARY | 100–1K | **0** | DATA — agency-shaped SERP |
| 3d website design agency | co-primary, 3d-websites | below floor; agency SERP with AI Overview | — | DATA |
| 3d website design | in the h1 only — INSPIRATION SERP (Awwwards, Dribbble, galleries) | 1K–10K | 31 | DATA — not chased by the service page |
| 3d website development · 3d animated website | secondary, 3d-websites | 100–1K · 1K–10K | — | DATA |
| webgl website · scrollytelling website | vocabulary only (end-user / listicle intent) | 100–1K each | — | DROPPED as targets |
| website redesign services | /services/website-redesign | 10K–100K | 19 | DATA — US agencies; long-tail + Cyprus first |
| website redesign agency | secondary | 1K–10K | — | DATA |
| one page website design | /services/one-page-websites | 1K–10K | 20 | DATA — builders SERP; wins on the PAA cost question |
| single page website (design) · landing page design cyprus | secondary | 1K–10K · below floor | — | DATA |

### Bucket C: Discovery / problem (feeds both, wins AI citations) — priority from the data
1. **What a 3D website costs (2026)** — "how much does a 3d website cost" (10–100 WW, Reddit/Fiverr SERP, AI Overview from two small posts) → /services/3d-websites
2. **How much a website costs in Cyprus (2026)** — "website cost cyprus" (AI Overview from six Cyprus agency posts) → /pricing
3. **The best 3D websites of 2026, ranked — and what they cost to build** (FLAGSHIP) — "best 3d websites" 1K–10K KD 26 · "3d website examples" 100–1K · PAA "top 10 3D websites 2026" → /services/3d-websites
4. **What scrollytelling is, what it costs, 10 sites that do it well** — "scrollytelling" 1K–10K · "scrollytelling website" 100–1K → /services/3d-websites
5. **Template or custom website?** — 10–100, AI Overview, low-authority SERP → /services/web-design
6. **How long a website takes to build** — 1K–10K WW → /services/web-development
7. **The best web design agencies in Cyprus (2026)** — the D6 play; Vasilkoff/Maskwel already cited for theirs → /services
8. Is a one-page website enough? — PAA/AI only → /services/one-page-websites
~~What makes a website feel premium~~ — zero data in every tool; folded into #3 or dropped.

Each post: 1,500+ words, a real opinion, **a one-to-two-sentence direct answer in the first 100 words** [verified: 44.2% of AI citations come from the first 30% of content], a TABLE where the question is a cost (that is what the AI Overviews lift), exactly one link to its service page. The PAA bank in `docs/keyword-research.md` §3 supplies the section headings.

## Phase 1 — Technical foundation (ships with the redesign)

Reorganized after the research. Order = priority.

### 1.1 Rendering (the non-negotiable, see D5)
- [ ] SSR/SSG for every page; all text, headings, links, JSON-LD in the raw HTML response
- [ ] Acceptance test per page: view-source contains all copy; page reads fully with JS disabled
- [ ] Real DOM text equivalents for everything communicated inside the WebGL canvas (crawlers see zero canvas pixels, Google included)
- [ ] Fast TTFB. AI crawlers have tight timeouts; a slow HTML response means no fetch at all. [verified]

### 1.2 Robots.txt and AI crawler access (corrected bot list)
[verified against OpenAI, Anthropic, Perplexity and Google primary docs, Aug 2026]

| Bot | Owner | Role | Action |
|---|---|---|---|
| Googlebot | Google | Search AND AI Overviews / AI Mode | allow |
| Bingbot | Microsoft | Bing, Copilot, feeds ChatGPT Search | allow |
| OAI-SearchBot | OpenAI | ChatGPT search index and citation | allow |
| ChatGPT-User | OpenAI | user-triggered live fetch | allow |
| Claude-SearchBot | Anthropic | Claude search indexing | allow |
| Claude-User | Anthropic | user-triggered fetch | allow |
| PerplexityBot | Perplexity | Perplexity search index | allow |
| Perplexity-User | Perplexity | user-triggered fetch | allow |
| Applebot | Apple | Siri/Spotlight/Apple Intelligence | allow |
| GPTBot | OpenAI | model TRAINING only | allow (D7) |
| ClaudeBot | Anthropic | model TRAINING only | allow (D7) |
| Google-Extended | Google | Gemini training opt-out ONLY | allow (D7) |

- [ ] Explicit Allow rules for the search/user bots so they never fall through a wildcard `Disallow` block (common silent misconfiguration) [verified]
- [ ] Known correction: blocking Google-Extended does NOT remove you from AI Overviews or AI Mode; those run on Googlebot. [verified]
- [ ] REMOVED from plan: llms.txt. [verified: Ahrefs studied 137,210 domains, 97% of llms.txt files got zero requests; Google, OpenAI, Anthropic, Perplexity do not use it for search or citation; Google's guide names it as ignorable. Revisit only if a major provider officially adopts it.]

### 1.3 Schema (corrected after FAQ deprecation)
- [ ] **Organization** on the homepage: the entity anchor. Name, logo, address, geo, founder, and a rich accurate **sameAs** array (LinkedIn, Clutch, GBP, Crunchbase if listed, Cyprus registry, Wikidata). A broken or inconsistent sameAs link is worse than none; it can split the entity in two. [verified]
- [ ] **LocalBusiness or ProfessionalService** for the Cyprus location
- [ ] **Service** schema per service page, with areaServed (Cyprus for bucket A, worldwide for bucket B)
- [ ] **Person** schema for the founder, linked to Organization via worksFor; Organization references founder back
- [ ] **BreadcrumbList** site-wide, **WebSite** on the homepage
- [ ] **Article/BlogPosting** on posts with author, datePublished, dateModified
- [ ] REMOVED: FAQPage as a priority item. [verified: Google deprecated FAQ rich results May 2026; HowTo earlier. FAQPage still validates and is harmless if it mirrors real visible content, but it earns nothing in Google. Keep real FAQs on pages for humans and AI extraction; skip the markup effort.]
- [ ] Content parity rule: schema only describes what's visibly on the page, or Google can treat it as spam
- [ ] Reality check to keep us honest [verified]: Google says structured data is NOT required for generative AI and is not a ranking factor. We do it because it accurately describes the business and feeds the Knowledge Graph, not as a magic citation lever.

### 1.4 Core Web Vitals (thresholds confirmed, WebGL plan added)
Thresholds unchanged in 2026 [verified]: **LCP < 2.5s, INP < 200ms, CLS < 0.1**, at the 75th percentile of real field data. (INP replaced FID in 2024; ignore any checklist mentioning FID.) CWV is a tie-breaker signal, not a content override, but for us it is also crawlability insurance.

The WebGL hero plan, engineered in from day one:
- [ ] **LCP:** the true LCP element is a real image or headline that paints before the 3D initializes; the canvas gets a lightweight poster/first frame. An empty canvas for 3 seconds IS your LCP score.
- [ ] **INP:** Three.js render loop, shader compilation and .glb parsing move off the main thread via Web Workers + OffscreenCanvas (transferControlToOffscreen). Break long tasks, yield to main.
- [ ] **CLS:** explicit width/height and CSS aspect-ratio reserve the canvas box before the renderer initializes.
- [ ] Lazy-load below-the-fold 3D and frame sequences; defer non-critical JS; preload fonts with font-display: swap; inline critical CSS.

### 1.5 Hygiene (verified details)
- [ ] Self-referencing canonical on every page (also correlates with higher ChatGPT citation odds, directionally)
- [ ] Trailing slash: one convention, 301 the other, site-wide
- [ ] 301 map from every old URL, no chains. [verified: AI crawlers waste roughly 35% of fetches on 404s; clean redirects and sitemaps protect both link equity and AI crawl budget]
- [ ] sitemap.xml with accurate lastmod, submitted to GSC and Bing. Bing leans on sitemaps more than Google; AI crawlers are bad at URL discovery, so the sitemap does real work.
- [ ] **IndexNow** on publish (feeds Bing, and through it ChatGPT Search and Copilot; Google does not consume it) [verified]
- [ ] X-Robots-Tag header for non-HTML assets; meta robots for pages
- [ ] Titles and meta descriptions: written by hand, human-first, per page. [verified: length is not a ranking factor, Google rewrites often and truncates around 155 to 160 characters visually. Write for the click, not the character count.]
- [ ] One clear h1 per page with the primary keyword. [verified: the one-H1 rule is officially a myth per Google, so this is for clarity and accessibility, not because Google requires it. Keep doing it, drop the superstition.]
- [ ] Semantic HTML throughout. Not a Google requirement, but it helps LLM parsing, screen readers and browser agents.
- [ ] **Visible dates on posts + datePublished/dateModified in schema.** [verified: pages updated within ~90 days earn more AI citations. Refresh cadence becomes a Phase 5 job.]
- [ ] WebP/AVIF, real alt text, image sitemap if imagery matters for discovery
- [ ] Designed 404
- [ ] Quarterly re-test: does any major AI crawler render JS yet? If that changes, D5 can relax for that engine. Logged in changelog when checked.

---

## Phase 2 — Content engine

Production order (unchanged): 3d-websites page, two case studies, web-design page, pricing, remaining services and case studies, then blog posts one at a time, every 2 to 3 weeks.

Writing rules, upgraded with citation evidence:
- **Direct answer in the first 100 words**, then depth. [verified: 44.2% of AI citations come from the first 30% of content, and citation share falls through the page]
- **Real numbers.** "A 3D website from us starts at €4,000 and takes 6 to 10 weeks" is citable. "Contact us" is invisible. [verified: cited pages contain more discrete facts, statistics and quotes than non-cited ones]
- **Liftable sentences.** Facts stated in single self-contained sentences that survive being extracted.
- **First-hand point of view.** [verified: Google's AI guide explicitly rewards unique first-hand perspective over commodity content. You run an ecommerce store and build WebGL by hand; say so, show process, show real project data.]
- **Named author with a face.** Author bio + Person schema on every post. E-E-A-T and AI trust both want a human behind the claims.
- **NEW: one flagship ranked-list asset.** [verified: listicles are the most-cited format across AI engines (63% of citations in a 400M-citation study), and ranked Top-N lists dominate within them.] Candidate: "The 10 best 3D websites of 2026, ranked (and what they cost to build)". Honest, opinionated, includes non-Konaverse work, updated yearly. This is bait for bucket B citations and completely on-brand.

---

## Phase 3 — Authority, entity and citations (upgraded per D6)

Priority order changed: third-party presence now outranks classic link building, because 84% of AI citations are earned third-party sources.

### Tier 1: the citation surfaces AI engines actually use
- [ ] **Directory profiles, complete and consistent:** Clutch, DesignRush, Sortlist, TechBehemoths, plus whatever the Phase 0 AI autopsy surfaced. For "best agency in Cyprus" prompts, these ARE the answer sources. [verified]
- [ ] **Get INTO third-party "best web design agency Cyprus / best 3D website agency" listicles.** Find every ranked list the AIs cite, contact the publishers, earn placement. Single highest-leverage GEO action for an agency. [verified]
- [ ] **Google reviews + review platforms.** Ask same-day at handoff, direct link, target 10+ in 6 months. [verified: domains with profiles on major review platforms had 3x higher odds of being chosen as a ChatGPT source; Bing also pulls review signals from third-party platforms]
- [ ] **Reddit, genuinely.** Most-cited domain across AI engines combined. One honest, useful answer in relevant pricing/agency threads beats ten links. No astroturfing; Google explicitly warns inauthentic mentions backfire. [verified]
- [ ] **LinkedIn presence with substance.** Most-cited domain for professional queries. Founder posts about real projects and process. [verified]

### Tier 2: entity building
- [ ] **Wikidata entry** for Konaverse (no Wikipedia notability bar). Feeds the Knowledge Graph directly. [verified]
- [ ] Identical name, URL, description, NAP across: website, GBP, Bing Places, Apple Maps, Facebook, LinkedIn, every directory. Inconsistency splits the entity. [verified]
- [ ] sameAs array in Organization schema mirrors exactly these profiles.

### Tier 3: classic links (still valuable, now third)
- [ ] "Developed by Konaverse" footer credit on client sites: normal followed link, plain anchor ("Konaverse" or "Developed by Konaverse"), homepage target, client sign-off. Never keyword-stuffed anchors.
- [ ] Awwwards / FWA / CSSDA submissions for the immersive work: backlink, credential and top referral channel for the €4,000+ tier in one move.
- [ ] One genuine PR/feature/podcast/interview per quarter. Earned media is the 84%.

---

## Phase 4 — AI search reality check (corrected model of how engines work)

[all verified against Aug 2026 primary docs and studies]

| Engine | Sources from | Our lever |
|---|---|---|
| ChatGPT search | Own index via OAI-SearchBot + Bing + reportedly Google results via SerpApi | Allow OAI-SearchBot and ChatGPT-User, Bing WMT, IndexNow, encyclopedic/official-page authority |
| Copilot / Bing | Bing index | Bing WMT, Bing Places, sitemap, IndexNow |
| Perplexity | Own crawler + Bing; favors freshness, Reddit, discussions | Allow both Perplexity bots, fresh dateModified, community presence |
| Gemini / AI Overviews / AI Mode | Google index via Googlebot; 97% of AI Overviews cite at least one top-20 organic result | Everything in Phases 1 to 3; classic rankings feed the AI layer directly |
| Claude | Search partner index via Claude-SearchBot | Allow both Claude bots, same direct-answer rules |

Facts that shape strategy:
- Cross-engine citation overlap is LOW (roughly 11 to 12% of domains cited by both ChatGPT and Perplexity; ~12% of AI citations overlap Google's top 10). Winning one engine does not win the others; the prompt battery tracks each separately. [verified]
- For Google's AI surfaces, ranking organically top 20 IS the AI strategy. No shortcut exists. [verified]
- The shared truth stands: direct answers, liftable facts, real numbers, consistent entity, crawlable HTML, present on the third-party surfaces each engine trusts. Everything Google told the industry to ignore (llms.txt, chunking, AI-rewriting, fake mentions), we ignore.

---

## Phase 5 — Measure and iterate (monthly ritual, first Monday)

### The prompt battery (our AI rank tracker, free)
Fixed 10 buyer prompts, run monthly in ChatGPT, Perplexity, Gemini and Claude. Log per engine: mentioned? cited? who was, from what source? (Low cross-engine overlap means per-engine logging matters.)
1. Best web design agency in Cyprus
2. How much does a website cost in Cyprus
3. Who builds 3D websites for brands
4. Agencies that make scrollytelling websites
5. How much does a 3D website cost
6. Should I get a template or custom website
7. Web developer in Nicosia recommendations
8. Immersive website examples and who made them
9. Is a one page website enough for my business
10. Website redesign agency recommendations

### Dashboards
- GSC: impressions/clicks per bucket, positions for primaries, **Generative AI performance report** once available on the property (AI impressions per page) [verified]
- GA4: AI-referral segment (chatgpt.com, perplexity.ai, copilot, gemini) for the click side
- Bing WMT: performance + any AI reporting Microsoft ships
- Indexed vs published pages (gap = technical problem)
- GBP + Bing Places: calls, direction requests, clicks
- **Leads by source: the only number that actually matters. Everything above is a proxy.**

### Iteration rules
- Per page monthly verdict: growing (leave), flat (deepen, internally link, refresh), dead after 4+ months (rewrite or fold).
- **NEW: freshness pass.** Any money page or key post older than ~90 days gets reviewed and, if genuinely improvable, updated with a real dateModified. Never fake-bump dates. [verified: sub-90-day freshness correlates with AI citations]
- **NEW: quarterly re-tests.** AI crawler JS rendering, llms.txt adoption, GSC AI report capabilities. Log results in changelog; relax or tighten the plan accordingly.

---

## Backlog (parked, not lost)
- Greek-language pages (/el/) if local revenue becomes the main line (hreflang only needed then; not before) [verified]
- /services/ecommerce-websites, leaning on the operating experience angle
- Video content / YouTube for "3D website" queries
- Free tool or calculator ("website cost calculator Cyprus") as a link magnet
- Konaverse's own SEO results as the sales page for an SEO service line (answers O2)

---

## Changelog
- **4 Sep 2026, v2.3:** PHASE 0 RESEARCH RUN (`docs/keyword-research.md` + `docs/keyword-research/`). §3 keyword map rewritten from guesses to data: Keyword Planner ranges for 112 terms (Cyprus + worldwide), Ahrefs KD for 14 primaries, 16 SERP autopsies, 1,311 autocomplete suggestions, GSC 16 months, Perplexity for all 10 battery prompts. Findings that change the plan: (1) global 3D head terms are INSPIRATION SERPs — the 3D page's primary becomes "immersive website design" (KD 0) + "3D website design agency"; (2) the two cost questions are the most winnable high-intent queries and both already carry AI Overviews built from small agency posts; (3) the flagship ranked list is confirmed twice over (PAA asks for "top 10 3D websites 2026"; Perplexity's "examples" answers come from one studio's listicle); (4) Konaverse is cited in 0/10 AI answers — every "who is best" answer is assembled from Clutch/Sortlist/DesignRush/TechBehemoths/OneLittleWeb/ProvenExpert and third-party listicles, so Phase 3 tier 1 gains OneLittleWeb, ProvenExpert and Psychoactive's WebGL agency guide; (5) Greek terms have no data — English-only stands; (6) "what makes a website feel premium" has zero data everywhere and is dropped. Phase 0 boxes ticked; ChatGPT/Gemini/Claude prompts still to run by hand.
- **4 Sep 2026, v2.2:** Inner-page phase opened (site-architecture.md v2). Decisions taken there that bind this plan: work hub is `/work` (keyword map and Phase 2 references to `/projects` read as `/work`); web-design and web-development both ship with hard differentiation; one service-page template with the direct answer, from-price and timeline in the first 100 words; blog posts authored by one of two named founders, Article.author pointing at the existing Person ids; `/contact` becomes a real page with a two-CTA pattern (Contact + Book) site-wide. Phase 0 keyword research is scheduled as its own session (GSC, Ahrefs, autocomplete, Keyword Planner) before any inner-page copy is written; every keyword stays "guess, verify" until it runs.
- **17 Aug 2026, v2.1:** O4 decided: training bots (GPTBot, ClaudeBot, Google-Extended) allowed, promoted to D7. Robots.txt roster fully resolved: all listed bots allowed.
- **17 Aug 2026, v2:** Full update from the Technical SEO & AI Search research report. Added D5 (SSR mandatory: no major AI crawler except Gemini executes JS) and D6 (84% of AI citations are third-party; listicles dominate). Removed llms.txt (97% of files get zero bot requests; no provider uses it). Removed FAQPage schema as a priority (FAQ rich results deprecated May 2026). Corrected robots.txt bot roster from primary vendor docs and the Google-Extended misconception (AI Overviews run on Googlebot). Confirmed CWV thresholds (LCP/INP/CLS) and added the concrete WebGL engineering plan (poster LCP element, OffscreenCanvas + workers, reserved canvas dimensions). Rebuilt Phase 3 around citation surfaces (directories, third-party listicles, reviews, Reddit, LinkedIn, Wikidata) above classic links. Rewrote the Phase 4 engine table (ChatGPT is no longer "just Bing"; AI Overviews cite top-20 organic 97% of the time; cross-engine overlap ~11-12%). Added flagship ranked-list asset to Phase 2, named authors + Person schema, 90-day freshness pass and quarterly re-tests to Phase 5, Bing Places and GSC Generative AI report + GA4 AI-referral segments to Phase 0/5. Opened O4 (training bots decision, recommendation: allow). Demoted structured data from magic lever to entity hygiene per Google's own guidance.
- **17 Aug 2026, v1:** created. All keywords marked "guess, verify". Phase 0 opened.
