export default function presenceEvents(socket, setOnlineUsers) {
  const handleOnlineUsers = (users) => setOnlineUsers(users)
  socket.on("online-users", handleOnlineUsers)

  return () => {
    socket.off("online-users", handleOnlineUsers)
  }
}
