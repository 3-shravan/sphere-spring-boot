import { useAuth, useTheme } from "@context"
import { SidebarFooter, SidebarHeader, SidebarLinks } from "./components"

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()
  const { logout, auth, globalLoading } = useAuth()

  return (
    <nav className="sidebar hidden max-h-screen flex-col justify-between p-4 md:flex">
      <div className="flex flex-col gap-10">
        <SidebarHeader theme={theme} />
        <SidebarLinks />
      </div>

      <SidebarFooter
        theme={theme}
        toggleTheme={toggleTheme}
        username={auth?.profile?.name}
        profilePicture={auth?.profile?.profilePicture}
        logout={logout}
        globalLoading={globalLoading}
      />
    </nav>
  )
}
