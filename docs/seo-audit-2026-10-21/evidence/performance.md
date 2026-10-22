# Performance / Core Web Vitals audit, kona-verse.com, 21 Oct 2026

Lab only. Emulated mobile (slow 4G, 4x CPU) and desktop, Lighthouse 13.5.0 via the PSI API, plus two local Lighthouse 13.5.0 runs (home, /about). Lab timings are simulated/software-rendered and are not device truth. Raw JSON: `evidence/performance/` (psi_*.json, psi2_*.json retries, lh_home_mobile.json, lh_about_mobile.json, preload_home.json).

## Field data
CrUX has NO data for the origin or for any of the 9 URLs (API 404 "chrome ux report data not found"; crux_history.py and lcp_subparts.py both empty). Real-user CWV cannot be assessed. Vercel Analytics is installed (src/app/layout.tsx:238-239) and is the only field source; it was not read here.

## Score: 30/100
Mobile lab median of the nine pages is 27 (home 42); desktop median 46. Treat as a lab score under a heavy third-party handicap, not a user-experience verdict.

## Per page (PSI, one run each; /work, 3d-websites desktop and city-arcade desktop needed retries after SSL resets)
| Page | Mob Perf | Mob LCP / FCP | Mob TBT ms | Mob CLS | Desk Perf | Desk LCP | Desk TBT ms | Desk CLS |
|---|---|---|---|---|---|---|---|---|
| / | 42 | 28.6 s / 1.7 s | 1,100 | 0 | 38 | 5.5 s | 2,240 | 0.083 |
| /services | 26 | 13.6 s / 9.6 s | 3,430 | 0 | 62 | 1.3 s | 1,120 | 0 |
| /services/web-design | 30 | 22.8 s / 10.0 s | 1,400 | 0 | 62 | 0.7 s | 3,060 | 0.059 |
| /services/3d-websites | 58 | 3.1 s / 1.7 s | 1,600 | 0.007 | 65 | 0.7 s | 1,410 | 0.045 |
| /work | 18 | 6.4 s / 1.5 s | 1,480 | 0.841 | 25 | 2.6 s | 3,740 | 0.572 |
| /work/city-arcade | 27 | 22.1 s / 9.9 s | 2,340 | 0 | 39 | 4.9 s | 1,800 | 0 |
| /about | 26 | 13.2 s / 10.1 s | 2,760 | 0 | 65 | 0.6 s | 1,100 | 0.053 |
| /blog/website-cost-cyprus | 29 | 30.9 s / 10.0 s | 1,690 | 0 | 46 | 3.1 s | 3,180 | 0 |
| /contact | 26 | 22.5 s / 10.0 s | 3,990 | 0 | 27 | 6.9 s | 3,460 | 0.222 |

Accessibility 92-100, SEO 100, Best Practices 73 on every page. TBT is the INP proxy: 1.1-4.0 s everywhere; INP itself is unmeasured.

## Comparison with 2 Oct (mobile Perf 31, LCP 15.1 s with 96% render delay, TBT 1.4 s, 4.9 MB)
- Home mobile Perf 31 -> 42 (PSI) / 28 (local run): inside run-to-run noise; no real headline improvement. The simulated LCP swings (15.1 -> 28.6 s) are Lantern artefacts; use the observed breakdown below.
- Home TBT 1.4 s -> 1.1 s (PSI) / 4.3 s (local): flat.
- Transfer 4.9 MB -> 7.3 MB (PSI home), 6.2 MB (local). The growth is Calendly (intentional), see next section.

## What the 6-7 MB is made of (home, local run, 86 requests, 6.22 MB)
- Third party 4.40 MB (44 requests). Calendly 3.0 MB and 839 ms main thread (booking JS 1.48 MB, booking CSS 1.32 MB, plus its child frames: Stripe 278 KB, reCAPTCHA 2x355 KB, Google sign-in, Segment/Braze/Sprig/Survicate); Google Tag Manager 198-288 KB and 119-235 ms; Microsoft Clarity 27 KB and 108-191 ms; Ahrefs analytics 3 KB.
- First party 1.83 MB: hero-loop.mp4 1.17 MB, JS about 0.3 MB (14 sync chunks), 8 CSS files about 60 KB, 3 preloaded images, mark-192.webp, one font.
- The Calendly preload is intentional (AGENTS.md, handoff). Cost stated, not a removal request: about 48% of bytes and most lab main-thread time on EVERY route, which is why even light pages score about 26 on mobile. Load-strategy alternatives that keep the single warm iframe: (a) start the iframe `src` at requestIdleCallback or after the hero entrance settles instead of at parse, still rendered at real size behind the site (the handoff says hidden or offscreen frames never initialised); (b) start Clarity and GTM at idle too. The owner decides lab score against booking readiness.

## LCP element and the text-entrance trade-off
- Home (local run): LCP element `section.hw-hero p.hw-para` (text with `hw-ent` entrance class). Observed subparts: TTFB 331 ms, element render delay 3,824 ms (92% of 4.15 s). There is no image LCP on home. STILL OPEN (2 Oct: 96% render delay). Known owner trade-off; render delay is entrance plus hydration. The handoff plays the entrance once per tab session, so repeat views in a tab are not affected; lab runs and first-time visitors always are.
- /about (local run): LCP element `div.ag-tile > img` /about-hero/04-800.webp. TTFB 136 ms, load delay 14 ms, load duration 193 ms, render delay 1,806 ms (84%). The image arrives by 341 ms and then waits 1.8 s for hydration/entrance. Preload is correct (imageSrcSet 800w/1600w).
- /work/city-arcade: HTML preloads 01-960/01.webp with fetchPriority high; loading is fine, the delay is paint gating.
- Pattern (SUSPECTED, not traced): on mobile PSI six inner pages (about, services, web-design, city-arcade, blog, contact) show an almost constant FCP of 9.6-10.1 s while home and 3d-websites show 1.5-1.7 s. In the local /about trace every first-party resource finishes by 0.34 s, yet FCP is 10.1 s, so first paint waits on main thread or JS, not bytes. Needs a DevTools trace under 4x CPU. Do not touch text entrances; look at shared layout hydration and Calendly start.
- Desktop LCP is good on /services (1.3 s), web-design, 3d-websites (0.7 s), about (0.6 s); not good on home (5.5 s), city-arcade (4.9 s), contact (6.9 s), blog (3.1 s).

## Findings

1. HIGH, STILL OPEN. Mobile LCP fails on every page except 3d-websites; home render delay is the text entrance (owner trade-off); inner-page FCP about 10 s is unexplained gating. Fix: trace the first-paint gate; delay Calendly start; confirm with Speed Insights once data exists.
2. HIGH, NEW. TBT 1.1-4.0 s on all 9 pages (INP proxy). bootup (home local): first-party chunks 5f005b53 (3.9 s CPU), a3980397 (3.4 s), 69be3981 (2.4 s, React runtime), Calendly booking JS 1.07 s, reCAPTCHA 0.42 s, GTM 0.97 s. Fix: idle-start Calendly, GTM, Clarity (strategy lazyOnload) without removing them.
3. HIGH, NEW. CLS on /work: mobile 0.841, desktop 0.572 (limit 0.1). Culprits: `img.wc-open` (/work/covers/opener.webp; WorkCascade.tsx:616, work.css:926) and a `.wc-slot` card (work.css ~884); on mobile a work-list row image. Cause SUSPECTED: entrance geometry not compositor-only, or the opener image swapping in. One run per strategy; repeat before fixing. Fix: reserve the opener box with aspect-ratio, animate transform/opacity only.
4. MED, NEW. CLS on /contact desktop 0.222: node `div.cal-pop.k-glass.is-inline` ("Book a call", JS-sized 506.906 px wide). Fix: reserve the slot size in CSS. Home desktop 0.083 (h1 `hw-it`, `hw-glint`) is borderline and entrance-related; leave.
5. MED, NEW. React minified error #418 (hydration text mismatch) on home in both PSI and local runs (chunk 69be3981). It forces client re-render and can add to TBT. SUSPECTED source: time or locale text (Cyprus clock). Not logged on /about or /work.
6. MED, PARTLY FIXED. Three.js/R3F/postprocessing is NOT in the initial scripts on any route (no `WebGLRenderer` in the 14 chunks of the home HTML). FluidCursor is a dynamic ssr:false import (FluidCursor.tsx:13), mounted only on hover-capable, non-reduced-motion devices after idle (FluidCursor.tsx:89-94), from `(v4)/layout.tsx:52`. Mobile and PSI never fetch it; desktop pointer users still download it (849 KB uncompressed per the handoff) on every route. Could not measure desktop transfer in PSI.
7. MED, CONFIRMED FIXED. hero-loop.mp4 fetched once (1 media request, 1.17 MB, range-capable).
8. LOW, CONFIRMED FIXED. One woff2 preload (25 KB, was 7 across 6 families). Image preloads: home 3 plus mark; inner pages 1-2 above-fold (was about 20). Brand mark is mark-192.webp 6.6 KB; the 115 KB mark.png is no longer loaded.
9. LOW, REGRESSED. OG image `og-image1.png` is 752,527 bytes (src/lib/site.ts:62; was 661 KB). A 64 KB `public/og-image.jpg` already exists. Fix: serve a version under 300 KB.
10. LOW, NEW. Unused JS 2.0 MB and unused CSS 1.3 MB reported, almost all Calendly (booking CSS 1.28 MB of 1.32 MB unused). Same load-strategy fix as 1 and 2.
11. LOW, STILL OPEN. Cache: `/_next/static/*` is immutable 1 year (good), HTML max-age=0 (fine), but `/home/hero-loop.mp4`, og images and `/brand/*` are `max-age=14400, must-revalidate`; the 1.17 MB video revalidates every 4 h. Fix via headers or Cloudflare cache rule.
12. LOW, NEW. 3-5 render-blocking stylesheets per page (2-16 KB each, est. 450-900 ms simulated).
13. INFO, STILL OPEN. Best Practices 73: no CSP, no COOP, HSTS lacks includeSubDomains/preload, Calendly third-party cookies. Console on /work: `<SanityLive> is attempting to reconnect`.
14. INFO. No speculation rules; bfcache signals clean (preload_check score 50). PSI saw deploy dpl_J8mq..., a later curl saw dpl_CtbX2... (a deploy landed mid-audit).

## Limits
No field data. LCP element and subparts were captured from local Lighthouse for / and /about only (each run takes about 6 minutes); other pages have PSI scores without element detail. Single runs, no median of 3 (PSI SSL resets); simulated numbers vary widely. Physical-device and Safari review remain outstanding per the handoff.
