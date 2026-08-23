import { useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { useChatExists } from "@/features/chat/api/useQueries"
import { useChatStore } from "@/features/chat/store/chatStore"
import { useIsMobile } from "@/hooks"

export function useStartChat(user, { onFinish } = {}) {
  const { currentUserId } = useAuth()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const setSelectedChat = useChatStore((s) => s.setSelectedChat)
  const currentChat = useChatStore((s) => s.selectedChat)

  const { refetch } = useChatExists(user._id, { enabled: false })
  const isFetchingRef = useRef(false)

  return useCallback(async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    try {
      const { data } = await refetch()
      let chat

      if (data?.isExists) {
        chat = data.chat
      } else {
        const isSelfChat = user._id === currentUserId

        chat = {
          _id: user._id,
          isGroupChat: false,
          users: [user],
          name: isSelfChat ? "Saved Messages" : user.name,
          profilePicture: user.profilePicture,
          isSelfChat,
        }
      }

      if (currentChat?._id !== chat._id) {
        setSelectedChat(chat)
      }

      if (isMobile) {
        navigate(`/conversations/chat/${chat._id}`)
      }
    } finally {
      isFetchingRef.current = false
      onFinish?.()
    }
  }, [refetch, setSelectedChat, currentChat, isMobile, navigate, user, currentUserId, onFinish])
}
