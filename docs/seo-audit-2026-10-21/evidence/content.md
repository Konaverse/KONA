# Content quality and E-E-A-T: Konaverse audit, 21 October 2026

Scope: the raw HTML a non-JS crawler receives for all 25 sitemap URLs (fetched 21 Oct 2026 with the plugin's `fetch_page.py`, raw mode, all 200), read against the source data in `src/lib/*.ts` and `src/app/(v4)/*`. Compared with `docs/seo-state-2026-10-13.md` and `docs/seo-plan-q4-2026.md`. Status per finding: NEW, STILL OPEN, REGRESSED or CONFIRMED FIXED. Inferences are marked SUSPECTED.

The coordinator stopped evidence gathering early. The following were **not done**: numeric readability scores (no Flesch or grade-level computation), the bundled `metadata_template.py` run (I only read the metadata by hand, see section 9), any assessment of the three legal pages, and a rendered (JS) comparison.

## 1. Scores

| Measure | Score | Basis |
| --- | ---: | --- |
| **Content quality, overall** | **62 / 100** | Strong service pages and case studies, honest result sections and one excellent first-hand article. Held back by no third-party proof, a thin /about, /work with no text, contradictions, and guarantee-style claims |
| E-E-A-T, weighted | 50 / 100 | Breakdown below |
| AI citation readiness | 68 / 100 | Each service page opens with "The short answer" plus price and timeline. Posts open with the answer and have tables. /work and /about give a fetcher almost nothing to quote |

E-E-A-T uses this skill's internal weights, not Google's. Google publishes no numeric weights.

| Factor | Weight | Score | Why |
| --- | ---: | ---: | --- |
| Experience | 20% | 60 | Five real client builds with specific craft detail: 121/73 rendered frames for Chris N Clean, TDK's in-site editor, HEIMAT's per-project structured data, and the 172-URL migration post with its own records. There are no outcomes, no client voices and no reviews. |
| Expertise | 25% | 58 | Named authors have role bios on posts and personal LinkedIn links. The redesign post is genuinely expert, and the Next.js post cites vendor docs. But /about shows no bio, Andreas has no role, and the performance claims are unverified. |
| Authoritativeness | 25% | 20 | No external recognition: 0 Google or Clutch reviews (seo-state lines 48, 52), no awards and no press. The real link count is in single digits. |
| Trustworthiness | 30% | 62 | Prices are published, results sections are honest, concepts are disclosed on their own pages, and phone and email are present. Against that: draft hours, contradictions between pages, "guaranteed" and "0 lost" claims, and a concept shown unlabelled on the homepage. |

## 2. Page inventory (raw HTML, whole-page words including navigation and footer)

| Page | Words | Notes |
| --- | ---: | --- |
| / | 609 | Hero, six service cards, 4 featured projects, 3 posts. Clear positioning. |
| /services | 191 | One line per service. Thin but serviceable as a hub. |
| /services/* (6) | 889 to 1,170 | Main body 744 to 1,017 words. Short answer, fit, four "fixes", work, deliverables, add-ons, process. |
| /work | **36** | H1 plus "Every one from a blank file." Project names exist only in `data-name` attributes and image alt text. |
| /work/* (7) | 1,103 to 1,283 | Main body 1,002 to 1,165 words. All seven follow the same six-block structure. |
| /about | 467 | Names and roles only, no bios visible. |
| /blog | 168 | Index of 3 posts. |
| /blog/* (3) | 1,076 / 1,295 / 1,857 (schema wordCount) | Cost, redesign, Next.js vs Webflow. |
| /contact | 527 | Facts row and 8 visible questions (native details, no FAQPage markup, consistent with the owner decision). |

Word-count floors (topical coverage only, not a ranking factor):
- **Service pages:** two fall slightly under the 800-word service floor, SEO at 744 and one-page at 772. Both answer their query fully, so do not pad them.
- **Blog posts:** the cost post (1,076) and the redesign post (1,295) are under the 1,500 floor. Both are complete for their intent; padding would hurt them.

## 3. Near-duplicate measurement (service pages and case studies)

Method: the main body from "The short answer" to the closing CTA, 5-word shingles.

- **Service pages, pairwise Jaccard:** 0.013 to 0.086. The highest pair is web-development and website-redesign at 0.086.
- **Share of each service page's shingles found on any other service page:** web-design 15.5%, web-development 18.0%, 3d-websites 12.9%, one-page 16.2%, redesign 20.2%, seo 6.1%. The shared text is the running-cost rows (hosting, domain, "Changes after launch"), "Anything not on this list is quoted before work starts." and the section scaffolding.
- **Verdict on duplication: not near-duplicate. CONFIRMED not an issue.**
- **Case studies:** pairwise Jaccard 0.004 to 0.018, with 2 to 5% shared. Fully distinct.
- **Structural sameness (low severity):** all six service pages use one H2 skeleton: [slogan], "What a X fixes", "Recent X work", "What you get", "Add-ons and running costs", "How it goes". They also use one device: a quoted customer complaint, then the answer, then a client name. That is acceptable for a service template.
- **Proof breadth is the real limit.** Each page leans on one client:
  - The redesign page's four "fixes" are all Velricon.
  - The one-page page's four are all Los Santos.
  - Three of the four on the 3D page are the Lumière Éclat concept.
  - Velricon appears on four of six service pages.
  - That is the honest size of the portfolio (5 real sites, 2 concepts). The fix is more real proof, not more copy.

## 4. Findings, ranked by expected impact

Severity: High, Medium or Low. Every quote is from the live raw HTML.

### H1. Guarantee-style claims the site cannot evidence (NEW). High
- **Web development**, https://kona-verse.com/services/web-development: stat "Largest paint, guaranteed < 2.5 s". Source `src/lib/service-pages.ts:359`.
- **3D websites**, https://kona-verse.com/services/3d-websites: stat "On a mid-range phone 60 fps". Source `src/lib/service-pages.ts:506`.
- **About**, https://kona-verse.com/about: "Hand-written code, rendered on the server. Sixty frames on every scroll." Source `src/app/(v4)/about/page.tsx:177`.
- **Website redesign**, https://kona-verse.com/services/website-redesign:
  - Stat "Old URLs redirected 0 lost" (`service-pages.ts:763`).
  - Short answer: "every old URL is redirected so nothing you rank for is lost" (`:757`).
  - Deliverable: "so nothing you rank for is lost" (`:853`). The meta description also says "so your rankings survive the move".

**Why it matters:**
- The studio's own records contradict these claims:
  - AGENTS.md says headless timings "cannot establish smoothness on a physical device" and that physical-device review "remains outstanding".
  - The plan recorded the site's own mobile LCP at 15.1 s on 2 Oct (`seo-plan-q4-2026.md:15`). Current LCP is the performance agent's area; check that evidence before keeping the word "guaranteed".
  - The studio's own redesign article states "We do not hold traffic or ranking figures for the months after". Redirects protect URLs; they do not guarantee rankings.
- The voice guide (`konstantinos-voice-and-search.md:36`) says: "Qualify an outcome when implementation affects it."
- These are the claims a Quality Rater or a careful buyer tests first.

**Fix:** state what is controlled and measurable. Suggested copy (no dashes):
- Web development stat: "Largest paint target 2.5 s, measured before launch".
- 3D stat: "Frame budget set per device". Or publish the measured figure for a named site and device.
- Redesign: "Every old URL mapped and redirected", with stat "Old URLs mapped: all".
- Redesign short answer: "every old URL is redirected, so the addresses Google knows keep answering".
- About: remove "Sixty frames on every scroll", or replace it with a measured, named result.

### H2. Contradictions about who and where the studio is (NEW). High
- **/about description and schema** say "Konaverse is three people in Cyprus" (`about/page.tsx:106`) and list three co-founders.
- **The /about timeline contradicts that:**
  - 2021: "Konaverse starts as two people and a laptop in Limassol" (`:207`).
  - 2025: "a team of two that stays two" (`:209`).
- **Elsewhere:** Clutch and the audit brief place the studio in Lakatameia/Nicosia, Clutch says 2 to 9 people, and every case study is Nicosia.
- **Two more about-page lines contradict the 3D work:**
  - Blender card: "Every 3D object on our sites is modelled, lit and rendered here, then brought to the browser as a loop" (`:196`).
  - Homepage card: "Path-traced renders, never live guesswork" (`src/components/v4/services-data.tsx:100`).
  - 3D page short answer: "pre-rendered, path-traced objects" (`service-pages.ts:500`).
  - But the flagship 3D piece is real-time: "The watch is a real-time model with a physically based material" (`src/lib/case-studies.ts:379`).
- Contradictions about headcount, location and method undermine "who is behind this site". That question is the centre of Trust in the QRG.

**Fix (owner confirms the facts):**
- Make the timeline match the team: when and where it started, and when Andreas joined.
- Describe the 3D method truthfully as "pre-rendered loops and real-time WebGL, chosen per project", and drop "never live" and "every 3D object".

### H3. /about is the E-E-A-T hub, but carries names and titles only (STILL OPEN, partly NEW). High
- **What the page shows:**
  - Visible text: "Konstantinos Kyprianou / Technical Architect & Co-Founder", "Nabil Al Jbawi / Creative Director & Co-Founder", "Andreas Kyriakou / Co-Founder".
  - No biography, no experience, no prior work, no per-person LinkedIn link.
  - Bios exist in source (`about/page.tsx:134-145`) but appear only inside JSON-LD, so the markup describes content users cannot see.
- **Andreas:** role is the bare "Co-Founder" with an empty bio (`:148-160`). The placeholder text was removed from the schema, which is **CONFIRMED FIXED**; the missing role is STILL OPEN (`seo-plan-q4-2026.md:21,40`).
- **Same person, two descriptions:** the /about Person node ("if it has to load in under a second and move at sixty frames, it goes through him") differs from the root-layout Person for the same `@id` (`src/lib/site.ts:48-51`).
- **Bylines:**
  - Every post byline links "About Konaverse" to `/about`, not to the existing anchors `/about#konstantinos` and `/about#nabil`.
  - So the page a rater reaches from an author byline does not tell them who the author is.
  - The plan wanted "byline → /about person" (`seo-plan-q4-2026.md:96`).
- **Hero line reads as unedited:** "We aim to fill the internet with websites that convey a strong character and personality through it." Also the H2 "What we make,in one sentence." has a missing space.
- "Branding" is listed under "What we make" (`:187`) but is not a sold service.
- GSC shows /about with 74 impressions and 0 clicks (seo-state line 14). It is the second most-seen page.

**Fix:**
- Render the bios visibly on the person cards, using one wording per person shared with `site.ts`.
- Add verifiable specifics the owner can stand behind: years building, languages, real past roles, the person's LinkedIn.
- Give Andreas a real role and one line.
- Point bylines at `/about#<person>`.
- Edit the hero line.
- Never add invented credentials.

### H4. No third-party proof anywhere on the site (STILL OPEN). High
- **Ranking and sales outcomes:** none in any case study. Each one says so honestly, for example "Velricon has not shared enquiry or ranking figures for publication, and we do not report numbers we have not been given." This honesty is good and **CONFIRMED** (no invented numbers; `case-studies.ts:23-25`).
- **Reviews:** 0 on Google, 0 on Clutch.
- **Client voice:** none. The invented quotes are gone, **CONFIRMED FIXED**: no `kind: 'quote'` block is used, only the type at `case-studies.ts:37` remains.
- **The SEO service page has the weakest proof.** Every "fix" is process (keyword map, HTML-first) with no search result for any client. That matters on a money page where buyers want proof that it worked.
- **Real proof that would close this:**
  1. Google reviews from the five real clients, collected at handover with no incentive.
  2. Clutch reviews.
  3. Client-approved figures: GSC clicks or impressions before and after for Velricon and HEIMAT, TDK's units published through the CMS, Chris N Clean quote-form submissions per month.
  4. A named client quote, with the client's written permission.
- Do not draft any of these.

### M1. /work hub has 36 words of crawlable text (STILL OPEN). Medium
- **URL:** https://kona-verse.com/work.
- **Visible text:** only "Selected work Websites we designed and built / Every one from a blank file."
- **Links:** the seven case-study links have empty anchor text. Names exist only as `data-name` and alt text, and the alt says "designed and built by Konaverse" for the two concepts as well.
- Plan item `seo-plan-q4-2026.md:47` ("project name + line as real text") is not done.
- The portfolio hub is a prime Experience page for an agency, and AI fetchers read it as empty.
- **Fix:** render each project's name, sector, year and one line (already in `src/lib/work-projects.ts`) as text in the card, with "Studio concept" on Lumière Éclat and City Arcade.

### M2. Lumière Éclat presented without its concept label outside its own page (NEW). Medium
- **Where the label is present:** the case study discloses it well ("Client: Studio concept", "a watchmaker that does not exist", "There is no client and there are no sales numbers"). The 3D service work card says "(fictional)". Both are **CONFIRMED**.
- **Homepage "Featured projects":** "Lumière Éclat ↗ 3D website View case study". It sits beside three real clients and carries no concept label.
- **3D service page:** three of four customer-voice problem rows ("“Our product looks flat in a photograph.”", "“Immersive sites feel like a gimmick.”", "“It has to work on a phone too.”") are answered with Lumière Éclat. That reads as a client engagement.
- **Fix:**
  - Add "Studio concept" to the homepage card and the /work card.
  - On the 3D page, caption the rows "Lumière Éclat, our studio concept".
  - Real proof needed: one paid 3D client project.

### M3. Implied ranking outcome for Velricon (NEW, SUSPECTED overclaim). Medium
- **Claim:** https://kona-verse.com/services/website-redesign says "The keyword work came before the copy, so each new service page now owns its own term." (`service-pages.ts:811`).
- "Owns" reads as "ranks for".
- The Velricon case study says no ranking figures were shared.
- **Fix:** "so each new service page targets its own term". Or, with Velricon's permission, cite the actual GSC position.

### M4. 3D page misses its keyword-map literal (STILL OPEN). Medium
- `seo-plan-q4-2026.md:80` asks for "3d website design agency" in the first 100 words and in an H2.
- Neither is present.
- **Current H2s:** "Make the screen a place", "What a 3D site fixes" and the others.
- The H1 and title do carry "immersive website design" (KD 18, the winnable term).
- **Fix:** work the phrase naturally into the short answer, for example "Konaverse is a 3D website design agency in Cyprus working with brands anywhere", and into one H2. Do not repeat it beyond that.

### M5. Cost article: market question answered with own prices only; edit not dated (NEW). Medium
- **Opening of** https://kona-verse.com/blog/website-cost-cyprus: "A professionally designed website in Cyprus costs from €1,200 for a one-page site...". It then says "Those are our own starting prices".
- **The only market datum** is "advertisements at the top quoted prices from €800" (September 2026).
- **The comparison table** generalises about competitors without a source: "Often the agency’s account or a rented platform", "What happens to your old URLs? Usually nothing".
- **Hosting:** now reads "€300 a year, or €600 a year", so the monthly-to-yearly correction is **CONFIRMED FIXED live**.
- **Dates:** the edit is not dated. `dateModified` is still 2026-10-03, with no visible "Updated" line. A price change is a material update.
- **Fix:**
  - Add a dated, sourced market range: published Cyprus price pages and ads, recorded with URL and date in a research note.
  - Make the first sentence about Cyprus in general, then give the studio's own prices.
  - Soften the table's claims about competitors to "can", or source them.
  - Show and mark up an "Updated" date.

### M6. Draft facts still live on /contact and in case studies (STILL OPEN). Medium
- **Contact:** "Hours Monday to Friday, 9 to 18 EET" and "Replies Within one working day" are still marked "FIRST DRAFTS ... the user confirms them" (`src/app/(v4)/contact/page.tsx:35-36, 52, 56-57`). The plan lists them as open (`seo-plan-q4-2026.md:40`).
- **"EET":** Cyprus is on EEST until 25 Oct. "Cyprus time" avoids this.
- **Hours must match the GBP hours exactly.** I did not check them against GBP in this pass.
- **Case studies:** client facts are still flagged "COPY IS A FIRST DRAFT ... the user confirms every claim" (`case-studies.ts:23-25`). Examples:
  - Chris "started on his own in 1992"
  - HEIMAT "more than twenty-five years ... more than two hundred homes"
  - Los Santos "a 4.9 rating", Fahed "cutting since 2015"
- **Velricon:** year, service and line are "FIRST DRAFTS" (`work-projects.ts:10`).
- **Fix:** the owner confirms each fact with the client and removes the draft flags.

### L1. AI-writing tell: stock contrast formula (NEW). Low
- **Homepage services block alone:** "not just the information", "never live guesswork", "not just yours", "a design system, not a theme", "not after it", "never assembled from a template", "not just shipped", "in weeks, not months", "not just Google".
- **The same pattern recurs on service pages:** "not picked from a theme", "a conversation, not a form", "has to perform, not just exist".
- The house guide says to avoid "stock contrast formulas" (`konstantinos-voice-and-search.md:42`).
- **Fix:** keep two or three where the contrast is the point, and rewrite the rest as plain claims.

### L2. Next.js vs Webflow: H1 promises a takedown the article does not deliver (NEW). Low
- **H1:** "Custom Next.js vs. Webflow: The Technical Limitations Keeping Your Brand From Scaling".
- **The body opens** "Webflow is a strong choice for a professionally designed marketing website".
- **The `<title>` is better:** "Next.js vs. Webflow: When a Custom Build Makes Sense".
- **Boilerplate footer on all three posts:** "Every number in this article is from our own projects or price list". That is untrue for this post, whose limits come from Webflow's docs.
- **Fix:** align the H1 with the title, and make the footer line per post.

### L3. Raw-HTML text hygiene (STILL OPEN or NEW). Low
- **Homepage H2:** textContent is "WhatWe()Six servicesDo". There is `aria-label="What we do"`, but headings are read from text. This is the `sg-h` component, outside the split-text fix in `seo-plan-q4-2026.md:41`.
- **Service-page display lines are glued:** "Built to loadfast, rank, andnever fight you", "Presence youfeel beforeyou read a word". They are aria-hidden with a correct aria-label, but plain-text extractors read the glued words.
- **Button sizer labels repeat in the text stream:** "Start a projectSay helloStart a project..." (×9 per button).
- **Fix:** put a space or newline between the line spans, and give the sizer duplicates `aria-hidden` plus a non-text approach. The technical agent may own this one.

### L4. Case-study meta descriptions 197 to 270 characters, all opening "How Konaverse ..." (STILL OPEN, `seo-plan-q4-2026.md:48`). Low
- Trim to about 155 characters, and vary the openings.

### Not an issue / CONFIRMED FIXED
- **Anonymised migration client:** not named or identifiable by name in the redesign post ("The client is not named here at their request"). CONFIRMED.
  - SUSPECTED low re-identification risk: sector, platform, bilingual and 172 pages together may be recognisable locally. This is the owner's call; no change is proposed.
- **/work title and description:** now "Website Design Portfolio" with a true description. The old "videographer" text is gone. CONFIRMED FIXED.
- **Placeholder, TODO or lorem text:** none in live text. The only "lorem" is a deliberate sentence in the Lumière Éclat case study. CONFIRMED.
- **Posts:** visible dates, visible author role bio, and BlogPosting with the Person `@id` author on all three. CONFIRMED.

## 5. Service pages vs keyword map: does the first screen answer the target query?

| Page | Map target (`seo-plan-q4-2026.md:77-83`) | First screen answers it? | Gap |
| --- | --- | --- | --- |
| /services/web-design | web design cyprus | **Yes.** H1 "Web design in Cyprus"; the short answer gives what it is, who it is for, from €1,800 / €2,500 and 4 to 6 weeks. | Only the proof (reviews) is missing |
| /services/web-development | web development cyprus | **Yes**, with the Next.js / SSR angle the map asked for | "guaranteed < 2.5 s" (H1) |
| /services/3d-websites | immersive website design + "3d website design agency" | **Partly.** "immersive website design" is in H1 and title; the agency literal is missing | M4; the method contradiction (H2) |
| /services/one-page-websites | one page website design (win on cost) | **Yes.** From €1,200, 2 to 3 weeks, in the first lines | None |
| /services/website-redesign | website redesign cyprus, later website redesign services | **Partly.** The short answer never says "Cyprus"; the title targets the later phase "Website Redesign Services" | "0 lost" (H1) |
| /services/seo | seo cyprus + AI-search section | **Yes.** H1 "Search and AI visibility for Cyprus businesses"; prices €500 / €300 a month | No outcome proof (H4) |
| /services | web design agency cyprus | Adequate. H1 "Web design, development and 3D websites, from Cyprus" | Thin (191 words) but acceptable for a hub |

## 6. Per page type, brief

- **Homepage.** Clear one-line positioning, with services, work and posts linked as text. Two weaknesses: the unlabelled concept (M2) and the contrast-formula cluster (L1).
- **Case studies (7).** The strongest Experience content on the site: specific, distinct and honest about missing numbers. Weaknesses: draft-flagged client facts (M6) and no outcomes or quotes (H4).
- **Blog.**
  - The redesign post is model first-hand content: its own records (224 vs 172 URLs, 57 redirects, 176/176 checks, 135 to 143 indexed) and explicit limits.
  - The cost post is useful and transparent but thin on market data (M5).
  - The Next.js post is balanced and well sourced, apart from its headline (L2).
- **Contact.** Phone, email, languages and prices are consistent with the service pages; the hours are still drafts (M6). There is no address, which matches the owner's decision until GBP shows one.

## 7. Fix order for a small studio with near-zero non-brand traffic

1. **H1 and H2, about an hour of copy edits, no design change.** Remove "guaranteed", "60 fps", "0 lost" and "sixty frames", and fix the two-vs-three and Limassol lines and the 3D method wording. This removes the claims most likely to cost trust with a buyer, a rater or an AI summary.
2. **H3.** Visible bios on /about, a role for Andreas, and byline anchors. This turns the second most-seen page into the who-is-behind-this page.
3. **H4.** Owner-led proof: ask the five real clients for Google reviews at once, and ask Velricon and HEIMAT for permission to publish GSC figures. This is the only lever on Authoritativeness and on the local pack (seo-state "What this means" 1).
4. **M1 and M2.** /work text plus concept labels, a small component change.
5. **M4 and M3.** The 3D literal and the Velricon wording.
6. **M5.** Cost-post market data plus an "Updated" date. This needs a research note in line with the editorial standard.
7. **M6, then L1 to L4.**

## 8. Evidence files

- **Raw HTML and extracted text (scratchpad, not committed):** `C:\Users\konst\AppData\Local\Temp\claude\C--Users-konst-Projects-KONA\d5d536f6-1a6d-4751-9c13-550f2341c4ac\scratchpad\text\` (`*.html`, `*.txt`, `_summary.json`).
- **Overlap script:** `...\scratchpad\tools\overlap.py`.
- **Extractor:** `...\scratchpad\tools\extract.py`.

## 9. Templated metadata (manual read; script not run)

- **Titles and descriptions:** unique on all 25 URLs.
- **Shared CTA:** no closing CTA is shared across descriptions.
- **Descriptions vs titles:** no description restates its title.
- **One pattern:** all seven case-study descriptions open "How Konaverse (designed and) built ...". Low risk, but vary them when trimming (L4).
- **Recommended next step:** run `metadata_template.py --pairs-file` to confirm.
