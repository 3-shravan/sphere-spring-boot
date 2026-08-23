export const NotificationToast = ({ user, parent, comment, type }) => {
  return (
    <div className="flex min-w-[250px] items-center gap-3 rounded-lg border bg-white p-2 shadow">
      <img
        src={user.profilePicture}
        alt={user.name}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{user.name}</span>
        {type === "reply" && parent && (
          <span className="text-gray-500 text-sm">replied to {parent.name}</span>
        )}
        <span className="text-gray-700 text-sm">{comment}</span>
      </div>
    </div>
  )
}
