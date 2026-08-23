import { BadgePlus } from "lucide-react"
import { useState } from "react"
import { SiSparkpost } from "react-icons/si"
import { useNavigate } from "react-router-dom"
import { ImageCropper, Spinner } from "@/components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { errorToast, formatTags, validatePostForm } from "@/utils"
import { useCreatePost } from "../api/useMutations"
import { usePostFormState } from "../hooks/useFormState"

const CreatePostForm = () => {
  const navigate = useNavigate()
  const { preview, setPreview, image, fileInputRef, clearPreview, setImage } = usePostFormState()

  const { mutateAsync: createPost, isPending } = useCreatePost()

  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ""

    const reader = new FileReader()
    reader.onloadend = () => {
      setTempImage(reader.result)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropped = (croppedFile, croppedPreview) => {
    setImage(croppedFile)
    setPreview(croppedPreview)
    setTempImage(null)
    setShowCropper(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (image) formData.append("image", image)

    const tags = formData.get("tags")
    const formattedTags = formatTags(tags)
    formData.delete("tags")
    // formData.set("tags", JSON.stringify(formattedTags));
    formattedTags.forEach((tag) => {
      formData.append("tags", tag)
    })

    const error = validatePostForm(formData)
    if (error) return errorToast(error)

    const response = await createPost(formData)
    if (response?.success) {
      setTimeout(() => {
        navigate("/feeds")
      }, 500)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-6xl flex-col gap-8 font-Gilroy font-bold text-foreground text-sm"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="caption" className="pl-1">
            Caption
          </label>
          <textarea
            name="caption"
            placeholder="🗽"
            className="min-h-[160px] resize-none rounded-xl bg-input/30 p-4 focus-visible:ring-2 md:min-h-[200px]"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          {preview ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:aspect-[16/9]">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full bg-background object-contain"
              />
              <button
                type="button"
                onClick={clearPreview}
                className="absolute top-1 right-3 cursor-pointer rounded-full bg-input px-2 text-foreground text-xl shadow-md backdrop-blur-md transition hover:text-third"
              >
                &times;
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border border-dashed bg-input/30 transition hover:bg-muted/20 md:aspect-[16/9]"
              onClick={() => fileInputRef.current?.click()}
            >
              <BadgePlus className="h-10 w-10 text-second" />
              <p className="mt-2 text-muted-foreground text-sm">Click to upload image</p>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {showCropper && (
          <ImageCropper
            image={tempImage}
            // aspect={3 / 4}
            onCancel={() => setShowCropper(false)}
            onCropComplete={handleCropped}
          />
        )}
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="pl-1">
          Add Location
        </label>
        <Input
          type="text"
          name="location"
          placeholder="e.g. New York, USA"
          className="input h-12 border-0 px-4 placeholder:text-xs"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label htmlFor="tags" className="pl-1">
          Add Tags
          <span className="font-mono text-muted-foreground/50"> comma-separated</span>
        </label>
        <Input
          type="text"
          name="tags"
          placeholder="Art, Expression, Learn"
          className="input h-12 border-0 px-4 placeholder:text-xs"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-4 py-1">
        <Button
          variant="ghost"
          disabled={isPending}
          className="border"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          variant="ghost"
          className="flex min-w-28 cursor-pointer items-center justify-center rounded-xl border bg-emerald-400 font-semibold text-black/80 transition-all duration-200 disabled:cursor-progress disabled:bg-neutral-900"
        >
          {isPending ? (
            <Spinner color="emerald-400" size="5" />
          ) : (
            <span className="flex items-center gap-1">
              <SiSparkpost className="inline" /> Upload
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}

export default CreatePostForm
