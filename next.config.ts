import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading the dev server from this machine's LAN address (the "Network"
  // URL `next dev` prints). Without this, Next blocks /_next/* dev resources
  // from non-localhost origins, the client bundle never loads, and the page
  // renders as static HTML with no interactivity.
  allowedDevOrigins: ["192.168.1.144"],

  images: {
    // YouTube serves every thumbnail from this host at a predictable path, so
    // the optimiser can point straight at it and no copy is kept locally —
    // which is what lets a new vlog be a one-line change.
    // Scoped to /vi/ rather than the whole host: a wide-open image proxy is a
    // way for other people to run their traffic through your bill.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
