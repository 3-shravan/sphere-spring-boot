import { Link } from "react-router-dom"
import { ProfilePicture } from "@/components"
import { useAuth } from "@/context"
import { useChatStore } from "../../store/chatStore"

export function ChatInfoCard({ isChatted }) {
  const { selectedChat } = useChatStore()
  const { currentUserId } = useAuth()

  if (!selectedChat || selectedChat.isGroupChat) return null

  const otherUser = selectedChat.users?.find((u) => u._id !== currentUserId)
  if (!otherUser) return null

  return (
    <div className="mb-4 flex flex-col items-center rounded-xl px-4 py-6 text-center">
      <ProfilePicture
        profilePicture={otherUser.profilePicture}
        username={otherUser.name}
        size="lg"
      />

      <p className="mt-2 font-semibold text-sm">{otherUser.fullName}</p>

      <p className="text-second text-xs">@{otherUser.name}</p>

      {otherUser.bio && (
        <p className="mt-2 max-w-xs text-muted-foreground text-sm">{otherUser.bio}</p>
      )}

      <div className="mt-2 text-muted-foreground text-xs">
        {otherUser.followers.length} followers • {otherUser.following.length} following
      </div>

      <Link
        to={`/profile/${otherUser.name}`}
        className="mt-4 rounded-lg border border-border px-4 py-1.5 text-sm transition hover:bg-muted"
      >
        View profile
      </Link>
      {!isChatted && <p className="mt-2 text-muted-foreground text-sm">No messages</p>}
    </div>
  )
}
