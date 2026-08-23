/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CLIENT_URL: string
}

// biome-ignore lint/correctness/noUnusedVariables: <necessary>
interface ImportMeta {
  readonly env: ImportMetaEnv
}
