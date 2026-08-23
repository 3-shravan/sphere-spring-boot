import { Navigate } from "react-router-dom"
import { useAuth } from "@/context"
import { Loading } from ".."

const DEVELOPER_NAME = ["shravan", "shantanu"]

export function DeveloperRoute({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) return <Loading message="Developer Page is loading..." />
  const isDeveloper =
    user?.name?.toLowerCase() === DEVELOPER_NAME[0] ||
    user?.name?.toLowerCase() === DEVELOPER_NAME[1]

  return isDeveloper ? children : <Navigate to="/" replace />
}
