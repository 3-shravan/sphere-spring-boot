import { useState } from "react"
import { useAuth } from "@/context"
import { useToggleLikePost } from "../api/useMutations"

const useLikePost = (postId, initialLikesCount = 0, initialIsLiked = false, initialRecentLikers = []) => {
  const { currentUserId, auth } = useAuth()

  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [recentLikers, setRecentLikers] = useState(initialRecentLikers)

  const newUser = {
    id: currentUserId,
    _id: currentUserId,
    name: auth?.profile?.name,
    profilePicture: auth?.profile?.profilePicture,
  }

  const { mutate: toggleLike, isPending: likeIsPending } = useToggleLikePost(postId, {
    onMutate: () => {
      setIsLiked((prev) => !prev)
      if (isLiked) {
        setRecentLikers((prev) => prev.filter((u) => u.id !== currentUserId && u._id !== currentUserId))
        setLikesCount((prev) => Math.max(0, prev - 1))
      } else {
        setRecentLikers((prev) => [newUser, ...prev.filter((u) => u.id !== currentUserId && u._id !== currentUserId)].slice(0, 3))
        setLikesCount((prev) => prev + 1)
      }
    },
    onError: () => {
      setIsLiked((prev) => !prev)
      if (isLiked) {
        setRecentLikers((prev) => [newUser, ...prev.filter((u) => u.id !== currentUserId && u._id !== currentUserId)].slice(0, 3))
        setLikesCount((prev) => prev + 1)
      } else {
        setRecentLikers((prev) => prev.filter((u) => u.id !== currentUserId && u._id !== currentUserId))
        setLikesCount((prev) => Math.max(0, prev - 1))
      }
    },
  })

  return {
    toggleLike,
    likesCount,
    isLiked,
    recentLikers,
    likeIsPending,
    setLikesCount,
  }
}

export default useLikePost
