import { useState, useEffect } from "react"
import { useToggleSavePost } from "../api/useMutations"
import { useSavedPosts } from "../api/useQueries"

const useSavePost = (postId) => {
  const { data } = useSavedPosts()
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (data?.savedPosts) {
      setIsSaved(data.savedPosts.some((p) => String(p._id || p.id) === String(postId)))
    }
  }, [data?.savedPosts, postId])

  const { mutate: toggleSave, isPending: saveIsPending } = useToggleSavePost({
    onMutate: () => setIsSaved((prev) => !prev),
    onError: () => setIsSaved((prev) => !prev),
  })

  return { toggleSave, isSaved, saveIsPending }
}
export default useSavePost
