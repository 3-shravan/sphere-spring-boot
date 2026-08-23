import { useParams } from "react-router-dom"
import { Container, Loading } from "@/components"
import { useAuth } from "@/context"
import { PostGrid } from "@/shared"
import { useGetProfile } from "../../api/useQueries"
import { ProfileCard } from "../components/ProfileCard"

export default function Profile() {
  const { username } = useParams()
  const { currentUserId } = useAuth()
  const { data: profile, isLoading } = useGetProfile(username)

  const user = profile?.user
  const me = user?._id === currentUserId
  const posts = profile?.user?.posts

  if (isLoading) return <Loading />
  if (!user) return null

  return (
    <Container>
      <ProfileCard user={user} />
      <div className="w-full px-0.5 text-left font-Futura text-neutral-600">
        <span className="border-border border-b-2 py-1">
          {me ? "your" : "there"} posts{" "}
          <span className="font-blackout text-second">{posts?.length}</span>
        </span>
      </div>
      <PostGrid posts={posts} likePost={true} />
    </Container>
  )
}
