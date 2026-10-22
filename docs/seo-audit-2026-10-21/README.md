# Konaverse SEO audit, 21 October 2026

A follow-up to the 13 October state read (`docs/seo-state-2026-10-13.md`) and the Q4 plan (`docs/seo-plan-q4-2026.md`), run with the claude-seo plugin (`/claude-seo:seo audit`). Twelve specialist agents audited the live site at https://kona-verse.com in parallel, each told the owner decisions that bind its recommendations. Every finding below is labelled against the earlier record: **NEW**, **STILL OPEN** (in the plan, not done), **REGRESSED**, or **FIXED**. Their full reports and raw data are in `evidence/`.

Nothing on the site, in the CMS, in Search Console or in any listing was changed. No Indexing API or IndexNow requests were sent.

## Verdict

**On-site health: 68 / 100. The site is sound; authority is the bottleneck.**

The technical base passes everywhere that matters for indexing: 25 of 25 URLs return 200, self-canonical, `index, follow`, copy present without JavaScript, the SEO gate passes against live. What holds Konaverse back is off the site: zero reviews, no external link to any service page, and a brand name shared with a podcast. The on-site work that remains is mostly accuracy (claims and facts the owner has to confirm) and crawlable text in a few components.

Progress since 13 October:
- Three of the six service pages are now indexed (web development, one-page websites, website redesign; crawled 20 October). Web design, 3D websites and SEO are not.
- The first non-brand impressions: "website cost cyprus" (6 impressions, position 14) and "website design cyprus prices" (5, position 15.4). Too small to call a trend, but it is the cost post registering.
- Cloudflare no longer blocks AI crawlers (17 user agents, all 200). Email obfuscation is off. Both were open on 2 October.
- The H1s are clean on all 25 pages. The drift tool's "Buildthewebsite..." reading was a parser artefact; the raw HTML has real spaces.

## Scores

| Area | Score | Weight in health score | Source |
|---|---:|---:|---|
| Technical (incl. sitemap 90, agent readiness 94) | 86 | 22% | evidence/technical.md, sitemap.md, agentic.md |
| Content and E-E-A-T | 62 | 23% | evidence/content.md |
| On-page (titles, anchors, crawlable text, intent fit) | 65 | 20% | technical.md, sxo.md (61) |
| Schema | 84 | 10% | evidence/schema.md |
| Performance (lab only, no field data) | 30 | 10% | evidence/performance.md |
| AI search readiness | 70 | 10% | evidence/geo.md (66), agentic.md |
| Images | 75 | 5% | technical.md, performance.md |
| **Health score** | **68** | | weighted |
| Local SEO | 28 | not weighted | evidence/local.md |
| Backlinks | ~35 | not weighted | evidence/backlinks.md |

The plugin's health score covers on-site work only. Local (28) and links (~35) sit outside it, and they are the two lowest numbers here.

## Search data, 21 October

| | 13 Oct | 21 Oct |
|---|---|---|
| Search Console, last 3 months | 31 clicks, 317 impressions | 30 clicks, 521 impressions, position 10.1 |
| Search Console, last 28 days | n/a | 16 clicks, 398 impressions, CTR 4.0%, position 9.4 |
| Daily impressions | 0 to 2 in late September | 19 to 47 since 8 October |
| Non-brand impressions | 0 | 26 (28 days), 0 clicks |
| GA4 organic sessions (28 days) | n/a | 30 of about 170 (Direct 83, Instagram 43) |
| AI assistant referrals (90 days) | n/a | 0 |
| Core Web Vitals field data | none | none (too few Chrome users) |

Service page indexing (URL Inspection, 21 October):

| Page | State |
|---|---|
| /services/web-development | Submitted and indexed (crawled 20 Oct) |
| /services/one-page-websites | Submitted and indexed (crawled 20 Oct) |
| /services/website-redesign | Submitted and indexed (crawled 20 Oct) |
| /services/web-design | Discovered, currently not indexed, never crawled |
| /services/3d-websites | URL is unknown to Google |
| /services/seo | URL is unknown to Google |
| /privacy | URL is unknown to Google |

The other 17 sitemap URLs are indexed, with Google's canonical matching ours on every one.

## Findings

Ordered by expected impact for a small studio with near-zero non-brand traffic, not by the plugin's default buckets. File references point at the source that produces the problem.

### A. Authority and off-site (the bottleneck)

| # | Finding | Status | Fix | Who |
|---|---|---|---|---|
| A1 | 0 reviews on the Google Business Profile and on Clutch (re-checked 21 Oct). Local pack competitors hold 12 to 51. | STILL OPEN | Ask each real past client once for a Google review (and Clutch if willing); put the review link in every handover email; reply to every review; no incentives. Realistic: 4 by end of November, 6 to 8 by Q1. | Owner |
| A2 | Business Profile has no photos. | STILL OPEN | 10 or more real photos (team, workspace, work on screens). | Owner |
| A3 | No external link points at any /services/* page. Business Profile, Clutch website field, LinkedIn (no website field at all), Facebook and Instagram point at the homepage or nowhere. This is the lever the 14 Oct addendum named for the three unindexed service pages. | STILL OPEN | Business Profile website link to /services/web-design; Clutch service descriptions link to their service pages; LinkedIn website field to /services; bios link to /services. | Owner |
| A4 | Clutch conflicts with the Business Profile: it shows a street address in Lakatameia, the phone as "96273855" without +357, and team size as both 2-9 and 2-5. | NEW | Fix in the Clutch dashboard to match the Business Profile exactly. | Owner |
| A5 | Citations: Bing Places, Apple Business Connect, Sortlist, DesignRush, GoodFirms, TechBehemoths could not be confirmed (403 to scripts, absent from readable results). | STILL OPEN | Owner checks each; create the missing ones with the same NAP and a "Konaverse, web design studio in Cyprus" line. | Owner |
| A6 | Client credit links on tdkdb.com, velricon.com and heimat-group.com read "Design by Konaverse", point at www (one redirect hop) and are followed sitewide footer links, which conflicts with plan §8 ("nofollow, client's choice"). Los Santos Barbers and Chris n Clean have no credit found. | NEW | Point them at the apex or a relevant service page, add `rel="nofollow"`, keep them the client's choice. We maintain these sites, so it is a small change per repo once each client agrees. | Owner decision, then code |
| A7 | A search for "Konaverse" on DuckDuckGo shows only /work/lumiere-eclat (#8), not the homepage; on Brave (which Claude's search uses) the first ~15 results belong to Konabos's "Konaverse" podcast. | NEW | Entity consistency: the same name, line and city on every profile from A3 to A5. Reviews and directory pages do most of the disambiguation. | Owner |

### B. Accuracy and trust (needs the owner's facts before any copy change)

| # | Finding | Status | Evidence |
|---|---|---|---|
| B1 | Guarantee-style claims the site cannot back yet: "< 2.5 s, Largest paint, guaranteed" (`src/lib/service-pages.ts:359`), "60 fps on a mid-range phone" (`:506`), "nothing you rank for is lost" and "0 lost" (`:757`, `:763`, `:853`), "Sixty frames on every scroll" (`src/app/(v4)/about/page.tsx:177`). A prospect who runs PageSpeed on our own homepage sees a 22.7 s mobile lab LCP. Physical-device review is still outstanding. | NEW, High | Describe the target and the method instead of promising the outcome, unless measurements exist. |
| B2 | /about contradicts itself: the meta description says "three people" (`about/page.tsx:106`), the timeline says "two people and a laptop in Limassol" (`:207`) and "a team of two that stays two" (`:209`). Clutch says Lakatameia, LinkedIn says Nicosia. "Path-traced, never live" (`service-pages.ts:500`) conflicts with Lumière Éclat being real-time WebGL (`case-studies.ts:379`). | NEW, High | Owner confirms team size, founding city and current city; copy is aligned once. |
| B3 | Founder bios exist only in JSON-LD on /about, not as visible text; Andreas has no role; bylines link to /about rather than to the person. | STILL OPEN, High | Visible short bios with roles; byline anchors. |
| B4 | Lumière Éclat is unlabelled as a concept on the homepage Featured projects and in three of four customer-voice rows on /services/3d-websites. Its own case study discloses it. | NEW, Medium | Label it wherever it appears. |
| B5 | Velricon "each new service page now owns its own term" (`service-pages.ts:811`) reads as a ranking outcome the case study says it has no figures for. | NEW, Medium | We have Velricon's Search Console in the plugin: check it, then keep or reword. |
| B6 | Draft facts live: contact hours "Monday to Friday, 9 to 18 EET" (`contact/page.tsx:56`, flagged draft at `:35`; Cyprus is on EEST until 25 Oct) and the reply promise; case-study client facts flagged draft (`case-studies.ts:23-25`). | STILL OPEN, Medium | Owner confirms; then hours go into `openingHoursSpecification` and match the Business Profile. |
| B7 | The cost post answers the market question with Konaverse's prices only; no sourced range of what Cyprus studios charge, while the AI Overview for that query is built from six Cyprus agency posts. `dateModified` is 2026-10-03 though the body changed on 14 Oct. | NEW, Medium | Add a dated, sourced market range; bump the Sanity `updated` field. |

### C. On-page and crawlable text (code, low risk)

| # | Finding | Status | Where |
|---|---|---|---|
| C1 | Button link text as crawlers read it: "Start a projectSay helloStart a projectSay hello...", because both roll labels, the letter lines and the sr-only copy are all in the HTML. Affects 13 /contact links, 25 Calendly links, /work and 7 "Visit site" links. Screen readers are fine (aria-hidden letters + sr-only label). | NEW, Medium | `src/components/v4/Button.tsx:253-256`. Keep one label in the server HTML; build the roll copies client-side. The animation stays. |
| C2 | Homepage "What we do" H2 reads "WhatWe()Six servicesDo" (the link text sits inside the heading); the /about H2 lacks a space after "make,". The 2 Oct fix covered HeroTitle, AboutGridHero and WorkRows only. | STILL OPEN, Medium | `src/components/v4/WhatWeDo.tsx:35-57`, /about H2. |
| C3 | /work has 19 to 36 crawlable words; project names live only in `data-` attributes, image alts and JSON-LD; the card links have no anchor text. | STILL OPEN (plan line 47), Medium | `WorkHero.tsx` / `WorkCascade.tsx:630`. Name, service, year and one line as text inside each link. |
| C4 | /services hub: 199 words, no prices, people or call to action in the main content, the word "agency" never appears, and the H1 is a 15 px grey eyebrow while "Web Design" (a carousel card) is the visual heading. Its SERP is Clutch, Sortlist, DesignRush and agency pages that lead with founding year and location. | STILL OPEN / NEW, High | "From" price and timeline on each carousel card, one band of studio facts, a Book a call button. A design change: owner approves the form. |
| C5 | No service page shows a named person or the phone number; the footer has only the email. The phone and founders exist in the schema only. | NEW, Medium | Closing section: the person who takes the call + tap-to-call. Footer: `CONTACT_PHONE` from `src/lib/site.ts:57-58` in `SiteFooter.tsx`. |
| C6 | 19 of 25 meta descriptions exceed 160 characters (case studies 197 to 270, all opening "How Konaverse..."); /about and /contact titles are 20 and 19 characters with no category term. | STILL OPEN, Low | Rewrite in the data files. |
| C7 | Keyword map corrections from the SERP check: "immersive website design" is a gallery/explainer SERP, so point /services/3d-websites at "3d website design agency" (absent from its visible text and H2s, plan line 80) and leave the bare term to an examples post; "one page website design" is an inspiration/builder SERP, so re-point that row to the price question the page already answers; /services/website-redesign has "Cyprus" in neither title nor H1. | NEW / STILL OPEN, Medium | `src/lib/service-pages.ts`; plan §6. |
| C8 | "Scrollytelling" (720/month US) has no live page of the right type; the 3D page never uses the word. | STILL OPEN, Medium | Publish Article 13 when the owner is ready; link it from the 3D page's blog slot; name the term once in "What it is". |

### D. Technical, measurement and schema

| # | Finding | Status | Where / fix |
|---|---|---|---|
| D1 | `melt-hero.kona-verse.com` serves a 2.2 MB page titled "Tutorial Board — Portrait → Chrome" with no robots tag, canonical or robots.txt, and it already appears in Search Console under the domain property. | NEW, Medium | Owner: delete the Vercel project or alias, or noindex it. |
| D2 | GA4 cannot measure leads: no event for a contact form submit or a Calendly booking; the only key event, `ads_conversion_Contact_Us_1`, fired 13 times against 10 /contact landing sessions (suspected misfire). Plan §9 makes leads by source the KPI. | STILL OPEN, High | A `generate_lead` event on a successful `/api/contact` response and on Calendly's `event_scheduled` message; review the Ads tag trigger. |
| D3 | Cookie banner on first visit: 358×364 px on mobile (about 43% of the screen), covering the homepage "Start a project" button, the /services carousel arrows and the /work cards; 417×287 px on desktop over the hero. | NEW, High (conversion) | A slimmer mobile form. Design change: owner approves. `src/components/layout/CookieConsent.tsx`. |
| D4 | With JavaScript off, the underlay menu panel paints over the page, so a no-JS visitor sees only the menu links (verified in `evidence/visual/home-nojs-m.png`). Crawlers still get the full copy. | NEW, Medium | Hide the panel in the existing noscript style. |
| D5 | Sitemap `lastmod` is stale after the 11 to 14 Oct commits: service pages and /contact show 2026-10-03 (pricing changed 14 Oct), /work/tdk 2026-10-02 (links changed 12 Oct), homepage 2026-10-03 (blog nav 11 Oct). | NEW, Medium | `src/app/sitemap.ts:21-33, :48`. |
| D6 | Schema: case-study `author` is the Organization, not a Person (`work/[slug]/page.tsx:190`, all 7 studies); /services has no CollectionPage (`services/page.tsx:97`); `hasOfferCatalog` Service @ids dangle on 19 of 25 pages (`layout.tsx:158`); Person nodes defined twice with different descriptions (`layout.tsx`, `about/page.tsx:225`); service breadcrumb has no "Home"; `areaServed` mixes a Country with "Europe" and "Worldwide". | STILL OPEN / NEW, Medium to Low | Corrected JSON-LD in `evidence/schema.md`. Case-study authors need the owner to say who wrote each. |
| D7 | Small items: http://www takes two hops; HSTS without includeSubDomains, no CSP (start report-only so Calendly survives); `/favicon.ico` 404; City Arcade and Lumière "Visit site" links point at vercel.app hosts; OG image `og-image1.png` is 752 KB though a 64 KB `og-image.jpg` exists (`src/lib/site.ts:62`, REGRESSED from 661 KB); two Calendly iframes on /contact share one title; `/blog/rss.xml` 404. | NEW / STILL OPEN, Low | Batch with C-items. |

### E. Performance (recorded, not scheduled)

Performance work is on hold by owner decision (AGENTS.md, 10 October). These are recorded for when it resumes. All numbers are single lab runs with emulated devices; there is no field data.

| # | Finding | Status |
|---|---|---|
| E1 | Mobile lab Performance 18 to 58 (home 42, /work 18, /services/3d-websites 58); desktop 25 to 65. Home LCP is the hero paragraph, 92% render delay from the authored text entrance: an owner trade-off, not a defect. | STILL OPEN (2 Oct: 31) |
| E2 | Six inner pages show mobile FCP around 10 s although first-party bytes finish by 0.34 s locally; suspected main-thread gating. Needs a DevTools trace before any change. | NEW, suspected |
| E3 | TBT 1.1 to 4.0 s on every page. Transfer 6.2 to 7.3 MB, of which about 4.4 MB is third party; Calendly alone is 3.0 MB and about 840 ms of main thread on every route (the deliberate preload), plus reCAPTCHA, GTM and Microsoft Clarity. | NEW |
| E4 | CLS 0.84 mobile / 0.57 desktop on /work (`img.wc-open`, `WorkCascade.tsx:616`; single run, repeat first) and 0.222 desktop on /contact (the JS-sized inline Calendly slot; reserve its size in CSS, preload untouched). | NEW |
| E5 | React hydration error #418 on the homepage in both PSI and local runs. | NEW |

Confirmed fixed since 2 October: hero video fetched once, font preloads 7 → 1, image preloads about 20 → 1 to 3, brand mark 6.6 KB, Three.js out of the initial JS on every route (FluidCursor loads on hover devices at idle).

### Confirmed fixed or fine

All 25 URLs 200, self-canonical on the apex, `index, follow`, no X-Robots-Tag · single 308 redirects for www, /index, /projects, /pricing, /services/videography, trailing slashes · real 404s for retired URLs, llms.txt and the .md mirrors (deliberate) · the anonymised migration client's old URL is 404 + noindex with no mention of the name · copy, H1, title and canonical identical with and without JavaScript · HTML 57 to 134 KB · sitemap valid, 25 URLs, no orphans, every Sanity post listed · robots.txt allows search, user and training bots as decided · Cloudflare returns 200 to every AI user agent tested (spoofed UA from one IP; confirm in Cloudflare → Security → Bots) · email obfuscation off · letter-split buttons have correct accessible names · contact form labelled, typed, works without JavaScript · JSON-LD parses everywhere, no FAQPage/Review/AggregateRating/HowTo · prices in the schema match the pages · phone +357 96 273855 identical on site, schema and tel: link · invented case-study quotes gone · every service page answers price and timeline in its first passage · the six service pages are not near-duplicates (6 to 20% shared phrasing, mostly the hosting rows).

## Action plan

Sequenced by dependency. Each item names how we would know it failed and what to watch without re-running the audit.

### Phase 0: owner, this week, no code

| Action | Findings | Failure check | Leading indicator |
|---|---|---|---|
| Point the Business Profile website link at /services/web-design, add services, add 10+ photos | A2, A3 | /services/web-design still "Discovered, not indexed" three weeks after the link exists | URL Inspection state for web-design, 3d-websites, seo |
| Fix Clutch NAP, team size, and link each service description to its page | A3, A4 | Clutch still shows the street or "96273855" | Clutch profile |
| Ask past clients for reviews (Google first, Clutch if willing) | A1 | Fewer than 3 reviews by 30 November | Business Profile review count |
| LinkedIn website field, social bios to /services | A3, A7 | n/a | Brave/DDG "Konaverse" result |
| Answer the owner questions below | B1 to B6, D1, D3 | n/a | n/a |

### Phase 1: one code pass, no visual change (after Phase 0 answers)

C1 button anchor text, C2 headings, C3 /work names as text, C5 footer phone, C6 descriptions and titles, D2 GA4 lead events, D4 no-JS menu, D5 sitemap lastmod, D6 schema fixes, D7 small items, B6/B7 data updates once confirmed.
- Failure check: `tools/seo-gate.js https://kona-verse.com` still passes; `/claude-seo:seo drift compare` on the 25 baselines shows only the intended changes; crawler-visible anchor text on /contact reads "Start a project" once.
- Indicator: GA4 shows `generate_lead` events within a week of the first real enquiry.

### Phase 2: content and design changes the owner signs off

B1 claim wording, B2/B3 /about facts and visible bios, B4 concept labels, C4 /services hub band, C5 person + tap-to-call on service pages, C7 keyword re-targeting, D3 mobile cookie banner, B7 cost post market range, C8 scrollytelling article when ready.
- Failure check: no non-brand impressions for the re-targeted pages within six weeks of indexing.
- Indicator: Search Console non-brand impressions by page.

### Phase 3: ongoing off-site

Citations (A5), client credit links (A6), Awwwards and gallery submissions, local press built on the cost data. The plan's §8 list stands. No bought links, no footer links in contracts.
- Failure check: no new referring page pointing at a /services/* URL by end of November.

## Questions for the owner

1. **Team.** Two people or three? What is Andreas's role? (B2, B3)
2. **Place.** Did Konaverse start in Limassol? Which city should the site name now: Lakatameia or Nicosia? (B2, A4)
3. **Guarantees.** Do we have measurements behind "< 2.5 s guaranteed", "60 fps on a mid-range phone" and "0 lost"? If not, may they become target-and-method lines? (B1)
4. **Lumière Éclat.** Label it as a concept on the homepage and the 3D page? (B4)
5. **Hours and reply promise** on /contact: what are the real ones? (B6)
6. **melt-hero.kona-verse.com:** delete it or noindex it? (D1)
7. **Client credits:** may we ask TDK, Velricon and Heimat to switch their footer credit to the apex or a service page with nofollow? (A6)
8. **Cookie banner:** may the mobile version become a slim strip? (D3)
9. **Velricon claim:** shall I check Velricon's Search Console to see whether its service pages rank, before keeping "owns its own term"? (B5)

## Data sources and limits

- **Used:** Google Search Console and URL Inspection (sc-domain:kona-verse.com), GA4 (property 534373757), PageSpeed Insights and CrUX, Bing Webmaster, live HTTP fetches and headless Chrome, WebSearch/WebFetch.
- **Not usable:** Moz (out of quota), Semrush and Ahrefs (no API units / plan), Common Crawl (timed out), Bing's link API (returns zero links for every verified property including Velricon and TDK, so its zero for Konaverse means nothing).
- **Approximations:** WebSearch is not localised to Cyprus and does not show the local pack or AI Overviews; Cyprus SERP order comes from the 13 October observations. AI-crawler tests used spoofed user agents from one IP. PageSpeed ran once per page (no median of three). Headless Chrome uses software WebGL. No physical device or Safari review.
- **Baselines:** drift snapshots for all 25 sitemap URLs were captured on 21 October (IDs 1 to 25, `~/.cache/claude-seo/drift/baselines.db`; Core Web Vitals missing for the redesign and Los Santos pages, skipped for the legal pages). Re-check any page with `/claude-seo:seo drift compare <url>`.

## Evidence

| File | Area |
|---|---|
| `evidence/technical.md` (+ `technical/`: raw HTML of all 25 URLs, headers, bot table) | Technical |
| `evidence/performance.md` (+ `performance/`) | Performance |
| `evidence/content.md` | Content and E-E-A-T |
| `evidence/schema.md` | Structured data, with corrected JSON-LD |
| `evidence/sitemap.md` | Sitemap and coverage |
| `evidence/visual.md` (+ `visual/` screenshots) | Visual and mobile |
| `evidence/geo.md` | AI search |
| `evidence/agentic.md` | Agent readiness |
| `evidence/google.md` (+ `google/`) | Search Console, URL Inspection, GA4, CrUX |
| `evidence/local.md` | Local SEO |
| `evidence/backlinks.md` (+ `backlinks/`) | Backlinks |
| `evidence/sxo.md` | Search experience |

## Status, 21 October (after the owner's answers)

Owner answers: three people (Andreas: operations manager and design lead); Konaverse started in Nicosia and the site names Nicosia; no measurements, so the guarantees become target-and-method lines; label Lumière Éclat as a concept; replies within 24 hours; delete melt-hero; clients approve a footer credit to the homepage; slim mobile cookie strip; check Velricon's Search Console.

Velricon check (Search Console, 90 days): the service pages earn impressions (bank-ready position 2.7 on 24 impressions; strategic-business-transactions 823 impressions at position 26.4) and no clicks, so "each new service page now owns its own term" was reworded to describe the method.

### Changed in the code (committed bbd3a67, pushed 22 October)

| Finding | Change | Files |
|---|---|---|
| B1 | Guarantees reworded to targets and method: "Largest paint, our target", "Our target on a mid-range phone", "100% / Old URLs redirected", "so the rankings you have earned can carry over", "Motion built for sixty frames a second"; "measured on real devices" removed | `src/lib/service-pages.ts`, `src/app/(v4)/about/page.tsx` |
| B2, B3 | Three people in Nicosia; "a laptop in Nicosia"; "a team of three"; Andreas "Operations Manager & Design Lead" on the card and in the schema | `about/page.tsx`, `src/app/layout.tsx` |
| B4 | Lumière Éclat and City Arcade carry `concept: true`; the homepage row tag reads "3D website · Concept"; the 3D page says "our studio concept" and "A studio concept" | `src/lib/work-projects.ts`, `WorkList.tsx`, `service-pages.ts`, `work/page.tsx` |
| B5 | Velricon line now "was written around the search it answers" | `service-pages.ts` |
| B6 | Replies "Within 24 hours" (facts, description, form confirmation); Where "Nicosia, Cyprus, working worldwide"; Hours "Monday to Friday, 9 to 5, Cyprus time" plus `openingHoursSpecification` (Mo to Fr 09:00 to 17:00) on #organization | `contact/page.tsx`, `ContactForm.tsx` |
| C1 | Button labels painted from data attributes with `::before`; the HTML holds the label once. Crawlers now read "Start a project", not "Start a projectSay helloStart a project…". Pixel-identical at rest and on hover | `Button.tsx`, `tokens.css` |
| C2 | "What we do" is a visually hidden h2; the sign is a div with the same classes, display words aria-hidden, brackets painted. Pixel-identical. /about h2 now "What we make, in one sentence." | `WhatWeDo.tsx`, `Reveal.tsx` (new `hidden` prop), `home.css`, `AboutOpen.tsx` |
| C3 | Each /work card link carries hidden text: name, service (with "concept"), year, line | `WorkCascade.tsx`, `work/page.tsx` |
| C5 | Phone in the footer bar on every page | `SiteFooter.tsx` |
| C6 | 16 descriptions cut to 129–158 characters (services, case studies, hubs, home, about); the case studies no longer all open "How Konaverse…" | data files and page metadata |
| D2 | `generate_lead` GA4 event on a sent contact form and on Calendly's `event_scheduled` | `ContactForm.tsx`, `src/app/(v4)/layout.tsx` |
| D3 | Mobile cookie card is a slim strip: one line with the policy link, then the two buttons (about 16% of the screen instead of 43%). Desktop unchanged | `CookieConsent.tsx`, `tokens.css` |
| D5 | Sitemap dates: hosting pass 2026-10-14 for the service pages, /work/tdk 2026-10-12, today's pass on home, about, contact, work and three service pages | `src/app/sitemap.ts` |
| D6 | /services CollectionPage with mainEntity → ItemList; `hasOfferCatalog` Service stubs with name and url; Person nodes on /about no longer carry a second description | `services/page.tsx`, `layout.tsx`, `about/page.tsx` |

Verification: `tsc` clean; production build clean; `node tools/seo-gate.js http://localhost:3005` PASS (25 pages, 5 redirects, 3 retired URLs); crawler text compared live vs local on 8 pages; screenshots live vs local at 1536×730 and 390×844, with the buttons and the desktop sign pixel-identical.

### Not changed, and why

- **D4, the no-JS menu.** The underlay menu is documented to render open without JavaScript as a sitemap "over the page's right edge"; in practice the panel covers the whole screen. A design decision for the owner.
- **Case-study authors (D6).** Needs the owner to say who wrote each study.
- **Phase 2 design items.** The /services hub band, a person and tap-to-call on service pages, the "3d website design agency" phrasing, visible founder bios on /about.
- **The Blender toolset line on /about** ("Every 3D object on our sites is modelled, lit and rendered here, then brought to the browser as a loop") still conflicts with Lumière Éclat's real-time WebGL. "Path-traced" itself was removed from the 3D page and the homepage card (owner, 21 Oct).
- **Performance items (E).** On hold by owner decision.
- **Sanity.** The cost post's `updated` field and the two long post descriptions (192 and 212 characters) are CMS edits.

### Owner actions

1. Delete the `melt-hero` Vercel project (Settings → Delete Project; link from the Vercel tools: https://vercel.com/d?to=%2Fkonaverse%2Fmelt-hero%2Fsettings%2Fgeneral%23delete-project). Then remove its DNS record if one exists, and optionally request removal in Search Console.
2. Clutch: city Nicosia, phone "+357 96 273855", one team size, service descriptions linking to their pages.
3. Business Profile: website link to /services/web-design, photos, the review ask.
4. After deploy: mark `generate_lead` as a key event in GA4 and review the `ads_conversion_Contact_Us_1` trigger.
5. Make the Business Profile hours match: Monday to Friday, 9:00 to 17:00.

### Client footer credits (approved by every client, toward the homepage)

Change `https://www.kona-verse.com` to `https://kona-verse.com` and add `nofollow` (plan §8) on each site; add the credit where it is missing.

- **Velricon:** `~/Projects/Velricon/src/components/layout/Footer.tsx:129`. That repo has staged SEO work from another session, so it is left alone here.
- **TDK:** `~/Projects/TDK_Design_&_Build/tdkdb`.
- **Los Santos Barbers:** a credit was committed (05efb24) but not found live.
- **Heimat and Chris n Clean:** not on this machine.

Each needs its own deploy.

## Leftovers, 22 October (owner: "the small leftovers need to be ran")

### Changed in the code (committed bbd3a67, pushed 22 October)

| Finding | Change | Files |
|---|---|---|
| D4 | Without JavaScript the menu panel and its button stay hidden; the footer carries the same links. Checked with JavaScript off on /, /services and /contact (mobile and desktop), and with it on (button and calendar unchanged) | `src/components/v4/UnderlayMenu.tsx` |
| D7 favicon | `/favicon.ico` (16, 32, 48 px) generated from `src/app/icon.png`; was 404 | `public/favicon.ico` |
| D7 OG image | Default sharing image now `og-image1.jpg`, 172 KB, encoded from the 734 KB `og-image1.png` master (same picture) | `public/og-image1.jpg`, `src/lib/site.ts` |
| D7 RSS | `/blog/rss.xml`: RSS 2.0 from the published Sanity posts, 60-second refresh like the sitemap; linked from /blog with `rel="alternate"`; was 404 | `src/app/(v4)/blog/rss.xml/route.ts`, `blog/page.tsx` |
| D7 Calendly titles | The no-script inline calendar has its own title, so the two frames on /contact no longer share one | `CalendlyInline.tsx` |
| D7 CSP | `Content-Security-Policy: object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests`. Structural only: it names no script, style or frame source, so GA, Clarity, Ahrefs, Sanity and the preloaded Calendly frame load as before (calendar checked on /contact) | `next.config.ts` |

Verification: `tsc` clean; production build clean; `node tools/seo-gate.js http://localhost:3005` PASS (25 pages, 5 redirects, 3 retired URLs).

### Not changed, and why

- **HSTS `includeSubDomains`.** Any subdomain served over plain HTTP would stop loading for visitors who have been to the site, and email link-tracking subdomains are often HTTP. No SEO effect either way. Leave as is unless every subdomain is confirmed HTTPS.
- **`http://www` takes two hops** (http to https on www, then www to the apex). The first hop happens before the app; one hop needs a redirect rule at Cloudflare (`http(s)://www.kona-verse.com/*` to `https://kona-verse.com/$1`, 301). Owner's dashboard; very low impact.
- **City Arcade and Lumière "Visit site" links** go to `*.vercel.app` because that is where the concepts live. Attaching a kona-verse.com subdomain to each Vercel project would keep the links on the brand; then the two `href`s change in `work-projects.ts` and `case-studies.ts`. Owner's call.
- **Case-study authors (D6).** Still needs the owner to say who wrote each study.
- **Melt-hero** returns 404 on 22 October: deleted.
