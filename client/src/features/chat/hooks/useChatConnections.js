import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks"
import { useConnections } from "../api/useQueries"
import { useChatListStore } from "../store/chatListStore"
import { useChatStore } from "../store/chatStore"

export function useChatConnections() {
  const { data, isLoading } = useConnections()
  useEffect(() => {
    if (data?.connections) useChatListStore.getState().setChats(data.connections)
  }, [data])
  const chats = useChatListStore((state) => state.chats)

  const navigate = useNavigate()
  const IsMobile = useIsMobile()
  const selectedChat = useChatStore((state) => state.selectedChat)
  const setSelectedChat = useChatStore((state) => state.setSelectedChat)

  function handleChatSelect(chat) {
    if (selectedChat?._id !== chat._id) setSelectedChat(chat)
    if (IsMobile) navigate(`/conversations/chat/${chat._id}`)
  }

  return { chats, isLoading, handleChatSelect }
}
