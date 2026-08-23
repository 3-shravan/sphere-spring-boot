import { useLocation } from "react-router-dom"

export function useIsPage(pageSegment) {
  const { pathname } = useLocation()
  return pathname.includes(pageSegment)
}
