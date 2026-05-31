import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ManifestoSection from '@/components/sections/homepage/ManifestoSection'
import ProcessSection from '@/components/sections/homepage/ProcessSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import StudioSection from '@/components/sections/StudioSection'
import HomeCTA from '@/components/sections/homepage/HomeCTA'


export default function Home() {
  return (
    <div className="grain">
      <HeroSection />
      <ServicesSection />
      <ManifestoSection />
      {/* <ProcessSection /> */}
      <ProjectsSection />
      <StudioSection />
      <HomeCTA />

    </div>
  )
}
