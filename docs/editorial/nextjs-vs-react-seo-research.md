# Article 3: Next.js vs. React SEO research

Checked: 10 October 2026. Supports the [local article draft](../blog-drafts/nextjs-vs-react-seo.md) and the established [voice and search standard](konstantinos-voice-and-search.md).

## Scope and positioning

The next entry in the two-articles-per-week planner is Week 2, Tuesday. Konstantinos Kyprianou is the author. The draft covers rendering, page information and what a buyer can verify on a public service page. It is not a code tutorial or an audit of the current Konaverse website.

The planned “frameworks dictate your Google rankings” title and “React hides text from Google” hook are replaced with an accurate comparison. Next.js is built on React, React supports multiple rendering architectures, and Google can render JavaScript.

The recommendation favors Next.js for a public custom website that benefits from its integrated tools. It is an architectural judgment, not a measured ranking result or a claim that React itself is unsuitable for SEO.

## Primary sources and claim boundaries

| Source | Claim supported | Boundary carried into the draft |
| --- | --- | --- |
| [React: creating an app](https://react.dev/learn/creating-a-react-app) | React recommends frameworks, including Next.js; these support multiple rendering approaches | Compare implementation choices rather than treating the library and framework as mutually exclusive |
| [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Google renders JavaScript; some crawlers do not; rendering can be delayed | Server HTML reduces a dependency, without removing Google's rendering stage or guaranteeing indexing |
| [Next.js: static and dynamic rendering](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering) | Static output is prepared at build time or revalidation; dynamic output at request time | Explain update behavior and response time alongside the architecture |
| [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), updated 5 October 2026 | App Router defaults and the first-load HTML/hydration flow | A Client Component is not automatically absent from server-generated HTML |
| [Next.js: metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), updated 25 August 2026 | Metadata tools, file conventions and streaming behavior | Do not promise that every dynamically generated tag is present in the initial head for every user agent |
| [Google: crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors) | Missing pages returned as successes can be soft 404s | A working navigation transition alone does not validate a public route |
| [Google: crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) | Anchor links with destination addresses support discovery | Preserve actual links underneath custom visual navigation |
| [Google: page experience](https://developers.google.com/search/docs/appearance/page-experience) | Core Web Vitals contribute to ranking; scores do not guarantee top positions | No framework speed guarantee, fabricated benchmark or promised ranking lift |
| [Google: generative search optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | Search foundations and distinctive information support AI search eligibility | The framework does not confer authority or guarantee citation |
| [Google: URL Inspection](https://support.google.com/webmasters/answer/9012289) | Indexed-page information differs from live-test results | A successful live test does not establish indexing or future ranking |
| [Google: lazy-loaded content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading) | Content loading must not depend on crawler scrolling or clicking | Distinguish visual reveals from fetching otherwise unavailable essential text |

## Original editorial contribution

The service-page review is a proposed evaluation method for a buyer. Its five steps are not a reported client test. They connect a public address, its content, its metadata, Google's inspection output and a publishing update on the same page.

First-person statements express the author's proposed standards. No personal memory, client conversation, test result or ranking outcome has been invented. Konaverse's use of Next.js is established in the repository and preceding draft.

## Review and publication notes

The article remains a local draft. Set the actual publication date when publishing and use the existing author identity. If the short-answer panel carries the opening answer, include that answer once and start the body at the review scenario.

The headless CMS link assumes Article 2 is published first. Confirm both internal destinations before publication. Transfer the comparison as an article table in the CMS.

Check metadata and rendered content on the published article. No site code, performance work, CMS upload or deployment is part of this drafting task. No keyword volumes, ranking changes or citation gains were measured.
