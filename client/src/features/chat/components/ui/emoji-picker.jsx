import EmojiPicker from "emoji-picker-react"
import { HandleClickOutsideWrapper } from "@/components/wrappers/HandleClickOutsideWrapper"

export function EmojiPickerPopover({ onSelect, onClose }) {
  return (
    <HandleClickOutsideWrapper onClickOutside={onClose}>
      <div className="absolute bottom-12 left-0 z-50">
        <EmojiPicker
          theme="auto"
          height={350}
          width={300}
          onEmojiClick={(emoji) => onSelect(emoji.emoji)}
        />
      </div>
    </HandleClickOutsideWrapper>
  )
}
