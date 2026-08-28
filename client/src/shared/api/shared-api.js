import { fetcher } from "@/lib/api/fetcher";

export const api = {
  getUsers: ({ query }) => fetcher({ endpoint: `/users?search=${query}` }),

  getSinglePost: (postId) =>
    fetcher({ endpoint: `/posts/${postId}`, publicApi: true }),

  getPostLikes: (postId, page = 1, limit = 20) =>
    fetcher({
      endpoint: `/posts/${postId}/likes?page=${page}&limit=${limit}`,
      publicApi: true,
    }),

  getSavedPosts: (page = 1, limit = 10) =>
    fetcher({ endpoint: `/posts/saved?page=${page}&limit=${limit}` }),

  getSemanticPosts: (query, page = 1, limit = 12) =>
    fetcher({
      endpoint: `/posts/search/semantic?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    }),

  likePost: (postId) =>
    fetcher({ endpoint: `/posts/${postId}/like`, method: "PUT" }),

  savePost: (postId) =>
    fetcher({ endpoint: `/posts/${postId}/save`, method: "PUT" }),

  followUser: (userId) =>
    fetcher({ endpoint: `/users/${userId}/follow`, method: "PUT" }),
};
