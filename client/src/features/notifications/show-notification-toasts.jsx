import { useNavigate } from "react-router-dom"
import {
  ToastActionButton,
  ToastAvatar,
  ToastMedia,
  ToastMessageText,
  ToastUserName,
} from "@/lib/Toast"

export const CommentNotificationToast = ({ user, media, comment, postId, type }) => {
  const navigate = useNavigate()
  return (
    <div
      className="flex w-full cursor-pointer items-center gap-3 pr-3 font-Gilroy"
      onClick={() => navigate(`/post/${postId}`)}
    >
      <ToastAvatar src={user.profilePicture} />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <ToastUserName name={user.name} />
          {/* <ToastActionButton to={`/post/${postId}`} /> */}
        </div>
        {type === "reply" ? (
          <span className="text-muted-foreground/60 text-xs">replied to your comment</span>
        ) : (
          <span className="text-muted-foreground/60 text-xs">commented</span>
        )}
        <ToastMessageText text={comment} />
      </div>
      <ToastMedia src={media} />
    </div>
  )
}

export const FollowNotificationToast = ({ user }) => {
  return (
    <div className="flex w-full max-w-md items-center justify-center gap-3 rounded-2xl font-Gilroy">
      <ToastAvatar src={user.profilePicture} size="w-11 h-11" />
      <div className="-mt-1 flex flex-1 flex-col">
        <ToastMessageText text={`${user.name} started following you 🗽`} />
        <div className="-ml-0.5 mt-1 flex items-center justify-between">
          <ToastActionButton to={`/profile/${user.name}`} />
        </div>
      </div>
    </div>
  )
}

export const LikeNotificationToast = ({ user, postId, media }) => {
  return (
    <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl font-Gilroy">
      <ToastAvatar src={user.profilePicture} />
      <div className="-mt-1 flex flex-1 flex-col">
        <ToastMessageText text={`${user.name} liked your post`} heart={true} />
        <div className="-ml-0.5 mt-1 flex items-center justify-between">
          <ToastActionButton to={`/post/${postId}`} />
        </div>
      </div>
      <ToastMedia src={media} />
    </div>
  )
}
