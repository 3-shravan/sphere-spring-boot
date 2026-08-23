import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function FeedDropdown({ dropdown, setDropdown }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="no-focus inline-flex max-w-fit cursor-pointer p-2 md:pt-4">
        <h2 className="flex items-end gap-1 font-Futura text-xl tracking-tighter">
          your feed
          <span className="font-Gilroy text-muted-foreground/50 text-sm">
            {dropdown === "all" ? "posts from everywhere" : dropdown}
          </span>
          <ChevronDown size={16} color="pink" />
        </h2>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="w-40 bg-card outline-hidden">
        <DropdownMenuItem className="cursor-pointer" onClick={() => setDropdown("all")}>
          All Posts
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setDropdown("following")}>
          Following
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
