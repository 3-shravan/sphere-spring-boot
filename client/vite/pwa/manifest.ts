import type { VitePWAOptions } from "vite-plugin-pwa"

export const pwaManifest: NonNullable<VitePWAOptions["manifest"]> = {
  name: "Sphere",
  short_name: "Sphere",
  description: "A social media app designed with ❤",
  theme_color: "#0a0a0a",
  background_color: "#0a0a0a",
  display: "standalone",
  orientation: "portrait-primary",
  scope: "/",
  start_url: "/",
  id: "/",
  icons: [
    { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
    { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
    { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
    {
      src: "maskable-icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "apple-touch-icon-180x180.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
}
