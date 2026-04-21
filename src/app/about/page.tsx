"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FooterSection from "@/components/sections/homepage/FooterSection";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const VALUES = [
  { n: "01", title: "Precision", desc: "We obsess over every detail. Typography, spacing, motion — each choice is intentional." },
  { n: "02", title: "Craft", desc: "No shortcuts. Every project is built from scratch, tailored to your exact vision." },
  { n: "03", title: "Longevity", desc: "We build for the long game. Scalable systems, lasting aesthetics, sustainable growth." },
  { n: "04", title: "Partnership", desc: "We don't just deliver and disappear. We invest in your success as our own." },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const teamReveal = useReveal();
  const valuesReveal = useReveal();
  const ctaReveal = useReveal();

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "100vh", zIndex: 0 }}>
        <FooterSection />
      </div>

      <main style={{ position: "relative", zIndex: 1, background: "#0a0a0c" }}>

        {/* HERO */}
        <section style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(7rem, 14vw, 12rem) clamp(1.5rem, 8vw, 8rem) clamp(4rem, 8vw, 6rem)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Orb */}
          <div aria-hidden style={{
            position: "absolute", top: "20%", right: "10%",
            width: "clamp(300px, 50vw, 700px)", height: "clamp(300px, 50vw, 700px)",
            borderRadius: "50%", background: "rgba(107,127,98,0.12)", filter: "blur(100px)",
            pointerEvents: "none",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.4, ease: EASE }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <span style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(240,237,232,0.38)",
              display: "block",
              marginBottom: "clamp(1rem, 2.5vw, 1.5rem)",
            }}>
              The Studio
            </span>

            <h1 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 9vw, 9.5rem)",
              lineHeight: 0.92,
              color: "#f0ede8",
              margin: "0 0 clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "-0.01em",
            }}>
              We make the{" "}
              <em style={{ color: "#6B7F62", fontStyle: "italic" }}>unremarkable</em>
              <br />impossible to ignore.
            </h1>

            <p style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
              fontWeight: 300,
              color: "rgba(240,237,232,0.5)",
              lineHeight: 1.75,
              maxWidth: "44ch",
              margin: 0,
            }}>
              Konaverse is a two-person creative studio built on the belief that great design and
              compelling content aren't luxuries — they're the difference between being seen and being remembered.
            </p>
          </motion.div>
        </section>

        {/* TEAM — LIGHT SECTION */}
        <section
          ref={teamReveal.ref}
          style={{
            background: "#f0ede8",
            padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 8vw, 8rem)",
          }}
        >
          <div style={{
            opacity: teamReveal.visible ? 1 : 0,
            transform: teamReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}>
            <span style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#6B7F62",
              fontWeight: 500,
            }}>
              The People
            </span>

            <h2 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "#141414",
              margin: "clamp(0.75rem, 1.5vw, 1rem) 0 clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}>
              Two minds. One vision.
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "clamp(1.5rem, 3vw, 2.5rem)",
            }}>
              {/* Konstantinos */}
              <div>
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  background: "#e0ddd7",
                  marginBottom: "1.5rem",
                }}>
                  <Image
                    src="/About/konstantinos.jpg"
                    alt="Konstantinos"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(20,20,20,0.55) 0%, transparent 50%)",
                  }} />
                  <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                    <span style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(240,237,232,0.6)",
                    }}>
                      The Architect
                    </span>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: "#141414",
                  margin: "0 0 0.5rem",
                }}>
                  Konstantinos
                </h3>
                <p style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 300,
                  color: "rgba(20,20,20,0.55)",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  The technical foundation. Konstantinos engineers the systems that bring ideas to life —
                  from architecture to pixel-perfect execution. He believes the best code is invisible.
                </p>
              </div>

              {/* Nabil */}
              <div>
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  background: "#e0ddd7",
                  marginBottom: "1.5rem",
                }}>
                  <Image
                    src="/About/nabil.jpg"
                    alt="Nabil"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(20,20,20,0.55) 0%, transparent 50%)",
                  }} />
                  <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                    <span style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(240,237,232,0.6)",
                    }}>
                      The Visionary
                    </span>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: "#141414",
                  margin: "0 0 0.5rem",
                }}>
                  Nabil
                </h3>
                <p style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 300,
                  color: "rgba(20,20,20,0.55)",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  The creative force. Nabil shapes the narratives and aesthetics that define each project —
                  translating abstract brand ambitions into tangible, arresting visual identities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section
          ref={valuesReveal.ref}
          style={{
            padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 8vw, 8rem)",
            background: "#0a0a0c",
          }}
        >
          <div style={{
            opacity: valuesReveal.visible ? 1 : 0,
            transform: valuesReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}>
            <span style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(240,237,232,0.35)",
              fontWeight: 400,
            }}>
              What We Stand For
            </span>
            <h2 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "#f0ede8",
              margin: "clamp(0.75rem, 1.5vw, 1rem) 0 clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}>
              Our values.
            </h2>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {VALUES.map((v, i) => (
                <div key={v.n} style={{
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr auto",
                  alignItems: "start",
                  gap: "clamp(1rem, 3vw, 3rem)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
                  borderBottom: i !== VALUES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    color: "#6B7F62",
                    fontWeight: 200,
                    paddingTop: "0.2rem",
                  }}>{v.n}</span>
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-jakarta), sans-serif",
                      fontWeight: 500,
                      fontSize: "clamp(1rem, 2vw, 1.4rem)",
                      color: "#f0ede8",
                      margin: "0 0 0.5rem",
                      letterSpacing: "0.01em",
                    }}>{v.title}</h3>
                    <p style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontSize: "0.88rem",
                      color: "rgba(240,237,232,0.42)",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      margin: 0,
                      maxWidth: "44ch",
                    }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          ref={ctaReveal.ref}
          style={{
            padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 8vw, 8rem)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "clamp(1.5rem, 3vw, 2rem)",
          }}
        >
          <div style={{
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(24px)",
            transition: "opacity 1s ease, transform 1s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "clamp(1.5rem, 3vw, 2rem)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              color: "#f0ede8",
              margin: 0,
              lineHeight: 1.05,
              maxWidth: "18ch",
            }}>
              Ready to build something remarkable?
            </h2>
            <Link href="/contact" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#0a0a0c",
              background: "#f0ede8",
              borderRadius: 40,
              textDecoration: "none",
              fontFamily: "var(--font-jakarta), sans-serif",
              padding: "14px 28px",
            }}>
              Get in Touch
              <svg width={11} height={11} viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>

      </main>

      <div aria-hidden style={{ height: "100vh", position: "relative", zIndex: 1, pointerEvents: "none" }} />
    </div>
  );
}
