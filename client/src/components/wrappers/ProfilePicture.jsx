import { useNavigate } from "react-router-dom"
import { sizeMap } from "@/utils"

export default function ProfilePicture({ profilePicture, username, size = "md" }) {
  const navigate = useNavigate()
  const sizeClass = sizeMap[size]

  return (
    <div
      onClick={() => {
        if (username) navigate(`/profile/${username}`)
      }}
      className="cursor-pointer"
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt="profile"
          className={`${sizeClass} rounded-full border-1 border-border border-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full border-2 border-first bg-gradient-to-r from-rose-300 to-rose-400 font-Futura font-bold text-muted text-xs`}
        >
          {size !== "profile" && username?.[0]?.toUpperCase()}
        </div>
      )}
    </div>
  )
}

export function FirstLetterProfilePicture({ user }) {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-rose-300 to-rose-400 font-Futura font-bold text-muted text-xs">
      {user?.name?.[0]?.toUpperCase() || "U"}
    </div>
  )
}
