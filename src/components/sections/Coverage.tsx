"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/content/site";
import { SectionHeader } from "../ui/SectionHeader";

const regions = [
  { id: "north", name: "North London", areas: "Camden · Islington · Hampstead · Highgate · Finchley · Enfield", d: "M250 60L520 40L600 150L520 230L420 215L330 230L230 170Z", label: [410, 130] },
  { id: "west", name: "West London", areas: "Kensington · Chelsea · Notting Hill · Hammersmith · Ealing · Chiswick", d: "M60 200L230 170L330 230L320 300L250 360L120 380L40 300Z", label: [180, 280] },
  { id: "central", name: "Central London", areas: "West End · Mayfair · Soho · Covent Garden · City · Marylebone", d: "M330 230L420 215L520 230L530 300L430 320L320 300Z", label: [425, 270] },
  { id: "east", name: "East London", areas: "Shoreditch · Hackney · Canary Wharf · Stratford · Bethnal Green", d: "M520 230L600 150L760 180L780 300L680 360L530 300Z", label: [650, 260] },
  { id: "south", name: "South London", areas: "Southwark · Battersea · Brixton · Clapham · Greenwich · Croydon", d: "M250 360L320 300L430 320L530 300L680 360L620 470L400 500L240 450Z", label: [450, 410] },
] as const;

export function Coverage() {
  const [active, setActive] = useState<(typeof regions)[number]["id"]>("central");
  const [mapLoaded, setMapLoaded] = useState(false);
  const r = regions.find((x) => x.id === active)!;

  return (
    <section className="border-t border-line bg-bg-2 py-[clamp(6rem,14vw,12rem)]" aria-labelledby="coverage-title">
      <div className="wrap">
        <SectionHeader index="08" eyebrow="Coverage" lines={["Signage across", "London."]} intro="Surveys, manufacturing and installation across every London borough, with our own fitting teams and access equipment." align="split" />
        <span id="coverage-title" className="sr-only">Signage across London</span>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="relative border border-line lg:col-span-8">
            <svg viewBox="0 0 820 540" className="h-auto w-full" role="group" aria-label="London coverage map">
              <defs>
                <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.35" /></pattern>
              </defs>
              {regions.map((x) => {
                const on = x.id === active;
                return (
                  <g key={x.id}>
                    <path
                      d={x.d}
                      tabIndex={0}
                      role="button"
                      aria-pressed={on}
                      aria-label={x.name}
                      onClick={() => setActive(x.id)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(x.id))}
                      onMouseEnter={() => setActive(x.id)}
                      className="cursor-pointer outline-none transition-all duration-500"
                      fill={on ? "var(--blue-soft)" : "url(#dots)"}
                      stroke={on ? "var(--blue)" : "var(--line-strong)"}
                      strokeWidth={on ? 2 : 1}
                      style={{ color: "var(--fg)", filter: on ? "drop-shadow(0 0 16px var(--blue))" : undefined }}
                    />
                    <text x={x.label[0]} y={x.label[1]} textAnchor="middle" className="pointer-events-none font-mono text-[11px] uppercase tracking-[0.2em]" fill={on ? "var(--fg)" : "var(--muted)"}>
                      {x.name.replace(" London", "")}
                    </text>
                  </g>
                );
              })}
              {/* The Thames */}
              <path d="M20 330C120 320 180 360 260 330S360 290 420 310 520 340 580 300 700 330 800 290" fill="none" stroke="var(--blue)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
              <text x="700" y="335" className="font-mono text-[10px] uppercase tracking-[0.3em]" fill="var(--blue)">Thames</text>
              {/* studio pin */}
              <g transform="translate(425 255)">
                <circle r="16" fill="var(--blue)" opacity="0.2"><animate attributeName="r" values="8;24;8" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values=".4;0;.4" dur="3s" repeatCount="indefinite" /></circle>
                <circle r="5" fill="var(--blue)" />
              </g>
            </svg>
          </div>

          <div className="flex flex-col lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="border-t border-line pt-6">
                <p className="label mb-3 text-blue">Now viewing</p>
                <h3 className="display text-[clamp(2rem,3.4vw,3rem)]">{r.name}</h3>
                <p className="mt-4 leading-relaxed text-muted">{r.areas}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 aspect-[4/3] w-full overflow-hidden border border-line">
              {mapLoaded ? (
                <iframe
                  title="SIGNOVA location on Google Maps"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.mapQuery)}&output=embed`}
                  className="h-full w-full grayscale invert-[.9] dark:invert-[.9] [html[data-theme=light]_&]:invert-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <button type="button" onClick={() => setMapLoaded(true)} className="arch-grid flex h-full w-full flex-col items-center justify-center gap-3 text-center">
                  <span className="label">Google Maps</span>
                  <span className="text-sm text-muted">Loading the map shares data with Google.</span>
                  <span className="btn btn-ghost mt-2 !py-3">Load map</span>
                </button>
              )}
            </div>

            <div className="mt-auto pt-10">
              <p className="display text-xl">Need signage outside London?</p>
              <p className="mt-2 text-muted">Talk to our team about your project.</p>
              <a href="#contact" className="btn btn-ghost mt-6">Talk to our team <span className="arrow">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
