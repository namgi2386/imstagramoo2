import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { PopoverClose } from "@radix-ui/react-popover";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

export default function CommentItemActionbutton({
  toggleIsEditing,
  handleDeleteClick,
}: {
  toggleIsEditing: () => void;
  handleDeleteClick: () => void;
}) {
  const [isEllipsisOpened, setIsEllipsisOpened] = useState(false);
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
