import { useState } from "react"
import { FaHeart } from "react-icons/fa6"
import ThoughtsCard from "@/shared/components/ui/ThoughtsCard"

const PostCardMedia = ({ media, thoughts, likePostRef }) => {
  const [showHeart, setShowHeart] = useState(false)

  const handleDoubleClick = () => {
    likePostRef?.current?.triggerLike()
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1000) // longer to show full animation
  }

  if (media) {
    return (
      <div className="relative flex w-full justify-center p-2">
        <div className="max-w-[90vw] overflow-hidden rounded-2xl md:max-w-[55vw] lg:max-w-[45vw]">
          <img
            src={media}
            alt="post"
            onDoubleClick={handleDoubleClick}
            className="max-h-[85vh] w-full cursor-pointer object-cover"
          />
        </div>

        {showHeart && (
          <FaHeart className="absolute inset-0 m-auto animate-[popBounce_1s_ease-out] text-8xl text-rose-600 opacity-50" />
        )}
      </div>
    )
  } else {
    return <ThoughtsCard thought={thoughts} className="px-2.5 pt-0" />
  }
}

export default PostCardMedia
