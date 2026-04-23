import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Videography',
  description:
    'Cinematic brand films, product showcases, and editorial content. We craft visual assets with a documentary eye and high-end production polish for premium brands.',
  alternates: { canonical: 'https://kona-verse.com/services/videography' },
  openGraph: {
    title: 'Videography | Konaverse',
    description:
      'Brand films, product showcases, and cinematic content that builds undeniable authority.',
    url: 'https://kona-verse.com/services/videography',
  },
}

export default function VideographyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Videography',
        url: 'https://kona-verse.com/services/videography',
        description:
          'Cinematic brand films, product showcases, editorial lifestyle content, and post-production services for premium brands.',
        provider: { '@id': 'https://kona-verse.com/#organization' },
        serviceType: ['Brand Films', 'Product Showcases', 'Editorial Content', 'Post-Production', 'Motion Graphics'],
        areaServed: ['Europe', 'Middle East', 'North America'],
      }} />
      {children}
    </>
  )
}
