import { useNavigate } from "react-router-dom"
import { ProfilePicture } from "@/components"
export const SearchedUser = ({ user }) => {
  if(!user)return null
  const navigate = useNavigate()
  return (
    <div
      className="flex w-full cursor-pointer flex-col rounded-3xl px-4 py-2 transition hover:bg-muted"
      onClick={() => navigate(`/profile/${user?.name}`)}
    >
      <div className="flex gap-2">
        <ProfilePicture profilePicture={user.profilePicture} username={user.name} />
        <h3 className="font-medium text-foreground text-sm">{user.name}</h3>
      </div>
      <span className="px-9 font-Gilroy font-bold text-[8px] text-muted-foreground uppercase">
        Followers-{user?.followers?.length ||0}
      </span>
    </div>
  )
}
