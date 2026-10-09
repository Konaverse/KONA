import type { Metadata } from 'next'
import {
  LegalPage,
  LegalIntro,
  LegalSection,
  LegalList,
  LegalCard,
  LegalRow,
  LegalExt,
} from '@/components/v4/Legal'
import CookiePreferences from '@/components/layout/CookiePreferences'
import { CONTACT_EMAIL, OG_DEFAULTS, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Which cookies kona-verse.com sets, what they do, how long they last, and how to change your choice at any time.',
  alternates: { canonical: `${SITE_URL}/cookies` },
  openGraph: { ...OG_DEFAULTS, type: 'website', title: 'Cookie Policy | Konaverse', url: `${SITE_URL}/cookies` },
  robots: { index: true, follow: true },
}

/**
 * Matches what the code actually does (2026-08-28): the consent choice
 * lives in localStorage (not a cookie), Google Analytics runs under Consent
 * Mode v2 and sets _ga / _ga_* only after "Accept", Ahrefs is cookieless.
 * The "change your choice" control is the withdrawal the GDPR asks for.
 *
 * 2026-10-04: the contact page's calendar is Calendly's page in a frame,
 * in the page from the first paint (owner, 2026-10-03). Its cookies are
 * Calendly's, set on load and outside our banner, and the policy now
 * says so (section 3C and the note in section 5).
 */
const UPDATED = 'October 2026'

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated={UPDATED}
      next={[
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Use' },
      ]}
    >
      <LegalIntro>
        <p>
          This policy explains how Konaverse (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;our&rdquo;) uses cookies and similar technologies on{' '}
          <strong>kona-verse.com</strong>: what they are, why we use them, and how you control
          them.
        </p>
      </LegalIntro>

      <LegalSection title="1. What cookies are">
        <p>
          Cookies are small data files placed on your computer or phone when you visit a website.
          Site owners use them to make sites work, to make them work better, and to report on how
          they are used. &ldquo;Local storage&rdquo; is a similar mechanism that keeps a small
          value in your browser without sending it to the server.
        </p>
      </LegalSection>

      <LegalSection title="2. Why we use them">
        <p>
          Two reasons. One value is <strong>strictly necessary</strong>: it remembers the choice
          you make in the cookie banner so we do not ask again. The rest are{' '}
          <strong>analytics</strong>: they help us understand how the site is used so we can
          improve it. Analytics cookies are set only if you accept them.
        </p>
        <p>
          One page also carries a third party&rsquo;s tool: the booking calendar on our contact
          page is provided by Calendly, which sets its own cookies. They are described in section
          3C.
        </p>
      </LegalSection>

      <LegalSection title="3. What we set">
        <h3>A. Strictly necessary</h3>
        <LegalCard>
          <LegalRow name="konaverse_cookie_consent">
            Your banner choice (&ldquo;accepted&rdquo; or &ldquo;declined&rdquo;). Stored in your
            browser&rsquo;s local storage, not as a cookie; it stays until you clear it or change
            your choice below.
          </LegalRow>
        </LegalCard>

        <h3>B. Analytics: only after you accept</h3>
        <p>
          <strong>Google Analytics</strong> (gtag.js) reports how visitors use the site in
          aggregate. It does not identify you to us.
        </p>
        <LegalCard>
          <LegalRow name="_ga">Distinguishes one visitor from another. 2 years.</LegalRow>
          <LegalRow name="_ga_*">Keeps the session state for that visitor. 2 years.</LegalRow>
        </LegalCard>
        <p>
          <strong>Microsoft Clarity</strong> provides heatmaps and session recordings to help us
          understand clicks, scrolling and navigation. Analytics cookies are enabled only after
          you accept; until then, Clarity runs in a limited mode without cookies. Advertising
          storage stays disabled. Changing your choice below also updates Clarity.{' '}
          <LegalExt href="https://www.microsoft.com/privacy/privacystatement">Microsoft privacy statement</LegalExt>
        </p>
        <LegalCard>
          <LegalRow name="_clck">Remembers the Clarity visitor ID and preferences.</LegalRow>
          <LegalRow name="_clsk">Connects page views into a single session recording.</LegalRow>
        </LegalCard>
        <p>
          <strong>Ahrefs Web Analytics</strong> also measures traffic, and sets no cookies at all.
          It counts page views without a persistent identifier, so it runs regardless of your
          choice.{' '}
          <LegalExt href="https://ahrefs.com/legal/privacy-policy">Ahrefs privacy policy</LegalExt>
        </p>

        <h3>C. The booking calendar on the contact page</h3>
        <p>
          The calendar on our <a href="/contact">contact page</a> is <strong>Calendly</strong>
          &rsquo;s booking page, shown inside a frame. It loads with the page, and Calendly sets
          its own cookies in that frame to run the calendar, to keep it secure and to measure its
          use. These cookies are set by Calendly, not by us: we cannot read them, and the choice
          you make in our banner does not switch them on or off.{' '}
          <LegalExt href="https://calendly.com/legal/privacy-notice">Calendly privacy notice</LegalExt>
        </p>
      </LegalSection>

      <LegalSection title="4. Google Consent Mode v2">
        <p>
          Google Analytics runs under Consent Mode v2. Until you accept, every consent signal is
          set to &ldquo;denied&rdquo;: no analytics cookies are stored and Google Analytics
          receives only anonymous, cookieless pings for basic measurement. Accepting turns on the
          cookies listed above; declining leaves them off.
        </p>
      </LegalSection>

      <LegalSection title="5. Your choice">
        <p>
          The banner on your first visit asks you to accept analytics cookies or keep to the
          essential ones. You can change your mind at any time, right here:
        </p>
        <CookiePreferences />
        <p>
          You can also block or delete cookies through your browser&rsquo;s settings. The site
          works fully without analytics cookies.
        </p>
        <p>
          To avoid Calendly&rsquo;s cookies, block third-party cookies in your browser, or skip
          the calendar: the form and the email address on the contact page reach us without it.
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to this policy">
        <p>
          We may update this policy to reflect changes in the cookies we use or for other
          operational, legal or regulatory reasons. The &ldquo;last updated&rdquo; date at the top
          reflects the current version.
        </p>
      </LegalSection>

      <LegalSection title="7. Questions">
        <p>
          Anything about cookies or the technologies above:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <LegalList>
          <li>
            More on your data and your rights in our <a href="/privacy">Privacy Policy</a>.
          </li>
        </LegalList>
      </LegalSection>
    </LegalPage>
  )
}
