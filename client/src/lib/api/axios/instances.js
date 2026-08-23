import axios from "axios"
import { API_URL } from "../http"

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // timeout: 15000,
})

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})
delete publicAxiosInstance.defaults.headers.common?.Authorization
