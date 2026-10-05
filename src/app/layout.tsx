import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono-face", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const title = "SIGNOVA | Architectural & Illuminated Signage, London";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | SIGNOVA" },
  description: site.description,
  keywords: ["signage London", "shop signs London", "illuminated signs", "3D lettering", "LED neon signs", "shopfront signage", "wayfinding signage", "vehicle graphics", "window graphics", "architectural signage"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: "SIGNOVA",
    title,
    description: `${site.tagline} ${site.description}`,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060708" },
    { media: "(prefers-color-scheme: light)", color: "#f2f1ee" },
  ],
  width: "device-width",
  initialScale: 1,
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: "SIGNOVA",
  slogan: site.tagline,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/opengraph-image`,
  priceRange: "££–££££",
  address: { "@type": "PostalAddress", addressLocality: site.address.locality, addressRegion: site.address.region, addressCountry: site.address.country },
  geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
  areaServed: { "@type": "City", name: "London" },
  openingHours: site.hours,
  sameAs: Object.values(site.socials),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Signage services",
    itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.summary, areaServed: "London" } })),
  },
};

// Applies the saved theme before paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem('signova-theme');document.documentElement.dataset.theme=t||'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" data-theme="dark" suppressHydrationWarning className={`${archivo.variable} ${inter.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
