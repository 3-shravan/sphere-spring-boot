import { removeTokenAndAuthenticated } from "@/utils"

let logoutHandler = null

export const setLogoutHandler = (fn) => {
  logoutHandler = fn
}

export const handleAuthError = () => {
  removeTokenAndAuthenticated()

  if (logoutHandler) logoutHandler()

  const currentPath = window.location.pathname;
  if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
    window.location.href = "/login"
  }

  return {
    type: "Unauthorized",
    message: "Session expired or invalid credentials. Please login again.",
  }
}
