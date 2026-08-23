export const SidebarHeader = ({ theme }) => {
  const toDeveloperPage = () => {
    window.location.href = "/developer"
  }
  return (
    <div className="mt-3 flex items-center gap-2 px-1">
      <img src={theme === "dark" ? "/favicon.svg" : "/favicon-dark.svg"} alt="logo" width={20} />
      <span onDoubleClick={toDeveloperPage} className="font-Gilroy font-bold text-lg">
        sphere
      </span>
    </div>
  )
}
