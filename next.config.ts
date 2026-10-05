import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Add your CMS / CDN hostnames here when real photography is connected.
    remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }, { protocol: "https", hostname: "cdn.sanity.io" }],
  },
  poweredByHeader: false,
};

export default nextConfig;
