import { formatDistanceToNow } from "date-fns"
import { Link, useNavigate } from "react-router-dom"
import { ProfilePicture, Spinner } from "@/components"
import { Button } from "@/components/ui/button"
import { LikePost, PostOptions, SavePost, ShowTags } from "@/shared"
import Comments from "../../features/comments/Comments"

export default function ViewPostInfo({ postId, post, setShowModal }) {
  const navigate = useNavigate()
  if (!post) return null

  const handleBackNavigation = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate("/feeds")
  }

  return (
    <div className="custom-scrollbar-hide flex h-screen w-full flex-col overflow-y-auto border-border p-3 md:w-1/2 md:p-8 md:px-6">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <ProfilePicture
            profilePicture={post?.author?.profilePicture}
            username={post?.author?.name}
            size={"md"}
          />
          <div>
            <Link to={`/profile/${post?.author?.name}`} className="text-sm">
              {post?.author?.name}
            </Link>
            <p className="text-[9px] text-muted-foreground">
              {post?.createdAt && !Number.isNaN(new Date(post.createdAt)) ? (
                formatDistanceToNow(new Date(post?.createdAt), {
                  addSuffix: true,
                })
              ) : (
                <Spinner className="h-3 w-3" />
              )}
            </p>
          </div>
        </div>
        <div className="flex">
          <PostOptions postId={postId} author={post?.author} thoughts={post?.thoughts} />
          <button
            onClick={handleBackNavigation}
            className="flex cursor-pointer items-center rounded-full bg-muted px-2 py-1 text-xs transition hover:bg-third"
          >
            &lt; back
          </button>
        </div>
      </header>

      <div className="mt-4 flex-1 space-y-2">
        {post?.caption && post?.media && (
          <p className="border-muted border-b px-2 py-2 font-Futura text-sm">{post?.caption}</p>
        )}
        <ShowTags tags={post?.tags} />

        <div className="flex items-center justify-between gap-4 px-2">
          <LikePost postId={post?._id} likes={post?.likes} />
          <div className="flex flex-col gap-2">
            <SavePost postId={post?._id} />
            <Button
              variant="outline"
              className="hidden cursor-pointer text-xs md:block"
              onClick={() => setShowModal(true)}
            >
              Share
            </Button>
          </div>
        </div>
        <Comments postId={post?._id} expanded={true} />
      </div>
    </div>
  )
}
