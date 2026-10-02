# Konaverse SEO plan v3 — Q4 2026 (5 Oct 2026 → 3 Jan 2027)

Written 2 Oct 2026. Supersedes `konaverse-seo-master-plan.md` v2.3 where they differ (that file keeps the history
and the D1–D7 decisions). The presented version is the Artifact "Konaverse SEO Plan"; this file is the working
checklist + research record. Evidence tags: P = official Google/vendor doc, S = study with method, O = opinion.

## 0. State on 2 Oct 2026 (audits run this day)

- **Production still serves the one-page launch.** Every inner page 307 → `/`; sitemap = `/` + 3 legal pages;
  `/llms.txt` + `public/*.md` describe the retired videography agency; `/api/contact` 404 on GET/HEAD.
- **Branch `redesign/v4`:** redirect gate lifted (`next.config.ts`), but `INDEXABLE = false` (noindex) on about,
  contact, services, services/[slug], work, work/[slug]. `KONA_OPEN_ROUTES` is dead code.
- Cloudflare in front of Vercel: 403s GPTBot/ClaudeBot/CCBot/Amazonbot/Bytespider (contradicts D7); email
  obfuscation hides info@ as "[email protected]"; www serves 200 (no 301); `/index` 200 duplicate.
- Lighthouse mobile (live home): Perf 31, LCP 15.1 s (96% render delay = text hidden until entrance tween; /privacy
  8.4 s too), TBT 1.4 s, 4.9 MB, hero-loop.mp4 fetched twice, 7 font preloads/6 families, ~20 eager image preloads.
  Three.js/R3F/postprocessing ship on every v4 page via `FluidCursor` in `(v4)/layout.tsx`.
- Home H1 textContent "Buildthewebsitethatwillmakeyoustandout" (word spans, no whitespace, `<noscript><style>` inside);
  same for two H2s; /about H1 "AboutKonaverse"; letter-split buttons read "S t a r t a p r o j e c t".
- Child-page `openGraph` overrides drop og:image/site_name/locale (shallow metadata merge).
- Schema: Organization (addressCountry only, no phone/locality), 2 Person, WebSite; Andreas Person has placeholder
  text; contact FAQPage; case-study Article without dates or Person author; no ProfessionalService despite a comment.
- Most images `alt=""` (work covers, plates, service photos, about tiles); /work hub names only in aria-label.
- Not-true copy: invented client quotes in case studies, Andreas bio, draft hours, /work description ("videographer").
- `site:kona-verse.com` → 0; no third-party mentions; DR 4; domain registered 2025-12-23.

## 1. Owner decisions (answered 2026-10-02 unless open)
1. Google Business Profile — **verification IN PROGRESS** (owner). Schema keeps addressCountry only until GBP shows its address; then add locality/street to the #organization node to match GBP exactly, never before.
2. Phone — **+357 96 273855**, one spelling everywhere (`CONTACT_PHONE` in `src/lib/site.ts`; in the schema and on /contact). Use the same string on GBP, Bing, Apple, Clutch and every directory.
3. AI training bots — **ALLOW** (D7 stands). Owner action: turn OFF Cloudflare "Block AI bots" (and AI Labyrinth / managed robots.txt if on) for kona-verse.com.
4. Case-study quotes — **REMOVED** (all five, 2026-10-02).
5. Clutch reviews — **OPEN, deferred** by the owner ("we'll check Clutch reviews another time"). Still the #1 off-page lever (Clutch on 10/16 CY money SERPs; the CY web-designers page lists 11 firms). Revisit at the week-2 profile setup.
6. Prices — **OPEN, being finalised** by the owner. Blocks content pieces 1–2 and /pricing; the service pages and Offer schema carry the current "from" figures until then.
7. Dtzankatian as a named case study — open.
8. YouTube — open.

## 2. Launch gate (week 1) — P0 unless marked
- [x] `INDEXABLE` removed (all six routes index); gate comments rewritten (2026-10-02)
- [x] `sitemap.ts`: 21 URLs from the data files, hand-kept lastModified (LAUNCH + per-page `UPDATED`), no changefreq/priority
- [x] Quotes removed; Andreas placeholder bio out of the schema (Person kept: name + role, now a founder); /work title "Website Design Portfolio" + true description; 404 copy — [ ] contact HOURS still a draft (owner to confirm)
- [x] Split-text H1/H2 fixed (HeroTitle, AboutGridHero, WorkRows); noscript moved out of the h1
- [x] `OG_DEFAULTS` (site.ts) spread into every page openGraph
- [x] llms.txt + 8 .md mirrors deleted (404)
- [x] Redirect map in next.config.ts: www→apex 308, /index→/ 308, /projects(/*)→/work 308, /services/videography→/services 308; /pricing→/services 307, /blog→/ 307 (both coming back) — [ ] GSC known-URL review after launch
- [x] `/api/contact` is in the build — [ ] send a test lead on the live domain after deploy
- [~] P1 alt DONE for work covers, case-study plates, the 6 service photos (`src/lib/service-photo-alt.ts`), about tiles — [ ] service-template images (RunMore/RunAnswer/ServicePoster)
- [ ] P1 /work hub: project name + line as real text; footer back on /work and /services
- [x] Case-study titles drop "| Case study"; Article headline = title; /about "About us" — [ ] descriptions ≈155 chars
- [x] `tools/seo-gate.js` (PASS on the local prod build, 21 pages) — status, self-canonical apex, one H1 with spaces, title/description vs data, og:image, JSON-LD parses with no FAQPage/Review/AggregateRating, non-empty content alts, HTML < 2 MB, no prod noindex, single-hop 301s

## 3. Technical (launch week)
- [x] 308 www → apex and `/index` → `/` in next.config.ts (verify live)
- [ ] Cloudflare: Email Obfuscation off; AI-bot block per decision 3; immutable assets TTL 1 year
- [x] robots.ts: explicit Allow groups (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Applebot, Bingbot), `Disallow: /api/`
- [x] `X-Robots-Tag: noindex` when `VERCEL_ENV !== 'production'`
- [ ] GSC: sitemap, request indexing (6 services + 3 case studies), keep AI features "included", baseline export
- [ ] Bing WMT verify (msvalidate meta), import, sitemap, AI Performance report; IndexNow key + post-deploy ping
- [ ] Check presence in search.brave.com (Claude runs on Brave)

## 4. Schema (one @graph, ids from `src/lib/site.ts`)
`#organization` = ["Organization","ProfessionalService"], with addressLocality Nicosia, phone, areaServed, founder ×3,
sameAs (only real profiles), knowsAbout, hasOfferCatalog → 6 Service ids. Per page: home WebSite (name/alternateName,
no SearchAction); about AboutPage + 3 Person; contact ContactPage (drop FAQPage); services CollectionPage + ItemList;
service Service (serviceType = primary keyword, Offer + priceSpecification, SEO unitText MONTH); work CollectionPage;
case study Article with dates + Person author + headline = H1; blog BlogPosting; BreadcrumbList everywhere.
Never: FAQPage, HowTo, QAPage, Review/AggregateRating, Product, Event, SearchAction, VideoObject (no watch pages).
Visible breadcrumbs on case studies + posts; add "Home" to the service trail.

## 5. Performance (folds into the mobile sweep)
LCP text visible at SSR · FluidCursor/Three via dynamic import after idle, desktop pointer only · drop the 5 legacy
font families · preload only the above-fold image, lazy-load the rest with width/height · hero video fetched once ·
compress og-image.png (661 KB) + brand/mark.png (114 KB) · GA4 page_view on client navigation. Measure with PSI median of 3, then CrUX.

## 6. Keyword map
| URL | primary | note |
|---|---|---|
| /services/seo | seo cyprus | weakest money SERP (EMD with 1 post #1; DLK /seo 127 words; local pack 2 and 18 reviews); add an AI-search section |
| /services/web-design | web design cyprus | Clutch 10/16 SERPs, KD 57; long game via Clutch + local pack |
| /services/web-development | web development cyprus | Next.js/SSR angle nobody uses |
| /services/3d-websites | immersive website design (+ "3d website design agency" literal in first 100 words + H2) | KD 0, no ads; mdx.so-style long priced page ranks |
| /services/website-redesign | website redesign cyprus → website redesign services later | no dedicated redesign page in the CY top 10 |
| /services/one-page-websites | one page website design | win on the cost question |
| /services | web design agency cyprus | H1 → "Web design, development and 3D website services" |
| /pricing (new) | web design cyprus prices | #1 autocomplete modifier; only OnCyprus (€600–1k) and Web Theoria (€3k+) publish |
| /work | — | H1 → "Websites we designed and built" |
Greek: no build this quarter (autocomplete returns English for "web design κύπρος"; Greek suggestions are Greece-only).
City pages: none (10–100 volume, doorway risk).

## 7. Content (one every 2 weeks; each links to exactly one service page)
1. 3D website cost 2026 → 3d-websites (beat svilenkovic.com: line items, 3-way video/Spline/Three.js table, own builds, measured LCP)
2. Website + SEO cost in Cyprus 2026 → /pricing (AI Overview from 6 CY posts; PAA SEO cost)
3. Scrollytelling: what, cost, 10 examples → 3d-websites (unowned)
4. Best 3D websites 2026 with measured stacks → 3d-websites
5. Redesign without losing rankings (Dtzankatian) → website-redesign (needs decision 7)
6. Honest Cyprus agency comparison, Konaverse in its niche rather than #1, ONE list only → /services
Prerequisite: /blog route + BlogPosting template (byline → /about person, visible dates, tables, sitemap, IndexNow).

## 8. Local, entity, off-page
- Business Profile: name "Konaverse" (no keywords), Website designer primary, service area CY cities, 6 services, photos; reviews on handover, no incentives; target 10 reviews, ≥4.3★
- Bing Places, Apple Business Connect, LinkedIn page (industry + Nicosia); NAP strings in `site.ts`
- Clutch (4 categories, 5 verified reviews; the CY web-designers page has only 11 firms) · Sortlist · DesignRush · GoodFirms · TechBehemoths · G2 (free only) · cypruswebdesigners.com (paid, 7/16 SERPs; ask price)
- Awwwards €65 (site after the perf pass, then Lumière) · CSSDA · Three.js forum showcase · threejsresources · a1.gallery · mesh3d · 3dwebsites.design · One Page Love · Codrops pitch after an award
- YouTube walkthroughs (decision 8) · founder LinkedIn 2×/week · genuine Reddit only · client credit links: brand anchor, nofollow, client's choice, never in a contract
- Wikidata: not until independent references exist

## 9. Measurement
Launch-day baseline export · GSC branded filter + Generative AI report (impressions only) + annotations · GA4 AI
Assistant channel + custom regex group + conversions · prompt battery: 10 prompts × 5 runs × 4 engines monthly, log
"N of 5" + cited sources · leads by source is the KPI.

## 10. Research record (2 Oct 2026) — the evidence behind the changes from v2.3 / the Dtzankatian PDF
- FAQ rich results not shown for anyone since 7 May 2026; docs removed 15 Jun 2026 (P changelog). Ahrefs controlled schema test: AIO −4.6%, AI Mode/ChatGPT ±0 (S, 11 May 2026). SE Ranking: FAQ-schema pages 3.6 vs 4.2 citations (S).
- llms.txt: Google "neither harm nor help" (P, AI optimization guide 15 May 2026); 97% of files 0 requests (S, Ahrefs Jun 2026).
- AI fetchers (ChatGPT, Claude, Perplexity, Copilot, Gemini live fetch) do not execute JS (S/O, Alpar test Oct 2026).
- ChatGPT: own index ("Labrador") + Google-sourced results; Bing overlap 26% → 8% (S, Profound 2025; Peec Oct 2026). Claude → Brave (P subprocessors). Copilot → Bing (P).
- AI Overview citations from the top 10: 76% → 38% (S, Ahrefs Mar 2026). Brand mentions r≈0.66–0.71; YouTube mentions r≈0.74; DR ≈0.3 (S, Ahrefs). Earned media 82–89% of citations (S, Muck Rack May 2026). "Best X" lists 43.8% of ChatGPT-cited page types (S, Ahrefs Dec 2025). 44.2% of citations from the first 30% of the page (S, Indig). 75% of cited pages updated within a year (S, Seer Jul 2026). The same brand list repeats in <1% of runs (S, SparkToro Jan 2026).
- Self-promo listicle sites −29–49% after the Dec 2025 core update (S/O, Lily Ray). Spam policy covers manipulating generative AI responses, sitewide/contract footer links (P, 28 Aug 2026). Back-button hijacking enforced 15 Jun 2026 (P).
- Helpful content page (P, 1 Oct 2026): effort/originality/skill/accuracy; fabricated creator profiles = deception. Review snippets: self-serving ineligible; incentivized reviews banned (P, 24 Jul 2026).
- Breadcrumbs desktop-only since Jan 2025; sitelinks search box gone Nov 2024; Googlebot reads the first 2 MB of HTML (P).
- Cyprus SERPs (gl=cy, 16 queries): Clutch 10/16, Sortlist 8/16, cypruswebdesigners 7/16; agencies Absolute 7, Web Theoria 6, DLK 6. Only Absolute (~weekly) and Web Theoria publish. Bridge Studios ranks 4 money queries with 10 URLs + full schema. AI answers for "best web design agency Cyprus" built from Clutch/OneLittleWeb/RevenueBase/DesignRush/GoodFirms; SEO answers from zyppy/krowdbase.
- Global 3D: no ads on agency SERPs; Noomo + Lusion in every AIO; svilenkovic.com owns AI-index cost answers (programmatic, no proof); Utsubo and Psychoactive self-published agency lists are what AI cites (bar: Awwwards SOTD + Dev award); Metabole is the closest content competitor (~45 posts); mdx.so is the nearest analog to Konaverse. Trends 2026: "3d website" ≈17× "immersive website"; autocomplete shows AI-builder intent rising ("3d website prompt").
