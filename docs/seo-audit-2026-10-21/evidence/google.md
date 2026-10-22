# Google data audit, 21 Oct 2026 (Konaverse)

Tier 2 credentials (service account for GSC, OAuth for GA4). Property always passed explicitly: `sc-domain:kona-verse.com`, GA4 `534373757`. Raw JSON in `evidence/google/`. Runner: `claude-seo run gsc_query.py|gsc_inspect.py|ga4_report.py ...`; GA4 channel/source/event tables came from a read-only script using the plugin's own auth (`ga4_extra.json`). Freshness: GSC ends 18 Oct (2-3 day lag), GA4 through 20 Oct, URL Inspection is live.

## 1. Headline: service pages one week after the 14 Oct indexing request

URL Inspection, all 25 sitemap URLs (`gsc_inspect.py --batch urls.txt --site-url sc-domain:kona-verse.com --json` -> `inspect_all.json`). Summary: 21 PASS, 4 NEUTRAL, 0 fail.

| URL | State 21 Oct | Last crawl | Status vs 14 Oct |
|---|---|---|---|
| /services/web-development | Submitted and indexed | 2026-10-20 23:19Z | CONFIRMED FIXED |
| /services/one-page-websites | Submitted and indexed | 2026-10-20 23:50Z | CONFIRMED FIXED |
| /services/website-redesign | Submitted and indexed | 2026-10-20 23:39Z | CONFIRMED FIXED |
| /services/web-design | Discovered - currently not indexed | none | STILL OPEN (was "unknown"; now discovered, but never crawled, although its live test passed on 14 Oct) |
| /services/3d-websites | URL is unknown to Google | none | STILL OPEN |
| /services/seo | URL is unknown to Google | none | STILL OPEN |
| /privacy | URL is unknown to Google | none | STILL OPEN (was "discovered, not indexed" 14 Oct; now reads as unknown, no progress) |

Half of the service pages (3 of 6) were crawled and indexed in a burst on the evening of 20 Oct, a week after the request. The other three, including the primary page /services/web-design, were not. Many other URLs were recrawled in the same window (tdk, city-arcade, chris-n-clean, heimat, about, 2 blog posts, 20 Oct 21:00-23:30Z), so this looks like a general Googlebot visit, not three isolated requests (SUSPECTED).

The other 17 URLs are indexed, with Google canonical = user canonical (apex, self-referencing) on every one. Rich results returned PASS for 20 indexed pages (not returned for /, /terms, /cookies). Mobile usability is deprecated in the API (no issues). Stale-crawl notes: /work/lumiere-eclat last crawled 13 Oct, /terms 4 Oct, /contact and /cookies 15 Oct. The homepage inspection lists a referring URL `linkmarketingpro.com/all/1639/2.html`, a link-spam directory (the spam links noted on 13 Oct).

Sitemap (`gsc_query.py sitemaps`): `https://kona-verse.com/sitemap.xml`, submitted 2026-10-03, 0 errors, 0 warnings, 24 web URLs submitted. The sitemap has 25 URLs, so 24 vs 25 is the same discrepancy as 13 Oct (STILL OPEN, low; may be stale from the 3 Oct submission; resubmitting refreshes it).

## 2. Search Console performance

Totals use `totals_complete: true` (dimensionless aggregate).

| Window | Clicks | Impr | CTR | Pos |
|---|---:|---:|---:|---:|
| 28d (23 Sep to 18 Oct) | 16 | 398 | 4.02% | 9.4 |
| 90d (23 Jul to 18 Oct) | 30 | 521 | 5.76% | 10.1 |
| 13 Oct report, 3 months | 31 | 317 | 9.8% | 9.5 |

Impressions rose from 317 to 521 in the 3-month view (+64%, small numbers). Daily impressions went from 0-2 in late Sept to 19-47 a day from 8 Oct (peak 47 on 13 Oct, 19 on 17-18 Oct). Clicks stay at 0-3 a day, and are too few to infer a trend. CTR fell because the new impressions are low-click client-brand queries.

Query rows are partial. The 28d query rows sum to roughly 178 impressions and 2 clicks, against 398 and 16 in the totals. The rest is anonymised query volume (about 14 of 16 clicks), most likely the Konaverse brand and homepage visits (SUSPECTED). The brand rows therefore understate brand traffic.

Brand split, 28d, visible rows only (`q28_query.json`):
- Client brands, about 150 impr: chris n clean / chris and clean / chris clean / chris cleaning services 64 (pos 7.8 to 9.3), los santos (barber/barbershop) 52 (pos 7.2 to 9.4), eclat lumiere / lumiere eclat 15, the city arcade 9, tdk (development, building, architects, design) 9, heimat group 1. Only 2 clicks: "chris n clean" 1, "tdk development" 1.
- Konaverse brand and typos: "konaverse" (90d) 8 impr, 3 clicks, pos 1.2; typos kanaverso, kkkonverse, konoverse, cana verse, cοnverse (Greek omicron, 14 impr in 90d, a Converse collision).
- Non-brand: 26 impressions, 0 clicks in 28d.

| Non-brand query (28d) | Impr | Pos |
|---|---:|---:|
| website cost cyprus | 6 | 14.0 |
| website design cyprus prices | 5 | 15.4 |
| redesign website without losing seo | 3 | 55.3 |
| change domain without losing seo | 2 | 79 |
| overlay client site without losing seo | 2 | 76 |
| kıbrıs web tasarım fiyatları | 2 | 72.5 |
| kona web design / kona website design | 2 / 1 | 23 / 12 |
| "sanity cms", ahrefs, konversion website | 1 each | 15 / 60 / 92 |

Status: first non-brand impressions exist (NEW; 13 Oct had zero). They come from the blog cost and redesign posts. The best, "website cost cyprus" and "website design cyprus prices", sit at positions 14 to 15 on 5-6 impressions; too small a sample to conclude anything beyond "the cost post is being tested on page 2". No impressions at all for "web design cyprus", "web development cyprus", "immersive website design" or "scrollytelling". No service-page URL appears in any Search Analytics page row (90d, `q90_qp.json`), apart from the /services hub (24 impr, pos 4.3).

Pages, 28d (`q28_page.json`): / 12 clicks/65 impr; /work/tdk 2/33; /work/chris-n-clean 1/102 (largest impression block); /work/city-arcade 1/18; /work/los-santos-barbers 0/79; /blog/website-cost-cyprus 0/38; /terms 0/31; /about 0/28; /services 0/24; /blog/redesign-website-without-losing-seo 0/14 at pos 37.9. Also appearing: `melt-hero.kona-verse.com` (2 impr; an old subdomain, NEW), `www.kona-verse.com/` (3-4 impr), `http://kona-verse.com/` (1). /pricing (22 impr in 90d, none in 28d) and /projects (15 in 90d, 2 in 28d) are fading as redirects are processed (CONFIRMED FIXED trend).

Country (90d): Greece 13 clicks/58 impr (pos 2.8), India 5/21, Cyprus 4/197 (pos 7.9), USA 1/91 (pos 21.7), UK 0/22, Germany 0/15. Cyprus is 38% of impressions but 13% of clicks. GA4 also lists Greece first (24 of 40 organic sessions from 5 users), so Greek clicks are probably a few repeat visitors, not demand (SUSPECTED).
Device (90d): desktop 23 clicks/264 impr, mobile 7/252, tablet 0/5.

## 3. GA4 (property 534373757)

Organic Search sessions: 28d 30 (19 users), 90d 40 (27 users), 112 pageviews, about 2 sessions a day. Too small for trends. 28d organic landing pages: / 18 sessions (5 users), /work/city-arcade 4, /work 3, redesign-SEO post 2, /about 1, /work/tdk 1, (not set) 1. Organic desktop is 37 of 40 sessions. Organic sources (90d): google 37, bing 1.

Channel mix, all sessions (`ga4_extra.json`):

| Channel | 28d sessions | 90d sessions |
|---|---:|---:|
| Direct | 83 | 269 |
| Organic Social (ig / social) | 43 | 164 |
| Organic Search | 30 | 40 |
| Referral | 7 | 24 |
| Unassigned | 2 | 9 |

Organic Search is about 18% of 28d sessions (30 of 165). Direct is probably inflated by the owner and untagged traffic (SUSPECTED). Referrals: vercel.com 16 (deployment previews, probably the owner), instagram/facebook, velricon.com 4, calendly.com 3, themanifest.com 1 (28d), search.google.com 2. AI assistant referrals: none in 90d (no chatgpt.com, perplexity.ai, claude.ai, gemini or copilot session). STILL OPEN as a GEO gap, but traffic is too low to judge.

Sessions landing on service pages in 28d (any channel): /services/3d-websites 2, /services/seo 1, /services/web-design 1, /services/web-development 1, so the pages are visited though Google does not yet know three of them.

Events and conversions (28d / 90d): page_view 633/1861, click 38/88, form_start 2/5. The only key event is `ads_conversion_Contact_Us_1`: 13 events, all within the last 28d. There is no generate_lead, form_submit, form-success or Calendly booking event (STILL OPEN, medium). form_start fired 5 times in 90d with no completion event, so the contact funnel is unmeasurable. 13 Ads-conversion fires against 10 /contact landing sessions looks like a misfiring tag or tests (SUSPECTED); verify the tag.
GA4 90d landing pages also include dev or stale paths: /design-system 8, /object-scrub 3, /edesign-system 1, /proto-shatter 1, /services/3d-website 1, /work/dt-tzankatian 1, /projects 3. These are probably the owner's tests (SUSPECTED); confirm those routes are 404 or noindex in production and that the anonymised client path is gone.

## 4. Core Web Vitals

CrUX origin and URL: no data (`crux_history.py https://kona-verse.com --origin --json`: "Insufficient Chrome traffic volume"; PSI field_metrics empty). Same as 13 Oct (STILL OPEN, expected at this traffic). PSI lab only (`pagespeed_check.py https://kona-verse.com/ --json`, one run): mobile Performance 27, Accessibility 100, Best Practices 73, SEO 100; FCP 10.3 s, LCP 22.7 s, TBT 2,680 ms, CLS 0, Speed Index 12.1 s. PSI's throttled mobile profile with the WebGL/video hero probably exaggerates this; treat as one data point to compare with the performance agent's runs. It is not field data.

## 5. Findings by priority

1. HIGH, STILL OPEN: /services/web-design (discovered, never crawled), /services/3d-websites and /services/seo (unknown) not indexed after 7 days. Fix: the pages themselves are sound (three siblings indexed). Add real inbound links to those exact URLs (Clutch profile, GBP website link, directories, client footers) and descriptive internal links from the indexed service pages and blog posts. Indexing API is out of scope.
2. HIGH, CONFIRMED FIXED (partly): web-development, one-page-websites and website-redesign indexed 20 Oct.
3. MEDIUM, NEW: first non-brand impressions (26 in 28d, 0 clicks). Cost post at page 2 for "website cost cyprus".
4. MEDIUM, STILL OPEN: no contact or booking conversion events in GA4; a suspicious Google Ads conversion event.
5. MEDIUM, STILL OPEN: /privacy unknown to Google; sitemap reports 24 of 25.
6. LOW, NEW: `melt-hero.kona-verse.com` in Search Console; dev routes visited in GA4.
7. LOW: zero AI-assistant referrals; zero CrUX data; Bing 1 organic session; spam referrer linkmarketingpro.com (monitor).

Caveat: all samples are tiny (30 organic sessions, 16 clicks); no trend or rank claims beyond those stated.
