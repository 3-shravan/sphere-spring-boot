import Comment from "./Comment"
export default function CommentList({ comments, postId }) {
  return (
    <div className="-ml-1 space-y-2">
      {comments?.map((comment) => (
        <Comment key={comment._id} comment={comment} postId={postId} parentId={comment._id} />
      ))}
    </div>
  )
}
