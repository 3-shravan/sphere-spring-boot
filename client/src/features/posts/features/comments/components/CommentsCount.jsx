import { MessageSquare } from "lucide-react"
export default function CommentsCount({ count, expand, onToggle }) {
  return (
    <header
      className="mb-2 flex cursor-pointer gap-2 font-Gilroy text-muted-foreground text-xs"
      onClick={onToggle}
    >
      <span className="min-w-8">
        <MessageSquare size={16} className="inline text-foreground" />
        <span className="ml-1 font-bold text-foreground">{count}</span>
      </span>
      <span className="font-bold">·</span>
      {count > 0 ? (
        <span className="px-0.5 text-muted-foreground hover:text-foreground">
          {expand ? "collapse" : "view"}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">Be the first to comment</span>
      )}
    </header>
  )
}
