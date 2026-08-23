import { useNavigate } from "react-router-dom"
import { useMenu } from "@/context"

export default function Header() {
  const navigate = useNavigate()
  const { menu, toggleMenu } = useMenu()

  return (
    <header className="fixed top-0 z-[999] flex h-[9vh] w-full items-center justify-between px-4 sm:px-8">
      <img
        src="favicon-dark.svg"
        alt="Logo"
        className="cursor-pointer"
        width={30}
        onClick={() => navigate("/", { replace: true })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/", { replace: true })
          }
        }}
      />

      <nav className="flex w-1/2 flex-wrap items-center justify-end gap-4 sm:w-3/4 md:w-4/5 lg:w-1/2 xl:w-1/3">
        <button
          type="button"
          onClick={toggleMenu}
          //  onKeyDown={(e) => {
          //    if (e.key === "Enter" || e.key === " ") {
          //      toggleMenu();
          //    }
          //  }}
          className="cursor-pointer text-white text-xs uppercase transition-colors duration-200 hover:text-neutral-400 md:text-xs"
        >
          {menu ? "Close" : "Menu"}
        </button>
      </nav>
    </header>
  )
}
