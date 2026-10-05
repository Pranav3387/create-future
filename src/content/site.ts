/**
 * Central business details. Every component reads from here, so updating
 * contact info, socials or stats happens in one place.
 */
export const site = {
  name: "SIGNOVA",
  tagline: "We Build What Gets Noticed.",
  description:
    "Architectural signage, illuminated branding and complete visual identity solutions for ambitious businesses across London.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.signova.co.uk",
  // TODO: replace placeholder contact details before launch.
  phone: "+44 20 0000 0000",
  phoneDisplay: "020 0000 0000",
  whatsapp: "442000000000",
  email: "studio@signova.co.uk",
  address: {
    locality: "London",
    region: "Greater London",
    country: "GB",
    // Used for the map embed and schema markup.
    mapQuery: "London, United Kingdom",
    lat: 51.5072,
    lng: -0.1276,
  },
  socials: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
  },
  hours: "Mo-Fr 08:00-18:00",
} as const;

/**
 * IMPORTANT: only publish statistics that are verified. Set `verified: true`
 * once a figure has been checked; unverified stats render with a "draft" marker
 * in development and are hidden in production builds.
 */
export const stats = [
  { value: 500, suffix: "+", label: "Projects delivered", verified: false },
  { value: 4.9, suffix: "★", label: "Client rating", decimals: 1, verified: false },
  { value: null, display: "London", label: "Wide installation", verified: true },
  { value: 10, suffix: "+", label: "Years industry experience", verified: false },
] as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Materials", href: "#materials" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
