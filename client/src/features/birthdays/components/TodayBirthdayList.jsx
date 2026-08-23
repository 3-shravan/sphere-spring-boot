import { BirthdayListItem } from "./BirthdayListItem"

export const TodayBirthdaysList = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <p className="px-3.5 font-Poppins font-semibold text-foreground text-xs">
        No birthdays today.
      </p>
    )
  }
  return (
    <ul className="flex flex-col gap-2 px-2">
      {users.map((user) => (
        <BirthdayListItem key={user._id} user={user} />
      ))}
    </ul>
  )
}
