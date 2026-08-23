import { useEffect, useState } from "react"
import { useAuth } from "@/context"
import { useFollowUser } from "@/shared/api/useMutations"
import { useSuggestedUsers } from "../api/useQueries"

export function useHandleSuggestedUsers() {
  const { data } = useSuggestedUsers()
  const suggestedUsers = data?.users
  const { auth } = useAuth()
  const currentUser = auth?.profile?._id

  const { mutate: followUser } = useFollowUser(() => {})
  const [map, setMap] = useState({})
  useEffect(() => {
    if (suggestedUsers) {
      const newMap = {}
      suggestedUsers.forEach((user) => {
        const isFollowing = user?.followers?.some((f) => f?._id === currentUser)
        newMap[user?._id] = isFollowing
      })
      setMap(newMap)
    }
  }, [suggestedUsers, currentUser])

  return { suggestedUsers, followUser, map, setMap }
}
