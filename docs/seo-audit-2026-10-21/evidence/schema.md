# Structured data audit, 21 Oct 2026 (follow-up to docs/seo-plan-q4-2026.md section 4)

Method: fetched all 25 sitemap URLs live (HTTP 200 each), extracted every `application/ld+json` block, parsed with Python json (0 syntax errors), cross-checked against the generators and visible page text. Score: **84/100**.

## Detection (25 URLs)
- Every URL carries the global graph (src/app/layout.tsx:132-228): `#organization` (["Organization","ProfessionalService"]), Person `#konstantinos`, `#nabil`, `#andreas`, WebSite `#website`. All JSON-LD, no Microdata or RDFa. No FAQPage, SearchAction, Review, AggregateRating, Product, Event, HowTo, QAPage or VideoObject anywhere. "Dtzankatian" appears in no page or schema.
- Page graphs (second block):
  - /about: BreadcrumbList, AboutPage #page, Person x3 (about/page.tsx:225)
  - /blog: BreadcrumbList, Blog #blog with 3 nested BlogPosting (blog/page.tsx:38)
  - /blog/*: BreadcrumbList, BlogPosting #article (blog/[slug]/page.tsx:195)
  - /contact: BreadcrumbList, ContactPage (contact/page.tsx:104)
  - /services: BreadcrumbList, ItemList (services/page.tsx:97)
  - /services/*: Service #service, BreadcrumbList (services/[slug]/page.tsx:181)
  - /work: BreadcrumbList, CollectionPage, ItemList (work/page.tsx:102)
  - /work/*: BreadcrumbList, Article #article (work/[slug]/page.tsx:170)
  - /, /privacy, /terms, /cookies: global graph only
- Legacy JsonLd uses in src/app/(site)/pricing, _about-legacy, _contact-legacy are not live routes.

## Validation per type: all PASS
- @context is https://schema.org everywhere; URLs absolute; dates ISO 8601; no placeholder text.
- Org: logo 512x512 (src/app/icon.png is 512x512, /icon.png 200), image og-image1.png 1200x630 (200), telephone +357 96 273855 (matches CONTACT_PHONE), address addressCountry CY only (correct under owner decision 1).
- Service: serviceType, provider @id, areaServed, Offer present. Prices match visible copy: web-design 1800, web-development 1800, redesign 2500, one-page 1200, 3D 6000, SEO 300 with unitText MONTH. Hosting is yearly in the live cost post; no monthly hosting in schema.
- BlogPosting: headline = H1 on all 3 posts; datePublished, dateModified, inLanguage, wordCount, image ImageObject, Person author present.
- Article (work): datePublished/dateModified 2026-10-02, image resolves (200).
- sameAs: instagram.com/konaverse.cy 200 (og:title "Konaverse (@konaverse.cy)"); facebook.com/konaverse 200 ("Konaverse"); linkedin.com/company/konaverse 200 ("Konaverse | LinkedIn"). Founders' LinkedIn /in/ URLs return HTTP 999 (LinkedIn bot wall), unverifiable from here, SUSPECTED fine. tdkdb.com (Article `about` URL) 200.

## Findings

### 1. MEDIUM, STILL OPEN: case-study Article author is the Organization, not a Person (plan section 4)
Evidence, https://kona-verse.com/work/tdk: `"author":{"@id":"https://kona-verse.com/#organization"}`; same on all 7 /work/*. File: src/app/(v4)/work/[slug]/page.tsx:190.
Fix: add an optional `author` ('konstantinos' | 'nabil') per study in src/lib/case-studies.ts and emit
```json
"author": { "@id": "https://kona-verse.com/#nabil" }
```
or an array of both founders if both wrote it. The owner picks who wrote each study; do not invent authorship.

### 2. MEDIUM, STILL OPEN: /services has no CollectionPage, and ItemList entries are bare name/url
Evidence: block is [BreadcrumbList, ItemList]; items are `{"@type":"ListItem","position":1,"name":"Web Design","url":"https://kona-verse.com/services/web-design"}`. File: services/page.tsx:97-117 (/work does it right at work/page.tsx:102).
Fix:
```json
{ "@type":"CollectionPage","@id":"https://kona-verse.com/services#page","url":"https://kona-verse.com/services","name":"Web Design and Development Services","isPartOf":{"@id":"https://kona-verse.com/#website"},"about":{"@id":"https://kona-verse.com/#organization"},"mainEntity":{"@id":"https://kona-verse.com/services#list"} },
{ "@type":"ItemList","@id":"https://kona-verse.com/services#list","name":"Services","itemListElement":[{"@type":"ListItem","position":1,"name":"Web Design","url":"https://kona-verse.com/services/web-design"}] }
```
Apply the same @id/mainEntity wiring to /work.

### 3. MEDIUM, NEW: @id references to Service nodes dangle on 19 of 25 pages
Evidence: `#organization.hasOfferCatalog.itemListElement[].itemOffered = {"@id":".../services/web-design#service"}` is on every page (layout.tsx:158-164), but the Service nodes exist only on their own service pages. Blog posts also reference `/services/...#service`, `/work/...#article`, `/blog#blog` (about/mentions/isPartOf), none present in the same document. Parsers resolve @id only within a document, so the catalog carries no data. Google ignores hasOfferCatalog, so no error; it is an entity-graph weakness (SUSPECTED impact on AI/knowledge-graph consumers).
Fix in layout.tsx, inline stubs:
```json
"itemOffered": { "@type":"Service","@id":"https://kona-verse.com/services/web-design#service","name":"Web Design in Cyprus","url":"https://kona-verse.com/services/web-design" }
```
(needs s.title, s.slug). Same for post `about`.

### 4. LOW, STILL OPEN: breadcrumb schema does not match the visible trail
- /work/tdk (all /work/*): no visible breadcrumb in the HTML; schema has Home > Work > TDK Design & Build. Plan asks for visible breadcrumbs on case studies.
- /services/web-design: visible nav[aria-label=Breadcrumb] reads "Services / Web Design", no "Home"; schema has 3 items. Plan: add Home to the service trail.
- Posts: visible and matching (CONFIRMED FIXED).
Files: work/[slug]/page.tsx; the service template's breadcrumb component.

### 5. LOW, NEW: the same Person @id is defined twice with conflicting content
layout.tsx (~190) Konstantinos description = AUTHOR_BIO; about/page.tsx:225+ has different text ("Konstantinos is the technical architect. He builds the sites..."). Same for Nabil. Root nodes carry sameAs/knowsAbout, about copies do not. Andreas has image/url only in the about copy.
Fix: on /about reference Persons by `{"@id": ...}` only; move Andreas' image/url into the layout.tsx node.

### 6. LOW, SUSPECTED: cost post dateModified probably stale
Evidence: /blog/website-cost-cyprus has `dateModified: 2026-10-03` and visible "3 October 2026", but the body now says hosting is "€300 a year" (the 14 Oct change, 4163edf). Source is the hand-set Sanity field `updated` (src/sanity/posts.ts:71).
Fix: owner sets `updated` to 2026-10-14 in Studio if that was a real edit; visible date and schema then agree.

### 7. LOW: areaServed mixes typed and bare values
`"areaServed":[{"@type":"Country","name":"Cyprus"},"Europe","Worldwide"]` (layout.tsx ~144). Fix: `[{"@type":"Country","name":"Cyprus"},{"@type":"Place","name":"Europe"}]`; drop "Worldwide" or use `{"@type":"AdministrativeArea","name":"Worldwide"}`.

### 8. LOW: legal pages carry no BreadcrumbList or WebPage node
/privacy, /terms, /cookies emit only the global graph; the plan says BreadcrumbList everywhere. Add Home > Privacy etc. and a WebPage with isPartOf #website, via the (v4) legal layout.

### 9. INFO
- Article.about for client sites is an anonymous WebSite node (work/[slug]/page.tsx:191), e.g. `{"@type":"WebSite","name":"TDK Design & Build","url":"https://tdkdb.com"}`, which adds a second WebSite-typed entity. Prefer `{"@type":"Organization","name":"TDK Design & Build","url":"https://tdkdb.com"}`.
- Case-study headline (title-tag style, "TDK Design & Build: a residential studio's website") differs from the H1 ("TDK Design & Build"). Plan says headline = H1; blog is fine. Acceptable deviation.
- Offer has priceSpecification.minPrice and no `price`. Valid; do not add `price`, which would turn "from" into a fixed price.
- Plan section 4 says addressLocality Nicosia, but code and owner decision 1 keep addressCountry only until GBP shows an address. Code is right, plan text is the outlier. When GBP shows it: add to #organization.address, plus hasMap.
- Optional: foundingDate/legalName if the owner confirms; @id on BreadcrumbList nodes.

## CONFIRMED FIXED
- FAQPage removed from /contact; none on any URL.
- One shared global graph; ids consistent site-wide (#organization, #konstantinos, #nabil, #andreas, #website).
- Org has phone, areaServed, 3 founders, live sameAs, knowsAbout, hasOfferCatalog.
- WebSite has no SearchAction. Service pages have serviceType + Offer/priceSpecification, SEO has unitText MONTH. Posts have dates, Person authors, headline = H1.
- NAP consistent: phone identical in schema and CONTACT_PHONE; email info@kona-verse.com.

## Implementation owners
- src/app/layout.tsx (items 3, 5, 7)
- src/app/(v4)/services/page.tsx, work/page.tsx (item 2)
- src/app/(v4)/work/[slug]/page.tsx, src/lib/case-studies.ts (items 1, 4, 9)
- src/app/(v4)/about/page.tsx (item 5)
- Sanity Studio `updated` field (item 6)
- Legal pages layout (item 8)
