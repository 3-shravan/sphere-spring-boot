import { ProfilePicture } from "@/components"
import { multiFormatDateString } from "@/utils"
import { useChatStore } from "../../store/chatStore"
import { ConnectionOptionsMenu } from "./connection-options-menu"

export function ConnectionItem({ chat, onSelect }) {
  const onlineUsers = useChatStore((s) => s.onlineUsers)
  const user = chat.users?.[0]
  const isOnline = onlineUsers?.some((u) => u._id === user?._id)

  if (!user) return null
  const isUnread = chat.unreadCount > 0
  const lastMessage = chat.lastMessage?.content || " "

  return (
    <div
      onClick={() => onSelect(chat)}
      className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-muted/50"
    >
      <ProfilePicture profilePicture={user.profilePicture} username={user.name} size="lg" />

      <div className="flex-1 overflow-hidden">
        <p className="truncate font-medium text-sm">
          {user.name} {isOnline && <span className="text-emerald-500">●</span>}
        </p>
        <p className="truncate font-Futura text-muted-foreground text-xs">{lastMessage}</p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="whitespace-nowrap text-[10px] text-muted-foreground">
          {chat.updatedAt ? multiFormatDateString(chat.updatedAt) : ""}
        </span>

        {isUnread && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 font-semibold text-[10px] text-white">
            {chat.unreadCount}
          </span>
        )}
      </div>

      <ConnectionOptionsMenu chatId={chat._id} />
    </div>
  )
}
