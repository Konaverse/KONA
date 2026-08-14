import Navbar from '@/components/layout/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'
import FooterSection from '@/components/sections/homepage/FooterSection'
import StickyPageWrapper from '@/components/layout/StickyPageWrapper'

/**
 * The LEGACY (v3.1) site chrome.
 *
 * This used to live in the root layout, which meant every route in the app —
 * including anything new — inherited the dark navbar, footer, custom cursor and
 * smooth-scroll wrapper. Moving it down one level into a route group lets v4
 * pages render clean while every legacy URL stays exactly where it was: route
 * groups do not appear in the path, so this is `/about`, not `/(site)/about`.
 *
 * Deleted wholesale when the v4 rebuild replaces it.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Nesting is verbatim from the old root layout — Navbar deliberately
       OUTSIDE SmoothScroll — so this is a pure move, not a refactor. */
    <>
      <Navbar />
      <SmoothScroll>
        <CustomCursor />
        <StickyPageWrapper>{children}</StickyPageWrapper>
        <FooterSection />
      </SmoothScroll>
    </>
  )
}
