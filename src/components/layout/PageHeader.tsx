"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";
import SplitType from "split-type";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  theme?: "dark" | "light";
}

export default function PageHeader({
  title,
  subtitle,
  description,
  className,
  theme = "dark",
}: PageHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let splitTitle: SplitType | null = null;

    const ctx = gsap.context(() => {
      if (!titleRef.current) return;

      // 1. Split title into lines
      splitTitle = new SplitType(titleRef.current, { types: "lines" });
      
      // Wrap each line in a mask (overflow-hidden)
      splitTitle.lines?.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.className = "mask-line overflow-hidden py-1 -my-1";
        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1.2 },
      });

      // 2. Animation sequence
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current, {
           opacity: 0,
           y: 10,
        }, {
           opacity: 1,
           y: 0,
           duration: 1,
        }, 0.2);
      }

      if (splitTitle.lines) {
        gsap.set(titleRef.current, { opacity: 1 });
        tl.fromTo(splitTitle.lines, {
          yPercent: 100,
        }, {
          yPercent: 0,
          stagger: 0.1,
        }, 0.4);
      }

      if (descriptionRef.current) {
        tl.fromTo(descriptionRef.current, {
          opacity: 0,
          y: 20,
        }, {
          opacity: 1,
          y: 0,
          duration: 1.4,
        }, 0.8);
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (splitTitle) splitTitle.revert();
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      ref={containerRef}
      className={cn(
        "relative flex flex-col justify-end pt-40 pb-20 md:pt-60 md:pb-32 container-padding",
        isDark ? "bg-[var(--color-near-black)] text-[var(--color-off-white)]" : "bg-[var(--color-soft-white)] text-[var(--color-obsidian)]",
        className
      )}
    >
      <div className="max-w-6xl w-full">
        {subtitle && (
          <span
            ref={subtitleRef}
            className={cn(
              "block mb-6 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-40",
              !isDark && "text-[var(--color-sage)] opacity-100 font-semibold"
            )}
          >
            {subtitle}
          </span>
        )}
        
        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-7xl lg:text-9xl leading-[0.95] tracking-tight opacity-0"
        >
          {title}
        </h1>

        {description && (
          <p
            ref={descriptionRef}
            className={cn(
              "mt-8 md:mt-12 max-w-lg font-sans font-light text-base md:text-xl leading-relaxed opacity-0",
              isDark ? "text-white/50" : "text-black/60"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
