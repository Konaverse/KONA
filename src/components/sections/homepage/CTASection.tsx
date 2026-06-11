"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Button } from "@/components/ui/button";

const ACCENT = "#6b7f62";
const OFF = "#ededea";

const SERVICES = ["Web Development", "E-commerce", "Brand Identity", "General"];

type FormStatus = "idle" | "loading" | "success" | "error";

const EMPTY = { name: "", email: "", phone: "", service: "", message: "" };

/* Custom glass dropdown — matches the boxed inputs */
function ServiceSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="cta-select-wrap" ref={wrapRef}>
      <button
        type="button"
        className="cta-box cta-select-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? undefined : "cta-select-placeholder"}>
          {value || "Select a service"}
        </span>
        <svg
          className="cta-select-chevron"
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M4 6l4 4 4-4" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="cta-select-menu"
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {SERVICES.map((s) => (
              <li
                key={s}
                role="option"
                aria-selected={value === s}
                className={`cta-option${value === s ? " active" : ""}`}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
              >
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [values, setValues] = useState({ ...EMPTY });

  const set = (key: keyof typeof EMPTY, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  // Progress / gating — phone is optional and excluded.
  const required: (keyof typeof EMPTY)[] = ["name", "email", "service", "message"];
  const filled = required.filter((k) => values[k].trim() !== "").length;
  const progress = (filled / required.length) * 100;
  const allFilled = filled === required.length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allFilled) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setValues({ ...EMPTY });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="cta-form-inner">
      {/* vertical progress bar — fills as required fields complete */}
      <div className="cta-progress" aria-hidden>
        <div className="cta-progress-fill" style={{ height: `${progress}%` }} />
      </div>

      <div className="cta-glass">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "1.1rem", padding: "1.5rem 0" }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 9999,
                  border: `1px solid ${ACCENT}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: OFF,
                  margin: 0,
                }}
              >
                Message received.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 300,
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                  color: "rgba(237,237,234,0.5)",
                  margin: 0,
                  maxWidth: "34ch",
                }}
              >
                We&rsquo;ll be in touch within 24 hours to begin the conversation.
              </p>
              <button onClick={() => setStatus("idle")} className="cta-send-another">
                Send another →
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}
            >
              <div className="cta-field">
                <label className="cta-label" htmlFor="cta-name">Full Name</label>
                <input
                  id="cta-name"
                  className="cta-box"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              <div className="cta-grid-2">
                <div className="cta-field">
                  <label className="cta-label" htmlFor="cta-email">Email</label>
                  <input
                    id="cta-email"
                    className="cta-box"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div className="cta-field">
                  <label className="cta-label" htmlFor="cta-phone">
                    Phone <span className="cta-optional">— optional</span>
                  </label>
                  <input
                    id="cta-phone"
                    className="cta-box"
                    type="tel"
                    name="phone"
                    placeholder="+357 …"
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="cta-field">
                <label className="cta-label">Service</label>
                <ServiceSelect value={values.service} onChange={(v) => set("service", v)} />
              </div>

              <div className="cta-field">
                <label className="cta-label" htmlFor="cta-message">Your Message</label>
                <textarea
                  id="cta-message"
                  className="cta-box cta-textarea"
                  name="message"
                  rows={3}
                  placeholder="Tell us about your project…"
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={!allFilled || status === "loading"}
                className="w-full justify-center mt-1"
              >
                {status === "loading" ? "Transmitting…" : "Send Message"}
              </Button>

              {status === "error" && (
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(248,113,113,0.85)",
                  }}
                >
                  Something went wrong — please try again.
                </span>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CTASection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Same tilt-in as the rest of the stack: tilts and scrolls over the pinned Interlude.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  return (
    <section ref={ref} style={{ position: "relative", zIndex: 60 }}>
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
          boxShadow: "0 -40px 120px -45px rgba(0,0,0,0.7)",
          minHeight: "100svh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Full-bleed cover background — woman with visor */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/woman_visor.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "left center" }}
          />
          {/* Light left-side wash — kept subtle so the glass form reads as real glass over the image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(100deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.5) 34%, rgba(10,10,10,0.18) 60%, transparent 86%)",
            }}
          />
          {/* Bottom anchor for the heading */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(0deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.25) 24%, transparent 46%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="cta-content">
          {/* small paragraph — top right */}
          <div className="cta-top container-padding">
            <p className="cta-top-copy">
              Tell us what you&rsquo;re building. We reply to every inquiry within 24
              hours — with an honest read on whether we&rsquo;re the studio to make
              it real.
            </p>
          </div>

          {/* glass form — left, vertically centered */}
          <div className="cta-form-col container-padding">
            <ContactForm />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
