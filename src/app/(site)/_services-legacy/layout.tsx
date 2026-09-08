import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services — Web Development',
  description:
    "We specialize in high-end web development. Absolute mastery. No dilution.",
  alternates: { canonical: 'https://kona-verse.com/services' },
  openGraph: {
    title: 'Services — Web Development | Konaverse',
    description:
      'Bespoke web experiences for premium brands.',
    url: 'https://kona-verse.com/services',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
