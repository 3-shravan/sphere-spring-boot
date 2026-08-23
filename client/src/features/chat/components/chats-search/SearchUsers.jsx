import { HandleClickOutsideWrapper } from "@/components/wrappers/HandleClickOutsideWrapper"
import { useUserSearch } from "../../hooks/useUserSearch"
import { SearchUserDropdown } from "../ui/search-user-dropdown"
import { SearchBar } from "./search-bar"
import { UserItem } from "./searched-user-item"

export default function SearchUsers() {
  const { query, setQuery, users, status, isOpen, closeDropdown } = useUserSearch(300)
  return (
    <div className="relative w-full p-1.5">
      <HandleClickOutsideWrapper onClickOutside={closeDropdown}>
        <div className="relative w-full">
          <SearchBar query={query} setQuery={setQuery} />

          {query && isOpen && (
            <SearchUserDropdown>
              {status === "pending" && (
                <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                  Searching...
                </div>
              )}

              {status !== "pending" && users.length === 0 && (
                <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                  No users found
                </div>
              )}

              {status !== "pending" &&
                users.length > 0 &&
                users.map((user) => (
                  <UserItem key={user._id} user={user} closeDropdown={closeDropdown} />
                ))}
            </SearchUserDropdown>
          )}
        </div>
      </HandleClickOutsideWrapper>
    </div>
  )
}
