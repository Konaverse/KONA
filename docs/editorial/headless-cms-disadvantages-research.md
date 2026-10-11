# Article 4: headless CMS disadvantages

Checked: 10 October 2026. Author: Konstantinos Kyprianou. [Draft](../blog-drafts/headless-cms-disadvantages.md).

## Purpose and editorial decisions

Owns operational costs, editorial boundaries, preview and publication behavior, maintenance, permissions, portability and platform selection. Article 2 explains the architecture and editing benefits. Article 3 owns rendering and SEO. No generic GEO section is appended to this article.

The supplied planner claims headless eliminates security leaks and plugin crashes forever. That claim is unsupported and technically false. The draft explains changes in responsibility and exposure without promising immunity. Enterprise size is not treated as sufficient justification.

The operating-responsibility table and hypothetical shared-content example are editorial analysis. They are not a measured client outcome or an externally validated framework. No project prices, vendor price amounts, performance results or rankings are invented.

## Primary evidence

| Source checked | Supports | Boundary |
| --- | --- | --- |
| [Strapi Preview](https://docs.strapi.io/cms/features/preview) | Frontend preview configuration, preview URL logic, distinct availability of basic and Live Preview | Preview support does not mean the website integration already exists. No universal paid-preview claim. |
| [Strapi deployment](https://docs.strapi.io/cms/deployment) | Self-hosted application requirements and Strapi Cloud option | Operations, recovery and maintenance recommendations are architectural judgment, not guaranteed vendor coverage. |
| [Sanity plans and payments](https://www.sanity.io/docs/platform-management/plans-and-payments) | Usage and commercial plan considerations | No prices or usage quotas reproduced. Recheck entitlements at selection. |
| [Sanity authentication and tokens](https://www.sanity.io/docs/content-lake/http-auth) | Published-content access differs from draft/write access; credentials and permissions matter | Public read access to intended published content is not described as a vulnerability. |
| [Sanity dataset export](https://www.sanity.io/docs/content-lake/exporting-data) | CLI can export documents and asset binaries; on-demand export differs from scheduled recovery backups | Export does not automatically port custom frontend queries or editor workflows. That is a stated architectural inference. |
| [Sanity Studio deployment](https://www.sanity.io/docs/studio/deployment) | Studio hosting and hosted Content Lake are distinct | Self-hosted Studio is not a self-hosted database. |
| [Contentful role API documentation](https://www.contentful.com/developers/docs/references/content-management-api/roles/) | Configurable allow-list permissions and roles | Feature availability needs plan-specific confirmation. Contentful pricing page failed direct opening; no pricing claims depend on it. |

## Publication notes

Metadata, one H1, author attribution and internal links are supplied. Confirm destination availability when publishing, including Article 2. Use the real publication date and existing author biography. No CMS upload or public release occurred. Konstantinos's voice standard applies; first-person judgments need normal author review before publication.
