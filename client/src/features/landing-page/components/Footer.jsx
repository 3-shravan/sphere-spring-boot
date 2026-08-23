import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Footer() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <footer className="relative flex h-full w-full overflow-hidden">
      {/* Custom cursor */}
      <div
        className="pointer-events-none fixed z-999 h-8 w-8 rounded-full mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${cursorPosition.x - 16}px, ${
            cursorPosition.y - 16
          }px) scale(${isHovering ? 1.5 : 1})`,
          background: "white",
          opacity: 0.8,
        }}
      />

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-999 opacity-3 md:opacity-6"
        style={{
          backgroundImage: `url("https://www.hover.dev/black-noise.png")`,
        }}
      />

      <div className="relative z-20 flex w-full flex-col-reverse items-center justify-center gap-10 overflow-hidden px-4 py-8 md:flex-row md:items-end md:justify-between md:px-10 md:py-10">
        <div className="flex w-full flex-col items-center justify-center gap-8 p-4 md:w-1/2 md:items-start md:justify-end md:space-y-0">
          {/* Left column - Branding and CTA */}
          <div className="flex w-full flex-col items-center space-y-6 sm:w-4/5 md:w-1/2 md:items-start">
            <h2 className="text-center font-bold text-4xl text-white uppercase leading-tighter tracking-tight sm:text-5xl md:text-left md:text-7xl lg:text-8xl">
              to grow fast.
            </h2>

            <div
              className="inline-block"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Link
                to={"/signup"}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-white/30 bg-transparent px-6 py-3 font-medium transition-all sm:px-8 sm:py-3"
              >
                <span className="absolute h-full w-full bg-gradient-to-br from-violet-600 via-neutral-900 to-teal-800 opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
                <span className="relative font-[Poppins] font-bold text-4xl text-white uppercase sm:text-6xl">
                  Start <span className="text-violet-500">Fast</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section - Collaboration message and social links */}
        <div className="flex w-full flex-col items-center justify-center gap-8 p-4 md:w-1/2 md:items-end md:justify-end">
          <div className="px-4 text-center sm:px-6 md:px-10">
            <h3 className="mb-6 font-Poppins font-bold text-violet-400 text-xl uppercase leading-8 sm:text-2xl md:mb-8 md:text-3xl">
              Drop us a line or two, we are open for creative minds.
            </h3>

            <div
              className="relative inline-block"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="-inset-1 absolute animate-pulse rounded-lg bg-gradient-to-r from-violet-600 via-neutral-900 to-teal-800 opacity-75 blur-lg transition duration-1000 group-hover:bg-white group-hover:opacity-100 group-hover:duration-200"></div>

              <Link
                href="#"
                className="group relative flex items-center rounded-md border border-white/10 bg-black/90 px-4 py-3 leading-none sm:px-6 sm:py-4"
              >
                <span className="flex items-center justify-center gap-2 font-Poppins font-bold text-sm text-violet-400 uppercase sm:text-base md:text-lg">
                  <img src="/favicon.svg" alt="" className="w-4 sm:w-5" />
                  Get Sphere
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
