import { ProfilePicture } from "@/components"

export const BirthdayListItem = ({ user }) => (
  <li className="flex items-center gap-2 text-foreground text-sm">
    <ProfilePicture profilePicture={user.profilePicture} username={user.name} />
    <span>{user.name}</span>
  </li>
)
