import HeroV2 from '@/components/sections/homepage/HeroV2'
import AboutSection from '@/components/sections/homepage/AboutSection'
import ServicesVault from '@/components/sections/homepage/ServicesVault'
import ManifestoSection from '@/components/sections/homepage/ManifestoSection'
import ProjectsSection from '@/components/sections/homepage/ProjectsSection'
import InterludeSection from '@/components/sections/homepage/InterludeSection'
import CTASection from '@/components/sections/homepage/CTASection'

export default function Home() {
  return (
    <div className="grain">
      {/* Hero stays pinned; About scrolls over it (higher z-index) */}
      <div className="hero-pin">
        <HeroV2 />
      </div>
      {/* About pins its last frame → Services tilts over it (same as Hero → About) →
          Services stays pinned while the Manifesto scrolls over it (tilt). */}
      <div style={{ position: 'relative' }}>
        <AboutSection />
        <ServicesVault>
          <ManifestoSection />
        </ServicesVault>
      </div>
      {/* Projects — plain scroll after the manifesto (no special transition) */}
      <ProjectsSection />
      {/* Interlude — tilts in over Projects, then pins its last frame */}
      {/* <InterludeSection /> */}
      {/* CTA / Contact — tilts in over the pinned Interlude (same transition) */}
      <CTASection />
    </div>
  )
}
