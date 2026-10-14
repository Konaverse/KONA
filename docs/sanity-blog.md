# Sanity blog

Project: Konaverse (`fixu3ozk`), organization `o99aykoro`, dataset `production`.
The standalone Studio is in `../studio-konaverse`. Its schema is the source of truth.
The website uses `src/sanity/` and keeps the existing blog design and author identities.

Hosted editor: https://studio-konaverse.sanity.studio (sign in with info@kona-verse.com).

## Local editing

Run `npm run dev` in each folder, in separate terminals:

- KONA: http://localhost:3000
- studio-konaverse: http://localhost:3333

Sign into the Studio with info@kona-verse.com. Choose Blog post to write an article.
Use the Presentation tab to preview drafts in the blog. A valid slug, author, cover
image with alternative text, SEO fields, opening answer and related service are
required before publication. Keep existing slugs unchanged.
Set Last meaningful edit when the article content changes.

The body editor supports paragraphs, headings, links, bold text, lists, tables,
statistics, callouts and images. Heading keys remain stable when headings are edited.
Author records connect to the existing website biographies and Person structured data.
Related services and case studies select existing website routes; these pages
continue to be managed by the website code.

## Publishing and hosting

Published posts feed /blog, /blog/[slug], homepage cards, related articles and service
backlinks from Sanity. Published queries use a shared Next.js cache tag and a
60-second revalidation interval, fetching from Sanity's origin API. Live Content
events immediately expire that cache before refreshing connected browsers. If an
event is missed (or nobody is visiting when a post is published), the next request
after the interval triggers a background refresh; a subsequent request receives
the updated content. Draft previews still use next-sanity Live Content directly.
The sitemap also refreshes on request after a 60-second revalidation interval.
Article metadata and BlogPosting structured data
come from the same CMS content. New slugs can render without a new deployment.
Drafts are visible only in authenticated preview.

Published-content queries use the public dataset and need no secret in the browser.
For draft preview, add `SANITY_API_READ_TOKEN` from the ignored KONA/.env.local
to the website hosting environment. It is a Viewer token.
Optional public variables are listed in .env.example; their defaults are the
project and dataset above. Never commit the token.

The editor is deployed at https://studio-konaverse.sanity.studio. For future editor changes, run `npm run deploy` in studio-konaverse to update the existing Studio. A production Studio build previews https://kona-verse.com;
`SANITY_STUDIO_PREVIEW_ORIGIN` can override it. Studio deployments are required for
schema/editor changes, not for posting articles. The Studio folder is outside the
KONA repository and should be versioned separately.

If localhost logs `[sanity] Network unavailable; using local blog posts for
development.`, it is displaying the original import source, including its covers.
CMS edits cannot appear there until the local server can reach Sanity. This
network fallback is development-only; production failures surface normally.

## Schema and query changes

After changing the Studio schema or website GROQ queries:

```powershell
cd ../studio-konaverse
npm run typegen
npx sanity schemas deploy
```

TypeGen scans ../KONA/src/sanity and writes src/sanity/sanity.types.ts in KONA.
Commit that generated file with app changes. ESLint ignores the generated file.

## Existing articles

Both original articles and their covers were imported into production, preserving
slugs, publication/update dates, authors, links, tables, statistics, callouts and
existing section anchors. src/lib/blog-posts.ts retains the original import source
and shared rendering helpers; website routes read content from Sanity.

The import is repeatable and skips matching slugs, including existing drafts.
It never overwrites edited CMS content or supplies custom document IDs:

```powershell
cd ../studio-konaverse
npm run import-blog
npm run import-blog -- -- --execute
```

The first command is a dry run. The second imports only missing original posts
using the currently authenticated Sanity CLI account.

## New articles from Markdown drafts

A finished draft in `docs/blog-drafts/` goes into the CMS as an unpublished draft
with the Studio script added on 14 October 2026:

```powershell
cd ../studio-konaverse
npm run import-draft -- -- ../KONA/docs/blog-drafts/<file>.md
npm run import-draft -- -- ../KONA/docs/blog-drafts/<file>.md --execute
```

The first command is a dry run that prints the title, author, service, block
counts, opening answer and metadata lengths. The second creates `drafts.post-<slug>`
and never publishes. A slug that already exists, published or draft, is left
unchanged. The script reads the frontmatter keys `slug`, `meta_title`,
`meta_description`, `excerpt`, `topic`, `author_key`, `service_slug` and the
optional `publish_date`, `service_label`, `service_line`, `studies` and `answer`
(default: the first paragraph after the byline). H2 keys are the heading slugs,
so section anchors are stable. Pipe tables become table blocks captioned by a
`Table: ...` line directly above them, or by the nearest H2. Italics and inline
code are flattened because the schema has no decorator for them.

In the Studio the editor adds the cover (required, so Publish stays blocked
until it is there), checks the dates and the table captions, reads the preview
and presses Publish. Publishing remains a person's decision.
