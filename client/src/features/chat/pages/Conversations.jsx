import { useIsMobile } from "@/hooks"
import { NoSelectedChat } from "../components/ui/no-selected-chat"
import { useChatStore } from "../store/chatStore"
import ChatPage from "./ChatPage"

export default function Conversations() {
  const selectedChat = useChatStore((s) => s.selectedChat)
  const isMobile = useIsMobile()

  if (!isMobile && selectedChat) {
    return <ChatPage />
  }

  return <NoSelectedChat />
}
