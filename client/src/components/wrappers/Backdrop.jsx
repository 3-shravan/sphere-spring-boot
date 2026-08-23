import clsx from "clsx"
import { positionClasses } from "@/utils"

export default function Backdrop({
  fn,
  children,
  image = null,
  position = "top-left",
  alt = "Image",
}) {
  return (
    <div
      onClick={fn}
      className={clsx(
        "absolute rounded-full bg-white/20 p-1 font-medium text-neutral-800 text-sm shadow-sm backdrop-blur-md dark:bg-neutral-800/30 dark:text-neutral-100",
        positionClasses[position],
      )}
    >
      <div className="flex items-center gap-1 px-0.5">
        {image && <img src={image} alt={alt} className="h-6 w-6 rounded-full object-cover" />}
        <span className="font-Gilroy font-thin text-xs">{children}</span>
      </div>
    </div>
  )
}
