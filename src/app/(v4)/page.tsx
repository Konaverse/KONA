import Reveal from '@/components/v4/Reveal'
import HeroPortrait from '@/components/v4/HeroPortrait'
import ScrollFillText from '@/components/v4/ScrollFillText'
import './home.css'

/**
 * The v4 homepage, rebuilt section by section against
 * docs/homepage-choreography.md (binding).
 *
 * Currently live: §1 Arrival (HeroStage, second cut — the reference-image
 * rebuild) and a §2 skeleton whose statement fills letter by letter with
 * scroll (user-directed 2026-08-18). §2 still gets its own full design pass.
 *
 * All copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */
export default function HomePage() {
  /* Hero A/B (2026-08-18): variant B, the user's staircase wireframe, is
     live here; variant A (the 3D object, HeroStage) is parked at
     /hero-object for comparison — swap the import to bring it back. */
  return (
    <main className="hm">
      <HeroPortrait />

      <section className="hm-claim k-section k-page">
        <ScrollFillText
          as="h2"
          className="t-h1 hm-claim-line"
          text="Konaverse is a web studio for brands that want their site to carry the story, not just the information."
        />
        <Reveal as="p" className="t-body hm-claim-body" index={1}>
          Strategy, design, motion and engineering in one continuous process.
          Based in Cyprus, working globally.
        </Reveal>
        <hr className="k-rule hm-claim-rule" />
      </section>
    </main>
  )
}
