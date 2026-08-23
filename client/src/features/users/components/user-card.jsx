import { Link } from "react-router-dom"
import { ProfilePicture } from "@/components"
import { FollowButton } from "./FollowButton"

export const UserCardMobile = ({ user, followUser, isFollowing, setMap }) => {
  return (
    <div className="min-w-[100px] flex-shrink-0 rounded-xl border border-border bg-card p-3 transition hover:bg-muted md:min-w-0 md:border-none md:bg-transparent md:p-1">
      <div className="flex items-center justify-between gap-3">
        <Link to={`/profile/${user.name}`} className="flex items-center gap-2 overflow-hidden">
          <ProfilePicture profilePicture={user.profilePicture} username={user.name} />
          <span className="truncate font-Poppins font-medium text-sm">{user.name}</span>
        </Link>

        <FollowButton
          userId={user._id}
          followUser={followUser}
          isFollowing={isFollowing}
          setMap={setMap}
        />
      </div>
    </div>
  )
}

export const UserCard = ({ user, followUser, isFollowing, setMap }) => {
  return (
    <div
      key={user._id}
      className="flex-between cursor-pointer rounded-xl px-3 py-1 transition hover:bg-muted"
    >
      <Link to={`/profile/${user.name}`} className="flex w-full items-center gap-2">
        <ProfilePicture profilePicture={user.profilePicture} username={user.name} />
        <span className="font-Poppins font-medium text-card-foreground text-sm tracking-tighter">
          {user.name}
        </span>
      </Link>
      <FollowButton
        userId={user._id}
        followUser={followUser}
        isFollowing={isFollowing}
        setMap={setMap}
      />
    </div>
  )
}
