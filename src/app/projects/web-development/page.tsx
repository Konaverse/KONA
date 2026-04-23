"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

const PROJECTS = [
  {
    id: "sivory",
    title: "Sivory",
    year: "2024",
    services: ["Web Design", "Development", "Performance"],
    description: "A premium digital presence for a high-end architectural and hospitality brand. Focusing on minimalist aesthetics and seamless transitions that reflect the physical space.",
    image: "/Projects/sivory_macbook.png",
    mobileImage: "/Projects/sivory_iphone.png",
    tech: ["Next.js", "GSAP", "Tailwind"]
  },
  {
    id: "tdk",
    title: "TDK Group",
    year: "2024",
    services: ["Corporate Platform", "UI/UX", "SEO"],
    description: "A sophisticated platform for an international corporate group. Engineering authority through clean typography and a performant, scalable architecture.",
    image: "/Projects/tdk_macbook.png",
    mobileImage: "/Projects/tdk_iphone.png",
    tech: ["React", "Node.js", "Framer"]
  },
  {
    id: "glmetal",
    title: "GL Metal Works",
    year: "2023",
    services: ["Industrial Presence", "Web Development"],
    description: "Translating industrial precision into a digital format. We focused on high-contrast visuals and direct, authoritative communication for this specialized sector.",
    image: "/Projects/glmetalworks.png",
    tech: ["Next.js", "TypeScript"]
  },
  {
    id: "leanthia",
    title: "Leanthia Bakery",
    year: "2024",
    services: ["E-commerce", "Brand Storytelling"],
    description: "An artisanal e-commerce experience. We brought the tactile feeling of a local bakery to the digital world through warm tones and cinematic product photography.",
    image: "/Projects/LeanthiaBakery.png",
    tech: ["Shopify", "Custom Theme"]
  },
  {
    id: "velricon",
    title: "Velricon",
    year: "2023",
    services: ["Corporate Site", "Performance"],
    description: "A modern corporate presence focusing on conversion and clarity. We optimized every interaction for business growth and market impact.",
    image: "/Projects/velricon.png",
    tech: ["Tailwind", "Next.js"]
  },
  {
    id: "apt-showcase",
    title: "Apartment Showcase",
    year: "2024",
    services: ["Real Estate", "Interactive"],
    description: "A high-fidelity real estate showcase for luxury apartments. Featuring interactive unit browsers and cinematic floorplan reveals.",
    image: "/Projects/apt_macbook.png",
    mobileImage: "/Projects/apt_iphone.png",
    tech: ["React", "GSAP"]
  }
];

export default function WebProjectsArchive() {
  const mainRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // CTA Animation
      if (ctaSectionRef.current && ctaWrapperRef.current && ctaImageRef.current && ctaTextRef.current) {
        const isMobile = window.innerWidth < 768;

        // Global Entrance Animations
        gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
          gsap.fromTo(el, 
            { opacity: 0, y: 40 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power3.out", 
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
              } 
            }
          );
        });

        // Global Parallax Backgrounds
        gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((el) => {
          const parent = el.parentElement;
          if (parent) {
            gsap.fromTo(el,
              { yPercent: -10 },
              {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                  trigger: parent,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                }
              }
            );
          }
        });

        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top bottom", 
            end: "center center", 
            scrub: true,
          }
        });

        // Expand clip-path
        tl.fromTo(ctaWrapperRef.current,
          { clipPath: isMobile ? "inset(15% 5% 15% 5% round 2rem)" : "inset(20% 15% 20% 15% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power2.inOut" }
        );

        // Zoom out image
        tl.fromTo(ctaImageRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power2.inOut" },
          "<"
        );

        // Reveal Text
        gsap.to(ctaTextRef.current, {
           opacity: 1,
           y: 0,
           duration: 1,
           ease: "power3.out",
           scrollTrigger: {
             trigger: ctaSectionRef.current,
             start: "center 70%",
             toggleActions: "play none none reverse",
           }
        });
      }
    }, { scope: mainRef });
    
    return () => ctx.revert();
  }, []);

  return (
    <PageWrapper theme="dark">
      <div ref={mainRef}>
      <PageHeader
        title="Web Projects"
        description="A selection of digital experiences engineered for performance and brand authority."
      />

      <section className="container-padding pb-40 space-y-40 md:space-y-60">
        {PROJECTS.map((project, index) => (
          <div key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            {/* Meta Info (Sticky on Desktop) */}
            <div className="lg:col-span-4 lg:sticky lg:top-40">
              <div className="flex items-center gap-4 mb-8">
                 <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-sage)]">{project.year}</span>
                 <span className="w-8 h-[1px] bg-white/10" />
                 <div className="flex gap-4">
                   {project.tech.map(t => (
                     <span key={t} className="font-mono text-[9px] tracking-widest uppercase opacity-40 italic">{t}</span>
                   ))}
                 </div>
              </div>
              
              <h2 className="font-display fade-up text-4xl md:text-6xl mb-8 leading-tight">
                {project.title}
              </h2>
              
              <p className="font-sans font-light fade-up text-lg text-white/50 mb-10 leading-relaxed max-w-sm">
                {project.description}
              </p>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-30">Disciplines</span>
                <div className="flex flex-wrap gap-4">
                  {project.services.map(s => (
                    <span key={s} className="px-3 py-1.5 border border-white/10 rounded-full font-mono text-[9px] tracking-widest uppercase opacity-60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visuals */}
            <div className="lg:col-span-8 flex flex-col gap-8 md:gap-16">
               <div className="relative aspect-[16/10] bg-[var(--color-obsidian)] rounded-xl md:rounded-3xl overflow-hidden shadow-2xl fade-up">
                 <div className="absolute inset-[-10%] w-[120%] h-[120%] parallax-bg">
                   <Image
                     src={project.image}
                     alt={project.title}
                     fill
                     className="object-cover"
                     sizes="(max-width: 1024px) 100vw, 66vw"
                   />
                 </div>
                 <div className="absolute inset-0 bg-black/10 transition-colors duration-700 hover:bg-transparent" />
               </div>

               {project.mobileImage && (
                 <div className="flex justify-end pr-4 md:pr-12 -mt-20 md:-mt-32 relative z-20">
                    <div className="relative aspect-[9/19] w-32 md:w-56 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border-[4px] md:border-[8px] border-[var(--color-obsidian)] shadow-2xl">
                      <Image
                        src={project.mobileImage}
                        alt={`${project.title} Mobile`}
                        fill
                        className="object-cover"
                      />
                    </div>
                 </div>
               )}
            </div>
          </div>
        ))}
      </section>

      {/* Immersive CTA */}
      <section 
        ref={ctaSectionRef}
        className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-[var(--color-obsidian)]"
      >
         <div 
           ref={ctaWrapperRef}
           className="absolute inset-0 w-full h-full will-change-transform"
         >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full will-change-transform" ref={ctaImageRef}>
              <Image 
                src="/General/aesth_office.png"
                alt="Build the next remarkable project"
                fill
                className="object-cover"
                sizes="100vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            </div>

            {/* Text Content */}
            <div 
              ref={ctaTextRef}
              className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 pb-32 md:p-20 md:pb-40 opacity-0 translate-y-12 will-change-transform"
            >
               <span className="font-mono text-[10px] md:text-[12px] tracking-[0.4em] uppercase text-[var(--color-sage)] mb-6 md:mb-8 font-semibold">
                 Let's Talk
               </span>
               <h2 className="font-display fade-up text-4xl md:text-7xl lg:text-8xl mb-12 leading-[1.05] tracking-tight max-w-4xl text-white drop-shadow-2xl">
                 Build <br/><em className="italic font-light">Remarkable.</em>
               </h2>
               <Button href="/contact" variant="primary" className="scale-110 md:scale-125 hover:scale-125 transition-transform duration-300">
                 Work With Us
               </Button>
            </div>
         </div>
      </section>
    </div>
    </PageWrapper>
  );
}
