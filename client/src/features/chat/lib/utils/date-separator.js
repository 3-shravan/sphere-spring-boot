export function getDateLabel(date) {
  const today = new Date()
  const msgDate = new Date(date)

  const isToday = msgDate.toDateString() === today.toDateString()

  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isYesterday = msgDate.toDateString() === yesterday.toDateString()

  if (isToday) return "Today"
  if (isYesterday) return "Yesterday"

  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
