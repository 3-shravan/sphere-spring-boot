import Birthdays from "@/features/birthdays/pages/Birthdays"
import Feed from "@/features/feeds/pages/Feed"
import Thoughts from "@/features/posts/components/Thoughts"
import SuggestedUsers from "@/features/users/pages/SuggestedUsers"
import { useSavedPosts } from "@/shared/api/useQueries"
import { HomePageHeader } from "../components"

export default function HomePage() {
  useSavedPosts()

  return (
    <div className="home-page">
      <HomePageHeader />
      <main className="md:flex md:justify-center">
        <Feed />
        <section className="home-page-section">
          <Thoughts />
          <SuggestedUsers />
          <Birthdays />
        </section>
      </main>
    </div>
  )
}
