import { handleAuthError } from "../handlers/auth-error-handler"
import { normalizeError } from "./error-normalizer"

export const responseInterceptor = (response) => response

export const responseErrorInterceptor = async (error) => {
  const normalized = normalizeError(error)

  const { status, type, message } = normalized

  if (
    status === 401 ||
    ["Unauthorized", "TokenExpired", "BadToken", "AccessTokenError"].includes(type)
  )
    return Promise.reject(handleAuthError())

  // -----------------------------------------
  // FORBIDDEN
  // -----------------------------------------
  if (status === 403 || type === "Forbidden") {
    return Promise.reject({
      status,
      type,
      message: "You do not have permission for this action.",
    })
  }

  // -----------------------------------------
  // VALIDATION (422)
  // -----------------------------------------
  if (status === 422 || type === "ValidationError") {
    return Promise.reject({
      status,
      type,
      message,
      errors: error.response?.data?.errors || null,
    })
  }

  // -----------------------------------------
  // NOT FOUND
  // -----------------------------------------
  if (status === 404 || type === "NotFound") {
    return Promise.reject({
      status,
      type,
      message: message || "Resource not found.",
    })
  }

  // -----------------------------------------
  // CONFLICT
  // -----------------------------------------
  if (status === 409 || type === "Conflict") {
    return Promise.reject({
      status,
      type,
      message: message || "Duplicate or conflicting resource.",
    })
  }

  // -----------------------------------------
  // SERVER ERRORS
  // -----------------------------------------
  if ([500, 501, 502, 503].includes(status)) {
    return Promise.reject({
      status,
      type,
      message: "Server error. Please try later.",
    })
  }

  // -----------------------------------------
  // FALLBACK / UNKNOWN
  // -----------------------------------------
  return Promise.reject(normalized)
}
