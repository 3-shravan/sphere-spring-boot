import { VitePWA } from "vite-plugin-pwa"
import { pwaManifest } from "./manifest"
import { pwaWorkbox } from "./workbox"

export function createPwaPlugin(enablePwa: boolean) {
  return VitePWA({
    registerType: "autoUpdate",
    includeAssets: [
      "favicon.svg",
      "favicon-dark.svg",
      "apple-*.png",
      "manifest-*.png",
      "pwa-*.png",
      "maskable-icon-*.png",
      "screenshot-*.png",
    ],
    manifest: pwaManifest,

    workbox: enablePwa ? pwaWorkbox : undefined,

    devOptions: {
      enabled: enablePwa,
      type: "module",
    },
  })
}
