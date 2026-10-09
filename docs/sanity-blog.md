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
backlinks through next-sanity Live Content. The sitemap refreshes on request after
a 60-second revalidation interval. Article metadata and BlogPosting structured data
come from the same CMS content. New slugs can render without a new deployment.
Drafts are visible only in authenticated preview.

The Next.js integration still needs its initial website deployment to be live.
Published-content queries use the public dataset and need no secret in the browser.
For draft preview, add `SANITY_API_READ_TOKEN` from the ignored KONA/.env.local
to the website hosting environment before that deployment. It is a Viewer token.
Optional public variables are listed in .env.example; their defaults are the
project and dataset above. Never commit the token.

The editor is deployed at https://studio-konaverse.sanity.studio. For future editor changes, run `npm run deploy` in studio-konaverse to update the existing Studio. A production Studio build previews https://kona-verse.com;
`SANITY_STUDIO_PREVIEW_ORIGIN` can override it. Studio deployments are required for
schema/editor changes, not for posting articles. The Studio folder is outside the
KONA repository and should be versioned separately.

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
