"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/sections/homepage/FooterSection";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useReveal(threshold = 0.1) {
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

const TIERS = [
  {
    n: "01",
    name: "Foundation",
    tagline: "Your digital presence, established.",
    desc: "Built for brands entering the digital space and needing a strong, credible starting point.",
    includes: [
      "Custom UI & UX Design",
      "Responsive Web Development",
      "On-page SEO Setup",
      "1 round of revisions",
      "30-day post-launch support",
    ],
    ideal: "Startups & New Brands",
  },
  {
    n: "02",
    name: "Signature",
    tagline: "Elevated. Refined. Unmistakably you.",
    desc: "For established brands demanding a premium experience that differentiates them in their market.",
    includes: [
      "Everything in Foundation",
      "Custom Design System",
      "Advanced Animations & Interactions",
      "Video Content (1 brand film)",
      "SEO Strategy & Content Planning",
      "3 months post-launch support",
    ],
    ideal: "Growing Businesses",
    featured: true,
  },
  {
    n: "03",
    name: "Architect",
    tagline: "For those who refuse to be ordinary.",
    desc: "A full creative partnership for visionaries redefining their industry. We become your digital team.",
    includes: [
      "Everything in Signature",
      "Full Brand Identity System",
      "Cinematic Brand Film Series",
      "Performance & Analytics Dashboard",
      "Dedicated Account Manager",
      "Ongoing retainer available",
    ],
    ideal: "Established & Premium Brands",
  },
];

const FAQ = [
  {
    q: "Do you show prices upfront?",
    a: "We don't publish fixed prices because every project is different. Scope, complexity, and timeline all affect cost. We'd rather have a conversation and give you an accurate number.",
  },
  {
    q: "How long does a typical project take?",
    a: "Foundation projects typically run 4–6 weeks. Signature 8–12 weeks. Architect engagements vary based on scope — we'll define a clear timeline before we start.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. Our clients are based across Europe, the Middle East, and North America. We work async and schedule live sessions around your timezone.",
  },
  {
    q: "What's your payment structure?",
    a: "We typically work with a 50% deposit to begin, with the remaining balance split across key project milestones.",
  },
];

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tiersReveal = useReveal();
  const faqReveal = useReveal();
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
          <div aria-hidden style={{
            position: "absolute", bottom: "10%", right: "5%",
            width: "clamp(250px, 45vw, 600px)", height: "clamp(250px, 45vw, 600px)",
            borderRadius: "50%", background: "rgba(107,127,98,0.1)", filter: "blur(90px)",
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
              Investment
            </span>

            <h1 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(2.8rem, 8vw, 9rem)",
              lineHeight: 0.92,
              color: "#f0ede8",
              margin: "0 0 clamp(1.5rem, 3vw, 2.5rem)",
              letterSpacing: "-0.01em",
            }}>
              Transparent value.
              <br />
              <em style={{ color: "#6B7F62", fontStyle: "italic" }}>Custom craft.</em>
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
              No hidden fees. No inflated packages. We price based on what your project actually needs
              — and we'll tell you exactly what that looks like before we start.
            </p>
          </motion.div>
        </section>

        {/* TIERS — LIGHT SECTION */}
        <section
          ref={tiersReveal.ref}
          style={{
            background: "#f0ede8",
            padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 8vw, 8rem)",
          }}
        >
          <div style={{
            opacity: tiersReveal.visible ? 1 : 0,
            transform: tiersReveal.visible ? "none" : "translateY(32px)",
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
              Service Tiers
            </span>
            <h2 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "#141414",
              margin: "clamp(0.75rem, 1.5vw, 1rem) 0 clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}>
              Find your fit.
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)",
            }}>
              {TIERS.map((tier) => (
                <div
                  key={tier.n}
                  style={{
                    background: tier.featured ? "#141414" : "#fff",
                    borderRadius: "1.25rem",
                    padding: "clamp(1.75rem, 3vw, 2.5rem)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(1.25rem, 2.5vw, 1.75rem)",
                    border: tier.featured ? "none" : "1px solid rgba(0,0,0,0.07)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {tier.featured && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                      background: "linear-gradient(90deg, #6B7F62, rgba(107,127,98,0.3))",
                    }} />
                  )}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.62rem",
                        letterSpacing: "0.2em",
                        color: tier.featured ? "#6B7F62" : "rgba(20,20,20,0.35)",
                        fontWeight: 200,
                      }}>{tier.n}</span>
                      {tier.featured && (
                        <span style={{
                          fontFamily: "var(--font-jakarta), sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#6B7F62",
                          fontWeight: 500,
                          background: "rgba(107,127,98,0.12)",
                          padding: "4px 10px",
                          borderRadius: 40,
                        }}>Popular</span>
                      )}
                    </div>
                    <h3 style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
                      textTransform: "uppercase",
                      color: tier.featured ? "#f0ede8" : "#141414",
                      margin: "0 0 0.4rem",
                    }}>{tier.name}</h3>
                    <p style={{
                      fontFamily: "var(--font-display-serif), serif",
                      fontStyle: "italic",
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                      color: tier.featured ? "rgba(240,237,232,0.55)" : "rgba(20,20,20,0.5)",
                      margin: 0,
                      fontWeight: 300,
                    }}>{tier.tagline}</p>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                    color: tier.featured ? "rgba(240,237,232,0.45)" : "rgba(20,20,20,0.5)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>{tier.desc}</p>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {tier.includes.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                        <span style={{ color: "#6B7F62", marginTop: "0.2rem", flexShrink: 0, fontSize: "0.8rem" }}>✓</span>
                        <span style={{
                          fontFamily: "var(--font-geist-sans), sans-serif",
                          fontSize: "0.83rem",
                          fontWeight: 300,
                          color: tier.featured ? "rgba(240,237,232,0.65)" : "rgba(20,20,20,0.65)",
                          lineHeight: 1.5,
                        }}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "auto" }}>
                    <div style={{
                      fontFamily: "var(--font-jakarta), sans-serif",
                      fontSize: "0.62rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: tier.featured ? "rgba(240,237,232,0.3)" : "rgba(20,20,20,0.35)",
                      marginBottom: "1rem",
                    }}>
                      Ideal for: {tier.ideal}
                    </div>
                    <Link href="/contact" style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      fontFamily: "var(--font-jakarta), sans-serif",
                      padding: "13px 20px",
                      borderRadius: 40,
                      border: tier.featured ? "none" : "1px solid rgba(20,20,20,0.15)",
                      background: tier.featured ? "#f0ede8" : "transparent",
                      color: tier.featured ? "#141414" : "#141414",
                    }}>
                      Request a Quote
                      <svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          ref={faqReveal.ref}
          style={{
            padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 8vw, 8rem)",
            background: "#0a0a0c",
          }}
        >
          <div style={{
            opacity: faqReveal.visible ? 1 : 0,
            transform: faqReveal.visible ? "none" : "translateY(32px)",
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
              Common Questions
            </span>
            <h2 style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "#f0ede8",
              margin: "clamp(0.75rem, 1.5vw, 1rem) 0 clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}>
              Still have questions?
            </h2>

            <div style={{
              maxWidth: "680px",
              display: "flex",
              flexDirection: "column",
            }}>
              {FAQ.map((item, i) => (
                <div key={i} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: "clamp(1.25rem, 2.5vw, 1.75rem) 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-jakarta), sans-serif",
                      fontWeight: 500,
                      fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                      color: "#f0ede8",
                      lineHeight: 1.4,
                    }}>{item.q}</span>
                    <svg
                      width={14} height={14} viewBox="0 0 14 14" fill="none"
                      style={{
                        flexShrink: 0,
                        transform: openFaq === i ? "rotate(180deg)" : "none",
                        transition: "transform 0.4s ease",
                        color: "#6B7F62",
                      }}
                    >
                      <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div style={{
                    overflow: "hidden",
                    maxHeight: openFaq === i ? "200px" : "0",
                    transition: "max-height 0.4s ease",
                  }}>
                    <p style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 300,
                      color: "rgba(240,237,232,0.5)",
                      lineHeight: 1.75,
                      paddingBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
                      margin: 0,
                    }}>{item.a}</p>
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
              maxWidth: "20ch",
            }}>
              Let's talk about your project.
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
