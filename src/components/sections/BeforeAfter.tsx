"use client";

import { useRef, useState } from "react";
import { SignScene } from "../scenes/SignScene";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";

function BeforeScene() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Before: tired, unbranded shopfront">
      <rect width="800" height="600" fill="#1c1d1f" />
      <rect x="40" y="0" width="720" height="520" fill="#2a2a29" />
      {[110, 330, 550].map((x) => <rect key={x} x={x} y="40" width="140" height="150" fill="#1a1b1c" stroke="#3a3a38" strokeWidth="4" />)}
      <rect x="60" y="230" width="680" height="88" fill="#d9d4c7" />
      <rect x="60" y="230" width="680" height="88" fill="#000" opacity="0.15" />
      <text x="400" y="276" textAnchor="middle" dominantBaseline="central" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="40" fill="#8a2d2d" opacity="0.7">CAFE · SNACKS · TEA</text>
      <path d="M60 230L180 318M600 230L740 300" stroke="#000" strokeOpacity="0.2" strokeWidth="3" />
      <rect x="60" y="330" width="680" height="190" fill="#151617" />
      <rect x="74" y="342" width="440" height="168" fill="#3a3a36" />
      <rect x="100" y="360" width="90" height="120" fill="#e6e1d0" opacity="0.7" transform="rotate(-4 145 420)" />
      <rect x="220" y="370" width="110" height="80" fill="#f0c94a" opacity="0.6" transform="rotate(3 275 410)" />
      <rect x="360" y="355" width="80" height="110" fill="#d64545" opacity="0.5" />
      <rect x="636" y="342" width="90" height="168" fill="#3a3a36" />
      <rect y="520" width="800" height="80" fill="#121314" />
    </svg>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="py-[clamp(6rem,14vw,12rem)]" aria-labelledby="ba-title">
      <div className="wrap">
        <SectionHeader index="03" eyebrow="Transformation" lines={["Same street.", "New presence."]} intro="Drag to see how considered signage turns an overlooked frontage into a destination." align="split" />
        <span id="ba-title" className="sr-only">Before and after</span>

        <Reveal className="mt-16">
          <div
            ref={box}
            className="relative aspect-[4/3] cursor-ew-resize select-none overflow-hidden border border-line sm:aspect-[16/9]"
            onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); update(e.clientX); }}
            onPointerMove={(e) => dragging.current && update(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            style={{ touchAction: "pan-y" }}
          >
            <div className="absolute inset-0">
              <SignScene variant="shopfront" text="ember" font="script" palette={{ glow: "#ffd2a8", wall: "#14100d", accent: "#ff9a5c" }} title="After: premium halo-lit shopfront" />
            </div>
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <div className="h-full w-full grayscale-[30%]"><BeforeScene /></div>
            </div>

            <span className="label absolute left-5 top-5 bg-black/60 px-3 py-2 !text-white backdrop-blur">Before</span>
            <span className="label absolute right-5 top-5 bg-black/60 px-3 py-2 !text-white backdrop-blur">After</span>

            <div className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_20px_var(--blue)]" style={{ left: `${pos}%` }}>
              <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center border border-white/60 bg-black/50 text-white backdrop-blur-md">
                <span aria-hidden="true">← →</span>
              </div>
            </div>

            <input
              type="range" min={0} max={100} value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Before and after comparison"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>
        </Reveal>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-lg text-muted">Fascia, illuminated lettering, window manifestation and lighting, delivered as one coordinated scheme.</p>
          <a href="#contact" className="btn btn-primary">Transform your frontage <span className="arrow">→</span></a>
        </Reveal>
      </div>
    </section>
  );
}
