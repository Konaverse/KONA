import type { Metadata } from 'next'
import { Anton, Cormorant_Garamond, DM_Sans, Geist_Mono, Inter, Manrope } from 'next/font/google'
import JsonLd from '@/components/JsonLd'
import CookieConsent from '@/components/layout/CookieConsent'
import GoogleAnalytics from '@/components/layout/GoogleAnalytics'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://kona-verse.com'),
  title: {
    default: 'Konaverse — Premium Digital Agency',
    template: '%s | Konaverse',
  },
  description:
    'Konaverse is a premium digital agency crafting web experiences and brand presence that refuses to be ignored.',
  keywords: [
    'digital agency', 'web development', 'web applications', 'brand identity',
    'Next.js agency', 'web engineering', 'web design', 'premium agency',
  ],
  authors: [{ name: 'Konaverse', url: 'https://kona-verse.com' }],
  creator: 'Konaverse',
  publisher: 'Konaverse',
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
    title: 'Konaverse — Premium Digital Agency',
    description:
      'Web development, web applications, and brand presence — built with intent.',
    type: 'website',
    url: 'https://kona-verse.com',
    siteName: 'Konaverse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Konaverse — Premium Digital Agency',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konaverse — Premium Digital Agency',
    description:
      'Web development, web applications, and digital brand presence — built with intent.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://kona-verse.com',
  },
  other: {
    'theme-color': '#0a0a0a',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${inter.variable} ${dmSans.variable} ${geistMono.variable} ${anton.variable}`}
    >
      <body className="antialiased">
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': 'https://kona-verse.com/#organization',
          name: 'Konaverse',
          url: 'https://kona-verse.com',
          logo: { '@type': 'ImageObject', url: 'https://kona-verse.com/About/Logo%2021.png' },
          description: 'Premium digital agency specializing in high-end web development and digital experiences.',
          email: 'info@kona-verse.com',
          areaServed: ['Europe', 'Middle East', 'North America'],
          member: [
            { '@type': 'Person', name: 'Konstantinos', jobTitle: 'Technical Architect & Co-Founder' },
            { '@type': 'Person', name: 'Nabil', jobTitle: 'Creative Director & Co-Founder' },
          ],
        }} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://kona-verse.com/#website',
          name: 'Konaverse',
          url: 'https://kona-verse.com',
          publisher: { '@id': 'https://kona-verse.com/#organization' },
        }} />
        {/* Site chrome (navbar, footer, cursor, smooth scroll) now lives in
            app/(site)/layout.tsx so v4 routes can render without it. Anything
            genuinely global — fonts, metadata, structured data, analytics,
            consent — stays here. */}
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-2PEZX44FP9" />
        <CookieConsent />
      </body>
    </html>
  )
}
