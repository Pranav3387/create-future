/**
 * Cinematic London street at night: a Georgian terrace with a premium
 * halo-lit shopfront. Pure SVG, so it renders sharply at any size and
 * needs no network request. Swap for a photo/video by replacing this
 * component in <Hero />.
 */
export function HeroScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020306" />
          <stop offset="0.6" stopColor="#0a1220" />
          <stop offset="1" stopColor="#121c2e" />
        </linearGradient>
        <linearGradient id="h-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1118" />
          <stop offset="1" stopColor="#020304" />
        </linearGradient>
        <linearGradient id="h-interior" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b98a" stopOpacity="0.75" />
          <stop offset="0.6" stopColor="#5a3f22" stopOpacity="0.85" />
          <stop offset="1" stopColor="#120c06" />
        </linearGradient>
        <linearGradient id="h-glass" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="h-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cfe2ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3d8bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="h-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe3b3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="h-pool" cx="0.5" cy="0" r="0.7">
          <stop offset="0" stopColor="#9cc4ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3d8bff" stopOpacity="0" />
        </radialGradient>
        <pattern id="h-stone" width="96" height="32" patternUnits="userSpaceOnUse">
          <rect width="96" height="32" fill="#0e1014" />
          <path d="M0 31.5H96M48 0V16M0 16H96M24 16V32M72 16V32" stroke="#fff" strokeOpacity="0.03" />
        </pattern>
        <pattern id="h-brick" width="40" height="16" patternUnits="userSpaceOnUse">
          <rect width="40" height="16" fill="#0f0b0a" />
          <path d="M0 15.5H40M20 0V8M0 8H40M0 8V16" stroke="#000" strokeOpacity="0.5" />
        </pattern>
        <filter id="h-blur-lg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30" /></filter>
        <filter id="h-blur-sm" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="h-letter" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="a" />
          <feFlood floodColor="#7fb2ff" floodOpacity="0.9" />
          <feComposite in2="a" operator="in" result="halo" />
          <feMerge><feMergeNode in="halo" /><feMergeNode in="halo" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#h-sky)" />

      {/* distant skyline */}
      <path d="M0 330H90V280H140V250H190V300H260V230H300V180H320V230H380V290H460V260H520V310H600V340H0Z" fill="#070a10" />
      <path d="M1100 330V260H1160V210H1180V160H1196V210H1230V270H1300V240H1360V290H1440V250H1500V300H1600V330Z" fill="#070a10" />
      {[[120, 300], [170, 270], [280, 250], [350, 300], [1180, 230], [1330, 260], [1470, 280]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="5" fill="#ffd9a0" opacity="0.5" />
      ))}

      {/* left neighbour: brick terrace */}
      <rect x="0" y="210" width="420" height="510" fill="url(#h-brick)" />
      {[60, 240].map((x) => (
        <g key={x}>
          <rect x={x} y="260" width="110" height="170" fill="#05070a" stroke="#1c1f25" strokeWidth="6" />
          <rect x={x + 6} y="266" width="98" height="158" fill={x === 240 ? "#2d2114" : "#080a0e"} />
          <path d={`M${x + 55} 266V424M${x + 6} 345H${x + 104}`} stroke="#1c1f25" strokeWidth="4" />
        </g>
      ))}
      <rect x="0" y="480" width="420" height="240" fill="#07080b" />
      <rect x="30" y="500" width="360" height="200" fill="#0d1016" />
      <rect x="40" y="510" width="340" height="180" fill="#1a1712" opacity="0.6" />

      {/* hero building: portland stone, Georgian proportions */}
      <rect x="420" y="120" width="780" height="600" fill="url(#h-stone)" />
      <rect x="410" y="112" width="800" height="14" fill="#191c22" />
      {[480, 680, 880, 1080].map((x, i) => (
        <g key={x}>
          <rect x={x} y="160" width="86" height="150" fill="#05070a" stroke="#22262e" strokeWidth="5" />
          <rect x={x + 5} y="165" width="76" height="140" fill={i === 2 ? "#3b2a17" : "#090b10"} />
          <path d={`M${x + 43} 165V305M${x + 5} 235H${x + 81}`} stroke="#22262e" strokeWidth="3" />
          <rect x={x - 6} y="310" width="98" height="8" fill="#1a1d23" />
        </g>
      ))}
      <rect x="410" y="350" width="800" height="16" fill="#1a1d23" />

      {/* fascia with halo-lit stainless letters */}
      <rect x="450" y="378" width="720" height="98" fill="#050608" />
      <rect x="450" y="378" width="720" height="98" fill="none" stroke="#2a2f38" strokeWidth="2" />
      <ellipse cx="810" cy="427" rx="330" ry="44" fill="url(#h-halo)" opacity="0.55" filter="url(#h-blur-lg)" />
      <text
        x="810" y="429" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-archivo), sans-serif" fontWeight="600" fontSize="54" letterSpacing="22"
        fill="#0b0d10" stroke="#c9ced6" strokeWidth="1.2" filter="url(#h-letter)"
        style={{ fontVariationSettings: '"wdth" 120' }}
      >
        THE NORTH HOUSE
      </text>

      {/* projecting sign */}
      <rect x="1196" y="390" width="10" height="70" fill="#2a2f38" />
      <circle cx="1250" cy="430" r="40" fill="#07080b" stroke="#c9a96e" strokeWidth="3" />
      <text x="1250" y="431" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-serif), serif" fontSize="30" fontStyle="italic" fill="#e8d3a6">N</text>
      <circle cx="1250" cy="430" r="40" fill="#e8d3a6" opacity="0.15" filter="url(#h-blur-sm)" />

      {/* shopfront glazing */}
      <rect x="450" y="486" width="720" height="234" fill="#040506" />
      <rect x="466" y="500" width="300" height="220" fill="url(#h-interior)" />
      <rect x="784" y="500" width="110" height="220" fill="url(#h-interior)" opacity="0.65" />
      <rect x="912" y="500" width="242" height="220" fill="url(#h-interior)" />
      {[616, 1032].map((x) => <rect key={x} x={x} y="500" width="5" height="220" fill="#040506" />)}
      {[540, 690, 990, 1100].map((x) => (
        <g key={x}>
          <line x1={x} y1="500" x2={x} y2="560" stroke="#000" strokeOpacity="0.7" />
          <circle cx={x} cy="566" r="7" fill="#ffe7bf" />
          <circle cx={x} cy="566" r="26" fill="url(#h-lamp)" />
        </g>
      ))}
      {/* tables silhouettes */}
      {[520, 680, 980, 1090].map((x) => (
        <g key={x} opacity="0.75">
          <rect x={x - 30} y="660" width="60" height="6" fill="#0a0705" />
          <rect x={x - 3} y="666" width="6" height="54" fill="#0a0705" />
        </g>
      ))}
      <rect x="466" y="500" width="688" height="220" fill="url(#h-glass)" opacity="0.8" />

      {/* right neighbour */}
      <rect x="1200" y="180" width="400" height="540" fill="url(#h-brick)" />
      <rect x="1200" y="480" width="400" height="240" fill="#060709" />
      {[1300, 1460].map((x) => (
        <rect key={x} x={x} y="250" width="96" height="160" fill="#06080b" stroke="#1c1f25" strokeWidth="6" />
      ))}

      {/* street lamp */}
      <rect x="372" y="300" width="8" height="420" fill="#0a0b0d" />
      <path d="M356 300H396L388 270H364Z" fill="#14161a" />
      <circle cx="376" cy="290" r="90" fill="url(#h-lamp)" opacity="0.7" />

      {/* pavement + kerb + wet road */}
      <rect y="720" width="1600" height="40" fill="#0b0d11" />
      <rect y="756" width="1600" height="4" fill="#1c2027" />
      <rect y="760" width="1600" height="140" fill="url(#h-road)" />
      <ellipse cx="810" cy="770" rx="520" ry="80" fill="url(#h-pool)" />
      <ellipse cx="810" cy="800" rx="260" ry="10" fill="#cfe2ff" opacity="0.25" filter="url(#h-blur-sm)" />
      <ellipse cx="376" cy="790" rx="60" ry="8" fill="#ffd9a0" opacity="0.25" filter="url(#h-blur-sm)" />
      {/* reflected fascia glow */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={560 + i * 6} y={800 + i * 18} width={500 - i * 12} height="3" fill="#cfe2ff" opacity={0.18 - i * 0.04} />
      ))}
    </svg>
  );
}
