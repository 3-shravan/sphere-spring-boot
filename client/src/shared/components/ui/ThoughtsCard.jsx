import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { twMerge } from "tailwind-merge"

export default function ThoughtsCard({ thought, postId, redirect = false, className = "" }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded((prev) => !prev)
  const isLong = thought?.trim().length > 300

  return (
    <div className={twMerge("px-5 pt-14 pb-4 font-Poppins text-foreground text-xs", className)}>
      {isLong ? (
        <>
          {expanded ? thought : `${thought.slice(0, 300)} `}
          <button
            onClick={redirect ? () => navigate(`/post/${postId}`) : toggleExpanded}
            className="cursor-pointer font-Poppins text-second hover:text-muted-foreground/40 hover:underline"
          >
            {expanded ? (
              <span>
                {" "}
                <ChevronUp className="inline w-3" />
                show less
              </span>
            ) : (
              <span>
                show more
                <ChevronDown className="inline w-3" />
              </span>
            )}
          </button>
        </>
      ) : (
        thought
      )}
    </div>
  )
}
