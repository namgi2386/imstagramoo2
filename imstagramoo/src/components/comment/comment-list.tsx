import CommentItem from "@/components/comment/comment-item";
import Fallback from "@/components/fallback";
import Loader from "@/components/loader";
import { useRootCommentsData } from "@/hooks/queries/use-comments-data";

export default function CommentList({ postId }: { postId: number }) {
  const {
    data: rootComments,
    error: fetchCommentsError,
    isPending: isFetchCommentsPending,
  } = useRootCommentsData(postId);
  if (fetchCommentsError) return <Fallback />;
  if (isFetchCommentsPending) return <Loader />;
  return (
    <div className="flex flex-col gap-5">
      {rootComments.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
