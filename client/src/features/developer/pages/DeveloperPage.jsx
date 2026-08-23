import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/features/chat/store/chatStore"
import { useDeveloperStore } from "../store/developerStore"

export default function DeveloperPage() {
  const { onlineUsers } = useChatStore()
  const { isChat, setIsChat } = useDeveloperStore()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-mono text-green-400">
      {/* MATRIX FALLING CODE */}
      <MatrixBackground />

      {/* SCANLINE OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay"></div>

      {/* BACK BUTTON */}
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="absolute top-2 left-2 z-50 cursor-pointer rounded border border-green-500 bg-green-700/30 px-4 py-2 text-green-300 transition hover:bg-green-700/50"
      >
        ← Back
      </Button>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 md:px-8">
        {/* TITLE */}
        <h1 className="mb-4 animate-pulse font-bold text-3xl tracking-wider md:text-5xl">
          {">> Developer Control Panel"}
        </h1>

        <p className="mb-10 text-green-300 text-sm opacity-80 md:text-base">
          System Loaded. Monitoring Active...
        </p>

        {/* PANELS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* SYSTEM TOOLS */}
          <div className="rounded-lg border border-green-700 bg-black/50 p-5 backdrop-blur-sm transition hover:bg-black/70">
            <h2 className="mb-3 font-semibold text-lg md:text-xl">{"> System Tools"}</h2>

            <button
              onClick={() => setShowModal(true)}
              className="mt-2 w-full rounded border border-green-500 bg-green-700/30 py-2 text-green-300 transition hover:bg-green-700/50"
            >
              Show Online Users
            </button>
          </div>

          {/* enableChat */}
          <div className="rounded-lg border border-green-700 bg-black/50 p-5 backdrop-blur-sm transition hover:bg-black/70">
            <h2 className="mb-3 font-semibold text-lg md:text-xl">{">Enable Chat Feature"}</h2>

            <button
              onClick={() => setIsChat(!isChat)}
              className="mt-2 w-full rounded border border-green-500 bg-green-700/30 py-2 text-green-300 transition hover:bg-green-700/50"
            >
              {isChat ? "Disable Chat" : "Enable Chat"}
            </button>
          </div>

          {/* PERFORMANCE */}
          <div className="rounded-lg border border-green-700 bg-black/50 p-5 backdrop-blur-sm transition hover:bg-black/70">
            <h2 className="mb-3 font-semibold text-lg md:text-xl">{"> Performance"}</h2>

            <button
              className="mt-2 w-full rounded border border-green-500 bg-green-700/30 py-2 text-green-300 transition hover:bg-green-700/50"
              onClick={() => window.location.reload()}
            >
              Force App Refresh
            </button>
          </div>

          {/* DANGEROUS */}
          <div className="rounded-lg border border-green-700 bg-black/50 p-5 backdrop-blur-sm transition hover:bg-black/70 md:col-span-2">
            <h2 className="mb-3 font-semibold text-lg md:text-xl">{"> Dangerous Actions"}</h2>

            <button
              className="mt-2 w-full rounded border border-red-500 bg-red-700/30 py-2 text-red-300 transition hover:bg-red-700/50"
              onClick={() => alert("Feature not implemented yet")}
            >
              Clear All Caches
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ONLINE USERS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-green-600 bg-black p-5 shadow-lg">
            <h2 className="mb-4 text-2xl text-green-400">{"> Online Users"}</h2>

            <div className="mb-6 max-h-60 overflow-y-auto rounded border border-green-700 p-3 text-sm">
              {onlineUsers.length === 0 ? (
                <p className="text-green-300 opacity-70">No users online</p>
              ) : (
                <ul className="space-y-2">
                  {onlineUsers.map((user) => (
                    <li
                      key={user._id}
                      className="break-all border-green-700 border-b pb-1 text-green-200"
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded border border-green-500 bg-green-600/30 py-2 transition hover:bg-green-600/50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------
   MATRIX BACKGROUND COMPONENT
---------------------------- */
function MatrixBackground() {
  const columns = new Array(40).fill(0) // number of falling lines

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {columns.map((_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: <for now>
          key={i}
          className="absolute animate-matrix text-green-600 text-xs md:text-sm"
          style={{
            left: `${i * 3}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          {generateRandomCode()}
        </span>
      ))}
    </div>
  )
}

// Generates random matrix-like characters
function generateRandomCode() {
  const chars = "01█▓▒░<>[]{}#$%&&&**"
  return Array.from({ length: 30 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("")
}
