import ReplyItem from "@/components/comment/reply-item";
import Fallback from "@/components/fallback";
import { useReplyCommentsData } from "@/hooks/queries/use-comments-data";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, NestedReply } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { CornerDownRight, Loader, LoaderCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";

function toNestedReplies(replies: Comment[]): NestedReply[] {
  const replyMap = new Map<number, NestedReply>();
  replies.forEach((reply) => {
    replyMap.set(reply.id, { ...reply, children: [] });
  });
  const result: NestedReply[] = [];
  replies.forEach((reply) => {
    const node = replyMap.get(reply.id)!;
    if (reply.depth === 1) {
      result.push(node);
    } else if (reply.parent_comment_id && reply.path) {
      const parentCommentId = replyMap.get(Number(reply.path.split(".").pop()));
      const repliedCommentId = replyMap.get(reply.parent_comment_id);
      if (parentCommentId && repliedCommentId) {
        parentCommentId.children.push({
          ...node,
          parentCommentAuthorNickname: repliedCommentId.author.nickname,
        });
      }
    }
  });
  return result;
}

export default function ReplyList({
  comment,
  isOpend,
}: {
  comment: Comment;
  isOpend: boolean;
}) {
  const queryClient = useQueryClient();
  const {
    data: replies,
    error: fetchRepliesError,
    isPending: isRepliesPending,
    fetchNextPage: fetchNextPageReply,
    hasNextPage,
    isFetchingNextPage,
  } = useReplyCommentsData({
    postId: comment.post_id,
    rootCommentId: comment.root_comment_id || comment.id,
    enabled: isOpend,
  });
  const nestedReplies = useMemo(() => {
    const allReplies = (replies?.pages.flatMap((page) => page) ?? [])
      .map((id) =>
        queryClient.getQueryData<Comment>(QUERY_KEYS.comment.byId(id)),
      )
      .filter((comment): comment is Comment => comment !== undefined);
    console.log(
      "commentId:",
      comment.id,
      ",pageNumber:",
      replies?.pages.length,
      "replies:",
      allReplies,
    );
    return toNestedReplies(allReplies);
  }, [replies, queryClient]);
  const hadleNextPageReplyClick = () => {
    if (hasNextPage) {
      fetchNextPageReply();
    }
  };
  return (
    <>
      {isRepliesPending && (
        <div className="text-muted-foreground my-6 ml-12 text-sm">
          <Loader />
        </div>
      )}
      {fetchRepliesError && (
        <div className="flex flex-col items-center justify-center text-sm">
          <Fallback />
          답글을 불러오는데 실패했습니다.
        </div>
      )}
      {replies &&
        nestedReplies.map((reply) => <ReplyItem key={reply.id} {...reply} />)}
      {hasNextPage && isOpend && (
        <>
          {isFetchingNextPage ? (
            <div className="flex justify-center">
              <LoaderCircleIcon className="text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div
              className="text-muted-foreground ml-6 flex cursor-pointer items-center gap-2 text-sm font-semibold select-none"
              onClick={hadleNextPageReplyClick}
            >
              <CornerDownRight className="h-4 w-4" />
              답글 더보기
            </div>
          )}
        </>
      )}
    </>
  );
}
