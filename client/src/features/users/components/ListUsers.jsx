import { useIsMobile } from "@/hooks"
import { UserCard, UserCardMobile } from "./user-card"

export const ListUsers = ({ users, followUser, map, setMap }) => {
  const isMobile = useIsMobile()
  if (!users || users.length === 0)
    return (
      <div className="px-5 py-2 font-Gilroy">
        NO SUGGESTED USER
        <span className="inline-block text-muted-foreground/60 text-xs">
          maybe you know everyone already 🗽
        </span>
      </div>
    )

  return (
    <div className="flex flex-col gap-2 pb-1">
      {users
        .slice(0, 20)
        .map((user) =>
          isMobile ? (
            <UserCardMobile
              key={user._id}
              user={user}
              followUser={followUser}
              isFollowing={map[user._id]}
              setMap={setMap}
            />
          ) : (
            <UserCard
              key={user._id}
              user={user}
              followUser={followUser}
              isFollowing={map[user._id]}
              setMap={setMap}
            />
          ),
        )}
    </div>
  )
}
