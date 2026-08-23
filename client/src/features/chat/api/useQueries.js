import { useQuery } from "@tanstack/react-query"
import { chatApi } from "./conversation-api"
import { CHAT_QUERY_KEYS } from "./query-keys"

export function useConnections() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.connections,
    queryFn: () => chatApi.connections(),
    meta: { showError: true },
  })
}

export function useChatDetails(chatId, options = {}) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.chat(chatId),
    queryFn: () => chatApi.chatDetails(chatId),
    enabled: options.enabled ?? true,
    meta: { showError: true },
  })
}

export function useChatExists(userId, options = {}) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.chatExists(userId),
    queryFn: () => chatApi.chatExists(userId),
    enabled: options.enabled ?? true,
    meta: { showError: true },
  })
}

export function useMessages(chatId, params) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(chatId),
    queryFn: () => chatApi.messages(chatId, params),
    meta: { showError: true },
  })
}
