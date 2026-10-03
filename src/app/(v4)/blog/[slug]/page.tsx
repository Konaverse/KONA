import type { Metadata } from 'next'
import { Fragment, type ReactNode } from 'react'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import ArrowLink from '@/components/v4/ArrowLink'
import { BlogCard } from '@/components/v4/BlogCards'
import Invitation from '@/components/v4/Invitation'
import Reveal from '@/components/v4/Reveal'
import { AUTHORS, BLOG_POSTS, getPost, longDate, postsByDate, readMinutes, wordCount, type Block } from '@/lib/blog-posts'
import { getCaseStudy } from '@/lib/case-studies'
import { OG_DEFAULTS, SITE_URL } from '@/lib/site'

/**
 * /blog/[slug] — THE ARTICLE (2026-10-03; docs/blog-plan-2026.md §5).
 *
 * THE ORDER IS THE ORDER A READER AND A CRAWLER WANT: the breadcrumb, the
 * question as the h1, who wrote it and when, then THE ANSWER as the first
 * paragraph, and only then the depth: sections with a table wherever
 * the question is a cost or a comparison. The contents ride a rail at
 * the left on desktop and stand above the text on a phone.
 *
 * LINKS (the plan): exactly one link to the service page the piece feeds
 * (the card at the foot), the case studies it cites, and the rest of the
 * blog. The service page links back (services/[slug]/page.tsx).
 *
 * SCHEMA: BlogPosting with its author as the site's Person node (@id from
 * the root layout's graph), real dates, the image, the word count; and
 * the breadcrumb Home › Blog › title. Statically generated, every word in
 * the server HTML.
 */

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: AUTHORS[post.author].name, url: `${SITE_URL}/about` }],
    openGraph: {
      ...OG_DEFAULTS,
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [AUTHORS[post.author].name],
      images: [{ url: `${SITE_URL}${post.cover.src}`, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }],
    },
  }
}

/** the two inline marks a body string may carry: [label](/path), **strong** */
function rich(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>
    const strong = part.match(/^\*\*([^*]+)\*\*$/)
    if (strong) return <strong key={i}>{strong[1]}</strong>
    return <Fragment key={i}>{part}</Fragment>
  })
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <p>{rich(block.text)}</p>
    case 'h2':
      return (
        <h2 className="bl-h2" id={block.id}>
          {block.text}
        </h2>
      )
    case 'h3':
      return <h3 className="bl-h3">{block.text}</h3>
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className="bl-list">
          {block.items.map((it) => (
            <li key={it.slice(0, 40)}>{rich(it)}</li>
          ))}
        </Tag>
      )
    }
    case 'table':
      return (
        <figure className="bl-table">
          <div className="bl-table-in">
            <table>
              <caption>{block.caption}</caption>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{rich(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      )
    case 'stats':
      return (
        <ul className="bl-stats">
          {block.items.map((s) => (
            <li key={s.label}>
              <span className="bl-stat-v">{s.value}</span>
              <span className="bl-stat-l">{s.label}</span>
            </li>
          ))}
        </ul>
      )
    case 'note':
      return (
        <aside className="bl-note k-dark">
          <p className="bl-note-t">{block.title}</p>
          <p>{rich(block.text)}</p>
        </aside>
      )
  }
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/blog/${post.slug}`
  const author = AUTHORS[post.author]
  const contents = post.blocks.flatMap((b) => (b.kind === 'h2' ? [{ id: b.id, text: b.text }] : []))
  const studies = post.studies.map((s) => getCaseStudy(s)).filter((s): s is NonNullable<typeof s> => !!s)
  const others = postsByDate().filter((p) => p.slug !== post.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.published,
        dateModified: post.updated,
        inLanguage: 'en',
        wordCount: wordCount(post),
        articleSection: post.topic,
        image: {
          '@type': 'ImageObject',
          url: `${SITE_URL}${post.cover.src}`,
          width: post.cover.width,
          height: post.cover.height,
        },
        author: { '@id': `${SITE_URL}/${author.id}` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/blog#blog` },
        about: { '@id': `${SITE_URL}/services/${post.service.slug}#service` },
        ...(studies.length ? { mentions: studies.map((s) => ({ '@id': `${SITE_URL}/work/${s.slug}#article` })) } : {}),
      },
    ],
  }

  return (
    <main className="bl-art">
      <JsonLd data={jsonLd} />
      <article>
        <header className="k-page bl-art-head">
          <nav aria-label="Breadcrumb">
            <ol className="bl-crumbs">
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li aria-current="page">{post.topic}</li>
            </ol>
          </nav>
          <Reveal masked as="h1" className="bl-art-h1">
            <span>{post.title}</span>
          </Reveal>
          <Reveal as="div" index={1}>
            <ul className="bl-art-meta">
              <li>
                <b>
                  <a href="/about" rel="author">
                    {author.name}
                  </a>
                </b>
                {author.role}
              </li>
              <li>
                <b>
                  <time dateTime={post.published}>{longDate(post.published)}</time>
                </b>
                {post.updated !== post.published ? (
                  <>
                    Updated <time dateTime={post.updated}>{longDate(post.updated)}</time>
                  </>
                ) : (
                  'Published'
                )}
              </li>
              <li>
                <b>{readMinutes(post)} minutes</b>
                Reading time
              </li>
            </ul>
          </Reveal>
          <Reveal as="div" index={2}>
            <figure className="bl-art-cover">
              <img
                src={post.cover.src}
                alt={post.cover.alt}
                width={post.cover.width}
                height={post.cover.height}
                fetchPriority="high"
                decoding="async"
                draggable={false}
                style={post.cover.position ? { objectPosition: post.cover.position } : undefined}
              />
            </figure>
          </Reveal>
        </header>

        <div className="k-page bl-art-grid">
          <nav className="bl-toc" aria-label="In this article">
            <p className="bl-toc-k">In this article</p>
            <ol>
              {contents.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>{c.text}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="bl-body">
            {/* THE ANSWER: first, whole, liftable */}
            <p className="bl-answer">{post.answer}</p>
            {post.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}

            {/* the one service this piece feeds */}
            <aside className="bl-svc" aria-label="Related service">
              <p className="bl-svc-k">The service behind this article</p>
              <p className="bl-svc-t">{post.service.label}</p>
              <p className="bl-svc-p">{post.service.line}</p>
              <ArrowLink href={`/services/${post.service.slug}`}>See {post.service.label.toLowerCase()}</ArrowLink>
            </aside>

            {studies.length ? (
              <nav className="bl-cited" aria-label="Case studies in this article">
                <span className="bl-cited-k">Case studies in this article</span>
                {studies.map((s) => (
                  <ArrowLink key={s.slug} href={`/work/${s.slug}`}>
                    {s.name}
                  </ArrowLink>
                ))}
              </nav>
            ) : null}

            <footer className="bl-by">
              <p>
                Written by {author.name}, {author.role.charAt(0).toLowerCase() + author.role.slice(1)}. Published{' '}
                <time dateTime={post.published}>{longDate(post.published)}</time>. Every number in this article is from our own
                projects or price list; where we do not have a figure, we say so.
              </p>
            </footer>
          </div>
        </div>
      </article>

      {others.length ? (
        <section className="k-page bl-more" aria-labelledby="bl-more-h">
          <h2 className="bl-more-h" id="bl-more-h">
            More from the blog
          </h2>
          <div className="bl-hub-grid" style={{ paddingBottom: 0 }}>
            {others.slice(0, 2).map((p, i) => (
              <BlogCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </section>
      ) : null}

      <Invitation />
    </main>
  )
}
