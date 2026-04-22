import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Konaverse — Premium Digital Agency',
  description:
    'Konaverse is a premium digital agency crafting web experiences, films, and brand presence that refuses to be ignored.',
  openGraph: {
    title: 'Konaverse — Premium Digital Agency',
    description:
      'Web development, web applications, videography, digital advertising, social media — built with intent.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Navbar />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
