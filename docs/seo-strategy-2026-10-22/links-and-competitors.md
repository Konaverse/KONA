# Links and competitor pages, 22 October 2026

Part of the 22 October strategy run (`BRIEF.md`). Two jobs: a footprint link gap (where the competitors are mentioned and listed, and whether Konaverse is there), and the comparison pages that fit Konaverse honestly.

**Method.** No paid backlink data exists (no Ahrefs, Semrush, Moz or DataForSEO), so this is not a referring-domain diff. It is a footprint search: WebSearch (US results, used only to find pages, never to judge rank), WebFetch of the pages found, and plain `curl` to read HTTP status and `rel` attributes where WebFetch was refused. Clutch serves `.md` copies of its pages, which made the Clutch lists readable. DesignRush, GoodFirms, TechBehemoths, The Manifest, G2, BuiltWith and UCY returned 403 to every script; those rows say "unverified", not "absent". Nobody was contacted, no account was created, no form was submitted.

**Labels.** **M** measured (a number or attribute I read from a tool, an HTTP response or the page source), **O** observed (seen on a page, URL given), **I** inferred (my judgement). "Snippet" means the fact came from a WebSearch result summary, not from opening the page.

**Binding rules applied** (BRIEF and plan §8): no bought links, no link schemes, client credits are brand anchor, nofollow, the client's choice and never in a contract, no self-promotional best-agency list that ranks Konaverse first, no Review/AggregateRating schema, no em dashes in proposed copy.

---

## Summary

1. **Konaverse is present on exactly one third-party business source: Clutch** (O, https://clutch.co/profile/konaverse). That profile has 0 reviews, still shows the Lakatameia street and "96273855", says "$5,000+" minimum project although the site sells a €1,200 one-page site, names Andreas Kyriakou "Technical Director" although /about now says Operations Manager and Design Lead, and links only to the homepage and four /work/ pages (O). Konaverse is **not** in Clutch's Cyprus web designers list, which now shows about 55 firms including six of our eight local competitors (O, https://clutch.co/cy/web-designers.md, ratings updated 21 Oct 2026).
2. **The local competitors' footprint is directories plus client credits, not press.** Absolute Websites, Web Theoria, GOOiZ, Mojo Design, avocadots and UntitledPros sit on Clutch, Sortlist, OneLittleWeb, RevenueBase, DesignRush, GoodFirms and TechBehemoths; Limdez and Web Theoria buy or hold banners on cypruswebdesigners.com; BuiltWith attributes 41 live client sites to Absolute Websites and 28 to Bridge Studios (snippet). I found no Cyprus press article about any of them (O, searches below). The gap is closable with free profiles and reviews; it is not a PR gap.
3. **The directories AI engines cite give nofollow links.** OneLittleWeb and RevenueBase both mark agency links `rel="nofollow noopener"` (M). Their value is in AI answers and discovery, not PageRank.
4. **The global studios' footprint is awards galleries and design press, which do pass links.** Lusion's Awwwards profile link and its Codrops feature links carry no `rel` (M). Lusion's fictional-product site ORYZO AI won Awwwards Site of the Month (April 2026) and a Codrops feature (O): the exact precedent for the Labs piece.
5. **The realistic 90-day target is 8 to 12 new genuine referring domains, at least 3 of them pointing at a /services/* URL, and at most one earned editorial mention.** Most of it is owner work in dashboards, free, under an hour each.
6. **Comparison pages:** the three that fit are template or builder vs custom (Cyprus-priced, feeds /services/web-design), pre-rendered video vs shader vs live 3D (feeds /services/3d-websites), and leaving Squarespace for a custom site (feeds /services/website-redesign). No page attacks a named Cyprus studio.

---

## Part 1. The footprint link gap

### 1.1 Competitors, domains and what was found

| Competitor | Domain | Third-party footprint found (22 Oct) |
|---|---|---|
| Absolute Websites | absolute-websites.com (O, OneLittleWeb) | Clutch CY list #17, 1 review shown (O); OneLittleWeb #2 (O); RevenueBase web-design-agencies #19 and web-designers #10 (O); DesignRush profile, "5.0 from 41 Google reviews" (snippet); TechBehemoths Limassol list (snippet); superbcompanies.com (snippet); BuiltWith agency page, 41 live sites (snippet); ranks for "template vs custom website" worldwide (O, Sept SERP autopsy) |
| avocadots | not confirmed by fetch | Wix Marketplace partner page, 4.8 from 25 reviews (snippet, https://www.wix.com/marketplace/wix-partner/avocadots); Clutch CY list #15 (O); TechBehemoths Nicosia list (snippet); LinkedIn posts claim two Cyprus Digital Marketing Awards (snippet, self-reported) |
| Mojo Design | mojodesign.io (O, OneLittleWeb) | Clutch CY list #9, 1 review (O); OneLittleWeb #20 (O); The Manifest profile (snippet, https://themanifest.com/company/mojo-design) |
| Limdez | limdez.com (O, cypruswebdesigners.com) | cypruswebdesigners.com featured banner (O); AngloInfo Cyprus directory with a Visit Website link (O); scraped list on rentechdigital (snippet). Not on the Clutch CY list, OneLittleWeb or the RevenueBase lists shown (O) |
| Web Theoria | webtheoria.com | Clutch CY list #10 (O); Sortlist Cyprus #16 (O); RevenueBase #11 (O); DesignRush profile, 33 Google reviews (snippet); GoodFirms (snippet); cypruswebdesigners banner (O); University of Cyprus career fair exhibitor page (snippet, 403 to fetch) |
| Bridge Studios | bridgestudios.com.cy (snippet, BuiltWith) | BuiltWith agency page, 28 live sites (snippet). Not found on Clutch, OneLittleWeb, RevenueBase or cypruswebdesigners (O). With 10 ranking URLs and full schema (plan §10), its links are probably client credits plus on-page work (I) |
| UntitledPros | not found by search (O) | Clutch CY list as "UntitledPros™ Creative Studio" (O); GoodFirms Limassol (snippet) |
| GOOiZ | gooiz.com (O, OneLittleWeb) | Clutch CY list #25, 1 review (O); OneLittleWeb #14 (O); Sortlist Cyprus #5, "from €175" (snippet + O); TechBehemoths profile, founded 2014, 10 to 49 staff (snippet) |
| Metabole | metabole.studio | Awwwards element credits (APAX template pages) (snippet); DesignRush profile (snippet); its blog posts are cited by Perplexity (Sept autopsy) and rank #1 for "immersive website cost" (blog plan §1) |
| mdx | mdx.so | Three.js forum Showcase post, 25 Aug 2026, link `rel="nofollow ugc"` (M, https://discourse.threejs.org/t/mdx-an-immersive-studio-website-built-with-three-js-gsap-and-astro/93782); Peerlist company page; amworldgroup and techreviewer.co directories (snippet); claims 5 Awwwards Honorable Mentions and 4 CSSDA distinctions (snippet, self-reported) |
| Noomo | noomoagency.com | Awwwards Site of the Year Users' Choice 2023 (snippet); D&AD pencils for Noomo Labs (snippet); Clutch reviews under its old name Netrix (snippet); Webflow profile; marketingmonk.so directory; mesh3d.gallery (O); Utsubo's Three.js agency list (snippet) |
| Lusion | lusion.co | Awwwards profile, link to lusion.co with no `rel` (M); ORYZO AI Site of the Month April 2026 + Developer Award, EverSwap Site of the Day June 2026 (snippet); Codrops studio feature 13 Apr 2026, links with no `rel` (M); NET magazine interview 2020 (snippet); mesh3d (O); DesignRush profile (snippet); #2 on Utsubo's list (snippet) |
| Utsubo | utsubo.com | Its own ranked lists, which put Utsubo first ("10 Best Three.js Agencies (2026)" and city lists) (snippet); Awwwards Site of the Day claimed in a LinkedIn repost (snippet, unverified) |

**Konaverse on the same sources** (22 Oct): Clutch profile yes (O); Clutch CY list no (O); OneLittleWeb no (O); RevenueBase lists no (O; 23 of 122 and 25 of 183 shown); Sortlist Cyprus list no in the 20 of 34 shown (O); cypruswebdesigners no (O); AngloInfo no (O); GoodFirms no profile at /company/konaverse (M: the slug redirects to the GoodFirms homepage); Awwwards no profile at /konaverse/ (M: 404; another slug is possible); Three.js forum 0 posts mentioning Konaverse, kona-verse or watchweb.vercel.app (M, forum search API); DesignRush, TechBehemoths, The Manifest unverified (403).

### 1.2 Prospect table, ranked by realism

Realism means: a three-person studio with five real clients, zero reviews and no budget for paid placement can get it, and it is worth the time. "AI" marks sources the research found inside AI answers: **plan** = named in plan §10 for "best web design agency Cyprus" (Clutch, OneLittleWeb, RevenueBase, DesignRush, GoodFirms); **Sept** = cited in the September Perplexity run (`keyword-research/ai-engine-autopsy.md`).

| # | Source | Type | Competitors seen there | Konaverse present | Cost | Link type | Can link to /services/* | Effort | Who | Next step | AI |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | https://clutch.co/profile/konaverse and https://clutch.co/cy/web-designers | B2B directory | Absolute, avocadots, Mojo, Web Theoria, UntitledPros, GOOiZ (O) | Profile yes; CY list no (O) | Free; Verified badge $499/yr (13 Oct record); sponsored placement paid (snippet) | Unverified (403 to curl) | Partly: one website field (now the homepage, O); portfolio items already link /work/* (O); service-line links unverified | Low | Owner | Fix phone to "+357 96 273855", city Nicosia, one team size, minimum project to match €1,200, Andreas's title to match /about; then ask Clutch support why the profile is missing from /cy/web-designers. Reviews are what moves the list (13 Oct record) | Yes, plan + Sept (5 of 10 answers) |
| 2 | Google Business Profile | Local listing | Absolute 48, avocadots 51, Mojo 34, Limdez 12 reviews in the pack (13 Oct record) | Yes, 0 reviews, 0 photos (13 Oct record) | Free | Not a web link in the PageRank sense; a crawl and local signal (I) | Yes: website field to /services/web-design (audit A3) | Low | Owner | Already in the audit Phase 0. Listed here because it is the cheapest external pointer to an unindexed service page | Yes, Sept (Maps rank cited) |
| 3 | Client credits on tdkdb.com, velricon.com, heimat-group.com; missing on Los Santos Barbers and Chris n Clean | Client sites | Absolute 41 and Bridge 28 attributed sites on BuiltWith (snippet): credits are the local norm | 3 of 5 clients, followed footer links via www (audit A6, M on 21 Oct) | Free | Owner decision 21 Oct: homepage target, nofollow | No (owner: homepage). A client's own launch note or "our new website" page may link /work/<slug> in body text, once, if the client wants | Very low | Owner asks clients; Claude edits the repos it holds | Apply the 21 Oct decision per repo; ask the two missing clients | No |
| 4 | LinkedIn company page (linkedin.com/company/konaverse) | Social profile | All local competitors have pages (I) | Yes, no website field, 14 followers (audit, 21 Oct) | Free | Nofollow (I) | Yes: website field to /services | Low | Owner | Add website field; make sure all three founders list Konaverse as employer. RevenueBase ranks companies by "number of professionals tracked" and needs a verified work email record (O), so this is the only lever on RevenueBase | Indirect (feeds RevenueBase) |
| 5 | https://www.designrush.com (Cyprus web development list) | B2B directory | Web Theoria, Absolute (snippet) | Unverified (403) | A FREE listing tier exists (snippet, DesignRush contact page); paid ranking positions, about $200/month (third-party, unverified) | Unknown | Unverified: website field and portfolio | Low | Owner | Create the free profile with the NAP from `src/lib/site.ts`; never buy a ranking position | Yes, plan + Sept |
| 6 | https://www.sortlist.com/s/web-design/cyprus-cy | B2B directory | GOOiZ, Web Theoria (O) | No, in the 20 of 34 shown (O) | Free registration (2015 TechCrunch); paid plans from €300/month (third-party 2026 review, unverified) | Unknown | Unverified | Low | Owner | Register free; complete profile; decline paid visibility | Yes, Sept; in 8 of 16 Cyprus SERPs (plan §10) |
| 7 | https://www.goodfirms.co (Cyprus and Nicosia web design lists) | B2B directory | UntitledPros, Web Theoria, JCSL (snippet) | No profile at /company/konaverse (M) | Free "Get Listed" (O, page header); sponsorships paid (I) | Unknown | Unverified | Low | Owner | Create the free profile; GoodFirms' Nicosia list has only 11 firms (snippet), so a reviewed profile can place | Yes, plan |
| 8 | https://techbehemoths.com/companies/web-design/cyprus | B2B directory | GOOiZ profile; avocadots (Nicosia); Absolute (Limassol) (snippet) | Unverified (403) | Free listing (2023 participant post); awards described as merit-based (third-party) | Unknown | Unverified | Low | Owner | Create the free profile; ignore award vote drives | Yes, Sept; in the Cyprus SERP for "best web design agency cyprus" (13 Oct) |
| 9 | https://discourse.threejs.org (Showcase category) | Developer community | mdx (O) | No (M) | Free | `nofollow ugc` (M) | Yes in post text, but link the live piece and /work/lumiere-eclat; a service link would read as promotion (I) | Low | Claude drafts, owner posts from his account | Post Lumière Éclat as a studio concept with the real stack and what was hard; ask for feedback, as mdx did | Weak; the forum ranks in the "how much does a 3d website cost" SERP (Sept) |
| 10 | https://mesh3d.gallery | 3D web gallery | Lusion, Noomo (O) | No (I, not on the page read) | Free, editor-reviewed (O) | Unknown; entries link the live site and a maker profile (O) | Maker profile web address only | Low | Owner | Submit Lumière Éclat, labelled a concept | No |
| 11 | https://www.sanity.io/exchange (community profile + showcase) | Platform community | None of ours seen (O) | No (I) | Free (O, Sanity blog) | Unknown | Profile website and showcase project URL | Low | Owner (Sanity account) | Create a community profile; showcase kona-verse.com's Sanity blog. The agency partner programme (https://sanity.io/agency-partners) is a later application | No |
| 12 | https://3dwebsites.design | 3D web gallery | None of ours on page 1 of 3 (O) | No (O) | Submit link exists; price not shown (O) | Followed, `?ref=` parameter (M) | No: links go to the live site | Low | Owner | Submit Lumière Éclat. The live link would point at watchweb.vercel.app, not kona-verse.com (O, `src/lib/case-studies.ts:300`); see PR angle 2 | Gallery ranks #3 for "3d website design" (Sept, US) |
| 13 | https://onepagelove.com/submit | One-page gallery | None checked | No (I) | Free form seen; a $29 Gumroad listing exists (third-party, unverified) | Unknown | No | Low | Owner, with the client's consent | Los Santos Barbershop is a one-page site (O, Clutch portfolio). Ask the client, then submit. One Page Love is #1 for "one page website design" (Sept, US) | No |
| 14 | https://www.awwwards.com/submit/ | Award gallery | Lusion, Noomo, mdx (snippet) | No profile at /konaverse/ (M) | €65 per site, or €150 with a year of User Pro; Pro membership €12.50/month includes a directory listing and one free submission a year (M, submit page 22 Oct) | Profile link followed (M, Lusion profile) | Profile website field | Medium | Owner | Plan §8 order stands (site after the performance pass, then Lumière), but performance is on hold; the owner decides whether Lumière goes first | Credibility layer for bucket B answers (Sept) |
| 15 | https://www.cssdesignawards.com/submit | Award gallery | Lusion, mdx (snippet) | No (I) | $50 per site (M, submit page) | Unknown | No | Medium | Owner | Submit with or after Awwwards; "sites must be complete and original" (O) | No |
| 16 | https://themanifest.com | B2B directory (Clutch's sister site) | Mojo Design (snippet) | Unverified (403) | Free (I) | Unknown | Unverified | Low | Owner | Check whether the Clutch profile already mirrors there once fixed; it appears in the Cyprus SERP for "web design cyprus" (13 Oct) | Indirect |
| 17 | https://www.cbn.com.cy (Opinion section) | Cyprus business media | None of ours; an SEO specialist from Mind Laboratory wrote an Opinion piece with several links to her agency's service pages (O, https://www.cbn.com.cy/article/108296/how-does-seo-improve-your-business, May 2024) | No | Unknown. Must be editorial; decline if it is paid | Unknown | Yes, observed for another agency | High | Claude drafts, owner pitches | Pitch PR angle 1 once it carries a sourced market range | Earned media is most AI citations (plan §10) |
| 18 | Cyprus Mail business, fastforward.com.cy, brief.com.cy, Stockwatch, in-cyprus | Cyprus business and tech media | None of the eight found in any article (O); Cyprus Mail linked Action's site in an awards story (O, 13 Jul 2026) | No | Unknown; company-news slots may be paid (I) | Unknown | Rarely (I) | Medium | Owner | Only real news: an award, the Labs launch, a data piece. No press-release wire | Earned media (plan §10) |
| 19 | UCLan Cyprus, University of Nicosia, Cyprus University of Technology | Universities | Web Theoria on the UCY career fair (snippet); UCLan's course page ranks #7 for "web design cyprus" in Cyprus (Sept) | No | Free (I) | Unknown | No (I) | Medium | Owner | Offer one guest session on building for the browser in 3D, or a student brief. A university news item is a strong local link if it happens (I) | No |
| 20 | Made in Cyprus (Factory 39), Cyprus Business & Beyond, others on https://podcast.feedspot.com/cyprus_podcasts/ | Podcasts | None of ours; Made in Cyprus interviewed Threedium, a Limassol 3D commerce company (snippet, not opened) | No | Free (I) | Episode pages usually link the guest (I) | No | Medium | Owner | Pitch after the Labs piece is live: a Cyprus studio building 3D for the browser | YouTube and audio mentions correlate with AI visibility (plan §10) |
| 21 | https://tympanus.net/codrops | Design and code publication | Lusion feature, 13 Apr 2026 (O) | No | Free editorially; paid sponsorship also sold (O, passionfroot) | Followed (M) | No | High | Claude drafts, owner pitches | Codrops "invites award-winning web professionals" to share case studies (O, Patreon page). Pitch the Labs making-of after a gallery award; never buy the sponsorship | Bucket B credibility (I) |
| 22 | https://www.provenexpert.com | Review platform | Two Cyprus agency profiles cited by Perplexity (Sept) | No (I) | Free plan exists (snippet) | Unknown | Profile website | Low | Owner | Only if it does not split the review ask. Google first, Clutch second (audit A1) | Yes, Sept |
| 23 | https://www.angloinfo.com/cyprus/directory | Expat directory | Limdez (O) | No (O) | Unknown, registration required (O) | Unknown | Website link on some listings (O) | Low | Owner | Optional: most "web design cyprus" searches come from outside Cyprus (keyword-planner-raw.md note), so an expat directory reaches the right people (I) | No |
| 24 | TechIsland membership and its Cyprus Ecosystem Map (Dealroom) | Tech association | None of ours seen; CBN runs "TechIsland welcomes X as its newest member" items (O, https://www.cbn.com.cy/article/114186) | No (I) | Membership fee not published (O) | Unknown | No | Medium | Owner | Ask the fee. A membership note in CBN would be a real Cyprus mention, but the fee may not pay back (I) | No |
| 25 | Doers Summit (formerly Reflect Festival), Limassol, May (O, Cyprus Mail 23 Mar 2026) | Event | None seen | No | Unknown | Speaker pages usually link (I) | No | High | Owner | Only with a talk built on the Labs piece; low odds for a first application (I) | No |
| 26 | https://cypruswebdesigners.com | Paid Cyprus directory (CyprusNet) | Limdez, Web Theoria banners (O) | No (O) | No public prices; "contact sales" (O, /article/advertise.html) | Banners go through click-tracking URLs (O): no SEO value | No | Low | Owner | Treat it as advertising, judged on leads, not links. It ranks in 7 of 16 Cyprus SERPs (plan §10). Ask the price only if the owner wants paid visibility | No |
| 27 | https://onelittleweb.com/top-agencies/website-design-agencies-in-cyprus/ and https://revenuebase.ai/companies/web-design-agencies/cyprus | Data-built lists | Absolute, Mojo, GOOiZ (OneLittleWeb); Web Theoria, Absolute (RevenueBase) (O) | No (O) | No submission route on either (O). OneLittleWeb also sells link building (O): never buy it | `nofollow` (M) | No | None directly | Owner via rows 1 to 8 | OneLittleWeb scores agencies from Clutch, DesignRush, G2, Google Business Profile, Trustpilot, LinkedIn and others (O). Konaverse enters both lists through the profiles and reviews above, not through outreach | Yes, plan |
| 28 | Psychoactive's WebGL agency guide, Utsubo's Three.js agency list, Superside listicles | Third-party and agency-written ranked lists | Lusion, Noomo, Utsubo (snippet) | No | Editorial choice of the author | Unknown | No | Low odds now | Owner, later | Revisit after an Awwwards or CSSDA award; never offer a reciprocal link | Yes, Sept (the whole "who builds 3D websites" answer came from Psychoactive) |
| 29 | CCCI members directory, Cyta Yellow Pages, CypInfo | Chamber and local directories | None seen | No | Chamber membership fee; CypInfo has a free plan (O, NXDPRO case study) | Unknown | No | Low | Owner | NAP consistency only, if at all. Low priority | No |

**What this table cannot show.** Whether any of these links is followed where I wrote "unknown"; whether Konaverse already sits on DesignRush, TechBehemoths or The Manifest; the ranking effect of any single listing. The owner can see all of it once logged in. Google Search Console's Links report (free) will show which ones Google actually counts.

### 1.3 What the footprint says

- **Local studios are listed, not covered** (O, rows 1 to 8 and the press searches). Not one Cyprus press article about the eight local competitors turned up. Their links are directories and client footers. Konaverse can close the directory gap in a week of owner time; reviews close the ranking gap, slowly.
- **Konaverse's credit policy deliberately gives up part of the local norm** (I). Absolute Websites and Bridge Studios carry dozens of attributed client sites (snippet). Konaverse's credits are nofollow by the owner's 21 Oct decision, in line with Google's spam policy on sitewide and contract footer links (plan §10). That is the right call; it means the remaining links have to come from profiles, galleries and real coverage.
- **The AI-answer sources are nofollow and data-built** (M, rows 27). They reward complete, reviewed profiles on Clutch, DesignRush and GoodFirms, plus LinkedIn data, not pitches.
- **Global studios earn followed links from galleries and design press** (M, Lusion on Awwwards and Codrops). Lumière Éclat and the Labs piece are the only Konaverse assets that fit there.
- **Three Clutch facts contradict the site** (O, row 1): "$5,000+" minimum against a €1,200 one-page price; Andreas as "Technical Director"; the Lakatameia street and an unprefixed phone. A buyer filtering Clutch by budget would not see Konaverse for a small project (I).

### 1.4 (a) Digital PR angles with real substance

Each angle names the substance it rests on. None claims a ranking, a client result or an outcome that was not recorded.

1. **Website prices in Cyprus, published.** Substance: the live post /blog/website-cost-cyprus and the published prices in `src/lib/service-pages.ts` (one-page from €1,200; design and build from €2,500; redesign from €2,500; 3D from €6,000; hosting by the year; published add-ons such as an extra page from €150). The gap (audit B7): the post gives Konaverse's prices only. To be pitchable it needs a dated, sourced table of what other Cyprus studios publish. Starting points found today, each to be re-checked on the agency's own page before use: Absolute Websites advertised "from €800" (O, Sept SERP); GOOiZ "from €175" on Sortlist (snippet); avocadots "from €299" on one directory and a $750 minimum on Wix (snippet). The story is "most Cyprus studios do not publish prices; here is what the ones that do charge, and what each price leaves out", without ranking anyone. Outlets: CBN Opinion (an agency specialist's piece ran there with service-page links, O), Cyprus Mail business (it covers SME digital readiness, O, 22 Jun 2026), in-cyprus, fastforward.com.cy, brief.com.cy, Stockwatch. Link target: the cost post, then /services/web-design.
2. **Lumière Éclat, a real-time WebGL concept.** Substance: the live build at watchweb.vercel.app and its case study, labelled a studio concept everywhere (owner, 21 Oct). Outlets: the Three.js forum Showcase, mesh3d, 3dwebsites.design, Awwwards, CSSDA; r/threejs only as a genuine post from the owner's account. One structural point (I): every gallery link to the live site lands on vercel.app, so it builds nothing for kona-verse.com. Lusion hosts its experiments on lusion.co subdomains (O, links in the Codrops feature). Serving showcase pieces from a kona-verse.com subdomain is an owner decision; the melt-hero cleanup (audit D1) shows subdomains need managing.
3. **Labs piece 1 (zecleat), from December.** Substance: not yet; the build, its Blender files, glTF sizes and frame rates on two real phones are the content plan's dependency (content plan, "Fixed dependencies"). The precedent is real: Lusion's ORYZO AI, a fictional product launch, won Awwwards Site of the Month in April 2026 plus a Developer Award, and Codrops featured it (snippet and O). Outlets once live: Awwwards, CSSDA, mesh3d, the Three.js forum, then Codrops with the January making-of ("Blender to the browser") as the pitch. The fiction line stays on the page; no real players or clubs.
4. **The anonymised migration.** Substance: what the live post already says publicly: 172 URLs moved off Squarespace, 224 known to Search Console, 57 redirects, indexed pages 135 before and 143 nine days after; no traffic or ranking outcome was recorded (blog-plan-2026 §2b). Realistic outlets: genuine answers in r/squarespace and r/TechSEO when someone asks about a migration (the blog plan records such threads after the July 2026 Squarespace price rise), and the Part 2 comparison page. Trade press (Search Engine Journal, Search Engine Land contributor programmes) is low odds with one project and no outcome data (I). Nothing beyond what the live post says; the client stays unidentifiable.

Not yet pitchable, recorded so nobody pitches early: the December inspection of ten Cyprus agency sites (it becomes the strongest Cyprus asset once measured), and the AI-citation log (July 2027).

### 1.5 (b) What to stop or avoid

- **Paid ranking positions** on DesignRush, Sortlist, Clutch or GoodFirms, and the Codrops sponsorship. They are advertising; if ever bought, they must not be treated as link building (I; the owner's no-bought-links rule).
- **OneLittleWeb's link-building service** or any "get featured" offer from a list publisher (O: OneLittleWeb sells link building). No reciprocal links with agency-written lists.
- **A self-ranking list.** Design Monks ranks itself #1 in its "Top Cyprus web design agencies" (O) and Utsubo ranks itself first in its Three.js list (snippet). The December Cyprus agencies piece must disclose its criteria and must not put Konaverse first (blog plan rule 5; owner rule).
- **Mass directory submission.** The plugin flags 50+ directory links as a toxic pattern (seo-backlinks SKILL.md). Rows 1 to 8 plus a handful of galleries is the whole list.
- **Paid newswires** (EIN Presswire-style distribution, seen carrying TechBehemoths vote campaigns, O) and award vote drives.
- **Deep-linking client footers to service pages**, or writing credits into contracts (owner rule; plan §10 spam policy).
- **Disavowing the spam flood or chasing its Domain Rating** (audit; 13 Oct record). Watch Manual Actions monthly, nothing else.
- **Promotional Reddit posts.** Genuine answers only, from the owner's own account.
- **Splitting the review ask** across ProvenExpert, Trustpilot and others before Google and Clutch have reviews.

### 1.6 (c) A realistic 90-day target, 22 October 2026 to 20 January 2027

| Target | By | Count |
|---|---|---|
| External pages pointing at a /services/* URL | 30 Nov | At least 3 (Business Profile, LinkedIn, one directory) |
| New genuine referring domains, profiles included | 20 Jan | 8 to 12: Clutch fixed, DesignRush, Sortlist, GoodFirms, TechBehemoths, Sanity Exchange, the Three.js forum, mesh3d or 3dwebsites.design, the two missing client credits, Awwwards or CSSDA if the owner submits |
| Earned editorial mention (Cyprus outlet or design publication) | 20 Jan | 0 to 1; honest odds are low before the market-price table or an award exists |
| Reviews (the local audit's plan) | 30 Nov / Dec | 4 Google by 30 Nov; 2 Clutch by December |

**How it is measured, free.** Search Console's Links report (external links, top linked pages, top linking sites), read monthly; the plugin's `verify_backlinks.py` against a file of the listing URLs; URL Inspection for the three unindexed service pages; the monthly prompt battery for AI mentions.

**Failure checks.**
- 30 Nov: no verified external link to any /services/* URL. The dashboard work did not happen; nothing else in this file matters until it does.
- Three weeks after the Business Profile and Clutch links exist: /services/web-design, /services/3d-websites and /services/seo still unknown or not indexed. Then link discovery is not the block; look at crawl and internal links again.
- 20 Jan: fewer than 5 new genuine referring domains, or 0 reviews. The list surfaces (Clutch, OneLittleWeb, RevenueBase) will not move whatever else is done.
- After the NAP fix and the first review: Konaverse still absent from clutch.co/cy/web-designers. Ask Clutch support.
- Any link found to be paid, reciprocal or contractual: remove it.

---

## Part 2. Competitor and comparison pages

### 2.1 How the competitor-pages skill was applied

The skill (`skills/seo-competitor-pages/SKILL.md`) offers "X vs Y", "alternatives to X", roundups and comparison tables, with Product and AggregateRating schema. Adapted to the owner's rules: tool and approach comparisons only, never attack pages on named Cyprus studios; each page is a blog post that feeds exactly one service page (blog plan §5); no AggregateRating, Review or FAQPage schema (BlogPosting only); every tool fact sourced and dated "as of"; a section on when Konaverse is the wrong choice; Konaverse's affiliation stated. Demand comes only from `docs/keyword-research.md`, `docs/keyword-research/` and the recorded blog-plan research; current results are WebSearch US results from 22 October and are labelled as such.

### 2.2 Candidates

| # | Query | Demand evidence (our files only) | Current top results (WebSearch, US, 22 Oct) | Page type | Feeds | Konaverse substance | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | template vs custom website; custom website vs template; wix vs custom website | KP 10 to 100 in Cyprus and worldwide for both spellings (keyword-planner-raw.md lines 37, 77, 151, 214); "custom website cost" 100 to 1K worldwide (line 149); about 30 autocomplete variants (suggest.md 494 to 1324); Sept SERP: small-agency blogs with an AI Overview, Absolute Websites #6 (serp-autopsy.md 190 to 195); Perplexity built its answer from three small sources (ai-engine-autopsy #7). Nothing measured for "wix vs custom" specifically | bluetonemedia, blacksmith.agency, icdsoft, two sites.google pages, sproing.ca, smartsites, spindogs; for the Wix variant: xi-digital, zealousweb, parachutedesign, dev.to, coloradowebimpressions, mightysites, fitsmallbusiness. All agency or vendor blogs | Decision guide with a cost-and-capability matrix | /services/web-design | Published tiers (€1,200 one-page, €2,500 design and build, €6,000 3D) and add-ons in `service-pages.ts`; one client site per tier (Los Santos Barbershop one-page; TDK or Heimat full site); hours per tier from the owner (content plan dependency, November); the owner's answer on what he says to a Wix or WordPress template client (owner-briefs-2026-10-14 question 2). Scheduled February 2027 in the content plan | **Build. Top 1** |
| 2 | pre-rendered video vs shader vs live 3D; spline vs three.js | KP "three js website" 1K to 10K worldwide (line 217); "spline website design" 10 to 100 worldwide (line 213); "3d website builder" 1K to 10K (line 132); autocomplete "3d website video", "3d web video", "3d website framer", "3d website wix" (suggest.md 284, 441, 334, 452); PAA "How can I create a 3D website?" (keyword-research.md §3) | For "spline vs three.js vs video for 3D website": needle.tools comparison, svilenkovic.com (two pages), saashub, studiomeyer. None compares video (O) | Comparison table page: three routes by cost, file size, phone behaviour, interactivity | /services/3d-websites | Konaverse shipped all three routes: the ice-cube video loop (`public/object/idle-clear.mp4`), the hero peel shader, Lumière Éclat in real-time WebGL; the Labs glTF pieces add the third case later (content plan, April 2027). No Spline build exists (the repo mentions Spline once, in `HubAgent.tsx`): Spline appears only as a sourced, labelled "not built by us" row, or after a real test | **Build. Top 2** |
| 3 | leaving squarespace; migrate squarespace to custom site; is squarespace bad for seo | Recorded in blog-plan-2026 §2 #2 (3 Oct): r/squarespace threads after the July 2026 price rise (18, 20 and 24 July), autocomplete "migrate squarespace to…" and "is squarespace bad for seo". Not in the September KP pull; suggest.md has only "how long does it take to build a website on squarespace" (line 541). Re-pull autocomplete before writing | An indiehackers thread, eseospace (programmatic), Hostinger's migration guide repeated across regional URLs | Migration comparison: what the platform exports and what it does not, URL patterns, what a move costs | /services/website-redesign | The public migration record: 172 URLs off Squarespace, 57 redirects, 224 known to Search Console, 135 to 143 indexed (live post). Must link to, not repeat, /blog/redesign-website-without-losing-seo | **Build. Top 3**, after a demand re-check |
| 4 | one page vs multi page website; is a one-page website enough | KP "one page website" and "single page website" 1K to 10K worldwide (lines 177, 212); PAA "Is a one-page website enough?" and the one-page cost question; Perplexity answered from two tiny blogs (#9); autocomplete "one page website vs multiple pages" (suggest.md 1255) | mapletree.studio, bluchic, logoworks, networksolutions, vond.co.za, quintype, treethemes, b12, spotdev. Vendor blogs | Decision guide | /services/one-page-websites | Los Santos Barbershop (one-page, appointment-led); the €1,200 scope; "when we said no" (owner input). The live cost post already has an H2 "Is a €1,200 one-page website enough?", so the page must go further or stay a section | **Build later** (content plan August 2027) |
| 5 | next.js vs react for seo | "next js developer" 100 to 1K worldwide (line 176) | Not re-checked | Comparison article | /services/web-development | Drafted (`blog-drafts/nextjs-vs-react-seo.md`), approved, November in the content plan; needs the view-source walk-through | **In pipeline**, no new work |
| 6 | next.js vs webflow | Live post | Not re-checked | Live | /services/web-development | Live at /blog/nextjs-vs-webflow | **Exists**; link it from pages 1 and 5 |
| 7 | ai 3d website builder vs a studio | 10 autocomplete variants of "3d website builder ai/free/prompt" (suggest.md 176, 177, 298 to 301); KP "3d website builder" 1K to 10K | Huemor, B12, 925studios, Bluehost, websitebuilderexpert, Dorik, TechRadar. General AI builders vs agencies; none about 3D (O) | Test-based comparison | /services/3d-websites | None yet. It needs a real run of the builders against a Konaverse build, measured | **Hold** until the test exists |
| 8 | next.js vs wordpress for seo | No measured demand in our files; reserve list only (blog-plan-2026 §3) | dev.to (four posts), merge.rocks, eseospace, h1site. Developer blogs | Comparison | /services/web-development | Next.js side only; no WordPress build in the case studies | **Drop**: one-sided |
| 9 | scrollytelling vs parallax | Autocomplete, 2 feeds (suggest.md 832) | Not checked | Section | /services/3d-websites | Lumière Éclat chapters; the stack | **Fold** into the drafted scrollytelling article (Article 13) |

Dropped outright: any page naming a Cyprus studio as the thing compared; "Konaverse alternatives" (no brand demand); "Wix vs WordPress" (rejected in blog-plan-2026 §4: not our service); "WebGL vs Three.js" (developer intent, suggest.md 1105); "studio vs freelancer" (no demand evidence in our files).

### 2.3 The top three, briefly

**1. Template, builder or custom: what €1,200, €2,500 and €6,000 buy in Cyprus** (/services/web-design)
- Opening: the answer in two sentences: a template or builder site is right when the site is secondary and the budget is hundreds; custom is right when the site carries the brand or the sales. Then the matrix.
- Matrix rows (each tool fact sourced and dated): cost to launch, yearly running cost (Konaverse hosting is yearly, never monthly), who owns the code and content, what moves to another host, speed control, design freedom, who edits after launch. Columns: Wix or Squarespace, a theme, Konaverse custom. Wix and Squarespace prices only from their own pricing pages, "as of" the publish date.
- "When we are the wrong choice": the owner's own answer (owner-briefs question 2). Fair to the local market: some Cyprus studios build on Wix and do it well (avocadots is a Wix Partner, O); say so without naming anyone as worse.
- Proof: one real site per tier, opened and described.
- Links: one to /services/web-design; /blog/website-cost-cyprus and /blog/nextjs-vs-webflow as related reading.

**2. Video, shader or live 3D: three ways to put 3D on a page, and what each costs** (/services/3d-websites)
- A three-column table from Konaverse's own builds: file size, load behaviour, phone behaviour, interactivity, what it costs to make and to change. The numbers come from the repository's builds and must be measured, not estimated; physical-device review is still outstanding (AGENTS.md), so phone rows wait for it or say "headless only".
- Spline: one sourced row, labelled as not built by us, unless the studio runs a test first. The current results never compare video at all (O), which is the opening this page owns.
- Links: one to /services/3d-websites; Lumière Éclat case study; the 3D cost article once published.

**3. Leaving Squarespace without losing what you have built** (/services/website-redesign)
- What a Squarespace export carries and what it leaves out (titles, descriptions, redirects and forms are left out per Hostinger's guide, O; verify against Squarespace's own help pages before publishing), the URL patterns, the redirect map, the cost of the move at Konaverse's redesign price.
- The record: only the numbers already public in the live post. No client name, no screenshots, nothing that narrows the client down.
- Links: one to /services/website-redesign; the live migration post as the full record.

---

## Limits

- No referring-domain data for any competitor. "Competitor X is on source Y" comes from search results and page reads, not from a link index, so the competitors certainly have links this method cannot see.
- 403 responses (DesignRush, GoodFirms lists, TechBehemoths, The Manifest, G2, BuiltWith, UCY) mean "unverified", never "absent".
- WebSearch returns US results and summaries. Snippet facts are marked; re-read them on the page before quoting them anywhere public.
- Link attributes were measured only on OneLittleWeb, RevenueBase, the Three.js forum, Awwwards (Lusion's profile), 3dwebsites.design and Codrops.
- No result here predicts rankings or citations.

## Sources

Konaverse and competitor pages read on 22 October 2026:
- https://clutch.co/profile/konaverse.md
- https://clutch.co/cy/web-designers.md
- https://onelittleweb.com/top-agencies/website-design-agencies-in-cyprus/
- https://revenuebase.ai/companies/web-design-agencies/cyprus
- https://revenuebase.ai/companies/web-designers/cyprus
- https://www.sortlist.com/s/web-design/cyprus-cy
- https://cypruswebdesigners.com/ and https://cypruswebdesigners.com/article/advertise.html
- https://www.angloinfo.com/cyprus/directory/work/services
- https://www.designmonks.co/blog/top-cyprus-web-design-agencies
- https://www.cbn.com.cy/article/108296/how-does-seo-improve-your-business
- https://cyprus-mail.com/2026/07/13/action-named-agency-of-the-year-for-the-second-consecutive-year-at-the-cyprus-digital-marketing-awards
- https://www.awwwards.com/submit/ and https://www.awwwards.com/lusion/
- https://www.cssdesignawards.com/submit
- https://onepagelove.com/submit
- https://mesh3d.gallery/
- https://3dwebsites.design/
- https://discourse.threejs.org/t/mdx-an-immersive-studio-website-built-with-three-js-gsap-and-astro/93782
- https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/
- https://www.nxdpro.com/en/case-studies/cypinfo

Found through search results (summaries, not opened unless listed above):
- https://www.designrush.com/agency/profile/web-theoria-ltd, https://www.designrush.com/agency/profile/absolute-websites-ltd, https://www.designrush.com/agency/web-development-companies/cy
- https://www.goodfirms.co/directory/city/top-web-design-companies/nicosia, https://www.goodfirms.co/companies/web-development-agency/cyprus
- https://techbehemoths.com/company/gooiz, https://techbehemoths.com/companies/web-design/nicosia
- https://themanifest.com/company/mojo-design
- https://www.wix.com/marketplace/wix-partner/avocadots
- https://trends.builtwith.com/agency/Absolute-Websites, https://trends.builtwith.com/agency/Bridge-Studios
- https://www.ucy.ac.cy/careerfair/web-theoria/
- https://www.utsubo.com/blog/top-threejs-agencies
- https://www.dandad.org/work/d-ad-awards-archive/noomo-labs, https://www.awwwards.com/annual-awards-2023/site-of-the-year-users-choice
- https://peerlist.io/company/mdx_so
- https://www.designrush.com/benefits, https://www.designrush.com/contact-us, https://ampifire.com/blog/designrush-platform-features-pricing-should-you-list-your-agency-in-this-directory/
- https://fixthephoto.com/sortlist-review.html, https://techcrunch.com/2015/02/09/sortlist
- https://techbehemoths.com/awards-2025/faq
- https://www.sanity.io/blog/opening-the-community, https://sanity.io/agency-partners
- https://www.patreon.com/codrops/about, https://www.passionfroot.me/codrops
- https://cyprus-mail.com/2026/03/23/doers-summit-doubles-down-on-doers-this-may-in-limassol
- https://www.cbn.com.cy/article/114186/techisland-welcomes-capacitor-partners-as-its-newest-member
- https://cyprus-mail.com/2026/06/22/cyprus-makes-strides-in-connectivity-but-lags-in-ai-adoption
- https://podcast.feedspot.com/cyprus_podcasts/, https://podengine.ai/podcasts/made-in-cyprus-big-biz-stories-from-a-tiny-island
- https://www.provenexpert.com/en-us/provenexpert-com/
- https://robhope.gumroad.com/l/opl-submission

Part 2 current results (WebSearch, US, 22 October): bluetonemedia.com, blacksmith.agency, icdsoft.com, smartsites.com, spindogs.co.uk, xi-digital.com, zealousweb.com, fitsmallbusiness.com, cloud.needle.tools/compare/needle-vs-threejs-vs-spline, svilenkovic.com/3d/spline-vs-three-js, saashub.com, studiomeyer.io, indiehackers.com, eseospace.com, hostinger.com/tutorials/migrate-from-squarespace/, mapletree.studio, networksolutions.com, b12.io, spotdev.co.uk, huemor.rocks, 925studios.co, dev.to, merge.rocks, h1site.com.

Internal: `BRIEF.md`; `docs/seo-audit-2026-10-21/README.md`, `evidence/backlinks.md`, `evidence/local.md`, `evidence/sxo.md`; `docs/seo-plan-q4-2026.md` §6, §8, §10; `docs/seo-state-2026-10-13.md`; `docs/keyword-research.md` and `docs/keyword-research/` (keyword-planner-raw.md, suggest.md, serp-autopsy.md, ai-engine-autopsy.md); `docs/blog-plan-2026.md`; `docs/content-plan-2026-11-to-2027-08.md`; `src/lib/service-pages.ts`, `src/lib/case-studies.ts`, `src/lib/work-projects.ts`; plugin skills seo-competitor-pages, seo-backlinks, seo-flow `references/prompts/leverage/backlink-competition-prompt.md`.
