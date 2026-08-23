import { useRef, useState } from "react"
export const usePostFormState = () => {
  const [preview, setPreview] = useState(null)
  const [image, setImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setImage(null)
  }

  return {
    preview,
    setPreview,
    image,
    setImage,
    fileInputRef,
    handleImageChange,
    clearPreview,
  }
}
