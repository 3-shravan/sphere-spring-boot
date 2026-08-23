import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { showErrorToast, showSuccessToast } from "../api/api-responses"
import { MODE } from "../api/http"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
    mutations: {
      onSettled: async (_data, _error, _variables, _context, mutation) => {
        const invalidateTargets = mutation?.meta?.invalidateQuery
        if (!invalidateTargets) return
        console.log(
          "Cached queries:",
          queryClient
            .getQueryCache()
            .getAll()
            .map((q) => q.queryKey),
        )

        const queriesToInvalidate = Array.isArray(invalidateTargets)
          ? invalidateTargets
          : [invalidateTargets]

        console.log("Queries to invalidate:", queriesToInvalidate)

        await Promise.all(
          queriesToInvalidate.filter(Boolean).map((queryKey) => {
            console.log("♻️ Invalidating query:", queryKey)
            return queryClient.invalidateQueries({ queryKey })
          }),
        )
        console.log("✅ All relevant queries invalidated")
      },
    },
  },

  queryCache: new QueryCache({
    onError: (error, query) =>
      query?.meta?.showError && showErrorToast(query.meta.errorMessage || error.message),

    onSuccess: (data, query) =>
      query?.meta.showSuccess && showSuccessToast(query.meta.successMessage || data.message),
  }),

  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      MODE === "development" && console.log(mutation, error)
      mutation?.meta?.showError && showErrorToast(mutation.meta.errorMessage || error)
    },

    onSuccess: (data, _variables, _context, mutation) => {
      MODE === "development" && console.log(data)
      mutation?.meta?.showSuccess && showSuccessToast(mutation.meta.successMessage || data.message)
    },
  }),
})
