"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "../ui/SectionHeader";

const steps = [
  { n: "01", t: "Discover", d: "Understand your brand, space and objectives." },
  { n: "02", t: "Design", d: "Develop concepts and visual mockups." },
  { n: "03", t: "Engineer", d: "Select materials, lighting and construction methods." },
  { n: "04", t: "Manufacture", d: "Precision manufacturing and quality control." },
  { n: "05", t: "Install", d: "Professional installation across London." },
];
const ease = [0.16, 1, 0.3, 1] as const;

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });

  return (
    <section id="process" className="py-[clamp(6rem,14vw,12rem)]" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHeader index="05" eyebrow="Process" lines={["Five stages.", "Zero guesswork."]} align="split" intro="One accountable team from first conversation to final fixing, with no handovers between subcontractors." />
        <span id="process-title" className="sr-only">Our process</span>

        <ol ref={ref} className="relative mt-20">
          <div className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line md:left-[2.4rem]" aria-hidden="true">
            <motion.div className="h-full w-px origin-top bg-blue shadow-[0_0_12px_var(--blue)]" style={{ scaleY: scrollYProgress }} />
          </div>
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0.15 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-35% 0px -35% 0px" }}
              transition={{ duration: 0.8, ease }}
              className="group relative grid grid-cols-[2.5rem_1fr] gap-6 border-b border-line py-10 md:grid-cols-[5rem_1fr_1fr] md:gap-10 md:py-14"
            >
              <span className="relative z-10 grid h-9 w-9 place-items-center border border-line-strong bg-bg font-mono text-[0.65rem] md:h-12 md:w-12 md:translate-x-[0.6rem]">{s.n}</span>
              <motion.h3
                initial={{ x: -30 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 1.1, ease, delay: i * 0.03 }}
                className="display text-[clamp(2.2rem,6vw,5.5rem)]"
              >
                {s.t}
              </motion.h3>
              <p className="col-start-2 max-w-sm self-end text-lg text-muted md:col-start-3 md:justify-self-end">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
