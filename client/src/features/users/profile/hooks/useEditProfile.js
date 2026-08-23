import { useRef, useState } from "react"
import { errorToast, validateProfileForm } from "@/utils"
import { useUpdateProfile } from "../../api/useMutations"

const useEditProfile = (user) => {
  const [dob, setDob] = useState(user?.dob || null)
  const [gender, setGender] = useState(user?.gender || "")
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || null)
  const drawerRef = useRef(null)
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(user?.name)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const error = validateProfileForm(formData)
    if (error) return errorToast(error)

    if (dob) {
      const formattedDob = new Date(dob).toISOString().split("T")[0]
      formData.append("dob", formattedDob)
    }
    if (profileImage) formData.append("profilePicture", profileImage)

    try {
      const data = await updateProfile(formData)
      if (data?.success) drawerRef?.current?.click()
    } catch (err) {
      console.error("Profile update failed:", err)
    }
  }

  const clearProfileImage = () => {
    setProfileImage(null)
    setPreviewImage(null)
  }

  return {
    dob,
    setDob,
    gender,
    setGender,
    previewImage,
    setPreviewImage,
    clearProfileImage,
    handleImageChange,
    handleSubmit,
    isPending,
    drawerRef,
  }
}

export default useEditProfile
