import { useEffect, useState } from "react"
import notificationEvents from "@/socket/events/notifications"
import presenceEvents from "@/socket/events/presence"
import { socket } from "@/socket/socket"
import chatEvents from "../events/chat"

export default function useSocket(userId, options = {}) {
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!userId) return
    if (!socket.connected) socket.connect()
    const registerUser = () => {
      socket.emit("register", userId)
    }

    socket.on("connect", registerUser)
    socket.on("reconnect", registerUser)

    const cleanups = []
    cleanups.push(presenceEvents(socket, setOnlineUsers))
    cleanups.push(notificationEvents(socket))
    cleanups.push(chatEvents(socket))
    if (options.chat) cleanups.push(chatEvents(socket, options.chat))

    return () => {
      socket.off("connect", registerUser)
      socket.off("reconnect", registerUser)
      cleanups.forEach((cleanup) => {
        if (cleanup) cleanup()
      })
    }
  }, [userId, options])

  return { socket, onlineUsers }
}
