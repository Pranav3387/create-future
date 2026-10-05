"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { materials } from "@/content/materials";
import { SectionHeader } from "../ui/SectionHeader";

const ease = [0.16, 1, 0.3, 1] as const;

function Swatch({ surface, sheen, large = false, neon = false }: { surface: string; sheen: number; large?: boolean; neon?: boolean }) {
  return (
    <div className={`relative ${large ? "h-full w-full" : "h-full w-full"}`} style={{ perspective: 900 }}>
      <div
        className="relative h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transformStyle: "preserve-3d", transform: large ? "rotateX(18deg) rotateY(-24deg)" : "rotateX(14deg) rotateY(-18deg)" }}
      >
        {/* depth edge */}
        <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] bg-black/60 blur-[2px]" style={{ transform: "translateZ(-14px)" }} />
        <div className="absolute inset-0 overflow-hidden" style={{ background: surface, boxShadow: neon ? "0 0 60px #3d8bff, inset 0 0 30px rgba(255,255,255,.4)" : "0 30px 60px -20px rgba(0,0,0,.7)" }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${0.45 * sheen}) 45%, transparent 60%)` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,.08), transparent 40%, rgba(0,0,0,.25))" }} />
        </div>
      </div>
    </div>
  );
}

export function MaterialsLab() {
  const [active, setActive] = useState(materials[0]);

  return (
    <section id="materials" className="relative overflow-hidden border-y border-line bg-bg-2 py-[clamp(6rem,14vw,12rem)]" aria-labelledby="materials-title">
      <div className="arch-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="wrap relative">
        <SectionHeader index="04" eyebrow="Material science" lines={["The materials", "lab."]} intro="Every material behaves differently in light, weather and time. Select a sample to see where it performs best." align="split" />
        <span id="materials-title" className="sr-only">The Materials Lab</span>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div role="tablist" aria-label="Materials" className="grid grid-cols-3 gap-3 sm:gap-4 lg:col-span-5">
            {materials.map((m) => {
              const selected = m.id === active.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="material-panel"
                  onClick={() => setActive(m)}
                  className={`group relative flex aspect-square flex-col justify-between border p-3 text-left transition-all duration-500 ${selected ? "border-blue bg-[var(--blue-soft)]" : "border-line hover:border-line-strong"}`}
                >
                  <div className="h-[60%] w-[70%] self-center pt-2 transition-transform duration-700 group-hover:-translate-y-1">
                    <Swatch surface={m.surface} sheen={m.sheen} neon={m.id === "neon"} />
                  </div>
                  <span className="label !text-[0.6rem] !text-fg/80 sm:!text-[0.65rem]">{m.name.replace(" (Aluminium Composite)", "")}</span>
                </button>
              );
            })}
          </div>

          <div id="material-panel" role="tabpanel" aria-live="polite" className="glass relative min-h-[520px] overflow-hidden lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="grid h-full gap-0 md:grid-cols-2"
              >
                <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden border-b border-line p-12 md:border-b-0 md:border-r">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--blue-soft),transparent_60%)]" />
                  <motion.div
                    className="relative aspect-[4/5] w-[60%]"
                    initial={{ rotateY: -40, y: 30, opacity: 0 }}
                    animate={{ rotateY: 0, y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease }}
                  >
                    <Swatch surface={active.surface} sheen={active.sheen} large neon={active.id === "neon"} />
                  </motion.div>
                  <span className="label absolute bottom-5 left-5">Sample / {String(materials.indexOf(active) + 1).padStart(2, "0")}</span>
                </div>
                <dl className="flex flex-col p-8 sm:p-10">
                  <dt className="sr-only">Material</dt>
                  <dd className="display mb-8 text-[clamp(2rem,3.4vw,3rem)]">{active.name}</dd>
                  {[
                    ["Finish", active.finish],
                    ["Durability", active.durability],
                    ["Typical application", active.application],
                    ["Illumination", active.illumination],
                  ].map(([k, v], i) => (
                    <motion.div key={k} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.07 }} className="border-t border-line py-4">
                      <dt className="label mb-1.5">{k}</dt>
                      <dd className="text-[0.98rem] leading-relaxed">{v}</dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
