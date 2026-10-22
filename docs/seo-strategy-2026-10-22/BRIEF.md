# Strategy and content run, 22 October 2026: shared brief

The owner asked on 22 October 2026 for the claude-seo strategy and content tools that the 21 October audit did not run: cluster, competitor pages, programmatic, FLOW, content briefs and plan. Every agent in this run reads this file first. Outputs go in this folder, one file per agent. The synthesis (`README.md`) is written last from those files.

## The business

Konaverse (https://kona-verse.com) is an immersive web studio in Cyprus. Brand sentence, agreed 13 October 2026: *Konaverse is an immersive web studio in Cyprus. Local SEO keeps the pipeline alive and builds the review base. The niche terms, the showcase and the citations build the premium side.*

- Three people, based in Nicosia: Konstantinos Kyprianou (author of the blog), Andreas Kyriakou (Operations Manager and Design Lead), and a third founder (see /about).
- Service-area business. No street address on the site. Phone +357 96 273855. Hours Monday to Friday, 9 to 5, Cyprus time. Replies within 24 hours.
- Services, each a page: /services/web-design, /services/web-development, /services/3d-websites, /services/website-redesign, /services/one-page-websites, /services/seo. Hub: /services. Prices live in `src/lib/service-pages.ts`. Hosting is priced by the year (300 or 400 euro, plus 300 with a CMS), never monthly.
- Work: /work and seven case studies under /work/[slug] (`src/lib/case-studies.ts`, `src/lib/work-projects.ts`). Lumière Éclat and City Arcade are studio concepts, not client work.
- Blog: Sanity-backed. Three posts live: /blog/website-cost-cyprus, /blog/redesign-website-without-losing-seo, /blog/nextjs-vs-webflow. Thirteen Markdown drafts in `docs/blog-drafts/`, judged in `docs/editorial/drafts-audit-2026-10-13.md`.

## Where things stand (read these before working)

1. `docs/seo-audit-2026-10-21/README.md`: the audit. Health 68, authority is the bottleneck, 0 reviews, no external link to any service page. /services/web-design, /3d-websites and /seo are not indexed.
2. `docs/seo-plan-q4-2026.md`: plan v3, keyword map (section 6), off-site list (section 8), research record (section 10).
3. `docs/seo-state-2026-10-13.md`: Search Console, Semrush/Ahrefs free lookups, Clutch, Business Profile, Cyprus SERPs as seen from Cyprus.
4. `docs/keyword-research.md` and `docs/keyword-research/`: September Keyword Planner ranges, 1,311 autocomplete suggestions, the SERP and AI-engine autopsies.
5. `docs/content-plan-2026-11-to-2027-08.md`: the ten-month content plan and the substance rule (no article without a real build, number, inspection or founder decision).
6. `docs/site-architecture.md`: the intended architecture.

The claude-seo plugin lives at `C:/Users/konst/.claude/plugins/cache/agricidaniel-claude-seo/claude-seo/2.4.2`. Each skill's instructions are in `skills/<name>/SKILL.md` with `references/`. Run bundled scripts only through `"<plugin>/scripts/claude-seo" run <script>.py`.

## Owner decisions that bind every recommendation

- No city or location pages (doorway risk). No /pricing page. No FAQPage, HowTo, Review or AggregateRating schema.
- Blog articles are published one at a time, after the owner reads them. Drafting authorizes nothing: no CMS publication, no Git commits, no deployment.
- Content follows the substance rule above. Never invent personal experience, client results, quotes, rankings or SEO outcomes. Hypothetical examples must be labelled as such.
- The anonymised migration client is never named, shown or identifiable.
- Client credit links: brand anchor, nofollow, the client's choice, never in a contract. No bought links, no link schemes, no self-promotional "best agencies" list that ranks Konaverse first.
- Never slow or remove the authored text entrances for performance; performance work is on hold.
- No em dashes in any copy proposed for the site or the blog.
- Evidence before checklists. Content is designed as sections, not walls of text.
- The owner will not pay for Semrush or Ahrefs subscriptions. DataForSEO (pay as you go) is proposed but not approved; do not assume it.

## Rules for this run

- Read and write only. Do not edit site code, the CMS, Search Console, the Business Profile, Clutch or any listing. Write only your own output file in this folder.
- Label every claim: **measured** (a number from a tool or a SERP you fetched), **observed** (seen on a page, with URL), or **inferred** (your judgement). Cite URLs.
- WebSearch returns US results. Do not present US results as Cyprus results. Cyprus SERPs come only from the owner's Chrome (one agent has that job) or from the 13 October record.
- Say what the data cannot show. A short honest file beats a long speculative one.
