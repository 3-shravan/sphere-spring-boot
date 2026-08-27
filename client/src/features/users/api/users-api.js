import { fetcher } from "@/lib/api/fetcher"

export const usersApi = {
  getProfile: (username) => fetcher({ endpoint: `/users/profile/${username}` }),

  getSuggestedUsers: () => fetcher({ endpoint: "/users/suggested" }),

  updateUserProfile: (formData) =>
    fetcher({ endpoint: "/users/update", method: "POST", data: formData }),

  deleteProfilePicture: () => fetcher({ endpoint: "/users/profile-picture", method: "DELETE" }),

  getFollowers: (userId, page = 0, size = 20) =>
    fetcher({ endpoint: `/users/${userId}/followers?page=${page}&size=${size}` }),

  getFollowing: (userId, page = 0, size = 20) =>
    fetcher({ endpoint: `/users/${userId}/following?page=${page}&size=${size}` }),

  getUserPosts: (userId, page = 1, limit = 10) =>
    fetcher({ endpoint: `/posts/user/${userId}?page=${page}&limit=${limit}` }),
}
