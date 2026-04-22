"use client";

import { useState, useRef } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

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

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [state, setState] = useState<FormState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name"),
      email: fd.get("email"),
      service: fd.get("service"),
      budget: fd.get("budget"),
      message: fd.get("message"),
    };

    try {
      // Simulate API call for now (or replace with your actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setState("success");
      formRef.current?.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Contact"
        title="Let's build something remarkable."
        description="Whether you have a clear brief or just a vision, we'd love to hear from you. We respond to every inquiry within 24 hours."
      />

      <section className="container-padding pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div>
               <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-6 block">Inquiries</span>
               <a 
                 href="mailto:info@kona-verse.com" 
                 className="font-display text-2xl md:text-4xl text-[var(--color-off-white)] hover:text-[var(--color-sage)] transition-colors duration-300 no-underline"
               >
                 info@kona-verse.com
               </a>
            </div>

            <div>
               <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-6 block">Location</span>
               <p className="font-display text-2xl md:text-4xl text-[var(--color-off-white)] font-light italic">
                 Cyprus. <br />
                 <span className="opacity-40 not-italic uppercase font-mono text-xs tracking-widest mt-2 block">Available Worldwide</span>
               </p>
            </div>

            <div className="pt-20 border-t border-white/5 mt-auto">
               <span className="font-mono text-[9px] tracking-widest uppercase opacity-30 mb-8 block font-light">Follow Our Journey</span>
               <div className="flex gap-10">
                  {["Instagram", "LinkedIn", "Vimeo"].map(social => (
                    <a key={social} href="#" className="font-sans text-xs tracking-widest uppercase text-[var(--color-off-white)] opacity-60 hover:opacity-100 hover:text-[var(--color-sage)] transition-all duration-300 no-underline">
                      {social}
                    </a>
                  ))}
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 md:p-14 rounded-3xl backdrop-blur-sm relative overflow-hidden transition-all duration-500 hover:border-white/[0.1] group">
               {/* Detail sheen */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sage)] opacity-[0.03] blur-3xl pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-500" />
               
               {state === "success" ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-20 h-20 rounded-full border border-[var(--color-sage)] flex items-center justify-center mb-8">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="2">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                    </div>
                    <h3 className="font-display text-3xl mb-4 text-[var(--color-off-white)]">Message Received.</h3>
                    <p className="font-sans font-light text-white/50 max-w-xs">We'll be in touch within 24 hours to schedule a conversation.</p>
                    <button 
                      onClick={() => setState("idle")}
                      className="mt-10 font-mono text-[10px] tracking-widest uppercase text-[var(--color-sage)] underline underline-offset-8"
                    >
                      Send another message
                    </button>
                 </div>
               ) : (
                 <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                         <label className="font-mono text-[9px] tracking-widest uppercase opacity-40">Full Name</label>
                         <input 
                           type="text" 
                           name="name" 
                           required 
                           placeholder="Your Name"
                           className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[var(--color-sage)] font-sans font-light text-lg transition-colors placeholder:opacity-20" 
                         />
                      </div>
                      <div className="flex flex-col gap-3">
                         <label className="font-mono text-[9px] tracking-widest uppercase opacity-40">Email Address</label>
                         <input 
                           type="email" 
                           name="email" 
                           required 
                           placeholder="you@example.com"
                           className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[var(--color-sage)] font-sans font-light text-lg transition-colors placeholder:opacity-20" 
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                         <label className="font-mono text-[9px] tracking-widest uppercase opacity-40">Service Interested In</label>
                         <select 
                           name="service"
                           className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[var(--color-sage)] font-sans font-light text-base md:text-lg transition-colors appearance-none cursor-pointer"
                         >
                           {SERVICES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                         </select>
                      </div>
                      <div className="flex flex-col gap-3">
                         <label className="font-mono text-[9px] tracking-widest uppercase opacity-40">Budget Range</label>
                         <select 
                           name="budget"
                           className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[var(--color-sage)] font-sans font-light text-base md:text-lg transition-colors appearance-none cursor-pointer"
                         >
                           {BUDGETS.map(b => <option key={b} value={b} className="bg-black">{b}</option>)}
                         </select>
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <label className="font-mono text-[9px] tracking-widest uppercase opacity-40">The Brief</label>
                      <textarea 
                        name="message"
                        required
                        placeholder="Tell us about your goals, timeline, and vision..."
                        rows={4}
                        className="bg-transparent border-b border-white/10 py-3 outline-none focus:border-[var(--color-sage)] font-sans font-light text-lg transition-colors resize-none placeholder:opacity-20"
                      />
                   </div>

                   <div className="pt-6">
                      <Button 
                        disabled={state === "loading"}
                        className="w-full h-16 rounded-2xl"
                      >
                        {state === "loading" ? "Transmitting..." : "Send Message"}
                      </Button>
                      <p className="text-center font-mono text-[8px] tracking-[0.2em] uppercase opacity-20 mt-6">
                        Secure Transmission · 24h Response Target
                      </p>
                   </div>
                 </form>
               )}
            </div>
          </div>

        </div>
      </section>
    </PageWrapper>
  );
}
