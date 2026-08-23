export const RegisterInitialFormData = {
  name: "",
  email: "",
  password: "",
}

export const LoginInitialFormData = {
  email: "",
  password: "",
}

export const ForgetPasswordFormData = {
  email: "",
}

export const ResetPasswordFormData = {
  newPassword: "",
  confirmPassword: "",
}

export const setAllFieldsNull = (formData) => {
  for (const key in formData) {
    if (Object.hasOwn(formData, key)) {
      formData[key] = ""
    }
  }
  return formData
}
