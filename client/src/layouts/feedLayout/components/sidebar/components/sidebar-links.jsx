import { NavLink } from "react-router-dom"
import { tabs } from "@/utils/constants"

export const SidebarLinks = () => {
  return (
    <ul className="mt-6 flex flex-col items-start gap-4">
      {tabs.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.route}
          className={({ isActive }) =>
            `flex w-full items-center gap-2 rounded-md px-2 py-2 font-Gilroy font-bold text-sm transition ${
              isActive ? "bg-rose-300 text-rose-700" : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => {
            const Icon = isActive ? tab.filled : tab.icon

            return (
              <>
                <Icon className="w-4" />
                <span>{tab.label}</span>
              </>
            )
          }}
        </NavLink>
      ))}
    </ul>
  )
}
