import { useInfiniteScroll } from "@eightmay/hooks"
import { useRef } from "react"
import { Loading } from "@/components"
import { usePost } from "@/context"
import Thoughts from "@/features/posts/components/Thoughts"

import FeedDropdown from "../components/FeedDropdown"
import FeedList from "../components/FeedList"

const THRESHOLD = 80
export default function Feed() {
  const { posts, status, fetchInfinite, dropdown, setDropdown } = usePost()
  const scrollRef = useRef(null)

  const onBottomReach = async () => {
    if (!fetchInfinite.hasNextPage || fetchInfinite.isFetchingNextPage) return
    return fetchInfinite.fetchNextPage()
  }
  useInfiniteScroll({
    scrollRef,
    threshold: THRESHOLD,
    onReach: onBottomReach,
  })

  return (
    <div ref={scrollRef} className="feed flex flex-col overflow-y-scroll rounded-lg">
      <FeedDropdown dropdown={dropdown} setDropdown={setDropdown} />

      <div className="mb-4 md:hidden">
        <Thoughts />
      </div>

      {status === "pending" ? (
        <div className="mt-30">
          <Loading size={6} />
        </div>
      ) : (
        <FeedList
          posts={posts}
          dropdown={dropdown}
          setDropdown={setDropdown}
          isFetchingNextPage={fetchInfinite.isFetchingNextPage}
        />
      )}
    </div>
  )
}
