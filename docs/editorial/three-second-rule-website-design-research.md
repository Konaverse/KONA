# Article 9: the three-second website rule

Checked: 10 October 2026. Author: Konstantinos Kyprianou. [Draft](../blog-drafts/three-second-rule-website-design.md).

## Correcting the planned claim

The planner says more than 40% of high-value visitors leave after three seconds and that the studio's stack beats the rule. No evidence establishes either claim. The article treats three seconds as a heuristic and supplies actual metric definitions and review recommendations.

The [February 2017 Google benchmark PDF](https://www.thinkwithgoogle.com/_qs/documents/57/mobile-page-speed-new-industry-benchmarks.pdf) was opened, including its sources on PDF page 11. It cites a 53% mobile abandonment figure whose footnote refers to aggregated benchmark-sharing Google Analytics data from March 2016 (n=3,700). The article reports its historical context and does not generalize it to current luxury prospects. The PDF's separate January 2017 analysis of 900,000 landing pages is not confused with the abandonment source.

No conversion gain, revenue loss, current bounce rate or Konaverse performance score is claimed. The two-business example is hypothetical. This is editorial work; the site's performance work remains on hold.

## Current primary guidance

| Source | Supports and boundary |
| --- | --- |
| [Web Vitals](https://web.dev/articles/vitals) | Good LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, at the 75th percentile with mobile/desktop separated. Metric meanings differ. |
| [PageSpeed Insights documentation](https://developers.google.com/speed/docs/insights/v5/about) | Field vs lab distinction, trailing 28-day CrUX reporting, page/origin granularity and insufficient-data behavior. No-data is not a passing performance result. |
| [Optimize LCP](https://web.dev/articles/optimize-lcp) | Resource discovery, priority, main-image lazy-loading risks and field/lab distinctions. No single compression fix is promised to solve every LCP problem. |
| [Google page experience](https://developers.google.com/search/docs/appearance/page-experience) | Core Web Vitals inform ranking systems; good scores do not guarantee top positions. |

The draft uses the normal all-three-metrics target; it does not attempt to reproduce every PageSpeed Insights insufficient-INP assessment exception. It does not describe LCP as complete page load, CLS as a duration, or Lighthouse's performance score as a ranking score.

Clarity, booking readiness, cold/warm separation and representative-page recommendations are author analysis. They are not attributed to the 2017 study as psychological or conversion findings. Physical-device checks are recommended without claiming this task ran them.

## Scope and publication

Owns first impressions, interpretation of the three-second shorthand and how a buyer should assess speed evidence. Article 10 will own conversion-rate evidence; Article 21 will own implementation details; Article 22 will own performance and SEO in depth. None is drafted here.

Metadata, author and a relevant internal framework link are supplied. Confirm the destination and use the actual publication date. No website code, profile, production build or deployed content was changed.
