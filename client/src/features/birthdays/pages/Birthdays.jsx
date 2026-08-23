import { useSmoothScroll } from "@eightmay/use-custom-lenis"
import { FaBirthdayCake } from "react-icons/fa"
import { SmoothScroll, Spinner } from "@/components"
import { useTodaysBirthdays } from "../api/useQueries"
import { TodayBirthdaysList } from "../components/TodayBirthdayList"

export default function Birthdays() {
  const { data, isLoading } = useTodaysBirthdays()

  useSmoothScroll(".scroll")

  if (isLoading)
    return (
      <div className="flex-center">
        <Spinner />
      </div>
    )

  return (
    <SmoothScroll className="scroll custom-scrollbar-hide h-40 max-h-[200px] w-full flex-col gap-2 rounded-lg border bg-card p-4 font-Poppins md:max-h-[140px] lg:flex">
      <header className="mb-4 px-3 font-Futura font-semibold text-md text-teal-600">
        <FaBirthdayCake className="inline h-4 w-4" /> Today&apos;s Birthdays
      </header>
      <TodayBirthdaysList users={data?.users} />
    </SmoothScroll>
  )
}
