import { deleteComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment(callbacks: UseMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (deletedComment) => {
      if (callbacks.onSuccess) callbacks.onSuccess();
      if (deletedComment.root_comment_id === null) {
        queryClient.resetQueries({
          queryKey: QUERY_KEYS.comment.root(deletedComment.post_id),
        });
      } else {
        queryClient.setQueryData<Comment[]>(
          QUERY_KEYS.comment.replies(
            deletedComment.post_id,
            deletedComment.root_comment_id,
          ),
          (comments) => {
            if (!comments)
              throw new Error("댓글이 캐시 데이터에 보관되어있지 않습니다");
            return comments.filter(
              (comment) => comment.id !== deletedComment.id,
            );
          },
        );
      }
    },
    onError: (error) => {
      if (callbacks.onError) callbacks.onError(error);
    },
  });
}
