import { useCallback, useState } from "react"

export default function useForm(initialState = {}) {
  const [formData, setFormData] = useState(initialState)

  const setField = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleChange = useCallback((e) => {
    const { name, type, value, checked, files } = e.target

    let newValue = value

    if (type === "checkbox") newValue = checked
    if (type === "file") newValue = files.length > 1 ? files : files[0]

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }, [])

  // Reset to initial state
  const resetForm = useCallback(() => {
    setFormData(initialState)
  }, [initialState])

  // Clear all fields (optional helper)
  const clearForm = useCallback(() => {
    const emptyState = Object.keys(initialState).reduce((acc, key) => {
      acc[key] = ""
      return acc
    }, {})
    setFormData(emptyState)
  }, [initialState])

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
    clearForm,
    setField,
  }
}
