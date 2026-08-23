import { cn } from "@/lib/utils"

function Textarea({ className, variant = "default", ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40",
        variant === "outlined" && "border-2 border-gray-500",
        variant === "filled" && "bg-gray-200 dark:bg-gray-700",
        variant === "messages" &&
          "bg focuc-visible:hidden max-h-20 flex-1 resize-none rounded-lg border-0 px-4 font-Gilroy font-medium text-foreground text-sm leading-5 shadow-none placeholder:text-muted-foreground",
        variant === "reply" &&
          "custom-scrollbar-hide h-10 flex-1 resize-none rounded-full px-3 py-1 font-Gilroy font-bold placeholder:font-light md:text-xs",

        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
