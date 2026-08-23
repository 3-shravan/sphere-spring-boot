import { Search } from "lucide-react"

export function SearchBar({ setQuery, query }) {
  return (
    <div className="relative w-full">
      <Search className="-translate-y-1/2 absolute top-1/2 left-4 text-second" size={16} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="looking for someone ?"
        className="w-full rounded-full bg-input/40 px-10 py-3 font-Gilroy font-medium text-foreground text-sm shadow-sm transition placeholder:text-[12px] placeholder:text-foreground focus:border-0 focus:outline-none focus:ring-1 focus:ring-first"
      />
    </div>
  )
}
