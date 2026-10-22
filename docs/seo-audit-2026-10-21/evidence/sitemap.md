# Sitemap and crawl coverage audit, 21 Oct 2026

Score: 90/100

## Validation (live)
- https://kona-verse.com/sitemap.xml: 200, Content-Type application/xml, valid urlset, 25 URLs (limit 50,000), absolute apex https URLs, no priority/changefreq. PASS.
- www.kona-verse.com/sitemap.xml 308 to apex. PASS.
- robots.txt (src/app/robots.ts:41) declares `Sitemap: https://kona-verse.com/sitemap.xml`; allows all but /api/. PASS.
- GSC (sc-domain:kona-verse.com): sitemap.xml [processed], errors=0, warnings=0. Submitted/indexed counts not exposed by the tool (it points to URL Inspection for indexation). PASS.
- All 25 URLs: 200, `index, follow`, self-canonical (verified by curl; one-page-websites showed a web-design canonical in the first loop run but 4 re-fetches all return its own URL; not reproducible, treat as a transient fetch artefact, SUSPECTED harmless). CONFIRMED FIXED vs 13 Oct (service pages indexable, in sitemap).
- Sanity posts: sitemap.ts:50-51 uses getSitemapPosts() (src/sanity/posts.ts:104, published perspective, no CDN, revalidate 60). The 3 live posts are all listed; blog index is also linked to all 3. PASS.

## Coverage both ways
- Every sitemap URL is internally linked: home links to all 6 services, 4 of 7 case studies, blog + 3 posts, legal; /work links all 7 cases; /services links all 6; /blog links 3 posts. No orphans. PASS.
- No internally linked indexable page is missing from the sitemap (checked hrefs on /, /services, /work, /about, /blog, /contact; only assets/manifest otherwise). PASS.
- /blog/rss.xml 404 (no feed; informational, NEW, Info).

## Findings
1. MEDIUM, NEW. lastmod is stale for pages edited after the date. Hand-kept dates (src/app/sitemap.ts:21-33) lag git:
   - 6 service pages: lastmod 2026-10-03 (sitemap.ts:48 COPY_PASS) but commit 4163edf (14 Oct, "Price hosting by the year") rewrote pricing copy in src/lib/service-pages.ts (47 lines) and services/[slug]/page.tsx. Real change 2026-10-14.
   - /contact: 2026-10-03, but same commit 4163edf changed src/app/(v4)/contact/page.tsx (14 Oct).
   - /work/tdk: 2026-10-02 (LAUNCH), but commit 6452139 (12 Oct) changed TDK links in case-studies.ts and work-projects.ts.
   - /work (index) likewise, and / (homepage): blog navigation added 11 Oct (e67b12e, site.ts), sitemap says 2026-10-03.
   - /blog/nextjs-vs-webflow 10-10 and /blog 10-10 come from Sanity `updated`; fine.
   Fix: in src/app/sitemap.ts add UPDATED entries (or a HOSTING_PASS = new Date('2026-10-14') used for services and /contact; '/work/tdk' 2026-10-12; '' 2026-10-11 or later). Consider deriving per-service dates from a field in service-pages.ts.
2. LOW, STILL OPEN (design). Date-only granularity is stored as full ISO midnight UTC ("2026-10-03T00:00:00.000Z"); valid W3C datetime, no action.
3. LOW. Many lastmod values identical (LAUNCH 2026-10-02 on 10 URLs, 10-03 on 9) is a consequence of the hand-kept scheme; honest only if real. Fine once finding 1 is fixed.
4. INFO. Blog sitemap reads Sanity at build/revalidate; new posts appear within the 60s revalidate window only if the sitemap route is regenerated; check after publishing next article (SUSPECTED low risk; not tested).

No sitemap index needed (25 URLs). No city/location pages. No noindexed, redirected or non-200 URLs in the sitemap.
