import { useCallback, useEffect, useRef, useState } from "react"
import { useDebounce } from "@/hooks"
import { useSearch } from "../api/useMutations"

export function useUserSearch(delay = 300) {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const debouncedQuery = useDebounce(query, delay)
  const { mutateAsync: search, status } = useSearch()

  const lastQueryRef = useRef("")

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setUsers([])
      setIsOpen(false)
      return
    }

    setIsOpen(true)
    lastQueryRef.current = debouncedQuery

    ;(async () => {
      try {
        const res = await search({ query: debouncedQuery })
        if (lastQueryRef.current === debouncedQuery) setUsers(res?.users || [])
      } catch {
        setUsers([])
      }
    })()
  }, [debouncedQuery, search])

  const closeDropdown = useCallback(() => setIsOpen(false), [])
  const openDropdown = useCallback(() => setIsOpen(true), [])

  return {
    query,
    setQuery,
    users,
    status,
    isOpen,
    closeDropdown,
    openDropdown,
  }
}
