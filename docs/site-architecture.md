# Konaverse — Site Architecture

Version 2, 4 Sep 2026. Version 1 was the draft; the seven decisions below are the user's, taken on
2026-09-04 before any inner page is designed. Everything not marked as a decision is still open to argue.
Direction: v4 black-and-white tech noir (Whiteout is retired, 2026-08-22). The homepage, the legal
pages and the 404 are live; every other URL below still redirects home until it ships.

**Decisions of 2026-09-04 (user):**
1. The work hub is `/work`, case studies are `/work/[slug]`. `/projects` is gone from the map.
2. `/services/web-design` and `/services/web-development` BOTH ship, with hard differentiation (see §2).
3. Every service page is ONE template with fixed content slots, the meaningful content at the top (see §2a).
4. Case studies keep the six blocks in the fixed order (§3); the template makes them impossible to skip.
5. `/contact` is a real page. The site's CTA becomes TWO actions everywhere: **Contact** (the page) and
   **Book** (Calendly). The single-button invitation is restructured accordingly.
6. Blog posts carry a named author from a roster of two: Konstantinos Kyprianou and Nabil Al Jbawi (§4).
7. Keyword research gets its own session before any copy is written: Search Console, Ahrefs, Google
   autocomplete and suggestions, Keyword Planner for volume and competition. **DONE 2026-09-04 —
   `docs/keyword-research.md`.** The primaries in §2 and the blog table in §4 are now data; ChatGPT /
   Gemini / Claude prompts remain to run by hand.

---

## 0. The strategy in four lines

1. The **homepage stays sparse**. Its SEO job is small: own the brand name, establish the entity, pass authority down.
2. **Service pages carry commercial intent.** Someone already knows what they want.
3. **Problem pages carry discovery intent.** Someone has a symptom, not a solution. This is where AI search is won.
4. **Case studies carry proof.** Strongest asset you already own, and currently doing nothing for you.

Realistic expectation: search feeds the 1,000 to 2,000 euro tier. The 4,000+ immersive tier comes from Awwwards, referrals, outbound and ads. Build for both, but do not contort the site around search traffic that was never going to convert at the top tier.

---

## 1. Full URL map

```
/                                    Homepage
/services                            Services hub
  /services/3d-websites              PRIORITY
  /services/web-design
  /services/web-development
  /services/one-page-websites
  /services/website-redesign
  /services/seo
  /services/ecommerce-websites       OPTIONAL, only if you sell it
/work                                Work hub
  /work/[case-study-slug]            One per project
/about
/pricing                             RECOMMENDED, see section 5
/contact
/blog                                Blog hub
  /blog/[post-slug]                  Flat, no category in the URL
/privacy
/terms
/cookies
```

Rules that stop this rotting later:

- **Flat blog URLs.** `/blog/why-your-site-isnt-converting`, never `/blog/conversion/why-your-site-isnt-converting`. Categories are for navigation, not URLs. Recategorising later then breaks every link.
- **No dates in URLs.** Kills the ability to refresh a post without it looking stale.
- **No trailing slashes**, applied consistently, with a 301 on the other form.
- **Lowercase, hyphenated, no stop words** unless the keyword needs them.
- **Never change a slug once published.** If you must, 301 it.

---

## 2. Service pages

Only build the ones you actually sell. Marked OPTIONAL means decide, do not default to yes. A thin service page is worse than no service page.

### /services — hub
- **Purpose:** route visitors, pass authority to children, rank for the broad term.
- **Primary keyword:** web design agency Cyprus
- **Title:** Web Design and Development Services | Konaverse
- **Content:** short intro, then one card per service linking down. 400 to 600 words. Do not duplicate the child pages here.

### /services/3d-websites — PRIORITY
- **Purpose:** the top tier. This page sells the 4,000+ work.
- **Primary keyword:** immersive website design *(DATA 2026-09-04: KD 0, 100–1K/month worldwide, an agency-shaped SERP with an AI Overview. "3D website design" (1K–10K, KD 31) is an INSPIRATION SERP — Awwwards, Dribbble, galleries — so it stays in the h1 but the page does not chase it; the flagship listicle does. See `docs/keyword-research.md` §2.)*
- **Co-primary:** 3D website design agency
- **Secondary:** 3D website development, 3D animated website; "WebGL" and "scrollytelling" as vocabulary, not targets
- **Title:** 3D and Immersive Website Design | Konaverse
- **Content:** what a 3D website actually is, what it costs, how long it takes, what it needs from the client, when it is the wrong choice. 1,500 to 2,000 words. Embed the immersive case study.
- **Note:** this page is the single best SEO opportunity you have. Low competition, exact commercial intent, and you can genuinely out-demonstrate everyone because the page itself can be a 3D website.

### /services/web-design
- **Primary keyword:** web design Cyprus
- **Secondary:** website design Nicosia, custom web design
- **Title:** Web Design in Cyprus | Konaverse
- **Content:** 1,200 to 1,500 words. Process, what makes a design custom rather than templated, examples.

### /services/web-development
- **Primary keyword:** web development Cyprus
- **Secondary:** website developer Cyprus, Next.js development
- **Title:** Web Development in Cyprus | Konaverse
- **Note:** design and development are close enough that Google may treat these as near duplicates. Differentiate hard: design page talks visual and UX, development page talks stack, performance, integrations, CMS. If you cannot make them genuinely different, merge them into one page.
- **DECIDED 2026-09-04: both ship.** The differentiation is a rule, not a hope: the design page never discusses stack or performance, the development page never discusses visual direction or UX process. Each links to the other once, in the body, as "the other half". Different case studies embedded on each.

### 2a. The service page template (decided 2026-09-04)

One template, every service page. The order is fixed because it is the order search engines and
language models read in: the citable content sits at the top, the persuasion below it.

1. **h1** with the primary keyword, as real DOM text.
2. **The direct answer**, within the first 100 words: what this is, who it is for, the from-price and
   the timeline, in single self-contained sentences that survive being lifted.
3. **What it is and what it is not**: the "when this is the wrong choice" paragraph qualifies out
   the wrong leads on purpose.
4. **Process**: what the client gives, what they get, how long each step takes.
5. **The two CTAs**: Contact and Book.
6. **Up-link** to `/services`, and the one link to the sister page where one exists.

Locked 2026-09-08: the embedded case study and the "what changes the price" prose were cut from
the template (two builds of each read generic). Proof lives on `/work/[slug]`; the from-price is
already in the hero and the direct answer.

Schema per page: Service with areaServed (Cyprus for bucket A, worldwide for bucket B) and
BreadcrumbList. Only what is visible on the page.

### /services/one-page-websites
- **Primary keyword:** one page website design
- **Secondary:** single page website, landing page design Cyprus
- **Content:** 900 to 1,200 words. This maps to your 1,000 euro tier and has clean, specific intent.

### /services/website-redesign
- **Primary keyword:** website redesign services
- **Secondary:** website refresh, redesign old website
- **Content:** 1,200 words. High commercial intent, and it is the easiest page to write because you have before and after material.

### /services/seo
- **Primary keyword:** SEO services Cyprus
- **Secondary:** local SEO Cyprus, technical SEO
- **Note:** only build this if SEO is a real service line with real deliverables. An SEO page that ranks badly is the worst possible advertisement for an SEO service.

### /services/ecommerce-websites — OPTIONAL
- **Primary keyword:** ecommerce website design Cyprus
- **Note:** you have direct operating experience running an online store, which is a genuine differentiator most agencies cannot claim. Only worth a page if you want the work.

---

## 3. Case studies

`/work/[slug]`. Slugs below use the client name, which is right when the client has a name worth carrying and wrong when the project is unnamed. Rename freely, then never change them again.

| Project | Suggested URL | Tier |
|---|---|---|
| Los Santos Barbers | `/work/los-santos-barbers` | One-page |
| DT Zankatian | `/work/dt-zankatian` | Full site |
| Titan Sable | `/work/titan-sable` | Full site |
| Watch (3D) | `/work/[real-name]` | Immersive |
| Velricon | `/work/velricon` | Full site |

**Every case study needs the same six blocks**, in the same order, or they stop being comparable:

1. What the client does and what they came with
2. The problem, stated as a business problem not a design one
3. What you built
4. One technical or craft detail that proves difficulty
5. Result, with a number if you have one and an honest omission if you do not
6. Link to the matching service page

**DECIDED 2026-09-04:** the six blocks are the case study template, in this order, with block 5 as a
required slot: a number, or the sentence that says honestly why there is none. The three sites the
homepage already features (Tzankatian 2026, Los Santos 2025, Lumière 2026) are the first three.

**On the vercel.app URLs:** those are staging domains. A case study is fine linking to them, but if any of that work is live on a real client domain, link there instead. It reads as more established, and staging links quietly signal unfinished work.

---

## 4. Problem cluster

This is the part almost every agency skips, and it is where AI search is actually won, because language models cite pages that answer a question directly and plainly.

**These live under `/blog`,** not as fake service pages. They are genuinely editorial and they should read that way.

Starter set, roughly in priority order:

| # | Post | URL | Intent it catches | Data (2026-09-04) |
|---|---|---|---|---|
| 1 | What a 3D website costs (2026) | `/blog/what-a-3d-website-costs` | Pricing research, very high intent | Reddit/Fiverr SERP + AI Overview from two small posts; PAA on the 3D head term |
| 2 | How much a website costs in Cyprus (2026) | `/blog/website-cost-cyprus` | Local, high intent | AI Overview built from six Cyprus agency posts — ours needs our tiers in a table |
| 3 | The best 3D websites of 2026, ranked — and what they cost to build | `/blog/best-3d-websites` | The flagship ranked list; every AI "examples" prompt | "best 3d websites" 1K–10K KD 26; PAA asks for "top 10 3D websites 2026"; updated yearly |
| 4 | What scrollytelling is, what it costs, and 10 sites that do it well | `/blog/scrollytelling-websites` | Discovery + examples | "scrollytelling" 1K–10K; AI Overview from tool listicles; name Lenis/GSAP/Three.js |
| 5 | Template vs custom website | `/blog/template-vs-custom-website` | Comparison, pre-purchase | 10–100, AI Overview, low-authority SERP; Absolute Websites (CY) already ranks |
| 6 | How long a website takes to build | `/blog/how-long-a-website-takes` | Objection handling | 1K–10K worldwide |
| 7 | The best web design agencies in Cyprus (2026) | `/blog/best-web-design-agencies-cyprus` | The D6 listicle play | Vasilkoff and Maskwel got cited by Perplexity for theirs |
| 8 | Do you need a 3D website / is a one-page site enough | `/blog/do-you-need-a-3d-website` | Qualifies out the wrong leads, which is a feature | PAA/AI only |
| — | ~~What makes a website feel premium~~ | | | zero data in every tool — folded into #3 or dropped |
| — | Why your website is not converting | `/blog/why-your-website-isnt-converting` | Symptom search | not researched; keep for later |

**Every problem post links to exactly one service page.** That is the whole mechanism. Discovery traffic lands on the problem, gets a real answer, and finds the service at the end.

**Authorship (decided 2026-09-04):** every post names its author, with a face, from a roster of two:
Konstantinos Kyprianou (Technical Architect) and Nabil Al Jbawi (Creative Director). Each is already a
Person entity in the homepage schema (`/#konstantinos`, `/#nabil`); the post's Article schema points
its `author` at that id, so nothing is duplicated and the entity stays one. The post template carries
an author block and visible published and updated dates. Technical and pricing posts default to
Konstantinos, design and "what makes a website feel premium" posts to Nabil; the byline is a fact
about who wrote it, never a rotation.

You are right that thin posts are pointless. Target 1,500 words minimum, with a real opinion in each. Four excellent posts beat twenty adequate ones, and a language model will cite the one that actually answers the question.

---

## 5. On the pricing page

**Build it.** Three reasons, and the first is the strongest:

1. Pricing is already one of the two most common questions you get on WhatsApp. The page is doing work you are currently doing by hand, repeatedly.
2. Pricing pages catch high-intent search: "web design cost Cyprus", "how much does a website cost".
3. Publishing ranges qualifies people out before they reach you, which for a studio selling from 2,000 euro is a filter, not a loss.

**How to publish it without boxing yourself in:** ranges and starting points, never fixed quotes. "From 1,000". "From 4,000". Say what changes the number. Do not build a three-column pricing table with ticks and crosses, that is SaaS furniture and it will look wrong in the noir and cheap for the tier you are selling.

`/pricing`, primary keyword: **web design cyprus prices** *(DATA 2026-09-04: "website cost cyprus" is a blog-post SERP with an AI Overview — blog post #2 wins it and links here; /pricing catches the "prices" modifier, the brand sitelink (67 impressions before launch) and the AI-feature impressions it was already earning).*

---

## 5a. The contact page and the two CTAs (decided 2026-09-04)

`/contact` exists as a real page. The launch decision of 2026-08-25 (redirect it, let Calendly carry
leads) is reversed for the inner-page phase.

- **Two CTAs, everywhere a CTA appears:** **Contact**, which goes to `/contact`, and **Book**, which
  opens Calendly (`CALENDLY_URL`, the existing popover). The homepage invitation, the nav, every
  service page foot and every case study foot carry both. Contact is for the person who wants to
  write first; Book is for the one who already wants the meeting.
- **The page itself:** email, the Calendly embed or button, the studio's location and hours, and the
  two or three questions a first email should answer so the reply is useful. Whether a form returns
  is open: the Resend route was deleted at launch, so a form is new work and needs a processor
  named again in the privacy policy.
- **SEO job:** small. It carries the LocalBusiness or ProfessionalService schema with the Cyprus
  address and is the page the Google Business Profile points at.

## 6. Language

You are in Cyprus targeting globally. Decide now, because retrofitting is expensive:

- **English only.** Simplest, matches the global ambition, and is almost certainly right.
- **English plus Greek** would need `/el/` paths and hreflang tags on every page, and doubles all content work forever.

Recommendation: English only. Revisit if local business becomes the main revenue line.

---

## 7. Technical checklist

- `sitemap.xml`, generated, submitted to Search Console
- `robots.txt`, with the sitemap referenced
- Canonical tag on every page, self-referencing
- **Schema:** Organization on the homepage, Service on each service page, BreadcrumbList site-wide, Article on posts, FAQPage where there is a real FAQ. Structured data matters more for AI search than for Google.
- **Google Business Profile**, claimed and filled. Highest-leverage single action for anything containing "Cyprus".
- Unique title and meta description per page, no templating
- One `h1` per page, containing the primary keyword, as real DOM text
- **No important text inside the WebGL canvas.** Crawlers and language models see nothing there.
- Images as WebP or AVIF, with real alt text
- **Core Web Vitals are the live risk.** Scrubbed frame sequences wreck Largest Contentful Paint unless the first paint is a lightweight still and the sequence loads after. Design this in, do not patch it later.
- 404 page that is designed, not default
- 301 every old URL from the current site to its new equivalent on launch day

---

## 8. Internal linking

The rules, which matter more than the diagram:

- Homepage links **down** to the services hub, work hub, **the three featured case studies**, **pricing**, and contact. Seven URLs, and nothing else. *(Amended 2026-08-14 — this rule originally read "the services hub, work hub, and contact. Not to twenty places." The case studies were added because unlinked image tiles are a promise the page breaks, and because §3 below notes the case studies are the strongest asset already owned and currently doing nothing; a homepage link is the cheapest fix. Pricing was added because it is one of the two questions already arriving by WhatsApp, per §5. The point of the rule is not the number — it is not skipping a hub that exists to fan out, which is why individual service pages and blog posts remain excluded.)*
- Services hub links **down** to each service page, and each service page links **back up**.
- Every service page links to **at least one case study** that proves it.
- Every case study links to **the service page** that produced it.
- Every blog post links to **exactly one** service page.
- The footer carries the full map. This is the only place every URL appears.
- **No orphan pages.** If nothing links to it, it does not exist.

---

## 9. Build order

Do not build all of this before launch. Ship in this order:

**Launch:** `/`, `/services` plus 3D websites and web design, `/work` plus two case studies, `/about`, `/contact`, the three legal pages.

**Where this stands on 2026-09-04:** `/`, the legal pages and the 404 are live. The rest is the
inner-page phase, which begins with the keyword research session (decision 7) and then the five
templates: service page, case study, blog post, the two hubs. About, pricing and contact are one-offs.

**Within a month:** remaining service pages, remaining case studies, `/pricing`.

**Ongoing:** `/blog`, one strong post at a time.

A site with eight excellent pages outranks one with thirty thin ones, and it also launches this year.
