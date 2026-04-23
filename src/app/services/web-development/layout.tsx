import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Web Development',
  description:
    'High-performance websites and web applications built on Next.js, React, and modern headless architectures. Engineered for precision, designed for authority.',
  alternates: { canonical: 'https://kona-verse.com/services/web-development' },
  openGraph: {
    title: 'Web Development | Konaverse',
    description:
      'Bespoke websites, web apps, and headless e-commerce. Performance engineering meets editorial aesthetics.',
    url: 'https://kona-verse.com/services/web-development',
  },
}

export default function WebDevelopmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Web Development',
        url: 'https://kona-verse.com/services/web-development',
        description:
          'High-performance websites, web applications, and headless e-commerce solutions built on Next.js and modern architectures.',
        provider: { '@id': 'https://kona-verse.com/#organization' },
        serviceType: ['Website Development', 'Web Application', 'E-commerce', 'Performance Engineering'],
        areaServed: ['Europe', 'Middle East', 'North America'],
      }} />
      {children}
    </>
  )
}
