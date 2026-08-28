import { useEffect, useState } from "react"
import { useFollowUser } from "@/shared/api/useMutations"
import { useSuggestedUsers } from "../api/useQueries"

export function useHandleSuggestedUsers() {
  const { data } = useSuggestedUsers()
  const suggestedUsers = data?.users

  const { mutate: followUser } = useFollowUser(() => {})
  const [map, setMap] = useState({})
  useEffect(() => {
    if (suggestedUsers) {
      const newMap = {}
      suggestedUsers.forEach((user) => {
        const userId = user?.id || user?._id
        newMap[userId] = user?.isFollowing ?? false
      })
      setMap(newMap)
    }
  }, [suggestedUsers])

  return { suggestedUsers, followUser, map, setMap }
}
