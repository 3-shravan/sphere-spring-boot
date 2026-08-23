import { useMutation } from "@tanstack/react-query"
import { USERS_QUERY_KEY } from "@/lib/utils/global-query-keys"
import { usersApi } from "./users-api"

export const useUpdateProfile = (username) =>
  useMutation({
    mutationFn: (formData) => usersApi.updateUserProfile(formData),
    meta: {
      showSuccess: true,
      showError: true,
      invalidateQuery: [USERS_QUERY_KEY.profile(username)],
    },
  })

export const useDeleteProfilePicture = (username) =>
  useMutation({
    mutationFn: () => usersApi.deleteProfilePicture(),
    meta: {
      showSuccess: true,
      showError: true,
      invalidateQuery: [USERS_QUERY_KEY.profile(username)],
    },
  })
