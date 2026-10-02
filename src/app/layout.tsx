import type { Metadata, Viewport } from 'next'
import { Anton, Cormorant_Garamond, DM_Sans, Geist_Mono, Inter, Manrope } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import JsonLd from '@/components/JsonLd'
import CookieConsent from '@/components/layout/CookieConsent'
import GoogleAnalytics from '@/components/layout/GoogleAnalytics'
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, SITE_URL } from '@/lib/site'
import { SERVICE_PAGES } from '@/lib/service-pages'
import './globals.css'

// v4 "Whiteout" — the only family the new system uses. Weights are exactly the
// four the token file names: 200 display/h1, 400 body/h2, 500 h3/UI, 600 emphasis.
// The five fonts below it belong to the outgoing v3.1 site and come out with it.
const manrope = Manrope({
  subsets: ['latin'],
  /* the VARIABLE face (2026-09-17): one file, every weight from 200 to
     800 — the about page's words sit at 800, which the four static
     instances this replaces never carried. They render identically
     from it, and a weight can now be tweened as a number. */
  weight: 'variable',
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
        {/* Structured data, ONE graph (SEO plan v3 §3, 2026-10-02): the
            studio as Organization + ProfessionalService, the three
            founders tied both ways, the site name. Every page references
            these by @id; page-level graphs add their own nodes. sameAs are
            the user's own URLs only — a wrong one splits the entity, so no
            guesses. No street address until Google Business Profile is
            verified: the two must match (NAP). */}
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': ['Organization', 'ProfessionalService'],
              '@id': `${SITE_URL}/#organization`,
              name: SITE_NAME,
              url: SITE_URL,
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png`, width: 512, height: 512 },
              image: `${SITE_URL}/og-image.png`,
              description:
                'A web studio in Cyprus that designs and builds websites end to end — web design, web development, 3D and immersive websites, one-page websites, redesigns and SEO.',
              email: CONTACT_EMAIL,
              telephone: CONTACT_PHONE,
              address: { '@type': 'PostalAddress', addressCountry: 'CY' },
              areaServed: [
                { '@type': 'Country', name: 'Cyprus' },
                'Europe',
                'Worldwide',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: CONTACT_EMAIL,
                telephone: CONTACT_PHONE,
                availableLanguage: ['English', 'Greek'],
              },
              sameAs: [
                'https://www.instagram.com/konaverse.cy/',
                'https://www.facebook.com/konaverse',
                'https://www.linkedin.com/company/konaverse',
              ],
              knowsAbout: SERVICE_PAGES.map((s) => s.name),
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Services',
                itemListElement: SERVICE_PAGES.map((s) => ({
                  '@type': 'Offer',
                  itemOffered: { '@id': `${SITE_URL}/services/${s.slug}#service` },
                })),
              },
              founder: [
                { '@id': `${SITE_URL}/#konstantinos` },
                { '@id': `${SITE_URL}/#nabil` },
                { '@id': `${SITE_URL}/#andreas` },
              ],
            },
            {
              '@type': 'Person',
              '@id': `${SITE_URL}/#konstantinos`,
              name: 'Konstantinos Kyprianou',
              jobTitle: 'Technical Architect & Co-Founder',
              worksFor: { '@id': `${SITE_URL}/#organization` },
              sameAs: ['https://www.linkedin.com/in/kon-kyprianou-1011/'],
            },
            {
              '@type': 'Person',
              '@id': `${SITE_URL}/#nabil`,
              name: 'Nabil Al Jbawi',
              jobTitle: 'Creative Director & Co-Founder',
              worksFor: { '@id': `${SITE_URL}/#organization` },
              sameAs: ['https://www.linkedin.com/in/nabil-al-jbawi-257517291/'],
            },
            {
              '@type': 'Person',
              '@id': `${SITE_URL}/#andreas`,
              name: 'Andreas Kyriakou',
              jobTitle: 'Co-Founder',
              worksFor: { '@id': `${SITE_URL}/#organization` },
            },
            {
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              name: SITE_NAME,
              alternateName: 'Kona-verse',
              url: SITE_URL,
              inLanguage: 'en',
              publisher: { '@id': `${SITE_URL}/#organization` },
            },
          ],
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
        {/* Vercel Web Analytics + Speed Insights — cookieless, no consent gate */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
