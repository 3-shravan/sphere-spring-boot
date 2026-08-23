import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"
import { Backdrop } from "@/components"
import ThoughtsCard from "./ui/ThoughtsCard"

const WORDS = 70

import { LikePost, PostOptions, SavePost, ShowTags } from "@/shared"

const PostGrid = ({
  posts = [],
  emptyText = "No Posts",
  showAuthor = true,
  showCaption = true,
  showTags = false,
  savePost = false,
  likePost = false,
}) => {
  const navigate = useNavigate()
  if (!posts) return null

  const isExpanded = (caption, Words) => caption.length > Words
  const toViewPost = (postId) => navigate(`/post/${postId}`)
  const toProfile = (username) => navigate(`/profile/${username}`)

  return (
    <div className="w-full columns-2 xs:columns-2 gap-5 sm:columns-2 md:columns-3 lg:columns-3">
      {posts.length === 0 || !posts[0] ? (
        <span className="px-0.5 font-medium text-neutral-500 uppercase tracking-tighter">
          {emptyText}
        </span>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-4xl border shadow"
          >
            <div className="relative w-full">
              {post?.media ? (
                <img
                  onClick={() => toViewPost(post._id)}
                  src={post.media}
                  alt="post"
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div
                  className="inset-0 z-10 h-64 bg-background/70"
                  onClick={() => toViewPost(post._id)}
                >
                  <ThoughtsCard thought={post?.thoughts} postId={post._id} className="h-full" />
                </div>
              )}

              <div className="absolute top-3 right-1">
                <PostOptions postId={post._id} author={post.author} thoughts={post.thoughts} />
              </div>

              {showAuthor && (
                <Backdrop
                  fn={() => toProfile(post?.author?.name)}
                  image={post?.author?.profilePicture}
                  position="top-left"
                >
                  {post?.author?.name}
                </Backdrop>
              )}

              <div
                className={`absolute bottom-0 left-0 w-full px-4 pb-4 text-neutral-900 ${
                  post.media && "bg-gradient-to-t from-neutral-900 to-transparent"
                }
              `}
              >
                {showCaption && (
                  <h2 className="mb-1 font-Poppins font-medium text-neutral-300 text-xs">
                    {isExpanded(post.caption, WORDS) ? (
                      <>
                        {post?.caption.slice(0, WORDS)}
                        <span className="font-Poppins font-semibold text-second text-xs">
                          ...more
                        </span>
                      </>
                    ) : (
                      post?.caption
                    )}
                  </h2>
                )}

                {showTags && <ShowTags tags={post.tags} count={2} />}
                <Footer
                  createdAt={post.createdAt}
                  location={post.location}
                  id={post._id}
                  savePost={savePost}
                  likePost={likePost}
                  likes={post.likes}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default PostGrid

const Footer = ({ createdAt, location, savePost, likePost, id, likes }) => (
  <div className="flex justify-between">
    <div className="flex items-center pt-1 font-Gilroy">
      <p className="text-[10px] text-neutral-400">
        {formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        })}
      </p>
      {location && (
        <p className="ml-1 hidden text-[10px] text-neutral-400 uppercase md:block">in {location}</p>
      )}
    </div>
    <div className="flex gap-2">
      {savePost && <SavePost postId={id} />}
      {likePost && <LikePost postId={id} likes={likes} likedBy={false} />}
    </div>
  </div>
)
