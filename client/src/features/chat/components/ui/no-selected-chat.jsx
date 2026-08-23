import { MessageCircle } from "lucide-react"

export function NoSelectedChat() {
  return (
    <div className="fade-in slide-in-from-bottom-4 hidden h-full w-full animate-in flex-col items-center justify-center text-muted-foreground duration-300 md:flex">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/40 shadow-inner">
        <MessageCircle className="h-10 w-10 opacity-70" />
      </div>

      <h2 className="mt-4 font-semibold text-lg">No chat selected</h2>
      <p className="text-sm opacity-70">Choose a conversation to start messaging</p>
    </div>
  )
}
