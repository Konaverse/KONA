import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact — Start a Project',
  description:
    'Ready to build something remarkable? Tell us about your project and we will respond within 24 hours with a tailored approach.',
  alternates: { canonical: 'https://kona-verse.com/contact' },
  openGraph: {
    title: 'Contact — Start a Project | Konaverse',
    description:
      'Start a conversation with Konaverse. We respond within 24 hours with a tailored quote.',
    url: 'https://kona-verse.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Konaverse',
        url: 'https://kona-verse.com/contact',
        description: 'Request a quote or start a project with Konaverse.',
        mainEntity: {
          '@type': 'Organization',
          '@id': 'https://kona-verse.com/#organization',
          email: 'info@kona-verse.com',
        },
      }} />
      {children}
    </>
  )
}
