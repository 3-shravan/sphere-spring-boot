import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const aliases = {
  "@": path.resolve(__dirname, "../src"),
  "@components": path.resolve(__dirname, "../src/components"),
  "@features": path.resolve(__dirname, "../src/features"),
  "@hooks": path.resolve(__dirname, "../src/hooks"),
  "@layouts": path.resolve(__dirname, "../src/layouts"),
  "@styles": path.resolve(__dirname, "../src/styles"),
  "@utils": path.resolve(__dirname, "../src/utils"),
  "@assets": path.resolve(__dirname, "../src/assets"),
  "@context": path.resolve(__dirname, "../src/context"),
  "@pages": path.resolve(__dirname, "../src/pages"),
  "@config": path.resolve(__dirname, "../src/config"),
  "@services": path.resolve(__dirname, "../src/services"),
  "@shared": path.resolve(__dirname, "../src/shared"),
  "@lib": path.resolve(__dirname, "../src/lib"),
}
