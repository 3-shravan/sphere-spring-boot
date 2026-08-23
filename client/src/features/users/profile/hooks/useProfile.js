import { useState } from "react"
import { useAuth } from "@/context"
import { useFollowUser } from "@/shared/api/useMutations"

const useProfile = (user) => {
  const { id, followers, followersCount: initialFollowersCount, name } = user
  const { currentUserId } = useAuth()
  // Support both _id and id mapping for compatibility
  const userId = user._id || id
  const me = currentUserId?.toString() === userId?.toString()

  const [isFollowing, setIsFollowing] = useState(
    followers ? followers.some((f) => (f?._id || f?.id)?.toString() === currentUserId?.toString()) : false,
  )
  const [followersCount, setFollowersCount] = useState(initialFollowersCount ?? (followers?.length || 0))

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
