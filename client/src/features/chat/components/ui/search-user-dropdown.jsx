import { ScrollArea } from "@/components/ui/scroll-area"

export function SearchUserDropdown({ children }) {
  return (
    <div className="fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-2 w-full animate-in rounded border border-border bg-background shadow-lg">
      <ScrollArea className="custom-scrollbar-hide max-h-72 w-full overflow-y-auto">
        {children}
      </ScrollArea>
    </div>
  )
}
