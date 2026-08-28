import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks";
import { POSTS_QUERY_KEYS } from "@/lib/utils/global-query-keys";
import { api } from "@/shared/api/shared-api";

export const useSemanticPosts = (query) => {
  const debouncedQuery = useDebounce(query, 500);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: POSTS_QUERY_KEYS.semanticSearch(debouncedQuery),
    queryFn: () => api.getSemanticPosts(debouncedQuery),
    enabled: !!debouncedQuery?.trim(),
    meta: { showError: true },
  });

  return {
    posts: data?.posts || [],
    semanticTerms: data?.semanticTerms || [],
    loading: isLoading || isFetching,
  };
};
