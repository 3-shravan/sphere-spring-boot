import { useAuth } from "@context"
import { Outlet, useNavigate } from "@lib"
import React from "react"
import { Loader } from "../ui/loader"

export default function PublicRoutes() {
  const navigate = useNavigate()
  const { auth } = useAuth()

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/feeds", { replace: true })
    }
  }, [auth.isAuthenticated, navigate])
  return auth.isAuthenticated ? <Loader /> : <Outlet />
}
