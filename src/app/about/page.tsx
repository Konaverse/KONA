"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import TeamMemberCard from "@/components/ui/team-member-card";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

const VALUES = [
  { n: "01", title: "Precision", desc: "We obsess over every detail. Typography, spacing, motion — each choice is intentional and serves a greater narrative." },
  { n: "02", title: "Craft", desc: "No shortcuts. Every project is built from scratch, tailored to your exact vision with uncompromising technical standards." },
  { n: "03", title: "Longevity", desc: "We build for the long game. Scalable systems, lasting aesthetics, and sustainable digital growth for premium brands." },
  { n: "04", title: "Partnership", desc: "We don't just deliver and disappear. We become your dedicated digital team, invested in your success as our own." },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Two minds title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 85%", toggleActions: "play none none none" }
          }
        );
      }

      // 2. Global Entrance Animations
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

      // 3. Values Stagger
      valuesRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: -30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
          }
        );
      });

      // 5. Immersive CTA Animation
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
        subtitle="The Studio"
        title="We make the unremarkable impossible to ignore."
        description="Konaverse is a two-person creative studio built on the belief that great design and compelling content aren't luxuries — they're the difference between being seen and being remembered."
      />

      {/* The People — Transition to Light */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding pb-32 md:pb-48">
        <div className="mb-20" ref={titleRef}>
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-semibold">The People</span>
           <h2 className="font-display text-4xl md:text-7xl leading-[1.1] max-w-2xl">Two minds. One vision for digital authority.</h2>
        </div>

        <div className="flex flex-col">
          <TeamMemberCard
            position="left"
            jobPosition="01 / The Architect"
            firstName="Konstantinos"
            lastName=""
            imageUrl="/About/konstantinos.jpg"
            description="The technical foundation. Konstantinos engineers the systems that bring ideas to life — from core architecture to pixel-perfect execution. He believes the best code is invisible but felt through performance."
            extraText="With a deep background in computer science and full-stack architecture, he ensures that the backend matches the aesthetic ambition of the frontend."
            href="/contact"
          />

          <TeamMemberCard
            position="right"
            jobPosition="02 / The Visionary"
            firstName="Nabil"
            lastName=""
            imageUrl="/About/nabil.jpg"
            description="The creative force. Nabil shapes the narratives and aesthetics that define each project — translating abstract brand ambitions into tangible, arresting visual identities and cinematic films."
            extraText="An eye honed by years in cinematography and design, his work connects strategy to raw emotional impact, ensuring every project is unforgettable."
            href="/contact"
          />
        </div>
      </section>

      {/* Values */}
      <section className="container-padding py-40">
        <div className="mb-20">
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block">Philosophy</span>
           <h2 className="font-display text-4xl md:text-6xl text-[var(--color-off-white)]">Our Values.</h2>
        </div>

        <div className="border-t border-white/5">
          {VALUES.map((v, i) => (
            <div 
              key={v.n}
              ref={el => { valuesRef.current[i] = el; }}
              className="grid grid-cols-1 md:grid-cols-12 py-12 md:py-20 border-b border-white/5 items-start"
            >
              <div className="md:col-span-1">
                <span className="font-mono text-[10px] text-[var(--color-sage)] italic">{v.n}</span>
              </div>
              <div className="md:col-span-4 mt-2 md:mt-0">
                 <h3 className="font-display text-2xl md:text-3xl text-[var(--color-off-white)]">{v.title}</h3>
              </div>
              <div className="md:col-span-6 mt-4 md:mt-0">
                <p className="font-sans font-light text-base md:text-lg text-white/50 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
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
                src="/homepage/cta_background.jpeg"
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
