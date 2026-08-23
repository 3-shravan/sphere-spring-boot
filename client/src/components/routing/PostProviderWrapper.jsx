import { Outlet } from "react-router-dom"
import { PostProvider } from "@/context"

export default function PostProviderWrapper() {
  return (
    <PostProvider>
      <Outlet />
    </PostProvider>
  )
}
