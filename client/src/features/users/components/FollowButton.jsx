import { Button } from "@/components/ui/button"

export const FollowButton = ({ userId, followUser, isFollowing, setMap }) => {
  const handleFollow = () => {
    setMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))

    followUser(userId)
  }
  return (
    <Button
      size="sm"
      variant="outline"
      className="cursor-pointer rounded-full font-Poppins font-semibold text-xs hover:opacity-90"
      onClick={handleFollow}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
