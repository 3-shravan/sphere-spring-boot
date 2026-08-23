import { Button } from "@/components/ui/button"

const FollowUser = ({ userId, followUser, isFollowing }) => {
  return (
    <Button
      onClick={() => followUser(userId)}
      variant="secondary"
      className={`cursor-pointer border font-Futura text-xs disabled:opacity-50 ${
        isFollowing ? "bg-third" : "bg-emerald-500"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}

export default FollowUser
