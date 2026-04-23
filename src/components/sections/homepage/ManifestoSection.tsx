"use client";

import TextOpacity from "@/components/animations/TextOpacity";

export default function ManifestoSection() {
  return (
    <section
      id="manifesto-scroll-trigger"
      className="relative w-full bg-[#faf7f2] h-[300vh]"
    >
      <div 
        className="sticky top-0 flex flex-col justify-center items-center w-full min-h-screen text-center px-6 md:px-12"
      >
        <TextOpacity 
           trigger="#manifesto-scroll-trigger" 
           className="w-full md:w-[63%] font-display font-light text-[#111111] leading-tight text-[clamp(1.5rem,3.5vw,2.8rem)]"
        >
          Every project we take on starts with one question: does this deserve to exist online? If the answer is yes, we build it like it matters. Because it does.
        </TextOpacity>
      </div>
    </section>
  );
}
