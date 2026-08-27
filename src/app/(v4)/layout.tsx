import ApertureMenu from '@/components/v4/ApertureMenu'
import CalendlyPopover from '@/components/v4/CalendlyPopover'
import SmoothScroll from '@/components/v4/SmoothScroll'
import FluidCursor from '@/components/v4/FluidCursor'
import GrainField from '@/components/v4/GrainField'
import PageTransition from '@/components/v4/PageTransition'
import SiteFooter from '@/components/v4/SiteFooter'
import '@/styles/tokens.css'

/**
 * The shared shell for every v4 "Whiteout" route.
 *
 * This exists because `.k-root` and the `<noscript>` rule below used to live
 * inside app/design-system/page.tsx, which meant every *new* v4 route would
 * silently lack both — and lacking the noscript rule is not cosmetic: every
 * .k-reveal starts at opacity 0 and is switched on by an IntersectionObserver,
 * so a JS failure would render the page completely blank. Checklist §6.1.
 *
 * `(v4)` is a route group, so it does not appear in any URL. It sits alongside
 * `(site)`, which carries the legacy chrome AND the ten-stripe dark shutter in
 * its template.tsx — the thing v4 replaces. Keeping v4 routes out of `(site)`
 * is what guarantees the two transitions can never both run (checklist §5.4).
 *
 * `.k-root` is a wrapper class rather than a bare `body` rule because Next
 * hoists every CSS import to global scope, so styling `body` here would repaint
 * the legacy dark site white. It moves to <body> when the legacy site goes.
 */
export default function V4Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="k-root">
      {/* Progressive enhancement, not decoration — see the note above. The
          aperture menu already takes this stance (it renders OPEN without JS);
          the reveal has to as well. */}
      <noscript>
        <style>{`.k-reveal{opacity:1!important;filter:none!important;transform:none!important}.ft-l{transform:none!important}`}</style>
      </noscript>

      <div className="k-grain" />
      {/* the grain layer is fixed at the root and cannot see a section-scoped
          --grain-opacity; this lerps the root value by how much dark ground is
          on screen, so the texture thickens over the dark passages. */}
      <GrainField />
      <ApertureMenu />
      {/* the booking panel: every Calendly link on the page opens it
          anchored to the clicked button instead of leaving (2026-08-26) */}
      <CalendlyPopover />
      <FluidCursor />

      <SmoothScroll>
        <PageTransition>
          {children}
          {/* the footer is part of the page, so it rides the transition
              sheet with it; the under-reveal is self-contained (see
              SiteFooter.tsx), so no page root needs to know it is here */}
          <SiteFooter />
        </PageTransition>
      </SmoothScroll>
    </div>
  )
}
