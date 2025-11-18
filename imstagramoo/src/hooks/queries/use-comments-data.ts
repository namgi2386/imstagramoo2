import { fetchReplyComments, fetchRootComments } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment } from "@/types";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useRootCommentsData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.root(postId),
    queryFn: () => fetchRootComments(postId),
  });
}

const PAGE_SIZE = 5;

export function useReplyCommentsData({
  postId,
  rootCommentId,
  enabled = true,
}: {
  postId: number;
  rootCommentId: number;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.comment.replies(postId, rootCommentId),
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const replies = await fetchReplyComments({
        postId,
        rootCommentId,
        from,
        to,
      });
      replies.forEach((reply) => {
        queryClient.setQueryData(QUERY_KEYS.comment.byId(reply.id), reply);
      });
      return replies.map((reply) => reply.id);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled,
  });
}

export function useCommentById(commentId: number) {
  return useQuery<Comment>({
    queryKey: QUERY_KEYS.comment.byId(commentId),
    queryFn: () => {
      throw new Error("Comment should be populated from cache");
    },
  });
}
