import { useState } from "react"
import { useToggleSavePost } from "../api/useMutations"
import { useSavedPosts } from "../api/useQueries"

const useSavePost = (postId) => {
  const { data } = useSavedPosts()
  const [isSaved, setIsSaved] = useState(data?.savedPosts?.some((p) => p._id === postId))
  const { mutate: toggleSave, isPending: saveIsPending } = useToggleSavePost({
    onMutate: () => setIsSaved((prev) => !prev),
    onError: () => setIsSaved((prev) => !prev),
  })

  return { toggleSave, isSaved, saveIsPending }
}
export default useSavePost
