import { createComment } from "@/api/comment";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import type { Comment, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment(callbacks: UseMutationCallback) {
  const queryClient = useQueryClient();
  const session = useSession();
  const { data: profile } = useProfileData(session?.user.id);
  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      if (callbacks.onSuccess) callbacks.onSuccess();
      if (newComment.root_comment_id === null) {
        queryClient.resetQueries({
          queryKey: QUERY_KEYS.comment.root(newComment.post_id),
        });
      } else {
        queryClient.resetQueries({
          queryKey: QUERY_KEYS.comment.replies(
            newComment.post_id,
            newComment.root_comment_id,
          ),
        });
      }
    },
    onError: (error) => {
      if (callbacks.onError) callbacks.onError(error);
    },
  });
}
