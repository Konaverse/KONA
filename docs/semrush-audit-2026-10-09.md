# Semrush content and HTML audit

Date: 9 October 2026.

## What the warnings mean

Semrush flags a text-to-HTML ratio of 10% or less and pages below its word-count threshold. These are audit heuristics, not Google ranking targets. Google explicitly says there is no minimum or maximum word count for ranking in its [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Improve the usefulness of the page, its crawlable content and actual performance. Do not pad articles, policies or contact pages to satisfy a ratio.

## Measurement method and limits

The environment could not download the live HTML. The figures below come from the existing production HTML files in `.next/server/app`, generated on 9 October 2026 at approximately 08:49 UTC. They are not a rerun of Semrush's 8 October live crawl.

The HTML was parsed with parse5. Text inside script, style, noscript, SVG and template elements was excluded. Main-content words were counted inside `main`, or `article` where the page uses that root. This measures source content, including content in carousel items; it does not claim that every word is visible simultaneously. Semrush's extraction may differ.

HTML sizes are uncompressed. React Server Component payload sizes include inline `self.__next_f.push` scripts. These scripts support reconciliation, hydration and navigation, as described in [Next.js's documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components). They must not be removed from the HTML as an SEO shortcut.

| Page | Main-content words | HTML, KiB | Inline RSC data, KiB |
| --- | ---: | ---: | ---: |
| Home | 661 | 85.3 | 40.3 |
| About | 508 | 73.0 | 36.5 |
| Blog index | 135 | 55.1 | 31.0 |
| Redesign article | 1,610 | 93.2 | 56.0 |
| Website cost article | 1,418 | 88.6 | 52.9 |
| Cookies | 692 | 61.1 | 35.7 |
| Privacy | 791 | 63.0 | 39.3 |
| Services hub | 168 | 49.1 | 29.2 |
| 3D websites | 1,105 | 115.3 | 40.1 |
| One-page websites | 1,009 | 113.3 | 39.3 |
| SEO | 975 | 113.2 | 39.4 |
| Web design | 1,228 | 119.2 | 41.3 |
| Web development | 1,257 | 119.2 | 41.5 |
| Website redesign | 1,068 | 115.1 | 39.9 |
| Terms | 828 | 60.3 | 37.3 |
| Work hub | 13 | 48.8 | 29.8 |
| Chris N Clean | 1,176 | 112.5 | 63.1 |
| City Arcade | 1,159 | 111.4 | 62.5 |
| Heimat Group | 1,341 | 116.8 | 65.9 |
| Los Santos Barbershop | 1,316 | 122.4 | 69.2 |
| Lumiere Eclat | 1,313 | 119.8 | 67.7 |
| TDK | 1,303 | 112.7 | 63.3 |
| Velricon | 1,297 | 120.8 | 68.4 |

Contact was not available as a saved HTML file, so no measurement is reported for it.

## Changes implemented locally

Both policy pages now link to https://ahrefs.com/legal/privacy-policy, verified against [Ahrefs' current privacy policy](https://ahrefs.com/legal/privacy-policy). Only the URLs changed.

The added work/services overview panels, blog introduction and article excerpts were removed at the user's request. All three pages now use their original layouts and content. The low-word-count warnings remain unresolved. The Ahrefs link corrections remain local and unpublished.

## HTML optimization findings

The long articles and case studies already have substantial source text. Their low ratio is not evidence that they lack content.

One concrete markup opportunity is `RunHero.tsx`: the decorative sunburst renders 132 animated SVG lines with per-line inline styles. Its SVG occupies approximately 20 KiB in each saved service page. Consider extracting the repeated styling into a shared stylesheet or another cacheable representation, preserving the individual ray animation, reduced-motion behavior and Safari rendering. This is an optimization candidate, not a completed change.

The inline style blocks themselves are small: approximately 0.2-1.2 KiB in the sampled pages. Moving those alone will not clear the warnings. The larger contributor is the framework payload. Review unnecessary client-boundary props and repeated markup where measurable savings are possible, but keep the animation drivers and initial content rendering intact.

Do not remove valid JSON-LD, heading markup, accessibility text, or Next.js rendering scripts to improve the ratio. Do not render the pages only in JavaScript to make the raw HTML smaller.

## Validation and publication checks

After removal, verify that work, services and blog return HTTP 200 without the added panels, introduction or excerpts, and that the two policy pages retain the corrected Ahrefs URL.

The full SEO gate cannot run against this dev server because sitemap.xml requires a Sanity request blocked by this environment and returns 500 locally. This is not evidence of a production sitemap problem.

After publication, verify both external links and rerun Semrush. Content warnings remain open; use Search Console and measured performance to assess actual indexing and site health.
