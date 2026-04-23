"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const ACCENT = "#6B7F62";

const SERVICES = [
  "Web Development",
  "Videography",
  "Full Brand Identity",
  "E-commerce Solution",
  "Retainer Partnership",
];

const BUDGETS = [
  "Under €5,000",
  "€5,000 – €15,000",
  "€15,000 – €30,000",
  "€30,000+",
  "Let's discuss",
];

type FormStatus = "idle" | "loading" | "success" | "error";

// ─── Primitives ──────────────────────────────────────────────────────────────

function SectionRow({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span
        className="font-mono text-[10px] tracking-[0.3em] uppercase shrink-0"
        style={{ color: ACCENT }}
      >
        {number}
      </span>
      <span className="flex-1 h-px bg-white/[0.06]" />
      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40 shrink-0">
        {label}
      </span>
    </div>
  );
}

function FieldInput({
  label,
  type = "text",
  name,
  placeholder,
  required = false,
}: {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/55">
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="peer w-full bg-transparent py-3 text-xl md:text-2xl font-display font-light text-[var(--color-off-white)] placeholder:text-white/30 placeholder:font-light outline-none transition-colors duration-300"
        />
        {/* Base border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 group-focus-within:bg-white/30 transition-colors duration-300" />
        {/* Sage focus sweep */}
        <div className="absolute bottom-0 left-0 h-px w-0 peer-focus:w-full bg-[var(--color-sage)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </div>
    </div>
  );
}

function PillOption({
  label,
  selected,
  onClick,
  mono = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 rounded-full border transition-all duration-300 outline-none",
        mono
          ? "font-mono text-[11px] tracking-wide"
          : "font-sans text-xs tracking-wide",
        selected
          ? "border-[var(--color-sage)] text-[var(--color-sage)] bg-[var(--color-sage)]/[0.06]"
          : "border-white/[0.1] text-white/40 hover:border-white/25 hover:text-white/70"
      )}
    >
      {label}
    </button>
  );
}

// ─── Animation variants ───────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const sectionVariants = {
  hidden: { y: 32, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = new FormData(formRef.current!);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          service,
          budget,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      formRef.current?.reset();
      setService("");
      setBudget("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Contact"
        title="Let's build something remarkable."
        description="Whether you have a clear brief or just a vision, we'd love to hear from you. We respond to every inquiry within 24 hours."
      />

      <section className="container-padding pb-56">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-24">

          {/* ── Left: Info ── */}
          <motion.aside
            className="lg:col-span-4 flex flex-col gap-14"
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase block mb-5" style={{ color: ACCENT }}>
                Direct Line
              </span>
              <a
                href="mailto:info@kona-verse.com"
                className="group/email font-display text-2xl text-[var(--color-off-white)] hover:text-[var(--color-sage)] transition-colors duration-300 no-underline"
              >
                info@kona-verse.com
              </a>
            </div>

            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase block mb-5" style={{ color: ACCENT }}>
                Based In
              </span>
              <p className="font-display text-2xl text-[var(--color-off-white)] font-light">
                Cyprus.
              </p>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/25 mt-3 block">
                Available Worldwide
              </span>
            </div>

            <div className="mt-auto pt-14 border-t border-white/[0.05]">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 mb-7 block">
                Follow Our Journey
              </span>
              <div className="flex flex-col gap-3.5">
                {["Instagram", "LinkedIn", "Vimeo"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="group/s flex items-center justify-between font-sans text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors duration-300 no-underline"
                  >
                    {s}
                    <span className="text-[var(--color-sage)] opacity-0 -translate-x-2 group-hover/s:opacity-100 group-hover/s:translate-x-0 transition-all duration-300">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-start py-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <div
                    className="w-14 h-14 rounded-full border flex items-center justify-center mb-12"
                    style={{ borderColor: `${ACCENT}50` }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] text-[var(--color-off-white)] mb-8">
                    Message<br />Received.
                  </h3>
                  <p className="font-sans font-light text-white/35 max-w-xs leading-relaxed mb-14">
                    We'll be in touch within 24 hours to begin the conversation.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hover:text-white"
                    style={{ color: ACCENT }}
                  >
                    Send Another →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.4 } }}
                  className="flex flex-col gap-16"
                >
                  {/* 01 — Basics */}
                  <motion.div variants={sectionVariants}>
                    <SectionRow number="01" label="The Basics" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                      <FieldInput label="Full Name" name="name" placeholder="Your name" required />
                      <FieldInput label="Email Address" type="email" name="email" placeholder="your@email.com" required />
                    </div>
                  </motion.div>

                  {/* 02 — Service */}
                  <motion.div variants={sectionVariants}>
                    <SectionRow number="02" label="The Discipline" />
                    <div className="flex flex-wrap gap-3">
                      {SERVICES.map((s) => (
                        <PillOption
                          key={s}
                          label={s}
                          selected={service === s}
                          onClick={() => setService(service === s ? "" : s)}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* 03 — Budget */}
                  <motion.div variants={sectionVariants}>
                    <SectionRow number="03" label="The Investment" />
                    <div className="flex flex-wrap gap-3">
                      {BUDGETS.map((b) => (
                        <PillOption
                          key={b}
                          label={b}
                          selected={budget === b}
                          onClick={() => setBudget(budget === b ? "" : b)}
                          mono
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* 04 — Vision */}
                  <motion.div variants={sectionVariants}>
                    <SectionRow number="04" label="The Vision" />
                    <div className="flex flex-col gap-2.5">
                      <label className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/55">
                        Tell us everything
                      </label>
                      <div className="relative group">
                        <textarea
                          name="message"
                          required
                          rows={5}
                          placeholder="Your goals, timeline, vision, and any relevant context..."
                          className="peer w-full bg-transparent py-3 text-lg md:text-xl font-display font-light text-[var(--color-off-white)] placeholder:text-white/30 placeholder:font-light outline-none resize-none transition-colors duration-300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 group-focus-within:bg-white/30 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 h-px w-0 peer-focus:w-full bg-[var(--color-sage)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    variants={sectionVariants}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-2"
                  >
                    <Button disabled={status === "loading"}>
                      {status === "loading" ? "Transmitting..." : "Send Message"}
                    </Button>
                    <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/20">
                      24h Response · Secure Transmission
                    </span>
                  </motion.div>

                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-[10px] tracking-widest uppercase text-red-400/70"
                    >
                      Something went wrong — please try again.
                    </motion.p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
