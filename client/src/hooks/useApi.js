import { useCallback, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { showErrorToast, showSuccessToast } from "@/lib/api/api-responses"
import axiosInstance from "@/lib/api/axios"

const OPTIONS = {
  method: "GET",
  showSuccess: false,
  showError: true,
  retry: 0,
  retryDelay: 500,
  redirect: null,
  transformResponse: (res) => res,
}

export default function useApi() {
  const navigate = useNavigate()
  const abortRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const cancel = useCallback(() => {
    abortRef?.current?.abort()
  }, [])
  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  const attemptRequest = useCallback(async (config, retryCount) => {
    try {
      return await axiosInstance(config)
    } catch (err) {
      if (retryCount > 0) {
        await delay(config.retryDelay || 500)
        return attemptRequest(config, retryCount - 1)
      }
      throw err
    }
  }, [])

  /**
   ** REQUEST FUNCTION
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: <necessary>
  const request = useCallback(
    async (options) => {
      const {
        endpoint,
        method = OPTIONS.method,
        data,
        body,
        params,
        headers,
        retry = OPTIONS.retry,
        retryDelay = OPTIONS.retryDelay,
        redirect = OPTIONS.redirect,
        showSuccess = OPTIONS.showSuccess,
        showError = OPTIONS.showError,
        transformResponse = OPTIONS.transformResponse,
      } = options

      setLoading(true)
      abortRef.current = new AbortController()

      const payload = data ?? body ?? null

      const config = {
        url: endpoint,
        method,
        data: payload,
        params,
        headers,
        signal: abortRef.current.signal,
        retry,
        retryDelay,
      }

      try {
        const response = await attemptRequest(config, retry)
        if (showSuccess && response?.data?.message) showSuccessToast(response.data.message)
        if (redirect) navigate(redirect, { replace: true })

        return transformResponse(response)
      } catch (error) {
        if (showError) showErrorToast(error, "⚙ Something went wrong")
        return Promise.reject(error)
      } finally {
        setLoading(false)
      }
    },
    [navigate, attemptRequest],
  )

  const fetcher = useCallback(async (endpointOrConfig) => {
    const config =
      typeof endpointOrConfig === "string"
        ? { url: endpointOrConfig, method: "GET" }
        : endpointOrConfig

    const res = await axiosInstance(config)
    return res.data
  }, [])

  return {
    request,
    fetcher,
    loading,
    cancel,
  }
}
