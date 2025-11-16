import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { toast } from "sonner";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";
import { MAX_COMMENT_DEPTH } from "@/lib/constants";

type CreateMode = {
  type: "CREAT";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commetId: number;
  initialContent: string;
  onClose: () => void;
};

type ReplyMode = {
  type: "REPLY";
  postId: number;
  parentCommentId: number;
  rootCommentId: number;
  depth: number;
  path: string;
  onClose: () => void;
};

type Props = CreateMode | EditMode | ReplyMode;

export default function CommentEditor(props: Props) {
  const { mutate: createComment, isPending: isCreateCommentPending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
        if (props.type === "REPLY") props.onClose();
      },
      onError: (error) => {
        toast.error("댓글 추가에 실패했습니다", {
          position: "top-center",
        });
      },
    });
  const { mutate: updateComment, isPending: isUpdateCommentPending } =
    useUpdateComment({
      onSuccess: () => {
        (props as EditMode).onClose();
      },
      onError: (error) => {
        toast.error("댓글 수정에 실패했습니다", {
          position: "top-center",
        });
      },
    });
  const [content, setContent] = useState("");
  useEffect(() => {
    if (props.type === "EDIT") {
      setContent(props.initialContent);
    }
  }, []);
  const handleSubmitClick = () => {
    if (content.trim() === "") return;
    if (props.type === "CREAT") {
      createComment({ postId: props.postId, content });
    } else if (props.type === "REPLY") {
      if (!props.parentCommentId) return;
      const prevDepth = props.depth;
      const prevPath = props.path;
      let newDepth = 0;
      let newPath = "";
      if (prevDepth < MAX_COMMENT_DEPTH) {
        newDepth = prevDepth + 1;
      } else if (prevDepth === MAX_COMMENT_DEPTH) {
        newDepth = prevDepth;
      } else {
        toast.error(
          "대댓의 최대 깊이를 초과했습니다. 댓글 작성에 실패했습니다.",
          {
            position: "top-center",
          },
        );
        return;
      }
      if (prevPath === "") {
        newPath = props.parentCommentId.toString();
      } else {
        const pathline = prevPath.split(".");
        if (pathline.length < MAX_COMMENT_DEPTH) {
          newPath = prevPath + "." + props.parentCommentId.toString();
        } else if (pathline.length === MAX_COMMENT_DEPTH) {
          newPath = prevPath;
        } else {
          toast.error(
            "대댓의 최대 깊이를 초과했습니다. 댓글 작성에 실패했습니다.",
            {
              position: "top-center",
            },
          );
          return;
        }
      }

      createComment({
        postId: props.postId,
        content,
        parentCommentId: props.parentCommentId,
        rootCommentId: props.rootCommentId,
        depth: newDepth,
        path: newPath,
      });
    } else {
      updateComment({
        id: props.commetId,
        content,
      });
    }
  };
  const isPending = isCreateCommentPending || isUpdateCommentPending;
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        disabled={isPending}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        {(props.type === "EDIT" || props.type === "REPLY") && (
          <Button
            disabled={isPending}
            variant={"outline"}
            onClick={() => props.onClose()}
          >
            취소
          </Button>
        )}
        <Button disabled={isPending} onClick={handleSubmitClick}>
          작성
        </Button>
      </div>
    </div>
  );
}
