"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({ delay = 0, y = 40, children, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Splits a heading into lines that slide up from a mask, editorial style. */
export function SplitLines({ lines, className = "", delay = 0, as: Tag = "h2" }: { lines: string[]; className?: string; delay?: number; as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        // Observe the mask, not the clipped line: the line starts fully hidden,
        // so an observer on it would never fire.
        <motion.span
          key={i}
          className="block overflow-hidden pb-[0.06em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-5% 0px" }}
        >
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 1.2, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
