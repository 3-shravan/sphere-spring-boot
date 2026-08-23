import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ProfilePicture } from "@/components"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context"
import { useIsMobile } from "@/hooks"
import { useChatStore } from "../../store/chatStore"

export function ChatHeader() {
  const IsMobile = useIsMobile()
  const navigate = useNavigate()
  const { currentUserId } = useAuth()

  const chat = useChatStore((s) => s.selectedChat)
  const onlineUsers = useChatStore((s) => s.onlineUsers)

  const user =
    chat?.users.length > 1 ? chat?.users?.find((u) => u._id !== currentUserId) : chat?.users[0]
  const isOnline = onlineUsers?.some((u) => u._id === user?._id)

  function handleBackClick() {
    useChatStore.getState().setSelectedChat(null)
    if (IsMobile) navigate("/conversations")
  }

  return (
    <header className="flex items-center gap-2 p-2">
      {IsMobile && (
        <Button onClick={handleBackClick} variant="ghost" size="icon">
          <ChevronLeft />
        </Button>
      )}

      <ProfilePicture profilePicture={user?.profilePicture} username={user?.name} size="lmd" />

      <div className="flex flex-col leading-tight">
        <span className="font-Gilroy font-medium">{user?.name}</span>

        <span
          className={`flex items-center gap-1 font-mono text-[10px] ${
            isOnline ? "text-emerald-400" : "text-gray-500"
          }`}
        >
          {isOnline && <span className="text-[9px]">● active</span>}
        </span>
      </div>
    </header>
  )
}
