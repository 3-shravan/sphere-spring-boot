import { useSmoothScroll } from "@eightmay/use-custom-lenis"
import { CircleSmall } from "lucide-react"
import { useEffect, useState } from "react"
import { SmoothScroll } from "@/components"
import { useFollowUser } from "@/shared/api/useMutations"
import { useSuggestedUsers } from "../api/useQueries"
import { ListUsers } from "../components/ListUsers"

export default function SuggestedUsers() {
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

  useSmoothScroll(".scroll")

  return (
    <SmoothScroll className="scroll custom-scrollbar-hide max-h-[300px] md:max-h-[215px]">
      <div className="flex-col gap-2 p-2">
        <h2 className="p-2 px-2.5 pb-4 font-Futura text-second tracking-tight dark:text-first">
          <CircleSmall className="inline text-second" size={27} />
          you may know
        </h2>

        <ListUsers users={suggestedUsers} followUser={followUser} map={map} setMap={setMap} />
      </div>
    </SmoothScroll>
  )
}
