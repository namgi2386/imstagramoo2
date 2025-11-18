import { Link } from "react-router";
import defaultAvatar from "@/assets/default-profile.png";
import type { NestedReply } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useState } from "react";
import CommentEditor from "@/components/comment/comment-editor";
import { MessageSquareText } from "lucide-react";
import CommentItemActionbutton from "@/components/comment/comment-item-action-button";

export default function ReplyItem(props: NestedReply) {
  const session = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const isMine = session?.user.id === props.author.id;

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };
  const toggleIsReply = () => {
    setIsReply(!isReply);
  };

  return (
    <div className={`ml-8 flex flex-col gap-2`}>
      <div className="flex items-start gap-4">
        <Link to={`/profile/${props.author_id}`}>
          <div className="flex h-full flex-col">
            <img
              className={`h-8 w-8 rounded-full object-cover`}
              src={props.author.avatar_url || defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${props.author_id}`}>
              <div className="font-bold">{props.author.nickname}</div>
            </Link>
            {isMine && (
              <CommentItemActionbutton
                toggleIsEditing={toggleIsEditing}
                commentId={props.id}
              />
            )}
          </div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commetId={props.id}
              initialContent={props.content}
              onClose={toggleIsEditing}
            />
          ) : (
            <div>
              <span className="text-blue-500">
                @{props.parentCommentAuthorNickname}
              </span>
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
      {props.children.map((reply) => (
        <ReplyItem key={reply.id} {...reply} />
      ))}
    </div>
  );
}
