import { Outlet, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks"
import SearchUsers from "../components/chats-search/SearchUsers"
import Connections from "../components/connections/Connections"
import Container from "../components/ui/chat-container"
import { useChatStore } from "../store/chatStore"

export default function ChatLayout() {
  const isMobile = useIsMobile()
  const isChatPage = useLocation().pathname.includes("/conversations/")
  const selectedChat = useChatStore((state) => state.selectedChat)

  const hideSidebar = isMobile && isChatPage && selectedChat

  return (
    <Container>
      {!hideSidebar && (
        <div className="flex w-full flex-col gap-5 p-1 pt-12 md:max-w-[33%] md:pt-2">
          <SearchUsers />
          <Connections />
        </div>
      )}

      <div className="flex-1">
        <Outlet />
      </div>
    </Container>
  )
}
