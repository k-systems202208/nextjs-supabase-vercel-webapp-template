import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js Supabase Vercel Template",
    short_name: "NSV Template",
    description: "Next.js / Supabase / Vercel reusable web application starter",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f9",
    theme_color: "#172033",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
