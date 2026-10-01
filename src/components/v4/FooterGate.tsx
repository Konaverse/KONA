'use client'

import { usePathname } from 'next/navigation'
import SiteFooter from '@/components/v4/SiteFooter'
import { ROUTES } from '@/lib/site'

/**
 * THE FOOTER'S GATE (2026-09-19, user: "in this page we don't need a
 * footer, let's keep it just the cards"). The footer lives in the (v4)
 * layout, which is a server component and cannot know the route — this
 * is the one client boundary that can.
 *
 * A GATE AND NOT A `return null` INSIDE SiteFooter: the footer's drivers
 * (the under-reveal, the address's weight) arm once, on mount, off its
 * own root element. Returned as null on /work it would mount with no
 * root, arm nothing, and then stay unarmed when the visitor walked on to
 * a page that does show it. Gated out here, it is simply not mounted,
 * and mounts fresh — drivers and all — on the next page.
 *
 * EXACT MATCH: the work hub only. The case studies under /work/… keep
 * their footer.
 */
const BARE: string[] = [ROUTES.work, ROUTES.services]

export default function FooterGate() {
  const pathname = usePathname()
  if (pathname && BARE.includes(pathname.replace(/\/$/, '') || '/')) return null
  return <SiteFooter />
}
