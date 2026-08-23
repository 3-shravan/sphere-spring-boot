import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowSvg, SignUpButtonSvg, SpinCircularTextSvg } from "@/utils/svgs"
import Gradient from "./Gradient"

export const MagnetButton = () => {
  const navigate = useNavigate()
  const btnRef = useRef(null)

  const handleMouseMove = (e) => {
    const btn = btnRef.current
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 1}px, ${y * 1}px)`
  }

  const resetPosition = () => {
    const btn = btnRef.current
    btn.style.transform = `translate(0px, 0px)`
  }

  return (
    <div className="md:place-content grid min-h-[300px] place-content-center overflow-x-clip p-4">
      <button
        ref={btnRef}
        onClick={() => navigate("/signup")}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetPosition}
        className="group relative grid h-[220px] w-[220px] place-content-center overflow-hidden rounded-full border-0 border-green-200 transition-all duration-300 ease-out"
      >
        <Gradient />
        {/* Background Hover Circle */}
        <div className="pointer-events-none absolute inset-0 z-0 scale-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover:scale-100" />
        {/* Arrow Icon*/}
        <div className="pointer-events-none absolute z-10 flex h-full w-full rotate-45 items-center justify-center">
          <ArrowSvg />
        </div>
        <SpinCircularTextSvg />
      </button>
    </div>
  )
}

export const SignUpButton = () => {
  return (
    <Link
      className="group flex h-15 cursor-pointer items-center gap-2 rounded-full bg-emerald-400 pr-4 pl-3 font-bold text-black transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white active:bg-neutral-700"
      to="/signup"
    >
      <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
        <SignUpButtonSvg />
      </span>
      <span className="font-thin">here we</span> SIGNUP
    </Link>
  )
}
