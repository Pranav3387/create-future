"use client";

import { motion } from "framer-motion";

/** Page transition: a silver curtain wipes away on each route change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] origin-top bg-[#0a0b0e]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-blue shadow-[0_0_30px_var(--blue)]" />
      </motion.div>
      {children}
    </>
  );
}
