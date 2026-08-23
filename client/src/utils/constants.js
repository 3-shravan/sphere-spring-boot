export const MarqueeItems = [
  "👥 Connect with Like-Minded People!",
  "🔥 Trending Now: #SocialBuzz",
  "📸 Share Your Moments Instantly!",
  "📢 Join the Conversation!",
  "🎉 New Features Released!",
  "💬 Chat in Real-Time!",
  "📍 Discover New People Nearby!",
  "🚀 Boost Your Posts Today!",
  "🎶 Explore Viral Content!",
  "💡 Get Inspired Every Day!",
]

export const positionClasses = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-center": "top-3 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-3 left-1/2 -translate-x-1/2",
}

export const sizeMap = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  base: "w-6 h-6",
  md: "w-7 h-7",
  lmd: "w-9 h-9",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
  profile: "w-50 h-50",
}

import AddCircleIcon from "@mui/icons-material/AddCircle"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import ExploreIcon from "@mui/icons-material/Explore"
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined"
import HomeIcon from "@mui/icons-material/Home"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"

export const tabs = [
  {
    key: "home",
    route: "/feeds",
    label: "Home",
    icon: HomeOutlinedIcon,
    filled: HomeIcon,
    size: 25,
  },
  {
    key: "explore",
    route: "/explore",
    label: "Explore",
    icon: ExploreOutlinedIcon,
    filled: ExploreIcon,
    size: 24,
  },
  {
    key: "messages",
    route: "/conversations",
    label: "Messages",
    icon: ChatBubbleOutlineIcon,
    filled: ChatBubbleIcon,
    size: 23,
    filledSize: 23,
  },
  {
    key: "saved",
    route: "/saved",
    label: "Saved",
    icon: BookmarkBorderIcon,
    filled: BookmarkIcon,
    size: 26,
    filledSize: 24,
  },
  {
    key: "create",
    route: "/create-post",
    label: "Create",
    icon: AddCircleOutlineIcon,
    filled: AddCircleIcon,
    size: 24,
  },
]
