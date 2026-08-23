import { fetcher } from "@/lib/api/fetcher"

export const api = {
  getUsers: ({ query }) => fetcher({ endpoint: `/users?search=${query}` }),

  getSinglePost: (postId) => fetcher({ endpoint: `/posts/${postId}`, publicApi: true }),

  getSavedPosts: () => fetcher({ endpoint: `/posts/saved` }),

  likePost: (postId) => fetcher({ endpoint: `/posts/${postId}/like`, method: "PUT" }),

  savePost: (postId) => fetcher({ endpoint: `/posts/${postId}/save`, method: "PUT" }),

  followUser: (userId) => fetcher({ endpoint: `/users/${userId}/follow`, method: "PUT" }),
}
