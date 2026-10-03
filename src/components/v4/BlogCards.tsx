import ArrowLink from '@/components/v4/ArrowLink'
import Reveal from '@/components/v4/Reveal'
import { longDate, readMinutes, type BlogPost } from '@/lib/blog-posts'
import './blog.css'

/**
 * THE BLOG'S CARDS (2026-10-03) — one card, two settings.
 *
 *   BlogCard   A PICTURE CARD, the owner's reference frame ("this is how I
 *              want the cards on both the blog index and the homepage blog
 *              section. I want the details inside the picture"): the plate
 *              fills a tall card, and the date, the reading time and the
 *              title stand INSIDE it at the foot, in paper, over a scrim.
 *              The whole card is one link whose text is the title (the
 *              picture is decoration: alt "").
 *   BlogRow    the homepage's section under the work (owner: "a nice
 *              horizontally cards aligned section"): the head in the first
 *              column, the cards in ONE ROW beside it. Two fill the row;
 *              from the third on it scrolls sideways and snaps.
 *
 * Server components: every word is in the HTML. The entrance is the house
 * reveal, NOT masked: a mask crops the descenders of a large light
 * heading (the "g" of "blog" was cut). Hover (a pointer that can hover
 * only) closes in on the picture and steps the arrow.
 */

export function BlogCard({ post, index = 0, level = 'h3' }: { post: BlogPost; index?: number; level?: 'h2' | 'h3' }) {
  const Title = level
  return (
    <Reveal as="div" className="bl-card" index={index}>
      <a className="bl-card-a" href={`/blog/${post.slug}`}>
        <img
          className="bl-card-pic"
          src={post.cover.src}
          alt=""
          width={post.cover.width}
          height={post.cover.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={post.cover.position ? { objectPosition: post.cover.position } : undefined}
        />
        <span className="bl-card-top">{post.topic}</span>
        <span className="bl-card-in">
          <span className="bl-card-meta">
            <time dateTime={post.published}>{longDate(post.published)}</time>
            <span>{readMinutes(post)} min read</span>
          </span>
          <Title className="bl-card-t">{post.title}</Title>
        </span>
        <svg className="bl-card-go" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M4.5 11.5 L11.5 4.5" />
          <path d="M6 4.5 L11.5 4.5 L11.5 10" />
        </svg>
      </a>
    </Reveal>
  )
}

/** the cards as a grid: the index, and an article's "more" */
export function BlogGrid({ posts, level = 'h3' }: { posts: BlogPost[]; level?: 'h2' | 'h3' }) {
  return (
    <div className="bl-grid" data-count={posts.length}>
      {posts.map((p, i) => (
        <BlogCard key={p.slug} post={p} index={i} level={level} />
      ))}
    </div>
  )
}

export function BlogRow({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null
  return (
    <section className="bl-row" aria-labelledby="bl-row-h">
      <div className="bl-row-in">
        <div className="bl-row-head">
          <Reveal as="h2" className="bl-row-h">
            <span id="bl-row-h">From the blog</span>
          </Reveal>
          <Reveal as="div" className="bl-row-side" index={1}>
            <p className="bl-row-p">What websites cost and how we build them, answered with our own numbers.</p>
            <ArrowLink href="/blog">All articles</ArrowLink>
          </Reveal>
        </div>
        {/* the row scrolls sideways on its own; the page's scroll is not its business */}
        <div className="bl-track" data-count={posts.length}>
          {posts.map((p, i) => (
            <BlogCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
