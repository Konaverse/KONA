# Backlinks audit, 21 Oct 2026 (kona-verse.com)

Raw data: evidence/backlinks/ (auth.json, bing-links.json, bing-counts.json, verify.json, links.json, client homepage HTML).
Score: INSUFFICIENT DATA for the plugin health score (fewer than 4 factors have a source). Judgement score 35/100 (genuine profile near zero, spam ignored per plan).

## Sources
- Bing Webmaster: returns 0 links / 0 counts for https://kona-verse.com. Cause (observed): the only verified site in the plugin config is www.velricon.com; the CLI warns kona-verse.com is not in bing_verified_sites. So this is "no access", NOT proof of zero links. STILL OPEN: add the property to config or read links in the Bing UI.
- Common Crawl: my foreground runs timed out, but the background run completed (evidence/backlinks/cc.json): kona-verse.com NOT in the cc-main-2026-jan-feb-mar graph (in_crawl false, no PageRank/harmonic centrality). Expected: the graph predates the late-Aug 2026 relaunch and spam links. Confidence 0.50, domain-level.
- Moz/Semrush/Ahrefs: not used (out of quota/unavailable). Latest known data = Ahrefs 13 Oct (907 RD, ~1,000 backlinks, DR 21, almost all flagged spam, genuine in single digits). Not re-measured today.

## Findings
1. MEDIUM, NEW. Client credit links point at https://www.kona-verse.com (www), which 308s to the apex. Verified in raw HTML: tdkdb.com/en ("Design by Konaverse"), velricon.com (www) ("Design by Konaverse"), heimat-group.com ("Design by Konaverse"). All carry rel="noopener noreferrer" only, so they are DOFOLLOW sitewide footer links. Each goes through a redirect (small dilution, avoids nothing). Fix: ask clients to change the href to https://kona-verse.com/ (or accept; 308 passes signals).
2. MEDIUM, NEW (policy risk). Those credit links are sitewide footer links with dofollow, while the plan §8 says "brand anchor, nofollow, client's choice, never in a contract". Observed state is dofollow, contradicting the plan. Google's spam policy (28 Aug 2026 per plan §10) covers sitewide/contract footer links. Brand anchor and 3 domains is low risk, but recommend rel="nofollow" (or sponsored) on credits, and never write them into contracts.
3. LOW/INFO. lossantosbarbers.com and chrisnclean.com: homepage returns 200, no kona link (verify_backlinks: link_removed; grep for "kona" empty). Possibly never added, or credit is on another page or JS-rendered (SUSPECTED, not checked). City Arcade is on a vercel.app subdomain (city-arcade-roan.vercel.app), not checked, no link value.
4. HIGH, STILL OPEN. Zero verified external links to any /services/* page. All links found target the homepage ("/"). Consistent with the 13/14 Oct state read. Clutch profile: 0 reviews as of 13 Oct (not re-fetched today; Clutch blocks scrapers).
5. INFO, CONFIRMED (per 13 Oct doc, not re-measured): spam link flood to the homepage; no manual action known; no disavow. Correct policy. Do not disavow. Check GSC Manual Actions monthly.

## Genuine links known
- 3 verified (TDK, Velricon, Heimat): footer credits, homepage target, dofollow, via www redirect.
- Clutch profile exists (live listing, link target not verified today). GBP website link: not verified.

## Opportunities to link to /services/* (ranked effort then realism)
1. Clutch profile (verified listing, 4 service categories): set the website field and add per-service portfolio links where Clutch allows. Low effort, high realism; reviews still the real gap.
2. Google Business Profile: website URL to homepage, but add Services links/"Products/Services" entries with each /services/slug URL. Low effort.
3. Other directories from plan §8 (Sortlist, DesignRush, GoodFirms, TechBehemoths, Bing Places, Apple Business Connect, LinkedIn page): profiles let you set service-level URLs. Low to medium effort, usually nofollow but give discovery. NAP identical (+357 96 273855).
4. Client credit links: change the target of the existing three from homepage to the relevant service page (e.g. Velricon to the 3D/immersive service, TDK to web development). Deep link, brand anchor, client's choice, nofollow preferred. Very low effort.
5. Case-study pages on client sites or client "launch" posts/press mentions linking to a service page. Medium effort.
6. Showcase galleries (Awwwards, CSSDA, a1.gallery, One Page Love, three.js showcase): link to the project or homepage; service-page link is rare. Medium effort, low service-page value but real genuine links.
7. Guest article / local press (Cyprus Mail business, startup community) with a data piece from the blog (cost article) that links to the web design cost service page. Medium-high effort.
8. Do NOT buy links, do not add contractual footer links, do not use link-baron style services (those flagged domains are exactly this).

## Not done
No Moz, no outreach, no edits. Bing yielded no data (not verified); CC says the domain is absent from the Jan-Mar 2026 graph.
