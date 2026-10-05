"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { testimonials } from "@/content/testimonials";
import { SectionHeader } from "../ui/SectionHeader";

const ease = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[i];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="relative overflow-hidden py-[clamp(6rem,14vw,12rem)]" aria-labelledby="testimonials-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--blue-soft),transparent_60%)]" />
      <div className="wrap relative">
        <SectionHeader index="07" eyebrow="Testimonials" lines={["In their", "words."]} />
        <span id="testimonials-title" className="sr-only">Client testimonials</span>

        <div className="glass mt-16 grid lg:grid-cols-12" aria-live="polite">
          <div className="relative min-h-[380px] p-8 sm:p-14 lg:col-span-9">
            <span className="display pointer-events-none absolute right-8 top-0 select-none text-[14rem] leading-none text-fg opacity-[0.04]" aria-hidden="true">“</span>
            <AnimatePresence mode="wait">
              <motion.figure key={i} initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.9, ease }}>
                <p className="mb-8 tracking-[0.3em] text-blue" aria-label="5 out of 5 stars">★★★★★</p>
                <blockquote className="font-display text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.02em]">“{t.quote}”</blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted">{t.business}</span>
                  <span className="label">{t.project}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="flex border-t border-line lg:col-span-3 lg:flex-col lg:border-l lg:border-t-0">
            {testimonials.map((x, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show testimonial ${n + 1}: ${x.business}`}
                aria-current={n === i}
                className={`relative flex-1 border-line p-5 text-left transition-colors duration-500 lg:border-b lg:last:border-b-0 ${n ? "border-l lg:border-l-0" : ""} ${n === i ? "bg-[var(--blue-soft)]" : "hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)]"}`}
              >
                <span className="label block">0{n + 1}</span>
                <span className="mt-2 hidden text-sm lg:block">{x.business}</span>
                {n === i && !paused && <motion.span key={`p${i}`} className="absolute bottom-0 left-0 h-px bg-blue" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 7, ease: "linear" }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
