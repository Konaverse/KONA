# Technical SEO audit, kona-verse.com, 21 Oct 2026

Method: curl against production (25 sitemap URLs, raw HTML saved in `technical/html/`), Playwright render via render_page.py (home, /work, /services/seo; `technical/rendered-*.html`), `tools/seo-gate.js https://kona-verse.com` (supports a live base URL, run unmodified: PASS, `technical/seo-gate-live.txt`), sitemap_discovery.py (sitemap.xml valid urlset, 25 loc). Data: `technical/analysis.json`, `bot-ua-status.txt`, `headers-home.txt`, `robots.txt`, `sitemap.xml`.

**Technical score: 84/100.** Crawl, index, redirect and canonical basics are clean. Points lost for the split-text anchor/heading text, the /work hub having no real text, over-long descriptions, and thin hardening headers.

## 1. The homepage H1: artefact, not a regression (CONFIRMED FIXED)
Raw HTML, `technical/html/home.html`:
```
<h1 class="hw-headline" aria-label="Build the website that will make you stand out"><span class="hw-flow is-pre" aria-hidden="true"><span class="hw-it hw-w hw-grey">Build</span> <span class="hw-it hw-w hw-grey">the</span> <span class="hw-it hw-pill" ...><img alt="" .../></span><i class="hw-br"></i><span class="hw-it hw-w hw-grey">website</span> <span ...>that</span> <span>will</span> <span pill/><i class="hw-br"></i><span>make</span> <span>you</span> <span>stand</span> <span>out</span> <span pill/></span></h1>
```
Real whitespace text nodes sit between every word span, and the pills and `<i class="hw-br">` carry no text, so textContent is "Build the website that will make you stand out". The rendered DOM gives the same string and the aria-label matches. The drift parser concatenated element text without whitespace (BeautifulSoup `strip=True` style). Do not "fix" the H1. All 25 pages have exactly 1 H1 with spaces in its text (analysis.json `h1_text_raw`); the gate agrees.

## 2. Findings

### F1 Medium, NEW: button anchor text is a concatenated mess (Button.tsx:253-256)
`src/components/v4/Button.tsx:253-256` renders `<span class="k-btn__sizer"><span>{a}</span><span>{b}</span></span>` (no whitespace between the two labels), two aria-hidden letter lines (NBSP-separated letters) and an sr-only copy. A crawler's anchor text is therefore `Start a projectSay helloStart a projectSay helloStart a projectStart a project...` (label a, hover label b, repeated 3-4 times).
Observed in raw HTML: 25 links to Calendly "Book a callPick a timeBook a call..."; 13 links to /contact ("Contact usSay hello...", "Start a projectSay hello..."); /work "All projectsSee the work..."; seven "Visit siteOpen it..." outbound links. Google does not skip aria-hidden text, so internal anchor text for /contact (13 sitewide links) and /work is noise.
Letter-split itself ("S t a r t") is NOT a problem: letters are separate spans in an aria-hidden line.
Fix (keeps the roll animation): server-render only the visible label `{a}` in one text node; build the second label and the letter lines on the client in an effect (or use `content: attr(data-b)` for the hover label). No-JS users keep a plain label.

### F2 Medium, STILL OPEN (the "split-text fixed" item missed one heading): homepage "What we do" H2 (WhatWeDo.tsx:35-57)
Raw: `<h2 class="sg-h" aria-label="What we do"><span class="k-mask"><span ...>What</span></span><span class="k-mask"><span ...>We</span></span><span class="sg-line">...Six services...<span>Do</span></span></h2>`. No whitespace between the word spans, so textContent = "WhatWe()Six servicesDo", and the DOM order is What, We, Six services, Do. The aria-label gives assistive tech the right name; crawlers read the DOM. The plan names fixes for HeroTitle, AboutGridHero and WorkRows only.
Also `/about`: `<h2 class="ab-op-t">What we make,<span class="ab-op-sub">in one sentence.</span></h2>` has no space after the comma (Low). A scan of every h1-h4 on the 25 pages found only these two.
Fix: add `{' '}` between the word Reveals, move the "Six services" link out of the h2 (or after "Do"), add a space after the comma in the About h2.

### F3 Medium, STILL OPEN (plan line 47): /work hub has no real text
/work has 19 visible words. The seven cards are `<a class="wc-card" href="/work/tdk" data-name="TDK Design &amp; Build" data-meta="Web development, 2026"><img alt="The TDK Design &amp; Build website, designed and built by Konaverse"></a>`: names and meta live only in data-attributes and the JSON-LD ItemList; the link text is the image alt. H1 is "Selected work Websites we designed and built" plus an sr-only h2 (WorkHero.tsx:492). The rendered text is the same (render-work.json), so this is copy never written to the DOM, not a JS problem.
Fix: render an sr-only list (or quiet text) of name, service, year and one-line result inside each card's `<a>`/`<li>`; no animation changes.

### F4 Medium, STILL OPEN (plan "[ ] descriptions ~155 chars"): 19 of 25 meta descriptions exceed 160 characters
velricon 270, los-santos-barbers 247, tdk 242, heimat-group 233, chris-n-clean 226, lumiere-eclat 217, /work 215, website-cost-cyprus 212, /about 201, city-arcade 197, redesign post 192, home 192, services/seo 180, web-development 178, web-design 177, 3d-websites 171, website-redesign 165, /blog 163, /services 162. Google will truncate or rewrite them. Fix: trim to 140-158 in `src/lib/case-studies.ts`, `src/lib/service-pages.ts` and page metadata, and add a length check to the gate.

### F5 Low, NEW: short, category-free titles on About and Contact
`/about` "About us | Konaverse" (20 chars), `/contact` "Contact | Konaverse" (19), legal pages 24-26 (fine). About and Contact could carry "web design studio, Cyprus". Home title "Konaverse: Build the website that will make you stand out" has no category term. All other titles are 32-74 chars and distinct.

### F6 Low, NEW: HSTS and CSP hardening
`technical/headers-home.txt`: HSTS `max-age=63072000` (no includeSubDomains or preload), X-Frame-Options SAMEORIGIN, nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera, mic, geo off). No Content-Security-Policy. Not a ranking factor. If added, start report-only (Calendly, Clarity, GA, Sanity, Resend origins) so Calendly preloading is not broken.

### F7 Low, NEW: http://www takes two hops
`http://www.kona-verse.com/` -> 308 `https://www.kona-verse.com/` -> 308 `https://kona-verse.com/`. Every other variant is a single permanent hop. Fix: redirect http://www straight to the apex at Cloudflare.

### F8 Low, SUSPECTED: sitemap lastmod drift
lastmod values are hand-kept: 10 at 2026-10-02, 7 at 10-03, 2 at 10-10, privacy and cookies 10-07, terms 08-28. `/blog/website-cost-cyprus` shows 10-03 while the repo moved hosting to yearly on 14 Oct (4163edf); the live Sanity post still says monthly per project notes, so bump `updated` when the owner edits it.

### F9 Low, NEW: 404 page has two robots metas; /favicon.ico 404
404 HTML (technical/404.html) carries `noindex` and `noindex, nofollow`. Harmless: the status is a true 404 with `x-next-error-status: 404`. `/favicon.ico` is 404; icons are declared by `<link rel="icon" href="/icon.png?...">` and `/manifest.webmanifest` is 200, so Google is fine.

### F10 Low, NEW: weak internal links to /services/seo; outbound staging URLs
Distinct source pages linking in: /services/seo 2 (home, /services), 3d-websites 3, one-page 3, redesign 3, work/city-arcade 4, work/tdk 4. No orphans. "Visit site" links for City Arcade and Lumiere Eclat go to `city-arcade-roan.vercel.app` and `watchweb.vercel.app` (200), staging hosts the studio does not brand. Add contextual links to /services/seo from the cost and redesign posts; label those two as concepts or drop the links.

### F11 Info: gate coverage
`tools/seo-gate.js https://kona-verse.com`: PASS (25 pages, 5 redirects, 3 retired URLs). It does not check anchor text (F1), heading word spacing beyond the H1 (F2), description length (F4), a visible-word floor (F3) or sitemap lastmod. Suggested additions: internal anchor text under 60 chars, h2/h3 textContent equals aria-label ignoring case, description 70-160, /work word count above 150.

## 3. Confirmed fine (evidence)
- Status: 25/25 sitemap URLs 200 with no redirect, self-canonical on the apex (home canonical `https://kona-verse.com`, no trailing slash, equivalent). `?x=1` and `?utm=1` return 200 with a clean canonical. `robots` meta `index, follow` everywhere, no X-Robots-Tag. `lang="en"`, viewport present.
- Redirects (CONFIRMED FIXED, single hop, 308): http apex -> https; www and www/about -> apex; /index -> /; /projects, /projects/foo, /projects/web-development -> /work; /pricing -> /services; /services/videography -> /services; /about/, /services/, /blog/ -> no slash. `/ABOUT` is 404 (case-sensitive, Info).
- 404s: /nonexistent-page, /blog/x, /work/x, /services/x, /llms.txt, /about.md return a true 404 with a branded page. /wp-admin 403 (Cloudflare).
- robots.txt: Allow groups for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Applebot; `*` Allow, `Disallow: /api/`; Sitemap line. No Cloudflare-managed AI block. GPTBot, ClaudeBot and CCBot fall under `*` (allowed), consistent with the owner's decision.
- Cloudflare vs AI bots: UAs GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Google-Extended, CCBot, Applebot, Bytespider, anthropic-ai, Googlebot, bingbot, python-requests, curl all got 200 with identical bodies on /, /services/seo and /robots.txt (bot-ua-status.txt). Caveat: spoofed UA from one IP; verified-bot and managed rules also key on IP/ASN, so real crawlers are not proven, but no UA rule blocks them.
- Email obfuscation: CONFIRMED FIXED. No `[email protected]` or cdn-cgi email-protection in any of the 25 pages, also with a Chrome UA; plain `mailto:info@kona-verse.com` present.
- Raw vs rendered: copy, H1, title and canonical are identical with and without JS (home raw 106 KB vs rendered 119 KB, hydration only; `is_spa: false`). HTML is 57-134 KB uncompressed (10-19 KB brotli), far under Googlebot's 2 MB. TTFB 0.14-0.27 s from a Vercel HIT; `cf-cache-status: DYNAMIC` (HTML not cached at Cloudflare, Info). Static chunks `max-age=31536000, immutable`.
- Structured data: every JSON-LD block parses; Organization+ProfessionalService, Person x3, WebSite sitewide; BreadcrumbList, Service, Article, BlogPosting, ItemList, AboutPage, ContactPage, CollectionPage, Blog per page. No FAQPage, HowTo, Review or AggregateRating.
- Images: zero `<img>` without an alt attribute on the 25 pages. og:image home `/og-image1.png` is 200. No hreflang (single language, fine).
- Internal links: every internal link target is in the sitemap, no orphans, no broken internal links. Outbound client sites return 200 (tdkdb.com and velricon.com redirect once).
- Old-site URLs: /projects(/*) and /pricing redirect; llms.txt and the .md mirrors 404 as decided.

## 4. Status vs the Q4 plan
- REGRESSED: none. The split-text H1 fix is intact.
- STILL OPEN: F2, F3, F4.
- NEW: F1, F5-F10.
