import { useState } from "react"
import useComment from "../hooks/useComment"
import CommentBox from "./CommentBox"
import ReplyBox from "./ReplyBox"

const Comment = ({ comment, postId, parentId }) => {
  const { handleCreateReply, handleDelete, canDelete, deleting, commenting } = useComment(postId)
  const [replyInput, setReplyInput] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="rounded-lg">
      <CommentBox
        comment={comment}
        handleDelete={handleDelete}
        setReplyInput={setReplyInput}
        replyInput={replyInput}
        canDelete={canDelete}
        showReplies={showReplies}
        setShowReplies={setShowReplies}
        deleting={deleting}
        commenting={commenting}
      />

      {replyInput && (
        <ReplyBox
          handleCreateReply={handleCreateReply}
          parentId={parentId}
          setReplyInput={setReplyInput}
          commenting={commenting}
          setShowReplies={setShowReplies}
        />
      )}
      {showReplies &&
        comment?.replies?.length > 0 &&
        comment.replies.map((c) => (
          <div key={c._id} className="my-1 ml-10">
            <Comment comment={c} parentId={c._id} postId={postId} />
          </div>
        ))}
      {comment.replies.length > 0 && showReplies && (
        <div
          className="flex cursor-pointer items-center gap-1 pl-10 text-[10px] text-rose-300 transition hover:text-second"
          onClick={() => setShowReplies((prev) => !prev)}
        >
          ........Hide Replies
        </div>
      )}
    </div>
  )
}

export default Comment
