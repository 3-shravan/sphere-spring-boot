/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useChatStore } from "@/features/chat/store/chatStore"
import { useApi, useSocket } from "@/hooks"
import { showErrorToast, showSuccessToast } from "@/lib/api/api-responses"
import { setLogoutHandler } from "@/lib/api/axios"
import { socket } from "@/socket/socket"
import { getIsAuthenticated, getToken, removeTokenAndAuthenticated } from "@/utils"

export const AuthContext = createContext()

export const ContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => ({
    isAuthenticated: getIsAuthenticated() ?? false,
    token: getToken() || null,
    profile: null,
  }))
  const [authLoading, setAuthLoading] = useState(true)

  // const setOnlineUsers = useChatStore((state) => state.setOnlineUsers)
  // const { onlineUsers } = useSocket(auth?.profile?._id || auth?.profile?.id)

  // useEffect(() => {
  //   setOnlineUsers(onlineUsers)
  // }, [onlineUsers, setOnlineUsers])

  const { request, loading } = useApi()

  const resetAuth = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      token: null,
      profile: null,
    })
    removeTokenAndAuthenticated()
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!getToken()) {
        resetAuth()
        setAuthLoading(false)
        return
      }
      try {
        const res = await request({ endpoint: "auth/profile" })
        setAuth({
          isAuthenticated: true,
          token: getToken(),
          profile: res?.data?.user,
        })
      } catch (error) {
        showErrorToast(error, "Failed to fetch user profile")
        resetAuth()
      } finally {
        setAuthLoading(false)
      }
    }
    fetchUserProfile()
  }, [request, resetAuth])

  const logout = useCallback(async () => {
    try {
      const response = await request({ endpoint: "auth/logout" })

      socket.disconnect()
      socket.connect()

      resetAuth()
      showSuccessToast(response, "Logged out 😢")
    } catch (error) {
      showErrorToast(error, "Logout failed")
    }
  }, [request, resetAuth])

  useEffect(() => {
    setLogoutHandler(logout)
  }, [logout])

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user: auth?.profile,
        currentUserId: auth?.profile?._id || auth?.profile?.id,
        logout,
        globalLoading: loading,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within a ContextProvider")
  return context
}
