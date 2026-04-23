import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Projects',
  description:
    'A curated selection of bespoke websites and web applications engineered by Konaverse — from hospitality brands to corporate platforms and e-commerce experiences.',
  alternates: { canonical: 'https://kona-verse.com/projects/web-development' },
  openGraph: {
    title: 'Web Development Projects | Konaverse',
    description:
      'High-end web experiences for premium brands. Built on Next.js with precision and performance.',
    url: 'https://kona-verse.com/projects/web-development',
  },
}

export default function WebDevProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
