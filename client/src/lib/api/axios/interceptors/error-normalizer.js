export const normalizeError = (error) => {
  const res = error?.response
  const status = res?.status
  const type = res?.data?.type
  const backendMsg = res?.data?.message

  // Network-level errors
  if (error.code === "ECONNABORTED" || error.message.includes("Network Error"))
    return {
      type: "NetworkError",
      message: "Network error. Please try again.",
    }

  // HTML response (server misconfiguration)
  const isHtml =
    res?.headers?.["content-type"]?.includes("text/html") ||
    (typeof res?.data === "string" && res.data.startsWith("<!DOCTYPE html>"))
  if (isHtml)
    return {
      status,
      type: "InvalidHTMLResponse",
      message: "Server returned HTML instead of JSON.",
    }

  // No response (server down / CORS / DNS / timeout)
  if (error.request && !error.response)
    return {
      type: "NoResponse",
      message: "Server did not respond",
    }

  return {
    status,
    type: type || "Unknown",
    message: backendMsg || "Unexpected server error.",
    raw: res?.data,
  }
}
