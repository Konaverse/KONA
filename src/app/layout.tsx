import type { Metadata, Viewport } from 'next'
import { Anton, Cormorant_Garamond, DM_Sans, Geist_Mono, Inter, Manrope } from 'next/font/google'
import Script from 'next/script'
import JsonLd from '@/components/JsonLd'
import CookieConsent from '@/components/layout/CookieConsent'
import GoogleAnalytics from '@/components/layout/GoogleAnalytics'
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

// v4 "Whiteout" — the only family the new system uses. Weights are exactly the
// four the token file names: 200 display/h1, 400 body/h2, 500 h3/UI, 600 emphasis.
// The five fonts below it belong to the outgoing v3.1 site and come out with it.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

/**
 * SITE-WIDE DEFAULTS, re-set for v4 (2026-08-28). The homepage carries its
 * own full metadata in app/(v4)/page.tsx; these are what every OTHER route
 * inherits — the legal pages set title/description/canonical and take the
 * rest from here. No `keywords`: Google has ignored the tag since 2009 and
 * the SEO plan's O1 (one researched primary keyword per page) is still open.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Web studio, Cyprus`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Konaverse is a web studio in Cyprus that designs and builds websites end to end — strategy, design, motion and engineering in one continuous process.',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  verification: {
    other: {
      'msvalidate.01': '914944C03F8EFCB0A516B441FE2CFADA',
      'ahrefs-site-verification':
        'dc2e708ac811df6996917c63938f9aad1cfffd0931992f5de686de37f17d5c60',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Konaverse — Build the website that will make you stand out',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

/* the page ground is white now (v4 "Whiteout"); phone browser chrome
   tints to this */
export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${inter.variable} ${dmSans.variable} ${geistMono.variable} ${anton.variable}`}
    >
      <body className="antialiased">
        {/* Structured data, re-set for v4 (2026-08-28): the studio as it
            is now — six services, socials as sameAs, Cyprus. The founders'
            entries carry over. */}
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/About/KonaLogoNoBg.png` },
          image: `${SITE_URL}/og-image.png`,
          description:
            'A web studio in Cyprus that designs and builds websites end to end — strategy, design, motion and engineering in one continuous process.',
          email: CONTACT_EMAIL,
          address: { '@type': 'PostalAddress', addressCountry: 'CY' },
          areaServed: ['Cyprus', 'Europe', 'Middle East', 'North America'],
          sameAs: [
            'https://www.instagram.com/konaverse.cy/',
            'https://www.facebook.com/konaverse',
            'https://www.linkedin.com/company/konaverse',
          ],
          knowsAbout: [
            '3D websites',
            'Web design',
            'Web development',
            'One-page websites',
            'Website redesign',
            'SEO',
          ],
          member: [
            { '@type': 'Person', name: 'Konstantinos', jobTitle: 'Technical Architect & Co-Founder' },
            { '@type': 'Person', name: 'Nabil', jobTitle: 'Creative Director & Co-Founder' },
          ],
        }} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: SITE_URL,
          publisher: { '@id': `${SITE_URL}/#organization` },
        }} />
        {/* Site chrome (navbar, footer, cursor, smooth scroll) now lives in
            app/(site)/layout.tsx so v4 routes can render without it. Anything
            genuinely global — fonts, metadata, structured data, analytics,
            consent — stays here. */}
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-2PEZX44FP9" />
        {/* Ahrefs Web Analytics — cookieless, so it sits outside the consent gate */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="xEFczInRaLOwii40X9YNoA"
          strategy="afterInteractive"
        />
        <CookieConsent />
      </body>
    </html>
  )
}
