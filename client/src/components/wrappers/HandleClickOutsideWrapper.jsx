import { memo, useEffect, useRef } from "react"

export const HandleClickOutsideWrapper = memo(({ onClickOutside, children }) => {
  const wrapperRef = useRef(null)
  const callbackRef = useRef(onClickOutside)

  useEffect(() => {
    callbackRef.current = onClickOutside
  }, [onClickOutside])

  useEffect(() => {
    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        callbackRef.current?.()
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return <div ref={wrapperRef}>{children}</div>
})

HandleClickOutsideWrapper.displayName = "HandleClickOutsideWrapper"
