import { useQuery } from "@tanstack/react-query"
import { USERS_QUERY_KEY } from "@/lib/utils/global-query-keys"
import { usersApi } from "./users-api"

export const useSuggestedUsers = () =>
  useQuery({
    queryKey: USERS_QUERY_KEY.suggested(),
    queryFn: () => usersApi.getSuggestedUsers(),
    meta: {
      showError: true,
      invalidateQuery: USERS_QUERY_KEY.suggested(),
    },
  })

export const useGetProfile = (username) =>
  useQuery({
    queryKey: USERS_QUERY_KEY.profile(username),
    queryFn: () => usersApi.getProfile(username),
    enabled: !!username,
    meta: { showError: true },
  })
