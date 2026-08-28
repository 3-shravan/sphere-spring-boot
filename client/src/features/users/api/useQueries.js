import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { USERS_QUERY_KEY, POSTS_QUERY_KEYS } from "@/lib/utils/global-query-keys"
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

export const useFollowersQuery = (userId, page = 0) =>
  useQuery({
    queryKey: [...USERS_QUERY_KEY.all, userId, "followers", page],
    queryFn: () => usersApi.getFollowers(userId, page),
    enabled: !!userId,
  })

export const useFollowingQuery = (userId, page = 0) =>
  useQuery({
    queryKey: [...USERS_QUERY_KEY.all, userId, "following", page],
    queryFn: () => usersApi.getFollowing(userId, page),
    enabled: !!userId,
  })

export const useProfilePosts = (userId) =>
  useInfiniteQuery({
    queryKey: POSTS_QUERY_KEYS.profile(userId),
    queryFn: ({ pageParam = 1 }) => usersApi.getUserPosts(userId, pageParam, 10),
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage?.currentPage + 1 : undefined),
    enabled: !!userId,
  })
