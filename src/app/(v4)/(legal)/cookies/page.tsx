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
 */
const UPDATED = 'August 2026'

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
          <LegalExt href="https://ahrefs.com/privacy">Ahrefs privacy policy</LegalExt>
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
