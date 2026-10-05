/**
 * Indicative estimator behind the AI Signage Consultant.
 * Deterministic and transparent on purpose: the figures are ballpark
 * ranges for planning only, never a quotation. Tune the numbers below
 * to match the studio's real pricing before launch.
 */
export type Answers = {
  business: string;
  location: string;
  signage: string;
  size: string;
  illuminated: string;
  logo: string;
  budget: string;
};

export const QUESTIONS: { key: keyof Answers; q: string; options?: string[]; placeholder?: string }[] = [
  { key: "business", q: "What type of business do you have?", options: ["Restaurant / café", "Retail store", "Hotel", "Office / corporate", "Gym / fitness", "Salon / barber", "Property developer", "Other"] },
  { key: "location", q: "Where is your location? A postcode or area is perfect.", placeholder: "e.g. W1, Shoreditch, Manchester" },
  { key: "signage", q: "What type of signage do you need?", options: ["3D lettering", "Illuminated / LED", "Neon", "Shopfront fascia", "Wayfinding", "Vehicle graphics", "Window graphics", "Complete branding", "Not sure"] },
  { key: "size", q: "Approximate sign size?", options: ["Small (under 1.5m)", "Medium (1.5–3m)", "Large (3–6m)", "Extra large (6m+)", "Not sure"] },
  { key: "illuminated", q: "Illuminated or non-illuminated?", options: ["Illuminated", "Non-illuminated", "Not sure"] },
  { key: "logo", q: "Do you have an existing logo?", options: ["Yes, vector files", "Yes, but low quality", "No logo yet"] },
  { key: "budget", q: "What is your approximate budget?", options: ["Under £2,500", "£2,500 – £5,000", "£5,000 – £10,000", "£10,000 – £25,000", "£25,000+", "Not sure yet"] },
];

const BASE: Record<string, [number, number]> = {
  "3D lettering": [1500, 3500],
  "Illuminated / LED": [2500, 5500],
  Neon: [700, 2200],
  "Shopfront fascia": [1800, 4500],
  Wayfinding: [2000, 8000],
  "Vehicle graphics": [600, 3500],
  "Window graphics": [350, 1500],
  "Complete branding": [8000, 30000],
  "Not sure": [1500, 6000],
};
const SIZE: Record<string, number> = { "Small (under 1.5m)": 0.6, "Medium (1.5–3m)": 1, "Large (3–6m)": 1.8, "Extra large (6m+)": 3, "Not sure": 1.15 };
const BUDGET_MAX: Record<string, number> = { "Under £2,500": 2500, "£2,500 – £5,000": 5000, "£5,000 – £10,000": 10000, "£10,000 – £25,000": 25000, "£25,000+": Infinity };

const isLondon = (loc: string) =>
  /london|^(e|ec|n|nw|se|sw|w|wc)\d|^(br|cr|da|en|ha|ig|kt|rm|sm|tw|ub)\d|shoreditch|soho|mayfair|camden|islington|hackney|chelsea|kensington|brixton|clapham|greenwich|stratford|wimbledon|croydon|ealing|richmond|canary/i.test(loc.trim());

const round = (n: number) => Math.round(n / 250) * 250;
const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export type Summary = {
  recommendation: string;
  range: string;
  low: number;
  high: number;
  materials: string[];
  installation: string[];
  nextStep: string;
  budgetNote?: string;
};

function recommend(a: Answers): string {
  const lit = a.illuminated === "Illuminated";
  const byBusiness: Record<string, string> = {
    "Restaurant / café": lit ? "Halo-lit 3D lettering on the fascia, with a matching illuminated projecting sign" : "Built-up letters on a painted timber or ACP fascia with external trough lighting",
    "Retail store": lit ? "Illuminated fascia with push-through acrylic letters and a projecting sign" : "Flat-cut aluminium letters on a powder-coated fascia tray",
    Hotel: "Fabricated stainless steel halo-lit lettering with canopy or entrance signage",
    "Office / corporate": "Brushed-metal reception logo with a coordinated wayfinding and manifestation scheme",
    "Gym / fitness": "Bold LED-illuminated lettering with large-format wall graphics and an LED neon feature",
    "Salon / barber": "Halo-lit or LED neon brand mark with frosted window manifestation",
    "Property developer": "Development hoarding graphics and freestanding illuminated totems",
  };
  const byType: Record<string, string> = {
    "3D lettering": lit ? "Halo-illuminated built-up 3D lettering" : "Built-up 3D lettering",
    "Illuminated / LED": "Slimline LED lightbox or fascia with push-through acrylic",
    Neon: "Custom LED neon on a clear acrylic backing panel",
    "Shopfront fascia": lit ? "Illuminated fascia tray with fret-cut, push-through lettering" : "Powder-coated fascia tray with applied letters",
    Wayfinding: "A modular wayfinding family: directional, identification and statutory signs",
    "Vehicle graphics": "Cast-vinyl part or full wrap with contour-cut livery",
    "Window graphics": "Frosted manifestation with cut-vinyl branding and opening hours",
    "Complete branding": "A coordinated scheme covering fascia, projecting sign, window graphics and interior feature wall",
  };
  return byType[a.signage] ?? byBusiness[a.business] ?? "Illuminated fascia signage with built-up lettering";
}

function materials(a: Answers): string[] {
  const m: Record<string, string[]> = {
    "3D lettering": ["Fabricated stainless steel or aluminium returns", "Opal acrylic backs for halo lighting", "Concealed stand-off fixings"],
    "Illuminated / LED": ["Aluminium or ACP tray", "Opal acrylic face / push-through letters", "Low-energy LED modules (IP67)"],
    Neon: ["Silicone LED neon flex", "Clear or tinted acrylic backing", "Dimmable driver with remote"],
    "Shopfront fascia": ["Powder-coated aluminium or ACP", "Acrylic or metal letters", a.illuminated === "Illuminated" ? "Internal LED illumination" : "Optional trough lighting"],
    Wayfinding: ["Aluminium panels with digital print", "Tactile & braille where required", "Interchangeable inserts"],
    "Vehicle graphics": ["Premium cast vinyl (e.g. 3M/Avery)", "Protective laminate", "Contour-cut lettering"],
    "Window graphics": ["Etch-effect frosted vinyl", "Cut vinyl lettering", "Optional one-way vision film"],
    "Complete branding": ["Mixed: metals, acrylics, ACP", "LED lighting", "Vinyl and wall graphics"],
  };
  return m[a.signage] ?? ["Aluminium or ACP fascia", "Acrylic lettering", "LED illumination where suitable"];
}

function installation(a: Answers): string[] {
  const out: string[] = [];
  const lit = a.illuminated === "Illuminated" || a.signage === "Neon" || a.signage === "Illuminated / LED";
  if (!["Vehicle graphics", "Window graphics"].includes(a.signage)) {
    out.push(lit ? "Illuminated external signs usually need advertisement consent from the local council. We can prepare the application." : "Non-illuminated signs often fall under deemed consent, but conservation areas and listed buildings have stricter rules.");
    out.push("Landlord or freeholder approval is commonly required for fascia changes.");
  }
  if (lit) out.push("A local power supply near the sign is needed; final connection by a qualified electrician.");
  if (a.size.startsWith("Large") || a.size.startsWith("Extra")) out.push("Larger signs may need a scaffold tower or MEWP, and pavement licensing in some boroughs.");
  if (a.signage === "Vehicle graphics") out.push("Vehicle must be clean and free of damaged paint; leased vehicles may need lessor approval.");
  if (a.location && !isLondon(a.location)) out.push("Your site is outside our core London area. Travel and accommodation may be added.");
  if (a.logo === "No logo yet" || a.logo === "Yes, but low quality") out.push("Production-ready vector artwork is required; our design team can redraw or create it.");
  return out;
}

export function summarise(a: Answers): Summary {
  const [b0, b1] = BASE[a.signage] ?? BASE["Not sure"];
  const size = SIZE[a.size] ?? 1;
  const alreadyLit = ["Illuminated / LED", "Neon", "Window graphics", "Vehicle graphics", "Complete branding"].includes(a.signage);
  const lit = a.illuminated === "Illuminated" && !alreadyLit ? 1.45 : a.illuminated === "Not sure" && !alreadyLit ? 1.2 : 1;
  let low = b0 * size * lit;
  let high = b1 * size * lit;
  if (a.logo === "No logo yet") { low += 400; high += 1500; }
  else if (a.logo === "Yes, but low quality") { low += 150; high += 400; }
  if (a.location && !isLondon(a.location)) high *= 1.1;
  low = Math.max(250, round(low));
  high = round(high);

  const max = BUDGET_MAX[a.budget];
  let budgetNote: string | undefined;
  if (max !== undefined && max !== Infinity && low > max) budgetNote = "Your budget sits below the typical range for this specification. We can suggest alternatives, such as non-illuminated letters or a phased approach.";
  else if (max !== undefined && max !== Infinity && high > max) budgetNote = "Your budget fits the lower part of this range. We'll prioritise the elements with the biggest visual impact.";

  return {
    recommendation: recommend(a),
    range: `${gbp(low)} – ${gbp(high)} + VAT`,
    low, high,
    materials: materials(a),
    installation: installation(a),
    nextStep: isLondon(a.location) || !a.location ? "Book a free site survey so we can measure up, photograph the frontage and prepare design visuals." : "Book a video consultation. Send photos of the frontage and we'll prepare design visuals remotely.",
    budgetNote,
  };
}
