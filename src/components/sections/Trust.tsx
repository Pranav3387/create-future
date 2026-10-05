"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site";
import { clientLogos } from "@/content/testimonials";
import { Reveal } from "../ui/Reveal";

// Unverified stats never ship to production. Mark them verified in content/site.ts.
const showDrafts = process.env.NODE_ENV !== "production";

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toFixed(decimals)}</span>;
}

export function Trust() {
  const visible = stats.filter((s) => s.verified || showDrafts);

  return (
    <section id="about" className="border-y border-line" aria-label="Studio in numbers and clients">
      {visible.length > 0 && (
        <div className="wrap">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {visible.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className={`relative border-line py-14 pr-6 sm:py-20 ${i % 2 ? "pl-6 border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:pl-6 lg:border-l" : ""}`}>
                <dd className={`display metal-text ${s.value === null ? "text-[clamp(1.9rem,5vw,4.6rem)]" : "text-[clamp(2.4rem,6vw,5.5rem)]"}`}>
                  {s.value !== null ? (
                    <>
                      <Counter to={s.value} decimals={"decimals" in s ? s.decimals : 0} />
                      {s.suffix}
                    </>
                  ) : (
                    s.display
                  )}
                </dd>
                <dt className="label mt-4">{s.label}</dt>
                {!s.verified && <span className="absolute right-2 top-2 bg-[#ff5d5d22] px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-[#ff8a8a]">Unverified · hidden in prod</span>}
              </Reveal>
            ))}
          </dl>
        </div>
      )}

      <div className="border-t border-line py-14">
        <p className="label wrap mb-10 text-center">Trusted by ambitious businesses</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <ul className="flex w-max [animation:marquee_40s_linear_infinite] hover:[animation-play-state:paused]" aria-label="Client logos (placeholders)">
            {[...clientLogos, ...clientLogos].map((l, i) => (
              <li key={i} aria-hidden={i >= clientLogos.length} className="display px-10 text-[1.4rem] tracking-[0.25em] text-fg opacity-35 grayscale transition-opacity duration-500 hover:opacity-90 sm:px-16 sm:text-[1.7rem]">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
