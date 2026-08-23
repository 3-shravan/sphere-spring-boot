import { useRef } from "react"

export function useEmojiInsert(setText) {
  const textareaRef = useRef(null)

  function insertEmoji(emoji) {
    const el = textareaRef.current
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd

    setText((prev) => prev.slice(0, start) + emoji + prev.slice(end))

    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length
      el.focus()
    })
  }

  return { textareaRef, insertEmoji }
}
