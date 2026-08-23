import { useState } from "react"
import { useAuth } from "@/context"
import { useSendMessage } from "../api/useMutations"
import { useChatStore } from "../store/chatStore"

export function useChatComposer() {
  const [text, setText] = useState("")

  const chat = useChatStore((s) => s.selectedChat)
  const addMessage = useChatStore((s) => s.addMessage)
  const replaceMessage = useChatStore((s) => s.replaceMessage)
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus)

  const { user } = useAuth()
  const { mutateAsync } = useSendMessage(chat?._id)

  const hasText = text.trim().length > 0

  const sendMessage = async () => {
    if (!hasText || !chat) return

    const tempId = crypto.randomUUID()
    const messageText = text.trim()
    setText("")

    addMessage({
      _id: tempId,
      chat: chat._id,
      sender: {
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
      },
      receiverId: chat.users[0]._id,
      content: messageText,
      createdAt: new Date().toISOString(),
      status: "sending",
    })

    try {
      const res = await mutateAsync({
        receiverId: chat.users[0]._id,
        message: messageText,
      })

      replaceMessage(tempId, {
        ...res.sentMessage,
        status: "sent",
      })
    } catch {
      updateMessageStatus(tempId, "failed")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return {
    text,
    setText,
    hasText,
    sendMessage,
    handleKeyDown,
  }
}
