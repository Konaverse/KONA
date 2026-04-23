"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";


const ACTS = [
  {
    num: "01",
    label: "Strategy",
    body: "We begin with deep discovery — learning your brand, your audience, and what meaningful success looks like before a single line of code is written.",
    img: "/General/aesth_conf_room.png",
  },
  {
    num: "02",
    label: "Creation",
    body: "Design and engineering move in parallel. Precision code meets cinematic craft to build experiences that don't just function — they resonate.",
    img: "/a_pro_camera.png",
  },
  {
    num: "03",
    label: "Delivery",
    body: "Every launch is intentional — optimised, refined, and built to perform from day one. We don't ship until it earns the name.",
    img: "/General/aesth_road.png",
  },
] as const;

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scenes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
      const imgs = imgRefs.current.filter(Boolean) as HTMLDivElement[];
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (scenes.length < 3 || !sectionRef.current) return;

      // ── Scene crossfade timeline ──────────────────────────────────────
      // Total duration = 3.0 units, one unit per act.
      // Crossfades centred at t=1.0 (33%) and t=2.0 (66%).
      const FADE = 0.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      tl
        .to(scenes[0], { opacity: 0, ease: "none", duration: FADE }, 1 - FADE / 2)
        .to(scenes[1], { opacity: 1, ease: "none", duration: FADE }, 1 - FADE / 2)
        .to(scenes[1], { opacity: 0, ease: "none", duration: FADE }, 2 - FADE / 2)
        .to(scenes[2], { opacity: 1, ease: "none", duration: FADE }, 2 - FADE / 2)
        // noop tween to pin timeline total at 3.0
        .to(scenes[2], { opacity: 1, ease: "none", duration: 0.01 }, 2.99);

      // ── Parallax: all images drift slowly through the full 300vh ─────
      imgs.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 2,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // ── Progress dots ────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          dots.forEach((dot, i) => {
            const active =
              (i === 0 && p < 0.38) ||
              (i === 1 && p >= 0.28 && p < 0.72) ||
              (i === 2 && p >= 0.62);
            gsap.to(dot, {
              opacity: active ? 1 : 0.28,
              scale: active ? 1.6 : 1,
              duration: 0.35,
              overwrite: true,
            });
          });
        },
      });

      // ── Scene-0 entrance ─────────────────────────────────────────────
      gsap.fromTo(
        ".process-scene-0-content",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-[#050505]"
      style={{ marginTop: "-1px" }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">

        {ACTS.map((act, i) => (
          <div
            key={act.num}
            ref={(el) => { sceneRefs.current[i] = el; }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Background image — scaled up to give parallax travel room */}
            <div
              ref={(el) => { imgRefs.current[i] = el; }}
              className="absolute inset-0 scale-[1.14] will-change-transform"
            >
              <Image
                src={act.img}
                alt={act.label}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>

            {/* Colour grading overlays */}
            <div className="absolute inset-0 bg-black/52" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

            {/* Content shell */}
            <div
              className={`absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-16 lg:px-24 pb-14 md:pb-20${i === 0 ? " process-scene-0-content" : ""}`}
            >
              {/* Bottom: title + body */}
              <div className="flex flex-col gap-4 md:gap-5">
                <h2
                  className="font-display font-light uppercase leading-[0.9] tracking-[-0.02em] text-[#f0ede8]"
                  style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
                >
                  {act.label}
                </h2>

                <p
                  className="font-sans font-light leading-relaxed text-white/50 max-w-[34ch]"
                  style={{ fontSize: "clamp(0.8rem, 1.05vw, 0.95rem)" }}
                >
                  {act.body}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none">
          {ACTS.map((_, i) => (
            <span
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="block rounded-full bg-white"
              style={{
                width: 6,
                height: 6,
                opacity: i === 0 ? 1 : 0.28,
                transform: i === 0 ? "scale(1.6)" : "scale(1)",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
