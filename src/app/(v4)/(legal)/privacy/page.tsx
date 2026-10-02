import type { Metadata } from 'next'
import {
  LegalPage,
  LegalIntro,
  LegalSection,
  LegalList,
  LegalCard,
  LegalExt,
} from '@/components/v4/Legal'
import { CONTACT_EMAIL, OG_DEFAULTS, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Konaverse collects, uses and protects your personal data, in accordance with the GDPR and the laws of the Republic of Cyprus.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { ...OG_DEFAULTS, type: 'website', title: 'Privacy Policy | Konaverse', url: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
}

/**
 * Rewritten for the one-page site (2026-08-28): the contact form is gone
 * (leads arrive by email and Calendly), analytics are Google Analytics
 * behind consent plus Ahrefs (cookieless), and Resend/Cloudinary no longer
 * touch a visitor. Everything else carries over from the April 2025 text.
 *
 * 2026-09-12: the contact form is BACK on /contact (site-architecture
 * §5a), delivered by Resend — §2 lists the form, §5 names Resend again.
 */
const UPDATED = 'September 2026'

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      next={[
        { href: '/terms', label: 'Terms of Use' },
        { href: '/cookies', label: 'Cookie Policy' },
      ]}
    >
      <LegalIntro>
        <p>
          Konaverse (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a web studio
          based in Cyprus. This policy explains what personal data we collect when you visit{' '}
          <strong>kona-verse.com</strong> or get in touch about a project, why we collect it, and
          what your rights are. If you disagree with any of it, please do not use the site.
        </p>
        <p>
          We handle personal data in accordance with the{' '}
          <strong>General Data Protection Regulation (GDPR)</strong> and the laws of the Republic
          of Cyprus.
        </p>
      </LegalIntro>

      <LegalSection title="1. Data controller">
        <p>The data controller responsible for your personal data is:</p>
        <LegalCard>
          <p>Konaverse</p>
          <p>Cyprus</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </LegalCard>
      </LegalSection>

      <LegalSection title="2. What we collect">
        <p>Information you give us, when you:</p>
        <LegalList>
          <li>Email us — your name, your email address and whatever you write.</li>
          <li>
            Use the form on our contact page — your name, your email address and your message,
            delivered to us as an email.
          </li>
          <li>
            Book a call through Calendly — your name, your email address and any notes you add to
            the booking.
          </li>
        </LegalList>
        <p>Information collected automatically:</p>
        <LegalList>
          <li>
            <strong>Server logs</strong> (IP address, browser type, referring URL), kept by our
            hosting provider for security and deleted automatically after 30 days.
          </li>
          <li>
            <strong>Analytics</strong> — Google Analytics, only after you accept it in the cookie
            banner, and Ahrefs Web Analytics, which is cookieless and stores no personal data. The
            details are in our <a href="/cookies">Cookie Policy</a>.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Legal basis for processing">
        <p>We process personal data on the following bases:</p>
        <LegalList>
          <li>
            <strong>Contractual necessity</strong> — to answer your enquiry and provide the services
            you ask for.
          </li>
          <li>
            <strong>Legitimate interests</strong> — to run our business relationship and to
            understand how the site is used, so we can improve it.
          </li>
          <li>
            <strong>Consent</strong> — where you have given it explicitly, such as accepting
            analytics cookies.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. How we use it">
        <LegalList>
          <li>To reply to your enquiry</li>
          <li>To prepare and deliver a proposal for your project</li>
          <li>To fulfil a contract for our services</li>
          <li>To communicate project updates and milestones</li>
          <li>To meet our legal obligations</li>
        </LegalList>
        <p>We never sell, rent or share your personal data with third parties for marketing.</p>
      </LegalSection>

      <LegalSection title="5. Third-party services">
        <p>We rely on the following services to run the site and the studio:</p>
        <LegalList>
          <li>
            <strong>Vercel</strong> — hosts the website. Standard server logs may be processed by
            Vercel.{' '}
            <LegalExt href="https://vercel.com/legal/privacy-policy">Vercel privacy policy</LegalExt>
          </li>
          <li>
            <strong>Resend</strong> — delivers the messages sent through our contact form to our
            inbox. Your name, email address and message pass through Resend to reach us.{' '}
            <LegalExt href="https://resend.com/legal/privacy-policy">Resend privacy policy</LegalExt>
          </li>
          <li>
            <strong>Calendly</strong> — handles call bookings. The details you enter when booking
            are processed by Calendly.{' '}
            <LegalExt href="https://calendly.com/legal/privacy-notice">
              Calendly privacy notice
            </LegalExt>
          </li>
          <li>
            <strong>Google Analytics</strong> — measures how the site is used, only with your
            consent.{' '}
            <LegalExt href="https://policies.google.com/privacy">Google privacy policy</LegalExt>
          </li>
          <li>
            <strong>Ahrefs Web Analytics</strong> — aggregate, cookieless traffic measurement.{' '}
            <LegalExt href="https://ahrefs.com/privacy">Ahrefs privacy policy</LegalExt>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <p>
          We keep enquiries and the correspondence around them for <strong>3 years</strong> from
          the last contact. If a project goes ahead, we keep project-related data for{' '}
          <strong>7 years</strong> to meet legal and accounting obligations. You can ask us to
          delete your data at any time (see section 7).
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights under the GDPR">
        <p>If you are in the European Economic Area, you have the right to:</p>
        <LegalList>
          <li>
            <strong>Access</strong> — ask for a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Rectification</strong> — have inaccurate or incomplete data corrected.
          </li>
          <li>
            <strong>Erasure</strong> — have your data deleted where there is no compelling reason
            to keep processing it.
          </li>
          <li>
            <strong>Restriction</strong> — ask us to limit how we process your data.
          </li>
          <li>
            <strong>Portability</strong> — receive your data in a structured, machine-readable
            format.
          </li>
          <li>
            <strong>Objection</strong> — object to processing based on legitimate interests.
          </li>
          <li>
            <strong>Withdraw consent</strong> — at any time, as easily as you gave it. For
            analytics cookies, use the control on the <a href="/cookies">Cookie Policy</a> page.
          </li>
        </LegalList>
        <p>
          To exercise any of these, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          We reply within <strong>30 days</strong>.
        </p>
        <p>
          You can also lodge a complaint with the{' '}
          <strong>Office of the Commissioner for Personal Data Protection</strong>, the Cyprus
          supervisory authority:{' '}
          <LegalExt href="https://www.dataprotection.gov.cy">dataprotection.gov.cy</LegalExt>
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          The site sets analytics cookies only after you accept them in the banner shown on your
          first visit. What they are, how long they last and how to change your choice is in the{' '}
          <a href="/cookies">Cookie Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          We use industry-standard measures — HTTPS everywhere, secured credentials, restricted
          access to data. No method of transmission over the internet is completely secure, so we
          cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the
          top reflects the current version.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>For anything privacy-related:</p>
        <LegalCard>
          <p>Konaverse</p>
          <p>Cyprus</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </LegalCard>
      </LegalSection>
    </LegalPage>
  )
}
