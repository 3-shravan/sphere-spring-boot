/**
 ** Sort chats in descending order
 */
export function sortChatsByUpdatedAt(chats) {
  return chats.sort(
    (a, b) =>
      new Date(b.updatedAt || b.lastMessage?.createdAt) -
      new Date(a.updatedAt || a.lastMessage?.createdAt),
  )
}

/**
 ** if chat already exists → update last message + unread count
 */
export function updateChatList(chats, chatId, message) {
  return chats
    .map((chat) =>
      chat._id === chatId
        ? {
            ...chat,
            lastMessage: {
              _id: message._id,
              content: message.content,
              sender: message.sender,
              createdAt: message.createdAt,
            },
            updatedAt: message.createdAt,
            unreadCount: (chat.unreadCount || 0) + 1,
          }
        : chat,
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

/**
 ** when new chat does NOT exist in list → add it
 */
export function addChatToList(chats, chatId, message) {
  const newChat = {
    _id: chatId,
    users: [message.sender],
    unreadCount: 1,
    updatedAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      sender: message.sender,
      createdAt: message.createdAt,
    },
  }

  return [newChat, ...chats].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

/**
 ** Mark chat as read by setting unreadCount to 0
 */
export function markChatRead(chats, chatId) {
  return chats.map((chat) => (chat._id === chatId ? { ...chat, unreadCount: 0 } : chat))
}
