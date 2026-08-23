import { toast } from "sonner"
import {
  CommentNotificationToast,
  FollowNotificationToast,
  LikeNotificationToast,
} from "./show-notification-toasts"

export default function notify(data) {
  let content
  switch (data.type) {
    case "comment":
    case "reply":
      content = (
        <CommentNotificationToast
          user={data.user}
          parent={data.parent}
          comment={data.comment}
          postId={data.postId}
          media={data.media}
          type={data.type}
        />
      )
      toast(content, { duration: 5000 })
      break

    case "follow":
      content = (
        <FollowNotificationToast
          user={data.user}
          notification={`${data.user.name} started following you 🗽`}
        />
      )
      toast(content, { duration: 5000 })
      break

    case "like":
      content = (
        <LikeNotificationToast
          user={data.user}
          postId={data.postId}
          media={data.media}
          notification={`${data.user.name} liked your post ❤️`}
        />
      )
      toast(content, { duration: 5000 })
      break

    default:
      toast(data.message || "You have a new notification", { duration: 4000 })
  }
}
