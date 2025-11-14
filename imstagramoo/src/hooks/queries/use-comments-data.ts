import { fetchReplyComments, fetchRootComments } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useRootCommentsData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.root(postId),
    queryFn: () => fetchRootComments(postId),
  });
}

export function useReplyCommentsData({
  postId,
  rootCommentId,
}: {
  postId: number;
  rootCommentId: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.replies(postId, rootCommentId),
    queryFn: () =>
      fetchReplyComments({
        postId,
        rootCommentId,
      }),
  });
}
