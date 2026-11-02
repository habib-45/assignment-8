import type { NextConfig } from "next";

/**
 * StudioSpace Next.js configuration.
 *
 * - `rewrites` proxies all /api/server/* calls to the Express + MongoDB API so
 *   the browser always talks to a single origin (HTTPOnly cookies included).
 * - `images.remotePatterns` whitelists the image hosts used by studio listings,
 *   imgbb uploads and Google avatars.
 */
const API_URL = process.env.API_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "i.ibb.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async rewrites() {
    return [
      // The legacy flat feed lives at the API root (not under /api), so it
      // needs its own rule ahead of the generic proxy.
      {
        source: "/api/server/studio-card",
        destination: `${API_URL}/studio-card`,
      },
      // Everything else is a pass-through: /api/server/api/studios → ${API_URL}/api/studios
      // so client paths mirror the Express routes one to one.
      {
        source: "/api/server/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
