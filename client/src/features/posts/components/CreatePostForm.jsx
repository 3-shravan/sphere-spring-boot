import { BadgePlus, Sparkles, X } from "lucide-react"
import { useState } from "react"
import { SiSparkpost } from "react-icons/si"
import { useNavigate } from "react-router-dom"
import { ImageCropper, Spinner } from "@/components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { errorToast, formatTags, validatePostForm } from "@/utils"
import { useCreatePost } from "../api/useMutations"
import { useGenerateCaption } from "../api/useGenerateCaption"
import { useGenerateTags } from "../api/useGenerateTags"
import { usePostFormState } from "../hooks/useFormState"

const CreatePostForm = () => {
  const navigate = useNavigate()
  const { preview, setPreview, image, fileInputRef, clearPreview, setImage } = usePostFormState()

  const { mutateAsync: createPost, isPending } = useCreatePost()
  const { generateCaption, isGenerating } = useGenerateCaption()
  const { generateTags, isGeneratingTags } = useGenerateTags()

  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput("")
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      e.preventDefault()
      const newTags = [...tags]
      newTags.pop()
      setTags(newTags)
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

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

  const handleGenerateCaption = async () => {
    if (!image) return
    const generated = await generateCaption(image)
    if (generated) setCaption(generated)
  }

  const handleGenerateTags = async () => {
    if (!image) return
    const generated = await generateTags(image)
    if (!generated?.length) return
    setTags((prev) => [...new Set([...prev, ...generated])])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (image) formData.append("image", image)

    // Use controlled caption value (may have been AI-generated)
    formData.set("caption", caption)
    formData.set("tags", tags.join(","))

    const rawTags = formData.get("tags")
    const formattedTags = formatTags(rawTags)
    formData.delete("tags")
    formData.set("tags", JSON.stringify(formattedTags));

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
      className="flex w-full max-w-6xl flex-col gap-6 font-Gilroy font-bold text-foreground text-sm"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between pl-1">
            <label htmlFor="caption" className="font-semibold text-base text-foreground/90">Caption</label>
            {/* AI Caption Button — visible only when an image is selected */}
            {image && (
              <button
                type="button"
                onClick={handleGenerateCaption}
                disabled={isGenerating}
                className="flex items-center gap-1.5 rounded-lg border border-violet-500/50 bg-violet-500/10 px-3 py-1 text-violet-400 text-xs transition hover:bg-violet-500/20 disabled:cursor-progress disabled:opacity-60"
                title="Generate caption with AI"
              >
                {isGenerating ? (
                  <Spinner color="violet-400" size="3" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {isGenerating ? "Generating…" : "AI Caption"}
              </button>
            )}
          </div>
          <textarea
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={image ? "✨ Click AI Caption to automatically generate, or write your own..." : "What's on your mind? 💭"}
            className="min-h-[160px] w-full resize-none rounded-xl bg-input/40 p-4 font-medium outline-none border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all focus:bg-input/50 md:min-h-[200px]"
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
                onClick={() => { clearPreview(); setCaption("") }}
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
            onCancel={() => setShowCropper(false)}
            onCropComplete={handleCropped}
          />
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pl-1">
          <label htmlFor="tags" className="font-semibold text-base text-foreground/90">
            Tags
            <span className="font-Gilroy text-muted-foreground/50 tracking-tight ml-2 text-xs font-normal flex items-center inline-flex">
              press <kbd className="mx-1 rounded bg-input/60 border border-border/50 px-1.5 py-0.5 font-sans text-[10px] font-medium uppercase shadow-sm">Enter ↵</kbd> to add
            </span>
          </label>
          {image && (
            <button
              type="button"
              onClick={handleGenerateTags}
              disabled={isGeneratingTags}
              className="flex items-center gap-1.5 rounded-lg border border-violet-500/50 bg-violet-500/10 px-3 py-1 text-violet-400 text-xs transition hover:bg-violet-500/20 disabled:cursor-progress disabled:opacity-60"
              title="Generate tags with AI"
            >
              {isGeneratingTags ? (
                <Spinner color="violet-400" size="3" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              {isGeneratingTags ? "Generating…" : "AI Tags"}
            </button>
          )}
        </div>
        <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl bg-input/40 px-4 py-2 outline-none border-0 ring-0 transition-all focus-within:bg-input/50">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 flex items-center justify-center rounded-full transition hover:bg-violet-500/30"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "e.g., photography, nature, art" : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none px-2 font-medium text-xs placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="pl-1 font-semibold text-base text-foreground/90">
          Location
        </label>
        <input
          type="text"
          name="location"
          placeholder="Where was this? (e.g., Tokyo, Japan)"
          className="h-[52px] w-full rounded-xl bg-input/40 px-4 text-xs font-medium outline-none border-none ring-0 focus:ring-0 focus:border-none transition-all focus:bg-input/50 placeholder:text-muted-foreground/60"
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
              <SiSparkpost className="inline" /> Post
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}

export default CreatePostForm

