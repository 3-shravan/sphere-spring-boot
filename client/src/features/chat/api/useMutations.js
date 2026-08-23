import { useMutation } from "@tanstack/react-query"
import { useChatStore } from "../store/chatStore"
import { chatApi } from "./conversation-api"
import { CHAT_QUERY_KEYS } from "./query-keys"

export const useSearch = (query) => {
  return useMutation({
    mutationKey: CHAT_QUERY_KEYS.search(query),
    mutationFn: ({ query }) => chatApi.searchUsers(query),
    meta: {
      showError: true,
    },
  })
}

export const useSendMessage = (chatId) => {
  return useMutation({
    mutationKey: CHAT_QUERY_KEYS.messages(chatId),
    mutationFn: ({ receiverId, message }) => chatApi.sendMessage(receiverId, message),
    meta: {
      showError: true,
      invalidateQuery: [
        CHAT_QUERY_KEYS.connections,
        CHAT_QUERY_KEYS.chat(chatId),
        CHAT_QUERY_KEYS.messages(chatId),
      ],
    },
  })
}

export const useDeleteMessage = (chatId) => {
  return useMutation({
    mutationKey: CHAT_QUERY_KEYS.messages(chatId),
    mutationFn: ({ messageId }) => chatApi.deleteMessage(messageId),
    meta: {
      showError: true,
      invalidateQuery: [CHAT_QUERY_KEYS.messages(chatId)],
    },
  })
}
export const useDeleteMessageOptimistic = () => {
  const removeMessage = useChatStore((s) => s.removeMessageOptimistic)
  const restoreMessage = useChatStore((s) => s.restoreMessage)

  return useMutation({
    mutationFn: ({ message }) => chatApi.deleteMessage(message._id),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ message }) => {
      removeMessage(message._id)
      // return context for rollback
      return { message }
    },

    // ❌ ROLLBACK ON ERROR
    onError: (_err, _vars, context) => {
      if (context?.message) {
        restoreMessage(context.message)
      }
    },
    onSuccess: () => {},
  })
}

export const useDeleteChat = (chatId) => {
  return useMutation({
    queryKey: CHAT_QUERY_KEYS.chat(chatId),
    mutationFn: ({ chatId }) => chatApi.deleteChat(chatId),
    meta: {
      showError: true,
      showSuccess: true,
      invalidateQuery: [
        CHAT_QUERY_KEYS.connections,
        CHAT_QUERY_KEYS.chat(chatId),
        CHAT_QUERY_KEYS.messages(chatId),
      ],
    },
  })
}
