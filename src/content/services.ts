export type Service = {
  id: string;
  number: string;
  title: string;
  summary: string;
  /** Scene variant used by <SignScene> until real photography is supplied. */
  scene: SceneVariant;
  /** Optional photo path (e.g. /images/services/3d-lettering.jpg). Overrides the scene. */
  image?: string;
};

export type SceneVariant =
  | "letters"
  | "lightbox"
  | "neon"
  | "shopfront"
  | "wayfinding"
  | "vehicle"
  | "window"
  | "brand";

export const services: Service[] = [
  { id: "3d-lettering", number: "01", title: "3D Lettering", summary: "Built-up acrylic, metal and illuminated lettering.", scene: "letters" },
  { id: "led-illuminated", number: "02", title: "LED & Illuminated Signage", summary: "High-impact illuminated signs designed for day and night visibility.", scene: "lightbox" },
  { id: "neon", number: "03", title: "Neon", summary: "Custom LED neon installations for commercial and hospitality spaces.", scene: "neon" },
  { id: "shopfront", number: "04", title: "Shopfront Signage", summary: "Complete storefront branding and fascia solutions.", scene: "shopfront" },
  { id: "wayfinding", number: "05", title: "Wayfinding", summary: "Professional directional and architectural signage systems.", scene: "wayfinding" },
  { id: "vehicle", number: "06", title: "Vehicle Graphics", summary: "Professional vehicle branding and commercial graphics.", scene: "vehicle" },
  { id: "window", number: "07", title: "Window Graphics", summary: "Vinyl, frosted, privacy and promotional window graphics.", scene: "window" },
  { id: "branding", number: "08", title: "Complete Branding", summary: "From logo application to complete physical brand environments.", scene: "brand" },
];
