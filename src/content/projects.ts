/**
 * Portfolio entries. Shaped so they can be swapped for a CMS query
 * (Sanity, Contentful, Payload…) without touching the components:
 * export an async `getProjects()` that returns Project[].
 *
 * NOTE: these are placeholder projects for layout. Replace with real work
 * and real photography before launch.
 */
export type Project = {
  slug: string;
  name: string;
  location: string;
  type: string;
  sector: string;
  /** Sign text rendered on the illustrated scene. */
  signText: string;
  palette: { glow: string; wall: string; accent: string };
  style: "serif" | "sans" | "script" | "mono";
  image?: string;
};

export const projects: Project[] = [
  { slug: "the-north-house", name: "The North House", location: "Mayfair, London", type: "Architectural Illuminated Signage", sector: "Luxury restaurant", signText: "THE NORTH HOUSE", palette: { glow: "#f5e6c8", wall: "#17140f", accent: "#c9a96e" }, style: "serif" },
  { slug: "blade-and-co", name: "Blade & Co.", location: "Shoreditch, London", type: "Halo-lit 3D Lettering", sector: "Barber shop", signText: "BLADE & CO.", palette: { glow: "#dbe7ff", wall: "#101318", accent: "#9fb4d9" }, style: "sans" },
  { slug: "meridian-capital", name: "Meridian Capital", location: "City of London", type: "Reception & Wayfinding", sector: "Corporate office", signText: "MERIDIAN", palette: { glow: "#e8eef7", wall: "#0d1015", accent: "#b8c4d6" }, style: "sans" },
  { slug: "atelier-vale", name: "Atelier Vale", location: "Chelsea, London", type: "Brass Fascia & Projecting Sign", sector: "Retail store", signText: "Atelier Vale", palette: { glow: "#ffe2b0", wall: "#13110d", accent: "#d4a55a" }, style: "script" },
  { slug: "hotel-lumen", name: "Hotel Lumen", location: "Kensington, London", type: "Illuminated Canopy Lettering", sector: "Hotel", signText: "HOTEL LUMEN", palette: { glow: "#ffffff", wall: "#0c0e12", accent: "#8fb3ff" }, style: "serif" },
  { slug: "forge-performance", name: "Forge Performance", location: "Hackney, London", type: "LED Neon & Wall Graphics", sector: "Gym", signText: "FORGE", palette: { glow: "#5fb8ff", wall: "#08090c", accent: "#2f7cff" }, style: "mono" },
  { slug: "ember-coffee", name: "Ember Coffee", location: "Borough, London", type: "Lightbox & Window Graphics", sector: "Café", signText: "ember", palette: { glow: "#ffd2a8", wall: "#14100d", accent: "#ff9a5c" }, style: "script" },
  { slug: "one-canal-wharf", name: "One Canal Wharf", location: "King's Cross, London", type: "Development Hoarding & Totems", sector: "Property development", signText: "ONE CANAL WHARF", palette: { glow: "#e6f0ff", wall: "#0b0d11", accent: "#7aa7ff" }, style: "sans" },
];

export async function getProjects(): Promise<Project[]> {
  return projects;
}
