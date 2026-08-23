import { Link } from "react-router-dom"
import { ProfilePicture } from "@/components"
import { usePost } from "@/context"
import { PostOptions } from "@/shared"
import { multiFormatDateString } from "@/utils"

const PostCardHeader = ({ post }) => {
  const { dropdown } = usePost()

  if (!post) return null
  const { author, createdAt, location } = post
  return (
    <div className="mx-auto flex-between pl-2">
      <div className="flex items-center gap-3">
        <ProfilePicture profilePicture={author?.profilePicture} username={author?.name} />
        <div className="flex flex-col">
          <Link to={`/profile/${author?.name}`} className="font-bold text-xs md:text-sm">
            {author?.name}
          </Link>
          <div className="flex gap-2 font-Gilroy font-medium text-[10px] text-muted-foreground">
            <p>{multiFormatDateString(createdAt)}</p>
            {location && <p>• {location}</p>}
          </div>
        </div>
      </div>

      <PostOptions postId={post._id} dropdown={dropdown} />
    </div>
  )
}

export default PostCardHeader
