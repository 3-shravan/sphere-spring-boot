import { clsx } from "clsx"
import { Heart, MessageSquare, Send } from "lucide-react"

export const Notificaton = () => {
  return (
    <div className="md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex w-full flex-col items-center justify-center gap-2 md:absolute md:top-30 md:left-1/2 md:transform">
      <div
        className="flex items-center gap-2 border border-border px-2 py-1.5 backdrop-blur-lg"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg?auto=compress&cs=tinysrgb&w=600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <img
            src="https://images.unsplash.com/photo-1542458579-bc6f69b5ce6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBvcnRyYWl0JTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D"
            alt="Profile"
            className="h-full w-full rounded-full border border-blue-100 object-cover"
          />
        </div>
        <p className="text-white text-xs uppercase">Damon you a got new message.</p>
      </div>
    </div>
  )
}

export const Connect = () => {
  return (
    <GlassCard className="rounded-4xl px-5 py-3 md:absolute md:bottom-60.5 md:left-25">
      <h2 className="font-bold text-sm text-white uppercase">Connect</h2>
      <div className="flex justify-center gap-4 py-4">
        <div className="h-40 w-40 overflow-hidden rounded-4xl md:h-12 md:w-30">
          <img
            src="https://images.pexels.com/photos/4310726/pexels-photo-4310726.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Profile"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <ProfileImg
          src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600"
          className="h-40 w-40 md:h-12 md:w-12"
        />
      </div>
      <button className="flex w-full items-center justify-center gap-1 rounded-full border border-border bg-emerald-200 py-2 font-bold text-emerald-700 text-xs">
        Send message <Send className="h-3 w-3" />
      </button>
    </GlassCard>
  )
}

export const Post = () => {
  return (
    <GlassCard className="md:absolute md:bottom-0 md:left-26 md:min-w-64">
      <div className="w-full overflow-hidden rounded-2xl md:h-45">
        <img
          src="https://images.pexels.com/photos/1572878/pexels-photo-1572878.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Profile"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex items-center justify-between px-2 py-2">
        <p className="text-end font-[Gilroy] text-white text-xs">ALICE</p>
        <Stats icon={MessageSquare} count="1.2k" iconColor="text-blue-700" />
        <Stats icon={Heart} count="2 MILLION" iconColor="text-red-500" />
      </div>
    </GlassCard>
  )
}

export const Nearby = () => {
  const images = [
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/157661/young-woman-shooting-model-157661.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/906052/pexels-photo-906052.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=600",
  ]
  return (
    <GlassCard className="z-20 mt-3 p-3 text-xs md:absolute md:top-25 md:right-20 md:w-64 md:text-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-white uppercase">Near you</h2>
        <button className="text-white">&gt;</button>
      </div>
      <p className="mb-4 font-[Poppins] text-neutral-400 text-xs">
        Find a match in the neighborhood
      </p>
      <div className="relative flex items-center justify-center rounded-full border border-border bg-red-300 p-2">
        {images.map((src, index) => (
          <ProfileImg key={index} src={src} className="h-12 w-12 border-2 border-white" />
        ))}
      </div>
    </GlassCard>
  )
}

export const UnreadMessage = () => {
  return (
    <GlassCard className="p-4 md:absolute md:top-12 md:left-50 md:block md:p-3">
      <h2 className="mb-3 font-bold text-sm text-white uppercase">Unread</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <ProfileImg
            src="https://images.pexels.com/photos/6507483/pexels-photo-6507483.jpeg?auto=compress&cs=tinysrgb&w=600"
            className="h-10 w-10"
          />
          <div className="flex-1">
            <p className="font-medium text-sm text-white">Davis Dean</p>
            <p className="w-35 truncate text-[10px] text-neutral-400">Has anyone seen my cat?</p>
          </div>
          <span className="text-[10px] text-neutral-400">11:11</span>
        </div>
      </div>
    </GlassCard>
  )
}

export const Chats = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return (
    <GlassCard className="hidden px-3 py-2 pb-3 md:absolute md:right-30 md:bottom-25 md:block md:w-80">
      <div className="flex items-center gap-2 pb-2">
        <ProfileImg
          src="https://images.pexels.com/photos/157661/young-woman-shooting-model-157661.jpeg?auto=compress&cs=tinysrgb&w=600"
          className="h-10 w-10"
        />
        <p className="font-medium text-white">Violet Baker</p>
      </div>
      <div className="space-y-2">
        <MessageBubble>
          <p className="font-semibold text-neutral-400 text-xs">Hi! What&apos;s plan for today?</p>
          <p className="text-right text-[10px]">11:11</p>
        </MessageBubble>
        <div className="flex justify-end">
          <MessageBubble isOwn={true} className="flex items-end gap-1">
            <p className="p-1 font-semibold text-rose-700 text-xs">
              its {daysOfWeek[new Date().getDay()]}..lets
            </p>
            <Send className="my-1 h-5 w-6 rounded-full bg-neutral-800 p-1 text-rose-800" />
          </MessageBubble>
        </div>
      </div>
    </GlassCard>
  )
}

/**
 * @Helper_Functions
 * GlassCard - Main container component
 * Profile Image component
 * Notification Badge component
 * Icon Button component
 * Message Bubble component
 * Stats component
 */

// Glass Card - Main container component
const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={clsx(
        "my-10 w-full rounded-3xl border-2 border-border bg-black/40 font-Poppins backdrop-blur-md md:w-auto",
        className,
      )}
    >
      {children}
    </div>
  )
}

// Profile Image component
const ProfileImg = ({ src, alt = "Profile", className = "" }) => {
  return (
    <div className={clsx("overflow-hidden rounded-full", className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}

// Notification Badge component
// const NotificationBadge = ({ children, className = "" }) => {
//   return (
//     <div
//       className={clsx(
//         "flex items-center gap-2 border border-violet-200 backdrop-blur-lg rounded-full py-2 px-2.5",
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// };

// Icon Button component
// const IconBtn = ({
//   icon: Icon,
//   className = "",
//   iconClassName = "",
//   ...props
// }) => {
//   return (
//     <button
//       className={clsx(
//         "w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-green-200",
//         className
//       )}
//       {...props}
//     >
//       <Icon className={clsx("w-5 h-5 text-white", iconClassName)} />
//     </button>
//   );
// };

// Message Bubble component
const MessageBubble = ({ children, isOwn = false, className = "" }) => {
  return (
    <div
      className={clsx(
        "max-w-[70%] rounded-2xl p-1.5",
        isOwn
          ? "border-1 border-border bg-rose-200 p-2 backdrop-blur-md"
          : "border border-border backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  )
}

// Stats component
const Stats = ({
  icon: Icon,
  count,
  iconColor = "text-white",
  className = "",
  iconClassName = "",
  countClassName = "",
}) => {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md">
        <Icon className={clsx("h-4 w-4", iconColor, iconClassName)} />
      </div>
      <p className={clsx("text-white text-xs", countClassName)}>{count}</p>
    </div>
  )
}
