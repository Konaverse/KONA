import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Videography Projects',
  description:
    'A curated selection of cinematic brand films, product showcases, and editorial content produced by Konaverse for premium brands.',
  alternates: { canonical: 'https://kona-verse.com/projects/videography' },
  openGraph: {
    title: 'Videography Projects | Konaverse',
    description:
      'Cinematic productions and brand narratives. Every frame built with intent.',
    url: 'https://kona-verse.com/projects/videography',
  },
}

export default function VideographyProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
