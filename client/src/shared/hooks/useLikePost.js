import { useState } from "react"
import { useAuth } from "@/context"
import { useToggleLikePost } from "../api/useMutations"

const useLikePost = (postId, initialLikes = []) => {
  const { currentUserId, auth } = useAuth()

  const [likes, setLikes] = useState(initialLikes)
  const [likesCount, setLikesCount] = useState(initialLikes.length)
  const [isLiked, setIsLiked] = useState(initialLikes.some((u) => u._id === currentUserId))

  const newUser = {
    _id: currentUserId,
    name: auth?.profile?.name,
    profilePicture: auth?.profile?.profilePicture,
  }

  const { mutate: toggleLike, isPending: likeIsPending } = useToggleLikePost(postId, {
    onMutate: () => {
      setIsLiked((prev) => !prev)

      if (isLiked) {
        // Remove current user
        setLikes((prev) => prev.filter((u) => u._id !== currentUserId))
        setLikesCount((count) => count - 1)
      } else {
        // Add current user at the start
        setLikes((prev) => [newUser, ...prev.filter((u) => u._id !== currentUserId)])
        setLikesCount((count) => count + 1)
      }
    },
    onError: () => {
      // Rollback on error
      setIsLiked((prev) => !prev)

      if (isLiked) {
        setLikes((prev) => [newUser, ...prev.filter((u) => u._id !== currentUserId)])
        setLikesCount((count) => count + 1)
      } else {
        // Was not liked, rollback add
        setLikes((prev) => prev.filter((u) => u._id !== currentUserId))
        setLikesCount((count) => count - 1)
      }
    },
  })

  return {
    toggleLike,
    likes,
    likesCount,
    isLiked,
    likeIsPending,
    setLikes,
    setLikesCount,
  }
}

export default useLikePost
