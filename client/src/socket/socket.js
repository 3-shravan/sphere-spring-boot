import { io } from "socket.io-client"
import { BASE_API_URL } from "../lib/api/http"

export const socket = io(BASE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
})
