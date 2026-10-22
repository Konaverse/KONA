# Local and Win: the profile pack, the review ask, one entity, small social, and the bottom of the funnel

Written 22 October 2026 for the strategy and content run (`BRIEF.md` in this folder). FLOW stages applied: **Local** (Business Profile, reviews, citations, entity) and **Win** (bottom-of-funnel review of the six service pages and /contact).

Framework and prompts © Daniel Agrici, CC BY 4.0: github.com/AgriciDaniel/flow

Nothing was changed on the site, in the CMS, on the Business Profile, on Clutch or on any listing. Everything below is material for the owner to paste, or a proposal for the owner to approve.

**Labels.** *measured*: a number from a tool or a count I ran. *observed*: seen in a file, a saved page or a fetched page, with its location. *inferred*: my judgement. Owner blanks are written `[OWNER: ...]`.

## Summary

1. The Business Profile pack below is ready to paste: name "Konaverse", primary category Website designer, one secondary (Internet marketing service), a 710-character description, six service entries of 212 to 290 characters, Monday to Friday 9:00 to 17:00, five service-area districts, an appointment link, a photo shot list of real things, and twelve weekly posts, each linking to a live page.
2. Website field: point it at /services/web-design now, as the audit proposes, and review on 30 November. The trade-off is in 1.4.
3. Five clients can be asked for a review: Los Santos Barbershop, Velricon, Chris N Clean, HEIMAT and TDK. That caps the back catalogue at five Google reviews. The ask, the follow-up and two replies are in section 2. All of them leave the content to the client, as Google's policy requires.
4. One NAP block and one description family for every profile, with a table for ten platforms. Clutch needs the audit's corrections (phone, street, team size, service links) and three owner decisions, including a minimum project size of $5,000 against a site floor of €1,200.
5. Social: Instagram and Facebook sent 43 sessions in 28 days, more than organic search (30). LinkedIn sent none in 90 days (measured). The rule: each published article or case study gets one LinkedIn post and one Instagram carousel. The ten live pieces form a backlog. Draft 7 is the one shelved draft the audit marks for LinkedIn.
6. Win: every service page answers price and timeline in its first paragraph. None names a person or shows a phone number, and proof is thinnest on the 3D page. The biggest single gain needs no new design: deploy the 21 October fixes that sit uncommitted in the working tree, so the live site stops promising "guaranteed" speed and showing the old hours.

## How this was done

- **FLOW Local stage.** All eleven Local prompts in the installed plugin (v2.4.2, `skills/seo-flow/references/prompts/local/`) carry the same generic prompt body (measured: one checksum for all eleven). I applied that template's six headings (intent, evidence, gaps, changes, measurement, verification) to the profile work. The Business Profile specifics come from `skills/seo-local/SKILL.md` and `skills/seo/references/local-seo-signals.md`.
- **FLOW Win stage.** I applied the three Win prompts (BOFU page brief, conversion audit, dual-surface scorecard) to the six service pages and /contact, using the current source and the live HTML saved on 21 October (`docs/seo-audit-2026-10-21/evidence/technical/html/`).
- **Facts.** Every fact comes from `src/lib/site.ts`, `src/lib/service-pages.ts`, `src/app/(v4)/about/page.tsx`, `src/app/(v4)/contact/page.tsx`, `src/lib/case-studies.ts`, `src/lib/work-projects.ts` and `src/app/layout.tsx` (the socials and the organization schema live in `layout.tsx`, not `site.ts`), read on 22 October with the uncommitted 21 October edits in place.
- **Google's rules**, fetched on 22 October: business representation guidelines (support.google.com/business/answer/3038177), the description help page (answer/3039617) and the review policy (support.google.com/contributionpolicy/answer/7400114). The category names were checked against a third-party copy of Google's list dated 9 May 2026 (daltonluka.com, 4,046 categories). The service-description limit (300) and the post limit (1,500) come from third-party sources only. The dashboard's counters are authoritative.
- **Character counts and dash checks** were run by script on every block of proposed copy (measured). None contains an em dash, an en dash or a URL.
- **Deprecation lint**: `gbp_deprecation_lint.py --file` was run on this document; the result is in 1.8.
- **What I could not see**: the Business Profile dashboard, the attribute options Google offers this category in Cyprus, the current Instagram, Facebook and LinkedIn bios, or whether Sortlist, DesignRush, GoodFirms, TechBehemoths, Bing Places and Apple listings exist (the audit got 403s). Statements about the profile's current state come from the 13 October record (`docs/seo-state-2026-10-13.md`).

---

## 1. Business Profile pack

### 1.1 Name and categories

**Name: `Konaverse`.** Nothing added. Google: "Your name should reflect your business's real-world name", and "Including unnecessary information in your business name isn't permitted" (observed, answer/3038177). Keywords in the name rank second among Whitespark's survey factors (plugin reference, study). For a real name, adding them is a suspension risk, not a tactic (inferred). Plan §8 decided the same.

Google: "Use as few categories as possible to describe your overall core business" and "Do not use categories solely as keywords" (observed, answer/3038177).

| Category (exact name on the list) | Use | Why |
|---|---|---|
| **Website designer** | **Primary** (already set, 13 Oct record) | Five of the six services are designing or building websites. The primary category is the strongest single pack factor in the plugin's sources (study). |
| **Internet marketing service** | **Secondary** | /services/seo is a real, priced service: audit €500, from €300 a month (observed, `service-pages.ts:880`). No SEO-specific category appears on the list copy I checked (observed); this is the nearest true one. |
| Design agency | Owner's choice; I would leave it off | It is on the list and true in a general sense. It is also generic and pulls brand, graphic and interior design searches the studio does not serve (inferred). |
| Web hosting company | Do not add | Hosting is sold only as the running cost of a site the studio built ("Add-ons and running costs" on every service page, observed). The category would draw standalone hosting searches (inferred). |
| Branding agency | Do not add unless branding is sold | No branding service page exists. Clutch lists branding at 10% (13 Oct record), and /about lists "Branding" as one of four words (`about/page.tsx:187`). `[OWNER: is branding a service you sell?]` |
| Animation studio, Graphic designer, Marketing agency, Software company, E-commerce service | Do not add | Not offered as services in the repo (observed). |

### 1.2 Business description (710 of 750 characters, no links, no prices or offers)

Google's description rules say no links of any type, and the description must not focus on special promotions, prices or sales (observed, answer/3038177 and answer/3039617).

```
Konaverse is a web studio in Nicosia, Cyprus that designs and builds websites end to end. We work with businesses across Cyprus and with brands abroad, in English and Greek. Our six services are web design, web development, 3D and immersive websites, one-page websites, website redesign, and SEO for Google and AI search. Every site starts from the client's brand rather than a template, is designed at desktop and phone size, and is built as real HTML that search engines and AI assistants can read. Our client work includes Los Santos Barbershop, Chris N Clean, HEIMAT Development Group, TDK Design & Build and Velricon. Konaverse is three people: Konstantinos Kyprianou, Nabil Al Jbawi and Andreas Kyriakou.
```

Sources for each sentence: the opening matches the organization schema description (`src/app/layout.tsx:143`). Languages and abroad come from the contact FAQ (`contact/page.tsx:79`). The six services are `SERVICE_PAGES`. "From the brand, not a template" is on /about (`about/page.tsx:181`, marked first draft there) and the web design answer (`service-pages.ts:204`). "Desktop and phone size" is in the web design and one-page deliverables. "Real HTML" is in the web development answer (`:354`). The clients are the five non-concept studies in `case-studies.ts`. The three people are on /about (`:126-161`).

### 1.3 Services (six entries)

The services editor takes a name, an optional price and a description. As far as I know it has no link field. Since the business description bans links, I assume service descriptions should carry none either (inferred; the dashboard decides). The URL column says which page each service corresponds to. Use it for the post buttons (1.10), the Clutch service lines and the directory entries (3.3).

If the price field offers a "from" option, enter the starting price there. If it offers only a fixed price, leave it empty: a fixed price would misstate a starting price (inferred). The descriptions already carry the starting price as plain information, not as an offer. If Google rejects one for that, delete the price sentence and keep the rest.

| # | Service name | Description | Chars (≤300, measured) | Page |
|---|---|---|---:|---|
| 1 | Web design | Custom website design from your brand outward: layout, type, imagery and motion, with every page drawn at desktop and phone size before it is built. For Cyprus businesses that have outgrown a template. Design of a five-page site from €1,800, or €2,500 designed and built. Four to six weeks. | 290 | https://kona-verse.com/services/web-design |
| 2 | Web development | Websites built on Next.js and server-rendered, so search engines and AI assistants read every page, with the CMS, forms, bookings and integrations your business runs on. Build of a five-page site from €1,800, or €2,500 designed and built. Four to eight weeks. | 259 | https://kona-verse.com/services/web-development |
| 3 | 3D websites | Immersive 3D websites: modelled objects and scroll-driven scenes that move with the visitor, with lighter cuts for phones and stills for reduced motion. For product, hospitality and technology brands. From €6,000. Eight to twelve weeks. | 236 | https://kona-verse.com/services/3d-websites |
| 4 | One-page websites | One long page designed and built to make one argument: who you are, what you offer and how to reach you. For practices, launches and campaigns that do not need a site map. From €1,200. Live in two to three weeks. | 212 | https://kona-verse.com/services/one-page-websites |
| 5 | Website redesign | A redesign that starts with an audit of what your current site earns, keeps the pages that rank and convert, and maps and redirects every old URL. Priced as a new design and build, from €2,500. Four to eight weeks. | 214 | https://kona-verse.com/services/website-redesign |
| 6 | SEO | SEO for Google and AI search: an audit of the technical foundation, fixes verified in Search Console, then one page a month, off-site work and a plain monthly report. Audit €500. Ongoing work from €300 a month, three-month minimum. | 231 | https://kona-verse.com/services/seo |

Every price and timeline above matches `service-pages.ts` (observed: `:204`, `:353`, `:500`, `:633`, `:757`, `:880`). Hosting is not listed as a service, because it is priced by the year only with a build (`:992-1000`).

### 1.4 The website field: /services/web-design, with the trade-off

| Option | For | Against |
|---|---|---|
| Homepage | Every visible Search Console query is a brand query (13 Oct record), and 18 of 30 organic sessions in 28 days landed on / (measured, audit `evidence/google.md`). A brand searcher who clicks "Website" lands where expected. | It is the site's strongest page. The plugin advises against pointing the profile at it (Sterling Sky "Diversity Update": a business rarely shows in both the pack and organic for one query; study, not confirmed by Google). It also gives no external pointer to an unindexed page. |
| **/services/web-design** (recommended now) | The page is "Discovered, currently not indexed", never crawled (measured, URL Inspection 21 Oct). Nothing outside the site links to it (audit A3). The profile link is the one lever on this list that sits on Google's own surface (inferred; the 14 Oct addendum and the audit both name it). The page matches the primary category, with the title "Web Design in Cyprus" and the H1 "Web design in Cyprus" (observed). It is not the strongest page, which also follows the plugin's advice. | Brand searchers land on a service page rather than the homepage; the menu and footer still route them (inferred, minor). If the profile later enters the pack for "web design cyprus" while the page ranks organically for the same query, the diversity effect could suppress one of them. No evidence says a profile link speeds up crawling. It is a plausible discovery path, not a proven one (inferred). |
| /services | Indexed hub; routes to all six services. | The weakest decision page on the site: 199 words, no prices, no call to action in the main content (SXO persona scores 37 and 40, audit). |

**Recommendation.** Set the website field to `https://kona-verse.com/services/web-design` with no tracking parameters. The profile's Performance report already counts website clicks and calls, so a UTM tag adds little here (inferred). Google may review the edit before it shows (inferred).

**Review dates.**
- 30 November: URL Inspection state for /services/web-design. If it is still not indexed with the link in place for three weeks, that fails the audit's own check, and the page needs other external links (section 3) more than a different profile URL.
- 31 January: if Konaverse is in the local pack for "web design cyprus" and the page is on organic page one for the same query, test the homepage for a month and compare clicks and calls.

### 1.5 Service area

Google: a service-area business "should hide your business address", and the service area "shouldn't extend farther than about 2 hours of driving time from where your business is based" (observed, answer/3038177). The address stays hidden (plan §1 decision 1; the 13 Oct record shows none).

Enter these five: **Nicosia, Limassol, Larnaca, Paphos, Famagusta** (the district; it covers Paralimni and Ayia Napa). All five are within about two hours' drive of Nicosia (inferred from Cyprus road distances; check the dashboard's map).

The service area describes where you work. It does not move where the profile ranks. Proximity to the hidden address explains 55% of pack ranking variance in the plugin's source (Search Atlas, study), and nothing in this pack changes that (inferred). Use "Nicosia" as the city everywhere and drop "Lakatameia" from public profiles; the owner chose Nicosia on 21 October (audit status note).

### 1.6 Hours, phone, booking, opening date

| Field | Value | Source |
|---|---|---|
| Phone | `+357 96 273855` | `src/lib/site.ts:57` (observed) |
| Hours | Monday to Friday, 09:00 to 17:00. Closed Saturday and Sunday. | `contact/page.tsx:58`, `layout.tsx:149-154` (observed) |
| Appointment link (if the field is offered) | `https://calendly.com/kona-verse/30min` | `site.ts:24` (observed); the contact FAQ describes a 30-minute video call |
| Website | `https://kona-verse.com/services/web-design` | 1.4 |
| Social profiles (if the field is offered) | instagram.com/konaverse.cy, facebook.com/konaverse, linkedin.com/company/konaverse | `layout.tsx:168-170` (observed) |
| Opening date | `[OWNER: confirm. The /about timeline says 2021 but the file marks the timeline a first draft (about/page.tsx:204-207); Clutch says founded 2021 (13 Oct record)]` | |

Timing: the live /contact still shows "Monday to Friday, 9 to 18 EET" and "Within one working day" (observed in the saved live HTML). The working tree has "9 to 5, Cyprus time" and "Within 24 hours" (observed, `contact/page.tsx:58-59`). Set the profile to 9:00 to 17:00 now. The site catches up when the 21 October changes are deployed (section 5, item 1).

### 1.7 Attributes

Which attributes Google offers depends on category and country, and I could not see the dashboard. Set only the ones that are true:

| Attribute (if offered) | Set? | Evidence |
|---|---|---|
| Online appointments | Yes | 30-minute video call booked through Calendly (`contact/page.tsx:95`) |
| Online estimates | Yes | Proposals are written from a conversation (`contact/page.tsx:75`); the one-page service gives "the outline and a quote within two days" (`service-pages.ts:712`) |
| Languages (English, Greek) | Yes, if the option exists | `contact/page.tsx:60` |
| Onsite services | `[OWNER: do you visit clients? The repo does not say]` | |
| Identity attributes | Leave unset unless the founders choose to declare one | The repo states none |
| Accessibility of premises | Not applicable | No public premises |

General attributes are filters and information, not ranking factors (plugin reference citing WebFX and Sterling Sky, study).

### 1.8 Features not to use

The plugin's feature table lists these as retired: chat and messaging (31 July 2024), call history (31 July 2024), and the public Q&A, whose API was discontinued on 3 November 2025 (observed, `local-seo-signals.md`). None of them appears in this pack. Answers to buyer questions belong on the site and in the description. The contact page already answers eight of them (`contact/page.tsx:64-97`).

Lint: `gbp_deprecation_lint.py --file local-and-conversion.md` returned **PASS (0 critical, 0 high, 0 medium)** (measured, 22 October). The script checks only for chat calls to action and `business.site` URLs; I checked the Q&A and call-history items by hand against the table above.

### 1.9 Photo shot list (real things only)

The audit asks for ten or more photos; the profile has none (13 Oct record). WebFX found likely benefit from having some photos over none, but not from adding ever more (plugin reference, study). Aim for 12 to 15 good ones and add one or two a month after that.

**Never use:** stock photos, AI-generated images, the site's black-and-white stand-in plates (the Bosra columns, the hall, the orb, the city), mock-up renders, anything showing a street name, house number or recognisable building front (the address is hidden), or the anonymised migration client's site. Keep Lumière Éclat and City Arcade out of profile photos: a photo carries no caption, so a viewer could take a concept for client work (inferred). Show them only in a post whose text says "studio concept".

| # | Shot | Notes |
|---|---|---|
| 1 to 3 | Each founder at work: Konstantinos, Nabil, Andreas | The portraits on /about are real photographs (`public/people/*-portrait.webp`, observed). Upload the originals, not the cut-outs. |
| 4 | The three together | One relaxed group photo; also a candidate for the cover |
| 5 | Two founders reviewing a design on a screen | A real client page on screen, not a concept |
| 6 | Where you work: desk, screens, sketchbook | Frame it so no address detail shows |
| 7 | A storyboard or wireframe on paper or a whiteboard | The process pages promise a written brief and directions; show the real artefact |
| 8 | Los Santos Barbershop's site on a phone in someone's hand | Ideally at the shop, with Fahed's consent |
| 9 | Chris N Clean's site on a laptop, mid-scroll through the house sequence | And one on a phone (the 73-frame cut) |
| 10 | HEIMAT's project page with floor plans on a laptop | |
| 11 | TDK's site beside its CMS editor on two screens | The "edits it itself" story (`case-studies.ts`, TDK result) |
| 12 | Velricon's homepage on a laptop | |
| 13 | Logo, square | From the brand mark |
| 14 | Cover photo | Photo 4, or photo 9 if it reads better at banner size |
| 15 | One video, 30 seconds or less: a real phone scrolling a live client site | 12-second screen recordings exist for Los Santos and Velricon (`public/work/*/reel.mp4`, measured with ffprobe). A filmed phone is safer if Google declines screen captures (inferred). Do not use the Lumière reel. |

### 1.10 Twelve weeks of posts

Posts have no direct ranking effect in WebFX's testing (plugin reference, study). Their job is to show a live business and route clicks to a page (inferred). Use the "Update" post type with a "Learn more" button. Each post below links to a page that is live today (observed in the saved live HTML). Images come from the repo's real captures; crop them to the post frame.

**Swap rule.** When the owner publishes an article from the content plan (scrollytelling, 3D cost, Next.js vs. React), replace the next service-page post with one about that article. Never post about a draft.

| Week of | Copy (chars, measured) | Button URL | Image |
|---|---|---|---|
| 26 Oct | How a custom web design project runs with us: a written brief in the first week, two visual directions for the homepage presented live, then every page designed at desktop and phone size with the motion specified. Design from €1,800, four to six weeks. (252) | /services/web-design | `/work/velricon/02.webp` |
| 2 Nov | Los Santos Barbershop in Nicosia had a strong Instagram, a Google listing full of reviews and no website. We built one page that shows what a cut costs, with the booking button in every section, so the distance from any sentence to a booked chair is one scroll. (261) | /work/los-santos-barbers | `/work/los-santos-barbers/01.webp` |
| 9 Nov | What does a website cost in Cyprus? We publish our starting prices: a one-page website from €1,200, a five-page site designed and built from €2,500, a 3D website from €6,000, with hosting priced by the year. The article sets out the numbers and what moves them. (261) | /blog/website-cost-cyprus | the article's cover |
| 16 Nov | Our SEO work starts with the technical foundation: every word in the HTML, structured data, indexing checked in Search Console. Then one page a month that answers a question your customers ask, and a plain report. Audit €500, ongoing from €300 a month. (252) | /services/seo | `/work/heimat-group/04.webp` |
| 23 Nov | Chris N Clean has been cleaning homes and offices in Cyprus since 1992. Its new site opens on a house cleaned as you scroll, drawn from 121 rendered frames on a desktop and a lighter 73-frame cut on a phone, with a quote form on every page. (240) | /work/chris-n-clean | `/work/chris-n-clean/01.webp` |
| 30 Nov | A 3D website is built around real dimension: modelled objects and scroll-driven scenes, with lighter cuts for phones. See Chris N Clean's scroll-bound film and Lumière Éclat, a studio concept we built to show the format. From €6,000, eight to twelve weeks. (256) | /services/3d-websites | `/work/chris-n-clean/m-02.webp` |
| 7 Dec | A redesign can lose the rankings a site has earned. We wrote down what moving 172 URLs to a new site taught us: the URL inventory, the redirect map, the automated checks before the domain moved, and what happened to indexing afterwards. (236) | /blog/redesign-website-without-losing-seo | the article's cover (it must not show the migration client) |
| 14 Dec | HEIMAT Development Group is three companies, in development, engineering and construction, joined into one. Its website introduces them as one group, and every project opens on a page of its own, with its own web address and its floor plans. (241) | /work/heimat-group | `/work/heimat-group/01.webp` |
| 21 Dec | When is a custom Next.js build worth it over Webflow? Konstantinos Kyprianou compares the two on custom motion, integrations, content editing and ownership, and on what a custom build costs you in responsibility. (212) | /blog/nextjs-vs-webflow | the article's cover |
| 28 Dec | TDK Design & Build in Nicosia designs residences and builds them. We built the editor into its website: projects, units and availability are content the studio edits, and a sold unit shows as sold within seconds. The studio runs the site itself. (245) | /work/tdk | `/work/tdk/02.webp` |
| 4 Jan | Velricon provides senior financial leadership to businesses in Cyprus. Its redesign rebuilt the site around the decisions its clients face: four services became four pages, and the first step it offers is a conversation, not a form. (232) | /work/velricon | `/work/velricon/01.webp` |
| 11 Jan | Thinking about a new website? Before a first call we get asked the same eight questions: cost, timing, what we need from you, who owns the site, and what happens after launch. The answers are on our contact page, with a thirty-minute video call you can book directly. (267) | /contact | photo 4 or 5 from 1.9 |

Every claim in the posts traces to the repo: `case-studies.ts` (Los Santos `:121`, Chris N Clean `:668-671` and the 121/73 frames in `service-pages.ts:426,553`, HEIMAT `:819-822`, TDK `:996-999` and `service-pages.ts:405`, Velricon `:476-479` and `service-pages.ts:797`), the service pages, `contact/page.tsx:64-97`, and the live posts' titles and H2s (observed in the saved HTML). Write every URL in full (`https://kona-verse.com/...`) in the button field.

---

## 2. The review ask

### 2.1 Who can be asked

| Client | Contact | Project (from `case-studies.ts`) | Year | Case study |
|---|---|---|---|---|
| Los Santos Barbershop | Fahed (named in the study) | One-page website, booking | 2025 | /work/los-santos-barbers |
| Velricon | `[OWNER]` | Web design, development, SEO; nine pages | 2025 (year marked first draft in `work-projects.ts:10`) | /work/velricon |
| Chris N Clean Ltd | Chris (named in the study) | Web design, development | 2026 | /work/chris-n-clean |
| HEIMAT Development Group | `[OWNER]` | Web design, development, SEO | 2026 | /work/heimat-group |
| TDK Design & Build | `[OWNER]` | Web design, development, CMS | 2026 | /work/tdk |

**Not askable:** Lumière Éclat and City Arcade are studio concepts (`case-studies.ts:294,1155`). The anonymised migration client is not in `case-studies.ts`, and a public review would identify them as a client, which the owner has ruled out (BRIEF). The founders, their families and anyone employed by the studio are out too: Google's policy counts "current or former employment" and "familial relationships" as conflicts of interest (observed, contributionpolicy/answer/7400114).

### 2.2 The rules the message follows

From Google's policy (observed, contributionpolicy/answer/7400114):
- No "incentives, such as payment, discounts, free goods and/or services", including for removing a negative review. That rules out offering a hosting discount, a free change or a reciprocal review of their business (inferred application).
- No asking only the happy ones: merchants may not "selectively solicit positive reviews". Ask all five, the same way, once.
- Do not "discourage or prohibit negative reviews".
- Permitted: asking for "content that does represent a genuine experience", provided you do not "try to influence the rating or content". So the message suggests no wording, no star count and no topics.

Practice (inferred): send it from the founder who ran the project, on the channel the client already uses with you (email or WhatsApp). Keep it apart from invoices and hosting renewals, so it cannot read as conditional. Use the profile's own "Ask for reviews" share link and paste it where the message says `[REVIEW LINK]`.

### 2.3 The message

```
Hi [first name],

[One sentence in your own words about their project: what we built together and when it went live.]

We are asking every client we have built a website for whether they would leave an honest Google review of working with Konaverse. Whatever your experience was, it helps the next business deciding whether to work with us.

Here is the link: [REVIEW LINK]

It takes two or three minutes. We are not offering anything in return, so please only write one if you want to, and no hard feelings if you would rather not.

Thank you,
[Your name]
Konaverse, +357 96 273855
```

Clutch: plan §1 decision 5 (Clutch reviews) is still deferred by the owner. If the owner reopens it, add one line to the message for clients who say yes on Google: "If you are also open to a review on Clutch, they verify it with a short call or an online form; tell me and I will send their request." Clutch's verification process was not re-checked in this run.

### 2.4 The follow-up (once, about seven days later, only if there is no review and no "no")

```
Hi [first name], one gentle reminder about the review link from last week, in case it got buried: [REVIEW LINK]. If now is not a good time, or you would rather not, that is completely fine and I will not ask again. [Your name], Konaverse
```

After that, stop. Do not ask the same client a third time (inferred: a third ask starts to read as pressure).

### 2.5 Two reply templates (reply within 48 hours, per the audit)

Reply to a positive or neutral review:
```
Thank you, [first name]. [One sentence about the specific project: what it was and the part you worked on together.] It was good to build [client business]'s site with you. [Your name], Konaverse
```

Reply to a critical review:
```
Thank you for writing this, [first name]. [One sentence that names the specific problem, without arguing or sharing private project details.] We want to put it right. I will call you this week, or you can reach me directly on +357 96 273855 or info@kona-verse.com. [Your name], Konaverse
```

Never offer anything in exchange for changing or removing a review; the policy bans it (observed). Keep project details in replies to what is already public in the case study (inferred).

### 2.6 Cadence and an honest target

- **Now:** one message to each of the five in the week of 26 October, the follow-up a week later.
- **Every new project:** the review link goes in the handover email, then a single reminder three weeks after launch (audit `evidence/local.md`). Add it to the handover checklist.
- **Target:** the audit set 3 or more by 30 November as its failure line and 4 as the goal. With five askable clients, 4 means four of five say yes. The back catalogue can never produce more than five (measured: five real studies). The plugin's sources report a ranking step at ten Google reviews and a drop after about three weeks without a new one (Sterling Sky, study). Reaching ten depends on new projects, so the honest horizon is the one the audit gave: Q2 2027 for the pack.
- **Watch:** review count weekly; replies sent within 48 hours.

---

## 3. The same entity everywhere

The brand name is shared with a podcast, and on Brave the first ~15 results for "Konaverse" belong to it (audit A7, observed 21 Oct). Disambiguation comes from the same name, line, city and phone on every profile, plus reviews and directory pages (audit A7). Use the blocks below verbatim.

### 3.1 Canonical NAP block

```
Name:      Konaverse
Address:   not shown (service-area business). City: Nicosia. Country: Cyprus.
Phone:     +357 96 273855
Email:     info@kona-verse.com
Website:   https://kona-verse.com
Hours:     Monday to Friday, 09:00 to 17:00, Cyprus time
Languages: English, Greek
Booking:   https://calendly.com/kona-verse/30min
Team:      three people (Konstantinos Kyprianou, Nabil Al Jbawi, Andreas Kyriakou)
Founded:   [OWNER: confirm 2021]
```

Sources: `site.ts:24,44,52-58`, `contact/page.tsx:56-60`, `about/page.tsx:126-161`, `layout.tsx:149-154,165`. The phone is one string everywhere: "A second spelling is a second entity" (`site.ts:54-56`).

### 3.2 Descriptions

**Tagline (91 characters, for fields capped at 120):**
```
Web studio in Nicosia, Cyprus: web design, web development, 3D websites, redesigns and SEO.
```

**Short description (183 characters; identical to the schema description, `layout.tsx:143`, except for the leading name):**
```
Konaverse is a web studio in Nicosia, Cyprus that designs and builds websites end to end: web design, web development, 3D and immersive websites, one-page websites, redesigns and SEO.
```

**Long description (710 characters):** the Business Profile description in 1.2, unchanged. Where a platform allows more and asks for services, add the six service lines from 1.3.

### 3.3 Profile table

"Website field" is the profile's main link. "Service link" is the one deep link each listing carries, through a service line, a portfolio item or a service entry, wherever the platform offers one. I spread the deep links so each of the three unindexed pages (web design, 3D, SEO) gets external pointers (audit A3). Directories link with their own anchor; one deep link per listing, never sitewide (audit `evidence/local.md`).

| Platform | Status | Name / phone / city | Website field | Service link | What to set or fix |
|---|---|---|---|---|---|
| Google Business Profile | Exists (13 Oct record) | Konaverse / +357 96 273855 / Nicosia (address hidden) | /services/web-design | Post buttons (1.10) | Section 1 |
| Bing Places | Unverified (audit) | Same | **https://kona-verse.com** after import | none | Import from the Business Profile, then change the website to the homepage: Bing feeds Copilot, so its entity link should be the entity home (inferred). After import, confirm no street address is published. I found no primary source on how Bing handles a hidden Google address, and one secondary source says Bing supports service areas only in the US (Yext help, unverified). If Bing would show the street, hide it or wait. |
| Apple Business Connect | Unverified, likely missing (audit) | Same | https://kona-verse.com | none | Apple's support page directs online and service-area businesses to its branded mail and Tap to Pay tools, and describes place cards for businesses with a physical location (observed, businessconnect.apple.com/support via search snippet). If Apple will not list Konaverse without a public address, do not invent one; wait until the Business Profile shows an address (plan §1 decision 1). Apple's 2026 rename to "Apple Business" is secondary reporting only (plugin reference). |
| Clutch | Exists: 0 reviews, website field = homepage (audit) | Fix: "96273855" → **+357 96 273855**; a street address in Lakatameia → **Nicosia**, no street | https://kona-verse.com (keep) | Service lines: Web design → /services/web-design, Web development → /services/web-development, SEO → /services/seo. Portfolio items → /work/[slug] for the five real clients; Lumière stays marked as a concept. | See 3.4 |
| LinkedIn company page | Exists: "Design Services", Nicosia, 14 followers, no website field (audit) | Konaverse / +357 96 273855 / Nicosia | **/services** (audit A3) | none in the profile; articles in posts (section 4) | Tagline (3.2), About = the long description plus the six service lines, phone, company size 2 to 10, founded `[OWNER]`, industry Design Services (keep), specialties: web design, web development, 3D websites, website redesign, one-page websites, SEO. Founders list Konaverse as their current company (Andreas: `[OWNER: does he have a LinkedIn profile? None is in the repo]`). |
| Facebook page | Exists; bot sees the name only (audit) | Same; no street | /services | none | Intro (3.2 tagline variant in section 4), category nearest to Website designer (check the picker), phone, email, hours, Nicosia as city. |
| Instagram konaverse.cy | Exists (audit) | Name field: Konaverse | /services | Extra bio links, if offered: /work and the Calendly link | Bio and links in section 4. Contact buttons: email and phone; no address. |
| Sortlist | Unverified | Same | https://kona-verse.com | /services/web-design | Sortlist appeared on 8 of 16 Cyprus money SERPs (plan §10, observed 2 Oct). |
| DesignRush | Unverified | Same | https://kona-verse.com | /services/3d-websites | Its audience is international, which fits the 3D service's "for brands anywhere" (inferred). |
| GoodFirms | Unverified | Same | https://kona-verse.com | /services/web-development | Development-led directory (inferred). |
| TechBehemoths | Unverified | Same | https://kona-verse.com | /services/seo | Appeared in "best web design agency cyprus" from Cyprus (13 Oct record). |

On every listing, use the short description (3.2) or the long one where space allows, the same three people, and team size 2 to 10 (or the platform's band that contains three). The audit could not confirm the five unverified listings (403s), so search each before creating it, to avoid a duplicate (the plugin lists duplicate profiles as a top negative factor, study). Owner checks first, then creates.

### 3.4 Clutch, in detail

Observed on 13 and 21 October (audit A4 and the state record):

1. Phone shows "96273855". Set **+357 96 273855**.
2. Location shows a street address in Lakatameia. Set the city to **Nicosia** with no street, to match the hidden address on the Business Profile. If Clutch insists on a street, that is an owner decision; the default is not to publish one (plan §1 decision 1).
3. Team size shows both 2 to 9 and 2 to 5. Use **2 to 9** in both places: it is Clutch's band that contains three people (inferred).
4. Website field: keep the homepage. Put the service pages in the service-line descriptions (where the field accepts a link) and the case studies in the portfolio items.
5. **New in this run:** the minimum project size is $5,000 (13 Oct record), while the site sells a one-page website from €1,200 and a designed site from €1,800 (observed). `[OWNER: keep $5,000 as a filter, or match the site's floor?]` Either is defensible; leaving them unexplained reads as two businesses (inferred).
6. Focus split: web design 35, web development 35, SEO 20, branding 10 (13 Oct record). The site sells no branding service and lists 3D and redesign instead. `[OWNER: realign the split to the six services?]`
7. Founded 2021 matches the /about timeline, which the file marks as a first draft. `[OWNER: confirm]`

Later (code, not now): add the Clutch URL to `sameAs` in `layout.tsx:167` once the profile matches (audit `evidence/local.md` item 8).

### 3.5 Order of work for the owner

1. Business Profile (section 1). One sitting.
2. Clutch fixes (3.4).
3. LinkedIn website field and About; Instagram and Facebook bios (section 4).
4. Bing Places import (needs step 1 done).
5. Search for the four directories and Apple; create the missing ones from 3.1 and 3.2.
6. Check on 30 November: no new referring page pointing at a /services/* URL fails the audit's Phase 3 check.

---

## 4. Social, kept small

### 4.1 What the data says (measured, GA4 property 534373757, audit `evidence/google/ga4_extra.json`)

| Source, last 28 days | Sessions |
|---|---:|
| Organic Social (channel) | 43 |
| of which Instagram (`ig / social` 20, `instagram.com` 12, `l.instagram.com` 1) | 33 |
| of which Facebook (`facebook.com` 6, `m.facebook.com` 4) | 10 |
| Organic Search | 30 |
| LinkedIn, 28 or 90 days | 0 |

The audit README rounds the 43 to "Instagram". Strictly it is Instagram 33 plus Facebook 10. Over 90 days, `ig / social` alone is 138 sessions. Instagram is the one social channel that sends people. LinkedIn sends nobody yet, so its value is entity and founder reach, unmeasured (inferred). None of this traffic can show leads yet: the live site has no lead event (audit D2), and `generate_lead` exists only in the working tree.

### 4.2 Profile fixes

I could not read the current bios (audit: bots see little). Replace what is there with these.

**Instagram (konaverse.cy)**
- Name field: `Konaverse`
- Category: the nearest to Website designer in the picker
- Bio (117 of 150 characters, measured):
  ```
  Web studio in Nicosia, Cyprus. Web design, development, 3D websites, redesigns and SEO. Prices on every service page.
  ```
  ("Prices on every service page" is true: each service page states its starting price in its first paragraph, observed.)
- Links: first `https://kona-verse.com/services` (audit A3). If the account offers more than one link, add `https://kona-verse.com/work` labelled "Work" and `https://calendly.com/kona-verse/30min` labelled "Book a call".
- Contact buttons: email and phone; no address.

**LinkedIn company page:** the table in 3.3. Tagline from 3.2. Website field `https://kona-verse.com/services`.

**Facebook page**
- Intro (87 characters, measured):
  ```
  Web studio in Nicosia, Cyprus. Web design, development, 3D websites, redesigns and SEO.
  ```
- Website `https://kona-verse.com/services`, phone, email, hours as in 3.1, city Nicosia, no street.

**A caution for the owner (inferred).** /services is the page these three profiles send people to, and it is the weakest decision page on the site: no prices, no call to action in the main content, footer off (SXO 37 and 40). The homepage carries no prices either: 0 euro amounts in 791 words (measured, saved live HTML). Until the hub cards show their "from" price and timeline (audit C4, a design change for the owner), the social links carry visitors to a menu rather than an answer. That makes C4 more valuable, not the link wrong: the hub is the only page that routes to all six services.

### 4.3 The cadence rule

For every article and case study that is live:
1. **One LinkedIn post** on the company page in the week it goes live, reshared by the author from his personal profile. Plan §8 names founder LinkedIn as the channel; the content plan allows two a week "because the substance already exists" and says "Do not write LinkedIn-only opinion pieces to fill a calendar" (observed, `content-plan-2026-11-to-2027-08.md:131-133`). Each post leads with one real number or decision from the piece, then the link.
2. **One Instagram carousel** of 6 to 8 slides built from the piece's real captures (desktop 19:10 and phone 390:844 in `public/work/`, cropped to 4:5), plus one Story with a link sticker to the page. A carousel caption cannot carry a working link (inferred from how Instagram works). Let Instagram cross-post the carousel to Facebook.
3. **Links in posts** carry UTM tags (`utm_source=linkedin` or `instagram`, `utm_medium=social`, `utm_campaign=<slug>`), so leads by source can be read in GA4 once `generate_lead` is live. Profile website fields stay clean (inferred: entity consistency).

That gives at most two posts a week per channel in November and December while the backlog runs, then about one a week following the content plan's pace of about 22 articles and 3 Labs pieces in ten months (inferred from the plan).

### 4.4 The backlog: what is live now

These are live but, as far as the repo shows, not yet repurposed (I could not see the accounts; skip any already posted).

| Order | Piece | LinkedIn lead (one real fact) | Carousel slides from | Link |
|---|---|---|---|---|
| 1 | Website cost in Cyprus (Nabil) | "We publish our prices": €1,200, €2,500, €6,000, hosting by the year | The article's price table, one tier per slide | /blog/website-cost-cyprus |
| 2 | Los Santos Barbershop | The price on the page, the booking button in every section | `/work/los-santos-barbers/01-07`, `m-01..06` | /work/los-santos-barbers |
| 3 | Redesign without losing SEO, 172 URLs (Konstantinos) | 172 URLs inventoried and redirected; the checks run before the domain moved | The six numbered steps (H2s), one per slide; no client-identifying screens | /blog/redesign-website-without-losing-seo |
| 4 | Chris N Clean | 121 frames on desktop, 73 on a phone | `/work/chris-n-clean/` stills and phone captures | /work/chris-n-clean |
| 5 | HEIMAT | Three companies into one group; a page and floor plans per project | `/work/heimat-group/` | /work/heimat-group |
| 6 | Next.js vs. Webflow (Konstantinos) | What a custom build costs you in responsibility | The article's decision section | /blog/nextjs-vs-webflow |
| 7 | TDK | A sold unit shows as sold within seconds | `/work/tdk/` | /work/tdk |
| 8 | Velricon | Four services, four pages; a conversation before a form | `/work/velricon/` | /work/velricon |
| 9 | Lumière Éclat (studio concept, said in the first line) | Particles, reflections and cursor effects were tried and cut | `/work/lumiere-eclat/` | /work/lumiere-eclat |
| 10 | City Arcade (studio concept, said in the first line) | One scroll that says who an agency is | `/work/city-arcade/` | /work/city-arcade |
| LinkedIn only | **Draft 7, "Can ChatGPT create a website?"** (Konstantinos). The draft audit shelved it and marked it "Reusable as a LinkedIn post" (observed, `drafts-audit-2026-10-13.md:37`), the only shelved draft it marks that way. | His first check on an AI-built site: submit the enquiry form and follow it to the person who receives it (draft, opening section). Re-check the OpenAI Sites documentation it cites before posting; the draft's check date is 10 October. | none | No blog link (it is not published); link /services/web-development if any |

The other shelved drafts are not marked as LinkedIn material. Draft 4 folds into the Article 2 rewrite, Draft 9 into Draft 10, Draft 12 into Article 11, and Draft 8 "feeds no service" (observed, same file). I would not mine them for posts, given the plan's rule against filler (inferred).

### 4.5 Mapped onto the content plan (November 2026 to August 2027)

One LinkedIn post and one carousel each, in the week the piece goes live. Nothing is posted before the owner publishes. "Substance" is the plan's own column (observed, `content-plan-2026-11-to-2027-08.md`).

| Month | Piece | LinkedIn lead | Carousel |
|---|---|---|---|
| Nov | Scrollytelling (Article 13, drafted, unpublished in Sanity) | Lumière Éclat chapter by chapter; the stack (Lenis, GSAP, Three.js) | Lumière stills, labelled concept; the three inspected examples, credited |
| Nov | How much a 3D website costs (drafted, unpublished) | From €6,000, with what it buys | The price drivers, one per slide |
| Nov | Next.js vs. React for SEO (approved, needs the view-source addition) | A service page's content shown in view-source | The view-source screenshots |
| Dec | Labs piece 1 ships ("LinkedIn first, blog second" in the plan) | Why a studio builds things nobody asked for | The piece's own frames |
| Dec | Best web design agencies in Cyprus, competitors included | Ten agency sites inspected; how they were measured | Method slides, not a ranking with Konaverse first (BRIEF: no self-promotional lists) |
| Dec | Speed and conversions, with our numbers | One before-and-after figure from the performance reports | The before/after figures |
| Jan | How we built Labs piece 1 | File sizes before and after | Pipeline steps |
| Jan | How long a website takes, real timelines | The real durations, once the owner supplies them | One project per slide |
| Jan | Editing a custom site without code (Sanity) | The handover tasks run for real | Studio screenshots |
| Feb | Best 3D websites of 2027 | Ten sites inspected, technique named | One site per slide, credited |
| Feb | Template or custom: €1,200, €2,500, €6,000 | Hours per tier | One tier per slide |
| Feb to Jun | Labs pieces 2 and 3 and their making-ofs; making a WebGL-heavy site fast; three ways to put 3D on a page; planning a redesign; choosing a web development company; scroll without lag; WebGL on phones | The plan's substance line for each | Their own measurements and captures |
| Jul | What AI engines cite for "web design in Cyprus" | The logged prompt battery | One engine per slide |
| Aug | Is a one-page website enough?; Ten months of Konaverse SEO | The €1,200 scope and when we said no; the numbers, including what did not move | Los Santos and the one-page clients; the real charts |

### 4.6 Measurement

Monthly, beside the content plan's review: GA4 sessions by source/medium (Instagram, Facebook, LinkedIn with UTMs), and `generate_lead` by source once deployed; follower counts are secondary. The January 2027 review decides whether LinkedIn earns its time. If it still sends 0 sessions and 0 leads after two months of posts with UTMs, keep it as an entity profile and stop the reshares (inferred threshold, owner's call).

---

## 5. Win stage: the bottom of the funnel

Sources: the current source (with the uncommitted 21 October edits) and the live HTML saved on 21 October, which predates those edits (`git status` shows them uncommitted; `main` equals `origin/main` at b148871, observed). The audit's SXO file already scored personas; this section answers the five questions a buyer needs settled before contacting a studio.

### 5.1 What a buyer needs to decide, page by page

| Page | Price | Timeline | Proof (real clients / concepts) | Who they will talk to | Phone | Next step |
|---|---|---|---|---|---|---|
| /services/web-design | Yes, first paragraph: €1,800 design, €2,500 built | Yes: 4 to 6 weeks, plus steps with weeks | Velricon, Chris N Clean, HEIMAT / City Arcade (labelled) | Nobody named | Live: none. Source: footer only. | Start a project (/contact), Book a call (Calendly), brief box → /contact?brief= |
| /services/web-development | Yes: €1,800, €2,500 | Yes: 4 to 8 weeks | TDK, HEIMAT, Chris N Clean, Velricon (4 real) | Nobody | Same | Same |
| /services/3d-websites | Yes: €6,000 | Yes: 8 to 12 weeks | Chris N Clean / Lumière Éclat (labelled); 3 of 4 problem cards cite Lumière | Nobody | Same | Same |
| /services/one-page-websites | Yes: €1,200 | Yes: 2 to 3 weeks | Los Santos / City Arcade (labelled) | Nobody | Same | Same |
| /services/website-redesign | Yes: €2,500 | Yes: 4 to 8 weeks | Velricon; the 172-URL article linked "From the blog" | Nobody | Same | Same |
| /services/seo | Yes: audit €500, from €300 a month, 3-month minimum | Audit 2 weeks, fixes 2 to 4 weeks, then monthly | Velricon, HEIMAT, Los Santos, by method only (no outcomes, honestly said) | Nobody | Same | Same |
| /contact | Yes: every tier in the FAQ | Yes | None on the page | Nobody named | Yes (live and source) | Form (3 fields, works without JS), email, inline calendar |

Counts (measured, saved live HTML): the names Kyprianou, Al Jbawi and Kyriakou appear 0 times in the visible text of all six service pages and /contact. `tel:` links: 0 on each service page, 1 on /contact. "Greek" and "English": 0 on the service pages, 2 on /contact. Every service page has the footer with the email (1 `mailto:`). The /services hub has no footer.

What works (observed): price and timeline in the first passage on all six; priced add-ons and yearly hosting stated up front; a weekly process with "You give / You get"; named, linked Cyprus clients; concepts labelled; a three-field form that posts without JavaScript; an inline calendar on /contact; a contact FAQ that answers cost, time, inputs, ownership, remote work, redesigns, after launch and "can we talk first".

### 5.2 Blockers, ranked, with proposals

Ranked by buyer impact over effort (inferred). Design and copy changes are proposals for the owner, not instructions.

1. **The live site still shows what the owner corrected on 21 October.** Observed in the saved live HTML: "Largest paint, guaranteed < 2.5 s" on /services/web-development; "Monday to Friday, 9 to 18 EET" and "Within one working day" on /contact; "Where: Cyprus" without the city; no phone in the footer; the large mobile cookie card covering the CTAs (audit D3); and no `generate_lead` event. All are fixed in the working tree and verified locally by the audit (tsc, production build, seo-gate PASS). Committing, pushing and deploying need the owner's authorization (AGENTS.md); I did none of them. This is the largest gain with no new design: it removes a promise a buyer can test against our own PageSpeed result (22.7 s mobile lab LCP, audit B1), makes the hours match the profile (1.6), and makes leads measurable.
2. **No third-party proof.** 0 reviews on Google and Clutch (measured, 21 Oct). Trust is the lowest persona dimension on every page, 5 to 12 of 25 (audit SXO). Section 2 is the fix. A related point (inferred): the SEO page sells "Google Business Profile: the profile set up or cleaned up, with categories, services and photographs, €150" (`service-pages.ts:907`), while our own profile has no photos and no reviews. A buyer who checks will notice. Section 1 closes that gap too.
3. **Nobody is named and the phone is not visible where the decision is made.** Proposal: in the closing section of each service page (the shared Invitation), one line naming the person who takes the first call, with their /about portrait, and a tap-to-call link beside "Book a call" (audit C5, SXO finding 4). `[OWNER: who takes first calls? One person for all services, or per service: Nabil for design and 3D, Konstantinos for development and SEO, Andreas for scheduling?]` The roles exist in `about/page.tsx:130,140,155`; the choice is the owner's.
4. **The next step is not described where the button is.** Service pages say "Book a call" but not what the call is. Proposal, using the owner's own copy from /contact (`contact/page.tsx:95`, `:59`): under "Book a call", the line "Thirty minutes on video, no preparation needed, and no obligation. Messages answered within 24 hours." This is copy only, no design change, and still the owner's approval.
5. **Buyers abroad get no word on how remote work runs.** The 3D page and the redesign page serve "Worldwide" (`service-pages.ts:493,750`), but the remote-work answer lives only in the contact FAQ (`:79`). Proposal: one line on those two pages, from the FAQ: "We work remotely with clients across Europe and beyond, in English and Greek. Calls are on video; the work is delivered online."
6. **Real 3D proof is one client.** On the 3D page, Lumière Éclat (a labelled concept) comes first in "Recent 3D and motion work" and in three of four problem cards; Chris N Clean is the only client 3D build. Proposal: list Chris N Clean first and keep Lumière labelled. The lasting fix is the next real 3D project or Labs piece 1 (content plan, December). Do not relabel anything to look like client work.
7. **Lead tracking stops at the form and the calendar.** The working tree sends `generate_lead` on a sent form and on Calendly's `event_scheduled` (audit status). Still missing: a phone-click event on `tel:` links (Cyprus SMEs call, per SXO), marking `generate_lead` as a key event in GA4 (owner action 4 in the audit), and reviewing the `ads_conversion_Contact_Us_1` trigger (13 fires against 10 /contact landings, measured). Proposal: a `phone_click` event alongside `generate_lead`, a small code change with no visual effect.
8. **/contact shows no proof and no person.** Proposal: a single line under the facts, "Recent work: Los Santos Barbershop, Chris N Clean, HEIMAT, TDK, Velricon", linking to /work, plus the person from item 3. Once reviews exist, a link to the Business Profile's reviews is allowed on the page; Review and AggregateRating schema stay banned (BRIEF).

Adjacent, not in scope but on the path: the /services hub (audit C4) is where LinkedIn, Facebook and Instagram send people (section 4.2), and it has no prices or call to action.

What not to do yet (FLOW's conversion audit: no extra spend before clarity and measurement): no Clutch Verified badge ($499 a year; it "does not substitute for reviews", 13 Oct record), no ads, no paid directories, until item 1 is live and two months of `generate_lead` data exist (inferred).

### 5.3 Claims to confirm before they are repeated in any new copy

None of these is shown to be false. Each reads as a measured outcome or a standing promise, and the repo holds no evidence for it (observed):

| Claim | Where | Ask |
|---|---|---|
| "Every page is tested on real devices before launch" / "measured on real devices" / "Tested on real devices" | `service-pages.ts:426`, `:382`, `:468`, `:529` | Which devices? The audit notes physical-device review of our own site is outstanding (AGENTS.md). |
| "under a second to first paint on a mid-range device" (Los Santos) | `case-studies.ts:192` | Is there a measurement? If not, make it a target-and-method line, as was done for B1. |
| "each request arrives as a message the company answers the same day" (Chris N Clean) | `service-pages.ts:412` | Is that the client's practice, confirmed by them? |
| "60 fps, our target on a mid-range phone" | `service-pages.ts:506` | Already a target; name the device and the method once measured. |

None of these appears in the copy proposed in this document.

### 5.4 Tracking and first-party data to collect next

The FLOW Win prompts ask for customer language and objections, and none exists in the repo (observed). Proposal for the owner: for every enquiry from today, note five things in one sheet: source (form, call, calendar, profile, Instagram), service, budget range said, the main objection or question, and the outcome. After ten enquiries this replaces the inferred personas with real ones, and it is the input the BOFU page brief needs (FLOW Win, BOFU brief inputs). Monthly scorecard, beside the content plan's review:

| Indicator | Where |
|---|---|
| Leads by source (`generate_lead`, `phone_click`) | GA4, once deployed |
| Profile website clicks, calls, review count | Business Profile Performance |
| Indexing of /services/web-design, /3d-websites, /seo | Search Console URL Inspection |
| Non-brand impressions by page | Search Console |
| Enquiry sheet: objections, close rate | The owner's sheet |

### 5.5 What this review cannot show

- Whether any of these pages converts. There are no lead events live and no enquiry log, so every ranking above is judgement against the FLOW prompts, not a measured funnel.
- How the pages read on a phone in a buyer's hand (no physical-device or Safari review; AGENTS.md).
- What the profile dashboard offers in Cyprus for this category (attributes, appointment link, price field, social profiles), or whether the directories already list Konaverse.

---

## Owner blanks, in one list

1. Opening date / founded year (2021?) for the profile, LinkedIn and Clutch.
2. Is branding a service you sell? (categories, Clutch split)
3. Do you visit clients on site? (attribute)
4. Contact names at Velricon, HEIMAT and TDK for the review ask.
5. Reopen Clutch reviews (plan decision 5)? Decides the optional line in 2.3.
6. Clutch minimum project size: keep $5,000 or match €1,200?
7. Andreas on LinkedIn?
8. Who takes first calls (5.2, item 3)?
9. Authorize commit and deploy of the 21 October changes (5.2, item 1).

## Sources

Repo (read 22 October 2026): `docs/seo-strategy-2026-10-22/BRIEF.md`; `docs/seo-audit-2026-10-21/README.md`, `evidence/local.md`, `evidence/sxo.md`, `evidence/google.md`, `evidence/google/ga4_extra.json`, `evidence/technical/html/*.html`; `docs/seo-state-2026-10-13.md`; `docs/seo-plan-q4-2026.md`; `docs/content-plan-2026-11-to-2027-08.md`; `docs/editorial/drafts-audit-2026-10-13.md`; `docs/blog-drafts/can-chatgpt-create-a-website.md`; `docs/blog-writing-handoff.md`; `src/lib/site.ts`, `src/lib/service-pages.ts`, `src/lib/case-studies.ts`, `src/lib/work-projects.ts`, `src/app/(v4)/about/page.tsx`, `src/app/(v4)/contact/page.tsx`, `src/app/(v4)/services/[slug]/page.tsx`, `src/app/layout.tsx`, `src/components/v4/Invitation.tsx`, `src/components/v4/SiteFooter.tsx`.

Plugin (claude-seo 2.4.2): `skills/seo-flow/SKILL.md`, `references/flow-framework.md`, `references/prompts/local/*` (11 files), `references/prompts/win/*` (3 files), `skills/seo-local/SKILL.md`, `skills/seo/references/local-seo-signals.md`, `scripts/gbp_deprecation_lint.py`.

Web (fetched or searched 22 October 2026):
- [Google: Guidelines for representing your business on Google](https://support.google.com/business/answer/3038177)
- [Google: Business Profile description help](https://support.google.com/business/answer/3039617)
- [Google: Prohibited and restricted content (reviews)](https://support.google.com/contributionpolicy/answer/7400114)
- [Dalton Luka: Google Business Profile categories, list dated 9 May 2026](https://daltonluka.com/blog/google-my-business-categories)
- [BrightLocal: Business Profile description](https://www.brightlocal.com/learn/google-business-profile-description/) and [Letter Counter: Business Profile character limits](https://lettercounter.org/blog/google-business-profile-character-limit/) (third-party limits: description 750, services 300, posts 1,500)
- [DBA Platform: why service and product limits differ](https://learn.dbaplatform.com/how-come-gmbs-character-limits-differ-for-service-and-products)
- [Apple Business Connect support](https://businessconnect.apple.com/support) and [TechCrunch, 16 October 2024](https://techcrunch.com/2024/10/16/apple-debuts-new-business-tools-for-managing-presence-across-email-calls-and-tap-to-pay)
- [Yext help: hidden addresses on Google and Bing](https://help.yext.com/hc/en-us/articles/360001130466)
- [Dalton Luka: syncing Bing Places with the Business Profile](https://daltonluka.com/blog/sync-bing-places-with-google-my-business)
