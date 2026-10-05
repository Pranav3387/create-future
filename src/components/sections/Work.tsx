"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { SignScene } from "../scenes/SignScene";
import { SplitLines, Reveal } from "../ui/Reveal";

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <article className="group relative w-[82vw] shrink-0 snap-start sm:w-[min(62vw,68vh)] lg:w-[min(44vw,64vh)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#050607] sm:aspect-[5/4]">
        <div className="h-full w-full transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={`${p.name}: ${p.type}`} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <SignScene variant="shopfront" text={p.signText} palette={p.palette} font={p.style} title={`${p.name}, ${p.type}`} />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35),transparent_30%,transparent_60%,rgba(0,0,0,.7))]" />
        <span className="label absolute left-5 top-5 !text-white/70">{String(i + 1).padStart(2, "0")} / {p.sector}</span>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto] items-start gap-4 border-t border-line pt-5">
        <div>
          <h3 className="display text-[clamp(1.5rem,2.6vw,2.4rem)]">{p.name}</h3>
          <p className="mt-2 text-muted">{p.type}</p>
        </div>
        <p className="label pt-2 text-right">{p.location}</p>
      </div>
    </article>
  );
}

export function Work({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(true);

  useLayoutEffect(() => {
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      setPinned(desktop);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="work"
      ref={section}
      aria-labelledby="work-title"
      className="relative bg-bg-2"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-24"}>
        <div className="wrap mb-10 flex items-end justify-between gap-8 pt-16">
          <div>
            <Reveal className="mb-6 flex items-center gap-4">
              <span className="label text-blue">02</span><span className="h-px w-12 bg-line-strong" /><span className="label">Portfolio</span>
            </Reveal>
            <SplitLines lines={["Selected work"]} className="display text-[clamp(2.6rem,min(7vw,10vh),6.5rem)] metal-text" />
            <span id="work-title" className="sr-only">Selected work</span>
          </div>
          <div className="hidden w-48 md:block">
            <p className="label mb-3">Scroll</p>
            <div className="h-px w-full bg-line-strong"><motion.div className="h-px bg-blue" style={{ width: progress }} /></div>
          </div>
        </div>

        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={`flex gap-6 pl-[clamp(1.25rem,4vw,3.5rem)] pr-[clamp(1.25rem,4vw,3.5rem)] md:gap-10 ${pinned ? "" : "no-scrollbar snap-x snap-mandatory overflow-x-auto"}`}
        >
          {projects.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}
          <a href="#contact" className="group flex w-[70vw] shrink-0 snap-start flex-col justify-center border border-line p-10 sm:w-[40vw] lg:w-[28vw]">
            <p className="label mb-6">Your project</p>
            <p className="display text-[clamp(2rem,3.5vw,3.4rem)]">Could be<br />next.</p>
            <span className="btn btn-primary mt-10 self-start">Start a project <span className="arrow">→</span></span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
