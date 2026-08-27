import { useState, useEffect } from "react"
import { useAuth } from "@/context"
import { useFollowUser } from "@/shared/api/useMutations"

const useProfile = (user) => {
  const { id, name } = user
  const { currentUserId } = useAuth()
  // Support both _id and id mapping for compatibility
  const userId = user._id || id
  const me = currentUserId?.toString() === userId?.toString()

  const [isFollowing, setIsFollowing] = useState(user.isFollowing ?? false)
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0)

  // Sync state if user prop changes
  useEffect(() => {
    setIsFollowing(user.isFollowing ?? false)
    setFollowersCount(user.followersCount || 0)
  }, [user.isFollowing, user.followersCount])

  const { mutate: followUser, isPending } = useFollowUser(name, {
    onMutate: () => {
      setIsFollowing((prev) => !prev)
      setFollowersCount((count) => (isFollowing ? count - 1 : count + 1))
    },
    onError: () => {
      setIsFollowing((prev) => !prev)
      setFollowersCount((count) => (isFollowing ? count + 1 : count - 1))
    },
  })

  return {
    me,
    isFollowing,
    followersCount,
    followUser,
    isPending,
  }
}

export default useProfile
