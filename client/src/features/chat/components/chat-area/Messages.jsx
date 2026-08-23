import { useState } from "react"
import { Loading } from "@/components"
import { useAuth } from "@/context"
import { useChatMessages } from "../../hooks/useChatMessages"
import { useChatWindow } from "../../hooks/useChatWindow"
import { getDateLabel } from "../../lib/utils/date-separator"
import { ChatInfoCard } from "../ui/chat-info-card"
import { SystemMessage } from "../ui/system-messages"
import { MessageItem } from "./messages/message-item"

export function Messages() {
  const { currentUserId } = useAuth()
  const { messages, isLoading, loadOlder } = useChatMessages()
  const { autoScroll, containerRef, handleScroll, useReachToBottom } = useChatWindow()

  const [activeMsgId, setActiveMsgId] = useState(null)
  useReachToBottom(messages)
  const unActiveMsg = () => setActiveMsgId(null)
  if (isLoading) return <Loading message="Loading Messages.." />
  return (
    <div
      ref={containerRef}
      onClick={unActiveMsg}
      onScroll={() => handleScroll(containerRef, autoScroll, loadOlder)}
      className="flex-1 overflow-y-auto px-3 py-2"
    >
      <ChatInfoCard isChatted={!!messages.length} />
      <div className="flex flex-col gap-2">
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1]
          const showDateSeparator =
            !prevMsg ||
            new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString()

          const nextMsg = messages[index + 1]
          const isLastFromSender = !nextMsg || nextMsg.sender?._id !== msg.sender?._id

          return (
            <div key={msg._id}>
              {showDateSeparator && <SystemMessage label={getDateLabel(msg.createdAt)} />}
              <MessageItem
                msg={msg}
                mine={msg.sender?._id === currentUserId}
                isLastFromSender={isLastFromSender}
                isActive={activeMsgId === msg._id}
                onActivate={() => setActiveMsgId(msg._id)}
                unActiveMsg={unActiveMsg}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
