import type { Metadata } from 'next'
import Reveal from '@/components/v4/Reveal'
import ContactForm from '@/components/v4/ContactForm'
import CalendlyInline from '@/components/v4/CalendlyInline'
import { CALENDLY_URL, CONTACT_EMAIL, SITE_URL } from '@/lib/site'
import './contact.css'

/**
 * THE CONTACT PAGE — /contact (2026-09-12, the user: "simple; a nice
 * contact with FAQs in one viewport; the Calendly modal opened as a
 * section; clean design; no scrollytelling; no CTA — the page is the
 * CTA"). Decided with the user the same day: THE SPLIT, a short form,
 * the first section on paper and the questions dark.
 *
 * §1 THE SPLIT — on paper. Left: the line, the email set large as real
 *    text, the three prompts a first email should answer, then the form
 *    (name, email, message). Right: the calendar, inline, wide and
 *    short — the user's embed URL plus hide_event_type_details, so the
 *    pane is the date picker alone (user, 2026-09-12: "more wide and
 *    less tall"). Under both: the facts on one hairline.
 * §2 THE QUESTIONS — one viewport. A dark card set into the paper (the
 *    object flips polarity, the page does not — the seam is the card's
 *    edge): the heading and a line at the left, eight questions as
 *    native <details> rows at the right, an exclusive accordion by
 *    `name`, animated where the browser can (::details-content).
 *
 * SERVER-RENDERED, every answer in the raw HTML; the form posts without
 * JS; the calendar has a plain link without JS. The page carries the
 * ProfessionalService node with the country (no street address exists
 * on the site yet) and the FAQPage node — the one page that should.
 *
 * HOURS AND THE REPLY PROMISE ARE FIRST DRAFTS (no such facts existed
 * anywhere on the site) — the user confirms them.
 *
 * NOT INDEXED YET — KONA_OPEN_ROUTES has /contact locally. Flip
 * INDEXABLE, drop the launch redirect and list it in sitemap.ts in the
 * same commit.
 */
const INDEXABLE = false

const TITLE = 'Contact'
const DESCRIPTION =
  'Write to Konaverse or book a thirty-minute call. A web design and development studio in Cyprus, working with clients worldwide. Replies within one working day.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: true },
  openGraph: { title: `${TITLE} | Konaverse`, description: DESCRIPTION, url: `${SITE_URL}/contact`, type: 'website' },
}

/** what a useful first email says */
const PROMPTS = ['What the site is for, and who it is for', 'A date you have in mind', 'A budget range, even a rough one']

/** the facts on the hairline — hours and the reply promise are FIRST DRAFTS */
const FACTS = [
  { label: 'Where', value: 'Cyprus, working worldwide' },
  { label: 'Hours', value: 'Monday to Friday, 9 to 18 EET' },
  { label: 'Replies', value: 'Within one working day' },
  { label: 'Languages', value: 'English, Greek' },
]

/** the questions — answers use the numbers the service pages publish */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'How much does a website cost?',
    a: 'A one-page site starts at €1,000. A full site, design or development, starts at €2,000. A 3D website starts at €4,000. What moves the number is the amount of content, the number of pages, and how much of the site is custom motion or 3D. Every service page carries its starting price.',
  },
  {
    q: 'How long does it take?',
    a: 'A one-page site goes live in two to three weeks. A full site takes four to eight weeks from the first call. A 3D website takes eight to twelve. The schedule is set on the first call and the dates are in the proposal.',
  },
  {
    q: 'What do you need from us to start?',
    a: 'A conversation about what the site is for, whatever content you already have, a date, and a budget range. We write the proposal from that. You do not need a brief document, a logo file or finished copy to start talking.',
  },
  {
    q: 'Do you work with clients outside Cyprus?',
    a: 'Yes. We are based in Cyprus and work remotely with clients across Europe and beyond, in English and Greek. Calls are on video; the work is delivered online.',
  },
  {
    q: 'Who owns the site when it is done?',
    a: 'You do. The domain, the hosting account and the source code are set up in your name and handed over at launch, with the credentials. Nothing is held.',
  },
  {
    q: 'Do you redesign existing websites?',
    a: 'Yes. A redesign starts at €1,500 and begins with an audit of the site you have, so we keep what works and rebuild what does not. It takes four to eight weeks.',
  },
  {
    q: 'What happens after launch?',
    a: 'Hosting is set up in your name and the site is handed over. If you want ongoing work, SEO is available from €500 a month, and we are one email away for changes.',
  },
  {
    q: 'Can we talk before deciding anything?',
    a: 'That is what the calendar is for. Thirty minutes on video, no preparation needed, and no obligation. If email suits you better, the form works the same way.',
  },
]

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const sp = await searchParams
  const initial = sp.sent ? 'sent' : sp.error ? 'error' : 'idle'
  const initialError = sp.error === 'fields' ? 'Please give a name, a working email and a message.' : sp.error ? 'The message could not be sent.' : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': `${SITE_URL}/contact#page`,
        url: `${SITE_URL}/contact`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/contact#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <main className="ct">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* §1 — THE SPLIT */}
      <header className="ct-hero">
        <div className="ct-write">
          <Reveal masked as="h1" className="ct-h1">
            Write to us, or pick a time.
          </Reveal>
          <Reveal className="ct-mail-wrap" index={1}>
            <a className="ct-mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </Reveal>
          <Reveal className="ct-prompts" index={2}>
            <p className="ct-prompts-l">A useful first email says</p>
            <ul>
              {PROMPTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={3}>
            <ContactForm initial={initial} initialError={initialError} />
          </Reveal>
        </div>

        <Reveal className="ct-book" index={2}>
          <div className="ct-cal">
            <CalendlyInline />
          </div>
          <p className="ct-cal-note t-small">
            Pick a slot and it lands in both calendars. Or open it on{' '}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Calendly</a>.
          </p>
        </Reveal>

        <ul className="ct-facts" aria-label="At a glance">
          {FACTS.map((f, i) => (
            <li key={f.label}>
              <Reveal className="ct-fact" index={Math.min(i, 3)}>
                <span className="ct-fact-l">{f.label}</span>
                <span className="ct-fact-v">{f.value}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </header>

      {/* §2 — THE QUESTIONS */}
      <section className="ct-faq-sec" aria-labelledby="ct-faq-h">
        <div className="ct-faq k-dark">
          <div className="ct-faq-l">
            <Reveal masked as="h2" className="ct-faq-h">
              <span id="ct-faq-h">Questions, answered</span>
            </Reveal>
            <Reveal as="p" className="ct-faq-p" index={1}>
              The eight we get asked before a first call. If yours is not here, it belongs in the form.
            </Reveal>
          </div>
          <Reveal className="ct-faq-list-wrap" index={1}>
            <div className="ct-faq-list">
              {FAQ.map((f, i) => (
                <details key={f.q} className="ct-q" name="ct-faq" open={i === 0}>
                  <summary>
                    <span className="ct-q-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ct-q-t">{f.q}</span>
                    <span className="ct-q-i" aria-hidden="true" />
                  </summary>
                  <div className="ct-a">
                    <p>{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
