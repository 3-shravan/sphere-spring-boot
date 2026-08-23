import { Spinner } from "@/components"
import { useDeletePost } from "@/features/posts/api"

export default function DeleteModal({ postId, onCancel }) {
  const { mutateAsync: deletePost, isPending } = useDeletePost()

  return (
    <>
      <h2 className="font-mono font-semibold text-lg">Confirm Deletion</h2>
      <p className="my-6 font-medium font-mono text-muted-foreground text-sm">
        Are you sure you want to proceed with this action? This cannot be undone.
      </p>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="cursor-pointer rounded-md bg-card px-4 py-2 text-sm transition hover:bg-accent"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          className="min-w-20 flex-center cursor-pointer rounded-md bg-third px-4 py-2 font-semibold text-black text-sm transition hover:bg-rose-600"
          onClick={async () => {
            await deletePost(postId)
            onCancel()
          }}
          disabled={isPending}
        >
          {isPending ? <Spinner size="4" /> : "Delete"}
        </button>
      </div>
    </>
  )
}
