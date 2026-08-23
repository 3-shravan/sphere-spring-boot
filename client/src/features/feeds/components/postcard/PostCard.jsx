import { useRef } from "react"
import Comments from "@/features/posts/features/comments/Comments"
import { LikePost, SavePost, ShowTags } from "@/shared"
import PostCardHeader from "./PostCardHeader"
import PostCardMedia from "./PostCardMedia"

const PostCard = ({ post }) => {
  const likePostRef = useRef(null)
  if (!post) return null
  return (
    <div className="post-card">
      <PostCardHeader post={post} />

      <div className="caption">{post.caption}</div>

      <div className="px-2">
        <ShowTags tags={post.tags} />
      </div>

      <PostCardMedia media={post?.media} thoughts={post?.thoughts} likePostRef={likePostRef} />

      <div className="flex-between px-2">
        <LikePost postId={post._id} likes={post.likes} ref={likePostRef} />
        <SavePost postId={post._id} />
      </div>

      <Comments postId={post?._id} />
    </div>
  )
}

export default PostCard
