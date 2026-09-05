# Konaverse — Keyword research, v1 (data), 4 Sep 2026

Phase 0 of `konaverse-seo-master-plan.md`, run in one session on 2026-09-04 through the user's own logged-in
accounts. This is the synthesis; the raw pulls are in `docs/keyword-research/`:

| file | what |
|---|---|
| `gsc-2026-09-04.md` | Search Console 16 months + Generative AI report; Ahrefs Site Explorer baseline |
| `suggest.md` / `suggest.json` | 1,311 Google + Bing autocomplete suggestions, Cyprus and worldwide, 50 seeds |
| `keyword-planner-raw.md` | Keyword Planner ranges for 112 terms, Cyprus AND worldwide; Ahrefs KD for 14 primaries |
| `serp-autopsy.md` | Google top 10 + SERP features + People Also Ask for 16 queries |
| `ai-engine-autopsy.md` | Perplexity, all 10 buyer prompts; who is cited and from where |

Every keyword in the two planning docs was marked "guess, verify". This file replaces the guesses.

---

## 1. What the data says, in six lines

1. **The site has no non-brand search presence.** 73 clicks in 16 months, all brand; DR 4, four linking domains;
   Ahrefs sees 0 organic keywords. The inner pages start from zero, which is the expected baseline, not a problem.
2. **Cyprus volumes are tiny and the SERPs are owned by aggregators.** "web design cyprus" is 100–1K/month in
   Cyprus (1K–10K worldwide — most of it searched from OUTSIDE Cyprus). Clutch, Sortlist, DesignRush and
   TechBehemoths sit in every top 10, a local pack sits above all of it, and Ahrefs rates the head terms KD 49–57
   because of those aggregators' links. The local agencies ranking around them are thin.
3. **The global 3D head terms are inspiration SERPs, not agency SERPs.** "3d website design", "webgl website",
   "scrollytelling website", "one page website design" return Awwwards, Dribbble, galleries, Reddit and tool
   blogs. A service page cannot rank there. The **agency modifier** ("3d website design agency", "immersive
   website design agency") returns real studios with an AI Overview — and "immersive website design" is
   KD 0 with 100–1K/month worldwide.
4. **The cost questions are the open doors.** "how much does a 3d website cost" has a Reddit-and-Fiverr SERP
   with an AI Overview built from two small agency posts. "website cost cyprus" has an AI Overview built from six
   Cyprus agency posts. Both are answerable better than anyone has, with our real tiers.
5. **AI engines cite the aggregators and the listicles, not agencies.** Perplexity mentioned Konaverse in 0 of 10
   prompts. Every "who is best" answer was assembled from Clutch/Sortlist/DesignRush/OneLittleWeb/ProvenExpert and
   from third-party or agency-authored ranked lists (Psychoactive's WebGL agency guide, Metabole's examples posts,
   Superside's service listicles). Agencies' own pages were quoted only when a sentence carried stack + price +
   timeline.
6. **Pricing intent is everywhere.** PAA on almost every query is a cost question; the old /pricing page earned
   67 impressions and 4 AI-feature impressions while doing nothing; autocomplete's one strong Cyprus signal is
   "web design cyprus prices".

---

## 2. Keyword map v1 — one primary per page, from data

Volume: Keyword Planner range, Aug 2025–Jul 2026 (CY = Cyprus, WW = worldwide). KD: Ahrefs free checker.
"—" = below the tool's floor (real but tiny).

### Bucket A — Cyprus commercial (feeds the €1,000–€2,000 tier)

| page | primary | vol CY | vol WW | KD | secondaries (on-page, not separate pages) | SERP note |
|---|---|---|---|---|---|---|
| `/services` | web design agency cyprus | 10–100 | 10–100 | — | web agency cyprus · digital agency cyprus (100–1K, off-positioning but the biggest local term) · web design company cyprus (100–1K CY) | local pack + 2–3 aggregators |
| `/services/web-design` | web design cyprus | 100–1K | 1K–10K | 57 | website design cyprus (100–1K) · web design nicosia / limassol / larnaca / paphos (10–100 each) · custom web design | thin local pages, aggregators, 3 ads "from €800" |
| `/services/web-development` | web development cyprus | 100–1K | 1K–10K | 49 | web developer cyprus (10–100) · web development company cyprus · next.js developer (100–1K WW) | same set; no PAA |
| `/pricing` | web design cyprus prices | — | — | — | website prices cyprus · website cost cyprus (the blog post ranks for this, the page catches the sitelink and the "prices" modifier) | — |
| `/contact` | (brand + NAP; LocalBusiness schema) | | | | web design nicosia as the city term on-page | |
| `/services/seo` (O2, still open) | seo cyprus | 100–1K | 100–1K | — | seo services cyprus (10–100 CY) · local seo cyprus · seo agency cyprus (CPC €2–14) | exact-match domains, thin |
| backlog: eshop | eshop development cyprus | 10–100 | 10–100 | — | NOT "eshop cyprus" (100–1K, €0.18 CPC = consumers looking for shops) | |

### Bucket B — global niche (feeds the €4,000+ tier)

| page | primary | vol WW | KD | secondaries | SERP note |
|---|---|---|---|---|---|
| `/services/3d-websites` | **immersive website design** | 100–1K | **0** | 3d website design agency (—, agency SERP w/ AI Overview) · 3d website development (100–1K) · 3d website design (1K–10K, KD 31, inspiration SERP — h1 carries it, page does not chase it) · 3d animated website (1K–10K) · webgl / three.js as words | studios rank on brand; Noomo, Lusion, Immersive Garden, Active Theory |
| `/services/website-redesign` | website redesign services | 10K–100K | 19 | website redesign agency (1K–10K) · website redesign company · website redesign cyprus (—) | US mid-size agencies; long-tail + Cyprus modifier first, head term later |
| `/services/one-page-websites` | one page website design | 1K–10K | 20 | single page website (design) (1K–10K, High ads comp) · landing page design (10K–100K, builders) · landing page design cyprus (—) | inspiration + DIY builders; the page wins on the PAA cost question |
| `/work` (hub) | web design portfolio | 10K–100K | — | website design examples (1K–10K) · 3d website examples (100–1K) | galleries; the hub is for humans and internal links, not this term |

**Change from the guess:** the 3D page's primary moves from "3D website design" to **"immersive website design"**
(KD 0, agency-shaped SERP) with "3D website design agency" beside it; the title stays "3D and Immersive Website
Design" because the h1 can carry both. "WebGL website" and "scrollytelling website" are dropped as targets
(end-user / listicle intent) and kept as vocabulary.

### Bucket C — discovery posts (win the AI citations). Priority order, from the data

| # | post | target | vol WW | vol CY | why now |
|---|---|---|---|---|---|
| 1 | **What a 3D website costs (2026)** — tier table with timelines, first-hand | how much does a 3d website cost · 3d website cost | 10–100 | — | Reddit/Fiverr SERP, AI Overview built from two small posts; PAA on "3d website design" itself. Our €4,000 sits at the bottom of the market's $3.5–15k band — say so. |
| 2 | **How much a website costs in Cyprus (2026)** | website cost cyprus · how much does a website cost in cyprus | — | — | six agency posts + AI Overview already; ours needs OUR tiers in a table and named price drivers. Links to /pricing. |
| 3 | **The best 3D websites of 2026, ranked — and what they cost to build** (flagship) | best 3d websites · 3d website examples · top 10 3d websites 2026 (PAA) | 1K–10K · 100–1K | — | Vev's dated listicle is the only editorial slot; PAA asks for exactly this; feeds "3d website design" (inspiration) and every AI "examples" prompt. Update yearly. |
| 4 | **What scrollytelling is, what it costs, and 10 sites that do it well** | scrollytelling · scrollytelling website · best scrollytelling websites | 1K–10K · 100–1K · 10–100 | — | AI Overview from tool listicles; Perplexity cites small studios' explainers that name their stack — name Lenis + GSAP + Three.js. |
| 5 | **Template or custom website?** | template vs custom website · custom website vs template | 10–100 | 10–100 | AI Overview, low-authority SERP; Absolute Websites (Cyprus) already ranks — the one local competitor doing content. |
| 6 | **How long a website takes to build** | how long does it take to build a website | 1K–10K | 10–100 | objection handling; low competition signal from CPC €1.41–10.53 |
| 7 | **The best web design agencies in Cyprus (2026)** — honest, includes competitors | best web design agency cyprus | — | — | the D6 play: Vasilkoff and Maskwel already did it and got CITED by Perplexity for it |
| 8 | Is a one-page website enough? | (PAA) | — | — | Perplexity's answer comes from two tiny blogs; pairs with the one-page service page |
| — | ~~What makes a website feel premium~~ | what makes a website look premium | — | — | ZERO data in every tool. Fold into "premium website design" (100–1K) as a section of the flagship post, or drop. |

Every post links to exactly one service page (architecture §4): 1→3d, 2→pricing, 3→3d, 4→3d, 5→web-design,
6→web-development, 7→services hub, 8→one-page.

---

## 3. The People Also Ask bank (verbatim from the SERPs — post sections and FAQ blocks)

- How much does it cost to design a website in Cyprus? · How much should a full website design cost? · How much
  is a 20 page website? · How much should I pay for a website? · How much does a website designer cost?
- How much does a 3D website cost? · How much does it cost to design a 3D website? · Is $1000 / $1500 a good
  price for a website? · How can I create a 3D website? · What is the best 3D website?
- What are the top 10 3D websites? · What are the top 3D websites in 2026? · What are the top 10 websites that use
  scrollytelling? · What is a scrollytelling website? · What are some examples of scrollytelling techniques?
- How much should a website redesign cost? · How much does it cost for someone to update your website?
- How much does it cost to design a one-page website? · What does a 1 page website look like? · Can I make money
  with a one-page website?
- Is web design still in demand in 2026? · What are the four types of websites?

---

## 4. Competitor file (from the SERPs and the AI answers)

**Cyprus, ranking organically:** Absolute Websites (also the top ad, "from €800"; ranks globally for
template-vs-custom — the one local shop doing content), Web Theoria, Cyprus Web Designers, OnCyprus WebPages,
QoboWEB, DLK, JCSL (Nicosia, cited for its Maps rank), Mbloo, WebLab, WildBerry, Natasa Lagou (freelancer).
**Cyprus, writing the cost post:** SolutioWeb, WebSEO.cy, Domainstar, AA Web Studio, DM-Labs, Lude HQ, Vasilkoff.
**Global 3D / immersive:** Noomo, Lusion, Immersive Garden, Active Theory, Zajno, Utsubo (ranks its own
"10 best Three.js agencies" listicle), PeachWeb, Unseen, Vide Infra, Metabole (cited twice by Perplexity for
explainer posts), Exter.ai and WEBRO (quoted for "fixed price, N weeks" sentences), Svilenković (freelancer,
owns the cost SERP).

---

## 5. Phase 3 target list (the citation surfaces, ranked by how often they were the source)

1. **Google Business Profile** — the local pack sits above every Cyprus SERP; Perplexity cites Maps rank.
2. **Clutch** (cited in 5 of 10 Perplexity answers and in every Cyprus top 10) · **Sortlist** · **DesignRush** ·
   **TechBehemoths** · **OneLittleWeb** · **ProvenExpert** (review profile) — complete, consistent NAP, reviews.
3. **Third-party ranked lists to get INTO:** Psychoactive "best WebGL / interactive 3D agencies" guide (the entire
   top tier of the "who builds 3D websites" answer), Superside's service listicles, Utsubo's Three.js agency list.
4. **Awwwards** — the credibility layer in every bucket-B answer; a recognised site makes Konaverse an EXAMPLE.
5. Reddit r/webdev and r/threejs — in the top 10 for both cost queries and "best 3d websites".

---

## 6. What this changes in the two planning docs

- SEO plan §3 keyword map: rewritten from this file (done 2026-09-04, v2.3). Phase 0 research boxes ticked
  except the ChatGPT / Gemini / Claude runs (blocked by browser permissions — run by hand).
- Architecture §2 3D page: primary keyword becomes "immersive website design" + "3D website design agency".
- Architecture §4 blog list: reordered to the priority table above; "premium" post dropped; two posts added
  (best 3D websites ranked; best agencies in Cyprus).
- Architecture §5 pricing: /pricing targets "web design cyprus prices"; the COST QUERY is won by blog post #2,
  not by /pricing.
- Open: O2 (SEO service) still undecided — "seo cyprus" is 100–1K with a thin SERP, so the page would rank if the
  service is real. Language stays English-only: the Greek terms returned NO data in Keyword Planner.

## 7. Caveats
- Keyword Planner gave RANGES (no active campaign). Exact volumes need a live campaign or a paid Ahrefs plan.
- Ahrefs KD "no data" for most Cyprus long-tail = below its floor, not zero demand; the SERPs prove demand.
- Perplexity localised the account to Athens on one prompt; the monthly battery needs a Cyprus IP and a
  neutral account. ChatGPT, Gemini and Claude were not run (extension domain permissions).
- GSC anonymises everything but the brand; non-brand queries will only appear once pages rank.
