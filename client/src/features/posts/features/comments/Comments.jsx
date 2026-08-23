import { useState } from "react"
import { Loading } from "@/components"
import { AddComment, CommentList, CommentsCount, TopCommentPreview } from "./components"
import useComment from "./hooks/useComment"

const Comments = ({ postId, expanded }) => {
  const { comments, isLoading, topComment } = useComment(postId)
  const [expand, setExpand] = useState(expanded | false)

  if (isLoading) return <Loading />
  return (
    <>
      <div className="max-h-[50vh] overflow-y-auto px-2 font-Poppins text-foreground text-sm transition-all duration-200 md:px-2">
        <div className="mt-2">
          <CommentsCount
            count={comments?.comments?.length}
            expand={expand}
            onToggle={() => setExpand((prev) => !prev)}
          />
          {expand ? (
            <CommentList comments={comments?.comments} postId={postId} />
          ) : (
            topComment && (
              <TopCommentPreview topComment={topComment} onClick={() => setExpand(true)} />
            )
          )}
        </div>
      </div>
      <AddComment postId={postId} />
    </>
  )
}

export default Comments
