import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks"
import { errorMessage } from "@/lib/api/api-responses"
import { API_URL } from "@/lib/api/http"

export default function useUsernameAvailability(value) {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState("")

  const debouncedUsername = useDebounce(value, 500)

  useEffect(() => {
    if (!debouncedUsername) {
      setStatus(null)
      setMessage("")
      return
    }

    const checkAvailability = async () => {
      try {
        setStatus("checking")
        const res = await fetch(`${API_URL}/auth/check-username?username=${debouncedUsername}`)
        const data = await res.json()
        if (data.available) setStatus("available")
        else setStatus("unavailable")
        setMessage(data.message || "")
      } catch (err) {
        setStatus("error")
        setMessage(errorMessage(err))
      }
    }

    checkAvailability()
  }, [debouncedUsername])

  return { status, message }
}
