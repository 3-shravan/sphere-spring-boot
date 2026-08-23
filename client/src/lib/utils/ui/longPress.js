export function longPress(callback, ms = 500) {
  let timer

  const start = () => {
    timer = setTimeout(callback, ms)
  }

  const clear = () => {
    if (timer) clearTimeout(timer)
  }

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseLeave: clear,
  }
}
