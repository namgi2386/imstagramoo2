import { Link } from "react-router";
import defaultAvatar from "@/assets/default-profile.png";
import type { Comment, NestedReply } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useMemo, useState } from "react";
import CommentEditor from "@/components/comment/comment-editor";
import {
  ChevronRight,
  ChevronUp,
  CornerDownRight,
  LoaderCircleIcon,
  MessageSquareText,
} from "lucide-react";
import { useReplyCommentsData } from "@/hooks/queries/use-comments-data";
import Loader from "@/components/loader";
import Fallback from "@/components/fallback";
import CommentItemActionbutton from "@/components/comment/comment-item-action-button";

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

  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isRepliesOpened, setIsRepliesOpened] = useState(false);

  const isMine = session?.user.id === props.author.id;
  const isRootComment = !isNestedReply(props);

  const {
    data: replies,
    error: fetchRepliesError,
    isPending: isRepliesPending,
    fetchNextPage: fetchNextPageReply,
    hasNextPage,
    isFetchingNextPage,
  } = useReplyCommentsData({
    postId: props.post_id,
    rootCommentId: props.root_comment_id || props.id,
    enabled: isRepliesOpened,
  });

  const allReplies = useMemo(
    () => replies?.pages.flatMap((page) => page) ?? [],
    [replies],
  );
  const nestedReplies = useMemo(
    () => toNestedReplies(allReplies),
    [allReplies],
  );
  const hadleNextPageReplyClick = () => {
    if (hasNextPage) {
      fetchNextPageReply();
    }
  };

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

  return (
    <div
      className={`flex flex-col gap-2 ${isRootComment ? "border-b pb-4" : "ml-8"} `}
    >
      <div className="flex items-start gap-4">
        <Link to={`/profile/${props.author_id}`}>
          <div className="flex h-full flex-col">
            <img
              className={`${isRootComment ? "h-10 w-10" : "h-8 w-8"} rounded-full object-cover`}
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
              {!isRootComment && props.parentCommentAuthorNickname && (
                <span className="text-blue-500">
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
          </div>
          <div>
            {isRootComment && props.reply_count > 0 && (
              <div
                onClick={toggleIsRepliesOpened}
                className="text-muted-foreground text-md flex cursor-pointer items-center font-semibold select-none"
              >
                {isRepliesOpened ? (
                  <>
                    <p>답글</p>
                    <ChevronUp />
                  </>
                ) : (
                  <>
                    <p>답글 {props.reply_count}개</p>
                    <ChevronRight />
                  </>
                )}
              </div>
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
            nestedReplies.map((reply) => (
              <CommentItem key={reply.id} {...reply} />
            ))}
        </>
      )}
      {!isRootComment &&
        props.children.map((reply) => (
          <CommentItem key={reply.id} {...reply} />
        ))}

      {isRootComment && hasNextPage && isRepliesOpened && (
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
    </div>
  );
}
