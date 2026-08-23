import { useAuth } from "@context"
import { motion } from "framer-motion"
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md"
import { RiLogoutCircleRFill } from "react-icons/ri"
import { Link } from "react-router-dom"
import { ProfilePicture, Spinner } from "@/components"
import { useTheme } from "@/context"

export default function PhoneHeader() {
  const { auth, logout, globalLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed z-50 w-full bg-background md:hidden">
      <div className="flex-between items-center p-2 py-2 pl-3">
        {/*  Logo */}
        <div className="flex items-center">
          <Logo theme={theme} />
        </div>

        <div className="flex items-center gap-x-3 px-2">
          <button onClick={logout}>
            {globalLoading ? (
              <Spinner size="4" />
            ) : (
              <RiLogoutCircleRFill className="h-6 w-6 cursor-pointer text-third" />
            )}
          </button>

          <ToggleTheme theme={theme} toggleTheme={toggleTheme} />

          <ProfilePicture
            profilePicture={auth?.profile?.profilePicture}
            username={auth?.profile?.name}
            size="md"
          />
        </div>
      </div>
    </header>
  )
}

const Logo = ({ theme }) => (
  <Link to="/" className="flex items-center">
    {theme === "dark" ? (
      <img src="/favicon.svg" alt="logo" width={18} />
    ) : (
      <img src="/favicon-dark.svg" alt="logo" width={18} />
    )}
    <span
      onDoubleClick={() => {
        window.location.href = "/developer"
      }}
      className="font-Poppins font-bold tracking-tighter"
    >
      sphere
    </span>
  </Link>
)

const ToggleTheme = ({ theme, toggleTheme }) => (
  <div
    className={`flex h-6 w-10 cursor-pointer items-center rounded-full border transition-colors duration-300 ${
      theme === "dark" ? "bg-muted/50" : ""
    }`}
    onClick={toggleTheme}
  >
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex h-4 w-4 items-center justify-center rounded-full"
      style={{
        marginLeft: theme === "dark" ? "calc(100% - 20px)" : "3px",
      }}
    >
      {theme === "dark" ? (
        <MdDarkMode className="text-sm" />
      ) : (
        <MdOutlineLightMode className="text-xs" />
      )}
    </motion.div>
  </div>
)
