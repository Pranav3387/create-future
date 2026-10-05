"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { prefillContact } from "@/lib/events";
import { track } from "@/lib/analytics";

const TYPES = ["3D letters", "Neon", "Lightbox", "Fascia", "Projecting sign"] as const;
const MATERIALS = ["Acrylic", "Metal", "Aluminium", "ACP"] as const;
const LIGHTING = ["Front illuminated", "Halo illuminated", "Edge illuminated", "LED neon", "Non-illuminated"] as const;
const COLOURS = [
  { name: "Black", hex: "#111214" },
  { name: "White", hex: "#f4f5f7" },
  { name: "Silver", hex: "#c3c8cf" },
  { name: "Gold", hex: "#c9a35a" },
  { name: "Custom", hex: "" },
] as const;

type Config = {
  type: (typeof TYPES)[number];
  material: (typeof MATERIALS)[number];
  lighting: (typeof LIGHTING)[number];
  colour: (typeof COLOURS)[number]["name"];
  custom: string;
  text: string;
};

const DEFAULT: Config = { type: "3D letters", material: "Metal", lighting: "Halo illuminated", colour: "Silver", custom: "#3d8bff", text: "YOUR BRAND" };
const STORE = "signova-sign-design";

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

function Option<T extends string>({ label, values, value, onChange, swatches }: { label: string; values: readonly T[]; value: T; onChange: (v: T) => void; swatches?: Record<string, string> }) {
  return (
    <fieldset className="border-t border-line pt-5">
      <legend className="label mb-4 float-left w-full">{label}</legend>
      <div className="clear-both flex flex-wrap gap-2">
        {values.map((v) => {
          const on = v === value;
          return (
            <label key={v} className={`relative flex cursor-pointer items-center gap-2 border px-3.5 py-2.5 text-sm transition-all duration-300 ${on ? "border-fg bg-fg text-bg" : "border-line hover:border-line-strong"}`}>
              <input type="radio" name={label} value={v} checked={on} onChange={() => onChange(v)} className="sr-only" />
              {swatches?.[v] !== undefined && (
                <span className="h-3.5 w-3.5 border border-line-strong" style={{ background: swatches[v] || "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }} aria-hidden="true" />
              )}
              {v}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Configurator() {
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof Config>(k: K, v: Config[K]) => { setCfg((c) => ({ ...c, [k]: v })); setSaved(false); };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) setCfg({ ...DEFAULT, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  // Sensible pairings: picking neon type implies LED neon lighting.
  useEffect(() => {
    if (cfg.type === "Neon" && cfg.lighting !== "LED neon") setCfg((c) => ({ ...c, lighting: "LED neon" }));
  }, [cfg.type, cfg.lighting]);

  const rx = useMotionValue(-6);
  const ry = useMotionValue(-18);
  const srx = useSpring(rx, { stiffness: 60, damping: 18 });
  const sry = useSpring(ry, { stiffness: 60, damping: 18 });

  const colour = cfg.colour === "Custom" ? cfg.custom : COLOURS.find((c) => c.name === cfg.colour)!.hex;
  const lit = cfg.lighting !== "Non-illuminated";
  const glow = cfg.lighting === "LED neon" ? (cfg.colour === "Black" ? "#7cc0ff" : colour) : "#cfe2ff";

  const faceStyle = useMemo<CSSProperties>(() => {
    const metallic = cfg.material === "Metal" || (cfg.material === "Aluminium" && cfg.colour !== "Black");
    if (cfg.lighting === "LED neon" || cfg.type === "Neon") {
      return { color: "transparent", WebkitTextStroke: `2px ${shade(glow, 80)}`, textShadow: `0 0 6px ${glow}, 0 0 18px ${glow}, 0 0 40px ${glow}` };
    }
    if (cfg.lighting === "Front illuminated") {
      return { color: shade(colour, 60), textShadow: `0 0 12px ${glow}, 0 0 28px ${glow}88` };
    }
    if (cfg.lighting === "Edge illuminated") {
      return { color: colour, WebkitTextStroke: `1.5px ${glow}`, textShadow: `0 0 10px ${glow}` };
    }
    if (metallic) {
      return { backgroundImage: `linear-gradient(180deg, ${shade(colour, 70)} 0%, ${colour} 45%, ${shade(colour, -60)} 70%, ${shade(colour, 40)} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
    }
    return { color: colour, ...(cfg.material === "Acrylic" ? { backgroundImage: `linear-gradient(180deg, ${shade(colour, 50)}, ${colour} 50%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) };
  }, [cfg, colour, glow]);

  const depthShadow = useMemo(() => {
    if (cfg.type === "Neon" || cfg.lighting === "LED neon") return "none";
    const side = shade(colour, -70);
    return Array.from({ length: 10 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${side}`).join(",") + ", 14px 18px 22px rgba(0,0,0,.6)";
  }, [cfg, colour]);

  const haloFilter = cfg.lighting === "Halo illuminated" ? `drop-shadow(0 0 18px ${glow}) drop-shadow(0 0 40px ${glow}aa)` : undefined;

  const panelBg = (() => {
    if (cfg.material === "ACP") return "linear-gradient(135deg,#1d2026,#2b2f37 50%,#1d2026)";
    if (cfg.material === "Metal") return "linear-gradient(135deg,#3a3f47,#8b939d 50%,#3a3f47)";
    if (cfg.material === "Aluminium") return "linear-gradient(160deg,#5b6169,#8e959e 50%,#5b6169)";
    return "linear-gradient(135deg,#0f1115,#1a1d23)";
  })();

  const letters = (
    <span className="relative inline-block whitespace-nowrap" style={{ filter: haloFilter }}>
      <span aria-hidden="true" className="absolute inset-0" style={{ color: shade(colour, -60), textShadow: depthShadow }}>{cfg.text || " "}</span>
      <span className="relative" style={faceStyle}>{cfg.text || " "}</span>
    </span>
  );

  const fontSize = `clamp(1.6rem, ${Math.min(9, 60 / Math.max(cfg.text.length, 4))}vw, 5.5rem)`;
  const fontFamily = cfg.type === "Neon" ? "var(--font-serif), serif" : "var(--font-archivo), sans-serif";

  const summary = `${cfg.type} · ${cfg.material} · ${cfg.lighting} · ${cfg.colour === "Custom" ? `Custom ${cfg.custom}` : cfg.colour} · Text: "${cfg.text}"`;

  return (
    <section className="py-[clamp(6rem,14vw,12rem)]" aria-labelledby="config-title">
      <div className="wrap">
        <SectionHeader index="06" eyebrow="Configurator" lines={["Build your", "sign."]} intro="Explore combinations of type, material, lighting and colour. Save your design and send it straight to our studio for a quote." align="split" />
        <span id="config-title" className="sr-only">Build your sign</span>

        <div className="mt-16 grid border border-line lg:grid-cols-12">
          {/* Preview */}
          <div
            className="relative min-h-[420px] overflow-hidden border-b border-line lg:col-span-7 lg:min-h-[640px] lg:border-b-0 lg:border-r"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              ry.set(((e.clientX - r.left) / r.width - 0.5) * 50);
              rx.set(-((e.clientY - r.top) / r.height - 0.5) * 20);
            }}
            onPointerLeave={() => { rx.set(-6); ry.set(-18); }}
            style={{ background: lit ? "#08090b" : "#4a4e55" }}
          >
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)", backgroundSize: "60px 30px", backgroundColor: lit ? "#0d0e11" : "#5d6168" }} />
            <div className="absolute inset-0" style={{ background: lit ? `radial-gradient(60% 40% at 50% 50%, ${glow}22, transparent 70%)` : "radial-gradient(70% 60% at 50% 40%, rgba(255,255,255,.18), transparent)" }} />
            <span className="label absolute left-5 top-5 z-10">Live preview · {lit ? "Night" : "Day"}</span>
            <span className="label absolute bottom-5 left-5 z-10 hidden sm:block">Move cursor to rotate</span>

            <div className="absolute inset-0 grid place-items-center p-8" style={{ perspective: 1200 }}>
              <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", fontFamily, fontSize, fontWeight: cfg.type === "Neon" ? 400 : 700, fontStyle: cfg.type === "Neon" ? "italic" : "normal", letterSpacing: cfg.type === "Neon" ? "0" : "0.06em" }} className="relative">
                {cfg.type === "3D letters" || cfg.type === "Neon" ? (
                  letters
                ) : cfg.type === "Projecting sign" ? (
                  <div className="flex items-start" style={{ transformStyle: "preserve-3d" }}>
                    <div className="h-[1.6em] w-[0.3em] bg-[#2a2e35]" />
                    <div className="mt-[0.15em] h-[0.12em] w-[0.8em] bg-[#2a2e35]" />
                    <div className="grid h-[3.2em] w-[3.2em] place-items-center rounded-full border-[0.08em]" style={{ background: panelBg, borderColor: colour, boxShadow: lit && cfg.lighting === "Front illuminated" ? `0 0 40px ${glow}88, inset 0 0 30px ${glow}55` : "0 20px 40px rgba(0,0,0,.6)" }}>
                      <span style={{ ...faceStyle, fontSize: "1.1em", filter: haloFilter }}>{(cfg.text.trim()[0] || "S").toUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="grid place-items-center px-[0.8em]"
                    style={{
                      height: cfg.type === "Lightbox" ? "2.2em" : "1.9em",
                      background: cfg.type === "Lightbox" && lit ? `linear-gradient(180deg, #ffffff, ${shade(glow, -10)})` : panelBg,
                      boxShadow: cfg.type === "Lightbox" && lit ? `0 0 60px ${glow}aa, 0 0 120px ${glow}55` : "0 24px 50px rgba(0,0,0,.6)",
                      border: "0.05em solid #2a2e35",
                      fontSize: "0.85em",
                    }}
                  >
                    {cfg.type === "Lightbox" ? <span style={{ color: colour === "#f4f5f7" ? "#111214" : colour }}>{cfg.text}</span> : letters}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-5 p-6 sm:p-8 lg:col-span-5">
            <div>
              <label htmlFor="sign-text" className="label mb-2 block">Sign text</label>
              <input id="sign-text" className="field display !text-2xl" maxLength={18} value={cfg.text} onChange={(e) => set("text", e.target.value.toUpperCase())} />
            </div>
            <Option label="Sign type" values={TYPES} value={cfg.type} onChange={(v) => set("type", v)} />
            <Option label="Material" values={MATERIALS} value={cfg.material} onChange={(v) => set("material", v)} />
            <Option label="Lighting" values={LIGHTING} value={cfg.lighting} onChange={(v) => set("lighting", v)} />
            <Option label="Colour" values={COLOURS.map((c) => c.name)} value={cfg.colour} onChange={(v) => set("colour", v)} swatches={Object.fromEntries(COLOURS.map((c) => [c.name, c.hex]))} />
            {cfg.colour === "Custom" && (
              <label className="flex items-center gap-3 text-sm">
                <input type="color" value={cfg.custom} onChange={(e) => set("custom", e.target.value)} className="h-10 w-14 cursor-pointer border border-line bg-transparent" />
                Pick a brand colour <span className="font-mono text-muted">{cfg.custom}</span>
              </label>
            )}
            <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => {
                  try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch { /* ignore */ }
                  setSaved(true);
                  track("configurator_save", { type: cfg.type, material: cfg.material, lighting: cfg.lighting });
                }}
              >
                {saved ? "✓ Design saved" : "Save my design"}
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={() => {
                  track("configurator_quote", { type: cfg.type });
                  prefillContact({ signage: cfg.type === "Neon" ? "Neon" : cfg.type === "3D letters" ? "3D Lettering" : cfg.type === "Lightbox" ? "LED & Illuminated Signage" : "Shopfront Signage", message: `Configurator design: ${summary}` });
                }}
              >
                Request quote <span className="arrow">→</span>
              </button>
            </div>
            <p className="text-xs leading-relaxed text-muted">Preview is illustrative. Final design, proportions and finishes are confirmed after survey.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
