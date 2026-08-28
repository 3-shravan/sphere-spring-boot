import { useSmoothScroll } from "@eightmay/use-custom-lenis"
import { PiHeartFill } from "react-icons/pi"
import { Link } from "react-router-dom"
import { ProfilePicture } from "@/components"
import { Button } from "@/components/ui/button"
import { useFollowersQuery, useFollowingQuery } from "../../../../features/users/api/useQueries"
import { usePostLikesQuery } from "../../../api/useQueries"

export default function ShowUserModel({ title = "Users", type, userId, postId, users: staticUsers, onCancel }) {
  useSmoothScroll(".scroll")

  const { data: followersData } = useFollowersQuery(type === "followers" ? userId : null)
  const { data: followingData } = useFollowingQuery(type === "following" ? userId : null)
  const { data: likesData } = usePostLikesQuery(type === "likes" ? postId : null)

  const users = staticUsers || (type === "followers"
    ? followersData?.followers?.content || followersData?.data?.followers?.content || []
    : type === "following"
      ? followingData?.following?.content || followingData?.data?.following?.content || []
      : type === "likes"
        ? likesData?.likers || likesData?.data?.likers || []
        : [])

  return (
    <>
      <h2 className="mb-4 flex items-center gap-1 px-4 font-semibold text-2xl">
        <PiHeartFill size={27} className="text-third" /> {title}
      </h2>
      <ul className="scroll max-h-90 space-y-2 overflow-y-auto p-2">
        {users.length === 0 ? (
          <li className="py-4 text-center text-muted-foreground text-sm">No users found</li>
        ) : (
          users.map((user) => (
            <li
              key={user.id || user._id}
              className="flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-card"
            >
              <ProfilePicture profilePicture={user.profilePicture} size="md" username={user.name} />
              <Link to={`/profile/${user.name}`} className="font-Futura text-foreground text-sm">
                {user.name}
              </Link>
            </li>
          ))
        )}
      </ul>
      <Button
        onClick={() => onCancel(false)}
        className="mt-4 w-full cursor-pointer bg-muted py-1 text-foreground text-sm hover:bg-rose-500"
      >
        Close
      </Button>
    </>
  )
}
