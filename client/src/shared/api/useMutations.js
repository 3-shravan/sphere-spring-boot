import { useMutation } from "@tanstack/react-query"
import { POSTS_QUERY_KEYS, USERS_QUERY_KEY } from "@/lib/utils/global-query-keys"
import { api } from "./shared-api"

export const useGetUsers = () =>
  useMutation({
    mutationFn: ({ query }) => api.getUsers({ query }),
    meta: { showError: true },
  })

export const useToggleLikePost = (postId, { onMutate, onError } = {}) =>
  useMutation({
    mutationFn: (postId) => api.likePost(postId),
    onMutate: () => onMutate(),
    onError: () => onError(),
    meta: {
      showError: true,
      invalidateQuery: POSTS_QUERY_KEYS.detail(postId),
    },
  })

export const useToggleSavePost = ({ onMutate, onError } = {}) =>
  useMutation({
    mutationFn: (postId) => api.savePost(postId),
    onMutate: () => onMutate?.(),
    onError: () => onError?.(),
    meta: {
      showError: true,
      invalidateQuery: [POSTS_QUERY_KEYS.saved()],
    },
  })

export const useFollowUser = (name, { onMutate, onError } = {}) =>
  useMutation({
    mutationFn: (userId) => api.followUser(userId),
    onMutate: () => onMutate?.(),
    onError: () => onError?.(),
    meta: {
      showError: true,
      invalidateQuery: [USERS_QUERY_KEY.profile(name), USERS_QUERY_KEY.suggested()],
    },
  })

// export const useToggleLikePostCache = () => {
//   const queryClient = useQueryClient();
//   const { currentUserId, auth } = useAuth();

//   return useMutation({
//     mutationFn: (postId) =>
//       fetcher({ endpoint: `/posts/${postId}/like`, method: "PUT" }),

//     onMutate: async (postId) => {
//       await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
//       const prevPosts = queryClient.getQueryData(POSTS_QUERY_KEY);

//       queryClient.setQueryData(POSTS_QUERY_KEY, (old) => {
//         if (!old) return old;
//         return {
//           ...old,
//           pages: old.pages.map((page) => ({
//             ...page,
//             posts: page.posts.map((p) => {
//               if (String(p._id) !== String(postId)) return p;

//               const alreadyLiked = p.likes.some((u) => u._id === currentUserId);

//               const newLikes = alreadyLiked
//                 ? p.likes.filter((u) => u._id !== currentUserId)
//                 : [
//                     {
//                       _id: currentUserId,
//                       name: auth?.profile?.name,
//                       profilePicture: auth?.profile?.profilePicture,
//                     },
//                     ...p.likes.filter((u) => u._id !== currentUserId), // remove duplicates
//                   ];

//               return { ...p, likes: newLikes };
//             }),
//           })),
//         };
//       });
//       return { prevPosts };
//     },

//     onError: (err, postId, context) => {
//       if (context?.prevPosts) {
//         queryClient.setQueryData(POSTS_QUERY_KEY, context.prevPosts);
//       }
//      showErrorToast(err, "Error liking post");
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
//     },
//   });
// };
