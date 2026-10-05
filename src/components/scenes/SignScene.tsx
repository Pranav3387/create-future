import { useId } from "react";
import type { SceneVariant } from "@/content/services";

type Palette = { glow: string; wall: string; accent: string };
type FontStyle = "serif" | "sans" | "script" | "mono";

const fonts: Record<FontStyle, { family: string; weight: number; spacing: number; italic?: boolean }> = {
  serif: { family: "var(--font-serif), Georgia, serif", weight: 500, spacing: 6 },
  sans: { family: "var(--font-archivo), sans-serif", weight: 600, spacing: 8 },
  script: { family: "var(--font-serif), Georgia, serif", weight: 400, spacing: 1, italic: true },
  mono: { family: "var(--font-mono-face), monospace", weight: 600, spacing: 14 },
};

const defaultPalette: Palette = { glow: "#e6f0ff", wall: "#0d0f13", accent: "#3d8bff" };

/**
 * Illustrated night-time signage scenes. They stand in for photography
 * until real project images are supplied (pass `image` on the content item).
 * Every scene is a single inline SVG, so they cost nothing to load.
 */
export function SignScene({
  variant = "shopfront",
  text = "SIGNOVA",
  palette = defaultPalette,
  font = "sans",
  className = "",
  title,
}: {
  variant?: SceneVariant;
  text?: string;
  palette?: Palette;
  font?: FontStyle;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const f = fonts[font];
  const fontSize = Math.min(64, 760 / Math.max(text.length, 6));

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={title ?? `${text} signage illustration`}
    >
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04060a" />
          <stop offset="1" stopColor="#0c1422" />
        </linearGradient>
        <linearGradient id={id("interior")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.accent} stopOpacity="0.55" />
          <stop offset="1" stopColor="#120d08" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={id("pave")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11141a" />
          <stop offset="1" stopColor="#040506" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9ced6" />
          <stop offset="0.7" stopColor="#7d848e" />
          <stop offset="1" stopColor="#e8ebef" />
        </linearGradient>
        <radialGradient id={id("pool")} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor={palette.glow} stopOpacity="0.45" />
          <stop offset="1" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>
        <pattern id={id("stone")} width="80" height="28" patternUnits="userSpaceOnUse">
          <rect width="80" height="28" fill={palette.wall} />
          <path d="M0 27.5H80M40 0V14M0 14H80M20 14V28M60 14V28" stroke="#fff" strokeOpacity="0.035" />
        </pattern>
        <pattern id={id("brick")} width="44" height="20" patternUnits="userSpaceOnUse">
          <rect width="44" height="20" fill="#1a1210" />
          <rect x="1" y="1" width="42" height="8" fill="#2a1a15" />
          <rect x="-21" y="11" width="42" height="8" fill="#25170f" />
          <rect x="23" y="11" width="42" height="8" fill="#2c1c15" />
        </pattern>
        <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={id("soft")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {variant === "shopfront" || variant === "lightbox" ? (
        <g>
          <rect width="800" height="600" fill={`url(#${id("sky")})`} />
          <rect x="40" y="0" width="720" height="520" fill={`url(#${id("stone")})`} />
          {/* upper floor windows */}
          {[110, 330, 550].map((x, i) => (
            <g key={x}>
              <rect x={x} y="40" width="140" height="150" fill="#06080c" stroke="#2a2f38" strokeWidth="4" />
              <rect x={x + 6} y="46" width="128" height="138" fill={i === 1 ? "#3a2a18" : "#0b0e14"} opacity={i === 1 ? 0.8 : 1} />
              <path d={`M${x + 70} 46V184M${x + 6} 115H${x + 134}`} stroke="#2a2f38" strokeWidth="3" />
            </g>
          ))}
          {/* cornice */}
          <rect x="30" y="214" width="740" height="10" fill="#1d2129" />
          {/* fascia */}
          <rect x="60" y="230" width="680" height="88" fill={variant === "lightbox" ? palette.glow : "#07080b"} opacity={variant === "lightbox" ? 0.92 : 1} />
          {variant === "lightbox" && <rect x="60" y="230" width="680" height="88" fill={palette.glow} filter={`url(#${id("soft")})`} opacity="0.6" />}
          <rect x="60" y="230" width="680" height="88" fill="none" stroke="#2c313a" strokeWidth="3" />
          <text
            x="400" y="274" textAnchor="middle" dominantBaseline="central"
            fontFamily={f.family} fontWeight={f.weight} fontStyle={f.italic ? "italic" : "normal"}
            fontSize={fontSize} letterSpacing={f.spacing}
            fill={variant === "lightbox" ? palette.wall : palette.glow}
            filter={variant === "lightbox" ? undefined : `url(#${id("glow")})`}
          >
            {text}
          </text>
          {/* shop window + door */}
          <rect x="60" y="330" width="680" height="190" fill="#05070a" />
          <rect x="74" y="342" width="440" height="168" fill={`url(#${id("interior")})`} />
          <rect x="530" y="342" width="90" height="178" fill={`url(#${id("interior")})`} opacity="0.7" />
          <rect x="636" y="342" width="90" height="168" fill={`url(#${id("interior")})`} />
          {[220, 368].map((x) => <rect key={x} x={x} y="342" width="4" height="168" fill="#05070a" />)}
          {/* interior pendant lights */}
          {[150, 290, 430].map((x) => (
            <g key={x}>
              <line x1={x} y1="342" x2={x} y2="380" stroke="#000" strokeOpacity="0.6" />
              <circle cx={x} cy="384" r="6" fill={palette.glow} filter={`url(#${id("glow")})`} />
            </g>
          ))}
          <rect x="74" y="342" width="440" height="168" fill={`url(#${id("glass")})`} className="[animation:sweep_7s_ease-in-out_infinite]" style={{ transformBox: "fill-box" }} />
          {/* pavement + reflection */}
          <rect y="520" width="800" height="80" fill={`url(#${id("pave")})`} />
          <ellipse cx="400" cy="530" rx="340" ry="60" fill={`url(#${id("pool")})`} />
          <text
            x="400" y="570" textAnchor="middle" dominantBaseline="central" transform="scale(1,-0.35) translate(0,-2200)"
            fontFamily={f.family} fontWeight={f.weight} fontSize={fontSize} letterSpacing={f.spacing}
            fill={palette.glow} opacity="0.12" filter={`url(#${id("soft")})`}
          >
            {text}
          </text>
        </g>
      ) : null}

      {variant === "letters" && (
        <g>
          <rect width="800" height="600" fill="#0a0b0d" />
          <rect width="800" height="600" fill={`url(#${id("stone")})`} opacity="0.8" />
          <ellipse cx="400" cy="300" rx="330" ry="120" fill={palette.glow} opacity="0.35" filter={`url(#${id("soft")})`} />
          {[8, 6, 4, 2].map((d) => (
            <text key={d} x={400 + d} y={300 + d} textAnchor="middle" dominantBaseline="central" fontFamily={fonts.sans.family} fontWeight={700} fontSize="150" letterSpacing="10" fill="#1c2027">
              {text.slice(0, 5)}
            </text>
          ))}
          <text x="400" y="300" textAnchor="middle" dominantBaseline="central" fontFamily={fonts.sans.family} fontWeight={700} fontSize="150" letterSpacing="10" fill={`url(#${id("metal")})`}>
            {text.slice(0, 5)}
          </text>
          <rect x="0" y="470" width="800" height="130" fill="#050607" opacity="0.6" />
        </g>
      )}

      {variant === "neon" && (
        <g>
          <rect width="800" height="600" fill={`url(#${id("brick")})`} />
          <rect width="800" height="600" fill="#000" opacity="0.55" />
          <ellipse cx="400" cy="290" rx="300" ry="150" fill={palette.glow} opacity="0.25" filter={`url(#${id("soft")})`} />
          <text
            x="400" y="290" textAnchor="middle" dominantBaseline="central"
            fontFamily={fonts.script.family} fontStyle="italic" fontSize="150"
            fill="none" stroke={palette.glow} strokeWidth="5" strokeLinecap="round"
            filter={`url(#${id("glow")})`} className="[animation:flicker_6s_infinite]"
          >
            {text}
          </text>
          <text x="400" y="290" textAnchor="middle" dominantBaseline="central" fontFamily={fonts.script.family} fontStyle="italic" fontSize="150" fill="none" stroke="#fff" strokeWidth="1.5">
            {text}
          </text>
        </g>
      )}

      {variant === "wayfinding" && (
        <g>
          <rect width="800" height="600" fill="#0c0e12" />
          {/* corridor perspective */}
          <path d="M0 0L300 200H500L800 0Z" fill="#14171d" />
          <path d="M0 600L300 400H500L800 600Z" fill="#08090c" />
          <path d="M0 0L300 200V400L0 600Z" fill="#101318" />
          <path d="M800 0L500 200V400L800 600Z" fill="#0e1116" />
          <rect x="300" y="200" width="200" height="200" fill={palette.glow} opacity="0.12" />
          {[60, 150, 240].map((y, i) => (
            <line key={y} x1={300 - i * 0} y1="200" x2="0" y2={y - 60} stroke="#fff" strokeOpacity="0.03" />
          ))}
          {/* wall panel */}
          <g transform="translate(70 170) skewY(18)">
            <rect width="190" height="230" fill="#1b1f26" stroke="#2d333d" />
            <text x="20" y="50" fontFamily={fonts.mono.family} fontSize="13" letterSpacing="3" fill={palette.accent}>LEVEL 03</text>
            {["MEETING ROOMS", "STUDIO", "LIFTS"].map((t, i) => (
              <g key={t}>
                <line x1="20" x2="170" y1={80 + i * 45} y2={80 + i * 45} stroke="#2d333d" />
                <text x="20" y={108 + i * 45} fontFamily={fonts.sans.family} fontWeight={600} fontSize="15" letterSpacing="2" fill="#e8ecf2">{t}</text>
                <text x="160" y={108 + i * 45} textAnchor="end" fontFamily={fonts.sans.family} fontSize="16" fill={palette.accent}>{i === 1 ? "←" : "→"}</text>
              </g>
            ))}
          </g>
          {/* suspended sign */}
          <rect x="330" y="150" width="140" height="34" fill="#1b1f26" stroke="#2d333d" />
          <text x="400" y="167" textAnchor="middle" dominantBaseline="central" fontFamily={fonts.sans.family} fontWeight={600} fontSize="12" letterSpacing="3" fill="#e8ecf2">RECEPTION →</text>
          <line x1="345" x2="345" y1="120" y2="150" stroke="#2d333d" />
          <line x1="455" x2="455" y1="120" y2="150" stroke="#2d333d" />
        </g>
      )}

      {variant === "vehicle" && (
        <g>
          <rect width="800" height="600" fill={`url(#${id("sky")})`} />
          <rect y="430" width="800" height="170" fill={`url(#${id("pave")})`} />
          <ellipse cx="400" cy="450" rx="360" ry="30" fill="#000" opacity="0.6" />
          {/* van body */}
          <path d="M110 430V210Q110 180 140 180H520L620 260H680Q700 260 700 280V430Z" fill="#e9ecf0" />
          <path d="M530 192L606 256H530Z" fill="#0d1218" />
          <rect x="110" y="300" width="590" height="70" fill={palette.wall} />
          <rect x="110" y="300" width="590" height="6" fill={palette.accent} />
          <text x="150" y="250" fontFamily={fonts.sans.family} fontWeight={700} fontSize="44" letterSpacing="6" fill={palette.wall}>{text}</text>
          <text x="150" y="342" fontFamily={fonts.mono.family} fontSize="14" letterSpacing="4" fill="#e9ecf0">SIGNAGE · INSTALLATION · LONDON</text>
          {[220, 590].map((x) => (
            <g key={x}>
              <circle cx={x} cy="430" r="48" fill="#08090b" />
              <circle cx={x} cy="430" r="22" fill="#9aa1aa" />
            </g>
          ))}
          <rect x="680" y="290" width="20" height="12" fill={palette.glow} filter={`url(#${id("glow")})`} />
        </g>
      )}

      {variant === "window" && (
        <g>
          <rect width="800" height="600" fill="#0b0d10" />
          <rect x="60" y="60" width="680" height="480" fill={`url(#${id("interior")})`} />
          {/* people silhouettes behind frosting */}
          <circle cx="250" cy="270" r="26" fill="#000" opacity="0.4" />
          <rect x="220" y="300" width="60" height="140" rx="20" fill="#000" opacity="0.4" />
          <circle cx="540" cy="280" r="24" fill="#000" opacity="0.4" />
          <rect x="512" y="306" width="56" height="134" rx="20" fill="#000" opacity="0.4" />
          {/* frosted band */}
          <rect x="60" y="230" width="680" height="170" fill="#e8eef5" opacity="0.55" />
          {Array.from({ length: 34 }).map((_, i) => (
            <rect key={i} x={60 + i * 20} y="230" width="10" height="170" fill="#fff" opacity="0.08" />
          ))}
          <text x="400" y="315" textAnchor="middle" dominantBaseline="central" fontFamily={fonts.sans.family} fontWeight={600} fontSize="38" letterSpacing="14" fill="#0b0d10" opacity="0.75">{text}</text>
          <rect x="60" y="60" width="680" height="480" fill={`url(#${id("glass")})`} />
          <rect x="60" y="60" width="680" height="480" fill="none" stroke="#1e232b" strokeWidth="14" />
          <line x1="400" x2="400" y1="60" y2="540" stroke="#1e232b" strokeWidth="10" />
        </g>
      )}

      {variant === "brand" && (
        <g>
          <rect width="800" height="600" fill="#0d0f12" />
          {/* timber slat wall */}
          {Array.from({ length: 40 }).map((_, i) => (
            <rect key={i} x={i * 20} y="0" width="14" height="420" fill={i % 2 ? "#2a1d14" : "#2f2117"} />
          ))}
          <ellipse cx="400" cy="200" rx="250" ry="90" fill={palette.glow} opacity="0.3" filter={`url(#${id("soft")})`} />
          <text x="400" y="200" textAnchor="middle" dominantBaseline="central" fontFamily={fonts.sans.family} fontWeight={700} fontSize="72" letterSpacing="14" fill="#e9dcc0" filter={`url(#${id("glow")})`}>{text}</text>
          {/* reception desk */}
          <rect x="170" y="390" width="460" height="130" fill="#e9eaec" />
          <rect x="170" y="390" width="460" height="10" fill="#c7cad0" />
          <rect x="170" y="510" width="460" height="10" fill={palette.glow} opacity="0.7" filter={`url(#${id("glow")})`} />
          <rect y="520" width="800" height="80" fill="#08090b" />
        </g>
      )}
    </svg>
  );
}
