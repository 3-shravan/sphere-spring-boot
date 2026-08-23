import { fetcher } from "@/lib/api/fetcher"

export const postApi = {
  createPost: (formData) => fetcher({ endpoint: "/posts", method: "POST", data: formData }),

  createThought: (formData) =>
    fetcher({ endpoint: "/posts/thought", method: "POST", data: formData }),

  updatePost: (postId, formData) =>
    fetcher({ endpoint: `/posts/${postId}`, method: "PUT", data: formData }),

  deletePost: (postId) => fetcher({ endpoint: `/posts/${postId}`, method: "DELETE" }),
}
