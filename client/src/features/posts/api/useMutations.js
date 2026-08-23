import { useMutation } from "@tanstack/react-query"
import { POSTS_QUERY_KEYS } from "@/lib/utils/global-query-keys"
import { postApi } from "./posts-api"

export const useCreatePost = () =>
  useMutation({
    mutationFn: (formData) => postApi.createPost(formData),
    meta: {
      showSuccess: true,
      showError: true,
      invalidateQuery: [POSTS_QUERY_KEYS.feeds()],
    },
  })

export const useCreateThought = () =>
  useMutation({
    mutationFn: (formData) => postApi.createThought(formData),
    meta: {
      showSuccess: true,
      showError: true,
      invalidateQuery: [POSTS_QUERY_KEYS.feeds()],
    },
  })

export const useUpdatePost = (postId) =>
  useMutation({
    mutationFn: (formData) => postApi.updatePost(postId, formData),
    meta: {
      showSuccess: true,
      showError: true,
      invalidateQuery: [POSTS_QUERY_KEYS.feeds(), POSTS_QUERY_KEYS.detail(postId)],
    },
  })

export const useDeletePost = () =>
  useMutation({
    mutationFn: (postId) => postApi.deletePost(postId),
    meta: {
      showSuccess: true,
      showError: true,
      invalidateQuery: [POSTS_QUERY_KEYS.feeds(), POSTS_QUERY_KEYS.details()],
    },
  })
