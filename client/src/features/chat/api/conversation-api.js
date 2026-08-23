import { fetcher } from "@/lib/api/fetcher"

export const chatApi = {
  connections: () => fetcher({ endpoint: "/chats" }),
  searchUsers: (q) => fetcher({ endpoint: `/chats/users?q=${q}` }),
  chatDetails: (chatId) => fetcher({ endpoint: `/chats/${chatId}` }),
  chatExists: (userId) => fetcher({ endpoint: `/chats/with/${userId}` }),
  deleteChat: (chatId) => fetcher({ endpoint: `/chats/${chatId}`, method: "DELETE" }),

  messages: (chatId, params) =>
    fetcher({ endpoint: `/chats/${chatId}/messages?limit=${params?.limit}&page=${params?.page}` }),
  sendMessage: (receiverId, message) =>
    fetcher({
      endpoint: `/chats/${receiverId}/message`,
      method: "POST",
      data: { content: message },
    }),
  deleteMessage: (messageId) =>
    fetcher({ endpoint: `/chats/message/${messageId}`, method: "DELETE" }),
}
