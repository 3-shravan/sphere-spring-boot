import { useQuery } from "@tanstack/react-query"
import { POSTS_QUERY_KEYS } from "@/lib/utils/global-query-keys"
import { api } from "./shared-api"

export const useGetSinglePost = (postId) =>
  useQuery({
    queryKey: POSTS_QUERY_KEYS.detail(postId),
    queryFn: () => api.getSinglePost(postId),
    enabled: !!postId,
    meta: { showError: true },
  })

export const useSavedPosts = (isAuthenticated) =>
  useQuery({
    queryKey: POSTS_QUERY_KEYS.saved(),
    queryFn: () => api.getSavedPosts(),
    enabled: !!isAuthenticated,
    meta: { showError: true },
  })
