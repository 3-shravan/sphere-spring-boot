import notify from "@/features/notifications/notify"

export default function notificationEvents(socket) {
  const handleNotification = (data) => data && notify(data)

  socket.on("notification", handleNotification)

  return () => {
    socket.off("notification", handleNotification)
  }
}
