import { errorMessage, showErrorToast } from "../api/api-responses"
export default async function tryCatch(promise, options = { rethrow: true, toast: false }) {
  try {
    const response = await promise
    console.log("response", response)
    if (!response?.success) throw new Error(response.message || "API responded with failure")
    return response
  } catch (error) {
    console.error("tryCatch", errorMessage(error))
    if (options.toast) showErrorToast(error)
    if (options.rethrow) throw error
    return { response: null, error }
  }
}
