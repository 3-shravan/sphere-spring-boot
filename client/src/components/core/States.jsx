import { AnimatePresence, motion } from "framer-motion"

export function LoadingScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-15 w-15 animate-spin rounded-full border-rose-500 border-t-2 border-l-2"></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Spinner({ size = "6", color = "neutral-700" }) {
  return (
    <div
      className={`animate-spin rounded-full h-${size} w-${size} border-2 border-t-transparent border-${color}`}
    />
  )
}

export function Loading({ message = "", size, spinner = true, pos = "center" }) {
  return (
    <div
      className={`${pos === "center" && "h-full"} w-full flex-center gap-2 font-Futura font-bold text-sm uppercase`}
    >
      {spinner && <Spinner size={size} />}
      {message}
    </div>
  )
}

export function PageSuspenseLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center font-Futura">
      <div className="flex flex-col items-center gap-4">
        <motion.p
          className="inline animate-pulse text-neutral-500 text-sm tracking-wide"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ⚙ page is loading...
        </motion.p>
      </div>
    </div>
  )
}

export function ShowError({ message = "❗ Failed to fetch" }) {
  return <div className="py-10 text-center font-bold text-third">{message}</div>
}
