import { axiosInstance, publicAxiosInstance } from "./instances"

import { requestErrorInterceptor, requestInterceptor } from "./interceptors/request-interceptor"
import { responseErrorInterceptor, responseInterceptor } from "./interceptors/response-interceptor"

axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

export { setLogoutHandler } from "./handlers/auth-error-handler"

export default axiosInstance
export { publicAxiosInstance }
