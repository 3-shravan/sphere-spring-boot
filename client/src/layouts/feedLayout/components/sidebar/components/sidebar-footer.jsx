import { BsArrowDownRightCircleFill } from "react-icons/bs"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { ProfilePicture, Spinner } from "@/components"

const ProfileButton = ({ username, profilePicture }) => {
  const navigate = useNavigate()
  const isProfile = window.location.pathname.includes(`/profile/${username}`)

  return (
    <button
      className={`btn-base w-[80%] border-[1.5px] border-emerald-500/70 ${
        isProfile ? "border-emerald-400 bg-emerald-500" : ""
      }`}
      onClick={() => navigate(`/profile/${username}`)}
    >
      <ProfilePicture profilePicture={profilePicture} username={username} size="sm" color />
      Profile
    </button>
  )
}

const ThemeButton = ({ theme, toggleTheme }) => (
  <button className="btn-base w-[60%] border" onClick={toggleTheme}>
    {theme === "dark" ? <MdLightMode className="text-lg" /> : <MdDarkMode className="text-lg" />}
    <span className="text-muted-foreground hover:text-foreground">Theme</span>
  </button>
)

const LogoutButton = ({ logout, globalLoading }) => (
  <button
    className="btn-base group w-[60%] border-[1.5px] border-rose-400/40 text-rose-500"
    onClick={logout}
    disabled={globalLoading}
  >
    <BsArrowDownRightCircleFill className="rounded-full text-lg transition group-hover:scale-95 group-hover:bg-rose-900" />

    {globalLoading ? (
      <div className="w-full flex-center">
        <Spinner size="3" />
      </div>
    ) : (
      "Logout"
    )}
  </button>
)

export const SidebarFooter = ({
  theme,
  toggleTheme,
  username,
  profilePicture,
  logout,
  globalLoading,
}) => {
  return (
    <div className="m-2 flex flex-col gap-2 font-bold font-mono text-xs">
      <ProfileButton username={username} profilePicture={profilePicture} />
      <ThemeButton theme={theme} toggleTheme={toggleTheme} />
      <LogoutButton logout={logout} globalLoading={globalLoading} />
    </div>
  )
}
