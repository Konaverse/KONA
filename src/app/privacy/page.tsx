import type { Metadata } from 'next'
import TransitionLink from '@/components/layout/TransitionLink'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Konaverse collects, uses, and protects your personal data in accordance with GDPR.',
  alternates: { canonical: 'https://kona-verse.com/privacy' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'April 2025'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-off-white)]">
      {/* Header */}
      <section className="container-padding pt-40 pb-20 border-b border-white/[0.06]">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-6 block">
          Legal
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-light mb-8 leading-[1.05]">
          Privacy Policy
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
              Konaverse (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a creative studio based in Cyprus. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit <strong className="text-white/80 font-normal">kona-verse.com</strong> or contact us about our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.
            </p>
            <p className="font-sans font-light text-white/60 leading-relaxed">
              We are committed to protecting your privacy in accordance with the <strong className="text-white/80 font-normal">General Data Protection Regulation (GDPR)</strong> and the laws of the Republic of Cyprus.
            </p>
          </div>

          <Section title="1. Data Controller">
            <p>
              The data controller responsible for your personal data is:
            </p>
            <div className="mt-4 pl-5 border-l border-white/10 space-y-1 font-mono text-[13px] text-white/50">
              <p>Konaverse</p>
              <p>Cyprus</p>
              <p>info@kona-verse.com</p>
            </div>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information you voluntarily provide when you:</p>
            <ul className="mt-4 space-y-2 list-none">
              <Li>Fill out our contact form (name, email address, project description, budget range, and selected service)</Li>
              <Li>Send us an email directly</Li>
            </ul>
            <p className="mt-4">
              We do not collect any data automatically beyond standard server logs (IP address, browser type, referring URL) which are retained for security purposes and automatically deleted after 30 days. We do not use tracking cookies, advertising pixels, or third-party analytics.
            </p>
          </Section>

          <Section title="3. Legal Basis for Processing">
            <p>We process your personal data under the following legal bases:</p>
            <ul className="mt-4 space-y-3 list-none">
              <Li><strong className="text-white/80 font-normal">Contractual necessity</strong> — to respond to your inquiry and provide the services you request.</Li>
              <Li><strong className="text-white/80 font-normal">Legitimate interests</strong> — to manage our business relationship and improve our services.</Li>
              <Li><strong className="text-white/80 font-normal">Consent</strong> — where you have explicitly provided it (e.g. subscribing to updates).</Li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Information">
            <ul className="space-y-2 list-none">
              <Li>To respond to your inquiry within 24 hours</Li>
              <Li>To prepare and deliver a tailored project proposal</Li>
              <Li>To fulfil a contract for our services</Li>
              <Li>To communicate project updates and milestones</Li>
              <Li>To comply with legal obligations</Li>
            </ul>
            <p className="mt-4">
              We will never sell, rent, or share your personal data with third parties for marketing purposes.
            </p>
          </Section>

          <Section title="5. Third-Party Services">
            <p>We use the following third-party services to operate our business:</p>
            <ul className="mt-4 space-y-3 list-none">
              <Li><strong className="text-white/80 font-normal">Resend</strong> — to process and deliver contact form submissions. Your name and email are transmitted to Resend's servers solely for delivery purposes. Resend is GDPR-compliant. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-sage)] hover:underline">Resend Privacy Policy →</a></Li>
              <Li><strong className="text-white/80 font-normal">Cloudinary</strong> — to host and deliver media assets on our website. No personal data is shared with Cloudinary.</Li>
              <Li><strong className="text-white/80 font-normal">Vercel</strong> — to host our website. Standard server logs may be processed by Vercel. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-sage)] hover:underline">Vercel Privacy Policy →</a></Li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain contact form inquiries and associated correspondence for <strong className="text-white/80 font-normal">3 years</strong> from the date of last contact. If a project engagement begins, we retain project-related data for <strong className="text-white/80 font-normal">7 years</strong> to comply with legal and accounting obligations. You may request deletion at any time (see Section 7).
            </p>
          </Section>

          <Section title="7. Your Rights Under GDPR">
            <p>If you are located in the European Economic Area, you have the following rights:</p>
            <ul className="mt-4 space-y-3 list-none">
              <Li><strong className="text-white/80 font-normal">Right of access</strong> — request a copy of the personal data we hold about you.</Li>
              <Li><strong className="text-white/80 font-normal">Right to rectification</strong> — request correction of inaccurate or incomplete data.</Li>
              <Li><strong className="text-white/80 font-normal">Right to erasure</strong> — request deletion of your personal data where there is no compelling reason for continued processing.</Li>
              <Li><strong className="text-white/80 font-normal">Right to restriction</strong> — request that we restrict the processing of your data.</Li>
              <Li><strong className="text-white/80 font-normal">Right to data portability</strong> — request your data in a structured, machine-readable format.</Li>
              <Li><strong className="text-white/80 font-normal">Right to object</strong> — object to processing based on legitimate interests.</Li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email us at <a href="mailto:info@kona-verse.com" className="text-[var(--color-sage)] hover:underline">info@kona-verse.com</a>. We will respond within <strong className="text-white/80 font-normal">30 days</strong>.
            </p>
            <p className="mt-4">
              You also have the right to lodge a complaint with the <strong className="text-white/80 font-normal">Office of the Commissioner for Personal Data Protection</strong> (Cyprus supervisory authority): <a href="https://www.dataprotection.gov.cy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-sage)] hover:underline">dataprotection.gov.cy</a>.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              Our website does not use cookies beyond technically necessary session cookies required for the site to function. We do not use advertising cookies, analytics cookies, or any cross-site tracking. No consent banner is required.
            </p>
          </Section>

          <Section title="9. Data Security">
            <p>
              We use industry-standard security measures including HTTPS encryption, secure API key management, and restricted data access. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page will reflect any changes. We encourage you to review this policy periodically.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For any privacy-related questions or requests, contact us at:
            </p>
            <div className="mt-4 pl-5 border-l border-white/10 space-y-1 font-mono text-[13px] text-white/50">
              <p>Konaverse</p>
              <p>Cyprus</p>
              <p><a href="mailto:info@kona-verse.com" className="text-[var(--color-sage)] hover:underline">info@kona-verse.com</a></p>
            </div>
          </Section>

          <div className="pt-10 border-t border-white/[0.06]">
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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-sage)]/60 shrink-0" />
      <span>{children}</span>
    </li>
  )
}
