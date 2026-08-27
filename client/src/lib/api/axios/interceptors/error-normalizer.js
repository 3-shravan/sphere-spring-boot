/**
 * Normalizes all error types (Axios, Network, HTTP, Server, HTML error pages)
 * into a standardized client-side error object.
 */
export const normalizeError = (error) => {
  const res = error?.response
  const data = res?.data
  const status = res?.status || (error.code === "ECONNABORTED" ? 408 : 500)
  const type = data?.type
  const backendMsg = data?.message || data?.error

  // 1. Network-level errors (CORS failure, connection reset, offline)
  if (error.code === "ECONNABORTED" || (error.message && error.message.includes("Network Error"))) {
    return {
      status: 0,
      type: "NetworkError",
      message: "Unable to connect to the server. Please check your internet connection.",
      isNetworkError: true,
      timestamp: new Date().toISOString(),
      raw: error,
    }
  }

  // 2. HTML response (e.g. 502 Bad Gateway / Nginx / Tomcat crash page)
  const isHtml =
    res?.headers?.["content-type"]?.includes("text/html") ||
    (typeof data === "string" && data.trim().startsWith("<!DOCTYPE html>"))
  if (isHtml) {
    return {
      status,
      type: "GatewayError",
      message: `Server returned an HTML error (${status}). Service may be starting up or unavailable.`,
      timestamp: new Date().toISOString(),
      raw: data,
    }
  }

  // 3. Request sent but no response received (timeout / server dead)
  if (error.request && !res) {
    return {
      status: 0,
      type: "NoResponse",
      message: "Server did not respond in time. Please try again.",
      isTimeout: true,
      timestamp: new Date().toISOString(),
      raw: error.request,
    }
  }

  // 4. Structured validation errors map
  const errorsList = Array.isArray(data?.errors) ? data.errors : null
  const fieldErrors = errorsList
    ? errorsList.reduce((acc, curr) => {
        if (curr.field) acc[curr.field] = curr.message
        return acc
      }, {})
    : null

  // 5. Trace & correlation ID
  const traceId = data?.traceId || res?.headers?.["x-trace-id"] || res?.headers?.["x-correlation-id"] || null

  return {
    status,
    type: type || (status >= 500 ? "InternalServerError" : status === 404 ? "NotFound" : status === 400 ? "BadRequest" : "Unknown"),
    message: backendMsg || (status >= 500 ? "A server error occurred. Please try again later." : "An unexpected error occurred."),
    path: data?.path || null,
    traceId,
    timestamp: data?.timestamp || new Date().toISOString(),
    errors: errorsList,
    fieldErrors,
    raw: data,
  }
}
