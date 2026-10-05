"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroScene } from "../scenes/HeroScene";
import { Particles } from "../ui/Particles";
import { site } from "@/content/site";

const ease = [0.16, 1, 0.3, 1] as const;
const lines = ["Signage", "that defines", "your space."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Subtle pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const sceneX = useTransform(sx, (v) => v * -14);
  const sceneYp = useTransform(sy, (v) => v * -10);
  const gridX = useTransform(sx, (v) => v * 24);

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#040506] text-white"
      aria-label="Introduction"
    >
      {/* Scene with slow cinematic drift */}
      <motion.div className="absolute inset-0" style={{ y: sceneY }}>
        <motion.div className="absolute -inset-[4%]" style={{ x: sceneX, y: sceneYp }}>
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.25, opacity: 0 }}
            animate={{ scale: 1.08, opacity: 1 }}
            transition={{ duration: 2.6, ease }}
          >
            <div className="h-full w-full [animation:drift_28s_ease-in-out_infinite_alternate]">
              <HeroScene />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating perspective grid */}
      <motion.div
        className="pointer-events-none absolute inset-x-[-20%] bottom-[-10%] h-[55%] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{ x: gridX, transform: "perspective(600px) rotateX(62deg)", transformOrigin: "bottom" }}
        aria-hidden="true"
      >
        <div className="h-full w-full [background-image:linear-gradient(rgba(120,170,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(120,170,255,.25)_1px,transparent_1px)] [background-size:70px_70px]" />
      </motion.div>

      <Particles />

      {/* Cinematic grade */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,5,6,.92)_0%,rgba(4,5,6,.55)_45%,rgba(4,5,6,.1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,6,.6)_0%,transparent_25%,transparent_60%,rgba(4,5,6,1)_100%)]" />

      <motion.div style={{ y: textY, opacity: fade }} className="wrap relative z-10 flex h-full flex-col justify-end pb-[14vh] sm:pb-[12vh]">
        <motion.p
          className="label mb-8 flex items-center gap-4 !text-white/60"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease, delay: 0.8 }}
        >
          <span className="h-px w-10 bg-blue" /> London · Architectural signage studio
        </motion.p>

        <h1 className="display text-[clamp(3rem,min(9vw,15vh),9.5rem)]">
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${i === 2 ? "metal-text !bg-[linear-gradient(180deg,#fff_0%,#c9ced6_45%,#7d848e_75%,#e8ebef_100%)]" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.4, ease, delay: 0.5 + i * 0.12 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            className="max-w-md text-[1.05rem] leading-relaxed text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 1.1 }}
          >
            {site.description}
          </motion.p>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 1.25 }}
          >
            <a href="#contact" className="btn btn-primary !bg-white !text-black hover:!text-white">
              Book a consultation <span className="arrow">→</span>
            </a>
            <a href="#work" className="btn btn-ghost !border-white/25 !text-white hover:!border-white">
              View our work
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#services"
        className="label absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 !text-white/50 hover:!text-white sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Scroll to explore ↓
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-blue [animation:scroll-cue_2s_cubic-bezier(.16,1,.3,1)_infinite]" />
        </span>
      </motion.a>
    </section>
  );
}
