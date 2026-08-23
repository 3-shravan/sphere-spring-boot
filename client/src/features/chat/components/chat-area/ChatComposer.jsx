import { CirclesThreePlus, PaperPlaneRight, SmileyWink } from "phosphor-react"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks"
import { cn } from "@/lib/utils"
import { useChatComposer } from "../../hooks/useChatComposer"
import { useEmojiInsert } from "../../hooks/useInsertEmoji"
import { EmojiPickerPopover } from "../ui/emoji-picker"

export function ChatComposer() {
  const IsMobile = useIsMobile()
  const { text, setText, hasText, sendMessage, handleKeyDown } = useChatComposer()

  const [showEmoji, setShowEmoji] = useState(false)
  const { textareaRef, insertEmoji } = useEmojiInsert(setText)

  return (
    <div className="sticky bottom-0 z-20 px-2 py-1">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 rounded-3xl bg-muted/50 px-4 py-2 shadow-sm">
          <ActionButton>
            <CirclesThreePlus
              onClick={() => toast.info("features will be available soon")}
              size={25}
            />
          </ActionButton>

          {!IsMobile && (
            <ActionButton onClick={() => setShowEmoji((o) => !o)}>
              <SmileyWink size={25} />
            </ActionButton>
          )}

          {showEmoji && !IsMobile && (
            <EmojiPickerPopover
              onSelect={(emoji) => {
                insertEmoji(emoji)
                setShowEmoji(false)
              }}
              onClose={() => setShowEmoji(false)}
            />
          )}

          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            variant="messages"
            rows={1}
          />

          <button
            onClick={sendMessage}
            disabled={!hasText}
            className={cn(
              "flex cursor-pointer items-center justify-center transition",
              hasText ? "text-teal-600" : "text-foreground",
            )}
          >
            <PaperPlaneRight size={25} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-foreground transition hover:bg-muted/80",
        className,
      )}
      {...props}
    />
  )
}
