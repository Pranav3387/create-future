import { SplitLines, Reveal } from "./Reveal";

export function SectionHeader({ index, eyebrow, lines, intro, align = "left" }: { index: string; eyebrow: string; lines: string[]; intro?: string; align?: "left" | "split" }) {
  return (
    <div className={align === "split" ? "grid gap-10 lg:grid-cols-12 lg:items-end" : ""}>
      <div className={align === "split" ? "lg:col-span-8" : ""}>
        <Reveal className="mb-8 flex items-center gap-4">
          <span className="label text-blue">{index}</span>
          <span className="h-px w-12 bg-line-strong" />
          <span className="label">{eyebrow}</span>
        </Reveal>
        <SplitLines lines={lines} className="display text-[clamp(2.6rem,7vw,6.5rem)] metal-text" />
      </div>
      {intro && (
        <Reveal delay={0.2} className={align === "split" ? "lg:col-span-4" : "mt-8 max-w-xl"}>
          <p className="text-lg leading-relaxed text-muted">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
