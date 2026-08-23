import { Container, H2, Loading } from "@/components"
import { useAuth } from "@/context"
import { PostGrid } from "@/shared"
import { useSavedPosts } from "@/shared/api/useQueries"

const SavedPosts = () => {
  const { auth } = useAuth()
  const { data, isLoading } = useSavedPosts(auth.isAuthenticated)
  const savedPosts = data?.savedPosts || []

  if (isLoading) return <Loading />
  return (
    <Container>
      <H2 text={"Saved Posts"} />
      <div className="w-full md:mt-7 lg:mt-5">
        <PostGrid
          posts={savedPosts}
          emptyText="You have'nt saved any post yet🗽"
          showTags={true}
          savePost={true}
        />
      </div>
    </Container>
  )
}

export default SavedPosts
