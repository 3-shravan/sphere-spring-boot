import { create } from "zustand"
import { sortByCreatedAtAsc } from "@/lib/utils/global/sort"

export const useChatStore = create((set) => ({
  limit: 30,
  page: 1,

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat, messages: [], page: 1 }),

  messages: [],
  setMessages: (msgs) =>
    set({
      messages: sortByCreatedAtAsc(msgs),
    }),

  addMessage: (msg) =>
    set((state) => {
      if (state.messages.some((m) => m._id === msg._id)) return state
      return { messages: sortByCreatedAtAsc([...state.messages, msg]) }
    }),

  prependMessages: (older) =>
    set((state) => ({
      messages: sortByCreatedAtAsc([...older, ...state.messages]),
    })),

  replaceMessage: (tempId, newMsg) =>
    set((state) => ({
      messages: sortByCreatedAtAsc(state.messages.map((m) => (m._id === tempId ? newMsg : m))),
    })),

  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((m) => (m._id === id ? { ...m, status } : m)),
    })),
  removeMessageOptimistic: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m._id !== id),
    })),

  restoreMessage: (msg) =>
    set((state) => ({
      messages: sortByCreatedAtAsc([...state.messages, msg]),
    })),
}))
