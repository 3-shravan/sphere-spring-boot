import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks"
import { ChatComposer } from "../components/chat-area/ChatComposer"
import { ChatHeader } from "../components/chat-area/chat-header"
import { Messages } from "../components/chat-area/Messages"
import { NoSelectedChat } from "../components/ui/no-selected-chat"
import { useChatStore } from "../store/chatStore"

export default function ChatArea() {
  const navigate = useNavigate()
  const IsMobile = useIsMobile()

  const { selectedChat } = useChatStore()

  useEffect(() => {
    if (!selectedChat && IsMobile) navigate("/conversations")
  }, [selectedChat, IsMobile, navigate])

  if (!selectedChat) return <NoSelectedChat />

  return (
    <div className="flex h-full w-full flex-col rounded-xl p-1 md:bg-input/5">
      <ChatHeader />
      <Messages />
      <ChatComposer />
    </div>
  )
}
