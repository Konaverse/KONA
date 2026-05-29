"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import TextOpacity from "@/components/animations/TextOpacity";

export default function ManifestoSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Same entry as Hero → About: tilt in, straighten as it closes over Services.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  return (
    <section
      id="manifesto-scroll-trigger"
      ref={ref}
      className="relative w-full h-[300vh]"
      style={{ zIndex: 30 }}
    >
      <motion.div
        className="sticky top-0 flex flex-col justify-center items-center w-full min-h-screen text-center px-6 md:px-12"
        style={{
          rotateX,
          scale,
          transformPerspective: 1400,
          transformOrigin: "50% 0%",
          willChange: "transform",
          background: "#faf7f2",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.5)",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        <TextOpacity
          trigger="#manifesto-scroll-trigger"
          className="w-full md:w-[63%] font-light text-[#111111] leading-tight text-[clamp(1.5rem,3.5vw,2.8rem)]"
        >
          Every project we take on starts with one question: does this deserve to exist online? If the answer is yes, we build it like it matters. Because it does.
        </TextOpacity>
      </motion.div>
    </section>
  );
}
