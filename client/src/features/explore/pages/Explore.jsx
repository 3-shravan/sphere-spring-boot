import { useCallback, useEffect, useState } from "react"
import { Container, H2 } from "@/components"
import { HandleClickOutsideWrapper } from "@/components/wrappers/HandleClickOutsideWrapper"
import Birthdays from "@/features/birthdays/pages/Birthdays"
import SuggestedUsers from "@/features/users/pages/SuggestedUsers"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { useSearchUsers } from "../hooks/useSearchUsers"

const Explore = () => {
  const [query, setQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { users, loading } = useSearchUsers(query)
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
