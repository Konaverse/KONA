# Konaverse — Site Architecture

Version 1. Everything here is a draft to react to.
Direction: Whiteout. One family, no labels, refraction signature.

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
/projects                            Work hub
  /projects/[case-study-slug]        One per project
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
- **Primary keyword:** 3D website design
- **Secondary:** 3D animated website, immersive website design, scrollytelling website, WebGL website
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

`/projects/[slug]`. Slugs below use the client name, which is right when the client has a name worth carrying and wrong when the project is unnamed. Rename freely, then never change them again.

| Project | Suggested URL | Tier |
|---|---|---|
| Los Santos Barbers | `/projects/los-santos-barbers` | One-page |
| DT Zankatian | `/projects/dt-zankatian` | Full site |
| Titan Sable | `/projects/titan-sable` | Full site |
| Watch (3D) | `/projects/[real-name]` | Immersive |
| Velricon | `/projects/velricon` | Full site |

**Every case study needs the same six blocks**, in the same order, or they stop being comparable:

1. What the client does and what they came with
2. The problem, stated as a business problem not a design one
3. What you built
4. One technical or craft detail that proves difficulty
5. Result, with a number if you have one and an honest omission if you do not
6. Link to the matching service page

**On the vercel.app URLs:** those are staging domains. A case study is fine linking to them, but if any of that work is live on a real client domain, link there instead. It reads as more established, and staging links quietly signal unfinished work.

---

## 4. Problem cluster

This is the part almost every agency skips, and it is where AI search is actually won, because language models cite pages that answer a question directly and plainly.

**These live under `/blog`,** not as fake service pages. They are genuinely editorial and they should read that way.

Starter set, roughly in priority order:

| Post | URL | Intent it catches |
|---|---|---|
| What a 3D website actually costs | `/blog/what-a-3d-website-costs` | Pricing research, very high intent |
| Why your website is not converting | `/blog/why-your-website-isnt-converting` | Symptom search |
| Template vs custom website | `/blog/template-vs-custom-website` | Comparison, pre-purchase |
| How long a website takes to build | `/blog/how-long-a-website-takes` | Objection handling |
| What makes a website feel premium | `/blog/what-makes-a-website-feel-premium` | Brand-adjacent, links to your positioning |
| Do you need a 3D website | `/blog/do-you-need-a-3d-website` | Qualifies out the wrong leads, which is a feature |
| Website costs in Cyprus | `/blog/website-cost-cyprus` | Local, high intent |

**Every problem post links to exactly one service page.** That is the whole mechanism. Discovery traffic lands on the problem, gets a real answer, and finds the service at the end.

You are right that thin posts are pointless. Target 1,500 words minimum, with a real opinion in each. Four excellent posts beat twenty adequate ones, and a language model will cite the one that actually answers the question.

---

## 5. On the pricing page

**Build it.** Three reasons, and the first is the strongest:

1. Pricing is already one of the two most common questions you get on WhatsApp. The page is doing work you are currently doing by hand, repeatedly.
2. Pricing pages catch high-intent search: "web design cost Cyprus", "how much does a website cost".
3. Publishing ranges qualifies people out before they reach you, which for a studio selling from 2,000 euro is a filter, not a loss.

**How to publish it without boxing yourself in:** ranges and starting points, never fixed quotes. "From 1,000". "From 4,000". Say what changes the number. Do not build a three-column pricing table with ticks and crosses, that is SaaS furniture and it will look wrong in Whiteout and cheap for the tier you are selling.

`/pricing`, primary keyword: website cost Cyprus.

---

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

**Launch:** `/`, `/services` plus 3D websites and web design, `/projects` plus two case studies, `/about`, `/contact`, the three legal pages.

**Within a month:** remaining service pages, remaining case studies, `/pricing`.

**Ongoing:** `/blog`, one strong post at a time.

A site with eight excellent pages outranks one with thirty thin ones, and it also launches this year.
