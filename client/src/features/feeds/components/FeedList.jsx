import { Spinner } from "@/components"
import { usePost } from "@/context"
import PostCard from "./postcard/PostCard"

export default function FeedList({ isFetchingNextPage, dropdown, setDropdown }) {
  const { posts } = usePost()
  if (!posts) return null
  return (
    <div className="flex w-full flex-col gap-3">
      {posts.length === 0 || !posts[0] ? (
        <PostsEmpty dropdown={dropdown} setDropdown={setDropdown} />
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
      {/* loading spinner for fetching more posts */}
      {isFetchingNextPage && (
        <div className="mb-6 flex-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}

const PostsEmpty = ({ dropdown, setDropdown }) => (
  <div className="mt-20 flex-center flex-col gap-2">
    <span className="text-sm uppercase">No posts 🗽</span>
    {dropdown === "following" && (
      <>
        <span className="text-center text-[10px] uppercase">
          Follow some people to see their posts
        </span>
        <span
          className="cursor-pointer rounded-full border bg-emerald-600 px-2.5 py-0.5 font-bold font-mono text-[10px] text-foreground uppercase tracking-wide transition-colors duration-200 hover:bg-background"
          onClick={() => setDropdown("all")}
        >
          show post from everywehere
        </span>
      </>
    )}
  </div>
)
