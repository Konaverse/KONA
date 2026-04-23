import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services — Web Development & Videography',
  description:
    "We specialize in two core disciplines: high-end web development and cinematic videography. Two offerings. Absolute mastery of both. No dilution.",
  alternates: { canonical: 'https://kona-verse.com/services' },
  openGraph: {
    title: 'Services — Web Development & Videography | Konaverse',
    description:
      'Bespoke web experiences and cinematic productions for premium brands.',
    url: 'https://kona-verse.com/services',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
