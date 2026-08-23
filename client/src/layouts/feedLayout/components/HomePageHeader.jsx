import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { HappyBirthday, ProfilePicture } from "@/components"
import { useAuth } from "@/context"
import BirthdayHeader from "@/features/birthdays/components/HappyBirthday"

export default function HomePageHeader() {
  const { auth, isBirthday } = useAuth()
  return (
    <div className="flex-between pt-12 md:mt-1 md:py-1">
      {/* TIME  */}
      <span className="hidden px-6 font-blackout text-second text-xs tracking-widest md:block">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {/* BIRTHDAY WISHES */}
      <div className="hidden md:block">
        <BirthdayHeader />
      </div>

      {/* PROFILE */}
      <Link
        className="hidden cursor-pointer items-center rounded px-7 py-2 tracking-tight md:flex"
        to={`/profile/${auth?.profile?.name}`}
      >
        <ProfilePicture profilePicture={auth?.profile?.profilePicture} size="sm" />

        <span className="px-2 font-Poppins font-bold text-foreground text-sm">
          {auth?.profile?.name}
          <ChevronDown className="inline h-4 w-5" />
        </span>
      </Link>

      {/* Greeting  */}
      {isBirthday ? (
        <div className="px-3 md:hidden">
          <HappyBirthday />
        </div>
      ) : (
        <span className="px-2.5 font-Poppins text-foreground text-xs md:hidden">
          whats been up, <span className="text-rose-400">{auth?.profile?.name}</span>
        </span>
      )}
    </div>
  )
}
