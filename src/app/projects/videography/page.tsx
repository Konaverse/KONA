"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

const FILMS = [
  {
    id: "curator",
    title: "The Curator",
    year: "2024",
    client: "Bespoke Artisans",
    description: "A deep-dive brand narrative focusing on the obsessive detail of handmade furniture. We utilized macro-cinematography and a rhythmic edit to translate craftsmanship into cinematic form.",
    image: "/Solutions/videography.jpg",
    tags: ["Brand Film", "Macro", "4K Production"]
  },
  {
    id: "precision",
    title: "Precision",
    year: "2024",
    client: "GL Metal",
    description: "A high-end industrial showcase that dramatizes the heavy machinery and technical exactness of metal fabrication. High-contrast lighting and sound design create a feeling of raw power.",
    image: "/General/videography_aesthetic..png",
    tags: ["Product Showcase", "Industrial", "Sound Design"]
  },
  {
    id: "coastal",
    title: "Coastal Living",
    year: "2023",
    client: "Sivory Properties",
    description: "An atmospheric lifestyle piece for a luxury development. We focused on the interaction of natural light and architectural materials to evoke a sense of calm authority.",
    image: "/a_pro_camera.png",
    tags: ["Lifestyle", "Aerial", "Color Grading"]
  },
  {
    id: "process",
    title: "The Process",
    year: "2023",
    client: "Konaverse Labs",
    description: "An experimental short film exploring the intersection of digital design and physical space. A study in light, shadow, and the creative friction behind our studio's work.",
    image: "/Solutions/layer1-lens flares.png",
    tags: ["Experimental", "Behind the Scenes", "VFX"]
  }
];

export default function VideographyProjectsArchive() {
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
        title="Videography"
        description="Cinematic brand films and visual narratives built to command attention."
      />

      <section className="container-padding pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-40">
          {FILMS.map((film, index) => (
            <div key={film.id} className={`flex flex-col ${index % 2 !== 0 ? "md:pt-40" : ""}`}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl group cursor-pointer mb-8">
                 <Image
                   src={film.image}
                   alt={film.title}
                   fill
                   className="object-cover transition-transform duration-1000 group-hover:scale-105"
                   sizes="(max-width: 1024px) 100vw, 50vw"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                 
                 {/* Play Hint */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <path d="M7 6v12l10-6z" />
                       </svg>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-start">
                 <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-sage)]">{film.year}</span>
                    <span className="w-4 h-[1px] bg-white/10" />
                    <span className="font-mono text-[10px] tracking-widest uppercase opacity-40">{film.client}</span>
                 </div>
                 
                 <h2 className="font-display fade-up text-3xl md:text-4xl mb-6">{film.title}</h2>
                 
                 <p className="font-sans font-light fade-up text-base text-white/50 mb-8 leading-relaxed max-w-sm">
                   {film.description}
                 </p>

                 <div className="flex flex-wrap gap-2">
                   {film.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 border border-white/5 rounded-full font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 italic">
                        {tag}
                     </span>
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding">
         <div className="max-w-2xl">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-semibold">Our Approach</span>
            <h2 className="font-display fade-up text-4xl md:text-6xl mb-12 leading-tight">
              A documentary eye with <em className="italic">commercial polish</em>.
            </h2>
            <p className="font-sans font-light fade-up text-xl text-black/60 leading-relaxed">
              We don't believe in generic stock footage or repetitive trends. Every frame we capture is motivated by your brand's unique narrative. We focus on the textures, the light, and the rhythm that makes your story undeniable.
            </p>
         </div>
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
                src="/Solutions/Videography/aesth_film_light.png"
                alt="Capture your brand's essence"
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
                 Production
               </span>
               <h2 className="font-display fade-up text-4xl md:text-7xl lg:text-8xl mb-12 leading-[1.05] tracking-tight max-w-4xl text-white drop-shadow-2xl">
                 Capture your <br/><em className="italic font-light">Essence.</em>
               </h2>
               <Button href="/contact" variant="primary" className="scale-110 md:scale-125 hover:scale-125 transition-transform duration-300">
                 Inquire About Production
               </Button>
            </div>
         </div>
      </section>
    </div>
    </PageWrapper>
  );
}
