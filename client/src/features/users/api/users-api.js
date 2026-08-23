import { fetcher } from "@/lib/api/fetcher"

export const usersApi = {
  getProfile: (username) => fetcher({ endpoint: `/users/profile/${username}` }),

  getSuggestedUsers: () => fetcher({ endpoint: "/users/suggested" }),

  updateUserProfile: (formData) =>
    fetcher({ endpoint: "/users/update", method: "POST", data: formData }),

  deleteProfilePicture: () => fetcher({ endpoint: "/users/profile-picture", method: "DELETE" }),
}
