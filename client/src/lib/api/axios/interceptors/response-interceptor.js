import { handleAuthError } from "../handlers/auth-error-handler"
import { normalizeError } from "./error-normalizer"

export const responseInterceptor = (response) => {
  return response
}

export const responseErrorInterceptor = async (error) => {
  const normalized = normalizeError(error)
  const { status, type, message, traceId, path, fieldErrors, errors } = normalized

  if (process.env.NODE_ENV !== "production") {
    console.groupCollapsed(`%c[API Error ${status}] ${type}: ${message}`, "color: #ef4444; font-weight: bold;")
    console.error("Normalized Error:", normalized)
    if (traceId) console.info("Trace ID:", traceId)
    if (path) console.info("Request Path:", path)
    if (errors) console.info("Validation Errors:", errors)
    console.groupEnd()
  }

  // 1. Authentication errors (401 / expired / invalid token)
  if (
    status === 401 ||
    ["Unauthorized", "TokenExpired", "BadToken", "AccessTokenError"].includes(type)
  ) {
    return Promise.reject(handleAuthError(normalized))
  }

  // 2. Forbidden (403)
  if (status === 403 || type === "Forbidden") {
    return Promise.reject({
      ...normalized,
      message: message || "You do not have permission to perform this action.",
    })
  }

  // 3. Validation errors (422 / 400 with field errors)
  if (status === 422 || type === "ValidationError" || (status === 400 && errors && errors.length > 0)) {
    return Promise.reject({
      ...normalized,
      errors,
      fieldErrors,
      message: message || "Please review the highlighted form fields.",
    })
  }

  // 4. Resource Not Found (404)
  if (status === 404 || type === "NotFound") {
    return Promise.reject({
      ...normalized,
      message: message || "The requested resource could not be found.",
    })
  }

  // 5. Conflict (409)
  if (status === 409 || type === "Conflict") {
    return Promise.reject({
      ...normalized,
      message: message || "A conflict occurred with the current state of the resource.",
    })
  }

  // 6. Server errors (500, 502, 503, 504)
  if (status >= 500) {
    return Promise.reject({
      ...normalized,
      message: message || "Server encountered an error. Please try again later.",
      traceId,
    })
  }

  // 7. General Bad Request & fallback
  return Promise.reject(normalized)
}
