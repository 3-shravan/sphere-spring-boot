import { useAuth } from "@context"
import React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Loader } from "../ui/loader"

export default function ProtectedRoutes() {
  const navigate = useNavigate()
  const { auth } = useAuth()

  React.useEffect(() => {
    if (!auth.isAuthenticated) navigate("/login", { replace: true })
  }, [auth.isAuthenticated, navigate])

  return auth.isAuthenticated ? <Outlet /> : <Loader />
}
