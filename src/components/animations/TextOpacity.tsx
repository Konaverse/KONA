"use client";

import { useEffect, useRef, ReactNode } from "react";
import SplitType from "split-type";
import { gsap } from "@/utils/gsap";

interface TextOpacityProps {
  children: ReactNode;
  trigger?: HTMLElement | string | null;
  className?: string;
}

export default function TextOpacity({ children, trigger, className }: TextOpacityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let splitted: SplitType | null = null;
    
    const ctx = gsap.context(() => {});

    const timer = setTimeout(() => {
      ctx.add(() => {
        // We use split-type to chunk into words for staggered animation
        splitted = new SplitType(element, { types: "words" });

        if (!splitted.words || splitted.words.length === 0) return;

        splitted.words.forEach((word) => gsap.set(word, { opacity: 0 }));

        // Fly in randomly from Z & scatter across X/Y plane while scrub scrolling
        gsap.fromTo(
          splitted.words,
          {
            willChange: "opacity, transform",
            z: () => gsap.utils.random(500, 950),
            opacity: 0,
            xPercent: () => gsap.utils.random(-100, 100),
            yPercent: () => gsap.utils.random(-10, 10),
            rotationX: () => gsap.utils.random(-90, 90),
          },
          {
            ease: "expo",
            opacity: 1,
            rotationX: 0,
            rotationY: 0,
            xPercent: 0,
            yPercent: 0,
            z: 0,
            scrollTrigger: {
              trigger: trigger || element,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              scroller: window, // Scroller is just window in our case instead of custom 'main' container
              invalidateOnRefresh: true,
            },
            stagger: {
              each: 0.006,
              from: "random",
            },
          }
        );
      });
    }, 150); // Slight delay ensures fonts and layout are ready

    return () => {
      clearTimeout(timer);
      ctx.revert();
      if (splitted) splitted.revert();
    };
  }, [trigger]);

  return (
    <div ref={containerRef} className={className} style={{ perspective: "1000px" }}>
      {children}
    </div>
  );
}
