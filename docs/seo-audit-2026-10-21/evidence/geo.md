# GEO / AI search readiness: kona-verse.com, 21 October 2026

Read-only audit. Raw HTML was fetched with curl and the plugin's `render_page.py --mode never` (`is_spa: false`). Visible text was extracted with a stdlib parser that drops script, style, template and svg. Search pages were fetched over plain HTTP. The coordinator stopped the run early, so section 6 is partial and says what was not checked.

**Caveat on search results:** presence in Brave, Bing or DuckDuckGo only approximates AI-answer visibility. It does not measure it. No AI engine was queried today, and DataForSEO tools were not available.

## Score: 66 / 100

| Dimension | Weight | Score | Basis |
|---|---|---|---|
| Citability | 25% | 78 | Every service page opens with a short-answer passage that gives the price and timeline. The cost post answers in its first 60 words and has a table. Home, about and the hubs are vague or thin. |
| Structural readability | 20% | 65 | Blog H2s are written as questions. Service H2s are slogans. Split-word headings and duplicated button labels add noise to extracted text. The /work hub has 35 words. |
| Multi-modal | 15% | 60 | Content images have descriptive alts and the blog posts have tables. There is no video and no YouTube presence for the studio. |
| Authority & brand | 20% | 30 | Bylines, dates and Person schema with LinkedIn are present. Off-site there are 0 reviews and a brand-name collision. The studio's city is missing on the site and the team size contradicts itself. |
| Technical accessibility | 20% | 92 | Every AI user agent gets 200 with identical bytes. robots.txt has explicit groups. Pages are server-rendered and the email address is not obfuscated. |

The weighted total is 65.9, rounded to 66.

Platform estimates (inference, not measured):
- **Google AI Overviews: 45.** The service pages were "Discovered, not indexed" on 14 Oct. That was not re-checked today.
- **ChatGPT: 45.**
- **Perplexity: 40.** It mentioned Konaverse in 0 of 10 prompts on 4 Sep. Not re-run.
- **Bing Copilot: 30.** Bing showed 0 impressions on 13 Oct.

## 1. AI crawler access

### CONFIRMED FIXED: the Cloudflare AI-bot block no longer fires

On 2 Oct, GPTBot, ClaudeBot, CCBot, Amazonbot and Bytespider got 403. Today 17 user agents were tested against `/`, `/services/web-design`, `/blog/website-cost-cyprus` and `/robots.txt`:
- Every request returned **200**.
- Byte counts were identical on each URL (105,976 / 133,509 / 100,666 / 331).
- No `cf-mitigated` header appeared.
- The user agents were: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Googlebot, Bingbot, Applebot, CCBot, Bytespider, Amazonbot, Meta-ExternalAgent and Chrome.

Caveat: these requests came from a residential IP with a spoofed user agent. Cloudflare's verified-bot rules use IP and rDNS, so a real crawler could still be treated differently. To be definitive, look at Cloudflare → Security → Bots, and check Security Events for verified AI crawlers. The 2 Oct test used the same method and did get 403s, so the change is real.

### robots.txt

The live file matches `src/app/robots.ts:14-33`, and no Cloudflare managed-robots block is prepended. It has:
- an explicit group: `Allow: /`, `Disallow: /api/` for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User and Applebot;
- the same rules under `*`;
- `Sitemap: https://kona-verse.com/sitemap.xml`.

| Bot | What it governs | robots.txt | HTTP |
|---|---|---|---|
| OAI-SearchBot | ChatGPT Search index | Allowed (explicit group) | 200 |
| ChatGPT-User | ChatGPT fetching a page for a user | Allowed (explicit) | 200 |
| GPTBot | OpenAI training only | Allowed (via `*`) | 200 |
| Claude-SearchBot | Claude search citability | Allowed (explicit) | 200 |
| Claude-User | Claude fetching a page for a user | Allowed (explicit) | 200 |
| ClaudeBot | Anthropic training only | Allowed (via `*`) | 200 |
| PerplexityBot / Perplexity-User | Perplexity index / user fetch | Allowed (explicit) | 200 |
| Googlebot | Google Search, AI Overviews and AI Mode | Allowed (explicit) | 200 |
| Google-Extended | Gemini/Vertex training and grounding; never AIO inclusion | Allowed (via `*`) | Not a fetcher: it is a robots token only. The 200 came from a synthetic request. |
| Bingbot | Bing index, which feeds Copilot | Allowed (explicit) | 200 |
| Applebot | Siri, Spotlight and Safari | Allowed (explicit) | 200 |
| Applebot-Extended | Apple Intelligence training only | Allowed (via `*`) | Robots token only |
| CCBot, Bytespider, Amazonbot, Meta-ExternalAgent | Training | Allowed (via `*`) | 200 |

This is consistent with owner decision 3: AI bots are allowed.

### Info: llms.txt and RSL

`/llms.txt`, `/llms-full.txt` and `/license.xml` (RSL) all return 404. llms.txt was removed deliberately (plan §2). There is no evidence-based reason to bring it back.

## 2. Raw HTML (AI fetchers do not run JavaScript)

**CONFIRMED (positive).** All 16 sampled pages return 200 with their copy in the HTML.

- **Service pages:** 776–1,032 body words in raw HTML, with prices, timelines, add-on tables, the process and running costs.
- **Blog posts:** 1,306–2,079 words.
- **Case study** (/work/los-santos-barbers): 1,210 words.

**CONFIRMED FIXED:** Cloudflare email obfuscation is gone. None of the 16 pages contains `email-protection`, `__cf_email__` or `[email protected]`. `info@kona-verse.com` appears as plain text on home, contact and in the footer.

**CONFIRMED FIXED:** the cost post now prices hosting by the year: "Our hosting is €300 a year, or €600 a year for a site with a CMS".

## 3. Passage-level citability

| Page | Answer passage | Where | Facts in it |
|---|---|---|---|
| /services/web-design | "The short answer", 73 words | 3.9% of body | €1,800 design, €2,500 designed and built, 4–6 weeks, five pages |
| /services/web-development | 77 words | 3.8% | €1,800 / €2,500, Next.js |
| /services/3d-websites | 53 words | 4.8% | €6,000, 8–12 weeks, "60 fps on a mid-range phone" |
| /services/one-page-websites | 54 words | 5.6% | €1,200, 2–3 weeks |
| /services/website-redesign | 76 words | 5.1% | €2,500, 4–8 weeks |
| /services/seo | 65 words | 5.4% | €500 audit, €300 a month, 3-month minimum |
| /blog/website-cost-cyprus | Answer in the first ~60 words, then a 6-row table | First € at 3% | 23 numbers in the first 30% |
| /blog/nextjs-vs-webflow | Answer in the first ~55 words | Opening | Links to Webflow and Next.js documentation |
| /blog/redesign-website-without-losing-seo | Answer in the first ~70 words, then "172 / 224 / 57 / 176 of 176" | Opening | First-party migration numbers, anonymised |

Strengths: each answer passage stands on its own and names the brand, what the service is, who it is for, the price and the timeline. All three posts have bylines that link to people with LinkedIn, visible dates and `BlogPosting` schema.

### Medium, NEW: the cost post answers "what does Konaverse charge", not "what does a website cost in Cyprus"

- **Evidence:** the post says "Those are our own starting prices… Every number in this article is from our own projects or price list." The only market figure is "advertisements… quoted prices from €800" (September 2026). keyword-research.md §1.4 records that the generic AI Overview was built from six Cyprus agency posts.
- **Fix (owner/editorial):** add a dated, sourced range of published Cyprus starting prices (named public price pages, date recorded) next to the studio's own table.
- **Status:** SUSPECTED impact. It follows the studio's research standards.

### Medium, STILL OPEN: no 3D cost article is live

"3d website cost" currently rests only on /services/3d-websites (€6,000 plus add-ons from €500–€800). The draft exists but is waiting on the owner to accept the 3D pricing structure.

### Low, NEW: service-page H2s are slogans, not answers

Examples are "Design the website you want" and "Make the screen a place". The H3s are customer quotes. The blog H2s are already questions ("Is a €1,200 one-page website enough?"). This is optional. Google says content does not need to be chunked for AI.

## 4. Entity clarity

### Medium, NEW: the studio's city is missing, and the one place given conflicts

- The /about visible text mentions "Cyprus" **0 times**.
- The only location stated for the studio is "two people and a laptop in **Limassol**" (`src/app/(v4)/about/page.tsx:207`).
- Clutch lists Lakatameia (seo-state-2026-10-13). Home and contact say only "Based in Cyprus" and "Cyprus, working worldwide".
- Schema has `addressCountry: CY` only. That is correct under owner decision 1 until the Google Business Profile shows an address.
- **Fix:** add one visible entity sentence on /about (and optionally home) giving the city, founding year and founders, worded by the owner. Add `foundingDate` to `#organization` once confirmed.

### Medium, NEW: the team size contradicts itself

- The 2025 timeline entry says "a team of two that stays two" (`about/page.tsx:209`).
- The meta description says "three people" (`about/page.tsx:106`).
- Schema lists three founders. Clutch says 2–9.
- **Fix:** the owner rewords the 2025 line.

### Low, NEW: founder bios exist only in JSON-LD on /about

"the part nobody sees…" appears in the HTML only inside the `Person.description` script. The visible cards show name and role only. Text extractors get no bios, and the structured data does not match what is visible. The blog bylines do show the bios visibly.

### Low, STILL OPEN (plan §2 P1): the /work hub raw text is 35 words

Project names appear only in image alts and `data-name` attributes (`src/components/v4/WorkCascade.tsx:630`).

### Low, NEW: split and duplicated text in extracted copy

- The home H2 reads as `WhatWe()Six servicesDo` (`src/components/v4/WhatWeDo.tsx:35-60`). Its `aria-label` is correct, but text parsers ignore it.
- Duplicated button labels on every page read as "ContactContactContactContact" and "Start a projectBook a call…" repeated about 9 times.

### Positive

- `#organization` is typed Organization + ProfessionalService, with phone, email, areaServed, knowsAbout, an OfferCatalog of the 6 services and 3 founders.
- Person nodes include LinkedIn `sameAs`.
- `sameAs` has Instagram, Facebook and LinkedIn but not Clutch. Add the Clutch URL after verifying it.

## 5. Off-site footprint (partial)

**Client credits**, checked in raw HTML today:
- tdkdb.com, velricon.com and heimat-group.com link to `https://www.kona-verse.com`, which redirects with a 308 to the apex. They should point at the apex.
- lossantosbarbers.com and chrisnclean.com: no mention found.

**Common Crawl** (the backlinks agent's cc.json): kona-verse.com is not in the Jan–Mar 2026 crawl.

**From 13 Oct, not re-checked:** Clutch 0 reviews, GBP 0 reviews, Bing 0 impressions. Perplexity 0/10 was from 4 Sep and not re-run.

## 6. Search presence (approximates AI answers; does not measure them)

### High, STILL OPEN: weak brand-query presence and a name collision

**DuckDuckGo, "Konaverse"**, in result order:
1. konaverse.libsyn.com
2. instagram.com/konaverse.cy (the studio's)
3. konaverse.konabos.com
4. konayachi.com
5. open.spotify.com
6. youtube.com/@Konaverse (owner not verified)
7. linkedin.com/company/konaverse (the studio's)
8. **kona-verse.com/work/lumiere-eclat**
9. findglocal.com directory scrape
10. a LinkedIn post

The homepage is not in the top 10.

**Brave, "Konaverse"** (Brave feeds Claude): the first ~15 result links were Konabos's "Konaverse" podcast, searchstax.com, unrelated Reddit threads and YouTube. **kona-verse.com does not appear.** The page contained 3 captcha/PoW string matches, possibly in its scripts.

**Bing, "Konaverse":** the response (88 KB) had no `b_algo` results to parse. Result unusable.

**Not checked** (stopped by the coordinator): "web design agency Cyprus", "immersive website design studio", "how much does a website cost in Cyprus" and "3d website cost" on all three engines; Bing for every query; Wikipedia, Reddit and YouTube mention counts; the content of the Clutch and LinkedIn pages.

**Fix:**
- Reviews on Clutch and GBP (decision 5).
- Directory listings with consistent NAP and "Konaverse, web design studio in Cyprus" in each profile bio, so engines can tell it apart from the Konabos podcast.
- Ask clients to point their credit links at the apex.
- Do the plan §3 Brave presence check.

## Top 5 changes

1. **Reviews and profiles off-site** (Clutch, GBP, directories). Effort: weeks, owner-led. Impact: highest.
2. **Entity sentence on /about and fix the team-size line.** Effort: 15 minutes of copy, owner wording.
3. **Sourced Cyprus market price range in the cost post.** Effort: 2–3 hours of research.
4. **Publish the 3D cost article** once pricing is accepted. Effort: done once the owner accepts.
5. **Visible bios on /about and names as text on /work.** Effort: 1–2 hours each; these are design decisions.
