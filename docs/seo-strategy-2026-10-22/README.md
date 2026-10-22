# Konaverse strategy and content run, 22 October 2026

The owner asked for the claude-seo strategy and content tools that the 21 October audit did not run. Four agents ran in parallel from one shared brief (`BRIEF.md`): topic clusters for the niche terms, real Cyprus search results from the owner's Chrome, a footprint link gap with comparison pages, and the FLOW Local and Win stages. Two content-brief agents followed. This file is the synthesis and the plan; the evidence is in the files below.

| File | Plugin skill | What it answers |
|---|---|---|
| `services-cyprus.md` + `serps-cyprus.json` | cluster (SERP overlap), programmatic | Which service pages to keep, merge or add, from 24 Google results pages seen from Cyprus |
| `cluster-niche.md` | cluster | The 3D, scrollytelling, redesign, one-page and cost clusters; drafts merged or kept; a 37-link internal link matrix |
| `links-and-competitors.md` | backlinks, competitor-pages, FLOW Leverage | Where competitors are listed and Konaverse is not; PR angles; a 90-day link target; three comparison pages |
| `local-and-conversion.md` | FLOW Local and Win, local | Ready-to-paste Business Profile pack, review ask, one entity on ten platforms, social cadence, bottom-of-funnel review |
| `brief-cost-refresh-and-greek.md` | content-brief | The live cost post refresh and a Greek cost article |
| `brief-comparisons.md` | content-brief | Template, builder or custom; video, shader or live 3D |

Nothing on the site, the CMS, Search Console or any profile was changed by this run. No one was contacted.

## What changed in our understanding

1. **Merge no service page now.** In Cyprus results, web design, web development and redesign are one cluster (4 to 5 shared top-10 URLs) but never one page (7+). SEO, one-page and 3D are separate results pages. Web development stays (indexed, own substance, job-seeker noise on its SERP); merge it into web design only if 90 days of Search Console data show the two pages swapping on the same queries.
2. **Do not add e-commerce, maintenance or hosting pages.** Each is its own SERP, but Konaverse sells no e-shops and has none to show, the maintenance SERP sells care for other people's WordPress sites, and the studio loses money on hosting.
3. **Greek is a separate search market.** Greek and English results share 0 URLs; every result on the five Greek web design queries is a Greek page; rivals rank Greek copies of their cost posts. First test: a hand-written Greek cost article. Then, once /services/web-design is indexed, one Greek web design page. No mirrors of the other five (the English SEO page already ranks for `seo κύπρος`).
4. **The head term is a firm-homepage and directory SERP.** On the four head variants (web design / website design / agency / company cyprus) firm homepages take 23 of 40 slots, directories 15, service pages 2. Four directories sit in nearly every web design SERP: Clutch, The Manifest, cypruswebdesigners.com, Sortlist.
5. **The cost post is our only non-brand foothold.** Search Console, 28 days: position 13.3 for "website cost cyprus" (7 impressions) and 15.4 for "website design cyprus prices" (5). The 3rd place seen in the agent's run was the owner's signed-in browser; use Search Console's figure. It is cited in no AI Overview; the Overviews quote ranges built from Cyprus agency posts.
6. **The local pack is not gated by review count alone.** A profile with 2 reviews (and a keyword-stuffed name, which we will not copy) appears in 12 of 15 local packs. Konaverse appears in none. Profile completeness (photos, services, website link, categories) matters now, not only after ten reviews.
7. **Konaverse is on one business directory: Clutch.** And not in Clutch's Cyprus web designers list (about 55 firms, six of our eight local competitors). Clutch also says "$5,000+" minimum (the site starts at €1,200), "Technical Director" for Andreas, the Lakatameia street and "96273855".
8. **Local competitors are listed, not covered.** No Cyprus press article about any of the eight was found. Their links are directories and client footers. The directory gap closes with free profiles; the ranking gap closes with reviews.
9. **For the premium side, galleries and design press pass real links.** Lusion's ORYZO (a fictional product, like Labs piece 1) won Awwwards Site of the Month in April 2026 and a Codrops feature. Lumière Éclat is linkable, but it lives on watchweb.vercel.app, so gallery links would build nothing for kona-verse.com until it moves to a kona-verse.com subdomain.
10. **Social sends more visits than search.** Instagram 33 and Facebook 10 sessions in 28 days against 30 from organic search; LinkedIn none in 90 days.

## Decisions the owner needs to make

| # | Decision | Recommendation | Why |
|---|---|---|---|
| 1 | Commit and push the 21 Oct fixes and the 22 Oct leftovers | Yes, now | The live site still says "guaranteed < 2.5 s", "9 to 18 EET" and "within one working day", has no lead event and covers the mobile CTAs with the cookie card. Biggest gain with no new design (`local-and-conversion.md` 5.2) |
| 2 | Which URL owns "web design cyprus" in the organic results: the homepage or /services/web-design | **The homepage** for organic: its title becomes brand plus "web design studio in Nicosia, Cyprus" (the hero line stays as the H1), and /services/web-design is retitled around process and price so it stops competing for the head term. **The Business Profile website field still goes to /services/web-design**, as `local-and-conversion.md` 1.4 recommends | Firm homepages hold 23 of 40 head-term slots and service pages 2, and every external link we have points at the homepage. A different URL in the profile gives the unindexed page its first external pointer and, per Sterling Sky's "Diversity Update" study (not confirmed by Google), lets the business show in the pack and in organic for the same query. Review on 30 Nov and 31 Jan as 1.4 sets out |
| 3 | A Nicosia page, against the no-city-pages decision | Hold until Q1; reconsider once /services/web-design is indexed and reviews exist | The data argues for Nicosia alone (separate SERP; city pages rank and get cited; 4 of 5 client builds are Nicosia firms) but volume is 10 to 100 a month and the pack takes the clicks. Limassol, Larnaca and Paphos: the ban holds |
| 4 | Greek content | Yes to one Greek cost article, if a founder writes or reviews publishable Greek | /contact lists Greek; machine translation without review is scaled-content risk |
| 5 | Clutch minimum project | Lower it to match the site's floor | A buyer filtering Clutch by budget never sees Konaverse for a small project |
| 6 | Lumière Éclat on a kona-verse.com subdomain | Yes, before any gallery submission | Gallery links to vercel.app build nothing for the brand |
| 7 | Who takes the first call, named on service pages with tap-to-call | Owner names the person(s) | No service page names a person (0 mentions of the founders) or has a phone link |
| 8 | Case-study authors | Owner names who wrote each | Schema author is still the Organization (audit D6) |

### The owner's answers, 22 October

| # | Answer | What happened |
|---|---|---|
| 1 | "Yes push" | Committed bbd3a67 (site), a85a2bc (these docs), pushed. Vercel failed a85a2bc: Tailwind scans every repository file for class names and read two Windows temp paths in the docs (`\fe0c35…`, `\d5d536…`) as escapes for code points that do not exist. d170ec7 removed the paths; it built and is live (favicon, RSS, OG JPEG, CSP, footer phone, "Within 24 hours" all checked on kona-verse.com; `seo-gate` PASS against production) |
| 2 | Worried that a Cyprus title limits growth abroad; then "yes on the title" | Committed and pushed 22 Oct (7397948, 487c95e): the homepage title is **"Konaverse: Web Design Studio in Cyprus, Working Worldwide"** and its description says "web design studio". The hero line stays the h1. The 3D page carries the search abroad |
| 3 | No Nicosia page | The no-city-pages decision holds; Nicosia leaves the title proposal too |
| 4 | The owner reviews Greek; then, the same day: "Let's not publish anything in greek" | **No Greek content.** The Greek cost article and the Greek web design page are dropped, and no Greek plumbing is built. The Greek market finding stays on record for a later decision |
| 5 | Clutch minimum lowered to $1,000 by the owner | Countries: list where clients are served, never an office the studio does not have |
| 6 | "If it's going to cost then no" | It costs nothing: kona-verse.com's DNS is on Cloudflare (one free CNAME) and a custom domain on a Vercel project is free on every plan. City Arcade is in the Konaverse team (`city-arcade`); Lumière (watchweb.vercel.app) is on another Vercel account. Waits for the owner's yes |
| 7 | Konstantinos takes the call | Committed and pushed 22 Oct (7397948, 487c95e): the service pages' closing section ends "Prefer the phone? Konstantinos takes the first call: +357 96 273855" (tap-to-call; `Invitation call`), and every `tel:` press sends `phone_click` to GA4 |
| 8 | Published articles keep their authors; everything else is Konstantinos's | Committed and pushed 22 Oct (7397948, 487c95e): each case study's facts end "Written by Konstantinos Kyprianou" (linked to /about#konstantinos) and the Article schema's author is his Person node |

## The plan, in order

### This week: owner, dashboards, free (about three hours)

Everything is drafted and ready to paste in `local-and-conversion.md`.

1. **Business Profile:** the pack in section 1: secondary category Internet marketing service, the 710-character description, six services, service-area districts, hours Mon to Fri 9:00 to 17:00, the photo shot list (10+ real photos), the first of twelve weekly posts. Website field: https://kona-verse.com/services/web-design (decision 2).
2. **Review ask** to the five real clients (Los Santos, Velricon, Chris N Clean, HEIMAT, TDK): the message, one follow-up, reply within 48 hours (section 2). No incentives, no gating.
3. **Clutch:** Nicosia, "+357 96 273855", one team size, Andreas's role, the minimum project, each service line linking its /services page; then ask Clutch why the profile is missing from the Cyprus list (`links-and-competitors.md` row 1).
4. **LinkedIn** website field and About; **Instagram and Facebook** bios to /services (section 4.2).
5. **Bing Places:** import from the Business Profile. **Apple Business Connect.**
6. **Free listings:** DesignRush, Sortlist, GoodFirms, TechBehemoths, from the one NAP block (section 3.1), each with one deep service link.
7. **GA4:** mark `generate_lead` as a key event after the deploy; review the `ads_conversion_Contact_Us_1` trigger.

### Next code pass (Claude, after the push)

1. Decision 2 applied: homepage title and description name web design and Nicosia, Cyprus; /services/web-design and the /services hub retitled so only the homepage aims at the head cluster.
2. Keyword map corrections (`services-cyprus.md` section 2, `cluster-niche.md` section 4a): /services/3d-websites to "3d website design agency" and "immersive website design agency"; /services/one-page-websites to the price question with the €1,200 justification early (the SERP shows €150 to €500); "Cyprus" in the redesign title and H1; "web design cyprus prices" assigned to the cost post, not the service page; the hub's "web design agency cyprus" target dropped.
3. Service pages link to the cost post and the migration post (the code half of the 37-link matrix in `cluster-niche.md` section 5).
4. A `phone_click` event on `tel:` links.
5. Owner-approved conversion copy (`local-and-conversion.md` 5.2, items 3 to 6): the named person and tap-to-call, the one line saying what the call is, the remote-work line on the 3D and redesign pages, Chris N Clean first on the 3D page.

### Content, November to January (one piece at a time, owner reads each)

The ten-month plan stands; this run changes its order and adds two Cyprus pieces.

| Order | Piece | State | Why now |
|---|---|---|---|
| 1 | **Refresh /blog/website-cost-cyprus**: a dated, sourced Cyprus market range; the `web-design-agency-pricing` draft merged in; service-page links in the body; the `updated` field bumped | Brief: `brief-cost-refresh-and-greek.md` | Our only non-brand ranking (13 to 15); the AI Overview cites agency posts with ranges and not ours. A Sanity edit, needs the owner's go |
| 2 | What scrollytelling is (Article 13) | Drafted; trim its cost section to two sentences and link the 3D cost post | Ready; premium side |
| 3 | How much a 3D website costs | Drafted; blocked on the owner accepting `editorial/3d-pricing-structure-2026-10-14.md` | Owns the 3D cost cluster (one freelancer's auto-generated pages hold 8 of 9 results) |
| 4 | ~~Greek Cyprus website cost article~~ | Brief: `brief-cost-refresh-and-greek.md` | DROPPED 22 Oct (owner: no Greek publishing) |
| 5 | Next.js vs. React for SEO | Drafted; needs the view-source addition | Approved |
| 6 | Template, builder or custom: what €1,200, €2,500 and €6,000 buy | Brief: `brief-comparisons.md`; rebuilds `why-custom-websites-are-expensive` without the cost post's price table | Needs the owner's hours per tier (due November) |
| 7 | The best web design agencies in Cyprus (December, as planned) | Planned | Ten agencies inspected; criteria disclosed; Konaverse not placed first |
| 8 | Video, shader or live 3D | Brief: `brief-comparisons.md` | No current result compares video; needs measured sizes and frame costs |

Dropped or merged by this run: `web-design-agency-pricing` (merged into the cost refresh), "premium website cost" and "redesign before and after" (no substance yet), the e-commerce and maintenance pages. Conditional: "what a website redesign costs", only once the owner's redesign hours exist.

Each published piece gets one LinkedIn post and one Instagram carousel (`local-and-conversion.md` section 4).

### Off-site after the basics (December to January)

Lumière Éclat moved to a kona-verse.com subdomain (decision 6), then: the Three.js forum showcase, mesh3d.gallery, 3dwebsites.design, Awwwards (€65) or CSSDA ($50). Labs piece 1 follows the ORYZO precedent: Awwwards, then a Codrops pitch with the making-of. Cyprus press only once the cost post carries the market table: CBN Opinion, Cyprus Mail business, in-cyprus, fastforward.com.cy (`links-and-competitors.md` 1.4). Avoid: paid list positions, link-building offers from list publishers, newswires, vote drives, mass directory submission.

## Targets and how we will know

| Indicator | Target | Check | Failure means |
|---|---|---|---|
| External pages linking a /services/* URL | 3 by 30 Nov | Search Console Links report | The dashboard work did not happen; nothing else matters until it does |
| /services/web-design, /3d-websites, /seo indexed | 3 weeks after their first external link | URL Inspection | Look again at crawl and internal links |
| Google reviews | 4 by 30 Nov; Clutch 2 by Dec | Business Profile, Clutch | The review ask was not sent or not followed up |
| New genuine referring domains | 8 to 12 by 20 Jan | Search Console Links, `verify_backlinks.py` | Fewer than 5: the listing surfaces will not move |
| Cost post | Top 10 for "website cost cyprus" within 6 weeks of the refresh | Search Console | Re-check the AI Overview sources and the market table |
| Local pack | Konaverse in any Cyprus web design pack | Re-run the 24 queries signed out, by day, in 4 to 6 weeks | Profile completeness or the website link is the gap |
| Leads | `generate_lead` and `phone_click` by source | GA4, once deployed; the owner's enquiry sheet (source, service, budget, objection, outcome) | Tracking not marked as key events, or no deploy |

## Found along the way (fix before the pieces they touch)

- **The 3D cost draft describes a homepage that no longer exists.** `docs/blog-drafts/how-much-does-a-3d-website-cost.md:125` says the object on our homepage is a Blender render shipped as a video loop. The live hero plays `/home/hero-loop.mp4` (HeroPortrait and HeroPeel); the Blender ice cube (`/object/idle-clear.mp4`) is parked at /hero-object, which redirects in production (checked 22 Oct). Unless hero-loop.mp4 is itself a Blender render, the line is wrong. Owner: what is hero-loop.mp4 and who made it?
- **Two internal rates disagree.** The add-on note in `service-pages.ts:127` works from "~€50 an hour"; the 3D driver table in `editorial/3d-pricing-structure-2026-10-14.md` works from about €1,000 a working week (about €25 an hour). Reconcile before any piece prints hours beside prices.
- **The blog footer line becomes false after the cost refresh.** Every post says "Every number in this article is from our own projects or price list" (`src/app/(v4)/blog/[slug]/page.tsx:347-348`). The refresh adds other firms' figures, so the line needs a per-post variant first.
- **(Not needed while Greek is off, owner 22 Oct)** **Greek on the site needs plumbing**, listed in `brief-cost-refresh-and-greek.md`: Sanity language fields, a Greek route, `lang="el"` on the article, Greek dates, the Greek font subset (Manrope loads `latin` only), and the Markdown importer's `slugify`, which turns Greek headings into empty keys.
- `@splinetool/react-spline` is in `package.json` but imported nowhere.

## Still not covered

- **Search volume** for Greek, maintenance and industry terms: nothing on file measures it. DataForSEO (pay as you go, $50 minimum, not approved) would, along with the local-pack geo-grid (`/seo maps`) and competitors' real backlink lists.
- **Positions signed out.** Re-run the 24 Cyprus queries signed out, by day, before acting on any merge.
- **Industry demand** (construction, barbers, cleaning, finance): no SERP was fetched; the industry-page verdict rests on the quality gates.
- **Drift compare** after the deploy (`/claude-seo:seo drift compare`), against the 21 October baselines.
