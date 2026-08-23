import { getToken } from "@/utils"

export const requestInterceptor = (config) => {
  const token = getToken()
  if (token) config.headers.authorization = `Bearer ${token}`
  return config
}

export const requestErrorInterceptor = (error) => Promise.reject(error)
