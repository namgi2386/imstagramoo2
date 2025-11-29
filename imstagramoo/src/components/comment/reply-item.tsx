import { Link } from "react-router";
import defaultAvatar from "@/assets/default-profile.png";
import type { NestedReplyId } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useState } from "react";
import CommentEditor from "@/components/comment/comment-editor";
import { MessageSquareText } from "lucide-react";
import CommentItemActionbutton from "@/components/comment/comment-item-action-button";
import { useCommentById } from "@/hooks/queries/use-comments-data";

export default function ReplyItem({ reply }: { reply: NestedReplyId }) {
  const session = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const {
    data: comment,
    error: fetchCommentError,
    isPending: isFetchCommentPending,
  } = useCommentById(reply.id);
  console.log("ReplyItem debug:", {
    replyId: reply.id,
    comment,
    isFetchCommentPending,
    fetchCommentError,
  });
  if (fetchCommentError) return null;
  if (!comment) return null;
  const isMine = session?.user.id === comment.author.id;

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };
  const toggleIsReply = () => {
    setIsReply(!isReply);
  };

  return (
    <div className={`ml-8 flex flex-col gap-2`}>
      <div className="flex items-start gap-4">
        <Link to={`/profile/${comment.author_id}`}>
          <div className="flex h-full flex-col">
            <img
              className={`h-8 w-8 rounded-full object-cover`}
              src={comment.author.avatar_url || defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${comment.author_id}`}>
              <div className="font-bold">{comment.author.nickname}</div>
            </Link>
            {isMine && (
              <CommentItemActionbutton
                toggleIsEditing={toggleIsEditing}
                commentId={comment.id}
              />
            )}
          </div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commetId={comment.id}
              initialContent={comment.content}
              onClose={toggleIsEditing}
            />
          ) : (
            <div>
              <span className="text-blue-500">
                @{reply.parentCommentAuthorNickname}
              </span>
              {comment.content}
            </div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-4">
              <MessageSquareText
                onClick={toggleIsReply}
                className="hover:bg-muted h-4 w-4 cursor-pointer"
              />
              <div className="bg-border h-[13px] w-0.5"></div>
              <div>{formatTimeAgo(comment.created_at)}</div>
            </div>
          </div>
          {isReply && (
            <CommentEditor
              type="REPLY"
              postId={comment.post_id}
              parentCommentId={comment.id}
              rootCommentId={comment.root_comment_id || comment.id}
              onClose={toggleIsReply}
              depth={comment.depth}
              path={comment.path}
            />
          )}
        </div>
      </div>
      {reply.children.map((r) => (
        <ReplyItem key={r.id} reply={r} />
      ))}
    </div>
  );
}
