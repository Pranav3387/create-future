export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <path d="M9 22c0 0 1.5 2 7 2s7-2 7-4.5-3-3.5-7-4-7-1.5-7-4S10.5 8 16 8s7 2 7 2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="26" cy="6" r="2" fill="var(--blue)" />
      </svg>
      <span className="display text-[1.15rem] tracking-[0.18em]" style={{ letterSpacing: "0.22em" }}>SIGNOVA</span>
    </span>
  );
}
