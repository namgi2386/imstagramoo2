import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { useOpenAlertModal } from "@/store/alert-modal";

import { PopoverClose } from "@radix-ui/react-popover";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CommentItemActionbutton({
  toggleIsEditing,
  commentId,
}: {
  toggleIsEditing: () => void;
  commentId: number;
}) {
  const [isEllipsisOpened, setIsEllipsisOpened] = useState(false);
  const openAlertModal = useOpenAlertModal();

  const { mutate: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment({
      onError: () => {
        toast.error("댓글 삭제에 문제가 생겼습니다.", {
          position: "top-center",
        });
      },
    });
  const handleDeleteClick = () => {
    openAlertModal({
      title: "댓글삭제",
      description: "되돌릴 수 없습니다.",
      onPositive: () => {
        deleteComment(commentId);
      },
    });
  };
  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical
          className="hover:bg-muted mr-4 h-4 cursor-pointer rounded-full select-none"
          onClick={() => setIsEllipsisOpened(!isEllipsisOpened)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-15 p-0">
        <PopoverClose key={`comment-action-button-edit`} asChild>
          <div
            onClick={toggleIsEditing}
            className="hover:bg-muted w-full cursor-pointer py-2 text-center"
          >
            수정
          </div>
        </PopoverClose>
        <PopoverClose key={`comment-action-button-delete`} asChild>
          <div
            onClick={handleDeleteClick}
            className="hover:bg-muted w-full cursor-pointer py-2 text-center"
          >
            삭제
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
