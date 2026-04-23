import type { Metadata } from 'next'
import TransitionLink from '@/components/layout/TransitionLink'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Information about how Konaverse uses cookies and tracking technologies.',
  alternates: { canonical: 'https://kona-verse.com/cookies' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'April 2025'

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-off-white)]">
      {/* Header */}
      <section className="container-padding pt-40 pb-20 border-b border-white/[0.06]">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-6 block">
          Legal
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-light mb-8 leading-[1.05]">
          Cookie Policy
        </h1>
        <p className="font-sans font-light text-white/40 text-sm">
          Last updated: {LAST_UPDATED}
        </p>
      </section>

      {/* Content */}
      <section className="container-padding py-20">
        <div className="max-w-3xl space-y-16">

          <div className="space-y-5">
            <p className="font-sans font-light text-white/60 leading-relaxed">
              This Cookie Policy explains how Konaverse (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar technologies to recognize you when you visit our website at <strong className="text-white/80 font-normal">kona-verse.com</strong>. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </div>

          <Section title="1. What are cookies?">
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
          </Section>

          <Section title="2. Why do we use cookies?">
            <p>
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as &ldquo;essential&rdquo; or &ldquo;strictly necessary&rdquo; cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Website.
            </p>
          </Section>

          <Section title="3. Cookies we use">
            <div className="space-y-8">
              <div>
                <h3 className="text-white/80 font-medium mb-4">A. Strictly Necessary Cookies</h3>
                <p className="mb-4">These cookies are essential to provide you with services available through our Website and to use some of its features, such as access to secure areas.</p>
                <div className="pl-5 border-l border-white/10 space-y-2 text-sm text-white/50">
                  <p><strong className="text-white/70">konaverse_cookie_consent:</strong> Stores your cookie consent preferences (1 year duration).</p>
                </div>
              </div>

              <div>
                <h3 className="text-white/80 font-medium mb-4">B. Performance and Analytics Cookies</h3>
                <p className="mb-4">These cookies are used to enhance the performance and functionality of our Website but are non-essential to its use. However, without these cookies, certain functionality may become unavailable.</p>
                <div className="pl-5 border-l border-white/10 space-y-4 text-sm text-white/50">
                  <div>
                    <p><strong className="text-white/70">Google Analytics (gtag.js):</strong> Used to understand how visitors interact with the website. It collects information anonymously and reports website trends without identifying individual visitors.</p>
                    <ul className="mt-2 space-y-1 list-none opacity-80">
                      <li>_ga: Distinguishes users (2 years)</li>
                      <li>_ga_*: Used to persist session state (2 years)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="4. How can I control cookies?">
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Banner that appears when you first visit our site.
            </p>
            <p className="mt-4">
              If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
            </p>
          </Section>

          <Section title="5. Google Consent Mode v2">
            <p>
              We implement Google Consent Mode v2, which adjusts how Google tags behave based on your consent status. If you decline analytics cookies, Google Analytics will not store cookies but will still send &ldquo;pings&rdquo; for basic measurement to allow us to understand site traffic without identifying you.
            </p>
          </Section>

          <Section title="6. Changes to this policy">
            <p>
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </Section>

          <Section title="7. More information">
            <p>
              If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:info@kona-verse.com" className="text-[var(--color-sage)] hover:underline">info@kona-verse.com</a>.
            </p>
          </Section>

          <div className="pt-10 border-t border-white/[0.06] flex flex-col md:flex-row gap-6">
            <TransitionLink href="/privacy" className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] hover:text-white transition-colors duration-300">
              ← Read Privacy Policy
            </TransitionLink>
            <TransitionLink href="/terms" className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] hover:text-white transition-colors duration-300">
              Read Terms of Use →
            </TransitionLink>
          </div>

        </div>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl md:text-3xl font-light">{title}</h2>
      <div className="font-sans font-light text-white/60 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  )
}
