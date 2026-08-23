import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import EditProfileForm from "../components/editProfile/EditProfileForm"
import useEditProfile from "../hooks/useEditProfile"

const EditProfile = ({ user }) => {
  const {
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
  } = useEditProfile(user)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="mt-4 cursor-pointer text-foreground text-xs">
          edit profile
          <Settings2 className="inline h-3 w-3 text-third" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col border-none font-Gilroy">
        <DrawerHeader>
          <DrawerTitle>Edit Your Profile</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2 font-Poppins md:px-8">
          <EditProfileForm
            user={user}
            dob={dob}
            setDob={setDob}
            gender={gender}
            setGender={setGender}
            previewImage={previewImage}
            clearProfileImage={clearProfileImage}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            isPending={isPending}
            drawerRef={drawerRef}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default EditProfile
