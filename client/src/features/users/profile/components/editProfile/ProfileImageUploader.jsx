import { Trash, Upload, X } from "lucide-react"
import { ProfilePicture } from "@/components"
import { Button } from "@/components/ui/button"
import { useDeleteProfilePicture } from "../../../api/useMutations"

const ProfileImageUploader = ({
  previewImage,
  profilePicture,
  handleImageChange,
  clearProfileImage,
  username,
}) => {
  const { mutate: deleteProfilePicture, isPending } = useDeleteProfilePicture(username)
  const handleDelete = () => deleteProfilePicture()

  return (
    <div className="relative flex flex-col items-center gap-2 md:mt-4">
      <div className="overflow-hidden rounded-full border-primary">
        {previewImage && (
          <X
            className="absolute mt-2 h-4 w-4 cursor-pointer rounded bg-neutral-700 p-0.5"
            color="gray"
            onClick={() => clearProfileImage()}
          />
        )}
        <ProfilePicture profilePicture={previewImage || profilePicture} size="profile" />
      </div>

      <label className="flex cursor-pointer items-center gap-2 border bg-background p-2 font-medium text-xs shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50">
        <Upload className="h-4 w-4" />
        select new
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </label>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="flex cursor-pointer items-center gap-2 border text-third text-xs hover:bg-muted hover:text-third"
      >
        {isPending ? (
          "Removing..."
        ) : profilePicture ? (
          <span className="flex items-center gap-1">
            <Trash className="h-2 w-2" /> Remove profile picture
          </span>
        ) : (
          "No Profile Picture"
        )}
      </Button>
    </div>
  )
}

export default ProfileImageUploader
