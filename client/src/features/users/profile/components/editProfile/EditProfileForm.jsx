import { X } from "lucide-react"
import { CgVercel } from "react-icons/cg"
import { FaDeleteLeft } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { showInfoToast } from "@/lib/api/api-responses"
import DateOfBirth from "./DateOfBirth"
import ProfileImageUploader from "./ProfileImageUploader"
import SelectGender from "./SelectGender"

const EditProfileForm = ({
  user,
  dob,
  setDob,
  gender,
  setGender,
  previewImage,
  clearProfileImage,
  handleImageChange,
  handleSubmit,
  isPending,
  drawerRef,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-2 font-Poppins md:grid-cols-2 md:gap-3"
    >
      {/* Left Column */}
      <div className="flex flex-col items-center justify-center gap-4 md:px-8">
        <ProfileImageUploader
          previewImage={previewImage}
          clearProfileImage={clearProfileImage}
          profilePicture={user?.profilePicture}
          handleImageChange={handleImageChange}
          username={user?.name}
        />
        <div className="w-full md:w-3/4">
          <label htmlFor="name" className="update-input-label">
            Username
          </label>
          <Input name="name" defaultValue={user?.name} required />
        </div>
      </div>

      {/* Right Column */}
      <div className="mt-2 flex w-full flex-col items-center justify-start space-y-4">
        <div className="w-full md:w-3/4">
          <label htmlFor="fullName" className="update-input-label">
            Full Name
          </label>
          <Input name="fullName" defaultValue={user?.fullName} />
        </div>

        <div className="flex w-full flex-col gap-2 md:w-3/4 md:flex-row md:items-center">
          <DateOfBirth dob={dob} setDob={setDob} />
          <SelectGender gender={gender} setGender={setGender} />
        </div>

        <div className="w-full md:w-3/4">
          <label htmlFor="bio" className="update-input-label">
            Bio
          </label>
          <Textarea
            name="bio"
            defaultValue={user?.bio}
            placeholder="🗽"
            className="h-24 resize-none p-2 font-mono text-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-1 mt-2 flex justify-center font-Poppins md:col-span-2">
        <Button
          type="submit"
          disabled={isPending}
          variant="ghost"
          className="mx-auto flex w-full cursor-pointer gap-1 rounded-xl border bg-emerald-400 font-bold text-black text-xs md:w-[30%]"
        >
          <CgVercel className="h-4 w-4" />
          {isPending ? "Updating..." : "Update Profile"}
        </Button>
      </div>

      {/* Cancel Button */}
      <DrawerClose asChild>
        <div className="col-span-1 flex justify-center font-Poppins md:col-span-2">
          <Button
            type="button"
            ref={drawerRef}
            variant="outline"
            className="mx-auto w-full cursor-pointer text-xs md:w-[30%]"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </DrawerClose>
      <div className="col-span-1 flex justify-center font-Poppins md:col-span-2">
        <Button
          type="button"
          variant="destructive"
          onClick={() => showInfoToast("You will be able to delete your account soon !")}
          className="mx-auto w-full cursor-pointer rounded-xl text-xs md:w-[30%]"
        >
          <FaDeleteLeft className="h-4 w-4" />
          Delete Account
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
