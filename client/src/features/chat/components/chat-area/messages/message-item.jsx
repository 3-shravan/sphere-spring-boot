import { Copy, Trash } from "lucide-react"
import { ProfilePicture } from "@/components"
import { useDeleteMessageOptimistic } from "@/features/chat/api/useMutations"
import { showSuccessToast } from "@/lib/api/api-responses"
import { longPress } from "@/lib/utils/ui/longPress"
import { MessageBubble } from "./message-bubble"

export function MessageItem({ msg, mine, isActive, onActivate, unActiveMsg, isLastFromSender }) {
  const longPressHandlers = longPress(() => {
    onActivate()
    navigator.vibrate?.(20)
  })
  const { mutate: deleteMsg } = useDeleteMessageOptimistic()
  const handleDelete = () => {
    deleteMsg({ message: msg })
  }
  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(msg.content)
    unActiveMsg()
    showSuccessToast("Message copied to clipboard")
  }

  return (
    <div className={`flex w-full items-end gap-1 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && isLastFromSender && (
        <ProfilePicture profilePicture={msg.sender?.profilePicture} size="sm" />
      )}
      {!mine && !isLastFromSender && <div className="w-6" />}

      <div className="relative">
        <MessageOverlay
          show={isActive}
          mine={mine}
          onDelete={handleDelete}
          onCopy={copyMessageToClipboard}
        />

        <MessageBubble
          msg={msg}
          mine={mine}
          isActive={isActive}
          longPressHandlers={longPressHandlers}
          onContextMenu={onActivate}
        />
      </div>
    </div>
  )
}

function MessageOverlay({ show, mine, onDelete, onCopy }) {
  if (!show) return null

  return (
    <div
      className={` ${mine ? "-top-8 -left-15" : "-top-8 left-15"} fade-in zoom-in-95 ga-2 absolute right-0 z-20 flex animate-in flex-col gap-2 rounded-xl bg-background/10 px-3 py-1 shadow-lg`}
    >
      {mine && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex cursor-pointer items-center gap-1 text-rose-500 text-sm hover:text-rose-600"
        >
          <Trash size={16} />
          Delete
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onCopy()
        }}
        className="flex cursor-pointer items-center gap-1 text-sm"
      >
        <Copy size={15} />
        Copy
      </button>
    </div>
  )
}
