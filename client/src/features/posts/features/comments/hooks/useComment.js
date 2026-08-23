import { useState } from "react"
import { useAuth } from "@/context"
import { showErrorToast } from "@/lib/api/api-responses"
import { useCreateComment, useDeleteComment, useGetPostComments } from "../services"

const useComment = (postId) => {
  const [comment, setComment] = useState("")
  const { data: comments, isLoading } = useGetPostComments(postId)
  const topComment = comments?.comments[0]

  const { mutateAsync: createComment, isPending: commenting } = useCreateComment(postId)
  const { mutateAsync: deleteComment, isPending: deleting } = useDeleteComment(postId)

  const { auth } = useAuth()

  const handleCreate = async (parentId = null) => {
    if (!auth.isAuthenticated) return showErrorToast("Please login to comment")
    if (!comment.trim()) return
    await createComment({ comment, parentId })
    setComment("")
  }
  const handleCreateReply = async (parentId, reply) => {
    if (!auth.isAuthenticated) return showErrorToast({}, "Please login to reply")
    if (!reply.trim()) return
    const comment = reply
    await createComment({ comment, parentId })
  }
  const handleDelete = async (commentId) => {
    if (!postId || !commentId) return console.warn("Missing postId or commentId", commentId)
    await deleteComment({ commentId })
  }
  const { currentUserId } = useAuth()
  const canDelete = (id) => currentUserId === id
  return {
    comment,
    comments,
    topComment,
    setComment,
    handleCreate,
    handleCreateReply,
    handleDelete,
    canDelete,
    isLoading,
    commenting,
    deleting,
  }
}
export default useComment
