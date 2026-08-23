import { useSmoothScroll } from "@eightmay/use-custom-lenis"

export default function SmoothScroll({ children, className = "" }) {
  useSmoothScroll(".scroll")
  return <div className={`scroll overflow-y-scroll border ${className}`}>{children}</div>
}
