import { Link } from "react-router";
import defaultAvatar from "@/assets/default-profile.png";
import type { Comment, NestedReply } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useState } from "react";
import CommentEditor from "@/components/comment/comment-editor";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert-modal";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { useReplyCommentsData } from "@/hooks/queries/use-comments-data";
import Loader from "@/components/loader";
import Fallback from "@/components/fallback";

function isNestedReply(comment: Comment | NestedReply): comment is NestedReply {
  return "children" in comment;
}

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

export default function CommentItem(props: Comment | NestedReply) {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();

  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isRepliesOpened, setIsRepliesOpened] = useState(false); // 추가

  const { mutate: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment({
      onError: () => {
        toast.error("댓글 삭제에 문제가 생겼습니다.", {
          position: "top-center",
        });
      },
    });

  const {
    data: replies,
    error: fetchRepliesError,
    isPending: isRepliesPending,
  } = useReplyCommentsData({
    postId: props.post_id,
    rootCommentId: props.root_comment_id || props.id,
    enabled: isRepliesOpened,
  });

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };
  const toggleIsReply = () => {
    setIsReply(!isReply);
    setIsRepliesOpened(true);
  };
  const toggleIsRepliesOpened = () => {
    setIsRepliesOpened(!isRepliesOpened);
  };

  const handleDeleteClick = () => {
    openAlertModal({
      title: "댓글삭제",
      description: "되돌릴 수 없습니다.",
      onPositive: () => {
        deleteComment(props.id);
      },
    });
  };
  const isMine = session?.user.id === props.author.id;
  const isRootComment = !isNestedReply(props);
  return (
    <div
      className={`flex flex-col gap-2 ${isRootComment ? "border-b" : "ml-8"} pb-5`}
    >
      <div className="flex items-start gap-4">
        <Link to={"#"}>
          <div className="flex h-full flex-col">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={props.author.avatar_url || defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">{props.author.nickname}</div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commetId={props.id}
              initialContent={props.content}
              onClose={toggleIsEditing}
            />
          ) : (
            <div>
              {!isRootComment && props.parentCommentAuthorNickname && (
                <span className="font-bold text-blue-500">
                  @{props.parentCommentAuthorNickname}
                </span>
              )}
              {props.content}
            </div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-4">
              <MessageSquareText
                onClick={toggleIsReply}
                className="hover:bg-muted h-4 w-4 cursor-pointer"
              />
              <div className="bg-border h-[13px] w-0.5"></div>
              <div>{formatTimeAgo(props.created_at)}</div>
            </div>
            <div className="flex items-center gap-2">
              {isMine && (
                <div
                  className={`${isDeleteCommentPending ? "hidden" : ""} flex items-center justify-center gap-2`}
                >
                  <div
                    onClick={toggleIsEditing}
                    className="cursor-pointer hover:underline"
                  >
                    수정
                  </div>
                  <div className="bg-border h-[13px] w-0.5"></div>
                  <div
                    onClick={handleDeleteClick}
                    className="cursor-pointer hover:underline"
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {isRootComment && (
              <Button
                onClick={toggleIsRepliesOpened}
                variant={"outline"}
                className="cursor-pointer px-1"
              >
                답글 {props.reply_count}개 {">"}
              </Button>
            )}
          </div>
          {isReply && (
            <CommentEditor
              type="REPLY"
              postId={props.post_id}
              parentCommentId={props.id}
              rootCommentId={props.root_comment_id || props.id}
              onClose={toggleIsReply}
              depth={props.depth}
              path={props.path}
            />
          )}
        </div>
      </div>
      {isRepliesOpened && isRootComment && (
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
            toNestedReplies(replies).map((reply) => (
              <CommentItem key={reply.id} {...reply} />
            ))}
        </>
      )}
      {!isRootComment &&
        props.children.map((reply) => (
          <CommentItem key={reply.id} {...reply} />
        ))}
    </div>
  );
}
