import { useEffect, useState } from "react"

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)")
}
export function useIsDesktop() {
  return useMediaQuery("(min-width: 769px)")
}
export function useIsTablet() {
  return useMediaQuery("(min-width: 481px) and (max-width: 768px)")
}
export function useIsLargeScreen() {
  return useMediaQuery("(min-width: 1200px)")
}
