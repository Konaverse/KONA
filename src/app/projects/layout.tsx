import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore our portfolio of bespoke web experiences and cinematic productions. Every project is engineered for precision and built to command attention.',
  alternates: { canonical: 'https://kona-verse.com/projects' },
  openGraph: {
    title: 'Projects | Konaverse',
    description:
      'A curated portfolio of high-end web development and cinematic videography work.',
    url: 'https://kona-verse.com/projects',
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
