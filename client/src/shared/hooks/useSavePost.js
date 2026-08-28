import { useState, useEffect } from "react"
import { useToggleSavePost } from "../api/useMutations"

const useSavePost = (postId, initialIsSaved = false) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved)

  useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])

  const { mutate: toggleSave, isPending: saveIsPending } = useToggleSavePost({
    onMutate: () => setIsSaved((prev) => !prev),
    onError: () => setIsSaved((prev) => !prev),
  })

  return { toggleSave, isSaved, saveIsPending }
}

export default useSavePost
