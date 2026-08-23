import { Loading } from "@/components"
import { useAuth } from "@/context"
import { showErrorToast } from "@/lib/api/api-responses"
import useSavePost from "@/shared/hooks/useSavePost"

const SavePost = ({ postId }) => {
  const { toggleSave, isSaved, saveIsPending } = useSavePost(postId)
  const { auth } = useAuth()
  return (
    <button
      className="cursor-pointer py-0.5 text-second text-xs hover:text-rose-600"
      onClick={() => {
        if (!auth.isAuthenticated) return showErrorToast("You need to be logged in to save posts")
        toggleSave(postId)
      }}
    >
      {saveIsPending ? <Loading size={3} /> : isSaved ? "Unsave" : "Save"}
    </button>
  )
}
export default SavePost
