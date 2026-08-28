import { useCallback, useEffect, useState } from "react"
import { Container, H2 } from "@/components"
import { HandleClickOutsideWrapper } from "@/components/wrappers/HandleClickOutsideWrapper"
import Birthdays from "@/features/birthdays/pages/Birthdays"
import { PostGrid } from "@/shared"
import SuggestedUsers from "@/features/users/pages/SuggestedUsers"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { useSemanticPosts } from "../hooks/useSemanticPosts"
import { useSearchUsers } from "../hooks/useSearchUsers"

const Explore = () => {
  const [query, setQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { users, loading } = useSearchUsers(query)
  const { posts, semanticTerms, loading: isSemanticLoading } = useSemanticPosts(query)
  useEffect(() => {
    if (query.length > 0) setIsDropdownOpen(true)
    else setIsDropdownOpen(false)
  }, [query])

  const handleClickOutside = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  return (
    <Container>
      <H2 text={"Explore"} />
      <main className="relative w-full">
        <HandleClickOutsideWrapper onClickOutside={handleClickOutside}>
          <SearchBar query={query} setQuery={setQuery} />
          <SearchResults isOpen={isDropdownOpen} users={users} loading={loading} query={query} />
        </HandleClickOutsideWrapper>

        {query.trim() && (
          <section className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-Futura text-muted-foreground text-xs uppercase">semantic matches</p>
              {semanticTerms.slice(0, 6).map((term) => (
                <span
                  key={term}
                  className="rounded-full border bg-card px-2 py-1 font-Gilroy text-[10px] text-muted-foreground"
                >
                  {term}
                </span>
              ))}
            </div>

            {isSemanticLoading ? (
              <p className="font-Poppins text-second text-xs">Searching posts by meaning...</p>
            ) : (
              <PostGrid
                posts={posts}
                emptyText="No semantic post matches yet"
                showAuthor={true}
                showCaption={true}
                showTags={true}
                savePost={true}
                likePost={true}
              />
            )}
          </section>
        )}
      </main>
      {!isDropdownOpen && (
        <div className="flex w-full flex-col gap-6 lg:hidden">
          <SuggestedUsers />
          <Birthdays />
        </div>
      )}
    </Container>
  )
}
export default Explore
