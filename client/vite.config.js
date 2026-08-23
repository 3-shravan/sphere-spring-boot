import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { aliases } from "./vite/aliases"
import { createPwaPlugin } from "./vite/pwa"
import { serverConfig } from "./vite/server"

export default defineConfig(({ mode }) => {
  const enablePwa = mode === "production"

  return {
    server: serverConfig,
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      tailwindcss(),
      createPwaPlugin(enablePwa),
    ],
    resolve: {
      alias: aliases,
    },
  }
})
