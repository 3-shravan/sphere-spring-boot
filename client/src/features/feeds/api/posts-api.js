import { fetcher } from "@/lib/api/fetcher"

export const feedApi = {
  getfeed: async ({ type = "all", page = 1, limit = 10 }) => {
    const endpoint =
      type === "following"
        ? `/posts/following?page=${page}&limit=${limit}`
        : `/posts?page=${page}&limit=${limit}`
    return await fetcher({ endpoint })
  },
}
