import { useTheme } from "@context"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { tabs } from "@/utils/constants"

export default function Dock() {
  const { pathname } = useLocation()
  const { theme } = useTheme()

  const gloss = theme === "dark" ? "from-white/10 to-transparent" : "from-black/10 to-transparent"

  const inactiveColor = theme === "dark" ? "text-white" : "text-black/80"
  const activeColor = theme === "dark" ? "text-white" : "text-black/90"

  return (
    <div className="-translate-x-1/2 fixed bottom-5 left-1/2 z-50 flex w-[85%] max-w-md justify-between rounded-full border-1 border-white/20 bg-background/70 px-1 py-1 shadow-md backdrop-blur-sm md:hidden">
      <div
        className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b ${gloss} opacity-40`}
      />

      {tabs.map((tab) => {
        const isActive = pathname === tab.route
        const IconOutlined = tab.icon
        const IconFilled = tab.filled

        const outlineSize = tab.size ?? 22
        const filledSize = tab.filledSize ?? outlineSize

        return (
          <Link
            key={tab.key}
            to={tab.route}
            className="relative flex h-12 flex-1 flex-col items-center justify-center"
          >
            <div className="relative flex h-7 w-7 items-center justify-center">
              {/* OUTLINE ICON */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isActive ? 0 : 1,
                  scale: isActive ? 0.6 : 1,
                  y: isActive ? -4 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 22,
                }}
                className="absolute"
              >
                <IconOutlined className={`${inactiveColor}`} style={{ fontSize: outlineSize }} />
              </motion.div>

              {/* FILLED ICON */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1.15 : 0.8,
                  y: isActive ? -1 : 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 18,
                }}
                className="absolute"
              >
                <IconFilled className={`${activeColor}`} style={{ fontSize: filledSize }} />
              </motion.div>
            </div>

            {/* iOS indicator */}
            {isActive && (
              <motion.div
                layoutId="ios-indicator"
                className={`absolute bottom-1 h-[3px] w-6 rounded-full bg-third ${activeColor}`}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
