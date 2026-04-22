"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
  const personRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const valuesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

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

      // 2. People (Parallax & Entrance)
      personRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
        
        const imgWrap = imageWrappersRef.current[i];
        if (imgWrap) {
          gsap.fromTo(imgWrap, { yPercent: -15 }, { yPercent: 15, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
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

      // 4. CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none none" }
          }
        );
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {/* Konstantinos */}
          <div className="flex flex-col group" ref={el => { personRefs.current[0] = el; }}>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl mb-10 bg-[var(--color-pale-warm)]">
              <div 
                ref={el => { imageWrappersRef.current[0] = el; }}
                className="absolute top-[-20%] left-0 w-full h-[140%] will-change-transform"
              >
                <Image
                  src="/About/konstantinos.jpg"
                  alt="Konstantinos — The Architect"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-sage)] mb-4">01 / The Architect</span>
            <h3 className="font-display text-3xl mb-6">Konstantinos</h3>
            <p className="font-sans font-light text-lg text-black/60 leading-relaxed max-w-sm">
              The technical foundation. Konstantinos engineers the systems that bring ideas to life — from core architecture to pixel-perfect execution. He believes the best code is invisible but felt through performance.
            </p>
          </div>

          {/* Nabil */}
          <div className="flex flex-col group md:pt-40" ref={el => { personRefs.current[1] = el; }}>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl mb-10 bg-[var(--color-pale-warm)]">
              <div 
                ref={el => { imageWrappersRef.current[1] = el; }}
                className="absolute top-[-20%] left-0 w-full h-[140%] will-change-transform"
              >
                <Image
                  src="/About/nabil.jpg"
                  alt="Nabil — The Visionary"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-sage)] mb-4">02 / The Visionary</span>
            <h3 className="font-display text-3xl mb-6">Nabil</h3>
            <p className="font-sans font-light text-lg text-black/60 leading-relaxed max-w-sm">
              The creative force. Nabil shapes the narratives and aesthetics that define each project — translating abstract brand ambitions into tangible, arresting visual identities and cinematic films.
            </p>
          </div>
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

      {/* CTA */}
      <section className="container-padding py-40 text-center flex flex-col items-center border-t border-white/5">
         <div ref={ctaRef} className="flex flex-col items-center">
           <h2 className="font-display text-4xl md:text-7xl mb-12 leading-tight max-w-3xl">
             Ready to build something <em className="italic text-[var(--color-sage)]">remarkable</em>?
           </h2>
           <Button href="/contact" variant="primary">
             Get in Touch
           </Button>
         </div>
      </section>
      </div>
    </PageWrapper>
  );
}
