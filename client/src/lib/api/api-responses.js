import { errorToast, infoToast, successToast } from "../Toast"

export const successMessage = (response, customErrMessage) => {
  console.log("response: ", response)
  return (
    response?.data?.message ||
    response?.message ||
    response ||
    customErrMessage ||
    "Request successful 🗽"
  )
}
export const showSuccessToast = (response, customErrMessage) => {
  const message = successMessage(response, customErrMessage)
  successToast(message)
}

export const errorMessage = (error, customErrMessage) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error?.message ||
    error ||
    customErrMessage ||
    "An Error while doing so 😢"
  )
}

export const showErrorToast = (error, customErrMessage) => {
  const message = errorMessage(error, customErrMessage)
  errorToast(message)
}

export const showInfoToast = (message) => {
  infoToast(message)
}
