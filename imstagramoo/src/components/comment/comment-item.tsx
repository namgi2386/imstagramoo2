import { Link } from "react-router";
import defaultAvatar from "@/assets/default-profile.png";

export default function CommentItem() {
  return (
    <div className={"flex flex-col gap-8 border-b pb-5"}>
      <div className="flex items-start gap-4">
        <Link to={"#"}>
          <div className="flex h-full flex-col">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">nickname</div>
          <div>content</div>
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:underline">댓글</div>
              <div className="bg-border h-[13px] w-0.5"></div>
              <div>time</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:underline">수정</div>
              <div className="bg-border h-[13px] w-0.5"></div>
              <div className="cursor-pointer hover:underline">삭제</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
