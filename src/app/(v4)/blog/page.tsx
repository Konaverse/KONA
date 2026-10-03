import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { BlogGrid } from '@/components/v4/BlogCards'
import Invitation from '@/components/v4/Invitation'
import Reveal from '@/components/v4/Reveal'
import { AUTHORS, postsByDate } from '@/lib/blog-posts'
import { OG_DEFAULTS, SITE_URL } from '@/lib/site'

/**
 * /blog — THE INDEX (2026-10-03; the plan is docs/blog-plan-2026.md).
 *
 * A small library of buyer documents, not a feed: the head says what the
 * pieces are, then every piece as a card, newest first. Server-rendered;
 * the cards are the only links a crawler needs to reach every article.
 *
 * SCHEMA: a Blog node listing its posts (each a BlogPosting by @id, fully
 * described on its own page) and the breadcrumb. No FAQ, no ItemList
 * carousel markup: neither is eligible for a studio's blog (SEO plan §3).
 */

const URL = `${SITE_URL}/blog`
const TITLE = 'Blog: Web Design, Development and SEO in Cyprus'
const DESCRIPTION =
  'What websites cost, how redesigns keep their rankings and how we build: articles from Konaverse, a web studio in Cyprus, written from our own projects and numbers.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { ...OG_DEFAULTS, title: `${TITLE} | Konaverse`, description: DESCRIPTION, url: URL, type: 'website' },
}

export default function BlogIndex() {
  const posts = postsByDate()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: URL },
        ],
      },
      {
        '@type': 'Blog',
        '@id': `${URL}#blog`,
        name: 'The Konaverse blog',
        description: DESCRIPTION,
        url: URL,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          '@id': `${URL}/${p.slug}#article`,
          headline: p.title,
          url: `${URL}/${p.slug}`,
          datePublished: p.published,
          dateModified: p.updated,
          author: { '@id': `${SITE_URL}/${AUTHORS[p.author].id}` },
        })),
      },
    ],
  }

  return (
    <main className="bl-hub">
      <JsonLd data={jsonLd} />
      <header className="k-page bl-hub-head">
        {/* not masked: a mask crops the "g" */}
        <Reveal as="h1" className="bl-hub-h1">
          <span>
            Blog{' '}
            <span className="bl-hub-mod">
              Web design, development and SEO, answered with our own prices, projects and numbers.
            </span>
          </span>
        </Reveal>
      </header>
      <div className="k-page bl-hub-list">
        <BlogGrid posts={posts} level="h2" />
      </div>
      <Invitation />
    </main>
  )
}
