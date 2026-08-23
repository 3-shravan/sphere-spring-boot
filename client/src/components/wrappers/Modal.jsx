import { X } from "lucide-react"
import { createPortal } from "react-dom"

export default function Modal({ children, title, onCancel, darkModal = false }) {
  return createPortal(
    <div
      className={`fixed inset-0 z-[998] flex items-center justify-center backdrop-blur-xs ${darkModal ? "bg-black/90" : "bg-black/60"}`}
    >
      <div className="relative z-[999] w-[85%] rounded-xl bg-background p-4 shadow-lg md:w-[40%] md:p-6">
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="flex-1 text-center font-semibold text-foreground">{title}</h2>}
          {onCancel && (
            <X
              className="absolute top-5 right-4 cursor-pointer text-muted-foreground transition hover:text-foreground"
              size={18}
              onClick={onCancel}
            />
          )}
        </div>
        {/* Specific Modal */}
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
