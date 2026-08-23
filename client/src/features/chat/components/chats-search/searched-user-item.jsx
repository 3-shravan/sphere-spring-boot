import { ProfilePicture } from "@/components"
import { useAuth } from "@/context"
import { useStartChat } from "@/hooks/useStartChat"

export const UserItem = ({ user, closeDropdown }) => {
  const { currentUserId } = useAuth()
  const startChat = useStartChat(user, {
    onFinish: closeDropdown,
  })

  return (
    <div
      onClick={startChat}
      className="flex cursor-pointer items-center gap-3 rounded-xl border-border/40 border-b px-4 py-3 transition-colors last:border-none hover:bg-background hover:text-accent-foreground"
    >
      <ProfilePicture profilePicture={user.profilePicture} />

      <div className="flex flex-col overflow-hidden">
        <p className="truncate font-medium text-sm">
          {user._id === currentUserId ? "Saved Messages" : user.fullName}
        </p>
        <p className="truncate text-accent-foreground/50 text-xs">{user.name}</p>
      </div>
    </div>
  )
}
