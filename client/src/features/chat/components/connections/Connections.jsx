import { MessageSquare } from "lucide-react"
import { Loading } from "@/components"
import { useChatConnections } from "../../hooks/useChatConnections"
import { ConnectionItem } from "./connection-item"

export default function Connections() {
  const { chats, isLoading, handleChatSelect } = useChatConnections()

  if (isLoading) return <Loading />
  if (!chats || chats?.length === 0)
    return (
      <div>
        <p className="p-4 text-center text-muted-foreground">no connections</p>
      </div>
    )

  return (
    <div className="flex flex-1 flex-col overflow-auto rounded-lg">
      <h1 className="flex items-center gap-2 px-4.5 py-4">
        <MessageSquare className="h-5 w-5 text-rose-400" />
        Chats
      </h1>
      <main>
        <div className="flex flex-col overflow-auto pb-10">
          {chats?.map((chat) => (
            <ConnectionItem key={chat._id} chat={chat} onSelect={handleChatSelect} />
          ))}
        </div>
      </main>
    </div>
  )
}
