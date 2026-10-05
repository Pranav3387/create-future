"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Logo } from "./ui/Logo";
import { ThemeToggle } from "./ui/ThemeToggle";

const ease = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > prev && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
          scrolled ? "border-b border-line bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="wrap flex h-[76px] items-center justify-between gap-6">
          <a href="#top" aria-label="SIGNOVA home" className="text-fg">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="group relative label !text-[0.68rem] !text-fg/80 transition-colors hover:!text-fg">
                    {item.label}
                    <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-blue transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="label hidden !text-fg/80 hover:!text-fg xl:inline">
              {site.phoneDisplay}
            </a>
            <ThemeToggle />
            <a href="#contact" className="btn btn-primary hidden !py-3 sm:inline-flex">
              Get a quote <span className="arrow">→</span>
            </a>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-4 bg-fg transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-4 bg-fg transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg arch-grid lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="wrap flex flex-1 flex-col justify-center pt-24">
              <ul className="space-y-2">
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display flex items-baseline gap-4 py-1 text-[clamp(2.6rem,12vw,5rem)] text-fg"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.05 }}
                    >
                      <span className="label text-blue">0{i + 1}</span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              className="wrap flex flex-col gap-3 pb-10 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary">Book a consultation <span className="arrow">→</span></a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="btn btn-ghost">Call {site.phoneDisplay}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
