export function MessageBubble({ msg, mine, isActive, longPressHandlers, onContextMenu }) {
  return (
    <div
      {...longPressHandlers}
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu()
      }}
      className={`no-text-select max-w-xs touch-manipulation select-none rounded-2xl px-4 pt-2 font-mono text-sm leading-4 shadow transition ${
        mine
          ? "rounded-br-none bg-neutral-200 dark:bg-[#14161f]"
          : "rounded-bl-none bg-slate-300 dark:bg-[#0d191b]"
      }
        ${isActive ? "opacity-60" : ""}
      `}
    >
      {msg.content}

      <div className="mt-1 flex items-center justify-end text-[9px] opacity-50">
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {mine && <MessageStatus status={msg.status} />}
      </div>
    </div>
  )
}

function MessageStatus({ status }) {
  if (status === "sending") return <span className="ml-1">…</span>
  if (status === "sent") return <span className="ml-1">✓</span>
  if (status === "failed") return <span className="ml-1 text-red-500">!</span>
  return null
}
