import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About the Studio',
  description:
    'Konaverse is a two-person creative studio built on the belief that great design and compelling content are the difference between being seen and being remembered. Meet the architect and the visionary.',
  alternates: { canonical: 'https://kona-verse.com/about' },
  openGraph: {
    title: 'About the Studio | Konaverse',
    description:
      'Meet Konstantinos (Technical Architect) and Nabil (Creative Director) — the two minds behind Konaverse.',
    url: 'https://kona-verse.com/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Konaverse',
        url: 'https://kona-verse.com/about',
        description:
          'Konaverse is a two-person premium digital agency founded by Konstantinos and Nabil.',
        mainEntity: {
          '@id': 'https://kona-verse.com/#organization',
        },
      }} />
      {children}
    </>
  )
}
