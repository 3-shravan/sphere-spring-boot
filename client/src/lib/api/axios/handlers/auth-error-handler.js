import { removeTokenAndAuthenticated } from "@/utils"

let logoutHandler = null

export const setLogoutHandler = (fn) => {
  logoutHandler = fn
}

export const handleAuthError = () => {
  removeTokenAndAuthenticated()

  if (logoutHandler) logoutHandler()

  window.location.href = "/login"

  return {
    type: "Unauthorized",
    message: "Session expired. Please login again.",
  }
}
