"use client";

import { motion } from "framer-motion";
import { services } from "@/content/services";
import { SignScene } from "../scenes/SignScene";
import { SectionHeader } from "../ui/SectionHeader";
import { prefillContact } from "@/lib/events";
import { track } from "@/lib/analytics";

const ease = [0.16, 1, 0.3, 1] as const;
const sceneText: Record<string, string> = {
  letters: "NOVA", lightbox: "ATELIER", neon: "open late", shopfront: "MAISON", wayfinding: "", vehicle: "SIGNOVA", window: "STUDIO", brand: "MERIDIAN",
};

export function Services() {
  return (
    <section id="services" className="relative py-[clamp(6rem,14vw,12rem)]" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHeader
          index="01"
          eyebrow="Services"
          lines={["Every surface,", "engineered to", "be seen."]}
          intro="From a single set of halo-lit letters to a complete physical brand environment: designed, engineered, manufactured and installed by one studio."
          align="split"
        />
        <h2 id="services-title" className="sr-only">Signage services</h2>

        <ul className="mt-20 grid gap-px border border-line bg-line md:grid-cols-2">
          {services.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 1.1, ease, delay: (i % 2) * 0.1 }}
              className="bg-bg"
            >
              <button
                type="button"
                onClick={() => {
                  track("service_explore", { service: s.title });
                  prefillContact({ signage: s.title });
                }}
                className="group relative block w-full text-left transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:z-10 hover:-translate-y-1.5"
                aria-label={`${s.title}: ${s.summary} Enquire about this service`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#050607]">
                  <div className="h-full w-full scale-100 transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.08]">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <SignScene variant={s.scene} text={sceneText[s.scene]} font={s.scene === "neon" ? "script" : "sans"} palette={{ glow: s.scene === "neon" ? "#7cc0ff" : "#e6f0ff", wall: "#0d0f13", accent: "#3d8bff" }} title={`${s.title} illustration`} />
                    )}
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,7,8,.85))]" />
                  <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_0_1px_var(--blue),0_0_80px_-10px_var(--blue)] transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="label absolute left-6 top-6 !text-white/70">{s.number}</span>
                  <span className="label absolute right-6 top-6 flex translate-x-3 items-center gap-2 !text-white opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-100">
                    Explore <span>→</span>
                  </span>
                </div>
                <div className="flex items-end justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <h3 className="display text-[clamp(1.6rem,2.8vw,2.6rem)] transition-[letter-spacing,color] duration-700 group-hover:tracking-[-0.01em] group-hover:text-blue">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-muted">{s.summary}</p>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-line transition-all duration-700 group-hover:border-blue group-hover:bg-blue group-hover:text-white" aria-hidden="true">
                    →
                  </span>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
