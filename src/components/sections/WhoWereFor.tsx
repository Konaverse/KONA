"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";

const STATEMENTS = [
  {
    headline: "YOUR WEBSITE ISN'T WORKING FOR YOU",
    subline: "A site that doesn't convert is just a digital brochure collecting dust.",
  },
  {
    headline: "YOUR BRAND DESERVES TO BE SEEN",
    subline: "You've built something real. It's time the world knows it exists.",
  },
  {
    headline: "YOUR CONTENT ISN'T REACHING ANYONE",
    subline: "Posting without strategy is shouting into the void. There's a better way.",
  },
  {
    headline: "YOUR COMPETITORS ARE ALREADY AHEAD",
    subline: "While you're figuring it out, they're getting the clients that should be yours.",
  },
];

export interface WhoWereForRef {
  container: HTMLDivElement | null;
  statements: HTMLDivElement[];
  closingLine: HTMLDivElement | null;
}

const WhoWereFor = forwardRef<WhoWereForRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRefs = useRef<HTMLDivElement[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get container() { return containerRef.current; },
    get statements() { return statementRefs.current; },
    get closingLine() { return closingRef.current; },
  }));

  return (
    <section
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    >
      {/* Content wrapper — absolutely positioned to overlay hero area within pinned container */}
      <div className="h-full w-full flex items-center justify-end px-[clamp(2rem,8vw,8rem)] max-md:px-6">
        <div className="w-full max-w-[50%] flex flex-col items-end text-right space-y-[6vh] max-md:max-w-full max-md:items-center max-md:text-center">
          {STATEMENTS.map((s, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) statementRefs.current[i] = el;
              }}
              style={{ opacity: 0, transform: "translateX(50px)", filter: "blur(10px)" }}
            >
              <h2 className="font-monument font-bold text-[clamp(1.5rem,4vw,3.5rem)] leading-tight text-[#f0fff4] mb-4">
                {s.headline}
              </h2>
              <p className="font-sans text-[clamp(0.9rem,1.5vw,1.2rem)] text-[#668877] max-md:max-w-[90%] mx-auto">
                {s.subline}
              </p>
            </div>
          ))}

          <div
            ref={closingRef}
            className="opacity-0 pt-8"
          >
            <p className="font-mono text-[clamp(1rem,2vw,1.5rem)] tracking-[0.4em] uppercase text-[#00ff88]">
              That's why we exist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

WhoWereFor.displayName = "WhoWereFor";

export default WhoWereFor;
