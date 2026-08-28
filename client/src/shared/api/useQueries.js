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

export const useSavedPosts = (isAuthenticated, page = 1, limit = 10) =>
  useQuery({
    queryKey: [...POSTS_QUERY_KEYS.saved(), page, limit],
    queryFn: () => api.getSavedPosts(page, limit),
    enabled: !!isAuthenticated,
    meta: { showError: true },
  })

export const usePostLikesQuery = (postId, page = 1, limit = 20) =>
  useQuery({
    queryKey: [...POSTS_QUERY_KEYS.all, postId, "likes", page, limit],
    queryFn: () => api.getPostLikes(postId, page, limit),
    enabled: !!postId,
    meta: { showError: true },
  })
