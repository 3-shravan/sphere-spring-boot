import { useChatListStore } from "@/features/chat/store/chatListStore"
import { useChatStore } from "@/features/chat/store/chatStore"

export default function chatEvents(socket) {
  const handleNewMessage = (message) => {
    if (!message) return console.log("Error in ChatEvents")

    useChatListStore.getState().updateChatPreview(message.chat, message)

    if (useChatStore.getState().selectedChat?._id === message.chat) {
      useChatStore.getState().addMessage(message)
      useChatListStore.getState().markChatRead(message.chatId)
    }
  }
  socket.on("newMessage", handleNewMessage)
  return () => {
    socket.off("newMessage", handleNewMessage)
  }
}
