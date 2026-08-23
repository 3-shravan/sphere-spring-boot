import { matchPath, Outlet, useLocation } from "react-router-dom"
import { Dock, PhoneHeader, Sidebar } from "../components"

export default function Layout() {
  const { pathname } = useLocation()
  const chatting = matchPath("/conversations/chat/:chatId", pathname)
  return (
    <div className="h-[100svh] w-full md:flex">
      {!chatting && <PhoneHeader />}
      <Sidebar />
      <main className="flex h-full flex-1 md:h-screen md:min-w-[70vw]">
        <Outlet />
      </main>
      {!chatting && <Dock />}
    </div>
  )
}
