import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "@/lib/api/fetcher"
import { errorToast, successToast } from "@/utils"

const COMMENTS_QUERY_KEY = (postId) => ["comments", postId]

export const useGetPostComments = (postId) => {
  return useQuery({
    queryKey: COMMENTS_QUERY_KEY(postId),
    queryFn: () => fetcher({ endpoint: `/posts/${postId}/comments` }),
    onError: (err) => {
      errorToast(err?.response?.data?.message || "Error while getting the comments.")
    },
  })
}

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ comment, parentId = null }) =>
      fetcher({
        endpoint: `/posts/${postId}/comments`,
        method: "POST",
        data: { comment, parentId },
      }),
    onSuccess: (data) => {
      successToast(data.message)
      queryClient.invalidateQueries({ queryKey: COMMENTS_QUERY_KEY(postId) })
    },
    onError: (error) => {
      errorToast(error?.response?.data?.message || "Error while creating comment")
    },
  })
}

export const useDeleteComment = (postId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId }) =>
      fetcher({
        endpoint: `/posts/${postId}/comments/${commentId}`,
        method: "DELETE",
      }),
    onSuccess: (data) => {
      successToast(data.message)
      queryClient.invalidateQueries({ queryKey: COMMENTS_QUERY_KEY(postId) })
    },
    onError: (error) => {
      errorToast(error?.response?.data?.message || "Error while deleting comment")
    },
  })
}
