import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Pricing & Investment',
  description:
    'Transparent service tiers for web development. Custom-scoped projects for brands serious about their digital presence. No hidden fees.',
  alternates: { canonical: 'https://kona-verse.com/pricing' },
  openGraph: {
    title: 'Pricing & Investment | Konaverse',
    description:
      'Web development pricing. Custom scoped, no hidden fees.',
    url: 'https://kona-verse.com/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do you show prices upfront?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "We don't publish fixed prices because every project is unique. Scope, complexity, and timeline all affect the investment. We prefer a conversation first and provide a tailored quote that reflects your specific goals.",
            },
          },
          {
            '@type': 'Question',
            name: 'How long does a typical project take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Website builds typically run four to eight weeks. Web applications are scoped individually based on complexity.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you work with international clients?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Our clients span Europe, the Middle East, and North America. We operate with a global-first mindset, utilizing async communication and flexible scheduling across any timezone.',
            },
          },
          {
            '@type': 'Question',
            name: "What's your payment structure?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We work with a 50% deposit to initiate the project, with the remaining balance split across key delivery milestones to ensure alignment and momentum throughout.',
            },
          },
        ],
      }} />
      {children}
    </>
  )
}
