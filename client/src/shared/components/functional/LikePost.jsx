import { Heart } from "lucide-react"
import { forwardRef, useImperativeHandle, useState } from "react"
import { FaHeart } from "react-icons/fa6"
import { Modal } from "@/components"
import { useAuth } from "@/context"
import { showErrorToast } from "@/lib/api/api-responses"
import useLikePost from "../../hooks/useLikePost"
import LikeModal from "./modals/ShowUserModal"

const LikePost = forwardRef(({ postId, likes: initialLikes = [], likedBy = true }, ref) => {
  const { toggleLike, likes, likesCount, isLiked } = useLikePost(postId, initialLikes)

  const [showModal, setShowModal] = useState(false)
  const [animate, setAnimate] = useState(false)

  const { auth } = useAuth()

  useImperativeHandle(ref, () => ({
    triggerLike: () => handleLike(),
  }))

  const handleLike = () => {
    if (!auth.isAuthenticated) return showErrorToast("Please login to like posts")
    toggleLike(postId)
    setAnimate(true)
    setTimeout(() => setAnimate(false), 300)
  }

  return (
    <>
      <div className="flex items-center gap-2 font-Gilroy text-sm">
        <button onClick={handleLike} className="flex min-w-8 cursor-pointer items-center gap-1">
          {isLiked ? (
            <FaHeart
              className={`h-4 w-4 text-rose-600 transition-transform duration-200 ${
                animate ? "scale-125" : ""
              }`}
            />
          ) : (
            <Heart
              className={`h-4 w-4 transition-transform duration-200 ${animate ? "scale-125" : ""}`}
            />
          )}
          <span
            className={`font-bold text-xs ${
              !likedBy && "text-auto-contrast text-muted-foreground"
            }`}
          >
            {likesCount}
          </span>
        </button>

        {likedBy && (
          <>
            <span>·</span>
            {likesCount > 0 ? (
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => setShowModal(true)}
              >
                <div className="-space-x-2 flex">
                  {likes.slice(0, 3).map((user) =>
                    user?.profilePicture ? (
                      <img
                        key={user._id}
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-5 w-5 rounded-full border-2 border-rose-200 object-cover"
                      />
                    ) : (
                      <div
                        key={user._id}
                        className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-rose-300 to-rose-400 font-Futura font-bold text-muted text-xs"
                      >
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    ),
                  )}
                </div>
                <span className="text-muted-foreground text-xs hover:text-foreground">
                  liked by {likes[0]?.name} {likesCount > 1 && <>and {likesCount - 1} others</>}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">Be the first to like</span>
            )}
          </>
        )}
      </div>

      {showModal && (
        <Modal darkModal={true}>
          <LikeModal title="Liked by" users={likes} onCancel={setShowModal} />
        </Modal>
      )}
    </>
  )
})

LikePost.displayName = "LikePost"
export default LikePost
