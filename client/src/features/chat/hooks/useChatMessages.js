import { useEffect, useMemo } from "react"
import { useMessages } from "../api/useQueries"
import { useChatStore } from "../store/chatStore"

export function useChatMessages() {
  const { selectedChat, limit, page, setMessages, messages } = useChatStore()

  const params = useMemo(() => ({ limit, page }), [limit, page])
  const { data, isLoading } = useMessages(selectedChat?._id, params)

  // const fetchNextPage = () => {
  //   if (!data) return { messages: [] }
  // }

  useEffect(() => {
    if (data?.messages && page === 1) setMessages(data.messages)
  }, [data, setMessages, page])

  const loadOlder = async () => {
    // const { messages: older } = fetchNextPage()
    // prependMessages(older)
  }
  return {
    messages,
    isLoading,
    loadOlder,
  }
}
