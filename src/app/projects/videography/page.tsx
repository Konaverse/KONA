"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useLayoutEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { motion, AnimatePresence } from "framer-motion";

const FILMS = [
  {
    id: "konaverse",
    title: "The Konaverse",
    year: "2024",
    client: "Studio",
    description: "A cinematic brand narrative showcasing our philosophy and the intersection of architectural precision and digital storytelling.",
    image: "/Solutions/Videography/konaverse_vid_cover.png",
    video: "https://res.cloudinary.com/konaverse/video/upload/v1776969624/konaverse/videos/konavers_video.mp4",
    instagram: "https://www.instagram.com/reel/DU3PWPfDKZk/",
    tags: ["Brand Film", "Studio Reel", "Cinematography"]
  },
  {
    id: "barbershop",
    title: "Los Santos",
    year: "2024",
    client: "LosSantos Barbershop",
    description: "Capturing the premium grooming experience in Limassol. A study in texture, lighting, and the rhythmic motion of traditional craftsmanship.",
    image: "/Solutions/Videography/los_santos_barbershop_cover.png",
    video: "https://res.cloudinary.com/konaverse/video/upload/v1776969632/konaverse/videos/barbershop_video.mp4",
    instagram: "https://www.instagram.com/reel/DW1m3ZwihuR/",
    tags: ["Documentary", "Craftsmanship", "Lifestyle"]
  },
  {
    id: "alterlife",
    title: "The Ritual",
    year: "2024",
    client: "Alterlife Gym",
    description: "A high-intensity visual study of the Alterlife experience. Capturing the energy, discipline, and communal drive of the modern fitness ritual.",
    image: "/Solutions/Videography/alterlife_gym_video.png",
    video: "https://res.cloudinary.com/konaverse/video/upload/v1776970009/konaverse/videos/alterlife_gym.mp4",
    instagram: "https://www.instagram.com/reel/DXT3uDaivuo/",
    tags: ["Fitness", "High Energy", "Brand Showcase"]
  },
  {
    id: "velocity",
    title: "Velocity",
    year: "2023",
    client: "Personal Project",
    description: "An experimental study in human motion and atmospheric perspective. Capturing the raw intensity and rhythmic pace of the track.",
    image: "/Solutions/Videography/race_track_cover.png",
    video: "https://res.cloudinary.com/konaverse/video/upload/v1776969625/konaverse/videos/race_track_vid.mp4",
    instagram: "https://www.instagram.com/reel/DW9jjj_CtjG/",
    tags: ["Experimental", "Athletics", "High Frame Rate"]
  }
];

export default function VideographyProjectsArchive() {
  const mainRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  const [activeVideo, setActiveVideo] = useState<typeof FILMS[0] | null>(null);

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
              <div 
                className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl group cursor-pointer mb-8"
                onClick={() => setActiveVideo(film)}
              >
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
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
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

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setActiveVideo(null)}
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="relative w-full max-w-6xl aspect-video bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl"
               onClick={(e) => e.stopPropagation()}
             >
                {/* Close Button */}
                <button 
                  className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                  onClick={() => setActiveVideo(null)}
                >
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                   </svg>
                </button>

                <video 
                  src={activeVideo.video}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />

                {/* Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div>
                         <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-2 block">{activeVideo.client}</span>
                         <h3 className="font-display text-2xl md:text-4xl text-white">{activeVideo.title}</h3>
                      </div>
                      <a 
                        href={activeVideo.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="pointer-events-auto flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-white/60 hover:text-[var(--color-sage)] transition-colors duration-300"
                      >
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                         View on Instagram
                      </a>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
