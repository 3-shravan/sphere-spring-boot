export const MODE = import.meta.env.MODE as "development" | "production"

export const IS_DEV = MODE === "development"
export const IS_PROD = MODE === "production"

export const BASE_API_URL = import.meta.env.VITE_API_URL
export const API_URL = `${BASE_API_URL}/api/v1`
export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL
