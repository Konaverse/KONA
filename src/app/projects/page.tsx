"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

const CATEGORIES = [
  {
    id: "web-development",
    title: "Web Development",
    count: "06 Engineered Projects",
    image: "/Solutions/Web Dev/aesth_brand_experiences.png",
    href: "/projects/web-development",
    description: "Technical precision meets editorial design. A curation of performant, high-end web experiences designed for undeniable market authority."
  },
  {
    id: "videography",
    title: "Videography",
    count: "04 Cinematic Films",
    image: "/Solutions/Videography/aesth_product_showcase.png",
    href: "/projects/videography",
    description: "Cinematic storytelling and brand narratives. Visual assets that command attention and build trust through atmospheric production."
  }
];

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Cards Entrance & Parallax
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        
        // Entrance
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Image parallax
        const img = imageRefs.current[i];
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      // 2. Quote Entrance
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Immersive CTA Animation
      if (ctaSectionRef.current) {
        const isMobile = window.innerWidth < 768;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        });

        tl.fromTo(ctaWrapperRef.current,
          { clipPath: isMobile ? "inset(15% 5% 15% 5% round 2rem)" : "inset(20% 15% 20% 15% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power2.inOut" }
        );

        tl.fromTo(ctaImageRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power2.inOut" },
          "<"
        );

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
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageWrapper theme="dark">
      <div ref={containerRef}>
      <PageHeader
        subtitle="Work"
        title="Selected Archives"
        description="A curation of our recent work across web engineering and cinematic production. Built with intent, delivered with precision."
      />

      <section className="container-padding pb-56">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          {CATEGORIES.map((cat, index) => (
            <Link 
              key={cat.id}
              href={cat.href}
              ref={el => { cardRefs.current[index] = el; }}
              className="group flex flex-col no-underline text-inherit"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-12 flex items-center justify-center bg-[#050505] shadow-2xl">
                <div 
                  ref={el => { imageRefs.current[index] = el; }}
                  className="absolute top-[-20%] left-0 w-full h-[140%] will-change-transform"
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-12 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
                   <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-sage)] mb-4">{cat.count}</span>
                   <h2 className="font-display text-4xl md:text-7xl leading-none">{cat.title}</h2>
                </div>
              </div>
              <div className="max-w-sm">
                <p className="font-sans font-light text-xl text-white/50 leading-relaxed mb-10">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-white/80 group-hover:text-[var(--color-sage)] transition-colors duration-300">
                  Enter Archive
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
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
                src="/General/aesth_hall.png"
                alt="Build your digital presence"
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
                 Next Steps
               </span>
               <h2 className="font-display text-4xl md:text-7xl lg:text-8xl mb-12 leading-[1.05] tracking-tight max-w-4xl text-white drop-shadow-2xl">
                 Engineering <br/><em className="italic font-light">Authority.</em>
               </h2>
               <Button href="/contact" variant="primary" className="scale-110 md:scale-125 hover:scale-125 transition-transform duration-300">
                 Request a Quote
               </Button>
            </div>
         </div>
      </section>
      </div>
    </PageWrapper>
  );
}
