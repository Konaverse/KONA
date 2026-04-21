"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FooterSection from "@/components/sections/homepage/FooterSection";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ACCENT = "#6B7F62";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.75rem",
  padding: "clamp(0.9rem, 1.8vw, 1.1rem) clamp(1rem, 2vw, 1.25rem)",
  fontSize: "0.92rem",
  fontWeight: 300,
  color: "#f0ede8",
  fontFamily: "var(--font-geist-sans), sans-serif",
  outline: "none",
  transition: "border-color 0.3s ease, background 0.3s ease",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontFamily: "var(--font-jakarta), sans-serif",
  fontSize: "0.62rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase" as const,
  color: "rgba(240,237,232,0.38)",
  fontWeight: 400,
  display: "block",
  marginBottom: "0.55rem",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

const SERVICES = [
  "Web Design",
  "Web Development",
  "Videography",
  "Video Editing",
  "SEO Strategy",
  "Multiple Services",
  "Not sure yet",
];

const BUDGETS = [
  "Under €5,000",
  "€5,000 – €15,000",
  "€15,000 – €30,000",
  "€30,000+",
  "Let's discuss",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      service: fd.get("service") as string,
      budget: fd.get("budget") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setState("success");
        formRef.current?.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  const getFocusBorder = (name: string) =>
    focused === name ? `1px solid ${ACCENT}` : inputStyle.border;
  const getFocusBg = (name: string) =>
    focused === name ? "rgba(107,127,98,0.06)" : inputStyle.background;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "100vh", zIndex: 0 }}>
        <FooterSection />
      </div>

      <main style={{ position: "relative", zIndex: 1, background: "#0a0a0c" }}>

        {/* PAGE */}
        <section style={{
          minHeight: "100svh",
          padding: "clamp(7rem, 14vw, 12rem) clamp(1.5rem, 8vw, 8rem) clamp(4rem, 8vw, 8rem)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background orbs */}
          <div aria-hidden style={{
            position: "absolute", top: "15%", left: "-5%",
            width: "clamp(200px, 40vw, 550px)", height: "clamp(200px, 40vw, 550px)",
            borderRadius: "50%", background: "rgba(107,127,98,0.08)", filter: "blur(80px)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
            gap: "clamp(3rem, 8vw, 8rem)",
            alignItems: "start",
            position: "relative",
            zIndex: 1,
          }}>

            {/* Left — Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.4, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}
            >
              <div>
                <span style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,232,0.38)",
                  display: "block",
                  marginBottom: "clamp(1rem, 2.5vw, 1.5rem)",
                }}>
                  Get in Touch
                </span>

                <h1 style={{
                  fontFamily: "var(--font-display-serif), serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.5rem, 7vw, 7rem)",
                  lineHeight: 0.93,
                  color: "#f0ede8",
                  margin: "0 0 clamp(1.5rem, 3vw, 2rem)",
                  letterSpacing: "-0.01em",
                }}>
                  Let's build
                  <br />
                  <em style={{ color: ACCENT, fontStyle: "italic" }}>something</em>
                  <br />
                  remarkable.
                </h1>

                <p style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "clamp(0.88rem, 1.4vw, 1rem)",
                  fontWeight: 300,
                  color: "rgba(240,237,232,0.48)",
                  lineHeight: 1.75,
                  maxWidth: "38ch",
                  margin: 0,
                }}>
                  Whether you have a clear brief or a rough idea, we'd love to hear from you.
                  We respond to every inquiry within 24 hours.
                </p>
              </div>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <span style={labelStyle}>Email</span>
                  <a href="mailto:info@kona-verse.com" style={{
                    fontFamily: "var(--font-jakarta), sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 400,
                    color: "#f0ede8",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#f0ede8")}
                  >
                    info@kona-verse.com
                  </a>
                </div>

                <div>
                  <span style={labelStyle}>Based In</span>
                  <span style={{
                    fontFamily: "var(--font-jakarta), sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 400,
                    color: "rgba(240,237,232,0.6)",
                  }}>
                    Cyprus · Available Worldwide
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <div style={{
                paddingTop: "clamp(1.5rem, 3vw, 2rem)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
              }}>
                {[
                  { label: "Services", href: "/services/web-design" },
                  { label: "Projects", href: "/projects/web-development" },
                  { label: "Pricing", href: "/pricing" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} style={{
                    fontFamily: "var(--font-jakarta), sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(240,237,232,0.38)",
                    textDecoration: "none",
                    transition: "color 0.3s",
                    fontWeight: 400,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.38)")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
            >
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.5rem",
                padding: "clamp(1.75rem, 4vw, 3rem)",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Top sheen */}
                <div aria-hidden style={{
                  position: "absolute", inset: 0, borderRadius: "inherit",
                  background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 45%)",
                  pointerEvents: "none",
                }} />

                {state === "success" ? (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px",
                    gap: "1.5rem",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: "rgba(107,127,98,0.12)",
                      border: `1px solid ${ACCENT}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "var(--font-display-serif), serif",
                        fontWeight: 300,
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        color: "#f0ede8",
                        margin: "0 0 0.75rem",
                      }}>Message Received</h3>
                      <p style={{
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 300,
                        color: "rgba(240,237,232,0.5)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        Thank you for reaching out. We'll be in touch within 24 hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(1.25rem, 2.5vw, 1.75rem)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(1rem, 2vw, 1.25rem)" }}>
                      <Field label="Full Name">
                        <input
                          name="name"
                          type="text"
                          required
                          placeholder="Your name"
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          style={{
                            ...inputStyle,
                            border: getFocusBorder("name"),
                            background: getFocusBg("name"),
                          }}
                        />
                      </Field>
                      <Field label="Email Address">
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          style={{
                            ...inputStyle,
                            border: getFocusBorder("email"),
                            background: getFocusBg("email"),
                          }}
                        />
                      </Field>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(1rem, 2vw, 1.25rem)" }}>
                      <Field label="Service Needed">
                        <select
                          name="service"
                          onFocus={() => setFocused("service")}
                          onBlur={() => setFocused(null)}
                          style={{
                            ...inputStyle,
                            border: getFocusBorder("service"),
                            background: getFocusBg("service"),
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                          }}
                        >
                          <option value="" style={{ background: "#111" }}>Select a service</option>
                          {SERVICES.map(s => (
                            <option key={s} value={s} style={{ background: "#111" }}>{s}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Budget Range">
                        <select
                          name="budget"
                          onFocus={() => setFocused("budget")}
                          onBlur={() => setFocused(null)}
                          style={{
                            ...inputStyle,
                            border: getFocusBorder("budget"),
                            background: getFocusBg("budget"),
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                          }}
                        >
                          <option value="" style={{ background: "#111" }}>Select a range</option>
                          {BUDGETS.map(b => (
                            <option key={b} value={b} style={{ background: "#111" }}>{b}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Tell Us About Your Project">
                      <textarea
                        name="message"
                        required
                        placeholder="Describe your vision, goals, and timeline..."
                        rows={5}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        style={{
                          ...inputStyle,
                          border: getFocusBorder("message"),
                          background: getFocusBg("message"),
                          resize: "vertical",
                          minHeight: "140px",
                        }}
                      />
                    </Field>

                    {state === "error" && (
                      <p style={{
                        fontFamily: "var(--font-jakarta), sans-serif",
                        fontSize: "0.8rem",
                        color: "#e05b5b",
                        margin: 0,
                      }}>
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.6rem",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#0a0a0c",
                        background: state === "loading" ? "rgba(240,237,232,0.5)" : "#f0ede8",
                        borderRadius: 40,
                        border: "none",
                        fontFamily: "var(--font-jakarta), sans-serif",
                        padding: "15px 28px",
                        cursor: state === "loading" ? "not-allowed" : "pointer",
                        transition: "opacity 0.25s, box-shadow 0.25s",
                        width: "100%",
                      }}
                    >
                      {state === "loading" ? "Sending..." : "Send Message"}
                      {state !== "loading" && (
                        <svg width={11} height={11} viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <p style={{
                      fontFamily: "var(--font-jakarta), sans-serif",
                      fontSize: "0.65rem",
                      color: "rgba(240,237,232,0.25)",
                      textAlign: "center",
                      letterSpacing: "0.08em",
                      margin: 0,
                    }}>
                      We respond within 24 hours · Your information stays private
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </section>

      </main>

      <div aria-hidden style={{ height: "100vh", position: "relative", zIndex: 1, pointerEvents: "none" }} />
    </div>
  );
}
