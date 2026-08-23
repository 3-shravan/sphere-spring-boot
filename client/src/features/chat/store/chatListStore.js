import { create } from "zustand"
import {
  addChatToList,
  markChatRead,
  sortChatsByUpdatedAt,
  updateChatList,
} from "../lib/utils/update-chat-list"

export const useChatListStore = create((set, get) => ({
  chats: [],
  setChats: (chats) => set({ chats: sortChatsByUpdatedAt(chats) }),

  updateChatPreview: (chatId, message) => {
    const chats = get().chats
    const chatExists = chats.some((c) => c._id === chatId)
    set({
      chats: chatExists
        ? updateChatList(chats, chatId, message)
        : addChatToList(chats, chatId, message),
    })
  },

  markChatRead: (chatId) =>
    set((state) => ({
      chats: markChatRead(state.chats, chatId),
    })),
}))
