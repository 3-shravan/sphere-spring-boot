export const setAllFieldsNull = (formData) => {
  for (const key in formData) {
    if (Object.hasOwn(formData, key)) {
      formData[key] = ""
    }
  }
  return formData
}

// Formats a date string to "MMM DD, YYYY at HH:MM AM/PM"
export function formatDateString(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }

  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString("en-US", options)

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
  return `${formattedDate} at ${time}`
}

export const multiFormatDateString = (timestamp = "") => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000)
  const date = new Date(timestampNum * 1000)
  const now = new Date()

  const diff = now.getTime() - date.getTime()
  const diffInSeconds = diff / 1000
  const diffInMinutes = diffInSeconds / 60
  const diffInHours = diffInMinutes / 60
  const diffInDays = diffInHours / 24

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp)
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`
    default:
      return "Just now"
  }
}

export function formatDateToLocalISO(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
