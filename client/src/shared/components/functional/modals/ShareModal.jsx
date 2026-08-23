import { Forward, Link as LinkIcon, MessageCircle, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import { showErrorToast, showSuccessToast } from "@/lib/api/api-responses"
import { CLIENT_URL } from "@/lib/api/http"

export default function ShareModal({ postId }) {
  const postUrl = `${CLIENT_URL}/post/${postId}`
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      showSuccessToast("🚀 Link copied to clipboard")
    } catch {
      showErrorToast("❌ Failed to copy link")
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post",
          url: postUrl,
        })
      } catch {
        showErrorToast("❌ Failed to share")
      }
    } else {
      showErrorToast("⚡ Native share not supported on this device")
    }
  }

  const itemClasses =
    "flex items-center gap-3 p-3 rounded-lg font-Futura shadow-sm hover:shadow-md transition text-sm cursor-pointer"

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-5 text-black sm:grid-cols-2 sm:gap-4 lg:grid-cols-2">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${itemClasses} bg-green-50 hover:bg-green-100`}
      >
        <MessageCircle className="h-5 w-5 text-green-700" />
        <span>WhatsApp</span>
      </a>

      {/* Copy Link */}
      <button onClick={handleCopy} className={`${itemClasses} bg-gray-50 hover:bg-gray-100`}>
        <LinkIcon className="h-5 w-5 text-gray-700" />
        <span>Copy Link</span>
      </button>

      {/* Native Share */}
      <button
        onClick={handleNativeShare}
        className={`${itemClasses} justify-center border bg-primary/5 text-foreground hover:bg-primary/10 sm:col-span-2 lg:col-span-3`}
      >
        <Share2 className="h-5 w-5" />
        <span>More Options</span>
      </button>

      {/* View Post (internal link) */}
      <Link
        to={`/post/${postId}`}
        className={`${itemClasses} justify-center border bg-accent/5 text-foreground hover:bg-accent/40 sm:col-span-2 lg:col-span-3`}
      >
        <Forward className="h-5 w-5" />
        <span>View Post</span>
      </Link>
    </div>
  )
}
