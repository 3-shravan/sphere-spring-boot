export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
}

export const validateForm = (formData, stage) => {
  if (stage === 3) {
    if (!isValidEmail(formData.email))
      return "Please provide a valid email address."
    return null
  }
}

export const validForgetEmail = (formData) => {
  return !formData.email || !formData.email.trim() || !isValidEmail(formData.email)
}
export const validatePostForm = (formData, validateImage = true) => {
  const caption = formData.get("caption")?.trim() || ""
  const image = formData.get("image")
  const location = formData.get("location")?.trim() || ""
  const tagsRaw = formData.get("tags")?.trim() || ""

  if (caption.length > 2200) return "Caption must be less than 2200 characters."
  if (validateImage && !image) return "Please upload an image."
  if (location.length > 20) return "Location must be less than 20 characters."

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  if (tags.length > 10) return "You can only add up to 10 tags."
  if (tags.some((tag) => tag.length > 20)) return "Each tag must be less than 20 characters."

  return null
}

export const validateProfileForm = (formData) => {
  const name = formData.get("name")?.trim()
  const fullName = formData.get("fullName")?.trim()
  const bio = formData.get("bio")?.trim()

  if (name && name.length < 3) {
    return "Username must be at least 3 characters."
  }
  if (name && name.length > 20) {
    return "Username must be less than 20 characters."
  }

  if (fullName && fullName.length < 3) {
    return "Full name must be at least 3 characters."
  }
  if (fullName && fullName.length > 100) {
    return "Full name must be less than 100 characters."
  }

  if (bio && bio.length > 2200) {
    return "Bio must be less than 2200 characters."
  }

  return null
}

export const validateThoughtsForm = (thoughts) => {
  if (!thoughts.trim()) {
    return "Please enter your thoughts before posting!"
  }
  if (thoughts.length < 3) {
    return "Thoughts must be at least 3 characters."
  }
  if (thoughts.length > 2000) {
    return "Thoughts must be less than 2000 characters."
  }
  return null
}
