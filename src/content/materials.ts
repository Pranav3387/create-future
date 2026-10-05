export type Material = {
  id: string;
  name: string;
  finish: string;
  durability: string;
  application: string;
  illumination: string;
  /** CSS background used for the 3D swatch. */
  surface: string;
  sheen: number;
};

export const materials: Material[] = [
  {
    id: "acrylic", name: "Acrylic", finish: "Gloss, matte or opal diffused",
    durability: "8–10 years exterior; UV-stable cast grades",
    application: "Built-up letters, lightbox faces, reception logos",
    illumination: "Excellent: face, edge and halo lit",
    surface: "linear-gradient(135deg,#f4f7fb 0%,#d9e2ee 45%,#ffffff 55%,#cfd8e6 100%)", sheen: 0.9,
  },
  {
    id: "stainless", name: "Stainless Steel", finish: "Brushed, mirror polished or PVD coloured",
    durability: "20+ years; marine grade 316 for coastal or high-traffic sites",
    application: "Premium fabricated letters, plaques, corporate entrances",
    illumination: "Halo lit (reverse lit) with acrylic backs",
    surface: "repeating-linear-gradient(90deg,#9aa3ad 0 1px,#b9c1ca 1px 3px),linear-gradient(135deg,#6f7780,#e3e8ee 50%,#7d858e)", sheen: 0.7,
  },
  {
    id: "aluminium", name: "Aluminium", finish: "Powder coated, anodised or brushed",
    durability: "15–20 years; lightweight and corrosion resistant",
    application: "Fascia trays, flat-cut letters, totems and wayfinding",
    illumination: "Halo or push-through acrylic illumination",
    surface: "linear-gradient(160deg,#c3c8cf,#8e959e 40%,#d6dbe1 60%,#9aa1aa)", sheen: 0.5,
  },
  {
    id: "brass", name: "Brass", finish: "Polished, brushed or aged patina; lacquered",
    durability: "20+ years; develops character over time unless sealed",
    application: "Heritage shopfronts, hospitality, luxury retail",
    illumination: "Halo lit for a warm, premium glow",
    surface: "linear-gradient(135deg,#7a5a23,#e8c879 40%,#b8913f 55%,#f2dc9b 70%,#8a6a2c)", sheen: 0.85,
  },
  {
    id: "acp", name: "ACP (Aluminium Composite)", finish: "Gloss or matte, any RAL colour, metallic effects",
    durability: "10–15 years; flat, rigid and weather resistant",
    application: "Fascia panels, tray signs, cladding and hoardings",
    illumination: "Route-out with push-through acrylic, or external trough lights",
    surface: "linear-gradient(135deg,#25282d,#3b4048 50%,#2a2e34)", sheen: 0.4,
  },
  {
    id: "vinyl", name: "Vinyl", finish: "Gloss, matte, frosted, metallic, reflective",
    durability: "5–8 years cast; 3–5 years calendered",
    application: "Window graphics, vehicle livery, wall graphics, privacy film",
    illumination: "Translucent grades for lightbox faces",
    surface: "linear-gradient(135deg,#0f1218,#1c2230 50%,#11151c)", sheen: 0.6,
  },
  {
    id: "neon", name: "LED Neon", finish: "Silicone flex tube on clear or tinted acrylic backing",
    durability: "50,000+ hour LEDs; IP65 or higher for exterior",
    application: "Hospitality, retail interiors, feature walls, events",
    illumination: "Self-illuminated: RGB, tunable white or single colour",
    surface: "radial-gradient(circle at 50% 50%,#bfe3ff 0%,#3d9bff 30%,#0b1a33 70%)", sheen: 1,
  },
  {
    id: "perspex", name: "Perspex®", finish: "Clear, opal, frosted, mirrored, coloured",
    durability: "10+ years; premium cast acrylic brand",
    application: "Stand-off panels, plaques, face-lit letter returns",
    illumination: "Excellent light diffusion with opal grades",
    surface: "linear-gradient(135deg,rgba(255,255,255,.85),rgba(190,215,240,.55) 50%,rgba(255,255,255,.9))", sheen: 0.95,
  },
  {
    id: "wood", name: "Wood", finish: "Oiled, stained, lacquered or charred",
    durability: "5–15 years exterior depending on species and treatment",
    application: "Hospitality, independent retail, interior feature signs",
    illumination: "External spot or trough lighting; halo with care",
    surface: "repeating-linear-gradient(95deg,#6b4428 0 6px,#7c5132 6px 9px,#5e3b22 9px 14px),linear-gradient(#7a5034,#5a381f)", sheen: 0.25,
  },
];
