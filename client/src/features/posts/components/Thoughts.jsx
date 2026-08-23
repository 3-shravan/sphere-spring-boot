import { memo, useCallback, useState } from "react"
import { BiSend } from "react-icons/bi"
import { Button } from "@/components/ui/button"
import { infoToast, validateThoughtsForm } from "@/utils"
import { useCreateThought } from "../api/useMutations"

const Thoughts = memo(() => {
  const [thoughts, setThoughts] = useState("")
  const { mutateAsync, isPending } = useCreateThought()

  const submitHandler = useCallback(() => {
    const errors = validateThoughtsForm(thoughts)
    if (errors) return infoToast(errors)

    mutateAsync({ thoughts })
    setThoughts("")
  }, [thoughts, mutateAsync])

  return (
    <div className="w-full rounded-2xl p-3 font-Poppins">
      <textarea
        className="h-18 w-full resize-none rounded-2xl bg-card p-4 font-bold text-xs outline-hidden placeholder:font-Futura placeholder:text-neutral-600/80 focus-visible:ring-1 focus-visible:ring-emerald-400 dark:placeholder:text-muted-foreground/50"
        placeholder="have thoughts 🗽"
        onChange={(e) => setThoughts(e.target.value)}
        value={thoughts}
      />

      <Button
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border bg-emerald-500 py-2 font-Futura text-black text-xs transition duration-300 hover:scale-[1.01]"
        type="submit"
        variant="ghost"
        onClick={submitHandler}
        disabled={isPending}
      >
        {isPending ? "Posting..." : "Post"}
        <BiSend className="h-4 w-4" />
      </Button>
    </div>
  )
})

Thoughts.displayName = "Thoughts"

export default Thoughts
