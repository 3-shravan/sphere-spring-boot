import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { usePosts } from "@/features/feeds/api/useQueries"

// eslint-disable-next-line react-refresh/only-export-components
export const PostContext = createContext()
const LIMIT = 5

export function PostProvider({ children }) {
  const [dropdown, setDropdown] = useState("following")
  const [posts, setPosts] = useState([])

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(dropdown, LIMIT)

  useEffect(() => {
    const allPostsFromData = data?.pages?.flatMap((page) => page?.posts) || []
    setPosts(allPostsFromData)
  }, [data])

  const fetchInfinite = useMemo(
    () => ({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    }),
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  return (
    <PostContext.Provider value={{ posts, status, fetchInfinite, dropdown, setDropdown }}>
      {children}
    </PostContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePost = () => {
  const context = useContext(PostContext)
  if (!context) throw new Error("usePost must be used within a PostProvider")
  return context
}
