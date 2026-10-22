# Local SEO audit, 21 Oct 2026

Score: 28/100. Business type: service-area business (SAB), no street address on the site. Vertical: professional services / web studio (schema subtype ProfessionalService, correct).

| Dimension | Weight | Score | Note |
|---|---|---|---|
| GBP signals | 25 | 8 | verified, category right, phone and hours set; 0 photos, no address, 1 interaction (13 Oct record). Not re-observed. |
| Reviews | 20 | 0 | 0 on GBP, 0 on Clutch. Competitors 12 to 51. |
| Local on-page | 20 | 11 | phone and email in HTML, hours stated; no map, no visible locality on the site, no city pages (owner decision). |
| NAP and citations | 15 | 5 | phone consistent on site/schema/GBP; Clutch spelling differs and exposes a street; only Clutch and LinkedIn/FB/IG confirmed. |
| Schema | 10 | 7 | right subtype, telephone, sameAs, areaServed; address is country only (deliberate), no geo, no openingHoursSpecification. |
| Local links/authority | 10 | 1 | Clutch link points at the homepage only; real links single digits. |

## NAP source table (observed 21 Oct, live HTML)

| Source | Name | Phone | Address | Hours |
|---|---|---|---|---|
| Schema, root layout (src/app/layout.tsx:136-158) | Konaverse | +357 96 273855 (telephone twice, org and ContactPoint) | PostalAddress addressCountry CY only (:146) | none |
| /contact visible (src/app/(v4)/contact/page.tsx:55-56) | Konaverse | +357 96 273855, tel:+35796273855 | none | "Monday to Friday, 9 to 18 EET" |
| Footer (src/components/v4/SiteFooter.tsx) | Konaverse | none (no phone, no tel: link on the home page; only mailto:info@kona-verse.com) | none | none |
| GBP (13 Oct record) | Konaverse | +357 96 273855 | hidden | set |
| Clutch (fetched 21 Oct) | Konaverse | "96273855" | street address, Lakatameia | n/a |
| LinkedIn company page (fetched 21 Oct) | Konaverse, Design Services, 14 followers | not shown | Nicosia | n/a |
| Facebook /konaverse | name only visible to a bot | n/a | n/a | n/a |

Discrepancies:
1. NEW, Medium: Clutch publishes a street (a street address in Lakatameia) and the phone as "96273855", without +357. The owner rules say one spelling and no address on the site until GBP shows one. Clutch is a public NAP source that already contradicts GBP (hidden address). Also Clutch team size says 2-9 in one place, 2-5 in the location block. Fix in the Clutch dashboard: phone "+357 96 273855", decide whether the Lakatameia street stays public; if GBP will stay SAB, keep Clutch to city level.
2. NEW, Low: city name differs by source: Lakatameia (Clutch, brief), Nicosia (LinkedIn; the plan §4 says addressLocality Nicosia). Lakatameia is inside Nicosia district, so pick one convention (suggest "Nicosia" city, "Lakatameia" neighbourhood) and use it on LinkedIn, Clutch, GBP service area.
3. STILL OPEN, Medium: footer carries no phone. NAP is only complete on /contact. src/components/v4/SiteFooter.tsx has the email but not CONTACT_PHONE; add a tel: link from site.ts.
4. STILL OPEN, Medium: hours "Monday to Friday, 9 to 18 EET" (contact/page.tsx:56) is flagged a first draft in the file header (:35) and in plan §2; GBP hours must match it, and the schema has no openingHoursSpecification. Owner to confirm, then add the spec.
5. CONFIRMED FIXED: phone is one spelling on site, schema and GBP (record). Email obfuscation: no "email-protection" on the home HTML (0 matches), mailto present, so the Cloudflare issue from 2 Oct no longer shows on the page.

## Schema (local)
- CONFIRMED FIXED: #organization is ["Organization","ProfessionalService"], telephone, email, areaServed, sameAs (instagram konaverse.cy, facebook konaverse, linkedin company/konaverse), founders tied both ways. All three sameAs URLs return 200.
- STILL OPEN, Low: no openingHoursSpecification, no geo (correct while SAB with hidden address; geo of the studio would reveal the address). Respect the owner decision; add hours spec only once confirmed. No sameAs for Clutch; adding the Clutch URL is legitimate and ties the entity (Medium, NEW).
- STILL OPEN, Low: Andreas Kyriakou Person has no sameAs/description; fine but thin.
- areaServed includes "Europe" and "Worldwide" next to Cyprus: dilutes the Cyprus-local signal. NEW, Low; keep Country Cyprus first, consider dropping Worldwide from the local node.

## GBP signals
Public observation not possible (Maps/local pack not fetchable). From the 13 Oct record: verified, Website designer, phone, hours, 0 reviews, no photos, strength incomplete, 52 views and 1 interaction last month, no address. STILL OPEN, Critical: 0 reviews and 0 photos. Items detected on the site: no Maps embed, no review widget, no GBP link (correct for an SAB with no address; adding a "Google Business Profile" or review link on /contact is allowed once there are reviews). Not verified: service area cities, six services listed, description, posts. Check these in the dashboard (plan §8).

## Reviews
0 on GBP and 0 on Clutch (Clutch re-fetched 21 Oct: 0 reviews, 0.0). Competitors in the pack: Absolute Websites 48, avocadots 51, Mojo 34, Limdez 12. STILL OPEN, Critical. Plan decision 5 (Clutch reviews) is still deferred. Review velocity cannot be assessed (none).

Realistic plan for a studio shipping a handful of projects a quarter (no incentives, real clients only):
- Clients available now: five case studies on the site (Los Santos Barbers, Chris N Clean, HEIMAT, TDK, plus the concept). Ask every real past client once, in writing, for one honest Google review and, if they agree, one Clutch review (Clutch verifies by interview, takes 1-3 weeks). Target: 4 Google reviews by end of Nov, 8 by end of Jan; 2 Clutch by Dec. Do not offer discounts or gifts; do not gate on a positive outcome (Google's policy and the 24 Jul 2026 note in plan §10).
- Send the short GBP review link (Google "Get more reviews" share link) with the handover email, and again 3 weeks after launch. Add it to the handover checklist so new projects keep a trickle (about 3 to 5 a year from new projects will not reach competitors' counts alone, so past clients matter most).
- Reply to every review within 48 h with a project-specific sentence.
- Realistic outcome: 10 reviews by Q1 2027 requires near-100% response from a pool of about 8 to 10 past clients. Plan for 6 to 8 and say so. The local pack by January (13 Oct reading) is a stretch; treat Q2 2027 as the honest target. Proximity cannot be changed and the hidden address weakens it further.

## Citations (plan §8 list). Observed 21 Oct; major directories returned 403 to a script so absence is NOT proven for them.

| Listing | Status |
|---|---|
| Clutch | EXISTS, complete, 0 reviews, 4 service lines, website link goes to the homepage root |
| LinkedIn company page | EXISTS, "Design Services", Nicosia, 14 followers, no website field, no phone; the page lists no website field in what a bot sees (could be page extraction); description matches |
| Facebook page | EXISTS (200), no visible category/address/phone to a bot |
| Instagram konaverse.cy | EXISTS (200) |
| Google Business Profile | EXISTS (13 Oct record) |
| Bing Places | UNVERIFIED (Bing WMT has 0 impressions; the Bing search fetch returned unrelated results) |
| Apple Business Connect | UNVERIFIED, likely missing |
| Sortlist, DesignRush, GoodFirms, TechBehemoths, G2 | UNVERIFIED (403 to bot, and slugs were guesses); none appeared in any search result I could read. Treat as missing until the owner checks. |
| DuckDuckGo query | blocked by captcha, no data |

`site:kona-verse.com` on Bing returned about 88 unrelated Facebook results; not usable. Plan note: no third-party mentions on 2 Oct; nothing new observed.

## Listings that can link to the service pages (lever from the 14 Oct addendum)
All of these are fully legitimate profile fields:
1. Clutch: the profile has one website field (currently the homepage). Put the primary service page in the "service line" descriptions or the Portfolio items: the four portfolio items can link to the case studies; the service description text may include a link. Clutch links are nofollow-ish but are fetched and crawl-discovered.
2. GBP: the Website field can point at https://kona-verse.com/services/web-design (the money page for "web design cyprus") instead of the homepage; the services section on GBP supports per-service descriptions. Both choices are the owner's. This is the cheapest crawl signal and takes five minutes. Keep UTM-free canonical URL.
3. LinkedIn company page: add the Website field (https://kona-verse.com/services) and put service URLs in a post or the About text.
4. Facebook and Instagram bios: one link each (use /services).
5. Sortlist, DesignRush, GoodFirms, TechBehemoths: each allows a website field and service-line descriptions; use /services and one deep service link each, brand anchor, once per listing.
6. Client footer credits ("Website by Konaverse"): link to the homepage with brand anchor (owner rules, nofollow, client choice); do not sitewide-deep-link service pages (spam policy, plan §10).
Realism: the 7 URLs were still "Discovered, not indexed" on 14 Oct. Request indexing results are outside this audit; if still unknown after 28 Oct, apply 1, 2, 3 first.

## Findings, prioritised
1. Critical, STILL OPEN: 0 reviews on GBP and Clutch. Run the past-client ask above. Evidence: seo-state-2026-10-13.md, Clutch fetch 21 Oct.
2. Critical, STILL OPEN: GBP has no photos. Add 10+ real photos (team, workspace, project screenshots on devices, logo, cover). Owner dashboard.
3. High, NEW: Clutch shows street address and "96273855"; GBP hides address. Align per decision 1 and 2.
4. High, STILL OPEN: GBP website link and Clutch/LinkedIn/Facebook/Instagram links all point to the homepage, so nothing external points at service pages. Re-point GBP to /services/web-design, add website fields on LinkedIn.
5. High, STILL OPEN: Bing Places, Apple Business Connect missing or unconfirmed; Sortlist/DesignRush/GoodFirms/TechBehemoths unconfirmed. Create them using the exact NAP from site.ts. (I did not create anything.)
6. Medium, STILL OPEN: footer has no phone (src/components/v4/SiteFooter.tsx). Add CONTACT_PHONE / CONTACT_PHONE_HREF from src/lib/site.ts:57-58.
7. Medium, STILL OPEN: draft hours (contact/page.tsx:35,56); confirm, then align GBP and add openingHoursSpecification to the #organization node in src/app/layout.tsx:136.
8. Medium, NEW: add the Clutch profile URL to sameAs (layout.tsx:159-163) once the NAP on Clutch is fixed.
9. Low, NEW: city naming (Nicosia vs Lakatameia) and Clutch team-size mismatch (2-9 vs 2-5).
10. Low, NEW: trim areaServed "Worldwide" from the local node.

## Limitations
No Google Maps, local pack, GBP dashboard, review velocity, or DataForSEO data. Directories returned 403, DuckDuckGo a captcha, Bing search was irrelevant, so only Clutch, LinkedIn, Facebook and Instagram were observed. The 13 Oct record is the source for all GBP statements. Proximity (about 55% of local ranking variance in the Search Atlas study) is not controllable and a hidden address lowers it further.
