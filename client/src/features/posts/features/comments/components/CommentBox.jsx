import { Eye, MessageSquare, Trash, Trash2 } from "lucide-react"
import { ProfilePicture, Spinner } from "@/components"
import { multiFormatDateString } from "@/utils"

const CommentBox = ({
  comment,
  handleDelete,
  replyInput,
  setReplyInput,
  canDelete,
  showReplies,
  setShowReplies,
  deleting,
  commenting,
}) => {
  if (!comment) return null
  return (
    <div className="rounded-2xl py-1">
      <div className="flex items-start gap-4">
        {comment?.author?.profilePicture ? (
          <ProfilePicture profilePicture={comment?.author?.profilePicture} size="md" />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-rose-300 to-rose-400 font-Futura font-bold text-muted text-xs">
            {comment?.author?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-muted-foreground text-xs">
              {comment?.author?.name || "Anonymous"}
            </h4>
            <span className="text-[9px] text-muted-foreground">
              {multiFormatDateString(comment.createdAt)}
            </span>
          </div>

          <p className="mt-1 text-foreground text-xs">{comment.comment}</p>

          {/* Actions */}
          {commenting ? (
            <Spinner size="4" />
          ) : (
            <div className="-ml-1 mt-2 flex gap-2 text-[10px] text-muted-foreground">
              <button onClick={() => setReplyInput((prev) => !prev)} className="reply-action-btn">
                <MessageSquare size={12} />
                {replyInput ? "Cancel" : "Reply"}
              </button>

              {comment.replies.length > 0 && (
                <div className="reply-action-btn" onClick={() => setShowReplies((prev) => !prev)}>
                  <Eye size={13} /> {showReplies ? "Hide replies" : "Show Replies"}
                </div>
              )}

              {canDelete(comment?.author?._id) && (
                <button
                  onClick={() => !deleting && handleDelete(comment._id)}
                  className="flex cursor-pointer items-center gap-0.5 rounded-full bg-muted-foreground/10 px-2 py-1 text-rose-400 transition hover:bg-black/10"
                >
                  {deleting ? <Trash2 size={12} className="animate-spin" /> : <Trash size={12} />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentBox
