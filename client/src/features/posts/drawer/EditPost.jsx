import { X } from "lucide-react"
import { CgVercel } from "react-icons/cg"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePostFromCache } from "@/shared"
import { errorToast, formatTags, stringifyTags, validatePostForm } from "@/utils"
import { useUpdatePost } from "../api"

const EditPost = ({ open, setOpen, postId }) => {
  const post = usePostFromCache(postId)
  const { mutateAsync: updatePost, isPending } = useUpdatePost(post?._id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const tags = formData.get("tags")
    const formattedTags = formatTags(tags)
    formData.delete("tags")
    // formData.set("tags", JSON.stringify(formattedTags));
    formattedTags.forEach((tag) => {
      formData.append("tags", tag)
    })

    const errors = validatePostForm(formData, false)
    if (errors) return errorToast(errors)

    const data = await updatePost(formData)
    if (data?.success) setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col border-none font-Gilroy">
        <DrawerHeader>
          <DrawerTitle>Edit Your Post</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className="grid grid-cols-1 gap-6 overflow-y-auto px-6 py-4 font-Gilroy md:grid-cols-3 md:px-8">
          <div className="mx-auto flex items-center justify-center rounded-3xl bg-card p-2 md:col-span-1 md:max-h-[60vh] md:p-3 lg:max-h-[80vh]">
            <img
              src={post?.media}
              alt="post"
              className="w-full max-w-[44vh] rounded-3xl object-cover"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-center justify-center gap-2 md:col-span-2"
          >
            {/* Caption */}
            <div className="w-full md:w-3/4">
              <label htmlFor="caption" className="update-input-label">
                Caption
              </label>
              <Textarea
                name="caption"
                defaultValue={post?.caption}
                placeholder="🗽"
                className="input h-24 resize-none text-sm"
              />
            </div>

            {/* Location */}
            <div className="w-full md:w-3/4">
              <label htmlFor="location" className="update-input-label">
                Location
              </label>
              <Input
                name="location"
                placeholder="e.g. Paris, France"
                defaultValue={post?.location}
                className="input w-1/2 text-xs"
              />
            </div>

            {/* Tags */}
            <div className="w-full md:w-3/4">
              <label htmlFor="tags" className="update-input-label">
                Tags
              </label>
              <Input
                name="tags"
                defaultValue={stringifyTags(post?.tags)}
                placeholder="e.g. Nature, Peaceful"
                className="input w-1/2 text-xs"
              />
            </div>

            {/* Buttons */}
            <div className="mt-5 flex w-full flex-col gap-2 font-Poppins md:w-3/4">
              <Button
                type="submit"
                disabled={isPending}
                variant="ghost"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border bg-emerald-400 font-bold text-black text-xs"
              >
                <CgVercel className="h-4 w-4" />
                {isPending ? "Updating..." : "Update Post"}
              </Button>

              <DrawerClose asChild>
                <Button type="button" variant="outline" className="w-full cursor-pointer text-xs">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default EditPost
