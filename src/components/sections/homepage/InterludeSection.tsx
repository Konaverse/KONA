"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type Card = { tag: string; title: string; img: string };

const CARDS: Card[] = [
  {
    tag: "Visual Systems",
    title: "Brand Identity",
    img: "/General/A_close-up_of_a_human_202605290256.jpeg",
  },
  {
    tag: "Core craft",
    title: "Web Development",
    img: "/Hero/A_futuristic_workspace_featuring_holographic_202605290214.jpeg",
  },
  {
    tag: "Interfaces",
    title: "UI / UX Design",
    img: "/Hero/A_heavily_distorted_close-up_of_202605290214.jpeg",
  },
  {
    tag: "Core Web Vitals",
    title: "SEO & Performance",
    img: "/General/The_interior_of_a_futuristic_202605290256.jpeg",
  },
  {
    tag: "Conversion",
    title: "E-commerce",
    img: "/Hero/hero_background.jpeg",
  },
  {
    tag: "Insight & Reports",
    title: "Analytics",
    img: "/About/A_series_of_vertical_architectural_202605292032.jpeg",
  },
];

const DEFAULT_ACTIVE = 1;

function ServiceCard({
  card,
  active,
  onActivate,
}: {
  card: Card;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      className={`interlude-card${active ? " active" : ""}`}
      onMouseEnter={onActivate}
      onClick={onActivate}
      data-cursor="link"
    >
      {/* image background — fades in when active */}
      <div className="card-media" aria-hidden>
        <Image src={card.img} alt="" fill sizes="320px" style={{ objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,8,12,0.35) 0%, rgba(8,8,12,0.5) 45%, rgba(8,8,12,0.9) 100%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <span className="card-tag">{card.tag}</span>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 className="card-title">{card.title}</h3>
        <span className="card-cta">
          Get started
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 8h6M8 5l3 3-3 3"
              stroke="#0a0a0a"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function InterludeSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(DEFAULT_ACTIVE);

  // Same tilt-in as Hero → About: tilts and scrolls over the pinned Projects.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  // Pin the section's LAST 100vh (negative-top sticky) so the CTA can tilt and
  // scroll over the held final frame — same mechanic as Projects → Interlude.
  const [stickyTop, setStickyTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setStickyTop(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={ref} style={{ position: "sticky", top: stickyTop, zIndex: 50 }}>
      <motion.div
        style={{
          rotateX,
          scale,
          transformPerspective: 1400,
          transformOrigin: "50% 0%",
          willChange: "transform",
          background: "#0a0a0a",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.6)",
          minHeight: "150svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(4rem, 12vh, 10rem)",
          paddingTop: "clamp(5rem, 14vh, 11rem)",
          paddingBottom: "clamp(5rem, 14vh, 11rem)",
        }}
      >
        <div className="container-padding">
          {/* Headline */}
          <h2 className="interlude-headline">
            <span className="strong">We craft striking digital</span>
            <br />
            <span className="strong">experiences &amp; brands</span>
            <br />
            <span className="muted">that help your business</span>
          </h2>

          {/* Paragraphs flanking the muted continuation */}
          <div className="interlude-head-row">
            <p className="interlude-copy">
              We blend strategy, design, and engineering to build digital
              products that inspire, perform, and scale across every platform
              and touchpoint.
            </p>
            <span className="interlude-grow muted">grow fast</span>
            <p className="interlude-copy">
              Our process pairs craft with rigor — fast, refined websites that
              tell your story, strengthen identity, and convert at every step.
            </p>
          </div>
        </div>

        {/* Card row */}
        <div className="container-padding">
          <div
            className="interlude-cards"
            onMouseLeave={() => setActive(DEFAULT_ACTIVE)}
          >
            {CARDS.map((c, i) => (
              <ServiceCard
                key={c.title}
                card={c}
                active={i === active}
                onActivate={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
