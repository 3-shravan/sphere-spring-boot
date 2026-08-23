import { useEffect, useRef } from "react"
import { useChatMessages } from "./useChatMessages"

export function useChatWindow() {
  const containerRef = useRef(null)
  const autoScroll = useRef(true)

  const { loadOlder } = useChatMessages()

  function handleScroll(containerRef, autoScroll, loadOlderFn) {
    const el = containerRef.current
    if (!el) return

    // Pagination → load old messages when top reached
    if (el.scrollTop < 20) {
      loadOlder() || loadOlderFn()
    }
    // If user is reading old messages, stop auto scrolling
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 30
    autoScroll.current = isAtBottom
  }

  function useReachToBottom(messages) {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <necessary dependency>
    useEffect(() => {
      if (!containerRef.current || !autoScroll.current) return

      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }, [messages.length]) // not full rerender → only scroll on new msg
  }

  return { handleScroll, useReachToBottom, containerRef, autoScroll }
}
